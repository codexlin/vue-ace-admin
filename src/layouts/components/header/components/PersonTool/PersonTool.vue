<script lang="ts" setup>
import { DownOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'

import { useUserStore } from '@/stores/modules/user'

const username = 'username'
const avatar = 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1'
const user = useUserStore()
const handleClick = async (item: any) => {
  if (item.key === 'logout') {
    await user.logout()
  }
}
</script>

<template>
  <a-dropdown>
    <div class="person-tool">
      <a-avatar :src="avatar" />
      <span class="person-tool__username">{{ username }} </span>
      <DownOutlined />
    </div>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="1">
          <span>
            个人信息
            <UserOutlined />
          </span>
        </a-menu-item>
        <a-menu-item key="2">
          <span>
            修改密码
            <LockOutlined />
          </span>
        </a-menu-item>
        <a-menu-item key="logout">
          <span> 退出登录 <logout-outlined /> </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped>
.person-tool {
  display: flex;
  align-items: center;

  &__username {
    padding: 0 4px 0 8px;
    font-size: 15px;
  }
}
</style>
