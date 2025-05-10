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

            <!-- 保留验证码位置的空间 -->
            <div style="height: 56px; margin-bottom: 20px;"></div>
            
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();

interface FormState {
  username: string;
  password: string;
}

const loading = ref<boolean>(false);
const loginForm = reactive<FormState>({
  username: '',
  password: '',
});

const onFinish = async () => {
    loading.value = true;
    
    // 模拟登录延迟
    setTimeout(() => {
        message.success('登录成功');
        
        // 直接跳转到主页
        router.push('/dashboard');
        
        loading.value = false;
    }, 500);
};

const onFinishFailed = () => {
  message.error('请填写完整的登录信息');
};
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