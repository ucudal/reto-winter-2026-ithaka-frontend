import { describe, expect, it } from "vitest";
import { sanitizeText, sanitizeHtml } from "./sanitize";

describe("sanitizeText", () => {
  it("deja pasar texto plano sin tocarlo", () => {
    expect(sanitizeText("Reunión de seguimiento, todo en orden.")).toBe(
      "Reunión de seguimiento, todo en orden.",
    );
  });

  it("saca etiquetas <script>", () => {
    expect(sanitizeText('<script>alert("xss")</script>Hola')).toBe("Hola");
  });

  it("saca atributos de evento tipo onerror", () => {
    expect(sanitizeText("<img src=x onerror=alert(1)>Nota")).toBe("Nota");
  });

  it("saca links con esquema javascript:", () => {
    expect(sanitizeText('<a href="javascript:alert(1)">click</a>')).toBe(
      "click",
    );
  });

  it("devuelve string vacío para null/undefined", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
  });
});

describe("sanitizeHtml", () => {
  it("mantiene etiquetas de formato seguras", () => {
    expect(sanitizeHtml("<b>importante</b>")).toBe("<b>importante</b>");
  });

  it("saca <script> pero mantiene el resto del HTML", () => {
    expect(sanitizeHtml("<p>Hola</p><script>alert(1)</script>")).toBe(
      "<p>Hola</p>",
    );
  });
});
