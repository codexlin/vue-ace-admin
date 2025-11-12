# ProButton & ProTable 使用指南

本文档展示了如何充分利用 ProButton 和 ProTable 组件，它们完全兼容 ant-design-vue 的原生功能，同时提供额外的增强特性。

## ProButton 使用示例

### 基础用法

ProButton 完全支持所有 a-button 的原生属性：

```vue
<template>
  <!-- 基础按钮，支持所有 a-button 属性 -->
  <ProButton type="primary" size="large" shape="round">
    基础按钮
  </ProButton>

  <!-- 危险按钮 -->
  <ProButton type="primary" danger>
    危险操作
  </ProButton>

  <!-- 幽灵按钮 -->
  <ProButton type="primary" ghost>
    幽灵按钮
  </ProButton>

  <!-- 加载状态 -->
  <ProButton type="primary" loading>
    加载中...
  </ProButton>

  <!-- 禁用状态 -->
  <ProButton disabled>
    禁用按钮
  </ProButton>

  <!-- 块级按钮 -->
  <ProButton type="primary" block>
    块级按钮
  </ProButton>

  <!-- 链接按钮 -->
  <ProButton type="link" href="https://example.com" target="_blank">
    链接按钮
  </ProButton>
</template>
```

### 事件处理

支持所有 a-button 的原生事件：

```vue
<template>
  <ProButton
    type="primary"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    事件按钮
  </ProButton>
</template>

<script setup>
const handleClick = (event) => {
  console.log('点击事件', event)
}

const handleMouseEnter = (event) => {
  console.log('鼠标进入', event)
}

const handleMouseLeave = (event) => {
  console.log('鼠标离开', event)
}

const handleFocus = (event) => {
  console.log('获得焦点', event)
}

const handleBlur = (event) => {
  console.log('失去焦点', event)
}
</script>
```

### 插槽支持

完全支持 a-button 的所有插槽：

```vue
<template>
  <!-- 图标插槽 -->
  <ProButton type="primary">
    <template #icon>
      <DeleteOutlined />
    </template>
    删除
  </ProButton>

  <!-- 默认插槽 -->
  <ProButton type="primary">
    <UserOutlined />
    用户管理
  </ProButton>

  <!-- 复杂内容插槽 -->
  <ProButton type="primary">
    <template #default>
      <div style="display: flex; align-items: center; gap: 4px;">
        <DownloadOutlined />
        <span>下载文件</span>
        <a-badge :count="5" />
      </div>
    </template>
  </ProButton>
</template>
```

### ProButton 扩展功能

#### 自动加载功能

```vue
<template>
  <!-- 自动加载：异步操作时自动显示 loading -->
  <ProButton
    type="primary"
    :auto-loading="true"
    @click="handleAsyncClick"
  >
    异步操作
  </ProButton>

  <!-- 结合原生 loading 属性 -->
  <ProButton
    type="primary"
    :loading="{ delay: 1000 }"
    :auto-loading="true"
    @click="handleDelayedAsync"
  >
    延迟加载
  </ProButton>
</template>

<script setup>
const handleAsyncClick = async () => {
  // 返回 Promise，按钮自动显示 loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('异步操作完成')
}

const handleDelayedAsync = async () => {
  // 1秒后显示 loading，然后执行异步操作
  await fetch('/api/data')
  console.log('请求完成')
}
</script>
```

#### 确认弹窗功能

```vue
<template>
  <!-- 基础确认弹窗 -->
  <ProButton
    type="primary"
    danger
    :enable-confirm="true"
    :pop-config="{
      title: '确认删除',
      description: '此操作不可恢复，确定继续吗？',
      okText: '确定删除',
      cancelText: '取消'
    }"
    @click="handleDelete"
  >
    删除数据
  </ProButton>

  <!-- 自定义确认弹窗 -->
  <ProButton
    type="primary"
    :enable-confirm="true"
    :pop-config="customPopConfig"
    @click="handleCustomConfirm"
  >
    自定义确认
  </ProButton>

  <!-- 结合自动加载和确认弹窗 -->
  <ProButton
    type="primary"
    danger
    :auto-loading="true"
    :enable-confirm="true"
    :pop-config="deleteConfig"
    @click="handleAsyncDelete"
  >
    异步删除
  </ProButton>
</template>

<script setup>
import { h } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const customPopConfig = {
  title: '高级确认',
  description: h('div', [
    h('p', '这是一个高级确认弹窗'),
    h('p', { style: 'color: red;' }, '请仔细确认您的操作')
  ]),
  icon: h(ExclamationCircleOutlined),
  okText: '我已确认',
  cancelText: '再想想',
  okType: 'danger'
}

const deleteConfig = {
  title: '危险操作',
  description: '删除后数据无法恢复！',
  okText: '强制删除',
  cancelText: '取消',
  onConfirm: () => console.log('用户确认删除'),
  onCancel: () => console.log('用户取消删除')
}

const handleDelete = () => {
  console.log('执行删除操作')
}

const handleCustomConfirm = () => {
  console.log('执行自定义操作')
}

const handleAsyncDelete = async () => {
  // 用户确认后，自动显示 loading，执行异步删除
  await fetch('/api/delete', { method: 'DELETE' })
  console.log('删除成功')
}
</script>
```

