import { useUserStore } from "@/store"; // 假设用户权限存储在 user store 中

export default {
  // 元素挂载时检查权限
  mounted(el, { value }) {
    const userStore = useUserStore();
    const permissions = userStore.permissions || []; // 用户权限列表（如 ['edit', 'view']）
    const targetPermission = value; // 需要检查的权限标识（如 'edit'）

    // 如果用户无权限，则隐藏元素
    if (!permissions.includes(targetPermission)) {
      el.style.display = "none";
    }
  },
  // 权限更新时重新检查（如用户权限动态变更）
  updated(el, { value }) {
    const userStore = useUserStore();
    const permissions = userStore.permissions || [];
    const targetPermission = value;

    el.style.display = permissions.includes(targetPermission) ? "inline-block" : "none";
  },
};
