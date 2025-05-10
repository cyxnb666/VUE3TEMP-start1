<template>
  <div class="not-found">
    <div class="content">
      <!-- <img src="../../assets/images/404.png" alt="404" class="not-found-img"> -->
      <h1>页面不存在或无权访问</h1>
      <p>您尝试访问的页面不存在或没有访问权限</p>
      <a-button type="primary" @click="goBack">返回上一页</a-button>
      <a-button @click="goHome" style="margin-left: 15px">返回首页</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  // 获取用户菜单权限
  const userMenus = JSON.parse(sessionStorage.getItem('menus') || '[]');
  
  // 找到第一个有效的二级菜单进行跳转
  const firstValidMenu = userMenus.find(menu => 
    menu.menuLevel === 2 && menu.parentMenuMappingName
  );

  if (firstValidMenu) {
    router.push(`/${firstValidMenu.parentMenuMappingName}/${firstValidMenu.menuMappingName}`);
  } else {
    // 如果没有找到有效菜单，回到登录页
    router.push('/login');
  }
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f0f2f5;

  .content {
    text-align: center;
    
    .not-found-img {
      width: 350px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 15px;
    }

    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
  }
}
</style>