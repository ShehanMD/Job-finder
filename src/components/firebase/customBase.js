import { fbc } from "./fbc"; 

/*
    ======================================================
     FIREBASE REST SERVICE
    ======================================================

     Features:

       Core
       ├── init()
       ├── configure()
       ├── getConfig()
       └── isInitialized()

       Auth
       ├── signUp()
       ├── signIn()
       ├── signInAnonymous()
       ├── signInWithIdp()
       ├── refresh()
       ├── signOut()
       ├── getIdToken()
       ├── currentUser()
       ├── isSignedIn()
       ├── getAccountInfo()
       ├── updateProfile()
       ├── changePassword()
       ├── deleteAccount()
       ├── sendPasswordReset()
       ├── sendEmailVerification()
       └── onChange()

       Database
       ├── get()
       ├── set()
       ├── update()
       ├── push()
       ├── remove()
       ├── exists()
       ├── query()
       ├── shallow()
       └── watch()

       Storage
       ├── upload()
       ├── metadata()
       ├── download()
       ├── getDownloadURL()
       ├── delete()
       └── list()

       Utility
       ├── request()
       ├── ready()
       └── getState()
    ======================================================
    */

export const customBase = (() => {

    "use strict";

    const config = {

        apiKey: null,

        authDomain: null,

        databaseURL: null,

        projectId: null,

        storageBucket: null,

        appId: null,

        persistence: "local",

        tokenRefreshBuffer:
            60 * 1000,

        timeout:
            30000
    };

    const state = {

        initialized: false,

        initializing: null,

        session: null,

        listeners: {

            authChanged:
                new Set()
        },

        readyPromise: null
    };

    const SESSION_KEY =
        "firebase-rest-session";

    class FirebaseRestError
        extends Error {

        constructor(
            message,
            details = {}
        ) {

            super(message);

            this.name =
                "FirebaseRestError";

            this.status =
                details.status ?? null;

            this.code =
                details.code ?? null;

            this.service =
                details.service ?? null;

            this.operation =
                details.operation ?? null;

            this.path =
                details.path ?? null;

            this.raw =
                details.raw ?? null;
        }
    }

    function getPersistenceStorage() {

        if (
            config.persistence ===
            "memory"
        ) {

            return null;
        }

        if (
            config.persistence ===
            "session"
        ) {

            return window.sessionStorage;
        }

        return window.localStorage;
    }

    function saveSession() {

        const storage =
            getPersistenceStorage();

        if (!storage) {
            return;
        }

        if (!state.session) {

            storage.removeItem(
                SESSION_KEY
            );

            return;
        }

        storage.setItem(
            SESSION_KEY,

            JSON.stringify(
                state.session
            )
        );
    }

    function loadSession() {

        const storage =
            getPersistenceStorage();

        if (!storage) {
            return null;
        }

        try {

            const raw =
                storage.getItem(
                    SESSION_KEY
                );

            if (!raw) {
                return null;
            }

            const session =
                JSON.parse(raw);

            if (
                !session ||
                typeof session !==
                "object"
            ) {

                return null;
            }

            return session;

        } catch (error) {

            console.warn(
                "Firebase REST: unable to restore session.",
                error
            );

            return null;
        }
    }

    function clearSession() {

        state.session =
            null;

        const storage =
            getPersistenceStorage();

        if (storage) {

            storage.removeItem(
                SESSION_KEY
            );
        }
    }

    function validateConfig() {

        if (
            !config.apiKey
        ) {

            throw new FirebaseRestError(
                "Firebase REST: apiKey is missing."
            );
        }

        if (
            !config.databaseURL
        ) {

            console.warn(
                "Firebase REST: databaseURL is not configured. " +
                "Realtime Database methods will not be available."
            );
        }

        if (
            !config.storageBucket
        ) {

            console.warn(
                "Firebase REST: storageBucket is not configured. " +
                "Storage methods will not be available."
            );
        }
    }

    function requireDatabase() {

        if (
            !config.databaseURL
        ) {

            throw new FirebaseRestError(
                "Firebase Realtime Database is not configured."
            );
        }
    }

    function requireStorage() {

        if (
            !config.storageBucket
        ) {

            throw new FirebaseRestError(
                "Firebase Storage bucket is not configured."
            );
        }
    }

    function trimSlashes(
        value
    ) {

        return String(
            value
        )
            .replace(
                /^\/+/,
                ""
            )
            .replace(
                /\/+$/,
                ""
            );
    }

    function databaseURL(
        path = ""
    ) {

        requireDatabase();

        const base =
            config.databaseURL
                .replace(
                    /\/+$/,
                    ""
                );

        const cleanPath =
            trimSlashes(
                path
            );

        return cleanPath

            ? `${base}/${encodePath(cleanPath)}.json`

            : `${base}.json`;
    }

    function encodePath(
        path
    ) {

        return String(
            path
        )
            .split("/")
            .map(
                segment =>
                    encodeURIComponent(
                        segment
                    )
            )
            .join("/");
    }

    function storageObjectURL(
        path
    ) {

        requireStorage();

        return (
            "https://firebasestorage.googleapis.com/v0/b/" +
            encodeURIComponent(
                config.storageBucket
            ) +
            "/o/" +
            encodeURIComponent(
                trimSlashes(path)
            )
        );
    }

    function appendQuery(
        url,
        params = {}
    ) {

        const query =
            new URLSearchParams();

        for (
            const [
                key,
                value
            ]
            of Object.entries(
                params
            )
        ) {

            if (
                value === undefined ||
                value === null
            ) {
                continue;
            }

            let finalValue =
                value;

            if (
                [
                    "orderBy",
                    "equalTo",
                    "startAt",
                    "endAt"
                ].includes(key)
            ) {

                if (
                    typeof value ===
                    "string" &&
                    !(
                        value.startsWith("\"") &&
                        value.endsWith("\"")
                    )
                ) {

                    finalValue =
                        JSON.stringify(
                            value
                        );
                }
            }

            query.set(
                key,
                String(
                    finalValue
                )
            );
        }

        const queryString =
            query.toString();

        return queryString
            ? `${url}?${queryString}`
            : url;
    }

    function sessionExpiredSoon() {

        if (
            !state.session
        ) {
            return true;
        }

        return (
            Date.now() +
            config.tokenRefreshBuffer
        ) >=
            state.session.expiresAt;
    }

    function emitAuthChange() {

        const user =
            currentUser();

        for (
            const callback
            of state.listeners.authChanged
        ) {

            try {

                callback(
                    user
                );

            } catch (error) {

                console.error(
                    "Firebase REST auth listener error:",
                    error
                );
            }
        }
    }

    function createSession(
        authResult
    ) {

        const expiresIn =
            Number(
                authResult.expiresIn ||
                3600
            );

        state.session = {

            idToken:
                authResult.idToken,

            refreshToken:
                authResult.refreshToken ||
                null,

            uid:
                authResult.localId ||
                authResult.userId ||
                null,

            email:
                authResult.email ||
                null,

            expiresAt:
                Date.now() +
                (
                    expiresIn *
                    1000
                )
        };

        saveSession();

        emitAuthChange();

        return state.session;
    }

    async function refresh() {

        if (
            !state.session ||
            !state.session.refreshToken
        ) {

            return null;
        }

        const response =
            await fetch(
                "https://securetoken.googleapis.com/v1/token" +
                `?key=${encodeURIComponent(
                    config.apiKey
                )}`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        new URLSearchParams({

                            grant_type:
                                "refresh_token",

                            refresh_token:
                                state.session.refreshToken

                        })
                }
            );

        const data =
            await parseResponse(
                response
            );

        if (
            !response.ok
        ) {

            clearSession();

            emitAuthChange();

            throw new FirebaseRestError(
                getFirebaseErrorMessage(
                    data,
                    "Token refresh failed."
                ),
                {

                    status:
                        response.status,

                    code:
                        data?.error?.message,

                    service:
                        "auth",

                    operation:
                        "refresh",

                    raw:
                        data
                }
            );
        }

        state.session.idToken =
            data.id_token;

        state.session.refreshToken =
            data.refresh_token ||
            state.session.refreshToken;

        state.session.uid =
            data.user_id ||
            state.session.uid;

        state.session.expiresAt =
            Date.now() +
            (
                Number(
                    data.expires_in ||
                    3600
                ) * 1000
            );

        saveSession();

        emitAuthChange();

        return {
            ...state.session
        };
    }

    async function getIdToken(
        forceRefresh = false
    ) {

        if (
            !state.session
        ) {

            return null;
        }

        if (
            forceRefresh ||
            sessionExpiredSoon()
        ) {

            await refresh();
        }

        return state.session
            ?.idToken ||
            null;
    }

    function currentUser() {

        if (
            !state.session ||
            !state.session.uid
        ) {

            return null;
        }

        return {

            uid:
                state.session.uid,

            email:
                state.session.email
        };
    }

    function isSignedIn() {

        return !!(
            state.session &&
            state.session.uid
        );
    }

    async function parseResponse(
        response
    ) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        if (
            response.status ===
            204
        ) {

            return null;
        }

        try {

            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                return await response.json();
            }

            const text =
                await response.text();

            try {

                return JSON.parse(
                    text
                );

            } catch (_) {

                return text;
            }

        } catch (_) {

            return null;
        }
    }

    function getFirebaseEsrrorMessage(
        data,
        fallback
    ) {

        return (
            data?.error?.message ||
            data?.error?.errors?.[0]?.message ||
            data?.message ||
            fallback
        );
    }

    async function getFirebaseErrorMessage(error) {

        console.error("Firebase error:", error);        

        function extractCode(error) {
            
            const values = [
                error.code,
                error.error?.message,
                error.error?.error?.message,
                error.message,
                error.status,
                error.name,
                error.error
            ];

            for (const value of values) {

                if (value === undefined || value === null) {
                    continue;
                }

                const text = String(value).trim();

                if (!text) {
                    continue;
                }

                if (text.includes("/")) {
                    return text
                        .split("/")
                        .pop()
                        .replace(/-/g, "_")
                        .replace(/\s+/g, "_")
                        .toUpperCase();
                }

                return text
                    .replace(/-/g, "_")
                    .replace(/\s+/g, "_")
                    .toUpperCase();
            }

            return "";
        }

        const code = extractCode(error);

        function detectService(error, code) {
            
            const raw = [
                error?.code,
                error?.message,
                error?.error?.message,
                code
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (
                raw.includes("auth/") ||
                [
                    "EMAIL_EXISTS",
                    "EMAIL_NOT_FOUND",
                    "INVALID_PASSWORD",
                    "INVALID_LOGIN_CREDENTIALS",
                    "INVALID_EMAIL",
                    "USER_DISABLED",
                    "WEAK_PASSWORD",
                    "INVALID_ID_TOKEN",
                    "EXPIRED_ID_TOKEN",
                    "TOKEN_EXPIRED",
                    "USER_NOT_FOUND",
                    "INVALID_CUSTOM_TOKEN",
                    "CREDENTIAL_MISMATCH",
                    "INVALID_IDP_RESPONSE",
                    "OPERATION_NOT_ALLOWED",
                    "TOO_MANY_ATTEMPTS_TRY_LATER",
                    "CREDENTIAL_TOO_OLD_LOGIN_AGAIN",
                    "EXPIRED_OOB_CODE",
                    "INVALID_OOB_CODE"
                ].includes(code)
            ) {
                return "auth";
            }

            if (
                raw.includes("storage/") ||
                [
                    "OBJECT_NOT_FOUND",
                    "BUCKET_NOT_FOUND",
                    "PROJECT_NOT_FOUND",
                    "QUOTA_EXCEEDED",
                    "UNAUTHENTICATED",
                    "UNAUTHORIZED",
                    "RETRY_LIMIT_EXCEEDED",
                    "INVALID_CHECKSUM",
                    "CANCELED",
                    "INVALID_URL",
                    "INVALID_ARGUMENT",
                    "NO_DEFAULT_BUCKET"
                ].includes(code)
            ) {
                return "storage";
            }

            if (
                [
                    "PERMISSION_DENIED",
                    "NOT_FOUND",
                    "PRECONDITION_FAILED",
                    "AUTHENTICATION_REQUIRED"
                ].includes(code)
            ) {
                return "database";
            }

            return "firebase";
        }

        const service = detectService(error, code);

        const authErrors = {

            EMAIL_EXISTS: {
                title: "Email Already Registered",
                description: "An account with this email address already exists. Try signing in instead.",
                type: "warning",
                icon: "fa-solid fa-user-check"
            },

            EMAIL_NOT_FOUND: {
                title: "Account Not Found",
                description: "We couldn't find an account with this email address. Please check the email or create a new account.",
                type: "warning",
                icon: "fa-solid fa-user-slash"
            },

            USER_NOT_FOUND: {
                title: "Account Not Found",
                description: "This user account could not be found. It may have been deleted or is no longer available.",
                type: "warning",
                icon: "fa-solid fa-user-slash"
            },

            INVALID_PASSWORD: {
                title: "Incorrect Password",
                description: "The password you entered is incorrect. Please check it and try again.",
                type: "warning",
                icon: "fa-solid fa-lock"
            },

            INVALID_LOGIN_CREDENTIALS: {
                title: "Sign-In Failed",
                description: "The email or password is incorrect. Please check your login details and try again.",
                type: "warning",
                icon: "fa-solid fa-right-to-bracket"
            },

            INVALID_CREDENTIALS: {
                title: "Invalid Login Details",
                description: "The credentials provided could not be verified. Please check your information and try again.",
                type: "warning",
                icon: "fa-solid fa-key"
            },

            INVALID_EMAIL: {
                title: "Invalid Email",
                description: "Please enter a valid email address and try again.",
                type: "warning",
                icon: "fa-solid fa-envelope"
            },

            USER_DISABLED: {
                title: "Account Disabled",
                description: "This account has been disabled. Please contact support if you believe this is a mistake.",
                type: "danger",
                icon: "fa-solid fa-user-lock"
            },

            WEAK_PASSWORD: {
                title: "Password Too Weak",
                description: "Your password does not meet the minimum security requirements. Please choose a stronger password.",
                type: "warning",
                icon: "fa-solid fa-shield-halved"
            },

            OPERATION_NOT_ALLOWED: {
                title: "Action Not Available",
                description: "This sign-in or authentication method is currently disabled for this application.",
                type: "danger",
                icon: "fa-solid fa-ban"
            },

            INVALID_ID_TOKEN: {
                title: "Session Expired",
                description: "Your login session is no longer valid. Please sign in again to continue.",
                type: "warning",
                icon: "fa-solid fa-clock-rotate-left"
            },

            EXPIRED_ID_TOKEN: {
                title: "Session Expired",
                description: "Your login session has expired. Please sign in again to continue.",
                type: "warning",
                icon: "fa-solid fa-clock-rotate-left"
            },

            TOKEN_EXPIRED: {
                title: "Session Expired",
                description: "Your login session has expired. Please sign in again to continue.",
                type: "warning",
                icon: "fa-solid fa-clock-rotate-left"
            },

            INVALID_REFRESH_TOKEN: {
                title: "Session Refresh Failed",
                description: "We couldn't refresh your login session. Please sign in again.",
                type: "warning",
                icon: "fa-solid fa-arrows-rotate"
            },

            MISSING_REFRESH_TOKEN: {
                title: "Session Information Missing",
                description: "Your login session information is incomplete. Please sign in again.",
                type: "warning",
                icon: "fa-solid fa-key"
            },

            CREDENTIAL_TOO_OLD_LOGIN_AGAIN: {
                title: "Please Sign In Again",
                description: "For your security, this action requires a recent login. Please sign in again and retry.",
                type: "warning",
                icon: "fa-solid fa-user-clock"
            },

            INVALID_CUSTOM_TOKEN: {
                title: "Invalid Authentication Token",
                description: "The authentication token could not be verified. Please sign in again.",
                type: "danger",
                icon: "fa-solid fa-key"
            },

            CREDENTIAL_MISMATCH: {
                title: "Authentication Configuration Error",
                description: "The authentication credential belongs to a different Firebase project.",
                type: "danger",
                icon: "fa-solid fa-link-slash"
            },

            INVALID_IDP_RESPONSE: {
                title: "Google Sign-In Failed",
                description: "The identity provider returned an invalid or expired response. Please try signing in again.",
                type: "warning",
                icon: "fa-brands fa-google"
            },

            INVALID_OAUTH_CLIENT_ID: {
                title: "Google Sign-In Configuration Error",
                description: "The OAuth client configuration is invalid. Please contact the site administrator.",
                type: "danger",
                icon: "fa-brands fa-google"
            },

            INVALID_OAUTH_PROVIDER: {
                title: "Sign-In Provider Error",
                description: "This authentication provider is not configured correctly.",
                type: "danger",
                icon: "fa-solid fa-plug-circle-xmark"
            },

            INVALID_ORIGIN: {
                title: "Unauthorized Website",
                description: "This website is not authorized to use the configured Firebase authentication service.",
                type: "danger",
                icon: "fa-solid fa-globe"
            },

            INVALID_PHONE_NUMBER: {
                title: "Invalid Phone Number",
                description: "Please check the phone number and enter it in a valid format.",
                type: "warning",
                icon: "fa-solid fa-phone"
            },

            INVALID_ACTION_CODE: {
                title: "Invalid Verification Link",
                description: "This verification or password-reset link is invalid or cannot be used.",
                type: "warning",
                icon: "fa-solid fa-link-slash"
            },

            INVALID_OOB_CODE: {
                title: "Invalid Action Link",
                description: "This email action link is invalid, expired, or has already been used.",
                type: "warning",
                icon: "fa-solid fa-link-slash"
            },

            EXPIRED_OOB_CODE: {
                title: "Link Expired",
                description: "This email action link has expired. Please request a new verification or password-reset email.",
                type: "warning",
                icon: "fa-solid fa-clock"
            },

            TOO_MANY_ATTEMPTS_TRY_LATER: {
                title: "Too Many Attempts",
                description: "We've temporarily limited requests from this device because of unusual activity. Please wait a little while and try again.",
                type: "warning",
                icon: "fa-solid fa-hourglass-half"
            },

            TOO_MANY_REQUESTS: {
                title: "Too Many Requests",
                description: "There have been too many requests in a short period. Please wait a moment before trying again.",
                type: "warning",
                icon: "fa-solid fa-hourglass-half"
            },

            API_KEY_INVALID: {
                title: "Firebase Configuration Error",
                description: "The Firebase API configuration is invalid. Please contact the site administrator.",
                type: "danger",
                icon: "fa-solid fa-gears"
            },

            PROJECT_NUMBER_MISMATCH: {
                title: "Firebase Project Mismatch",
                description: "The authentication token belongs to a different Firebase project.",
                type: "danger",
                icon: "fa-solid fa-diagram-project"
            }
        };

        const databaseErrors = {

            PERMISSION_DENIED: {
                title: "Access Denied",
                description: "You don't have permission to access or modify this data.",
                type: "danger",
                icon: "fa-solid fa-lock"
            },

            AUTHENTICATION_REQUIRED: {
                title: "Login Required",
                description: "You need to be signed in to perform this action.",
                type: "warning",
                icon: "fa-solid fa-right-to-bracket"
            },

            NOT_FOUND: {
                title: "Data Not Found",
                description: "The requested data could not be found.",
                type: "warning",
                icon: "fa-solid fa-database"
            },

            PRECONDITION_FAILED: {
                title: "Data Changed",
                description: "The data was changed before your request could be completed. Please try again.",
                type: "warning",
                icon: "fa-solid fa-code-branch"
            },

            INVALID_DATA: {
                title: "Invalid Data",
                description: "The data sent to Firebase could not be accepted. Please check the information and try again.",
                type: "warning",
                icon: "fa-solid fa-database"
            },

            INVALID_PATH: {
                title: "Invalid Data Path",
                description: "The requested Firebase data path is invalid.",
                type: "danger",
                icon: "fa-solid fa-route"
            },

            INDEX_NOT_DEFINED: {
                title: "Database Query Error",
                description: "This query requires a database index that has not been configured.",
                type: "danger",
                icon: "fa-solid fa-list-ol"
            }
        };

        const storageErrors = {

            OBJECT_NOT_FOUND: {
                title: "File Not Found",
                description: "The requested file could not be found in storage.",
                type: "warning",
                icon: "fa-solid fa-file-circle-xmark"
            },

            BUCKET_NOT_FOUND: {
                title: "Storage Not Available",
                description: "The Firebase Storage bucket could not be found or is not configured correctly.",
                type: "danger",
                icon: "fa-solid fa-box-archive"
            },

            PROJECT_NOT_FOUND: {
                title: "Firebase Project Not Found",
                description: "The Firebase project associated with storage could not be found.",
                type: "danger",
                icon: "fa-solid fa-diagram-project"
            },

            QUOTA_EXCEEDED: {
                title: "Storage Limit Reached",
                description: "The storage quota has been exceeded. Please try again later or contact the site administrator.",
                type: "danger",
                icon: "fa-solid fa-hard-drive"
            },

            UNAUTHENTICATED: {
                title: "Login Required",
                description: "You need to be signed in before you can access this file.",
                type: "warning",
                icon: "fa-solid fa-user-lock"
            },

            UNAUTHORIZED: {
                title: "File Access Denied",
                description: "You don't have permission to access this file.",
                type: "danger",
                icon: "fa-solid fa-lock"
            },

            RETRY_LIMIT_EXCEEDED: {
                title: "Transfer Timed Out",
                description: "The file operation took too long to complete. Please check your connection and try again.",
                type: "warning",
                icon: "fa-solid fa-clock"
            },

            INVALID_CHECKSUM: {
                title: "File Verification Failed",
                description: "The uploaded file could not be verified correctly. Please try uploading it again.",
                type: "warning",
                icon: "fa-solid fa-file-circle-exclamation"
            },

            CANCELED: {
                title: "Upload Cancelled",
                description: "The file operation was cancelled before it finished.",
                type: "info",
                icon: "fa-solid fa-ban"
            },

            INVALID_URL: {
                title: "Invalid File URL",
                description: "The provided storage URL is not valid.",
                type: "warning",
                icon: "fa-solid fa-link"
            },

            INVALID_ARGUMENT: {
                title: "Invalid File",
                description: "The file or data provided is not in a supported format.",
                type: "warning",
                icon: "fa-solid fa-file-circle-exclamation"
            },

            NO_DEFAULT_BUCKET: {
                title: "Storage Configuration Missing",
                description: "No default Firebase Storage bucket has been configured for this project.",
                type: "danger",
                icon: "fa-solid fa-bucket"
            },

            CANNOT_SLICE_BLOB: {
                title: "File Changed",
                description: "The local file changed while it was being uploaded. Please select the file again and retry.",
                type: "warning",
                icon: "fa-solid fa-file-pen"
            },

            SERVER_FILE_WRONG_SIZE: {
                title: "File Transfer Error",
                description: "The uploaded file size did not match the file received by the server. Please try again.",
                type: "warning",
                icon: "fa-solid fa-file-arrow-up"
            },

            UNKNOWN: {
                title: "Storage Error",
                description: "An unexpected file storage error occurred. Please try again.",
                type: "danger",
                icon: "fa-solid fa-cloud"
            }
        };

        const httpErrors = {

            "400": {
                title: "Invalid Request",
                description: "Firebase could not understand the request. Please check the data being sent.",
                type: "warning",
                icon: "fa-solid fa-circle-exclamation"
            },

            "401": {
                title: "Authentication Required",
                description: "Your login session is missing, invalid, or expired. Please sign in again.",
                type: "warning",
                icon: "fa-solid fa-user-lock"
            },

            "403": {
                title: "Access Denied",
                description: "Firebase rejected this request because you don't have permission to perform the operation.",
                type: "danger",
                icon: "fa-solid fa-shield-halved"
            },

            "404": {
                title: "Resource Not Found",
                description: "The requested Firebase resource could not be found.",
                type: "warning",
                icon: "fa-solid fa-magnifying-glass"
            },

            "409": {
                title: "Request Conflict",
                description: "The request conflicts with the current state of the data. Please try again.",
                type: "warning",
                icon: "fa-solid fa-code-merge"
            },

            "412": {
                title: "Data Changed",
                description: "The data changed before your request completed. Please try again.",
                type: "warning",
                icon: "fa-solid fa-code-branch"
            },

            "429": {
                title: "Too Many Requests",
                description: "Too many requests were sent in a short period. Please wait and try again.",
                type: "warning",
                icon: "fa-solid fa-hourglass-half"
            },

            "500": {
                title: "Firebase Server Error",
                description: "Firebase encountered an internal server error. Please try again shortly.",
                type: "danger",
                icon: "fa-solid fa-server"
            },

            "502": {
                title: "Server Connection Error",
                description: "The Firebase service could not be reached correctly. Please try again.",
                type: "danger",
                icon: "fa-solid fa-server"
            },

            "503": {
                title: "Firebase Temporarily Unavailable",
                description: "The Firebase service is temporarily unavailable. Please try again in a moment.",
                type: "warning",
                icon: "fa-solid fa-cloud-arrow-down"
            }
        };

        let result = null;

        if (service === "auth") {
            result = authErrors[code];
        }

        if (service === "database") {
            result = databaseErrors[code];
        }

        if (service === "storage") {
            result = storageErrors[code];
        }

        if (!result && httpErrors[String(error.code)]) {
            result = httpErrors[String(error.code)];
        }

        const rawMessage = String(
            error.message ||
            error.error?.message ||
            ""
        ).toLowerCase();

        if (
            !result &&
            (
                code === "NETWORK_ERROR" ||
                code === "FAILED" ||
                rawMessage.includes("failed to fetch") ||
                rawMessage.includes("networkerror") ||
                rawMessage.includes("network error") ||
                rawMessage.includes("fetch failed") ||
                rawMessage.includes("load failed")
            )
        ) {
            result = {
                title: "Connection Problem",
                description: "We couldn't connect to Firebase. Please check your internet connection and try again.",
                type: "warning",
                icon: "fa-solid fa-wifi"
            };
        }

        if (!result) {

            result = {
                title: service === "auth"
                    ? "Authentication Error"
                    : service === "database"
                        ? "Database Error"
                        : service === "storage"
                            ? "Storage Error"
                            : "Firebase Error",

                description:
                    error.message ||
                    error.error?.message ||
                    "An unexpected Firebase error occurred. Please try again.",

                type: "danger",

                icon: "fa-solid fa-cloud-bolt"
            };
        }

        
        return {
            code,
            service,
            title: result.title,
            description: result.description,
            type: result.type,
            icon: result.icon,
            originalError: error
        };
    }

    async function request(
        options = {}
    ) {

        const {

            url,

            method = "GET",

            body = undefined,

            headers = {},

            service = "firebase",

            operation = "request",

            path = null,

            authenticated = false,

            retryOnAuthFailure = true,

            query = null,

            timeout = config.timeout

        } = options;

        let finalURL =
            query
                ? appendQuery(
                    url,
                    query
                )
                : url;

        let requestHeaders = {
            ...headers
        };

        if (
            authenticated
        ) {

            const token =
                await getIdToken();

            if (token) {

                if (
                    service === "database"
                ) {

                    finalURL =
                        appendQuery(
                            finalURL,
                            {
                                auth:
                                    token
                            }
                        );

                } else {

                    requestHeaders = {

                        ...requestHeaders,

                        Authorization:
                            `Bearer ${token}`
                    };
                }
            }
        }

        const controller =
            new AbortController();

        const timer =
            setTimeout(
                () => {

                    controller.abort();

                },
                timeout
            );

        let response;

        try {

            response =
                await fetch(
                    finalURL,
                    {

                        method,

                        headers: {

                            ...requestHeaders
                        },

                        body,

                        signal:
                            controller.signal
                    }
                );

        } catch (error) {

            clearTimeout(
                timer
            );

            if (
                error.name ===
                "AbortError"
            ) {

                throw new FirebaseRestError(
                    `${service} ${operation} timed out.`,
                    {

                        service,

                        operation,

                        path
                    }
                );
            }

            throw new FirebaseRestError(
                `${service} ${operation} network error.`,
                {

                    service,

                    operation,

                    path,

                    raw:
                        error
                }
            );

        } finally {

            clearTimeout(
                timer
            );
        }

        const data =
            await parseResponse(
                response
            );

        if (
            response.status === 401 &&
            authenticated &&
            retryOnAuthFailure &&
            state.session &&
            state.session.refreshToken
        ) {

            try {

                await refresh();

                return await request({

                    ...options,

                    retryOnAuthFailure:
                        false

                });

            } catch (refreshError) {

                throw refreshError;
            }
        }

        if (
            !response.ok
        ) {

            throw new FirebaseRestError(
                getFirebaseErrorMessage(
                    data,
                    `${service} ${operation} failed.`
                ),
                {

                    status:
                        response.status,

                    code:
                        data?.error?.message,

                    service,

                    operation,

                    path,

                    raw:
                        data
                }
            );
        }

        return data;
    }

    async function authRequest(
        endpoint,
        body,
        operation
    ) {

        const url =
            `https://identitytoolkit.googleapis.com/v1/${endpoint}` +
            `?key=${encodeURIComponent(
                config.apiKey
            )}`;

        return request({

            url,

            method:
                "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(
                    body
                ),

            service:
                "auth",

            operation
        });
    }

    async function signUp(
        email,
        password
    ) {

        const result =
            await authRequest(

                "accounts:signUp",

                {

                    email,

                    password,

                    returnSecureToken:
                        true
                },

                "signUp"
            );

        createSession(
            result
        );

        return getAccountInfo();
    }

    async function signIn(
        email,
        password
    ) {

        const result =
            await authRequest(

                "accounts:signInWithPassword",

                {

                    email,

                    password,

                    returnSecureToken:
                        true
                },

                "signIn"
            );

        createSession(
            result
        );

        return getAccountInfo();
    }

    async function signInAnonymous() {

        const result =
            await authRequest(

                "accounts:signUp",

                {

                    returnSecureToken:
                        true
                },

                "signInAnonymous"
            );

        createSession(
            result
        );

        return getAccountInfo();
    }

    async function signInWithIdp(
        options
    ) {

        if (
            !options ||
            !options.providerId
        ) {

            throw new FirebaseRestError(
                "signInWithIdp(): providerId is required."
            );
        }

        const postParts = [];

        if (
            options.idToken
        ) {

            postParts.push(
                "id_token=" +
                encodeURIComponent(
                    options.idToken
                )
            );
        }

        if (
            options.accessToken
        ) {

            postParts.push(
                "access_token=" +
                encodeURIComponent(
                    options.accessToken
                )
            );
        }

        if (
            options.oauthToken
        ) {

            postParts.push(
                "oauth_token=" +
                encodeURIComponent(
                    options.oauthToken
                )
            );
        }

        if (
            options.oauthTokenSecret
        ) {

            postParts.push(
                "oauth_token_secret=" +
                encodeURIComponent(
                    options.oauthTokenSecret
                )
            );
        }

        postParts.push(
            "providerId=" +
            encodeURIComponent(
                options.providerId
            )
        );

        if (
            postParts.length < 2
        ) {

            throw new FirebaseRestError(
                "signInWithIdp(): OAuth credential is missing."
            );
        }

        const result =
            await authRequest(

                "accounts:signInWithIdp",

                {

                    postBody:
                        postParts.join("&"),

                    requestUri:
                        options.requestUri ||
                        location.origin,

                    returnSecureToken:
                        true,

                    returnIdpCredential:
                        true
                },

                "signInWithIdp"
            );

        createSession(
            result
        );

        return getAccountInfo();
    }

    const GOOGLE_CLIENT_ID = "271077040403-0p5il6ao3t2ib8q409pekdb3jljtjp3k.apps.googleusercontent.com";

    let googleScriptPromise = null;
    let googleTokenClient = null;

    function loadGoogleIdentityServices() {

        if (window.google?.accounts?.oauth2) {
            return Promise.resolve();
        }

        if (googleScriptPromise) {
            return googleScriptPromise;
        }

        googleScriptPromise = new Promise((resolve, reject) => {

            const existing = document.querySelector(
                'script[src="https://accounts.google.com/gsi/client"]'
            );

            if (existing) {
                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", () => {
                    reject(new Error("Failed to load Google Identity Services."));
                }, { once: true });
                return;
            }

            const script = document.createElement("script");

            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;

            script.onload = () => {

                if (window.google?.accounts?.oauth2) {
                    resolve();
                } else {
                    reject(
                        new Error("Google Identity Services loaded incorrectly.")
                    );
                }
            };

            script.onerror = () => {
                reject(
                    new Error("Failed to load Google Identity Services.")
                );
            };

            document.head.appendChild(script);
        });

        return googleScriptPromise;
    }

    async function googleSignIn() {

        await loadGoogleIdentityServices();

        if (!window.google?.accounts?.oauth2) {
            throw new Error(
                "Google Identity Services is not available."
            );
        }

        if (!googleTokenClient) {

            googleTokenClient = google.accounts.oauth2.initTokenClient({

                client_id: GOOGLE_CLIENT_ID,

                scope: "openid email profile",

                callback: async (response) => {
                   
                },

                error_callback: (error) => {

                    if (googleTokenClient._reject) {
                        googleTokenClient._reject(
                            new Error(
                                error?.error_description ||
                                error?.type ||
                                "Google popup failed."
                            )
                        );

                        googleTokenClient._resolve = null;
                        googleTokenClient._reject = null;
                    }
                }
            });
        }

        return new Promise((resolve, reject) => {

            googleTokenClient._resolve = resolve;
            googleTokenClient._reject = reject;

            googleTokenClient.callback = async (response) => {

                try {

                    if (!response?.access_token) {
                        throw new Error(
                            "Google did not return an access token."
                        );
                    }

                    const firebaseUser = await signInWithIdp({

                        providerId: "google.com",

                        accessToken: response.access_token,

                        requestUri: window.location.origin
                    });

                    resolve(firebaseUser);

                } catch (error) {

                    reject(error);

                } finally {

                    googleTokenClient._resolve = null;
                    googleTokenClient._reject = null;
                }
            };

            googleTokenClient.requestAccessToken({
                prompt: "select_account"
            });
        });
    }

    async function getAccountInfo() {

        const token =
            await getIdToken();

        if (!token) {

            return null;
        }

        const result =
            await authRequest(

                "accounts:lookup",

                {

                    idToken:
                        token

                },

                "getAccountInfo"
            );

        const user =
            result?.users?.[0];

        if (!user) {

            return null;
        }

        state.session.uid =
            user.localId ||
            state.session.uid;

        state.session.email =
            user.email ||
            null;

        saveSession();

        return {

            uid:
                user.localId,

            email:
                user.email ||
                null,

            emailVerified:
                !!user.emailVerified,

            displayName:
                user.displayName ||
                null,

            photoUrl:
                user.photoUrl ||
                null,

            providerUserInfo:
                user.providerUserInfo ||
                [],

            disabled:
                !!user.disabled
        };
    }

    async function updateProfile(
        profile
    ) {

        const token =
            await getIdToken();

        if (!token) {

            throw new FirebaseRestError(
                "You are not signed in."
            );
        }

        const rawObject = { idToken: token, displayName: profile?.displayName, photoUrl: profile?.photoUrl, returnSecureToken: true }

        const result = await authRequest("accounts:update", rawObject, "updateProfile");

        createSession(
            result
        );

        return getAccountInfo();
    }

    async function changePassword(
        password
    ) {

        const token =
            await getIdToken();

        if (!token) {

            throw new FirebaseRestError(
                "You are not signed in."
            );
        }

        const result =
            await authRequest(

                "accounts:update",

                {

                    idToken:
                        token,

                    password,

                    returnSecureToken:
                        true
                },

                "changePassword"
            );

        createSession(
            result
        );

        return getAccountInfo();
    }

    async function deleteAccount() {

        const token =
            await getIdToken();

        if (!token) {

            throw new FirebaseRestError(
                "You are not signed in."
            );
        }

        await authRequest(

            "accounts:delete",

            {

                idToken:
                    token
            },

            "deleteAccount"
        );

        clearSession();

        emitAuthChange();

        return true;
    }

    async function sendPasswordReset(
        email
    ) {

        return authRequest(

            "accounts:sendOobCode",

            {

                requestType:
                    "PASSWORD_RESET",

                email

            },

            "sendPasswordReset"
        );
    }

    async function sendEmailVerification() {

        const token =
            await getIdToken();

        if (!token) {

            throw new FirebaseRestError(
                "You are not signed in."
            );
        }

        return authRequest(

            "accounts:sendOobCode",

            {

                requestType:
                    "VERIFY_EMAIL",

                idToken:
                    token

            },

            "sendEmailVerification"
        );
    }

    function signOut() {

        clearSession();

        emitAuthChange();

        return true;
    }

    function onAuthChange(
        callback
    ) {

        if (
            typeof callback !==
            "function"
        ) {

            throw new FirebaseRestError(
                "onAuthChange(): callback must be a function."
            );
        }

        state.listeners.authChanged.add(
            callback
        );

        callback(
            currentUser()
        );

        return () => {

            state.listeners.authChanged.delete(
                callback
            );
        };
    }

    const db = {

        async get(
            path,
            options = {}
        ) {

            return request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "GET",

                service:
                    "database",

                operation:
                    "get",

                path,

                authenticated:
                    options.auth !== false,

                query:
                    options.query
            });
        },

        async set(
            path,
            value,
            options = {}
        ) {

            return request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "PUT",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        value
                    ),

                service:
                    "database",

                operation:
                    "set",

                path,

                authenticated:
                    options.auth !== false
            });
        },

        async update(
            path,
            values,
            options = {}
        ) {

            return request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "PATCH",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        values
                    ),

                service:
                    "database",

                operation:
                    "update",

                path,

                authenticated:
                    options.auth !== false
            });
        },

        async push(
            path,
            value,
            options = {}
        ) {

            const result =
                await request({

                    url:
                        databaseURL(
                            path
                        ),

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            value
                        ),

                    service:
                        "database",

                    operation:
                        "push",

                    path,

                    authenticated:
                        options.auth !== false
                });

            return {

                key:
                    result?.name ||

                    null,

                value
            };
        },

        async remove(
            path,
            options = {}
        ) {

            await request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "DELETE",

                service:
                    "database",

                operation:
                    "remove",

                path,

                authenticated:
                    options.auth !== false
            });

            return true;
        },

        async exists(
            path,
            options = {}
        ) {

            const result =
                await this.get(
                    path,
                    options
                );

            return (
                result !== null &&
                result !== undefined
            );
        },

        async query(
            path,
            queryOptions = {},
            options = {}
        ) {

            return request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "GET",

                service:
                    "database",

                operation:
                    "query",

                path,

                authenticated:
                    options.auth !== false,

                query:
                    queryOptions
            });
        },

        async shallow(
            path,
            options = {}
        ) {

            return request({

                url:
                    databaseURL(
                        path
                    ),

                method:
                    "GET",

                service:
                    "database",

                operation:
                    "shallow",

                path,

                authenticated:
                    options.auth !== false,

                query: {

                    shallow:
                        true
                }
            });
        },

        watch(
            path,
            callback,
            options = {}
        ) {

            requireDatabase();

            if (
                typeof callback !==
                "function"
            ) {

                throw new FirebaseRestError(
                    "db.watch(): callback must be a function."
                );
            }

            const url =
                appendQuery(
                    databaseURL(
                        path
                    ),
                    {}
                );

            const token =
                state.session
                    ?.idToken ||
                null;

            const streamURL =
                token
                    ? appendQuery(
                        url,
                        {
                            auth:
                                token
                        }
                    )
                    : url;

            const source =
                new EventSource(
                    streamURL
                );

            const handleEvent =
                event => {

                    let data =
                        null;

                    try {

                        data =
                            JSON.parse(
                                event.data
                            );

                    } catch (_) {

                        data =
                            event.data;
                    }

                    callback({

                        event:
                            event.type,

                        path,

                        data,

                        raw:
                            event
                    });
                };

            source.addEventListener(
                "put",
                handleEvent
            );

            source.addEventListener(
                "patch",
                handleEvent
            );

            source.addEventListener(
                "keep-alive",
                handleEvent
            );

            source.addEventListener(
                "cancel",
                event => {

                    callback({

                        event:
                            "cancel",

                        path,

                        data:
                            null,

                        raw:
                            event
                    });
                }
            );

            source.addEventListener(
                "auth_revoked",
                event => {

                    callback({

                        event:
                            "auth_revoked",

                        path,

                        data:
                            null,

                        raw:
                            event
                    });
                }
            );

            source.onerror =
                event => {

                    callback({

                        event:
                            "error",

                        path,

                        data:
                            null,

                        raw:
                            event
                    });
                };

            return {

                close() {

                    source.close();
                },

                get source() {

                    return source;
                }
            };
        }
    };

    const storage = {

        async upload(
            path,
            file,
            options = {}
        ) {

            requireStorage();

            if (
                !(
                    file instanceof Blob
                ) &&
                !(
                    file instanceof ArrayBuffer
                ) &&
                !(
                    file instanceof Uint8Array
                )
            ) {

                throw new FirebaseRestError(
                    "storage.upload(): file must be Blob, File, ArrayBuffer or Uint8Array."
                );
            }

            const contentType =
                options.contentType ||
                (
                    file instanceof Blob
                        ? file.type
                        : null
                ) ||
                "application/octet-stream";

            const url =
                appendQuery(

                    storageObjectURL(
                        path
                    )
                        .replace(
                            /\/o\/[^?]+$/,
                            "/o"
                        ),

                    {

                        uploadType:
                            "media",

                        name:
                            trimSlashes(
                                path
                            )
                    }
                );

            const result =
                await request({

                    url,

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            contentType
                    },

                    body:
                        file,

                    service:
                        "storage",

                    operation:
                        "upload",

                    path,

                    authenticated:
                        true,

                    timeout:
                        options.timeout ||
                        Math.max(
                            config.timeout,
                            120000
                        )
                });

            return {

                name:
                    result?.name ||
                    trimSlashes(path),

                bucket:
                    result?.bucket ||
                    config.storageBucket,

                contentType:
                    result?.contentType ||
                    contentType,

                size:
                    result?.size
                        ? Number(
                            result.size
                        )
                        : null,

                md5Hash:
                    result?.md5Hash ||
                    null,

                generation:
                    result?.generation ||
                    null,

                fullResponse:
                    result
            };
        },

        async metadata(
            path
        ) {

            return request({

                url:
                    storageObjectURL(
                        path
                    ),

                method:
                    "GET",

                service:
                    "storage",

                operation:
                    "metadata",

                path,

                authenticated:
                    true
            });
        },

        async download(
            path
        ) {

            const url =
                appendQuery(

                    storageObjectURL(
                        path
                    ),

                    {
                        alt:
                            "media"
                    }
                );

            const token =
                await getIdToken();

            const headers = {};

            if (token) {

                headers.Authorization =
                    `Bearer ${token}`;
            }

            const response =
                await fetch(
                    url,
                    {

                        method:
                            "GET",

                        headers
                    }
                );

            if (!response.ok) {

                const errorData =
                    await parseResponse(
                        response
                    );

                throw new FirebaseRestError(
                    getFirebaseErrorMessage(
                        errorData,
                        "Storage download failed."
                    ),
                    {

                        status:
                            response.status,

                        service:
                            "storage",

                        operation:
                            "download",

                        path,

                        raw:
                            errorData
                    }
                );
            }

            return await response.blob();
        },

        async getDownloadURL(
            path
        ) {

            const metadata =
                await this.metadata(
                    path
                );

            const tokenString =
                metadata?.downloadTokens;

            if (!tokenString) {

                throw new FirebaseRestError(
                    "No download token exists for this storage object. " +
                    "Use storage.download() for authenticated access, " +
                    "or create/manage a download URL for the object."
                );
            }

            const token =
                String(
                    tokenString
                )
                    .split(",")
                    .map(
                        value =>
                            value.trim()
                    )
                    .find(Boolean);

            if (!token) {

                throw new FirebaseRestError(
                    "Storage download token is empty."
                );
            }

            return (

                "https://firebasestorage.googleapis.com/v0/b/" +

                encodeURIComponent(
                    config.storageBucket
                ) +

                "/o/" +

                encodeURIComponent(
                    trimSlashes(
                        path
                    )
                ) +

                "?alt=media&token=" +

                encodeURIComponent(
                    token
                )
            );
        },

        async delete(
            path
        ) {

            await request({

                url:
                    storageObjectURL(
                        path
                    ),

                method:
                    "DELETE",

                service:
                    "storage",

                operation:
                    "delete",

                path,

                authenticated:
                    true
            });

            return true;
        },

        async list(
            prefix = "",
            options = {}
        ) {

            requireStorage();

            const url =
                (
                    "https://firebasestorage.googleapis.com/v0/b/" +
                    encodeURIComponent(
                        config.storageBucket
                    ) +
                    "/o"
                );

            return request({

                url,

                method:
                    "GET",

                service:
                    "storage",

                operation:
                    "list",

                path:
                    prefix,

                authenticated:
                    true,

                query: {

                    prefix:
                        prefix
                            ? trimSlashes(
                                prefix
                            ) + "/"
                            : undefined,

                    delimiter:
                        options.delimiter ??
                        undefined,

                    pageToken:
                        options.pageToken ??
                        undefined,

                    maxResults:
                        options.maxResults ??
                        undefined
                }
            });
        }
    };

    async function init(
        firebaseConfig = {}
    ) {

        if (
            state.initialized
        ) {

            return getState();
        }

        if (
            state.initializing
        ) {

            return state.initializing;
        }

        state.initializing =
            (async () => {

                configure(
                    firebaseConfig
                );

                validateConfig();

                const storedSession =
                    loadSession();

                if (
                    storedSession
                ) {

                    state.session =
                        storedSession;

                    if (
                        sessionExpiredSoon()
                    ) {

                        try {

                            await refresh();

                        } catch (error) {

                            console.warn(
                                "Firebase REST: stored session could not be refreshed.",
                                error
                            );

                            clearSession();
                        }
                    }
                }

                state.initialized =
                    true;

                emitAuthChange();

                console.log("FIRBASE INITIALLIZED");
                return getState();

            })()
                .finally(() => {

                    state.initializing =
                        null;
                });

        return state.initializing;
    }

    function configure(
        options = {}
    ) {

        Object.assign(
            config,
            options
        );

        if (
            config.databaseURL
        ) {

            config.databaseURL =
                String(
                    config.databaseURL
                )
                    .replace(
                        /\/+$/,
                        ""
                    );
        }

        if (
            config.persistence !==
            "local" &&
            config.persistence !==
            "session" &&
            config.persistence !==
            "memory"
        ) {

            throw new FirebaseRestError(
                "Firebase persistence must be local, session or memory."
            );
        }

        return getConfig();
    }

    async function ready() {

        if (
            state.initialized
        ) {

            return getState();
        }

        if (
            state.initializing
        ) {

            return state.initializing;
        }

        throw new FirebaseRestError(
            "Firebase REST has not been initialized. " +
            "Call component[\"firebase\"].init(config) first."
        );
    }

    function getConfig() {

        return {

            apiKey:
                config.apiKey,

            authDomain:
                config.authDomain,

            databaseURL:
                config.databaseURL,

            projectId:
                config.projectId,

            storageBucket:
                config.storageBucket,

            appId:
                config.appId,

            persistence:
                config.persistence,

            timeout:
                config.timeout
        };
    }

    function getState() {

        return {

            initialized:
                state.initialized,

            signedIn:
                isSignedIn(),

            user:
                currentUser(),

            tokenExpiresAt:
                state.session
                    ?.expiresAt ||
                null,

            databaseConfigured:
                !!config.databaseURL,

            storageConfigured:
                !!config.storageBucket
        };
    }

    function isInitialized() {

        return state.initialized;
    }

    function autoInit(){
        init(fbc);
    }

    return {

        init,

        configure,

        ready,

        getConfig,

        getState,

        isInitialized,
        autoInit,

        auth: {

            signUp,

            signIn,

            signInAnonymous,

            signInWithIdp,

            refresh,

            signOut,

            getIdToken,

            currentUser,

            isSignedIn,

            getAccountInfo,

            updateProfile,

            changePassword,

            deleteAccount,

            sendPasswordReset,

            sendEmailVerification,
            googleSignIn,
            onChange:
                onAuthChange
        },

        db,

        storage,

        FirebaseRestError
    };

})();
