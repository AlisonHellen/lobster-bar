import { AnimatePresence, motion } from 'framer-motion'
import { useAdminStore } from '../../store/adminStore'
import AdminLogin from './AdminLogin'
import Dashboard from './Dashboard'
import UserManage from './UserManage'
import MenuManage from './MenuManage'
import ChatManage from './ChatManage'
import OrderManage from './OrderManage'
import BarConfig from './BarConfig'
import '../admin.css'

const NAV_ITEMS = [
  { id: 'dashboard', label: '数据概览',   icon: '📊' },
  { id: 'users',     label: '用户管理',   icon: '👥' },
  { id: 'orders',    label: '订单记录',   icon: '📋' },
  { id: 'menu',      label: '菜单管理',   icon: '🍽️' },
  { id: 'chat',      label: '公屏管理',   icon: '💬' },
  { id: 'config',    label: '酒吧配置',   icon: '⚙️' },
]

const SECTION_MAP = {
  dashboard: Dashboard,
  users:     UserManage,
  orders:    OrderManage,
  menu:      MenuManage,
  chat:      ChatManage,
  config:    BarConfig,
}

export default function AdminPage() {
  const { isLoggedIn, activeSection, setSection, logout, adminName, adminNotices, stats } = useAdminStore()

  if (!isLoggedIn) return <AdminLogin />

  const Section = SECTION_MAP[activeSection] || Dashboard

  return (
    <div className="admin-root">
      {/* Top bar */}
      <div style={{
        height: 52,
        background: '#111318',
        borderBottom: '1px solid rgba(255,215,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🦞</span>
          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>
            土豪龙虾酒吧 · 管理后台
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <span>👥 在线 <b style={{ color: '#34D399' }}>{stats.onlineUsers}</b></span>
            <span>💰 今日 <b style={{ color: '#FFD700' }}>{stats.todayPower.toLocaleString()}</b></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>👨‍💼 {adminName}</span>
            <button
              onClick={logout}
              className="admin-btn admin-btn-ghost"
              style={{ fontSize: 12 }}
            >退出</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div style={{ padding: '16px 8px 8px', flex: 1 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setSection(item.id)}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Bottom links */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <a
              href="/"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.3)', fontSize: 12,
                textDecoration: 'none',
              }}
            >
              ← 返回前台
            </a>
          </div>
        </div>

        {/* Content */}
        <div
          className="admin-scroll"
          style={{ flex: 1, overflow: 'auto', padding: '24px', background: '#0D0F14' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Section />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Admin notices */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 999,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <AnimatePresence>
          {adminNotices.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              style={{
                background: '#1E2332',
                border: '1px solid rgba(255,215,0,0.25)',
                borderRadius: 8, padding: '10px 16px',
                color: '#F0E6C8', fontSize: 13,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
