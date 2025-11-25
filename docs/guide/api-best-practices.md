# API 调用最佳实践

## 优化后的 Axios 功能

基于我们优化的 axios 封装，现在支持以下高级特性：

### 1. 请求重试 (Request Retry)

适用场景：网络不稳定、临时服务器错误

```typescript
// 自动重试 3 次，每次间隔 1 秒
export const getUserInfo = () => 
  request.get('/user/info', {
    retry: 3,
    retryDelay: 1000
  })
```

**建议：**
- ✅ GET 请求：推荐添加 retry (2-3次)
- ✅ 查询类接口：可以重试
- ❌ POST/PUT/DELETE：谨慎使用，避免重复提交
- ❌ 登录/注册/支付：不要重试

### 2. 请求防抖 (Request Debounce)

适用场景：搜索框、列表筛选、高频触发的查询

```typescript
// 300ms 内多次调用只执行最后一次
export const searchUsers = (keyword: string) =>
  request.get('/user/search', {
    params: { keyword },
    debounce: true,
    debounceDelay: 300
  })
```

**建议：**
- ✅ 搜索框输入
- ✅ 列表筛选
- ✅ 自动保存草稿
- ❌ 按钮点击（应该用 loading 状态）

### 3. 请求取消 (Request Cancellation)

适用场景：组件销毁、路由切换、取消搜索

```typescript
// 方式 1: 取消单个请求
request.cancelRequest('/user/list', 'get')

// 方式 2: 取消所有请求
request.cancelAllRequests('路由切换，取消所有请求')
```

**使用示例：**

```typescript
// 在组件中使用
import { onBeforeUnmount } from 'vue'
import request from '@/utils/axios'

onBeforeUnmount(() => {
  // 组件销毁时取消所有请求
  request.cancelAllRequests('组件销毁')
})
```

### 4. 请求统计 (Request Stats)

适用场景：性能监控、调试分析

```typescript
// 获取请求统计
const stats = request.getRequestStats()
console.log('总请求数:', stats.length)
console.log('平均响应时间:', request.getAverageRequestTime(), 'ms')

// 查看最近 10 次请求
stats.slice(-10).forEach(stat => {
  console.log(`${stat.method} ${stat.url}: ${stat.duration}ms`)
})

// 清空统计
request.clearStats()
```

### 5. 文件上传 (Upload)

支持进度监控的文件上传

```typescript
export const uploadFile = (file: File, onProgress?: (percent: number) => void) =>
  request.upload('/upload', file, onProgress, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
```

**使用示例：**

```typescript
const handleUpload = async (file: File) => {
  const { response } = await uploadFile(file, (percent) => {
    console.log('上传进度:', percent + '%')
  })
  return response.data
}
```

### 6. 文件下载 (Download)

支持进度监控的文件下载

```typescript
export const downloadReport = (id: number) =>
  request.download(`/report/${id}/download`, `report_${id}.pdf`)
```

### 7. 批量请求 (Batch Requests)

```typescript
// 方式 1: 并行请求 (Promise.all)
const results = await request.all([
  getUserInfo(),
  getMenuList(),
  getRoleList()
])

// 方式 2: 顺序请求 (依次执行)
const results = await request.sequence([
  getUserInfo,
  getMenuList,
  getRoleList
])
```

## API 层最佳实践

### 1. 文件组织

```
src/
  views/
    system/
      api/
        index.ts      # 系统管理相关 API
    user/
      login/
        api/
          index.ts    # 登录相关 API
```

### 2. API 命名规范

```typescript
// ✅ 推荐：语义化命名
export const getUserList = () => request.get('/user/list')
export const addUser = (data) => request.post('/user/save', data)
export const updateUser = (data) => request.put('/user/update', data)
export const deleteUser = (id) => request.delete(`/user/remove/${id}`)

// ❌ 不推荐：缩写或不明确的命名
export const get = () => request.get('/user/list')
export const save = (data) => request.post('/user/save', data)
```

### 3. 添加注释说明

```typescript
/**
 * 获取用户列表
 * @param params - 查询参数
 * @returns 用户列表数据
 */
export const getUserList = <T>(params?: Record<string, any>) =>
  request.get<T>('/user/list', {
    params,
    debounce: true,    // 防抖
    debounceDelay: 300,
    retry: 2           // 失败重试 2 次
  })
```

