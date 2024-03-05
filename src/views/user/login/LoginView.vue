<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { WechatOutlined } from '@ant-design/icons-vue'
import { gsap } from 'gsap'
import { getCaptcha, registerApi } from './api'

const user = useUserStore()

// const { tt } = useLocalI18n()
interface IState {
  email: string
  password: string
  captcha: string
}

const state = reactive<IState>({
  email: '',
  password: '',
  captcha: ''
})
const src = ref()
function transformArrayBufferToBase64(buffer: any) {
  let binary = ''
  let bytes = new Uint8Array(buffer)
  for (let len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
function getImg() {
  getCaptcha().then((res) => {
    let temp = transformArrayBufferToBase64(res) // 将ArrayBuffer 转成base64
    src.value = `data:image/png;base64,${temp}` //这个数据就可以渲染到img标签中
  })
}
onMounted(() => {
  getImg()
})

const onFinish = async (values: IState) => {
  Object.values(values).length === 3 ? await user.login(values) : await registerApi(values)
}

onMounted(() => {
  gsap.to('.img', {
    rotation: 55, // 顺时针旋转90度
    duration: 1.5, // 动画持续时间
    onComplete: () => {
      // 在第一个动画完成后执行第二个动画
      gsap.to('.img', {
        rotation: -100, // 逆时针旋转180度
        duration: 1.5,
        ease: 'back.in',
        repeat: -1, // 无限循环
        yoyo: true // 反复播放
      })
    },
    ease: 'elastic'
  })
})
</script>

<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box_left">
        <a-avatar :size="{ xs: 200, sm: 250, md: 350, lg: 450, xl: 550, xxl: 650 }" style="background: transparent">
          <template #icon>
            <img alt="logo" class="img" src="https://cdn.jsdelivr.net/gh/xoxosos/jsDelivr/assets/images/moon.png" />
          </template>
        </a-avatar>
        <div>
          <a-avatar :size="{ xs: 150, sm: 200, md: 300, lg: 350, xl: 450, xxl: 550 }" style="background: transparent">
            <template #icon>
              <img alt="logo" class="img" src="https://cdn.jsdelivr.net/gh/xoxosos/jsDelivr/assets/images/man.png" />
            </template>
          </a-avatar>
        </div>
      </div>
      <div class="login-box_right">
        <h2 class="title">Welcome to Ace Admin :(</h2>
        <a-form :model="state" autocomplete="off" class="custom-form" @finish="onFinish">
          <a-form-item name="email" placeholder="用户名:如 admin@qq.com">
            <a-input size="large" v-model:value="state.email"></a-input>
          </a-form-item>
          <a-form-item name="password" placeholder="密码:任意填">
            <a-input-password size="large" v-model:value="state.password" />
          </a-form-item>
          <a-form-item name="captcha">
            <a-input class="captcha-input" size="large" v-model:value="state.captcha"></a-input>
            <img :src @click="getImg()" alt="logo" />
          </a-form-item>
          <a-divider>
            <a-typography-text type="secondary">忘记密码</a-typography-text>
          </a-divider>
          <a-form-item>
            <a-button html-type="submit" style="width: 100%" type="primary">登录</a-button>
          </a-form-item>
          <a-divider>
            <a-typography-text type="secondary">通过以下方式登录</a-typography-text>
          </a-divider>
          <a-form-item>
            <div class="extra-login">
              <a>
                <wechat-outlined style="font-size: 40px; color: #24bf24" />
              </a>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: #0000ff; /*设置文字颜色*/
  text-decoration: none;
  animation: shine 2.4s infinite; /*设置动画*/
}

.login {
  display: flex;
  height: 100vh;
  margin: 0;
  background-color: #abc6f8;
  background-image: radial-gradient(closest-side, rgb(255, 255, 255), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, rgb(250, 203, 203), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(237, 252, 202), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(197, 248, 241), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(206, 200, 243), rgba(248, 192, 147, 0));
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;

  &-box {
    flex-wrap: wrap;
    margin: auto;
    display: flex;
    align-items: center;
    width: 90%;
    height: 85%;
    justify-content: space-around;
    border-radius: 30px;
    transition: all 0.8s cubic-bezier(0.15, 0.83, 0.66, 1);
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow:
      2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
      6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
      12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
      22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
      41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
      100px 100px 80px rgba(0, 0, 0, 0.07);

    &_left {
      position: relative;

      div {
        position: absolute;
        top: 20px;
        left: 15px;
      }
    }

    &_right {
      .extra-login {
        text-align: center;
      }

      h2 {
        text-align: center;
      }

      :deep(.ant-btn-primary) {
        height: 35px;
        font-size: 15px;
      }

      input,
      :deep(.ant-input-password) {
        height: 35px;
        width: 300px;
        border: none;
      }

      .captcha-input {
        width: 200px;
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

@keyframes movement {
  0%,
  100% {
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }
  25% {
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }
  50% {
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }
  75% {
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}
</style>
