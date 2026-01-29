// Judge0 API 集成 - 用于代码评测

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

// 检查 API Key 是否配置
if (!JUDGE0_API_KEY) {
  console.warn("⚠️  JUDGE0_API_KEY 环境变量未设置！判题功能将无法正常工作。");
}

// Judge0 语言ID映射
const LANGUAGE_IDS: Record<string, number> = {
  cpp: 54, // C++ (GCC 9.2.0)
  c: 50,   // C (GCC 9.2.0)
  python: 71, // Python 3.8.1
};

// 提交状态映射
const STATUS_MAP: Record<number, string> = {
  1: "pending",      // In Queue
  2: "running",      // Processing
  3: "accepted",     // Accepted
  4: "wrong_answer", // Wrong Answer
  5: "time_limit",   // Time Limit Exceeded
  6: "compile_error", // Compilation Error
  7: "runtime_error", // Runtime Error (SIGSEGV)
  8: "runtime_error", // Runtime Error (SIGXFSZ)
  9: "runtime_error", // Runtime Error (SIGFPE)
  10: "runtime_error", // Runtime Error (SIGABRT)
  11: "runtime_error", // Runtime Error (NZEC)
  12: "runtime_error", // Runtime Error (Other)
  13: "runtime_error", // Internal Error
  14: "runtime_error", // Exec Format Error
};

export interface SubmissionResult {
  status: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  message: string | null;
}

export interface TestCaseResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  time: number | null;
  memory: number | null;
  status: string;
}

// 提交代码到 Judge0
async function submitToJudge0(
  sourceCode: string,
  language: string,
  stdin: string,
  expectedOutput?: string,
  timeLimit: number = 2,
  memoryLimit: number = 256000
): Promise<string> {
  try {
    console.log(`📤 提交代码到 Judge0，语言: ${language}, 时间限制: ${timeLimit}s, 内存限制: ${memoryLimit}KB`);

    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: Buffer.from(sourceCode).toString("base64"),
        language_id: LANGUAGE_IDS[language] || LANGUAGE_IDS.cpp,
        stdin: Buffer.from(stdin).toString("base64"),
        expected_output: expectedOutput ? Buffer.from(expectedOutput).toString("base64") : undefined,
        cpu_time_limit: timeLimit,
        memory_limit: memoryLimit,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Judge0 API 返回错误: ${response.status}`, errorText);
      throw new Error(`Judge0 API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ 提交成功，Token: ${data.token}`);
    return data.token;
  } catch (error) {
    console.error(`❌ 提交到 Judge0 失败:`, error);
    throw error;
  }
}

// 获取提交结果
async function getSubmissionResult(token: string): Promise<SubmissionResult> {
  try {
    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory,message`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ 获取结果失败: ${response.status}`, errorText);
      throw new Error(`Judge0 API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const status = STATUS_MAP[data.status?.id] || "pending";

    console.log(`📊 Token ${token} 状态: ${status} (ID: ${data.status?.id})`);

    return {
      status,
      stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString("utf-8") : null,
      stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString("utf-8") : null,
      compile_output: data.compile_output ? Buffer.from(data.compile_output, "base64").toString("utf-8") : null,
      time: data.time,
      memory: data.memory,
      message: data.message,
    };
  } catch (error) {
    console.error(`❌ 获取 Token ${token} 结果失败:`, error);
    throw error;
  }
}

