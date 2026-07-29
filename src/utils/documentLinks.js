import { isValidUrl } from "./validators";

// La columna documents.url es String(500) en el backend.
export const DOCUMENT_URL_MAX_LENGTH = 500;

// El backend solo acepta platform "Drive" | "SharePoint" (enum DocumentPlatform)
// y no tiene campo de título: un documento es url + platform + order. Hasta que
// eso cambie, la etiqueta que mostramos se deriva del host de la propia URL.
const HOST_LABELS = [
  [/^drive\.google\.com$/, "Drive"],
  [/^docs\.google\.com$/, "Documento de Google"],
  [/sharepoint\.com$/, "SharePoint"],
  [/^(github|gitlab|bitbucket)\.(com|org)$/, "Repositorio"],
  [/^(notion\.so|notion\.site)$/, "Notion"],
  [/^figma\.com$/, "Figma"],
];

export function getDocumentHost(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getDocumentLabel(url) {
  const host = getDocumentHost(url);
  if (!host) return String(url ?? "");

  const match = HOST_LABELS.find(([pattern]) => pattern.test(host));
  return match ? match[1] : host;
}

export function getPlatformForUrl(url) {
  return /sharepoint\.com$/.test(getDocumentHost(url)) ? "SharePoint" : "Drive";
}

// Los documentos existentes vienen de la DB sin validar, así que nunca ponemos
// una url arbitraria en un href sin chequearla (un `javascript:` sería XSS).
export function getDocumentHref(url) {
  return isValidUrl(url) ? String(url).trim() : null;
}
