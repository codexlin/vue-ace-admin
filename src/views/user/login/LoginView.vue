<script lang="ts" setup>
import useLocalI18n from '@/hooks/useLocalI18n'
import { useUserStore } from '@/stores/modules/user'
import { registerApi } from '@/views/user/login/api'
import { GithubOutlined, GoogleOutlined, WechatOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from 'vue'
import BasicButton from '@/components/button/components/BasicButton.vue'

const user = useUserStore()

const rightPanelActive = ref(false)

const toggleRightPanel = () => {
  rightPanelActive.value = !rightPanelActive.value
}
const { tt } = useLocalI18n()
interface FormState {
  username: string
  password: string
  email: string
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  email: ''
})
const onFinish = async (values: any) => {
  console.log('Success:', values)
  Object.values(values).length === 2 ? await user.login(values) : await registerApi(values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
  return false
}
</script>

<template>
  <div class="login">
    <h2>{{ tt('login.title') }}</h2>
    <div :class="{ 'right-panel-active': rightPanelActive }" class="container">
      <div class="form-container sign-up-container">
        <a-form
          :model="formState"
          class="login-form"
          name="normal_login"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <h1>{{ tt('login.createAccount') }}</h1>
          <div class="social-container">
            <a class="social" href="#"><WechatOutlined /></a>
            <a class="social" href="#"><GithubOutlined /></a>
            <a class="social" href="#"><GoogleOutlined /></a>
          </div>
          <span>{{ tt('login.orUseEmail') }}</span>
          <a-form-item :rules="[{ required: true, message: 'Please input your username!' }]" name="username">
            <a-input v-model:value="formState.username" :placeholder="tt('login.username')" />
          </a-form-item>
          <a-form-item name="email">
            <a-input v-model:value="formState.email" :placeholder="tt('login.email')" />
          </a-form-item>
          <a-form-item :rules="[{ required: true, message: 'Please input your password!' }]" name="password">
            <a-input v-model:value="formState.password" :placeholder="tt('login.password')" type="password" />
          </a-form-item>
          <BasicButton auto-loading html-type="submit" type="primary">{{ tt('login.signUp') }}</BasicButton>
        </a-form>
      </div>
      <div class="form-container sign-in-container">
        <a-form
          :model="formState"
          class="login-form"
          name="normal_login"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <h1>{{ tt('login.logIn') }}</h1>
          <div class="social-container">
            <a class="social" href="#"><WechatOutlined /></a>
            <a class="social" href="#"><GithubOutlined /></a>
            <a class="social" href="#"><GoogleOutlined /></a>
          </div>
          <span>{{ tt('login.orUseAccount') }}</span>
          <a-form-item :rules="[{ required: true, message: 'Please input your email!' }]" name="email">
            <a-input v-model:value="formState.email" :placeholder="tt('login.email')" />
          </a-form-item>
          <a-form-item :rules="[{ required: true, message: 'Please input your password!' }]" name="password">
            <a-input v-model:value="formState.password" :placeholder="tt('login.password')" type="password" />
          </a-form-item>
          <a href="#">{{ tt('login.forgotPassword') }}</a>
          <BasicButton auto-loading html-type="submit" type="primary">{{ tt('login.logIn') }}</BasicButton>
        </a-form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>{{ tt('login.welcomeBack') }}</h1>
            <p>{{ tt('login.keepConnected') }}</p>
            <a-button ghost style="border: 1px solid #f3f3f3; color: #f3f3f3" @click="toggleRightPanel">{{
              tt('login.logIn')
            }}</a-button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>{{ tt('login.helloFriend') }}</h1>
            <p>{{ tt('login.enterDetails') }}</p>
            <a-button ghost style="border: 1px solid #f3f3f3; color: #f3f3f3" @click="toggleRightPanel">{{
              tt('login.signUp')
            }}</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

.login {
  background: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);
  display: flex;
  color: black !important;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  h1 {
    color: coral;
    font-weight: bold;
    margin: 0;
  }

  h2 {
    text-align: center;
  }

  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
  }

  span {
    color: black;
    font-size: 12px;
  }

  a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
  }
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  & .ant-form-item {
    margin-bottom: 0;
  }
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #ff416c;
  background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
  a {
    border: 1px solid #dddddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
  }
}

button {
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 0 50px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
}
.login-form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.ant-input {
  background-color: #eee;
  border: none;
  padding: 10px 15px;
  margin: 6px 0;
  width: 100%;
  &::placeholder {
    color: #d7c9b4;
  }
}
</style>
