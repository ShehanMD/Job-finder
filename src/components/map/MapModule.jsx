import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map-module.css";

const DEFAULT_CENTER = [7.8731, 80.7718]; // Sri Lanka
const DEFAULT_ZOOM = 7;
const DEFAULT_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

// Photon is a free-text, OSM-based geocoder with type-ahead support.
// Its public demo service is community-operated, so keep searches sensible.
const DEFAULT_GEOCODING_URL = "https://photon.komoot.io/api/";
const DEFAULT_REVERSE_GEOCODING_URL = "https://photon.komoot.io/reverse";
const EMPTY_OBJECT = Object.freeze({});
const EMPTY_ARRAY = Object.freeze([]);
const DEFAULT_LOCATE_OPTIONS = Object.freeze({ enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });

const isValidCoordinate = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  return Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180;
};

const normalizeLocation = (value) => {
  if (!value) return null;
  const lat = Number(value.lat ?? value.latitude);
  const lng = Number(value.lng ?? value.lon ?? value.longitude);
  if (!isValidCoordinate(lat, lng)) return null;
  return {
    ...value,
    lat,
    lng,
    label: value.label || value.name || value.address || "",
    address: value.address || "",
    source: value.source || "api"
  };
};

const uniqueParts = (parts) => [...new Set(parts.map((part) => String(part || "").trim()).filter(Boolean))];

const formatPhotonAddress = (properties = {}) => {
  const street = [properties.housenumber, properties.street].filter(Boolean).join(" ");
  const locality = properties.city || properties.town || properties.village || properties.municipality || properties.district;
  return uniqueParts([
    properties.name,
    street,
    locality,
    properties.county,
    properties.state,
    properties.country
  ]).join(", ");
};

const parsePhotonFeatures = (payload) => (payload?.features || []).map((feature) => {
  const [lng, lat] = feature?.geometry?.coordinates || [];
  const properties = feature?.properties || {};
  const address = formatPhotonAddress(properties);
  return {
    lat: Number(lat),
    lng: Number(lng),
    label: address || properties.name || "Unnamed place",
    address,
    source: "search",
    placeId: properties.osm_id ? `${properties.osm_type || "osm"}-${properties.osm_id}` : `${lat}-${lng}`,
    type: properties.osm_value || properties.type || "place",
    category: properties.osm_key || "place",
    properties
  };
}).filter((item) => isValidCoordinate(item.lat, item.lng));

const parseNominatimResults = (payload) => (Array.isArray(payload) ? payload : []).map((item) => ({
  lat: Number(item.lat),
  lng: Number(item.lon),
  label: item.display_name || "Unnamed place",
  address: item.display_name || "",
  source: "search",
  placeId: item.place_id,
  type: item.type,
  properties: item
})).filter((item) => isValidCoordinate(item.lat, item.lng));

const makeIcon = (className, html, size = [42, 48], anchor = [21, 44]) => L.divIcon({
  className: `rmap-div-icon ${className || ""}`,
  html,
  iconSize: size,
  iconAnchor: anchor,
  popupAnchor: [0, -anchor[1] + 4]
});

const DEFAULT_SELECTED_ICON = makeIcon(
  "rmap-selected-icon",
  '<span class="rmap-selected-pin"><span class="rmap-selected-pin-core"></span></span>'
);

const DEFAULT_CURRENT_ICON = makeIcon(
  "rmap-current-icon",
  '<span class="rmap-current-pulse"><span class="rmap-current-dot"></span></span>',
  [42, 42],
  [21, 21]
);

const DEFAULT_PREVIEW_ICON = makeIcon(
  "rmap-preview-icon",
  '<span class="rmap-preview-pin"><span></span></span>'
);

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * MapModule
 *
 * Modes:
 *   select - choose a location by tapping the map, dragging the selected pin,
 *            choosing a search result, or explicitly using the GPS position.
 *   view   - explore the map. Map taps and search previews never change the
 *            selected value and never call onConfirm/onLocationChange.
 *
 * Displays:
 *   inline  - normal React layout.
 *   overlay - modal map surface.
 *
 * `value` is controlled. `initialLocation` is used only as the initial value
 * when `value` is not supplied.
 */
