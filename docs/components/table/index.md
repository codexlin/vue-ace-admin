---
title: ProTable 表格
description: 增强版表格组件，支持斑马纹和卡片包装器
---

# ProTable 表格

ProTable 是基于 Ant Design Vue 的 Table 组件扩展的增强版表格，提供了斑马纹样式和卡片包装器等额外功能。

## 代码示例

### 基础用法

基础的表格用法，支持所有原生表格的属性和方法。

```vue
<template>
  <ProTable :tableProps="tableProps" />
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'

const tableProps = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ],
  dataSource: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园2号',
    },
  ],
}
</script>
```

### 斑马纹样式

支持斑马纹样式，可选值为 'even'（偶数行着色）、'odd'（奇数行着色）或 'none'（无斑马纹）。

```vue
<template>
  <div>
    <h3>偶数行斑马纹</h3>
    <ProTable :isZebra="'even'" :tableProps="tableProps" />
    <h3>奇数行斑马纹</h3>
    <ProTable :isZebra="'odd'" :tableProps="tableProps" />
    <h3>无斑马纹</h3>
    <ProTable :isZebra="'none'" :tableProps="tableProps" />
  </div>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'

const tableProps = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ],
  dataSource: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园2号',
    },
    {
      key: '3',
      name: '李小明',
      age: 25,
      address: '朝阳区北苑路3号',
    },
    {
      key: '4',
      name: '王小红',
      age: 30,
      address: '海淀区中关村大街1号',
    },
  ],
}
</script>
```

### 卡片包装器

表格默认使用卡片包装，可以通过 `useCardWrapper` 属性控制。

```vue
<template>
  <div>
    <h3>使用卡片包装（默认）</h3>
    <ProTable :useCardWrapper="true" :tableProps="tableProps" />
    <h3>不使用卡片包装</h3>
    <ProTable :useCardWrapper="false" :tableProps="tableProps" />
  </div>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'

const tableProps = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ],
  dataSource: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园2号',
    },
  ],
}
</script>
```

### 工具栏插槽

ProTable 支持 toolbar 插槽，用于在表格上方添加工具栏。

```vue
<template>
  <ProTable :tableProps="tableProps">
    <template #toolbar>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3>用户列表</h3>
        </div>
        <div>
          <button style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">新增用户</button>
        </div>
      </div>
    </template>
  </ProTable>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'

const tableProps = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ],
  dataSource: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园2号',
    },
  ],
}
</script>
```

### 完整功能表格

结合所有功能的完整示例。

```vue
<template>
  <ProTable :isZebra="'odd'" :tableProps="tableProps">
    <template #toolbar>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3>完整功能表格示例</h3>
        </div>
        <div>
          <button style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">新增</button>
          <button style="padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">导出</button>
        </div>
      </div>
    </template>
    <template #operation="{ record }">
      <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
      <a-button type="link" size="small" danger @click="remove(record)">删除</a-button>
    </template>
  </ProTable>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const tableProps = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      key: 'operation',
      slots: { customRender: 'operation' },
    },
  ],
  dataSource: [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园2号',
    },
    {
      key: '3',
      name: '李小明',
      age: 25,
      address: '朝阳区北苑路3号',
    },
  ],
}

const edit = (record) => {
  message.info(`编辑用户: ${record.name}`)
}

const remove = (record) => {
  message.success(`删除用户: ${record.name}`)
}
</script>
```

### 实际应用场景

#### 数据列表管理

一个典型的用户数据管理表格，包含分页、筛选和操作等功能。

```vue
<template>
  <ProTable :isZebra="'even'" :tableProps="tableProps">
    <template #toolbar>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3>用户数据管理</h3>
        <div>
          <button style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">新增用户</button>
          <button style="padding: 8px 16px; background: #faad14; color: white; border: none; border-radius: 4px; cursor: pointer;">批量导入</button>
        </div>
      </div>
    </template>
    <template #status="{ text }">
      <span :style="{ color: text === 'active' ? '#52c41a' : '#ff4d4f' }">
        {{ text === 'active' ? '激活' : '禁用' }}
      </span>
    </template>
    <template #action="{ record }">
      <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
      <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
    </template>
  </ProTable>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'
import { message } from 'ant-design-vue'

const handleEdit = (record) => {
  message.info(`编辑用户: ${record.name}`)
}

const handleDelete = (record) => {
  message.success(`删除用户: ${record.name}`)
}

const tableProps = {
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      slots: { customRender: 'status' },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ],
  dataSource: [
    {
      key: '1',
      id: 1001,
      name: '张三',
      email: 'zhangsan@example.com',
      status: 'active',
      registerTime: '2023-01-15',
    },
    {
      key: '2',
      id: 1002,
      name: '李四',
      email: 'lisi@example.com',
      status: 'inactive',
      registerTime: '2023-02-20',
    },
    {
      key: '3',
      id: 1003,
      name: '王五',
      email: 'wangwu@example.com',
      status: 'active',
      registerTime: '2023-03-10',
    },
  ],
  pagination: {
    total: 3,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `总共 ${total} 条`,
  },
}
</script>
```

#### 报表展示

用于展示统计报表的表格，使用斑马纹提高可读性。

```vue
<template>
  <ProTable :isZebra="'odd'" :useCardWrapper="true" :tableProps="reportTableProps">
    <template #toolbar>
      <div style="margin-bottom: 16px;">
        <h3>月度销售报表</h3>
        <p>统计时间：2023年12月</p>
      </div>
    </template>
    <template #amount="{ text }">
      <span style="color: #1890ff; font-weight: bold;">¥{{ text.toLocaleString() }}</span>
    </template>
  </ProTable>
</template>

<script setup>
import { ProTable } from '@ace-admin/ui'

const reportTableProps = {
  columns: [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '销售数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '销售额',
      dataIndex: 'amount',
      key: 'amount',
      slots: { customRender: 'amount' },
    },
    {
      title: '销售占比',
      dataIndex: 'percentage',
      key: 'percentage',
      customRender: ({ text }) => `${text}%`,
    },
  ],
  dataSource: [
    {
      key: '1',
      productName: '产品A',
      quantity: 120,
      amount: 120000,
      percentage: 35,
    },
    {
      key: '2',
      productName: '产品B',
      quantity: 95,
      amount: 95000,
      percentage: 28,
    },
    {
      key: '3',
      productName: '产品C',
      quantity: 80,
      amount: 80000,
      percentage: 23,
    },
    {
      key: '4',
      productName: '产品D',
      quantity: 50,
      amount: 50000,
      percentage: 14,
    },
  ],
  bordered: true,
}
</script>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isZebra | 斑马纹样式，'even' 为偶数行着色，'odd' 为奇数行着色，'none' 为无斑马纹 | 'even' \| 'odd' \| 'none' | 'none' |
| useCardWrapper | 是否使用卡片包装器 | boolean | true |
| tableProps | 表格属性，继承 Ant Design Vue Table 的所有属性 | TableProps | - |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| toolbar | 表格工具栏，位于表格上方 |
| - | 继承 Ant Design Vue Table 的所有插槽，如自定义列内容等 |

### 继承属性

ProTable 继承了 Ant Design Vue Table 组件的所有属性，包括分页、排序、筛选、行选择等功能，详见 [Table API](https://www.antdv.com/components/table#api)。