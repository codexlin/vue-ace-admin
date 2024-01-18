<script lang="ts" setup>
import StatisticCard from '@/components/statistic/StatisticCard.vue'
import { ArrowDownOutlined, ArrowUpOutlined, HomeOutlined } from '@ant-design/icons-vue'
import type { EChartsOption } from 'echarts'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { h } from 'vue'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, PieChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const option = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
})
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30
const tabList = [
  {
    key: 'tab1',
    tab: 'tab1'
  },
  {
    key: 'tab2',
    tab: 'tab2'
  }
]
const key = ref('tab1')
const noTitleKey = ref('app')

const onTabChange = (value: string, type: string) => {
  console.log(value, type)
  if (type === 'key') {
    key.value = value
  } else if (type === 'noTitleKey') {
    noTitleKey.value = value
  }
}
// pie
const tab1Option = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const barOption = ref({
  title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
})

interface DataItem {
  title: string
}

const data: DataItem[] = [
  {
    title: 'Ant Design Title 1'
  },
  {
    title: 'Ant Design Title 2'
  },
  {
    title: 'Ant Design Title 3'
  },
  {
    title: 'Ant Design Title 4'
  }
]
const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]

const tableData = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park'
  }
]
</script>
<template>
  <div>
    <div class="flex-cards">
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
    <div class="flex-cards">
      <a-card
        :active-tab-key="key"
        :tab-list="tabList"
        class="flex-cards_left"
        title="Card title"
        @tabChange="(key) => onTabChange(key, 'key')"
      >
        <template #customTab="item">
          <span v-if="item.key === 'tab1'">
            <home-outlined />
            {{ item.key }}
          </span>
        </template>
        <template #extra>
          <a href="#">More</a>
        </template>
        <template v-if="key === 'tab1'">
          <v-chart :option="option as EChartsOption" autoresize class="chart" />
        </template>
        <template v-if="key === 'tab2'">
          <v-chart :option="barOption as EChartsOption" autoresize class="chart" />
        </template>
      </a-card>
      <a-card class="flex-cards_right">
        <v-chart :option="tab1Option as EChartsOption" autoresize class="chart" />
      </a-card>
    </div>
    <div class="flex-cards">
      <a-card class="flex-cards_right">
        <a-list :data-source="data" item-layout="horizontal">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              >
                <template #title>
                  <a href="https://www.antdv.com/">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
      <a-card class="flex-cards_left">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" bordered>
          <template #bodyCell="{ text, column }: any">
            <template v-if="column.dataIndex === 'name'">
              <a>{{ text }}</a>
            </template>
          </template>
          <template #title>Header</template>
          <template #footer>Footer</template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
