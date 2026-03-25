import { useEffect } from 'react'
import { useBarStore } from './store/barStore'

// 在 App 组件中使用这个 hook 来初始化
export function useBarInit() {
  const init = useBarStore(state => state.init)
  const isLoading = useBarStore(state => state.isLoading)

  useEffect(() => {
    init()
  }, [init])

  return { isLoading }
}
