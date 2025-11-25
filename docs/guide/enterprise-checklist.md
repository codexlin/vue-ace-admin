# 企业级管理系统完善清单

## 📊 当前项目评估

### 已完成 ✅ (85%)

| 模块 | 完成度 | 评分 | 说明 |
|------|--------|------|------|
| **技术栈** | 100% | ⭐⭐⭐⭐⭐ | Vue 3.5 + TS 5.5 + Vite 6 最新技术栈 |
| **代码规范** | 95% | ⭐⭐⭐⭐⭐ | ESLint 9 + Prettier + Commitlint 完善 |
| **类型安全** | 95% | ⭐⭐⭐⭐⭐ | TypeScript 全覆盖，泛型优化 |
| **HTTP 请求** | 95% | ⭐⭐⭐⭐⭐ | Axios 封装完善，7+ 高级特性 |
| **状态管理** | 90% | ⭐⭐⭐⭐⭐ | Pinia + 持久化 |
| **路由管理** | 90% | ⭐⭐⭐⭐ | 动态路由，权限守卫 |
| **构建优化** | 95% | ⭐⭐⭐⭐⭐ | Code Splitting，Bundle -62% |
| **组件库** | 85% | ⭐⭐⭐⭐ | Monorepo，Pro 组件 |
| **文档** | 80% | ⭐⭐⭐⭐ | 较完善的使用文档 |
| **国际化** | 85% | ⭐⭐⭐⭐ | Vue I18n 支持 |

### 待完善 ⚠️ (15%)

| 模块 | 完成度 | 优先级 | 影响 |
|------|--------|--------|------|
| **单元测试** | 0% | 🔴 P0 | 代码质量无保证 |
| **E2E 测试** | 0% | 🔴 P0 | 功能回归风险 |
| **错误监控** | 20% | 🔴 P0 | 生产问题无法追踪 |
| **性能监控** | 0% | 🟠 P1 | 用户体验无数据 |
| **权限系统** | 60% | 🟠 P1 | 细粒度控制不足 |
| **日志系统** | 40% | 🟠 P1 | 排查问题困难 |
| **安全防护** | 50% | 🟠 P1 | XSS/CSRF 防护不完整 |
| **数据埋点** | 0% | 🟡 P2 | 用户行为分析缺失 |
| **灰度发布** | 0% | 🟡 P2 | 功能上线风险 |
| **API Mock** | 0% | 🟡 P2 | 前端独立开发受限 |

---

## 🔴 P0 优先级（必须要有）

### 1. 单元测试 & E2E 测试

#### 1.1 单元测试配置

**需要安装：**
```bash
pnpm add -D vitest @vue/test-utils jsdom @vitest/ui happy-dom
```

**创建配置文件：** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

**测试覆盖率目标：**
- Utils 工具函数：90%+
- Hooks：80%+
- Store：70%+
- Components：60%+

**示例测试：** `src/utils/__tests__/axios.test.ts`
```typescript
import { describe, it, expect, vi } from 'vitest'
import request from '@/utils/axios'
import axios from 'axios'

vi.mock('axios')

describe('Axios Utils', () => {
  it('should handle retry on failure', async () => {
    const mockGet = vi.fn()
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: { code: '200', data: 'success' } })
    
    axios.create = vi.fn().mockReturnValue({ get: mockGet })
    
    const res = await request.get('/api/test', { retry: 2 })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(res.data).toBe('success')
  })
  
  it('should cancel duplicate requests', async () => {
    // 测试请求取消逻辑
  })
  
  it('should collect request statistics', async () => {
    // 测试统计功能
  })
})
```

#### 1.2 E2E 测试配置

**需要安装：**
```bash
pnpm add -D @playwright/test
npx playwright install
```

**创建配置：** `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**示例测试：** `e2e/login.spec.ts`
```typescript
import { test, expect } from '@playwright/test'

