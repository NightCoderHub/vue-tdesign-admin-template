import { request } from "@/utils/request";

// 获取菜单数据
export function getMenuData() {
  return request.get({
    url: "/api/menu-data",
  });
}
