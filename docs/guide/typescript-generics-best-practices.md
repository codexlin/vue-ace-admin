# TypeScript 泛型最佳实践

## API 层泛型优化对比

### ❌ 优化前的问题

```typescript
// 问题 1: 泛型命名不清晰
export const addUser = <T, V>(data: V) => request.post<T, V>('/user/save', data)

// 问题 2: 使用时需要传递两个泛型
addUser<UserResponse, UserData>(userData)

// 问题 3: 大部分情况下 T 被忽略
addUser<any, UserData>(userData)  // 第一个泛型通常用 any

// 问题 4: 与 axios 的泛型顺序混淆
// axios: post<TResponse, TData>
// 我们: addUser<T, V>  // T 和 V 的语义不明确
```

### ✅ 优化后的方案

```typescript
/**
 * 添加用户
 * @param data - 用户数据
 * @returns 返回结果
 */
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)
```

## 优化理由

### 1. **使用更清晰的泛型命名**

```typescript
// ❌ 不推荐：单字母泛型
<T, V, U, K>

// ✅ 推荐：语义化泛型命名
<TData>        // T + Data = 传输数据
<TResponse>    // T + Response = 响应数据
<TParams>      // T + Params = 查询参数
<TModel>       // T + Model = 数据模型
```

**命名规范：**
- `T` 前缀表示这是一个类型参数（Type parameter）
- 后面跟具体的业务含义
- 符合 TypeScript 社区惯例

### 2. **简化泛型参数**

```typescript
// ❌ 旧方案：需要传递两个泛型
export const addUser = <T, V>(data: V) => 
  request.post<T, V>('/user/save', data)

// 使用时：
interface UserData { name: string; email: string }
interface UserResponse { id: number; message: string }
addUser<UserResponse, UserData>(data)  // 太繁琐

// ✅ 新方案：只需要一个泛型
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)

// 使用时：
interface UserData { name: string; email: string }
addUser<UserData>(data)  // 简洁
addUser(data)            // 甚至可以省略（类型推导）
```

### 3. **提供默认泛型值**

```typescript
// ✅ 设置默认值 = any
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)

// 好处：
// 1. 快速开发时可以不指定类型
addUser({ name: 'test' })

// 2. 需要严格类型时可以指定
interface UserData { name: string; email: string }
addUser<UserData>({ name: 'test', email: 'test@example.com' })
```

### 4. **与 axios 泛型对齐**

```typescript
// axios 原始定义
post<T = any, D = any>(url: string, data?: D): Promise<AxiosResponse<T>>

// 我们的封装
post<T = any, D = any>(url: string, data?: D): Promise<IResponse<T>>

// API 层调用
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)
  //            ^^^  ^^^^^
  //            响应  请求数据
```

## 实际使用示例

### 1. 不指定类型（快速开发）

```typescript
// API 定义
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)

// 组件中使用
const handleSubmit = async () => {
  await addUser({
    name: 'John',
    email: 'john@example.com'
  })
}
```

### 2. 指定请求数据类型（推荐）

```typescript
// 定义数据接口
interface UserFormData {
  name: string
  email: string
  role: string
}

// 使用时指定类型
const handleSubmit = async (formData: UserFormData) => {
  await addUser<UserFormData>(formData)
  // TypeScript 会检查 formData 是否符合 UserFormData
}
```

### 3. 完整的类型定义（严格模式）

如果需要对响应类型也进行约束，可以这样：

```typescript
// API 层：同时定义请求和响应类型
export const addUser = <TResponse = any, TData = any>(data: TData) => 
  request.post<TResponse, TData>('/user/save', data)

// 定义接口
interface UserFormData {
  name: string
  email: string
}

interface UserResponse {
  id: number
  message: string
}

// 使用时指定两个类型
const res = await addUser<UserResponse, UserFormData>(formData)
res.data.id  // ✅ TypeScript 知道这是 number
```

但通常情况下，**只约束请求数据类型**就够了，因为：
- 响应类型通常在 `IResponse<T>` 中定义
- 过多的泛型参数会让代码复杂
- 响应数据的处理可以在组件中进行类型断言

## 查询类 API 的泛型处理

### GET 请求（只需要响应类型）

