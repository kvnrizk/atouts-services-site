"use client";

import ReactMarkdown from "react-markdown";

export function BlogContent({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
