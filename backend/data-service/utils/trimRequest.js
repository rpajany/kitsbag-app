// utils/trimRequest.js

/**
 * Fields to exclude from trimming (case-sensitive key match)
 * e.g., password fields or raw input content
 */
const EXCLUDED_KEYS = new Set(["password", "rawData"]);

// Enable this flag for local development debugging only
const ENABLE_LOGGING = false;

/**
 * Safely trims strings in an object (recursively), ignoring excluded keys.
 */
function deepTrim(obj, path = "") {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      deepTrim(obj[i], `${path}[${i}]`);
    }
  } else if (obj && typeof obj === "object" && !Buffer.isBuffer(obj)) {
    for (const key of Object.keys(obj)) {
      if (EXCLUDED_KEYS.has(key)) continue;

      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (ENABLE_LOGGING && trimmed !== value) {
          console.log(`[trim] ${fullPath}: "${value}" → "${trimmed}"`);
        }
        obj[key] = trimmed;
      } else if (typeof value === "object" && value !== null) {
        deepTrim(value, fullPath);
      }
    }
  }
}

/**
 * Express middleware to trim string values in req.body, req.query, req.params
 */
export default function trimRequest(req, res, next) {
  try {
    if (req.body) deepTrim(req.body, "body");
    if (req.query) deepTrim(req.query, "query");
    if (req.params) deepTrim(req.params, "params");
  } catch (err) {
    console.error("trimRequest error:", err);
    // Don’t block request due to trim failure
  }
  next();
}
