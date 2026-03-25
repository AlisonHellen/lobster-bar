import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBarStore } from '../store/barStore'
import { TITLE_OPTIONS, AVATAR_OPTIONS } from '../data/gameData'

export default function WelcomePage() {
  const [step, setStep] = useState(0) // 0: intro, 1: setup
  const [name, setName] = useState('')
  const [selectedTitle, setSelectedTitle] = useState(TITLE_OPTIONS[0])
  const [selectedAvatar, setSelectedAvatar] = useState('🦞')
  const [nameError, setNameError] = useState('')
  const { createUser, setCurrentPage, user, dailyCheckIn, lastCheckInDate, checkNameAvailable, rankings, onlineCount, loadData } = useBarStore()

  // 定时刷新统计数据
  useEffect(() => {
    loadData()
    const timer = setInterval(() => {
      loadData()
    }, 30000)
    return () => clearInterval(timer)
  }, [loadData])

  // 判断今日是否已签到
  const todayStr = new Date().toDateString()
  const hasCheckedInToday = lastCheckInDate === todayStr

  // 已有账号时：先尝试签到再进入主页
  const handleResume = () => {
    if (!hasCheckedInToday) {
      dailyCheckIn()
    }
    setCurrentPage('main')
  }

  const handleEnter = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setNameError('请输入土豪昵称')
      return
    }

    // 检查是否为当前登录用户（从 localStorage 恢复的情况）
    const currentUser = useBarStore.getState().user
    if (currentUser && currentUser.name === trimmedName) {
      setCurrentPage('main')
      return
    }

    // 检查用户名是否可用(异步查数据库)
    const nameCheck = await checkNameAvailable(trimmedName)
    if (!nameCheck.available) {
      setNameError(nameCheck.reason || '该昵称已被占用')
      return
    }

    // 新用户，创建账号
    const result = await createUser(trimmedName, selectedTitle.label, selectedAvatar, selectedTitle.power)
    if (result?.success === false) {
      setNameError(result.error || '创建账号失败，请重试')
      return
    }
    setCurrentPage('main')
  }

  // 用户名输入时实时检查（异步防抖）
  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)
    setNameError('') // 先清空错误，避免残留

    if (newName.trim()) {
      // 延迟 400ms 再查，避免每个字符都请求数据库
      clearTimeout(window._nameCheckTimer)
      window._nameCheckTimer = setTimeout(async () => {
        const nameCheck = await checkNameAvailable(newName.trim())
        if (!nameCheck.available) {
          setNameError(nameCheck.reason || '该昵称已被占用')
        }
      }, 400)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #3D0A14 0%, #1A0508 40%, #0A0608 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            background: '#FFD700',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
            animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}
          >
            {/* Logo */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ fontSize: 100, lineHeight: 1, marginBottom: 16 }}
            >
              🦞
            </motion.div>

            <h1 className="shimmer-text" style={{
              fontSize: 42, fontWeight: 900, letterSpacing: 4,
              fontFamily: 'Noto Serif SC, serif', marginBottom: 8,
            }}>
              土豪龙虾酒吧
            </h1>
            <p style={{ color: '#C9A84C', fontSize: 16, letterSpacing: 2, marginBottom: 8 }}>
              ✦ LOBSTER PREMIUM BAR ✦
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 40 }}>
              当前酒吧已有 <span style={{ color: '#FFD700', fontWeight: 700 }}>{onlineCount}</span> 位土豪在场
              · 今日消费榜第一已豪掷 <span style={{ color: '#FF2D55', fontWeight: 700 }}>{rankings.today[0]?.todaySpend || 0}</span> 金币
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              {['🍾 点酒', '🎵 点歌', '🦞 请全场', '👑 土豪榜'].map(f => (
                <span key={f} style={{
                  padding: '6px 16px',
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: 20, fontSize: 13, color: '#FFD700',
                }}>{f}</span>
              ))}
            </div>

            <motion.button
              className="btn-gold"
              style={{ fontSize: 18, padding: '14px 48px', borderRadius: 12, letterSpacing: 2 }}
              onClick={() => setStep(1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 入场享受
            </motion.button>

            {/* Resume entry for existing user */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: 20,
                  padding: '14px 20px',
                  background: 'rgba(255,215,0,0.07)',
                  border: '1px solid rgba(255,215,0,0.25)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={handleResume}
                whileHover={{ scale: 1.02, background: 'rgba(255,215,0,0.12)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: 32 }}>{user.avatar}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 15 }}>
                    {user.name}
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
                      {user.title}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                    点击继续上次的入场
                  </div>
                </div>
                {/* 每日签到奖励角标 */}
                {!hasCheckedInToday && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                      background: 'linear-gradient(135deg, #FF2D55, #C0392B)',
                      color: '#fff', fontSize: 10, fontWeight: 700,
                      padding: '3px 8px', borderRadius: 10,
                      letterSpacing: 0.5, whiteSpace: 'nowrap',
                    }}
                  >
                    🎁 今日签到 +100金币
                  </motion.div>
                )}
                {hasCheckedInToday && (
                  <span style={{ color: 'rgba(52,211,153,0.8)', fontSize: 11 }}>✓ 已签到</span>
                )}
                <span style={{ color: '#FFD700', fontSize: 20 }}>→</span>
              </motion.div>
            )}

            {/* New account entry */}
            {user && (
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.25)', fontSize: 12,
                    cursor: 'pointer', letterSpacing: 1,
                  }}
                >
                  使用新账号入场
                </button>
              </div>
            )}

            {/* Admin entry */}
            <div style={{ marginTop: 16 }}>
              <a
                href="/admin"
                style={{
                  color: 'rgba(255,255,255,0.2)', fontSize: 12,
                  textDecoration: 'none', letterSpacing: 1,
                }}
              >
                ⚙️ 管理员后台
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '100%',
              maxWidth: 480,
              padding: '0 16px',
            }}
          >
            <div className="card" style={{ padding: '28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>{selectedAvatar}</div>
                <h2 style={{ color: '#FFD700', fontSize: 22, marginTop: 8, fontFamily: 'Noto Serif SC' }}>
                  设置你的土豪身份
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
                  龙虾管家恭候大驾
                </p>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#C9A84C', fontSize: 13, display: 'block', marginBottom: 8 }}>
                  土豪昵称
                </label>
                <input
                  value={name}
                  onChange={handleNameChange}
                  placeholder="例：龙虾界大佬、海鲜王者..."
                  maxLength={12}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: nameError ? '1px solid #FF2D55' : '1px solid rgba(255,215,0,0.3)',
                    borderRadius: 8, color: '#fff', fontSize: 15,
                    outline: 'none', transition: 'border 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = nameError ? '#FF2D55' : '#FFD700'}
                  onBlur={e => e.target.style.borderColor = nameError ? '#FF2D55' : 'rgba(255,215,0,0.3)'}
                />
                {nameError && (
                  <div style={{ color: '#FF2D55', fontSize: 12, marginTop: 6, marginLeft: 4 }}>
                    ⚠️ {nameError}
                  </div>
                )}
              </div>

              {/* Avatar Select */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#C9A84C', fontSize: 13, display: 'block', marginBottom: 8 }}>
                  选择头像
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      style={{
                        width: 44, height: 44, fontSize: 24,
                        background: selectedAvatar === av ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                        border: selectedAvatar === av ? '2px solid #FFD700' : '2px solid transparent',
                        borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Select */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#C9A84C', fontSize: 13, display: 'block', marginBottom: 8 }}>
                  初始身份
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TITLE_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTitle(t)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 10,
                        background: selectedTitle.id === t.id ? `rgba(255,215,0,0.1)` : 'rgba(255,255,255,0.04)',
                        border: selectedTitle.id === t.id ? `2px solid ${t.color}` : '2px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        color: '#fff',
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: t.color, fontSize: 14 }}>{t.label}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{t.desc}</div>
                      </div>
                      <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 16 }}>
                        {t.power}
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>金币</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                className="btn-gold"
                style={{
                  width: '100%', fontSize: 16,
                  padding: '14px', borderRadius: 10, letterSpacing: 2,
                  opacity: (name.trim() && !nameError) ? 1 : 0.4,
                }}
                onClick={handleEnter}
                disabled={!name.trim() || nameError}
                whileHover={(name.trim() && !nameError) ? { scale: 1.02 } : {}}
                whileTap={(name.trim() && !nameError) ? { scale: 0.98 } : {}}
              >
                🦞 入场！我是{name || '土豪'}
              </motion.button>
            </div>

            <button
              onClick={() => setStep(0)}
              style={{
                display: 'block', margin: '12px auto 0',
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer',
              }}
            >
              ← 返回
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
