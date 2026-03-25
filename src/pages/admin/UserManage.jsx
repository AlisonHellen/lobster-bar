import { useState } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { useBarStore } from '../../store/barStore'

const STATUS_MAP = {
  online:  { label: '在线', cls: 'badge-green' },
  idle:    { label: '空闲', cls: 'badge-yellow' },
  offline: { label: '离线', cls: 'badge-gray' },
  banned:  { label: '已封禁', cls: 'badge-red' },
}

export default function UserManage() {
  const { users, adjustPower, banUser, addNotice } = useAdminStore()
  // 同时订阅 barStore，确保 syncBridge 更新 adminStore 后本组件也能响应
  const barUser = useBarStore(s => s.user)
  const adminAdjustPower = useBarStore(s => s.adminAdjustPower)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deltaInput, setDeltaInput] = useState('')

  const filtered = users.filter(u =>
    u.name.includes(search) || u.title.includes(search)
  )

  const handleAdjust = (userId, delta) => {
    if (userId === 'me') {
      // 真实玩家：直接修改 barStore，syncBridge 会自动同步回 adminStore
      adminAdjustPower(userId, delta)
    } else {
      adjustPower(userId, delta)
    }
    addNotice(`✅ 金币调整成功：${delta > 0 ? '+' : ''}${delta}`)
    setEditUser(null)
    setDeltaInput('')
  }

  const handleBan = (userId, name, isBanned) => {
    banUser(userId)
    addNotice(isBanned ? `✅ 已解封用户：${name}` : `🚫 已封禁用户：${name}`)
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">👥 用户管理</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            className="admin-input"
            placeholder="搜索昵称/身份..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <span className="badge badge-green">{users.filter(u => u.status === 'online').length} 在线</span>
        </div>
      </div>

      <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>身份</th>
              <th>状态</th>
              <th>剩余金币</th>
              <th>今日消费</th>
              <th>累计消费</th>
              <th>请全场</th>
              <th>点歌</th>
              <th>加入时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const st = STATUS_MAP[u.status] || STATUS_MAP.offline
              const isBanned = u.status === 'banned'
              return (
                <tr key={u.id} style={{ opacity: isBanned ? 0.5 : 1 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{u.avatar}</span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${u.title === '至尊土豪' ? 'badge-red' : u.title === '钻石土豪' ? 'badge-blue' : 'badge-yellow'}`}>{u.title}</span></td>
                  <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  <td>
                    <span style={{ color: u.power < 100 ? '#F87171' : '#FFD700', fontWeight: 700 }}>
                      {u.power.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ color: '#60A5FA' }}>{u.todaySpent.toLocaleString()}</td>
                  <td style={{ color: 'rgba(255,255,255,0.6)' }}>{u.totalSpent.toLocaleString()}</td>
                  <td style={{ color: '#F87171' }}>{u.treatCount}次</td>
                  <td style={{ color: '#FBBF24' }}>{u.songCount}首</td>
                  <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{u.joinTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => { setEditUser(u); setDeltaInput('') }}
                      >
                        💰 金币
                      </button>
                      <button
                        className={`admin-btn ${isBanned ? 'admin-btn-ghost' : 'admin-btn-danger'}`}
                        onClick={() => handleBan(u.id, u.name, isBanned)}
                      >
                        {isBanned ? '解封' : '封禁'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Power adjust modal */}
      {editUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#161921', border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: 14, padding: '28px 24px', width: 340,
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                💰 调整金币
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                {editUser.avatar} {editUser.name} · 当前 {editUser.power} 金币
              </div>
            </div>

            {/* Quick presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {[50, 100, 200, 500, -50, -100].map(d => (
                <button
                  key={d}
                  className={`admin-btn ${d > 0 ? 'admin-btn-primary' : 'admin-btn-danger'}`}
                  onClick={() => handleAdjust(editUser.id, d)}
                >
                  {d > 0 ? '+' : ''}{d}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                className="admin-input"
                style={{ flex: 1 }}
                type="number"
                placeholder="自定义数值（正数加，负数减）"
                value={deltaInput}
                onChange={e => setDeltaInput(e.target.value)}
              />
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => deltaInput && handleAdjust(editUser.id, parseInt(deltaInput))}
              >确认</button>
            </div>

            <button
              className="admin-btn admin-btn-ghost"
              style={{ width: '100%' }}
              onClick={() => setEditUser(null)}
            >取消</button>
          </div>
        </div>
      )}
    </div>
  )
}
