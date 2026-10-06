"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// remark-gfm adds GitHub-flavoured Markdown: tables, strikethrough, task lists, autolinks
export function BlogContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Wide tables scroll inside their own box on phones instead of pushing the whole page sideways.
        // Focusable so keyboard users can scroll it too.
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Tableau">
            <table className="my-0">{children}</table>
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