// 等待结果（轮询）
async function waitForResult(token: string, maxAttempts: number = 20): Promise<SubmissionResult> {
  console.log(`⏳ 开始轮询结果，Token: ${token}, 最大尝试次数: ${maxAttempts}`);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await getSubmissionResult(token);

      if (result.status !== "pending" && result.status !== "running") {
        console.log(`✅ 获得最终结果 (尝试 ${i + 1}/${maxAttempts}): ${result.status}`);
        return result;
      }

      console.log(`⏳ 等待中 (${i + 1}/${maxAttempts})，当前状态: ${result.status}`);
      // 等待 500ms 后重试
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ 轮询第 ${i + 1} 次失败:`, error);
      // 如果不是最后一次尝试，继续重试
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      throw error;
    }
  }

  console.error(`❌ 超时：在 ${maxAttempts} 次尝试后仍未获得结果`);
  throw new Error(`Judge timeout after ${maxAttempts} attempts`);
}

// 运行单个测试用例
export async function runTestCase(
  sourceCode: string,
  language: string,
  input: string,
  expectedOutput: string,
  timeLimit: number = 2,
  memoryLimit: number = 256000
): Promise<TestCaseResult> {
  try {
    console.log(`🧪 运行测试用例，输入长度: ${input.length}, 期望输出长度: ${expectedOutput.length}`);

    const token = await submitToJudge0(sourceCode, language, input, undefined, timeLimit, memoryLimit);
    const result = await waitForResult(token);

    const actualOutput = (result.stdout || "").trim();
    const expected = expectedOutput.trim();

    // 只有在没有编译错误和运行时错误，且输出完全匹配时才算通过
    const hasNoErrors = result.status !== "compile_error" &&
                        result.status !== "runtime_error" &&
                        result.status !== "time_limit";
    const outputMatches = actualOutput === expected;
    const passed = hasNoErrors && outputMatches;

    console.log(`${passed ? '✅' : '❌'} 测试用例${passed ? '通过' : '失败'}: 状态=${result.status}, 输出匹配=${outputMatches}`);

    return {
      passed,
      input,
      expectedOutput: expected,
      actualOutput,
      time: result.time ? parseFloat(result.time) * 1000 : null, // 转换为毫秒
      memory: result.memory,
      status: passed ? "accepted" : result.status,
    };
  } catch (error) {
    console.error(`❌ 运行测试用例时发生错误:`, error);
    return {
      passed: false,
      input,
      expectedOutput,
      actualOutput: "",
      time: null,
      memory: null,
      status: "runtime_error",
    };
  }
}

// 运行所有测试用例
export async function judgeSubmission(
  sourceCode: string,
  language: string,
  testCases: Array<{ input: string; output: string }>,
  timeLimit: number = 1000,
  memoryLimit: number = 256
): Promise<{
  status: string;
  score: number;
  testResults: TestCaseResult[];
  compileOutput?: string;
}> {
  console.log(`🚀 开始判题: 语言=${language}, 测试用例数=${testCases.length}, 时间限制=${timeLimit}ms, 内存限制=${memoryLimit}MB`);
  console.log(`📝 代码长度: ${sourceCode.length} 字符`);

  if (!JUDGE0_API_KEY) {
    console.error(`❌ JUDGE0_API_KEY 未设置，无法进行判题`);
    throw new Error("Judge0 API Key 未配置");
  }

  const results: TestCaseResult[] = [];
  let allPassed = true;

  // 先编译检查（使用第一个测试用例）
  if (testCases.length > 0) {
    const firstResult = await runTestCase(
      sourceCode,
      language,
      testCases[0].input,
      testCases[0].output,
      timeLimit / 1000,
      memoryLimit * 1024
    );

    // 如果是编译错误，直接返回
    if (firstResult.status === "compile_error") {
      return {
        status: "compile_error",
        score: 0,
        testResults: [firstResult],
      };
    }

    results.push(firstResult);
    if (!firstResult.passed) allPassed = false;
  }

  // 并行运行剩余测试用例
  const remainingCases = testCases.slice(1);
  const remainingResults = await Promise.all(
    remainingCases.map(tc =>
      runTestCase(
        sourceCode,
        language,
        tc.input,
        tc.output,
        timeLimit / 1000,
        memoryLimit * 1024
      )
    )
  );

  results.push(...remainingResults);

  for (const result of remainingResults) {
    if (!result.passed) allPassed = false;
  }

  const passedCount = results.filter(r => r.passed).length;
  const score = Math.round((passedCount / testCases.length) * 100);

  // 确定最终状态
  let finalStatus = "accepted";
  if (!allPassed) {
    // 找出第一个失败的测试用例的状态
    const failedResult = results.find(r => !r.passed);
    finalStatus = failedResult?.status || "wrong_answer";
  }

  return {
    status: finalStatus,
    score,
    testResults: results,
  };
}

export default {
  runTestCase,
  judgeSubmission,
};
