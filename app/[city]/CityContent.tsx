"use client";

import ReactMarkdown from "react-markdown";

export function CityContent({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
