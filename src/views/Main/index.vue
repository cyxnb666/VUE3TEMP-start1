<template>
  <div class="mainView">
    <a-layout class="layout">
      <a-layout-header class="headerStyle">
        <HeaderView :isCollapse="state.isCollapse" />
      </a-layout-header>
      <a-layout>
        <a-layout-sider :class="['siderStyle', { isCollapseStyle: state.isCollapse }]" v-model:collapsed="state.isCollapse"
          collapsible theme="light">
          <MenuView :isCollapse="state.isCollapse" />
        </a-layout-sider>
        <a-layout-content class="contentStyle">
          <a-tabs v-model:activeKey="state.menuKey" tab-position="top" @edit="tabEdit" @change="tabChange"
            :hideAdd="true" type="editable-card">
            <a-tab-pane v-for="item in state.selectMenuList" :key="item.name" :tab="item.meta?.title"
              :closable="state.selectMenuList.length !== 1"></a-tab-pane>
          </a-tabs>
          <div class="routerView">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from './components/Header.vue'
import MenuView from './components/Menu.vue'
import { onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { TabsProps } from "ant-design-vue";

const route = useRoute()
const router = useRouter()

interface stateType {
  isCollapse: boolean,
  menuKey: string,
  selectMenuList: Array<any>
}

const state = reactive<stateType>({
  isCollapse: false,
  menuKey: '',
  selectMenuList: [],
});

// 监听路由变化，更新标签页
watch(
  () => route,
  (newRoute) => {
    const obj = { ...newRoute }
    const flag = state.selectMenuList.some((item: any) => {
      return item.name === obj.name
    })
    if (!flag) state.selectMenuList.push(obj)
    state.menuKey = obj.name as string
  },
  { deep: true, immediate: true }
);

// 标签页编辑（关闭）
const tabEdit: TabsProps['onEdit'] = (val) => {
  const index = state.selectMenuList.findIndex((item: any) => {
    return item.name === val
  })
  
  if (index !== -1) {
    state.selectMenuList.splice(index, 1)

    if (state.selectMenuList.length > 0) {
      const newIndex = Math.min(index, state.selectMenuList.length - 1)
      const name = state.selectMenuList[newIndex].name
      router.push({name})
    }
  }
};

// 标签页切换
const tabChange: TabsProps['onChange'] = (val) => {
  router.push({ name: val as string })
};

onMounted(() => {
  // 初始化逻辑（如需要）
})
</script>

<style lang="scss" scoped>
.mainView {
  height: 100%;

  .layout {
    height: 100%;

    .siderStyle {
      text-align: center;
      color: #fff;
      background-color: #fff;
      flex: 0 0 220px !important;
      max-width: 220px !important;
      min-width: 220px !important;
      width: 220px !important;

      :deep(.ant-layout-sider-trigger) {
        width: 220px !important;
      }

      :deep(.ant-menu-item-selected) {
        background-color: #46B180 !important;
        color: #fff !important;
      }
    }

    .isCollapseStyle {
      text-align: center;
      color: #fff;
      background-color: #fff;
      flex: 0 0 80px !important;
      max-width: 80px !important;
      min-width: 80px !important;
      width: 80px !important;

      :deep(.ant-layout-sider-trigger) {
        width: 80px !important;
      }
    }

    .headerStyle {
      text-align: center;
      height: 64px;
      line-height: 64px;
      padding-inline: 0;
      color: #000;
      background-color: #fff;
    }

    .contentStyle {
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;

      :deep(.ant-tabs) {
        padding: 10px 20px 0 20px;

        .ant-tabs-nav {
          margin: 0;
        }
      }

      .routerView {
        height: calc(100% - 50px);
        background-color: #F3F5F9;
      }
    }
  }
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab,
      .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab) {
  border: none !important;
}
</style>