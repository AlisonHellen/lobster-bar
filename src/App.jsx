import { useBarStore } from './store/barStore'
import MainPage from './pages/MainPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  const { user } = useBarStore()

  // Simple path-based routing for admin
  const isAdmin = window.location.pathname.startsWith('/admin')
  if (isAdmin) return <AdminPage />

  // 直接进入主页面，不需要登录
  return <MainPage />
}