test.describe('登录功能', () => {
  test('用户可以成功登录', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[name="email"]', 'xoxosos666@gmail.com')
    await page.fill('input[name="password"]', 'admin666')
    await page.fill('input[name="captcha"]', '1234')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('.user-info')).toBeVisible()
  })
  
  test('错误的凭证应该显示错误信息', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.ant-message-error')).toBeVisible()
  })
})
```

**package.json 添加脚本：**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

### 2. 错误监控系统

#### 2.1 集成 Sentry

**安装：**
```bash
pnpm add @sentry/vue
```

**配置：** `src/plugins/sentry.ts`
```typescript
import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import { Router } from 'vue-router'

export function setupSentry(app: App, router: Router) {
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // 性能监控采样率
      tracesSampleRate: 0.1,
      // 会话重放采样率
      replaysSessionSampleRate: 0.1,
      // 错误重放采样率
      replaysOnErrorSampleRate: 1.0,
      // 忽略的错误
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured'
      ],
      // 面包屑配置
      beforeBreadcrumb(breadcrumb, hint) {
        // 过滤敏感信息
        if (breadcrumb.category === 'console') {
          return null
        }
        return breadcrumb
      },
      // 发送前处理
      beforeSend(event, hint) {
        // 添加用户信息
        const userStore = useUserStore()
        if (userStore.userInfo) {
          event.user = {
            id: userStore.userInfo.id,
            email: userStore.userInfo.email
          }
        }
        return event
      }
    })
  }
}
```

**使用：** `src/main.ts`
```typescript
import { setupSentry } from './plugins/sentry'

const app = createApp(App)
const router = setupRouter(app)

// 初始化 Sentry
setupSentry(app, router)

app.mount('#app')
```

#### 2.2 自定义错误上报

**创建：** `src/utils/errorHandler.ts`
```typescript
import * as Sentry from '@sentry/vue'

export interface ErrorInfo {
  message: string
  stack?: string
  componentName?: string
  propsData?: any
  url?: string
  userAgent?: string
  timestamp: number
}

class ErrorHandler {
  // 收集错误信息
  captureError(error: Error, vm?: any, info?: string) {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentName: vm?.$options?.name,
      propsData: vm?.$options?.propsData,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }
    
    // 开发环境打印
    if (import.meta.env.DEV) {
      console.error('错误详情:', errorInfo)
    }
    
    // 生产环境上报
    if (import.meta.env.PROD) {
      this.reportError(errorInfo)
    }
  }
  
  // 上报到 Sentry
  private reportError(errorInfo: ErrorInfo) {
    Sentry.captureException(new Error(errorInfo.message), {
      contexts: {
        errorInfo: {
          ...errorInfo
        }
      },
      level: 'error'
    })
  }
  
  // API 错误上报
  captureAPIError(error: any, config: any) {
    Sentry.captureException(error, {
      contexts: {
        api: {
          url: config.url,
          method: config.method,
          data: config.data,
          status: error.response?.status
        }
      },
      level: 'error',
      tags: {
        errorType: 'api'
      }
    })
  }
}

export default new ErrorHandler()
```

---

### 3. 完善日志系统

**优化现有 logger：** `src/utils/logger.ts`
```typescript
import * as Sentry from '@sentry/vue'

type LogLevel = 'log' | 'info' | 'warn' | 'error'

interface LogContext {
  module?: string
  action?: string
  userId?: string
  extra?: Record<string, any>
}

class Logger {
  private isDev = import.meta.env.DEV
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (context) {
      return `${prefix} [${context.module || 'App'}] ${message}`, context.extra
    }
    
