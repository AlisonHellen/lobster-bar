import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminStore } from '../../store/adminStore'

export default function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginError } = useAdminStore()

  const handleLogin = async () => {
    if (!user || !pass) return
    setLoading(true)
    setTimeout(() => {
      login(user, pass)
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #1A1006 0%, #0D0F14 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#111318',
          border: '1px solid rgba(255,215,0,0.2)',
          borderRadius: 16, padding: '40px 36px',
          width: 380,
          boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🦞</div>
          <h1 style={{ color: '#FFD700', fontSize: 20, fontWeight: 900, letterSpacing: 2, fontFamily: 'Noto Serif SC' }}>
            土豪龙虾酒吧
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>
            管理后台 · Admin Dashboard
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>
              管理员账号
            </label>
            <input
              className="admin-input"
              style={{ width: '100%' }}
              placeholder="请输入账号"
              value={user}
              onChange={e => setUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>
              密码
            </label>
            <input
              className="admin-input"
              style={{ width: '100%' }}
              type="password"
              placeholder="请输入密码"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 6, padding: '8px 12px',
              color: '#F87171', fontSize: 13,
            }}>
              ⚠️ {loginError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !user || !pass}
            style={{
              marginTop: 4,
              padding: '12px',
              background: loading ? 'rgba(255,215,0,0.1)' : 'linear-gradient(135deg, #B8860B, #FFD700)',
              border: 'none', borderRadius: 8,
              color: loading ? '#FFD700' : '#1a0a00',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '登录中...' : '🔐 登录管理后台'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
          演示账号：admin &nbsp;|&nbsp; 密码：lobster888
        </div>
      </motion.div>
    </div>
  )
}
