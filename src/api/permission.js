import request from "@/request/axiosInstance.js";

// 获取路由列表（原有接口）
export function getRouteList() {
  return request({
    url: "/get-menu-list",
    method: "get",
  });
}

// 新增路由接口（对应mock的 /route/add）
export function addRoute(data) {
  return request({
    url: "/route/add",
    data, // 传递路由信息（path、name、component等）
    method: "post",
  });
}

// 更新路由接口（对应mock的 /route/update/:id）
export function updateRoute(routeId, data) {
  return request({
    url: `/route/update/${routeId}`, // 路径参数替换为实际ID
    data, // 传递需要更新的路由信息
    method: "put",
  });
}

// 删除路由接口（对应mock的 /route/delete/:id）
export function deleteRoute(routeId) {
  return request({
    url: `/route/delete/${routeId}`, // 路径参数替换为实际ID
    method: "delete",
  });
}
