import React from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function MarkdownComponent({ code }: { code: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose dark:prose-invert h-full text-base font-geistSans"
    >
      {code}
    </ReactMarkdown>
  );
}
