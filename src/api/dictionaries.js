import request from "@/request/axiosInstance.js";

// 获取字典列表
export function getDictionaryList(params) {
  return request({
    url: "/api/dictionaries",
    params,
    method: "get",
  });
}

// 新增字典
export function addDictionary(data) {
  return request({
    url: "/api/dictionaries",
    data,
    method: "post",
  });
}

// 更新字典（根据ID）
export function updateDictionary(dictId, data) {
  return request({
    url: `/api/dictionaries/${dictId}`,
    data,
    method: "put",
  });
}

// 删除字典（根据ID）
export function deleteDictionary(dictId) {
  return request({
    url: `/api/dictionaries/${dictId}`,
    method: "delete",
  });
}

// 查询字典项（根据ID）

export function getDictionaryItemList(dictCode) {
  return request({
    url: `/api/dictionaries/items`,
    params: {
      dictCode,
    },
    method: "get",
  });
}
