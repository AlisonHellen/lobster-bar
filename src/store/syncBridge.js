/**
 * syncBridge.js
 * 监听 barStore 的状态变化，自动同步到 adminStore。
 * 在 main.jsx 中调用 initSyncBridge() 一次即可。
 */
import { useBarStore } from './barStore'
import { useAdminStore } from './adminStore'

export function initSyncBridge() {
  // 立即执行一次，把已持久化的数据（localStorage 恢复）同步过来
  useAdminStore.getState().syncFromBar(useBarStore.getState())

  // 订阅 barStore 后续所有变化
  const unsubscribe = useBarStore.subscribe((barState) => {
    useAdminStore.getState().syncFromBar(barState)
  })

  return unsubscribe
}
