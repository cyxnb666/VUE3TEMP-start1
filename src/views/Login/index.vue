<template>
  <div class="login-container">
    <a-form :model="loginForm" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <!-- 租户编码 -->
      <a-form-item name="tenantCode" :rules="[{ required: true, message: '请输入租户编码!' }]">
        <a-input placeholder="请输入租户编码" v-model:value="loginForm.tenantCode">
          <template #prefix><apartment-outlined /></template>
        </a-input>
      </a-form-item>

      <!-- 用户名 -->
      <a-form-item name="username" :rules="[{ required: true, message: '请输入账号!' }]">
        <a-input placeholder="请输入账号" v-model:value="loginForm.username">
          <template #prefix><user-outlined /></template>
        </a-input>
      </a-form-item>

      <!-- 密码 -->
      <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password placeholder="请输入密码" v-model:value="loginForm.password">
          <template #prefix><lock-outlined /></template>
        </a-input-password>
      </a-form-item>

      <!-- 验证码 -->
      <a-form-item name="verificationCode" :rules="[{ required: true, message: '请输入验证码!' }]">
        <div style="display: flex;">
          <a-input placeholder="请输入验证码" v-model:value="loginForm.verificationCode" style="flex: 1; margin-right: 10px;">
            <template #prefix><safety-outlined /></template>
          </a-input>
          <img :src="verifyCodeUrl" style="width: 100px; height: 40px; cursor: pointer;" alt="验证码" @click="refreshVerifyCode" />
        </div>
      </a-form-item>
      
      <!-- 登录按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">登 录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  ApartmentOutlined
} from '@ant-design/icons-vue';
import { getVerifyCode, login } from './api';
import { MD5 } from 'crypto-js';

const router = useRouter();
const route = useRoute();
const verifyCodeUrl = ref('');

interface FormState {
  tenantCode: string;
  username: string;
  password: string;
  verificationCode: string;
}

const loading = ref<boolean>(false);
const loginForm = reactive<FormState>({
  tenantCode: '',
  username: '',
  password: '',
  verificationCode: ''
});

// 刷新验证码
const refreshVerifyCode = async () => {
  try {
    const blob = await getVerifyCode();

    // 如果存在旧URL，释放它
    if (verifyCodeUrl.value) {
      URL.revokeObjectURL(verifyCodeUrl.value);
    }

    // 创建新的Blob URL
    const newUrl = URL.createObjectURL(new Blob([blob], { type: 'image/png' }));
    verifyCodeUrl.value = newUrl;
  } catch (error) {
    console.error('验证码获取失败:', error);
  }
};

// 从URL获取租户编码并填充
onMounted(() => {
  // 检查URL中是否有code参数
  const codeParam = route.query.code;
  if (codeParam) {
    loginForm.tenantCode = codeParam as string;
  }

  // 加载验证码
  refreshVerifyCode();
});

// 释放验证码Blob URL
onBeforeUnmount(() => {
  if (verifyCodeUrl.value) {
    URL.revokeObjectURL(verifyCodeUrl.value);
  }
});

const onFinish = async () => {
  loading.value = true;

  try {
    const encryptedPassword = MD5(loginForm.password).toString();
    
    const res = await login({
      tencentCode: loginForm.tenantCode,
      userAccount: loginForm.username,
      cipher: encryptedPassword,
      verifyCode: loginForm.verificationCode
    });

    if (res) {
      message.success('登录成功');

      // 存储返回的数据
      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('userInfo', JSON.stringify({
        username: res.userName,
        usercode: res.accountNo,
        tenantCode: res.tencentCode,
        tenantName: res.tencentCode,
        roleCode: res.roleCode,
        userMobile: res.userMobile
      }));
      
      // 保存菜单权限
      sessionStorage.setItem('menus', JSON.stringify(res.menus));
      
      // 直接跳转到 dashboard
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('登录失败:', error);
    // 刷新验证码
    refreshVerifyCode();
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = () => {
  message.error('请填写完整的登录信息');
};
</script>