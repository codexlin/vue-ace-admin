<!--
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-09 21:24:22
 * @Description: 
-->
<template>
  <div class="test">dashboard</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '@/styles/theme';

.test {
  height: 20px;
  @include useTheme {
    // 定制
    background-color: getColor(primary);
  }
}
</style>
