

// Convert long keys to short keys
function shortenKeys(data,KEY_MAP=[]) {
  if (Array.isArray(data)) {
    return data.map(shortenKeys);
  }

  if (data !== null && typeof data === "object") {
    const result = {};

    for (const key in data) {
      const shortKey = KEY_MAP[key] || key;
      result[shortKey] = shortenKeys(data[key]);
    }

    return result;
  }

  return data;
}

// Convert short keys back to original keys
function expandKeys(data,KEY_MAP=[]) {
  const reverseMap = Object.fromEntries(
    Object.entries(KEY_MAP).map(([long, short]) => [short, long])
  );

  if (Array.isArray(data)) {
    return data.map(expandKeys);
  }

  if (data !== null && typeof data === "object") {
    const result = {};

    for (const key in data) {
      const originalKey = reverseMap[key] || key;
      result[originalKey] = expandKeys(data[key]);
    }

    return result;
  }

  return data;
}






export {shortenKeys};
export {expandKeys};