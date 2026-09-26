"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// remark-gfm adds GitHub-flavoured Markdown: tables, strikethrough, task lists, autolinks
export function BlogContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
