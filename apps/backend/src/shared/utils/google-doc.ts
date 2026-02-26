export function extractGoogleDocId(url: string): string {
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]{10,})/, // Standard docs URL
    /id=([a-zA-Z0-9_-]{10,})/, // Alternative format
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error("Invalid Google Docs URL. Could not extract document ID.");
}

// Helper function to extract text from the Docs API's content structure
export function extractPlainText(content: any[]): string {
  return content
    .map((structuralElement) => {
      if (structuralElement.paragraph) {
        // A paragraph contains 'elements' like text runs
        return structuralElement.paragraph.elements
          .map((element: any) => {
            // The actual text string is in element.textRun.content
            return element.textRun ? element.textRun.content : "";
          })
          .join(""); // Join text within the same paragraph
      }
      // Handle other element types (e.g., tables, lists) if needed
      return "";
    })
    .join("\n"); // Join different paragraphs with a newline
}

export type RGBType = { r: number; g: number; b: number };
export type TextSegment = {
  text: string;
  styles: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: RGBType;
    foregroundColor?: RGBType;
    link?: string;
  };
};

export type Paragraph = {
  type: "PARAGRAPH" | "HEADING_1" | "HEADING_2" | "HEADING_3" | "LIST_ITEM";
  alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  segments: TextSegment[];
  listInfo?: {
    listId: string;
    nestingLevel: number;
  };
};

export function extractDocumentStructure(content: any[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  content.forEach((structuralElement) => {
    if (structuralElement.paragraph) {
      const paragraph = structuralElement.paragraph;

      // Determine paragraph type
      const namedStyle =
        paragraph.paragraphStyle?.namedStyleType || "NORMAL_TEXT";
      let type: Paragraph["type"] = "PARAGRAPH";

      if (namedStyle.includes("HEADING")) {
        type = namedStyle as Paragraph["type"];
      } else if (
        namedStyle.includes("TITLE") ||
        namedStyle.includes("SUBTITLE")
      ) {
        type = "PARAGRAPH"; // Treat titles and subtitles as paragraphs for now
      }

      // Get alignment
      const alignment = paragraph.paragraphStyle?.alignment || "LEFT";

      // Extract list info if present
      let listInfo = undefined;
      if (paragraph.bullet) {
        listInfo = {
          listId: paragraph.bullet.listId,
          nestingLevel: paragraph.bullet.nestingLevel || 0,
        };
        type = "LIST_ITEM";
      }

      const segments: TextSegment[] = [];

      paragraph.elements.forEach((element: any) => {
        if (element.textRun) {
          const textRun = element.textRun;
          const text = textRun.content;
          const style = textRun.textStyle || {};

          const rgbToObject = (rgbColor: any) => {
            if (!rgbColor) return undefined;
            return {
              r: rgbColor.red || 0,
              g: rgbColor.green || 0,
              b: rgbColor.blue || 0,
            };
          };

          segments.push({
            text,
            styles: {
              bold: style.bold,
              italic: style.italic,
              underline: style.underline,
              strikethrough: style.strikethrough,
              fontSize: style.fontSize?.magnitude,
              fontFamily: style.weightedFontFamily?.fontFamily,
              backgroundColor: rgbToObject(
                style.backgroundColor?.color?.rgbColor
              ),
              foregroundColor: rgbToObject(
                style.foregroundColor?.color?.rgbColor
              ),
              link: style.link?.url,
            },
          });
        }
      });

      paragraphs.push({
        type,
        alignment,
        segments,
        listInfo,
      });
    }
  });

  return paragraphs;
}
