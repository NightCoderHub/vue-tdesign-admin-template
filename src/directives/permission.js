import { useUserStore } from "@/store";

const permissionDirective = {
  // 当指令第一次绑定到元素时调用
  mounted(el, binding) {
    const { value } = binding; // value 可以是一个字符串（单个权限）或一个数组（多个权限）
    const userStore = useUserStore(); // 获取用户 store 实例

    // 获取用户实际拥有的权限列表
    const userPermissions = userStore.permissions || [];

    // 定义一个检查权限的函数
    const checkPermission = () => {
      if (!value) {
        // 如果没有传入权限值，默认显示按钮
        return true;
      }

      if (Array.isArray(value)) {
        // 如果是数组，表示需要用户拥有其中任意一个权限 (OR 关系)
        return value.some((permission) => userPermissions.includes(permission));
      } else if (typeof value === "string") {
        // 如果是字符串，表示需要用户拥有这个特定的权限
        return userPermissions.includes(value);
      } else {
        console.warn("[v-permission]: directive value must be a string or an array of strings.");
        return false; // 无效的权限值
      }
    };

    // 根据权限检查结果设置元素的显示或隐藏
    // 默认是隐藏，也可以根据修饰符（如 .disable）来决定是禁用还是隐藏
    if (!checkPermission()) {
      // 检查修饰符，例如 v-permission.disable="['edit']"
      if (binding.modifiers.disable) {
        el.disabled = true;
        el.style.cursor = "not-allowed"; // 鼠标样式
        // 也可以选择移除点击事件监听，防止通过其他方式触发
        el.setAttribute("data-original-click", el.onclick); // 备份原有点击事件
        el.onclick = null;
      } else {
        el.style.display = "none"; // 隐藏元素
      }
    } else {
      // 如果权限通过，确保元素是显示的并且没有被禁用
      el.style.display = "";
      el.disabled = false;
      el.style.cursor = "";
      if (el.hasAttribute("data-original-click")) {
        el.onclick = el.getAttribute("data-original-click");
        el.removeAttribute("data-original-click");
      }
    }

    // 将 checkPermission 函数挂载到元素上，方便 updated 钩子访问
    el.__vue_permission_check__ = checkPermission;
    el.__vue_permission_modifiers__ = binding.modifiers; // 存储修饰符
  },

  // 绑定元素的更新时调用（例如，用户权限改变时）
  updated(el, binding) {
    // 当权限值、用户权限或修饰符变化时，需要重新检查
    const { value } = binding;
    const userStore = useUserStore();
    const userPermissions = userStore.permissions || [];

    const oldUserPermissions = el.__vue_permission_user_permissions__ || []; // 存储旧的用户权限
    const oldModifiers = el.__vue_permission_modifiers__;

    // 简单判断是否需要重新执行 mounted 逻辑 (更严谨的判断可以比较数组内容)
    const hasPermissionChanged = JSON.stringify(userPermissions) !== JSON.stringify(oldUserPermissions);
    const hasValueChanged = JSON.stringify(value) !== JSON.stringify(binding.oldValue);
    const hasModifiersChanged = JSON.stringify(binding.modifiers) !== JSON.stringify(oldModifiers);

    if (hasPermissionChanged || hasValueChanged || hasModifiersChanged) {
      // 重新执行 mounted 逻辑来更新状态
      permissionDirective.mounted(el, binding);
    }

    // 更新存储的用户权限和修饰符，以便下次 updated 钩子进行比较
    el.__vue_permission_user_permissions__ = userPermissions;
    el.__vue_permission_modifiers__ = binding.modifiers;
  },

  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el) {
    // 清理可能添加的自定义属性
    if (el.__vue_permission_check__) {
      delete el.__vue_permission_check__;
      delete el.__vue_permission_modifiers__;
      delete el.__vue_permission_user_permissions__;
    }
  },
};

export default permissionDirective;
