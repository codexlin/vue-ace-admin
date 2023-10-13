<script lang="ts" setup>
import { DownOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const username = 'username'
const avatar = 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1'
defineOptions({
  name: 'PersonTool'
})
</script>

<template>
  <a-dropdown>
    <div class="header-avatar">
      <a-avatar :src="avatar" />
      <span style="padding: 0 4px 0 8px">{{ username }} </span>
      <DownOutlined />
    </div>
    <template #overlay>
      <a-menu @click="onClick">
        <a-menu-item key="1">个人信息</a-menu-item>
        <a-menu-item key="2">修改密码</a-menu-item>
        <a-menu-item key="logout">
          <span>
            退出登录
            <logout-outlined /> </span
        ></a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped></style>