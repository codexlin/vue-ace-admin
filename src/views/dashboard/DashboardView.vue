<script lang="ts" setup>
import StatisticCard from '@/components/statistic/StatisticCard.vue'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
</script>
<template>
  <div class="flex-container">
    <div class="flex-card">
      <StatisticCard :prefix="h(ArrowUpOutlined)" :value-style="{ color: 'green' }" />
    </div>
    <div class="flex-card">
      <StatisticCard :prefix="h(ArrowDownOutlined)" :value-style="{ color: 'red' }" />
    </div>
    <div class="flex-card">
      <StatisticCard :prefix="h(ArrowUpOutlined)" :value-style="{ color: 'green' }" />
    </div>
    <div class="flex-card">
      <StatisticCard :prefix="h(ArrowUpOutlined)" :value-style="{ color: 'green' }" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
$gap: 8px;
.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; // 在大屏幕上居中显示
}

.flex-card {
  flex: 0 0 calc(25% - 2 * #{$gap}); // 使用#{}插值
  margin: $gap;
  box-sizing: border-box;
}

@media (768px< width < 1024px) {
  .flex-container {
    justify-content: flex-start; // 在中等屏幕上靠左显示
  }
  .flex-card {
    flex: 0 0 calc(50% - 2 * #{$gap}); // 在中等屏幕上每行显示2个
  }
}

@media (width < 768px) {
  .flex-container {
    justify-content: flex-start; // 在小屏幕上靠左显示
  }
  .flex-card {
    flex: 0 0 calc(100% - 2 * #{$gap}); // 在小屏幕上每行只显示1个
  }
}
</style>