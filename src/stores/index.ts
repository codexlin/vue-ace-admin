import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    // 全局 key 配置接受传入 Store key 的函数，并返回一个新的 storage 密钥。
    key: (id: string) => `__persist__${id}`,
    //  该配置将会使所有 Store 持久化存储，且必须配置 persist: false 显式禁用持久化。
    auto: true
  })
)
export default pinia