### 4. 统一前缀管理

```typescript
const USER_PREFIX = '/user'
const MENU_PREFIX = '/menu'
const ROLE_PREFIX = '/role'

export const getUserList = () => request.get(`${USER_PREFIX}/list`)
export const getMenuList = () => request.get(`${MENU_PREFIX}/list`)
export const getRoleList = () => request.get(`${ROLE_PREFIX}/list`)
```

## 常见场景配置建议

### 登录相关

```typescript
// ❌ 不要重试，避免重复提交
export const loginApi = (data) => 
  request.post('/user/login', data)

// ✅ 验证码可以重试
export const getCaptcha = () =>
  request.get('/user/captcha', {
    responseType: 'arraybuffer',
    retry: 2,
    retryDelay: 1000
  })
```

### 列表查询

```typescript
// ✅ 添加防抖和重试
export const getUserList = (params) =>
  request.get('/user/list', {
    params,
    debounce: true,
    debounceDelay: 300,
    retry: 2
  })
```

### 详情查询

```typescript
// ✅ 自动重试
export const getUserDetail = (id) =>
  request.get(`/user/detail/${id}`, {
    retry: 2
  })
```

### 数据提交

```typescript
// ❌ 不要重试
export const saveUser = (data) =>
  request.post('/user/save', data)

// ❌ 不要防抖（应该用按钮 loading）
export const saveUser = (data) =>
  request.post('/user/save', data, {
    showLoading: true  // 显示 loading
  })
```

### 搜索功能

```typescript
// ✅ 防抖 + 重试
export const searchUsers = (keyword) =>
  request.get('/user/search', {
    params: { keyword },
    debounce: true,
    debounceDelay: 500,  // 搜索场景建议 500ms
    retry: 2
  })
```

## 性能优化建议

### 1. 使用请求统计分析慢接口

```typescript
// 开发环境定期检查
if (import.meta.env.DEV) {
  setInterval(() => {
    const stats = request.getRequestStats()
    const slowRequests = stats.filter(s => s.duration > 2000)
    if (slowRequests.length > 0) {
      console.warn('慢接口:', slowRequests)
    }
  }, 60000)
}
```

### 2. 路由切换时取消请求

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  // 取消所有未完成的请求
  request.cancelAllRequests('路由切换')
  next()
})
```

### 3. 避免重复请求

```typescript
// ✅ 使用内置的重复请求自动取消
// axios 封装已经自动处理了相同请求的取消逻辑
```

### 4. 合理使用批量请求

```typescript
// ✅ 并行请求（互不依赖）
const [users, menus, roles] = await request.all([
  getUserList(),
  getMenuList(),
  getRoleList()
])

// ✅ 顺序请求（有依赖关系）
const [userInfo, permissions] = await request.sequence([
  () => getUserInfo(),
  (userInfo) => getPermissions(userInfo.roleId)
])
```

## TypeScript 类型支持

```typescript
// 定义接口返回类型
interface User {
  id: number
  name: string
  email: string
}

// 使用泛型
export const getUserInfo = () => 
  request.get<User>('/user/info')

// 带参数的类型
export const updateUser = (data: Partial<User>) =>
  request.put<User>('/user/update', data)
```

## 错误处理

```typescript
// API 层不需要 try-catch，在组件中统一处理
// ❌ 不推荐
export const getUserList = async () => {
  try {
    return await request.get('/user/list')
  } catch (error) {
    console.error(error)
  }
}

// ✅ 推荐
export const getUserList = () => request.get('/user/list')

// 在组件中处理
try {
  const res = await getUserList()
  // 处理成功逻辑
} catch (error) {
  // 处理错误（axios 拦截器已经显示错误提示）
}
```

## 总结

| 功能 | 适用场景 | 不适用场景 |
|------|---------|-----------|
| **retry** | GET 查询、详情 | POST/PUT/DELETE 提交 |
| **debounce** | 搜索、筛选 | 按钮点击提交 |
| **cancelRequest** | 组件销毁、路由切换 | 必须完成的请求 |
| **upload** | 文件上传 | 普通数据提交 |
| **download** | 文件下载 | 普通数据查询 |
| **all** | 并行独立请求 | 有依赖关系的请求 |
| **sequence** | 顺序依赖请求 | 可以并行的请求 |

遵循这些最佳实践，可以显著提升应用的性能、可靠性和用户体验。
