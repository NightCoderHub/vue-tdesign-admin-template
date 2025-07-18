// searchComponent.js (示例组件)
import axiosInstance from "./axiosInstance"; // 你的 Axios 实例
import { debounceRequest } from "./requestDebounce";

async function search(query) {
  if (!query) return;

  try {
    console.log(`用户输入: ${query}`);
    // 使用 debounceRequest 包裹 Axios 请求配置
    const config = await debounceRequest({
      url: `/search?q=${query}`,
      method: "GET",
    });

    // 如果 debounceRequest resolve 了，说明可以发送请求了
    const response = await axiosInstance(config);
    console.log("搜索结果:", response.data);
  } catch (error) {
    if (error.message !== "Previous request debounced.") {
      console.error("搜索请求失败:", error.message);
    } else {
      // console.log("旧的搜索请求被防抖了");
    }
  }
}

// 模拟用户连续输入
console.log("--- 示例 2: 请求防抖 ---");
search("apple");
setTimeout(() => search("apple p"), 100);
setTimeout(() => search("apple ph"), 200);
setTimeout(() => search("apple pho"), 300); // 这个请求会在 300ms 后发出
setTimeout(() => search("apple phon"), 600); // 停止 300ms 后，这个请求会在 900ms 左右发出
