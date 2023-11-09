<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description: 
-->
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { DownOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const username = 'username'
const avatar = 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1'
const user = useUserStore()
const handleClick = (item: any) => {
  item.key === 'logout' && user.logout()
}
</script>

<template>
  <a-dropdown>
    <div class="header-avatar">
      <a-avatar :src="avatar" />
      <span style="padding: 0 4px 0 8px">{{ username }} </span>
      <DownOutlined />
    </div>
    <template #overlay>
      <a-menu @click="handleClick">
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
