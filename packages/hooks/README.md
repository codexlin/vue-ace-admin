# 纯 Hooks 包使用示例

## 🎯 **@codexlin/ace-admin-hooks**

这是一个**纯 Vue 3 Composition API Hooks** 包，包含无业务依赖的通用 Hooks。

### **安装**

```bash
pnpm add @codexlin/ace-admin-hooks
```

### **使用示例**

#### **1. useDebouncedRef - 防抖 ref**

```vue
<template>
  <div>
    <input v-model="searchText" placeholder="搜索..." />
    <p>防抖后的值: {{ debouncedSearch }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDebouncedRef } from '@codexlin/ace-admin-hooks'

const searchText = ref('')
const debouncedSearch = useDebouncedRef(searchText, 500) // 500ms 防抖
</script>
```

#### **2. useLoading - 加载状态管理**

```vue
<template>
  <div>
    <button @click="handleSubmit" :loading="loading">
      {{ loading ? '提交中...' : '提交' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLoading } from '@codexlin/ace-admin-hooks'

const { loading, setLoading, toggle } = useLoading()

const handleSubmit = async () => {
  setLoading(true)
  try {
    await fetch('/api/submit')
  } finally {
    setLoading(false)
  }
}
</script>
```

#### **3. useHasEventListener - 检查事件监听**

```vue
<template>
  <div>
    <button @click="handleClick">点击我</button>
    <p v-if="hasClick">有点击事件监听</p>
  </div>
</template>

<script setup lang="ts">
import { useHasEventListener } from '@codexlin/ace-admin-hooks'

const hasClick = useHasEventListener('click')

const handleClick = () => {
  console.log('点击了')
}
</script>
```

#### **4. useEmitOrDefault - 事件发射或默认行为**

```vue
<template>
  <div>
    <button @click="handleAction">执行操作</button>
  </div>
</template>

<script setup lang="ts">
import { useEmitOrDefault } from '@codexlin/ace-admin-hooks'

const { emitOrDefault } = useEmitOrDefault(
  'custom-action',
  (payload) => {
    console.log('发射自定义事件:', payload)
  },
  () => {
    console.log('执行默认行为')
  }
)

const handleAction = () => {
  emitOrDefault({ data: 'test' })
}
</script>
```

---

## ✅ **纯 Hooks 的特点**

### **1. 无业务依赖**
- ✅ 只使用 Vue 3 Composition API
- ✅ 不依赖任何 store 或业务逻辑
- ✅ 可以在任何 Vue 3 项目中使用

### **2. 类型安全**
- ✅ 完整的 TypeScript 支持
- ✅ 类型推导和检查
- ✅ 良好的开发体验

### **3. 可复用**
- ✅ 通用性强
- ✅ 职责单一
- ✅ 易于测试

---

## 📦 **包含的 Hooks**

| Hook | 功能 | 特点 |
|------|------|------|
| `useDebouncedRef` | 防抖 ref | 延迟更新值 |
| `useLoading` | 加载状态 | 简单的状态管理 |
| `useHasEventListener` | 事件检查 | 检查组件事件监听 |
| `useEmitOrDefault` | 事件处理 | 发射或默认行为 |

---

## 🚀 **构建和发布**

```bash
# 构建
pnpm build

# 发布到 npm
npm publish
```

**这个包可以独立发布到 npm，供其他 Vue 3 项目使用！** 🎯
