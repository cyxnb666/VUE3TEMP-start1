<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { reactive } from "vue";

dayjs.locale("zh-cn");

const theme = reactive({
  token: {
    colorPrimary: '#46B180',
    colorLink: '#46B180',
  }
});
</script>
<style lang="scss">
html, body {
  height: 100%;
}

#app {
  height: 100%;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: rgba(0, 0, 0, .1);
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  background-color: #F6F7FA;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #ccc;
}

.ant-modal-content {
  padding: 0 !important;

  .ant-modal-close {
    top: 10px;
    color: #FFFFFF;
  }

  .ant-modal-header {
    background-color: #46B180;
    padding: 10px 20px;
    margin-bottom: 0;

    .ant-modal-title {
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .ant-modal-body {
    padding: 20px;
  }

  .ant-modal-footer {
    margin-top: 0;
    padding: 0 20px 10px 20px;
  }
}

.ant-btn, .ant-input-affix-wrapper, .ant-select-single .ant-select-selector, 
.ant-input-number, .ant-picker {
  border-radius: 2px;
}
</style>