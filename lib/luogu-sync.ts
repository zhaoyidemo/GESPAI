/**
 * 洛谷题目同步服务
 * 从洛谷获取题目内容，确保与洛谷100%一致
 */

export interface LuoguProblem {
  pid: string;
  title: string;
  background: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  hint: string;
  difficulty: number;
  tags: string[];
}

export interface SyncResult {
  success: boolean;
  problem?: LuoguProblem;
  error?: string;
}

export interface DiffResult {
  field: string;
  local: string;
  remote: string;
  isDifferent: boolean;
}

/**
 * 从洛谷获取题目详情
 */
export async function fetchLuoguProblem(problemId: string): Promise<SyncResult> {
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    // 洛谷题目API
    const response = await fetch(`https://www.luogu.com.cn/problem/${problemId}?_contentOnly=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://www.luogu.com.cn/',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const text = await response.text();

    // 检查是否返回了 HTML（被拦截）
    if (text.startsWith('<!') || text.startsWith('<html')) {
      return { success: false, error: '请求被洛谷拦截，请稍后重试' };
    }

    const data = JSON.parse(text);

    if (data.code !== 200 || !data.currentData?.problem) {
      return { success: false, error: '题目不存在或无法访问' };
    }

    const p = data.currentData.problem;

    // 解析样例
    const samples: Array<{ input: string; output: string; explanation?: string }> = [];
    if (p.samples && Array.isArray(p.samples)) {
      for (const sample of p.samples) {
        samples.push({
          input: sample[0] || '',
          output: sample[1] || '',
        });
      }
    }

    const problem: LuoguProblem = {
      pid: p.pid,
      title: p.title,
      background: p.background || '',
      description: p.description || '',
      inputFormat: p.inputFormat || '',
      outputFormat: p.outputFormat || '',
      samples,
      hint: p.hint || '',
      difficulty: p.difficulty || 0,
      tags: p.tags?.map((t: { name: string }) => t.name) || [],
    };

    return { success: true, problem };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * 从洛谷题单获取所有题目ID
 */
export async function fetchLuoguTrainingProblems(trainingId: string): Promise<{ success: boolean; problemIds?: string[]; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`https://www.luogu.com.cn/training/${trainingId}?_contentOnly=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://www.luogu.com.cn/',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const text = await response.text();

    if (text.startsWith('<!') || text.startsWith('<html')) {
      return { success: false, error: '请求被洛谷拦截' };
    }

    const data = JSON.parse(text);

    if (data.code !== 200 || !data.currentData?.training?.problems) {
      return { success: false, error: '题单不存在或无法访问' };
    }

    const problemIds = data.currentData.training.problems.map(
      (p: { problem: { pid: string } }) => p.problem.pid
    );

    return { success: true, problemIds };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * 对比本地题目与洛谷题目的差异
 */
export function compareProblem(
  local: {
    title?: string;
    background?: string;
    description?: string;
    inputFormat?: string;
    outputFormat?: string;
    samples?: Array<{ input: string; output: string }>;
    hint?: string;
  },
  remote: LuoguProblem
): DiffResult[] {
  const diffs: DiffResult[] = [];

  // 标准化字符串：去除首尾空白，统一换行符
  const normalize = (s: string | undefined | null): string => {
    if (!s) return '';
    return s.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  };

  // 对比各字段
  const fields: Array<{ name: string; localVal: string; remoteVal: string }> = [
    { name: 'background', localVal: normalize(local.background), remoteVal: normalize(remote.background) },
    { name: 'description', localVal: normalize(local.description), remoteVal: normalize(remote.description) },
    { name: 'inputFormat', localVal: normalize(local.inputFormat), remoteVal: normalize(remote.inputFormat) },
    { name: 'outputFormat', localVal: normalize(local.outputFormat), remoteVal: normalize(remote.outputFormat) },
    { name: 'hint', localVal: normalize(local.hint), remoteVal: normalize(remote.hint) },
  ];

  for (const field of fields) {
    diffs.push({
      field: field.name,
      local: field.localVal,
      remote: field.remoteVal,
      isDifferent: field.localVal !== field.remoteVal,
    });
  }

  // 对比样例
  const localSamples = local.samples || [];
  const remoteSamples = remote.samples || [];

  const maxSamples = Math.max(localSamples.length, remoteSamples.length);
  for (let i = 0; i < maxSamples; i++) {
    const localSample = localSamples[i];
    const remoteSample = remoteSamples[i];

    const localInput = normalize(localSample?.input);
    const remoteInput = normalize(remoteSample?.input);
    const localOutput = normalize(localSample?.output);
    const remoteOutput = normalize(remoteSample?.output);

    if (localInput !== remoteInput) {
      diffs.push({
        field: `samples[${i}].input`,
        local: localInput,
        remote: remoteInput,
        isDifferent: true,
      });
    }
    if (localOutput !== remoteOutput) {
      diffs.push({
        field: `samples[${i}].output`,
        local: localOutput,
        remote: remoteOutput,
        isDifferent: true,
      });
    }
  }

  return diffs;
}

/**
 * GESP级别对应的洛谷题单ID
 */
export const GESP_TRAINING_IDS: Record<number, string> = {
  1: '551',  // GESP 1级
  2: '552',  // GESP 2级
  3: '553',  // GESP 3级
  4: '554',  // GESP 4级
  5: '555',  // GESP 5级
  6: '556',  // GESP 6级
  7: '557',  // GESP 7级
  8: '558',  // GESP 8级
};

/**
 * 难度映射
 */
export function mapDifficulty(luoguDifficulty: number): string {
  const difficultyMap: Record<number, string> = {
    0: '暂无评定',
    1: '入门',
    2: '普及-',
    3: '普及/提高-',
    4: '普及+/提高',
    5: '提高+/省选-',
    6: '省选/NOI-',
    7: 'NOI/NOI+/CTSC',
  };
  return difficultyMap[luoguDifficulty] || '暂无评定';
}
