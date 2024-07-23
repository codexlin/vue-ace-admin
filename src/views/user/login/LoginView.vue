<script lang="ts" setup>
import { WechatOutlined } from '@ant-design/icons-vue'
import { gsap } from 'gsap'
import { getCaptcha, registerApi } from './api'
import { useUserStore } from '@/stores/modules/user'
import Motion from '@/components/functional/Motion'

const user = useUserStore()
// const { tt } = useLocalI18n()
const state = reactive<ILoginForm>({
  email: '',
  password: '',
  captcha: ''
})
const src = ref()
const onFinish = async (values: ILoginForm) => {
  try {
    Object.values(values).length === 3 ? await user.login(values) : await registerApi(values)
  } catch (error) {
    await getImg()
  }
}

function transformArrayBufferToBase64(buffer: any) {
  // 将ArrayBuffer 转成base64
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

async function getImg() {
  try {
    const res = await getCaptcha<string>()
    const temp = transformArrayBufferToBase64(res)
    //渲染到img标签中
    src.value = `data:image/png;base64,${temp}`
  } catch (error) {
    console.trace(error)
  }
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
  getImg()
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
          <Motion :delay="300">
            <a-form-item name="email" placeholder="用户名:如 xoxosos666@gmail.com">
              <a-input v-model:value="state.email" size="large" />
            </a-form-item>
          </Motion>
          <Motion :delay="400">
            <a-form-item name="password" placeholder="密码:123456">
              <a-input-password v-model:value="state.password" size="large" />
            </a-form-item>
          </Motion>
          <Motion :delay="500">
            <a-form-item class="captcha" name="captcha">
              <a-input v-model:value="state.captcha" class="captcha-input" size="large" />
              <img :src alt="logo" @click="getImg()" />
            </a-form-item>
          </Motion>
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
@keyframes shine {
  /* 创建动画 */

  0%,
  100% {
    color: #fff;
    text-shadow:
      0 0 10px #00f,
      0 0 10px #00f;
  }

  50% {
    text-shadow:
      0 0 10px #00f,
      0 0 40px #00f;
  }
}

@keyframes movement {
  0%,
  100% {
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
  }

  25% {
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0 -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
  }

  50% {
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0,
      20vmax 10vmax,
      30vmax 70vmax;
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
  }

  75% {
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0,
      -10vmax 10vmax,
      40vmax 60vmax;
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
  }
}

#logo {
  filter: blur(8px);
}

.title {
  color: #00f; /* 设置文字颜色 */
  text-decoration: none;
  animation: shine 2.4s infinite; /* 设置动画 */
}

.login {
  display: flex;
  height: 100vh;
  margin: 0;
  background-color: #abc6f8;
  background-image: radial-gradient(closest-side, rgb(255 255 255), rgb(235 105 78 / 0%)),
    radial-gradient(closest-side, rgb(250 203 203), rgb(243 11 164 / 0%)),
    radial-gradient(closest-side, rgb(237 252 202), rgb(254 234 131 / 0%)),
    radial-gradient(closest-side, rgb(197 248 241), rgb(170 142 245 / 0%)),
    radial-gradient(closest-side, rgb(206 200 243), rgb(248 192 147 / 0%));
  background-repeat: no-repeat;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  animation: 10s movement linear infinite;

  :deep(.ant-input-affix-wrapper) {
    background-color: #fff;
  }

  :deep(.ant-input) {
    color: dimgray;
    background-color: #fff;
  }

  &-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    width: 90%;
    height: 85%;
    margin: auto;
    background-color: rgb(255 255 255 / 40%);
    border-radius: 30px;
    box-shadow:
      2.8px 2.8px 2.2px rgb(0 0 0 / 2%),
      6.7px 6.7px 5.3px rgb(0 0 0 / 2.8%),
      12.5px 12.5px 10px rgb(0 0 0 / 3.5%),
      22.3px 22.3px 17.9px rgb(0 0 0 / 4.2%),
      41.8px 41.8px 33.4px rgb(0 0 0 / 5%),
      100px 100px 80px rgb(0 0 0 / 7%);
    transition: all 0.8s cubic-bezier(0.15, 0.83, 0.66, 1);

    &_left {
      position: relative;

      div {
        position: absolute;
        top: 20px;
        left: 15px;
      }
    }

    &_right {
      @media (width <= 768px) {
        input,
        :deep(.ant-input-password) {
          width: 280px;
        }
      }

      @media (width <= 380px) {
        input,
        :deep(.ant-input-password) {
          width: 200px;
        }
      }

      .extra-login {
        text-align: center;

        a {
          cursor: pointer;
        }
      }

      h2 {
        text-align: center;
        text-shadow: 0 1px 2px 0 rgb(135 76 255 / 30%);
        letter-spacing: 0.02em;
        background: linear-gradient(98deg, #741bfe 0%, #f224fd 54%, #fc4b34 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      :deep(.ant-btn-primary) {
        height: 35px;
        font-size: 15px;
      }

      input,
      :deep(.ant-input-password) {
        width: 300px;
        height: 35px;
        border: none;
      }

      .captcha {
        :deep(.ant-form-item-control-input-content) {
          display: flex;
          gap: 1px;
        }

        .captcha-input {
          width: 200px;

          & + img {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
