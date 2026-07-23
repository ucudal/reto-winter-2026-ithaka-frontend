const STRICT_URL_PATTERN =
  /^https?:\/\/[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?::\d{1,5})?(?:\/[^\s]*)?$/

export function isValidUrl(value) {
  if (!value) return false
  return STRICT_URL_PATTERN.test(value.trim())
}
