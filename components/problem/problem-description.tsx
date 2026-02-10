"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Problem } from "@/stores/problem-store";

interface ProblemDescriptionProps {
  problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-bold mb-3 pb-1 border-b">题目描述</h3>
        <MarkdownRenderer content={problem.description} />
      </section>

      {problem.inputFormat && (
        <section>
          <h3 className="text-base font-bold mb-3 pb-1 border-b">输入格式</h3>
          <MarkdownRenderer content={problem.inputFormat} />
        </section>
      )}

      {problem.outputFormat && (
        <section>
          <h3 className="text-base font-bold mb-3 pb-1 border-b">输出格式</h3>
          <MarkdownRenderer content={problem.outputFormat} />
        </section>
      )}

      <section>
        <h3 className="text-base font-bold mb-3 pb-1 border-b">样例</h3>
        {problem.samples.map((sample, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="font-medium text-sm mb-1">输入 #{index + 1}</p>
              <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                {sample.input}
              </pre>
            </div>
            <div>
              <p className="font-medium text-sm mb-1">输出 #{index + 1}</p>
              <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                {sample.output}
              </pre>
            </div>
          </div>
        ))}
      </section>

      {problem.hint && (
        <section>
          <h3 className="text-base font-bold mb-3 pb-1 border-b">提示</h3>
          <MarkdownRenderer content={problem.hint} />
        </section>
      )}
    </div>
  );
}
