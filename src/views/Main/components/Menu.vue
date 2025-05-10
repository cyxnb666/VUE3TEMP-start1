<template>
  <div class="MenuView">
    <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" @click="clickMenu" mode="inline"
      :items="state.items"></a-menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, h, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 预加载 SVG 图标文件
const iconModules = import.meta.glob('../../../assets/images/*.svg', { eager: true });

const router = useRouter();
const route = useRoute();

interface stateType {
  selectedKeys: string[];
  openKeys: string[];
  preOpenKeys: string[];
  items: Array<any>;
}

const state = reactive<stateType>({
  selectedKeys: [],
  openKeys: [],
  preOpenKeys: [],
  items: []
});

const props = defineProps({
  isCollapse: Boolean
});

// 根据路由表设置菜单项
const setRoutes = () => {
  const mainRoute = router.options.routes.find(route => route.name === 'Main');
  if (!mainRoute || !mainRoute.children) return;

  const traverse = (array: any[]): Array<any> => {
    return array.map((item: any) => {
      const { children, meta } = item;

      // 获取图标 URL
      const getIconUrl = (iconName) => {
        // 尝试通过glob获取图标
        const iconPath = `../../../assets/images/${iconName}.svg`;
        if (iconModules[iconPath]) {
          return iconModules[iconPath].default;
        }
        // 回退方案：如果找不到图标，可以返回一个默认图标
        console.warn(`Icon not found: ${iconName}`);
        return '';
      };

      let iconUrl = '';
      let selectedIconUrl = '';

      if (meta?.icon) {
        iconUrl = getIconUrl(meta.icon);

        // 尝试获取选中状态的图标，如果没有就使用普通图标
        const selectedIconPath = `../../../assets/images/selected_${meta.icon}.svg`;
        if (iconModules[selectedIconPath]) {
          selectedIconUrl = iconModules[selectedIconPath].default;
        } else {
          selectedIconUrl = iconUrl;
        }
      }

      return {
        key: item.name,
        label: meta?.title || item.name,
        title: meta?.title || item.name,
        icon: meta?.icon ? (value: any) => {
          const selectedKey = state.selectedKeys[0];
          const key = value.children && value.children.length
            ? value.children.find((subItem: any) => subItem.key === selectedKey)?.key
            : value.key;

          // 根据是否选中使用不同的图标
          const url = selectedKey === key ? selectedIconUrl : iconUrl;

          if (url) {
            return h('img', { src: url, width: '16px', height: '16px', class: 'menu-icon' });
          }

          // 如果没有图标，可以使用一个默认图标或返回 null
          return null;
        } : null,
        children: children && children.length ? traverse(children) : null,
      };
    });
  };

  state.items = traverse(mainRoute.children);
};

// 菜单点击事件
const clickMenu = (item: any) => {
  const { key } = item;
  router.push({ name: key });
};

// 监听 openKeys 变化
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);

// 监听路由变化，更新 selectedKeys
watch(
  () => route,
  (_val) => {
    state.selectedKeys = [_val.name as string];
  },
  { deep: true, immediate: true }
);

// 处理折叠状态变化
watch(
  () => props.isCollapse,
  (val) => {
    if (val) {
      state.preOpenKeys = [...state.openKeys];
      state.openKeys = [];
    } else {
      state.openKeys = [...state.preOpenKeys];
    }
  }
);

onMounted(() => {
  const { name, matched } = route;
  state.selectedKeys = [name as string];

  // 根据当前路由路径设置初始展开的菜单
  if (matched.length > 2) {
    state.openKeys = matched.slice(1, matched.length - 1).map((item: any) => item.name);
  }

  setRoutes();
});
</script>

<style lang="scss" scoped>
.MenuView {
  width: 100%;
  height: calc(100vh - 64px - 48px);
  overflow-y: auto;
}

:deep(.ant-menu-title-content) {
  text-align: start;
}

.menu-icon {
  margin-right: 8px;
}
</style>