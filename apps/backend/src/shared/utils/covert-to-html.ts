import { Paragraph, RGBType, TextSegment } from "./google-doc.ts";

const blueBorderStyle =
  "position: absolute; top: -0.125rem; right: -0.125rem; bottom: -0.125rem; left: -0.125rem; border-radius: 0.5rem; filter: blur(0.25rem); background-color: #1e3a8a; opacity: 0.75;";
const blueContent =
  "position: relative; max-width: 600px; width: 100%; background-color: #000; padding: 2rem; border: 3px solid #3b82f6; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center;";

const textShadowCyan =
  "text-shadow: 0 0 10px rgba(187, 230, 253, 1), 0 0 20px rgba(187, 230, 253, 1), 0 0 30px rgba(96, 165, 250, 1), 0 0 40px rgba(96, 165, 250, 1)";

const getBackGroundColor = (color: RGBType): string => {
  const { r, g, b } = color;
  switch (true) {
    case r == 0 && g == 0 && b == 1:
      return "color: #bae6fdff; font-weight: 700; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);";
    case r == 0 && g == 1 && b == 1:
      return "color: #bae6fdff; font-weight: bold;" + textShadowCyan;
    default:
      return `color: rgb(${color.r * 255}, ${color.g * 255}, ${
        color.b * 255
      }); `;
  }
};

export function convertToHTML(structuredContent: Paragraph[]): string {
  const paragraphs = structuredContent.map((paragraph) => {
    const innerHTML = paragraph.segments
      .map((segment: TextSegment) => {
        if (segment.text.includes("<bor>")) {
          return `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">
          <div style="position: relative; max-width: 600px; width: 100%;">
          <div style="${blueBorderStyle}"></div>
          <div style="${blueContent}">`;
        }
        if (segment.text.includes("</bor>")) {
          return `</div></div></div>`;
        }

        let styles = "";
        if (segment.styles.bold) styles += "font-weight: bold; ";
        if (segment.styles.italic) styles += "font-style: italic; ";
        if (segment.styles.underline) styles += "text-decoration: underline; ";
        if (segment.styles.foregroundColor) {
          const color = segment.styles.foregroundColor;
          const colorStyle = `color: rgb(${color.r * 255}, ${color.g * 255}, ${
            color.b * 255
          }); `;
          styles += colorStyle;
        }
        if (segment.styles.backgroundColor) {
          const color = getBackGroundColor(segment.styles.backgroundColor);
          styles += color;
        }
        if (segment.styles.fontSize) {
          styles += `font-size: ${segment.styles.fontSize}pt; `;
        }

        let tag = "span";
        let attributes = "";

        if (segment.styles.link) {
          tag = "a";
          attributes = ` href="${segment.styles.link}"`;
        }

        const styleAttr = styles ? ` style="${styles.trim()}"` : "";

        if (segment.text === "\n") {
          return `<br${styleAttr}${attributes}>`;
        }
        return `<${tag}${styleAttr}${attributes}>${segment.text}</${tag}>`;
      })
      .join("");

    let tag = "p";
    if (paragraph.type === "HEADING_1") tag = "h1";
    if (paragraph.type === "HEADING_2") tag = "h2";
    if (paragraph.type === "HEADING_3") tag = "h3";
    if (paragraph.type === "LIST_ITEM") tag = "li";

    const style =
      paragraph.alignment !== "LEFT"
        ? ` style="text-align: ${paragraph.alignment.toLowerCase()}"`
        : "";

    return `<${tag}${style}>${innerHTML}</${tag}>`;
  });

  return paragraphs.join("");
}
