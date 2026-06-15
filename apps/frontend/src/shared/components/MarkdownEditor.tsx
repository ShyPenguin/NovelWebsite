import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
  content: string;
  onChange: (value: string) => void;

  minHeight?: number;
  placeholder?: string;

  defaultMode?: "edit" | "preview";
};

// For announcement "Write your announcement using Markdown..."
export function MarkdownEditor({
  content,
  onChange,
  minHeight = 500,
  defaultMode = "edit",
  placeholder,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">(defaultMode);

  return (
    <div
      className={`flex h-full min-h-[${minHeight}px] w-full flex-col rounded-lg border`}
    >
      {/* Tabs */}
      <div className="flex border-b bg-muted/40">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "edit"
              ? "border-b-2 border-primary bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "preview"
              ? "border-b-2 border-primary bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {mode === "edit" ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`
                  size-full
                  min-h-[${minHeight}px]
                  resize-none
                  border-0
                  bg-transparent
                  p-4
                  font-mono
                  outline-none
                `}
          />
        ) : (
          <div className={`p-6 size-full min-h-[${minHeight}px]`}>
            <Preview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

export const Preview = ({ content }: { content: string }) => {
  return (
    <article className="prose max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
};