const MapModule = forwardRef(function MapModule(
  {
    mode = "select",
    display = "inline",
    targetElement = null,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    initialLocation = null,
    value,
    onLocationChange,
    markers = EMPTY_ARRAY,
    height = 440,
    className = "",
    title = "Choose a location",
    confirmLabel = "Use this location",
    showSearch = true,
    showLocate = true,
    showZoom = true,
    showLayerControl = true,
    showScale = true,
    showCoordinates = true,
    showConfirm = true,
    showClear = true,
    showFullscreen = true,
    showFit = true,
    draggableMarker = true,
    clickToSelect = true,
    fitMarkersOnLoad = false,
    autoCloseOnConfirm = false,
    minZoom = 2,
    maxZoom = 19,
    zoom = DEFAULT_ZOOM,
    center = DEFAULT_CENTER,
    tileUrl = DEFAULT_TILE_URL,
    tileAttribution = DEFAULT_ATTRIBUTION,
    tileSubdomains = "abc",
    geocodingProvider = "photon",
    geocodingUrl = DEFAULT_GEOCODING_URL,
    reverseGeocodingUrl = DEFAULT_REVERSE_GEOCODING_URL,
    searchPlaceholder = "Search places, addresses, roads...",
    searchDebounce = 550,
    searchLimit = 7,
    searchLanguage = "en",
    searchCountryCodes = "",
    searchBias = true,
    locateOptions = DEFAULT_LOCATE_OPTIONS,
    circleRadius = 0,
    circleStyle = EMPTY_OBJECT,
    markerIcon,
    selectedLocationIcon,
    currentLocationIcon,
    searchPreviewIcon,
    currentLocationCircleStyle = EMPTY_OBJECT,
    onReady,
    onError,
    onSearchResults,
    onMarkerClick,
    onMapClick,
    onConfirm,
    onClear,
    onLocate,
    onMoveEnd,
    onSearchPreview,
    layers = null,
    children
  },
  forwardedRef
) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((next) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const currentValue = value !== undefined ? value : initialLocation;
  const [selected, setSelected] = useState(() => normalizeLocation(currentValue));
  const selectedRef = useRef(selected);
  const [currentLocation, setCurrentLocation] = useState(null);
  const currentLocationRef = useRef(null);
  const [searchPreview, setSearchPreview] = useState(null);

  const shellRef = useRef(null);
  const mapHostRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const currentAccuracyRef = useRef(null);
  const previewMarkerRef = useRef(null);
  const markerLayersRef = useRef([]);
  const searchAbortRef = useRef(null);
  const reverseAbortRef = useRef(null);
  const runtimeRef = useRef({});
  const callbacksRef = useRef({});

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const skipQueryRef = useRef(null);
  const debouncedQuery = useDebouncedValue(query, searchDebounce);
  const [results, setResults] = useState([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [addressBusy, setAddressBusy] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenFallback, setFullscreenFallback] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const centerPoint = useMemo(() => {
    const loc = normalizeLocation(currentValue);
    if (loc) return [loc.lat, loc.lng];
    if (Array.isArray(center) && center.length === 2) return center;
    return DEFAULT_CENTER;
  }, [currentValue, center]);

  callbacksRef.current = { onError, onLocate, onSearchResults, onMapClick, onSearchPreview, onMoveEnd };

  const reportError = useCallback((err) => {
    const message = typeof err === "string" ? err : (err?.message || "Something went wrong.");
    setError(message);
    callbacksRef.current.onError?.(err instanceof Error ? err : new Error(message));
  }, []);

  const emitLocation = useCallback((location) => {
    const normalized = normalizeLocation(location);
    selectedRef.current = normalized;
    setSelected(normalized);
    onLocationChange?.(normalized);
  }, [onLocationChange]);

  const reverseGeocode = useCallback(async (lat, lng, { showBusy = true, quiet = false } = {}) => {
    if (!reverseGeocodingUrl) return null;
    reverseAbortRef.current?.abort();
    const controller = new AbortController();
    reverseAbortRef.current = controller;
    if (showBusy) setAddressBusy(true);

    try {
      const url = new URL(reverseGeocodingUrl, window.location.origin);
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lng));

      if (geocodingProvider === "nominatim") {
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("zoom", "18");
      } else {
        if (searchLanguage) url.searchParams.set("lang", searchLanguage);
      }

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Address lookup failed (${response.status}).`);
      const data = await response.json();
      const address = geocodingProvider === "nominatim"
        ? (data.display_name || "")
        : formatPhotonAddress(data?.features?.[0]?.properties || {});

      return address;
    } catch (err) {
      if (err.name !== "AbortError" && !quiet) reportError(err);
      return null;
    } finally {
      if (!controller.signal.aborted && showBusy) setAddressBusy(false);
    }
  }, [reverseGeocodingUrl, geocodingProvider, searchLanguage, reportError]);

  const updateSelectedMarker = useCallback((location, { pan = false } = {}) => {
    const map = mapRef.current;
    const normalized = normalizeLocation(location);
    if (!map || !normalized) return;

    const latlng = [normalized.lat, normalized.lng];
    const icon = selectedLocationIcon || markerIcon || DEFAULT_SELECTED_ICON;

    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, {
        draggable: mode === "select" && draggableMarker,
        icon,
        keyboard: true,
        title: "Selected location",
        riseOnHover: true,
        autoPan: true
      }).addTo(map);

      markerRef.current.on("dragend", () => {
        const point = markerRef.current?.getLatLng();
        if (point) runtimeRef.current.selectPoint?.(point.lat, point.lng, "marker-drag");
      });
    } else {
      markerRef.current.setLatLng(latlng);
      markerRef.current.setIcon(icon);
      markerRef.current.dragging?.[mode === "select" && draggableMarker ? "enable" : "disable"]();
    }

    if (circleRadius > 0) {
      if (!circleRef.current) {
        circleRef.current = L.circle(latlng, {
          radius: circleRadius,
          color: "#00c49f",
          fillColor: "#00c49f",
          fillOpacity: 0.08,
          weight: 1,
          ...circleStyle
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(latlng);
        circleRef.current.setRadius(circleRadius);
        circleRef.current.setStyle({
          color: "#00c49f",
          fillColor: "#00c49f",
          fillOpacity: 0.08,
          weight: 1,
          ...circleStyle
        });
      }
    } else if (circleRef.current) {
      map.removeLayer(circleRef.current);
      circleRef.current = null;
    }

    if (pan) map.flyTo(latlng, Math.max(map.getZoom(), 14), { duration: 0.65 });
  }, [mode, draggableMarker, selectedLocationIcon, markerIcon, circleRadius, circleStyle]);

  const updateCurrentMarker = useCallback((location, { pan = false } = {}) => {
    const map = mapRef.current;
    const normalized = normalizeLocation(location);
    if (!normalized) return;

    currentLocationRef.current = normalized;
    setCurrentLocation((previous) => {
      if (previous && previous.lat === normalized.lat && previous.lng === normalized.lng &&
        previous.accuracy === normalized.accuracy && previous.address === normalized.address &&
        previous.label === normalized.label) return previous;
      return normalized;
    });

    if (!map) return;
    const latlng = [normalized.lat, normalized.lng];

    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.marker(latlng, {
        icon: currentLocationIcon || DEFAULT_CURRENT_ICON,
        keyboard: false,
        interactive: false,
        zIndexOffset: 1000,
        title: "Your current location"
      }).addTo(map);
    } else {
      currentMarkerRef.current.setLatLng(latlng);
      currentMarkerRef.current.setIcon(currentLocationIcon || DEFAULT_CURRENT_ICON);
    }

    const accuracy = Math.max(0, Number(normalized.accuracy) || 0);
    if (accuracy > 0) {
      if (!currentAccuracyRef.current) {
        currentAccuracyRef.current = L.circle(latlng, {
          radius: accuracy,
          color: "#25a9ff",
          weight: 1,
          opacity: 0.65,
          fillColor: "#25a9ff",
          fillOpacity: 0.11,
          interactive: false,
          ...currentLocationCircleStyle
        }).addTo(map);
      } else {
        currentAccuracyRef.current.setLatLng(latlng);
        currentAccuracyRef.current.setRadius(accuracy);
        currentAccuracyRef.current.setStyle({
          color: "#25a9ff",
          weight: 1,
          opacity: 0.65,
          fillColor: "#25a9ff",
          fillOpacity: 0.11,
          ...currentLocationCircleStyle
        });
      }
    } else if (currentAccuracyRef.current) {
      map.removeLayer(currentAccuracyRef.current);
      currentAccuracyRef.current = null;
    }

    if (pan) {
      const saved = selectedRef.current;
      if (saved && (Math.abs(saved.lat - normalized.lat) > 0.0001 || Math.abs(saved.lng - normalized.lng) > 0.0001)) {
        map.fitBounds([latlng, [saved.lat, saved.lng]], { padding: [68, 68], maxZoom: 15 });
      } else {
        map.flyTo(latlng, Math.max(map.getZoom(), 15), { duration: 0.8 });
      }
    }
  }, [currentLocationIcon, currentLocationCircleStyle]);

  const updatePreviewMarker = useCallback((location) => {
    const map = mapRef.current;
    const normalized = normalizeLocation(location);
    if (!map || !normalized) return;

    const latlng = [normalized.lat, normalized.lng];
    if (!previewMarkerRef.current) {
      previewMarkerRef.current = L.marker(latlng, {
        icon: searchPreviewIcon || DEFAULT_PREVIEW_ICON,
        keyboard: false,
        title: "Search result preview",
        riseOnHover: true
      }).addTo(map);
    } else {
      previewMarkerRef.current.setLatLng(latlng);
      previewMarkerRef.current.setIcon(searchPreviewIcon || DEFAULT_PREVIEW_ICON);
    }
    previewMarkerRef.current.bindPopup(document.createTextNode(normalized.label || "Search result"));
    map.flyTo(latlng, Math.max(map.getZoom(), 15), { duration: 0.7 });
  }, [searchPreviewIcon]);

  const selectPoint = useCallback(async (lat, lng, source = "map-click") => {
    if (mode !== "select" || !isValidCoordinate(lat, lng)) return;
    const next = { lat: Number(lat), lng: Number(lng), source };
    emitLocation(next);
    setSearchPreview(null);
    callbacksRef.current.onMapClick?.(next);

    const address = await reverseGeocode(next.lat, next.lng);
    if (address) emitLocation({ ...next, address, label: address });
  }, [mode, emitLocation, reverseGeocode]);

  // Keep callbacks used by Leaflet's long-lived event handlers fresh.
  runtimeRef.current = { mode, clickToSelect, selectPoint };

  // Synchronize controlled values, including an intentional null clear.
  useEffect(() => {
    if (value === undefined) return;
    const normalized = normalizeLocation(value);
    selectedRef.current = normalized;
    setSelected(normalized);
  }, [value]);

  // Create/destroy the Leaflet instance when its display surface is mounted.
  useEffect(() => {
    if (!isOpen && display === "overlay") return undefined;
    const host = mapHostRef.current;
    if (!host || mapRef.current) return undefined;

    const map = L.map(host, {
      zoomControl: showZoom,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      minZoom,
      maxZoom,
      preferCanvas: true,
      zoomSnap: 0.5
    }).setView(centerPoint, zoom);

    mapRef.current = map;
    if (showScale) L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const base = L.tileLayer(tileUrl, {
      attribution: tileAttribution,
      subdomains: tileSubdomains,
      maxZoom
    }).addTo(map);

    if (layers && typeof layers === "object") {
      const layerEntries = Object.entries(layers).filter(([, layer]) => layer);
      if (showLayerControl && layerEntries.length) {
        L.control.layers({ OpenStreetMap: base, ...Object.fromEntries(layerEntries) }, null, {
          collapsed: true,
          position: "topright"
        }).addTo(map);
      }
    }

    map.on("click", (event) => {
      const current = runtimeRef.current;
      if (current.mode === "select" && current.clickToSelect) {
        current.selectPoint?.(event.latlng.lat, event.latlng.lng, "map-click");
      }
    });
    map.on("moveend", () => callbacksRef.current.onMoveEnd?.(map.getCenter(), map.getZoom()));

    setMapReady(true);
    onReady?.(map);
    requestAnimationFrame(() => map.invalidateSize({ pan: false }));

    return () => {
      setMapReady(false);
      map.off();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
      currentMarkerRef.current = null;
      currentAccuracyRef.current = null;
      previewMarkerRef.current = null;
      markerLayersRef.current = [];
    };
    // Map construction is intentionally tied to the mounted display surface.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, display]);

  // Keep the selected point and its marker synchronized.
  useEffect(() => {
    if (!mapRef.current) return;
    if (selected) updateSelectedMarker(selected);
    else {
      if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
      if (circleRef.current) mapRef.current.removeLayer(circleRef.current);
      markerRef.current = null;
      circleRef.current = null;
    }
  }, [selected, updateSelectedMarker]);

  // Repaint the GPS marker after the map mounts or the position changes.
  useEffect(() => {
    if (mapRef.current && currentLocation) updateCurrentMarker(currentLocation);
  }, [currentLocation, updateCurrentMarker, mapReady]);

  // Search previews are independent from the selected location.
  useEffect(() => {
    if (!mapRef.current) return;
    if (searchPreview) updatePreviewMarker(searchPreview);
    else if (previewMarkerRef.current) {
      mapRef.current.removeLayer(previewMarkerRef.current);
      previewMarkerRef.current = null;
    }
  }, [searchPreview, updatePreviewMarker, mapReady]);

  // Update external marker layers without rebuilding the base map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerLayersRef.current.forEach((layer) => map.removeLayer(layer));
    markerLayersRef.current = [];

    const bounds = [];
    markers.forEach((item, index) => {
      const loc = normalizeLocation(item);
      if (!loc) return;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: item.icon || DEFAULT_SELECTED_ICON,
        title: item.title || loc.label || `Marker ${index + 1}`
      }).addTo(map);
      const popupContent = item.popup || item.title || loc.label;
      if (popupContent) marker.bindPopup(document.createTextNode(String(popupContent)));
      marker.on("click", () => onMarkerClick?.(item, index));
      markerLayersRef.current.push(marker);
      bounds.push([loc.lat, loc.lng]);
    });

    if (fitMarkersOnLoad && bounds.length) {
      map.fitBounds(bounds, { padding: [42, 42], maxZoom: 15 });
    }
  }, [markers, fitMarkersOnLoad, onMarkerClick, mapReady]);

  // Search: Photon supports free-text/type-ahead. Nominatim is retained as an
  // explicit compatibility option for users with their own compliant endpoint.
  useEffect(() => {
    const term = debouncedQuery.trim();
    if (term && skipQueryRef.current === term) {
      skipQueryRef.current = null;
      setResults([]);
      setSearchBusy(false);
      return undefined;
    }
    if (geocodingProvider === "nominatim" && term !== submittedQuery.trim()) {
      setResults([]);
      setSearchBusy(false);
      return undefined;
    }
    if (!term || term.length < 2 || !showSearch || !geocodingUrl) {
      setResults([]);
      setSearchBusy(false);
      return undefined;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    setSearchBusy(true);

    const run = async () => {
      try {
        const url = new URL(geocodingUrl, window.location.origin);
        url.searchParams.set("q", term);
        url.searchParams.set("limit", String(searchLimit));

        if (geocodingProvider === "nominatim") {
          url.searchParams.set("format", "jsonv2");
          url.searchParams.set("addressdetails", "1");
          if (searchCountryCodes) url.searchParams.set("countrycodes", searchCountryCodes);
        } else {
          if (searchLanguage) url.searchParams.set("lang", searchLanguage);
          if (searchBias) {
            const biasPoint = currentLocationRef.current || mapRef.current?.getCenter();
            if (biasPoint) {
              url.searchParams.set("lat", String(biasPoint.lat));
              url.searchParams.set("lon", String(biasPoint.lng));
            }
          }
        }

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error(`Place search failed (${response.status}).`);
        const data = await response.json();
        const found = geocodingProvider === "nominatim"
          ? parseNominatimResults(data)
          : parsePhotonFeatures(data);

        setResults(found);
        callbacksRef.current.onSearchResults?.(found);
      } catch (err) {
        if (err.name !== "AbortError") reportError(err);
      } finally {
        if (!controller.signal.aborted) setSearchBusy(false);
      }
    };

    run();
    return () => controller.abort();
  }, [
    debouncedQuery, submittedQuery, showSearch, geocodingUrl, geocodingProvider,
    searchLimit, searchLanguage, searchCountryCodes, searchBias,
    reportError
  ]);

  // Abort network requests when the component unmounts.
  useEffect(() => () => {
    searchAbortRef.current?.abort();
    reverseAbortRef.current?.abort();
  }, []);

  const setLocation = useCallback((location, options = {}) => {
    const normalized = normalizeLocation(location);
    if (!normalized) {
      reportError("Invalid location. Provide valid latitude and longitude.");
      return false;
    }
    emitLocation(normalized);
    setSearchPreview(null);
    if (mapRef.current) updateSelectedMarker(normalized, { pan: options.pan !== false });
    if (options.reverseGeocode) {
      reverseGeocode(normalized.lat, normalized.lng).then((address) => {
        if (address) emitLocation({ ...normalized, address, label: address });
      });
    }
    return true;
  }, [emitLocation, updateSelectedMarker, reverseGeocode, reportError]);

  const getLocation = useCallback(() => selectedRef.current, []);

  const clear = useCallback(() => {
    if (mode !== "select") return;
    emitLocation(null);
    setSearchPreview(null);
    if (markerRef.current && mapRef.current) mapRef.current.removeLayer(markerRef.current);
    if (circleRef.current && mapRef.current) mapRef.current.removeLayer(circleRef.current);
    markerRef.current = null;
    circleRef.current = null;
    onClear?.();
  }, [mode, emitLocation, onClear]);

  const locate = useCallback(({ pan = true, silent = false } = {}) => {
    if (!navigator.geolocation) {
      if (!silent) reportError("This browser does not support location services.");
      return;
    }

    setLocating(true);
    if (!silent) setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: "gps"
        };
        updateCurrentMarker(loc, { pan });
        callbacksRef.current.onLocate?.(loc);
        setLocating(false);

        const address = await reverseGeocode(loc.lat, loc.lng, { showBusy: false, quiet: true });
        if (address) updateCurrentMarker({ ...loc, address, label: address });
      },
      (err) => {
        setLocating(false);
        if (silent) return;
        const message = err.code === 1
          ? "Location permission was denied. Allow location access in your browser settings."
          : err.code === 2
            ? "Your current location is unavailable."
            : "Could not get your location. Please try again.";
        reportError(message);
      },
      locateOptions
    );
  }, [locateOptions, updateCurrentMarker, reverseGeocode, reportError]);

  const locateRef = useRef(locate);
  locateRef.current = locate;

  // Do not trigger a permission prompt automatically. If the browser already
  // reports permission as granted, quietly fetch and display the GPS marker.
  useEffect(() => {
    if (!isOpen && display === "overlay") return undefined;
    if (!navigator.geolocation || !navigator.permissions?.query) return undefined;

    let active = true;
    let permissionStatus;
    const handlePermissionChange = () => {
      if (active && permissionStatus?.state === "granted") {
        locateRef.current({ pan: true, silent: true });
      }
    };

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (!active) return;
      permissionStatus = status;
      if (status.state === "granted") locateRef.current({ pan: true, silent: true });
      status.addEventListener?.("change", handlePermissionChange);
    }).catch(() => {
      // Some browsers do not expose geolocation permission status.
    });

    return () => {
      active = false;
      permissionStatus?.removeEventListener?.("change", handlePermissionChange);
    };
  }, [isOpen, display]);

  const chooseCurrentLocation = useCallback(() => {
    if (mode !== "select" || !currentLocationRef.current) return;
    setLocation({ ...currentLocationRef.current, source: "gps-selection" }, { pan: false });
  }, [mode, setLocation]);

  const chooseSearchResult = useCallback((item) => {
    skipQueryRef.current = item.label.trim();
    setQuery(item.label);
    setResults([]);
    setError("");

    if (mode === "select") {
      setLocation(item, { pan: true });
      reverseGeocode(item.lat, item.lng).then((address) => {
        if (address) emitLocation({ ...item, address, label: address });
      });
      onMapClick?.(item);
    } else {
      // In view mode this is only a temporary preview, never a selection.
      setSearchPreview(item);
      callbacksRef.current.onSearchPreview?.(item);
      updatePreviewMarker(item);
    }
  }, [mode, setLocation, reverseGeocode, emitLocation, updatePreviewMarker]);

  const fitAll = useCallback(() => {
    const points = [];
    if (selectedRef.current) points.push([selectedRef.current.lat, selectedRef.current.lng]);
    if (currentLocationRef.current) points.push([currentLocationRef.current.lat, currentLocationRef.current.lng]);
    markers.forEach((item) => {
      const loc = normalizeLocation(item);
      if (loc) points.push([loc.lat, loc.lng]);
    });
    if (points.length === 1) mapRef.current?.setView(points[0], Math.max(zoom, 14));
    else if (points.length > 1) mapRef.current?.fitBounds(points, { padding: [48, 48], maxZoom: 16 });
  }, [markers, zoom]);

  const confirm = useCallback(() => {
    if (mode !== "select") return;
    const location = selectedRef.current;
    if (!location) {
      reportError("Choose a location on the map first.");
      return;
    }
    onConfirm?.(location);
    if (autoCloseOnConfirm) setOpen(false);
  }, [mode, onConfirm, autoCloseOnConfirm, setOpen, reportError]);

  const invalidateSize = useCallback(() => {
    requestAnimationFrame(() => mapRef.current?.invalidateSize({ pan: false }));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const element = shellRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else {
        setFullscreenFallback((previous) => !previous);
      }
    } catch {
      setFullscreenFallback((previous) => !previous);
    }
    window.setTimeout(() => mapRef.current?.invalidateSize({ pan: false }), 120);
  }, []);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === shellRef.current);
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && fullscreenFallback) setFullscreenFallback(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenFallback]);

  useEffect(() => {
    if (fullscreenFallback || isFullscreen) invalidateSize();
  }, [fullscreenFallback, isFullscreen, invalidateSize]);

  useImperativeHandle(forwardedRef, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setLocation,
    getLocation,
    getCurrentLocation: () => currentLocationRef.current,
    clear,
    locate,
    fitAll,
    invalidateSize,
    toggleFullscreen,
    getMap: () => mapRef.current,
    getBounds: () => mapRef.current?.getBounds() || null,
    getZoom: () => mapRef.current?.getZoom() ?? null,
    setZoom: (nextZoom) => mapRef.current?.setZoom(nextZoom),
    flyTo: (lat, lng, nextZoom = 15) => {
      if (isValidCoordinate(lat, lng)) {
        mapRef.current?.flyTo([Number(lat), Number(lng)], nextZoom, { duration: 0.7 });
      }
    },
    destroy: () => setOpen(false)
  }), [setOpen, setLocation, getLocation, clear, locate, fitAll, invalidateSize, toggleFullscreen]);

  const shellClasses = [
    "rmap-shell",
    display === "overlay" ? "rmap-overlay-shell" : "",
    isFullscreen || fullscreenFallback ? "rmap-is-fullscreen" : "",
    className
  ].filter(Boolean).join(" ");

  const surface = (
    <div ref={shellRef} className={shellClasses}>
      {display === "overlay" ? (
        <div className="rmap-overlay-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="rmap-dialog" role="dialog" aria-modal="true" aria-label={title}>
            <header className="rmap-header">
              <div className="rmap-heading">
                <span className="rmap-heading-kicker">INTERACTIVE MAP</span>
                <strong>{title}</strong>
                <span>{mode === "select" ? "Choose a point, then confirm your location" : "Explore places without changing your saved location"}</span>
              </div>
              <div className="rmap-header-actions">
                {showFullscreen && <button className="rmap-icon-button" type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>{isFullscreen ? "⤢" : "⛶"}</button>}
                <button className="rmap-icon-button rmap-close-button" type="button" onClick={() => setOpen(false)} aria-label="Close map" title="Close">×</button>
              </div>
            </header>
            {renderMapContent()}
          </section>
        </div>
      ) : renderMapContent()}
    </div>
  );

  function renderMapContent() {
    return (
      <>
        {showSearch && (
          <div className="rmap-search-wrap">
            <div className="rmap-search-box">
              <span className="rmap-search-icon" aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => { skipQueryRef.current = null; setQuery(event.target.value); setSubmittedQuery(""); setResults([]); }}
                placeholder={searchPlaceholder}
                aria-label="Search places and addresses"
                autoComplete="off"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setResults([]);
                  if (event.key === "Enter") {
                    if (results[0]) chooseSearchResult(results[0]);
                    else if (geocodingProvider === "nominatim") setSubmittedQuery(query.trim());
                  }
                }}
              />
              {searchBusy && <span className="rmap-spinner" aria-label="Searching" />}
              {query && <button className="rmap-search-clear" type="button" onClick={() => { skipQueryRef.current = null; setQuery(""); setSubmittedQuery(""); setResults([]); setSearchPreview(null); }} aria-label="Clear search">×</button>}
              <span className="rmap-search-shortcut">↵</span>
            </div>
            {results.length > 0 && (
              <ul className="rmap-results" role="listbox" aria-label="Search results">
                {results.map((item) => (
                  <li key={item.placeId || `${item.lat}-${item.lng}`}>
                    <button type="button" role="option" onClick={() => chooseSearchResult(item)}>
                      <span className="rmap-result-pin">⌖</span>
                      <span className="rmap-result-copy">
                        <strong>{item.label}</strong>
                        <small>{[item.category, item.type].filter(Boolean).join(" · ") || "Map result"}</small>
                      </span>
                      <span className="rmap-result-arrow">↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!searchBusy && query.trim().length >= 2 && results.length === 0 && (
              <div className="rmap-search-empty">No places found. Try a nearby town, road, landmark or full address.</div>
            )}
          </div>
        )}

        <div className="rmap-canvas-wrap" style={{ height: typeof height === "number" ? `${height}px` : height }}>
          <div className="rmap-canvas" ref={mapHostRef} />
          <div className="rmap-map-tools">
            {showLocate && (
              <button className={`rmap-map-control rmap-locate ${locating ? "is-loading" : ""}`} type="button" onClick={() => locate({ pan: true })} disabled={locating} title="Show my current location" aria-label="Show my current location">
                <span className="rmap-locate-glyph">◎</span>
                <span className="rmap-control-tooltip">My location</span>
              </button>
            )}
            {showFit && <button className="rmap-map-control" type="button" onClick={fitAll} title="Fit all markers" aria-label="Fit all markers"><span>⛶</span><span className="rmap-control-tooltip">Fit all</span></button>}
            {showFullscreen && display !== "overlay" && <button className="rmap-map-control" type="button" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen map"} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen map"}><span>{isFullscreen ? "⤢" : "⛶"}</span><span className="rmap-control-tooltip">{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span></button>}
          </div>
          {showCoordinates && selected && (
            <div className="rmap-coordinates">
              <span className="rmap-coordinate-label">SELECTED COORDINATES</span>
              <span>{selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}</span>
            </div>
          )}
          <div className="rmap-map-attribution">Map data © OpenStreetMap contributors</div>
        </div>

        <div className="rmap-footer">
          <div className="rmap-location-info">
            <span className={`rmap-location-symbol ${selected ? "is-selected" : ""}`}>{mode === "view" ? "⌖" : "＋"}</span>
            <div className="rmap-location-copy">
              <strong>{mode === "view"
                ? (searchPreview?.label || selected?.label || selected?.address || "Explore the map")
                : (selected?.label || selected?.address || (selected ? "Selected location" : "No location selected"))}</strong>
              <small>
                {addressBusy ? "Finding address…" : mode === "view"
                  ? (searchPreview ? "Search preview · your selected location has not changed" : selected ? `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}` : "Search or move around the map to explore")
                  : selected ? `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}` : "Tap the map, search a place, or use your location"}
              </small>
            </div>
          </div>
          <div className="rmap-actions">
            {mode === "select" && showClear && selected && <button className="rmap-button rmap-button-ghost" type="button" onClick={clear}>Clear</button>}
            {mode === "select" && currentLocation && <button className="rmap-button rmap-button-location" type="button" onClick={chooseCurrentLocation}>Use my location</button>}
            {mode === "select" && showConfirm && <button className="rmap-button rmap-button-primary" type="button" onClick={confirm}>{confirmLabel}<span>↗</span></button>}
            {mode === "view" && searchPreview && <button className="rmap-button rmap-button-ghost" type="button" onClick={() => setSearchPreview(null)}>Clear preview</button>}
          </div>
        </div>

        <div className="rmap-legend">
          <span><i className="rmap-legend-dot rmap-legend-current" />Your location</span>
          {selected && <span><i className="rmap-legend-dot rmap-legend-selected" />{mode === "view" ? "Saved location" : "Selected point"}</span>}
          {searchPreview && mode === "view" && <span><i className="rmap-legend-dot rmap-legend-preview" />Search preview</span>}
          <span className="rmap-provider-note">Search by OpenStreetMap data</span>
        </div>

        {error && <div className="rmap-error" role="alert"><span>ⓘ</span><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
        {children}
      </>
    );
  }

  if (display === "overlay") {
    if (!isOpen) return null;
    if (targetElement) return createPortal(surface, targetElement);
    return surface;
  }

  if (targetElement) return createPortal(surface, targetElement);
  return surface;
});

export default MapModule;
export { MapModule, normalizeLocation };
