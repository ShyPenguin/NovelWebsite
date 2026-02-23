import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function DocumentToHTML({
  htmlContent,
}: {
  htmlContent: string;
}) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // Sanitize HTML whenever content changes
    const cleanHtml = DOMPurify.sanitize(htmlContent || "", {
      ALLOWED_TAGS: [
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "span",
        "a",
        "br",
        "ul",
        "ol",
        "li",
        "strong",
        "em",
        "u",
        "s",
        "b",
        "i",
        "div",
        "mark",
        "sub",
        "sup",
      ],
      ALLOWED_ATTR: ["style", "href", "target", "rel", "class"],
    });
    setSanitizedHtml(cleanHtml);
  }, [htmlContent]);

  return (
    <div
      className="document-preview"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
