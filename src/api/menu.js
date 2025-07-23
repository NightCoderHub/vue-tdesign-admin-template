import request from "@/request/axiosInstance.js";

// 获取菜单数据
export function getMenuData() {
  return request({
    url: "/api/menu-data",
    method: "get",
  });
}