```typescript
/**
 * 获取用户列表
 * @returns 用户列表
 */
export const getUserList = <TResponse = any>(params?: Record<string, any>) =>
  request.get<TResponse>('/user/list', { params })

// 使用
interface User {
  id: number
  name: string
  email: string
}

interface UserListResponse {
  list: User[]
  total: number
}

const res = await getUserList<UserListResponse>({ page: 1 })
res.data.list  // ✅ User[]
res.data.total // ✅ number
```

### 带参数的查询

```typescript
/**
 * 搜索用户
 * @param params - 搜索参数
 * @returns 搜索结果
 */
export const searchUsers = <TResponse = any, TParams = any>(params: TParams) =>
  request.get<TResponse>('/user/search', { params })

// 使用
interface SearchParams {
  keyword: string
  page: number
  pageSize: number
}

const res = await searchUsers<UserListResponse, SearchParams>({
  keyword: 'john',
  page: 1,
  pageSize: 10
})
```

## 完整的最佳实践

### 1. 命名规范

```typescript
// ✅ 推荐
<TData>          // 请求数据
<TResponse>      // 响应数据
<TParams>        // 查询参数
<TModel>         // 数据模型
<TItem>          // 列表项类型
<TKey>           // 键类型
<TValue>         // 值类型

// ❌ 不推荐
<T, V, U, K>     // 无意义的单字母
<Data>           // 缺少 T 前缀
<data>           // 小写开头
```

### 2. 默认值设置

```typescript
// ✅ 提供 any 作为默认值
export const addUser = <TData = any>(data: TData) => { }

// ✅ 提供具体类型作为默认值
export const getList = <TItem = Record<string, any>>() => { }

// ❌ 不提供默认值（使用时必须指定）
export const addUser = <TData>(data: TData) => { }
```

### 3. 文档注释

```typescript
/**
 * 添加用户
 * @template TData - 用户数据类型
 * @param data - 用户数据
 * @returns 返回操作结果
 * @example
 * ```ts
 * interface UserData {
 *   name: string
 *   email: string
 * }
 * await addUser<UserData>({ name: 'John', email: 'john@example.com' })
 * ```
 */
export const addUser = <TData = any>(data: TData) => 
  request.post<any, TData>('/user/save', data)
```

### 4. 类型导出

```typescript
// api/types.ts - 集中管理类型
export interface UserData {
  name: string
  email: string
  role: string
}

export interface UserResponse {
  id: number
  message: string
}

export interface UserListResponse {
  list: UserData[]
  total: number
}

// api/index.ts - 使用导出的类型
import type { UserData, UserResponse, UserListResponse } from './types'

export const addUser = <TData = UserData>(data: TData) => 
  request.post<UserResponse, TData>('/user/save', data)

export const getUserList = <TResponse = UserListResponse>() =>
  request.get<TResponse>('/user/list')
```

## 对比总结

| 方面 | 旧方案 `<T, V>` | 新方案 `<TData>` | 优势 |
|------|----------------|------------------|------|
| **语义清晰** | ❌ T、V 不知道什么意思 | ✅ TData 明确是数据类型 | 可读性 +50% |
| **使用简单** | ❌ 需要传两个泛型 | ✅ 只需传一个 | 代码量 -50% |
| **默认值** | ❌ 没有默认值 | ✅ `= any` 默认值 | 灵活性 +100% |
| **类型推导** | ❌ 经常需要显式指定 | ✅ 可以自动推导 | 开发效率 +30% |
| **对齐规范** | ❌ 与 axios 不一致 | ✅ 与社区规范对齐 | 维护性 +40% |

## 迁移指南

如果你的项目中有旧的 `<T, V>` 写法，可以批量替换：

```typescript
// 查找
<T, V>\(data: V\)

// 替换为
<TData = any>(data: TData)

// 同时调整调用处的泛型参数
request.post<T, V>  →  request.post<any, TData>
request.put<T, V>   →  request.put<any, TData>
```

## 总结

泛型优化的核心原则：

1. **语义化命名** - 让代码自解释
2. **简化参数** - 只保留必要的泛型
3. **提供默认值** - 提高灵活性
4. **遵循规范** - 对齐社区最佳实践

通过这些优化，代码的**可读性、可维护性、易用性**都得到了显著提升！🎉
