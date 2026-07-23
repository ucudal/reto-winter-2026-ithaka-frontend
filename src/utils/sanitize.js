import DOMPurify from "dompurify";

export function sanitizeText(value) {
  if (value == null) return "";
  const stringValue = String(value);

  return DOMPurify.sanitize(stringValue, { ALLOWED_TAGS: [] }).trim();
}

export function sanitizeHtml(html) {
  if (html == null) return "";
  return DOMPurify.sanitize(String(html));
}
