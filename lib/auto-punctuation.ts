/**
 * 自动为中文语音识别文本添加标点符号
 */

// 疑问词列表
const QUESTION_ENDINGS = ["吗", "呢", "什么", "怎么", "哪", "哪里", "哪个", "为什么", "几", "多少", "谁", "是否", "能否", "可否"];

/**
 * 检查文本是否以疑问词结尾
 */
function endsWithQuestion(text: string): boolean {
  const trimmed = text.trim();
  return QUESTION_ENDINGS.some(word => trimmed.endsWith(word));
}

/**
 * 检测文本中是否已包含中文标点（讯飞等引擎已自动添加标点的情况）
 */
function hasChinesePunctuation(text: string): boolean {
  return /[，。？！、；：]/.test(text);
}

/**
 * 为文本添加标点符号
 * @param text 原始文本
 * @param isEnd 是否是录音结束（决定末尾标点）
 */
export function addPunctuation(text: string, isEnd: boolean = false): string {
  if (!text || !text.trim()) return text;

  let result = text.trim();

  // 如果文本中已包含中文标点（讯飞等引擎已处理），跳过中间断句逻辑
  if (hasChinesePunctuation(result)) {
    if (isEnd) {
      const finalLastChar = result[result.length - 1];
      if (!/[，。？！,.\?!、；：]/.test(finalLastChar)) {
        if (endsWithQuestion(result)) {
          result += "？";
        } else {
          result += "。";
        }
      }
    }
    return result;
  }

  // 如果已经有标点，不处理
  const lastChar = result[result.length - 1];
  if (/[，。？！,.\?!]/.test(lastChar)) {
    return result;
  }

  // 超过12个字没有标点，在合适位置加逗号
  const segments = result.split(/[，。？！,.\?!]/);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment.length > 12 && !isEnd) {
    // 尝试在自然断点加逗号（如"的"、"了"、"是"后面）
    const breakPoints = ["的", "了", "是", "在", "和", "与", "或"];
    let inserted = false;

    for (let i = 8; i < lastSegment.length - 4; i++) {
      if (breakPoints.includes(lastSegment[i])) {
        const before = result.slice(0, result.length - lastSegment.length + i + 1);
        const after = result.slice(result.length - lastSegment.length + i + 1);
        result = before + "，" + after;
        inserted = true;
        break;
      }
    }

    // 如果没找到自然断点，在第10个字后加逗号
    if (!inserted && lastSegment.length > 15) {
      const pos = result.length - lastSegment.length + 10;
      result = result.slice(0, pos) + "，" + result.slice(pos);
    }
  }

  // 录音结束时添加末尾标点
  if (isEnd) {
    const finalLastChar = result[result.length - 1];
    if (!/[，。？！,.\?!]/.test(finalLastChar)) {
      if (endsWithQuestion(result)) {
        result += "？";
      } else {
        result += "。";
      }
    }
  }

  return result;
}
