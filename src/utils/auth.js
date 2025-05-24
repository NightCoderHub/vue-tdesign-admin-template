// 判断token是否过期
export function isTokenExpired(token) {
  // 1. 无token直接视为过期
  if (!token) return true;

  try {
    // 2. 分割JWT的三部分（header.payload.signature）
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return true; // 无效Token格式

    // 3. Base64解码（处理URL安全的Base64：替换-为+，_为/）
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const payloadStr = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    // 4. 解析payload中的过期时间（秒级时间戳）
    const { exp } = JSON.parse(payloadStr);
    if (!exp) return true; // 无exp字段视为过期

    // 5. 当前时间（秒级）与exp对比
    const now = Math.floor(Date.now() / 1000); // 转换为秒
    return now >= exp;
  } catch (error) {
    console.error("Token解析失败，视为过期", error);
    return true; // 解析失败默认过期
  }
}
