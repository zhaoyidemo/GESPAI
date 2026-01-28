import { NextResponse } from "next/server";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

// 测试 Judge0 API 连接
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    apiUrl: JUDGE0_API_URL,
    apiKeyConfigured: !!JUDGE0_API_KEY,
    apiKeyLength: JUDGE0_API_KEY.length,
  };

  // 测试 1: 检查 API 是否可达
  try {
    const aboutResponse = await fetch(`${JUDGE0_API_URL}/about`, {
      headers: {
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    });

    results.aboutStatus = aboutResponse.status;
    if (aboutResponse.ok) {
      results.aboutData = await aboutResponse.json();
    } else {
      results.aboutError = await aboutResponse.text();
    }
  } catch (error) {
    results.aboutError = error instanceof Error ? error.message : "Unknown error";
  }

  // 测试 2: 提交简单的 Hello World 代码
  try {
    const testCode = `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`;

    const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: Buffer.from(testCode).toString("base64"),
        language_id: 54, // C++ GCC
        stdin: Buffer.from("1 2").toString("base64"),
        expected_output: Buffer.from("3").toString("base64"),
      }),
    });

    results.submitStatus = submitResponse.status;

    if (submitResponse.ok) {
      const submitData = await submitResponse.json();
      results.submitResult = {
        token: submitData.token,
        status: submitData.status,
        stdout: submitData.stdout ? Buffer.from(submitData.stdout, "base64").toString("utf-8") : null,
        stderr: submitData.stderr ? Buffer.from(submitData.stderr, "base64").toString("utf-8") : null,
        compile_output: submitData.compile_output ? Buffer.from(submitData.compile_output, "base64").toString("utf-8") : null,
        time: submitData.time,
        memory: submitData.memory,
      };
    } else {
      const errorText = await submitResponse.text();
      results.submitError = errorText;
    }
  } catch (error) {
    results.submitError = error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(results, { status: 200 });
}
