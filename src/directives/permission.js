// src/directives/permission.js

import { useUserStore } from "@/store"; // 引入你的用户权限 Store

const permissionDirective = {
  // `mounted` 钩子：在绑定元素的父组件及自己的所有子组件都挂载完成后调用
  mounted(el, binding) {
    checkAndApplyPermission(el, binding);
  },

  // `updated` 钩子：在包含组件的 VNode 及其子 VNode 更新后调用
  // 主要用于当指令的绑定值 (binding.value) 或其他响应式数据变化时重新检查权限
  updated(el, binding) {
    // 优化：只有当指令的绑定值发生变化时才重新执行检查，避免不必要的性能开销
    if (binding.value !== binding.oldValue) {
      checkAndApplyPermission(el, binding);
    }
  },

  // `beforeUnmount` 钩子：在绑定元素的父组件卸载之前调用
  // 可以在这里进行一些清理工作，例如移除之前添加的事件监听器等
  beforeUnmount(el) {
    // 确保恢复元素原始的 display 样式，防止其他样式受影响
    if (el._originalDisplay !== undefined) {
      el.style.display = el._originalDisplay;
      delete el._originalDisplay; // 清理
    }
    // 对于 disabled 属性，如果之前是禁用的，也需要恢复
    if (el._originalDisabledState !== undefined) {
      el.disabled = el._originalDisabledState;
      delete el._originalDisabledState; // 清理
    }
    if (el._originalCursor !== undefined) {
      el.style.cursor = el._originalCursor;
      delete el._originalCursor;
    }
  },
};

/**
 * 权限校验的核心函数
 * @param {HTMLElement} el - 指令绑定到的 DOM 元素
 * @param {Object} binding - 绑定对象，包含指令的各种信息
 * - value: 指令的绑定值，即所需的权限标识符或数组 (e.g., 'user:add', ['user:edit', 'user:delete'])
 * - arg: 指令的参数 (e.g., v-permission:disabled -> 'disabled')
 * - modifiers: 指令的修饰符 (e.g., v-permission.and -> { and: true })
 * - instance: 使用该指令的组件实例
 */
function checkAndApplyPermission(el, binding) {
  // 1. 获取当前用户的权限列表
  const userStore = useUserStore();
  // 确保权限数据已加载。如果权限是异步加载的，这里需要等待加载完成。
  // 在实际应用中，通常会在路由守卫中确保权限加载完成再进入页面。
  const userPermissions = userStore.permissions || [];

  // 2. 获取指令所需的权限值 (可以是字符串或数组)
  let requiredPermissions = binding.value;

  // 确保 requiredPermissions 始终是一个数组，便于统一处理
  if (!Array.isArray(requiredPermissions)) {
    requiredPermissions = [String(requiredPermissions)]; // 确保转换为字符串
  }

  // 3. 执行权限校验
  let hasPermission = false;
  const modifiers = binding.modifiers || {}; // 获取所有修饰符

  if (requiredPermissions.length === 0) {
    // 如果没有指定任何权限，默认视为有权限显示（根据业务需求可调整）
    hasPermission = true;
  } else {
    if (modifiers.and) {
      // 启用 `.and` 修饰符：用户必须拥有所有列出的权限
      hasPermission = requiredPermissions.every((p) => userPermissions.includes(p));
    } else {
      // 默认 (或启用 `.or` 修饰符，尽管通常不显式写)：用户拥有任意一个列出的权限即可
      hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
    }
  }

  // 4. 根据校验结果操作 DOM 元素
  const actionType = binding.arg; // 获取指令参数，如 'disabled'

  if (!hasPermission) {
    // **用户没有权限**
    if (actionType === "disabled") {
      // 存储原始状态，以便在权限恢复时还原
      el._originalDisabledState = el.disabled;
      el._originalCursor = el.style.cursor;

      el.disabled = true; // 禁用元素
      el.style.cursor = "not-allowed"; // 设置鼠标样式为禁止
      // 可以选择性地添加一些额外的视觉反馈，例如 Tooltip 提示无权限
      // el.setAttribute('title', '您没有操作权限');
    } else {
      // 默认操作：隐藏元素
      // 存储原始的 display 样式，以便在权限恢复时还原
      el._originalDisplay = el.style.display;
      el.style.display = "none";
    }
  } else {
    // **用户有权限**
    if (actionType === "disabled") {
      // 恢复元素的原始禁用状态和鼠标样式
      if (el._originalDisabledState !== undefined) {
        el.disabled = el._originalDisabledState;
        el.style.cursor = el._originalCursor;
        delete el._originalDisabledState;
        delete el._originalCursor;
      } else {
        // 如果没有原始状态（表示之前没有被禁用过），确保它不被禁用
        el.disabled = false;
        el.style.cursor = "";
      }
      // el.removeAttribute('title');
    } else {
      // 恢复元素的原始 display 样式
      if (el._originalDisplay !== undefined) {
        el.style.display = el._originalDisplay;
        delete el._originalDisplay;
      } else {
        // 如果没有原始状态，确保其可见
        el.style.display = "";
      }
    }
  }
}

export default permissionDirective;