## ProTable 使用示例

### 基础用法

ProTable 完全支持所有 a-table 的原生属性：

```vue
<template>
  <!-- 基础表格，支持所有 a-table 属性 -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: 1000, y: 400 }"
    bordered
    size="middle"
    @change="handleTableChange"
  />
</template>

<script setup>
const dataSource = [
  { key: '1', name: '张三', age: 32, address: '北京市' },
  { key: '2', name: '李四', age: 28, address: '上海市' },
]

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '地址', dataIndex: 'address', key: 'address' },
]

const pagination = {
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
}

const handleTableChange = (pagination, filters, sorter) => {
  console.log('表格变化', { pagination, filters, sorter })
}
</script>
```

### 插槽支持

完全支持 a-table 的所有插槽：

```vue
<template>
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
  >
    <!-- 工具栏插槽（ProTable 扩展） -->
    <template #toolbar>
      <div style="display: flex; justify-content: space-between;">
        <a-space>
          <a-button type="primary">
            <PlusOutlined />
            新增
          </a-button>
          <a-button>
            <ExportOutlined />
            导出
          </a-button>
        </a-space>
        <a-space>
          <a-input-search placeholder="搜索..." @search="handleSearch" />
          <a-button @click="handleRefresh">
            <ReloadOutlined />
          </a-button>
        </a-space>
      </div>
    </template>

    <!-- 自定义单元格 -->
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.key === 'name'">
        <a-tag color="blue">{{ text }}</a-tag>
      </template>

      <template v-if="column.key === 'action'">
        <a-space>
          <a-button type="link" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <ProButton
            type="link"
            size="small"
            danger
            :enable-confirm="true"
            :pop-config="{
              title: '确认删除',
              description: `确定删除 ${record.name} 吗？`
            }"
            @click="handleDelete(record)"
          >
            删除
          </ProButton>
        </a-space>
      </template>
    </template>

    <!-- 自定义表头 -->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <UserOutlined />
        {{ column.title }}
      </template>
    </template>

    <!-- 展开行内容 -->
    <template #expandedRowRender="{ record }">
      <a-descriptions size="small" bordered>
        <a-descriptions-item label="详细信息">
          {{ record.detail }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- 自定义空状态 -->
    <template #emptyText>
      <a-empty description="暂无数据">
        <a-button type="primary" @click="handleCreate">
          立即创建
        </a-button>
      </a-empty>
    </template>
  </ProTable>
</template>
```

### ProTable 扩展功能

#### 斑马纹效果

```vue
<template>
  <!-- 偶数行斑马纹 -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :is-zebra="'even'"
  />

  <!-- 奇数行斑马纹 -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :is-zebra="'odd'"
  />

  <!-- 关闭斑马纹（默认） -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :is-zebra="'none'"
  />
</template>
```

#### 卡片包装

```vue
<template>
  <!-- 使用卡片包装（默认） -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :use-card-wrapper="true"
  />

  <!-- 不使用卡片包装 -->
  <ProTable
    :dataSource="dataSource"
    :columns="columns"
    :use-card-wrapper="false"
  />
</template>
```

### 高级组合示例

