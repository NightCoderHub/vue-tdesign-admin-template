import { request } from "@/utils/request";

// 获取路由列表（原有接口）
export function getRouteList() {
  return request.get({
    url: "/get-menu-list-i18n",
  });
}

// 新增路由接口（对应mock的 /route/add）
export function addRoute(data) {
  return request.post({
    url: "/route/add",
    data, // 传递路由信息（path、name、component等）
  });
}

// 更新路由接口（对应mock的 /route/update/:id）
export function updateRoute(routeId, data) {
  return request.put({
    url: `/route/update/${routeId}`, // 路径参数替换为实际ID
    data, // 传递需要更新的路由信息
  });
}

// 删除路由接口（对应mock的 /route/delete/:id）
export function deleteRoute(routeId) {
  return request.delete({
    url: `/route/delete/${routeId}`, // 路径参数替换为实际ID
  });
}
