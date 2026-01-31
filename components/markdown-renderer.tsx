"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown 渲染组件
 * 支持：
 * - 标准 Markdown 语法
 * - LaTeX 数学公式（$..$ 行内，$$...$$ 块级）
 * - 与洛谷渲染效果一致
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <ReactMarkdown
      className={`prose prose-sm max-w-none ${className}`}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // 自定义代码块样式
        code: ({ node, className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // 自定义预格式化块样式
        pre: ({ children }) => (
          <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
            {children}
          </pre>
        ),
        // 表格样式
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-300">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-3 py-2">
            {children}
          </td>
        ),
        // 链接样式
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        ),
        // 列表样式
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-2 space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-2 space-y-1">
            {children}
          </ol>
        ),
        // 段落样式
        p: ({ children }) => (
          <p className="my-2 leading-relaxed">
            {children}
          </p>
        ),
        // 标题样式
        h2: ({ children }) => (
          <h2 className="text-lg font-bold mt-6 mb-3 border-b pb-1">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold mt-4 mb-2">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-bold mt-3 mb-1">
            {children}
          </h4>
        ),
        // 分割线
        hr: () => (
          <hr className="my-4 border-gray-200" />
        ),
        // 引用块
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
