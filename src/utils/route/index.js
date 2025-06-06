import { cloneDeep } from "lodash-es";

import { BLANK_LAYOUT, EXCEPTION_COMPONENT, IFRAME, PAGE_NOT_FOUND_ROUTE, PARENT_LAYOUT } from "@/utils/route/constant";
import LayoutComponent from "@/layouts/index.vue";
const LayoutMap = new Map();

LayoutMap.set("BLANK", BLANK_LAYOUT);
LayoutMap.set("IFRAME", IFRAME);

let dynamicViewsModules;

// 动态引入路由组件
function asyncImportRoute(routes) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob("../../pages/**/*.vue");
  if (!routes) return;

  routes.forEach(async (item) => {
    const { component, name } = item;
    const { children } = item;

    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(dynamicViewsModules, component);
      }
    } else if (name) {
      item.component = PARENT_LAYOUT();
    }

    children && asyncImportRoute(children);
  });
}

function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace("../../pages", "");
    const startFlag = component.startsWith("/");
    const endFlag = component.endsWith(".vue") || component.endsWith(".tsx");
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf(".");
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    throw new Error(
      "Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure",
    );
  } else {
    console.warn(`Can't find ${component} in pages folder`);
  }
  return EXCEPTION_COMPONENT;
}

// 将背景对象变成路由对象
export function transformObjectToRoute(routeList) {
  routeList.forEach(async (route) => {
    const component = route.component;

    if (component) {
      if (component.toUpperCase() === "LAYOUT") {
        route.component = LayoutComponent;
      } else {
        route.children = [cloneDeep(route)];
        route.component = LayoutComponent;
        route.name = `${route.name}Parent`;
        route.path = "";
        route.meta = route.meta || {};
      }
    } else {
      throw new Error("component is undefined");
    }

    route.children && asyncImportRoute(route.children);
  });

  return [PAGE_NOT_FOUND_ROUTE, ...routeList];
}