```vue
<template>
  <!-- 完整功能的 ProTable -->
  <ProTable
    :dataSource="tableData"
    :columns="tableColumns"
    :pagination="tablePagination"
    :loading="tableLoading"
    :is-zebra="'even'"
    :use-card-wrapper="true"
    bordered
    size="middle"
    :scroll="{ x: 1200 }"
    :row-selection="rowSelection"
    :row-class-name="customRowClassName"
    @change="handleTableChange"
    @expand="handleExpand"
    @expandedRowsChange="handleExpandedRowsChange"
  >
    <!-- 工具栏 -->
    <template #toolbar>
      <div class="table-toolbar">
        <div class="toolbar-left">
          <a-space>
            <ProButton
              type="primary"
              :auto-loading="true"
              @click="handleBatchCreate"
            >
              <PlusOutlined />
              批量创建
            </ProButton>

            <ProButton
              :disabled="!selectedRowKeys.length"
              :auto-loading="true"
              :enable-confirm="true"
              :pop-config="{
                title: '批量删除',
                description: `确定删除选中的 ${selectedRowKeys.length} 项吗？`
              }"
              @click="handleBatchDelete"
            >
              <DeleteOutlined />
              批量删除
            </ProButton>

            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="export">
                    <ExportOutlined />
                    导出数据
                  </a-menu-item>
                  <a-menu-item key="import">
                    <ImportOutlined />
                    导入数据
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                更多操作
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
        </div>

        <div class="toolbar-right">
          <a-space>
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索用户..."
              @search="handleSearch"
              style="width: 200px;"
            />
            <a-button @click="handleRefresh">
              <ReloadOutlined />
            </a-button>
            <a-button @click="toggleZebra">
              切换斑马纹
            </a-button>
          </a-space>
        </div>
      </div>
    </template>

    <!-- 自定义列渲染 -->
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.key === 'avatar'">
        <a-avatar :src="text" />
      </template>

      <template v-if="column.key === 'status'">
        <a-tag :color="text === 'active' ? 'green' : 'red'">
          {{ text === 'active' ? '活跃' : '禁用' }}
        </a-tag>
      </template>

      <template v-if="column.key === 'action'">
        <a-space size="small">
          <a-button type="link" size="small" @click="handleView(record)">
            查看
          </a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <ProButton
            type="link"
            size="small"
            danger
            :auto-loading="true"
            :enable-confirm="true"
            :pop-config="{
              title: '确认删除',
              description: `确定删除用户 ${record.name} 吗？此操作不可恢复！`,
              okText: '确定删除',
              cancelText: '取消'
            }"
            @click="handleDeleteUser(record)"
          >
            删除
          </ProButton>
        </a-space>
      </template>
    </template>
  </ProTable>
</template>

<script setup>
import { ref, computed } from 'vue'

// 表格数据
const tableData = ref([
  {
    key: '1',
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    status: 'active',
    avatar: 'https://example.com/avatar1.jpg'
  },
  // ... 更多数据
])

// 表格列定义
const tableColumns = [
  { title: '头像', key: 'avatar', dataIndex: 'avatar', width: 80 },
  { title: '姓名', key: 'name', dataIndex: 'name', sorter: true },
  { title: '年龄', key: 'age', dataIndex: 'age', sorter: true },
  { title: '邮箱', key: 'email', dataIndex: 'email' },
  { title: '状态', key: 'status', dataIndex: 'status', filters: [
    { text: '活跃', value: 'active' },
    { text: '禁用', value: 'inactive' }
  ]},
  { title: '操作', key: 'action', width: 200 }
]

// 分页配置
const tablePagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `共 ${total} 条，显示第 ${range[0]}-${range[1]} 条`
})

// 表格状态
const tableLoading = ref(false)
const selectedRowKeys = ref([])
const searchKeyword = ref('')
const zebraMode = ref('even')

// 行选择配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log('全选变化', { selected, selectedRows, changeRows })
  }
}))

// 自定义行类名
const customRowClassName = (record, index) => {
  if (record.status === 'inactive') {
    return 'row-disabled'
  }
  return ''
}

// 事件处理
const handleTableChange = (pagination, filters, sorter) => {
  console.log('表格变化', { pagination, filters, sorter })
}

const handleBatchCreate = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('批量创建完成')
}

const handleBatchDelete = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('批量删除完成')
  selectedRowKeys.value = []
}

const handleDeleteUser = async (record) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('删除用户:', record.name)
}

const handleSearch = (value) => {
  console.log('搜索:', value)
}

const handleRefresh = () => {
  console.log('刷新数据')
}

const toggleZebra = () => {
  zebraMode.value = zebraMode.value === 'even' ? 'odd' : 'even'
}
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.row-disabled) {
  background-color: #f5f5f5;
  opacity: 0.6;
}
</style>
```

## TypeScript 支持

```typescript
import type { ProButtonProps, ProTableProps } from 'vue-ace-admin-ui'

// ProButton 类型
const buttonProps: ProButtonProps = {
  autoLoading: true,
  enableConfirm: true,
  popConfig: {
    title: '确认',
    description: '确定执行此操作吗？',
    okText: '确定',
    cancelText: '取消'
  },
  onClick: async (event: MouseEvent) => {
    console.log('按钮点击', event)
    return Promise.resolve()
  }
}

// ProTable 类型
const tableProps: ProTableProps = {
  isZebra: 'even',
  useCardWrapper: true
}
```

## 注意事项

1. **属性透传**：所有 ant-design-vue 的原生属性都会自动透传到对应的组件
2. **事件透传**：所有原生事件都会正常触发
3. **插槽透传**：所有插槽都会正确传递给底层组件
4. **类型安全**：在 TypeScript 中享受完整的类型提示
5. **样式兼容**：完全兼容 ant-design-vue 的主题和样式

这样设计既保持了组件的简洁性，又提供了完整的扩展功能！
