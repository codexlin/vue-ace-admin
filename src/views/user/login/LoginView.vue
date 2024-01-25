<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { gsap } from 'gsap'
import { registerApi } from './api'
const user = useUserStore()
// const { tt } = useLocalI18n()
interface IState {
  email: string
  password: string
}
const state = reactive<IState>({
  email: '',
  password: ''
})
const onFinish = async (values: IState) => {
  console.log('Success:', values)
  Object.values(values).length === 2 ? await user.login(values) : await registerApi(values)
}
onMounted(() => {
  gsap.to('.img', { rotation: 360, duration: 2, ease: 'bounce.out', repeat: Infinity })
})
</script>

<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box_left">
        <a-avatar style="background: transparent" :size="{ xs: 200, sm: 200, md: 250, lg: 300, xl: 350, xxl: 350 }">
          <template #icon>
            <img alt="logo" class="img" src="../../../assets/images/logo.svg" />
          </template>
        </a-avatar>
      </div>
      <div class="login-box_right">
        <h2 class="title">Welcome to Ace Admin</h2>
        <a-form autocomplete="off" @finish="onFinish" class="custom-form" :model="state">
          <a-form-item name="email" placeholder="用户名:如 admin@qq.com">
            <a-input v-model:value="state.email"></a-input>
          </a-form-item>
          <a-form-item name="password" placeholder="密码:任意填">
            <a-input-password v-model:value="state.password" />
          </a-form-item>
          <a-form-item>
            <span style="float: right">
              <a-typography-text type="secondary">忘记密码</a-typography-text>
            </span>
            <a-button html-type="submit" style="width: 100%" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  color: #0000ff; /*设置文字颜色*/
  text-decoration: none;
  animation: shine 2.4s infinite; /*设置动画*/
}
@keyframes shine {
  /*创建动画*/
  0%,
  100% {
    color: #fff;
    text-shadow:
      0 0 10px #0000ff,
      0 0 10px #0000ff;
  }
  50% {
    text-shadow:
      0 0 10px #0000ff,
      0 0 40px #0000ff;
  }
}

.login {
  display: flex;
  height: 100vh;
  background-color: #a81aa8;
  background-image: linear-gradient(72deg, #a81aa8 0%, #97d9e1 33%, #bb49ec 66%, #eeeeaa 100%);

  &-box {
    flex-wrap: wrap;
    margin: auto;
    display: flex;
    align-items: center;
    width: 80%;
    height: 80%;
    justify-content: space-evenly;
    border-radius: 23px;
    transition: all 0.8s cubic-bezier(0.15, 0.83, 0.66, 1);
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow:
      2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
      6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
      12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
      22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
      41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
      100px 100px 80px rgba(0, 0, 0, 0.07);

    &_right {
      :deep(.ant-btn-primary) {
        height: 35px;
        font-size: 15px;
      }

      input,
      :deep(.ant-input-password) {
        height: 35px;
        width: 350px;
      }

      @media (max-width: 768px) {
        input,
        :deep(.ant-input-password) {
          width: 280px;
        }
      }
      @media (max-width: 380px) {
        input,
        :deep(.ant-input-password) {
          width: 200px;
        }
      }
    }
  }
}
</style>
