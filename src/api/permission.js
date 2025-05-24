import { request } from "@/utils/request";

export function getMenuList() {
  return request.get({
    url: "/get-menu-list-i18n",
  });
}
