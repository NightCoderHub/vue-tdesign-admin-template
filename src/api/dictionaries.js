import { request } from "@/utils/request";

// 获取字典列表
export function getDictionaryList(params) {
  return request.get({
    url: "/api/dictionaries",
    params,
  });
}

// 新增字典
export function addDictionary(data) {
  return request.post({
    url: "/api/dictionaries",
    data,
  });
}

// 更新字典（根据ID）
export function updateDictionary(dictId, data) {
  return request.put({
    url: `/api/dictionaries/${dictId}`,
    data,
  });
}

// 删除字典（根据ID）
export function deleteDictionary(dictId) {
  return request.delete({
    url: `/api/dictionaries/${dictId}`,
  });
}

// 查询字典项（根据ID）


export function getDictionaryItemList(dictCode) {
  return request.get({
    url: `/api/dictionaries/items`,
    params: {
      dictCode
    }
  });
}