    return `${prefix} ${message}`
  }
  
  log(message: string, context?: LogContext) {
    if (this.isDev) {
      const formatted = this.formatMessage('log', message, context)
      console.log(formatted)
    }
  }
  
  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage('info', message, context)
    console.info(formatted)
    
    // 上报重要信息到 Sentry
    if (!this.isDev && context?.extra?.important) {
      Sentry.captureMessage(message, {
        level: 'info',
        contexts: { ...context }
      })
    }
  }
  
  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage('warn', message, context)
    console.warn(formatted)
    
    // 警告也上报
    if (!this.isDev) {
      Sentry.captureMessage(message, {
        level: 'warning',
        contexts: { ...context }
      })
    }
  }
  
  error(message: string, error?: Error, context?: LogContext) {
    const formatted = this.formatMessage('error', message, context)
    console.error(formatted, error)
    
    // 错误必须上报
    if (!this.isDev) {
      Sentry.captureException(error || new Error(message), {
        contexts: { ...context },
        level: 'error'
      })
    }
  }
  
  // API 请求日志
  api(config: any, response?: any, error?: any) {
    const message = `API ${config.method?.toUpperCase()} ${config.url}`
    
    if (error) {
      this.error(message, error, {
        module: 'HTTP',
        extra: {
          config,
          status: error.response?.status
        }
      })
    } else if (this.isDev) {
      this.log(message, {
        module: 'HTTP',
        extra: {
          config,
          response: response?.data
        }
      })
    }
  }
  
  // 用户行为日志
  track(event: string, properties?: Record<string, any>) {
    if (this.isDev) {
      console.log(`[TRACK] ${event}`, properties)
    }
    
    // 生产环境可以对接埋点系统
    if (!this.isDev) {
      // 示例：对接神策、百度统计等
      // window._sensors?.track(event, properties)
    }
  }
}

export const logger = new Logger()
export default logger
```

---

## 🟠 P1 优先级（强烈建议）

### 4. 性能监控

**创建：** `src/plugins/performance.ts`
```typescript
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals'
import * as Sentry from '@sentry/vue'

export function setupPerformanceMonitor() {
  if (import.meta.env.PROD) {
    // Core Web Vitals
    onCLS((metric) => {
      Sentry.captureMessage('CLS', {
        level: 'info',
        contexts: { performance: { value: metric.value, rating: metric.rating } }
      })
    })
    
    onFCP((metric) => {
      Sentry.captureMessage('FCP', {
        level: 'info',
        contexts: { performance: { value: metric.value } }
      })
    })
    
    onFID((metric) => {
      Sentry.captureMessage('FID', {
        level: 'info',
        contexts: { performance: { value: metric.value } }
      })
    })
    
    onLCP((metric) => {
      Sentry.captureMessage('LCP', {
        level: 'info',
        contexts: { performance: { value: metric.value } }
      })
    })
    
    onTTFB((metric) => {
      Sentry.captureMessage('TTFB', {
        level: 'info',
        contexts: { performance: { value: metric.value } }
      })
    })
  }
}

// 路由性能监控
export function trackRoutePerformance(to: any, from: any) {
  const startTime = performance.now()
  
  return () => {
    const duration = performance.now() - startTime
    
    if (duration > 1000) {
      logger.warn(`路由切换较慢: ${from.path} -> ${to.path}`, {
        module: 'Router',
        extra: { duration }
      })
    }
  }
}
```

**安装：**
```bash
pnpm add web-vitals
```

---

### 5. 权限系统增强

**创建：** `src/directives/permission.ts`
```typescript
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// 权限指令 v-permission
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()
    const permissions = userStore.permissions || []
    
    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = permissions.some(permission => {
        return value.includes(permission)
      })
      
      if (!hasPermission) {
        el.style.display = 'none'
        // 或者直接移除
        // el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('need permissions! Like v-permission="[\'admin\',\'editor\']"')
    }
  }
}

// 角色指令 v-role
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()
    const roles = userStore.roles || []
    
    if (value && value instanceof Array && value.length > 0) {
      const hasRole = roles.some(role => value.includes(role))
      
      if (!hasRole) {
        el.style.display = 'none'
      }
    }
  }
}
```

**使用：**
```vue
<template>
  <!-- 权限控制 -->
  <a-button v-permission="['user:add']">添加用户</a-button>
  <a-button v-permission="['user:delete']">删除用户</a-button>
  
  <!-- 角色控制 -->
  <div v-role="['admin']">
    仅管理员可见
  </div>
</template>
```

---

### 6. 安全防护

#### 6.1 XSS 防护

**创建：** `src/utils/security.ts`
```typescript
import DOMPurify from 'dompurify'

