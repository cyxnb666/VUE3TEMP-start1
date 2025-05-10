<template>
  <div class="LoginView">
    <div class="LoginBox">
      <div class="LoginBox-title">
        <div>管理平台</div>
      </div>
      <div class="loginForm">
        <div class="formBox">
          <div class="formBox-header">
            <div class="title">用户登录</div>
          </div>
          <div class="tips">请输入账号和密码</div>
          <a-form :model="loginForm" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item name="username" :rules="[{ required: true, message: '请输入账号!' }]">
              <a-input placeholder="请输入账号" v-model:value="loginForm.username" />
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
              <a-input-password placeholder="请输入密码" v-model:value="loginForm.password" />
            </a-form-item>

            <a-form-item name="verifyCode" :rules="[{ required: true, message: '请输入验证码!' }]">
              <div style="display: flex; align-items: center;">
                <a-input placeholder="请输入验证码" v-model:value="loginForm.verifyCode" style="flex: 1; margin-right: 10px;" />
                <img 
                  v-if="verifyCodeUrl" 
                  :src="verifyCodeUrl" 
                  alt="验证码" 
                  @click="refreshVerifyCode" 
                  style="height: 40px; cursor: pointer;"
                />
              </div>
            </a-form-item>
            
            <a-form-item :wrapper-col="{ span: 24 }">
              <a-button class="submit" type="primary" html-type="submit" :loading="loading">登 录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { getVerifyCode, login } from './api';
import md5 from 'js-md5';

const router = useRouter();

// Generate a unique ID for the session
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const uuid = generateUUID();
const verifyCodeUrl = ref<string>('');
const loading = ref<boolean>(false);
const intervalTimer = ref<number | null>(null);

const loginForm = reactive({
  username: '',
  password: '',
  verifyCode: '',
  jsessionid: ''
});

// Refresh verification code
const refreshVerifyCode = async () => {
  try {
    const jsessionid = new Date().getTime() + uuid;
    loginForm.jsessionid = jsessionid;
    
    const response = await getVerifyCode(jsessionid);
    
    // Create a blob URL from the response
    const blob = new Blob([response], { type: 'image/jpeg' });
    
    // Revoke the old URL if it exists
    if (verifyCodeUrl.value) {
      URL.revokeObjectURL(verifyCodeUrl.value);
    }
    
    // Create a new object URL
    verifyCodeUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to refresh verification code:', error);
    message.error('获取验证码失败，请重试');
  }
};

const onFinish = async () => {
  loading.value = true;
  
  try {
    // Create the login payload with MD5 hashed password
    const loginParams = {
      userMobile: loginForm.username,
      cipher: md5(loginForm.password),
      verifyCode: loginForm.verifyCode,
      jsessionid: loginForm.jsessionid
    };
    
    // Call the login API
    const response = await login(loginParams);
    
    // Handle successful login
    message.success('登录成功');
    
    // Store the token in session storage
    if (response && response.token) {
      sessionStorage.setItem('token', response.token);
    }
    
    // Store user info if available
    if (response && response.userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(response.userInfo));
    }
    
    // Navigate to the dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    message.error('登录失败，请检查账号密码和验证码');
    refreshVerifyCode(); // Refresh code on failed login
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = () => {
  message.error('请填写完整的登录信息');
};

// Initialize verification code on component mount
onMounted(() => {
  refreshVerifyCode();
  
  // Refresh the verification code every 2 minutes
  intervalTimer.value = window.setInterval(() => {
    refreshVerifyCode();
  }, 1000 * 60 * 2);
});

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value);
  }
});
</script>

<style lang="scss" scoped>
.LoginView {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;

  .LoginBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 200px;

    &-title {
      padding-top: 20px;
      height: 570px;
      color: #333;
      font-weight: 600;
      font-size: 40px;
    }

    .loginForm {
      width: 580px;
      height: 570px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      .formBox {
        width: 570px;
        height: 560px;
        background-color: #FFFFFF;
        border-radius: 8px;
        padding: 36px 58px 52px;

        &-header {
          display: flex;
          align-items: center;

          .title {
            font-weight: 700;
            font-size: 24px;
            color: #333333;
          }
        }

        .tips {
          font-weight: 400;
          font-size: 18px;
          color: rgba(51, 51, 51, 0.6);
          margin-top: 45px;
          margin-bottom: 35px;
        }
      }
    }
  }
}

:deep(.ant-input-password .ant-input) {
  height: 46px;
}

:deep(.ant-form-item:first-child .ant-input) {
  height: 56px;
}

.submit {
  width: 100%;
  height: 56px;
  margin-top: 46px;
  border-radius: 2px;
}
</style>