import crypto from "crypto";

const IFLYTEK_HOST = "iat-api.xfyun.cn";
const IFLYTEK_PATH = "/v2/iat";

/**
 * 生成讯飞实时语音听写 WebSocket 签名 URL
 * 使用 HMAC-SHA256 签名算法，参考讯飞官方文档
 */
export function generateIflytekAuthUrl(): string {
  const apiKey = process.env.IFLYTEK_API_KEY;
  const apiSecret = process.env.IFLYTEK_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing IFLYTEK_API_KEY or IFLYTEK_API_SECRET");
  }

  // RFC 2616 格式日期
  const date = new Date().toUTCString();

  // 构造签名原文: host + date + GET request-line
  const signatureOrigin = `host: ${IFLYTEK_HOST}\ndate: ${date}\nGET ${IFLYTEK_PATH} HTTP/1.1`;

  // HMAC-SHA256 签名
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(signatureOrigin)
    .digest("base64");

  // 构造 authorization 原文
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;

  // Base64 编码 authorization
  const authorization = Buffer.from(authorizationOrigin).toString("base64");

  // 拼接最终 URL
  const url = `wss://${IFLYTEK_HOST}${IFLYTEK_PATH}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(IFLYTEK_HOST)}`;

  return url;
}