export class Security {
  // XSS 防护
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'title', 'target']
    })
  }
  
  // 防止 SQL 注入（输入验证）
  static validateInput(input: string): boolean {
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)|(--)|(\/\*|\*\/)/i
    return !sqlPattern.test(input)
  }
  
  // 敏感信息脱敏
  static maskSensitive(data: any): any {
    const sensitiveFields = ['password', 'idCard', 'bankCard', 'phone']
    
    if (typeof data === 'object' && data !== null) {
      const masked = { ...data }
      
      sensitiveFields.forEach(field => {
        if (masked[field]) {
          const value = String(masked[field])
          if (field === 'phone') {
            masked[field] = value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          } else if (field === 'idCard') {
            masked[field] = value.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
          } else {
            masked[field] = '******'
          }
        }
      })
      
      return masked
    }
    
    return data
  }
}
```

#### 6.2 CSRF 防护

**Axios 配置添加：**
```typescript
// src/utils/axios/config.ts
export const handleChangeRequestHeader = (config: any) => {
  // CSRF Token
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  
  // 其他配置...
  return config
}
```

---

## 🟡 P2 优先级（建议添加）

### 7. API Mock 系统

**创建：** `mock/index.ts`
```typescript
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return
  }
  mockModules.push(...(modules[key] as any).default)
})

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
```

**配置：** `vite.config.ts`
```typescript
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    })
  ]
})
```

---

### 8. 数据埋点

**创建：** `src/plugins/analytics.ts`
```typescript
// 神策分析示例
export function setupAnalytics() {
  if (import.meta.env.PROD) {
    // 初始化神策
    // (function(para) { /* ... */ })(/* 配置 */)
  }
}

// 埋点工具
export const analytics = {
  // 页面浏览
  pageView(pageName: string) {
    if (import.meta.env.PROD) {
      // window.sensors?.track('$pageview', { page_name: pageName })
    }
  },
  
  // 按钮点击
  buttonClick(buttonName: string, extra?: Record<string, any>) {
    if (import.meta.env.PROD) {
      // window.sensors?.track('button_click', { button_name: buttonName, ...extra })
    }
  },
  
  // 自定义事件
  event(eventName: string, properties?: Record<string, any>) {
    if (import.meta.env.PROD) {
      // window.sensors?.track(eventName, properties)
    }
  }
}
```

---

## 📋 实施计划

### 第一阶段（1-2周）- P0
1. ✅ 配置 Vitest 和基础测试
2. ✅ 编写核心工具函数测试（utils、axios）
3. ✅ 配置 Playwright E2E 测试
4. ✅ 编写关键流程 E2E 测试（登录、列表、编辑）
5. ✅ 集成 Sentry 错误监控

### 第二阶段（1周）- P1
1. ✅ 完善日志系统
2. ✅ 添加性能监控
3. ✅ 增强权限指令
4. ✅ 实施安全防护

### 第三阶段（1周）- P2
1. ✅ 配置 Mock 系统
2. ✅ 接入数据埋点
3. ✅ 灰度发布配置
4. ✅ 文档完善

---

## 🎯 目标对比

| 指标 | 当前 | 企业级目标 | 差距 |
|------|------|-----------|------|
| **测试覆盖率** | 0% | 80%+ | ❌ 需补充 |
| **错误监控** | 基础 | Sentry 完整集成 | ⚠️ 需完善 |
| **性能监控** | 无 | Web Vitals 监控 | ❌ 需添加 |
| **日志系统** | 简单 | 分级+上报 | ⚠️ 需增强 |
| **权限控制** | 路由级 | 按钮级+数据级 | ⚠️ 需细化 |
| **安全防护** | 基础 | XSS+CSRF+输入验证 | ⚠️ 需加强 |
| **CI/CD** | 无 | 自动化测试+部署 | ❌ 需建立 |
| **文档** | 较好 | API+流程+架构 | ⚠️ 需补充 |

---

## 📚 参考资源

### 测试
- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright 文档](https://playwright.dev/)

### 监控
- [Sentry Vue 集成](https://docs.sentry.io/platforms/javascript/guides/vue/)
- [Web Vitals](https://web.dev/vitals/)

### 安全
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify](https://github.com/cure53/DOMPurify)

---

完成这些项后，项目将达到**真正的企业级标准**，具备完整的质量保障、监控告警、安全防护体系！🚀
