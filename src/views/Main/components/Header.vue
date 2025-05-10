<template>
  <div class="HeaderView">
    <div class="projectIconAndTitle">
      <div class="projectTitle">管理系统</div>
    </div>
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        您好! {{ userName }}
        <down-outlined />
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:;" @click="outLogin">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const userName = ref('管理员');

const outLogin = async () => {
  try {
    // 清除登录信息（简化版不需要API调用）
    sessionStorage.clear();
    message.success('退出成功');
    // 跳转到登录页
    await router.push('/login');
  } catch (error) {
    console.error('退出失败:', error);
  }
};

onMounted(() => {
  // 从sessionStorage获取用户信息（如果存在）
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsedInfo = JSON.parse(userInfo);
      userName.value = parsedInfo.username || '管理员';
    } catch (e) {
      console.error('解析用户信息失败', e);
    }
  }
});
</script>

<style lang="scss" scoped>
.HeaderView {
  background-color: #46B180;
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .projectIconAndTitle {
    display: flex;
    align-items: center;
    margin-left: 20px;

    .projectTitle {
      color: #FFFFFF;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .ant-dropdown-link {
    color: #FFFFFF;
    margin-right: 20px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>