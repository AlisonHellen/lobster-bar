import { useState } from 'react'
import { useAdminStore } from '../../store/adminStore'

const STATUS_STYLE = {
  ok:      { label: '正常',   cls: 'badge-green' },
  warn:    { label: '可疑',   cls: 'badge-yellow' },
  blocked: { label: '已屏蔽', cls: 'badge-red' },
}

const TYPE_STYLE = {
  chat:      { label: '普通聊天', color: 'rgba(255,255,255,0.5)' },
  broadcast: { label: '全场广播', color: '#FFD700' },
}

export default function ChatManage() {
  const { messages, barConfig, updateBarConfig, blockMessage, restoreMessage, sendBroadcast, addNotice } = useAdminStore()
  const [broadcastText, setBroadcastText] = useState('')
  const [newWord, setNewWord] = useState('')

  const handleBroadcast = () => {
    if (!broadcastText.trim()) return
    sendBroadcast(broadcastText.trim())
    addNotice('📢 广播已发送到公屏！')
    setBroadcastText('')
  }

  const addSensitiveWord = () => {
    if (!newWord.trim()) return
    updateBarConfig('sensitiveWords', [...barConfig.sensitiveWords, newWord.trim()])
    setNewWord('')
    addNotice(`✅ 已添加敏感词：${newWord}`)
  }

  const removeSensitiveWord = (w) => {
    updateBarConfig('sensitiveWords', barConfig.sensitiveWords.filter(s => s !== w))
    addNotice(`🗑️ 已删除敏感词：${w}`)
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">💬 公屏管理</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Message list */}
        <div>
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>内容</th>
                  <th>类型</th>
                  <th>时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => {
                  const st = STATUS_STYLE[msg.status] || STATUS_STYLE.ok
                  const tp = TYPE_STYLE[msg.type] || TYPE_STYLE.chat
                  return (
                    <tr key={msg.id} style={{ opacity: msg.status === 'blocked' ? 0.5 : 1 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 18 }}>{msg.avatar}</span>
                          <span style={{ color: '#fff', fontSize: 13 }}>{msg.user}</span>
                        </div>
                      </td>
                      <td style={{
                        maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: msg.status === 'blocked' ? '#F87171' : 'rgba(255,255,255,0.7)',
                        fontSize: 13,
                        textDecoration: msg.status === 'blocked' ? 'line-through' : 'none',
                      }}>
                        {msg.msg}
                      </td>
                      <td><span style={{ fontSize: 12, color: tp.color }}>{tp.label}</span></td>
                      <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{msg.time}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>
                        {msg.status === 'blocked' ? (
                          <button className="admin-btn admin-btn-primary"
                            onClick={() => { restoreMessage(msg.id); addNotice('✅ 消息已恢复显示') }}>
                            恢复
                          </button>
                        ) : (
                          <button className="admin-btn admin-btn-danger"
                            onClick={() => { blockMessage(msg.id); addNotice('🚫 消息已屏蔽') }}>
                            屏蔽
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Broadcast */}
          <div className="stat-card">
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
              📢 发送管理员广播
            </div>
            <textarea
              className="admin-input"
              style={{ width: '100%', height: 80, resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="输入要广播到公屏的内容..."
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
            />
            <button
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', marginTop: 10, padding: '10px' }}
              onClick={handleBroadcast}
            >
              📢 立即广播到公屏
            </button>
          </div>

          {/* Sensitive words */}
          <div className="stat-card">
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
              🚫 敏感词过滤
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {barConfig.sensitiveWords.map(w => (
                <span key={w} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  borderRadius: 6, padding: '3px 8px',
                  fontSize: 12, color: '#F87171',
                }}>
                  {w}
                  <button
                    onClick={() => removeSensitiveWord(w)}
                    style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
                  >×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="admin-input"
                style={{ flex: 1 }}
                placeholder="添加敏感词..."
                value={newWord}
                onChange={e => setNewWord(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSensitiveWord()}
              />
              <button className="admin-btn admin-btn-danger" onClick={addSensitiveWord}>添加</button>
            </div>
          </div>

          {/* Toggle broadcast */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#F0E6C8', fontSize: 13, fontWeight: 600 }}>开启公屏广播</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>关闭后停止自动广播</div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={barConfig.broadcastEnabled}
                  onChange={e => { updateBarConfig('broadcastEnabled', e.target.checked); addNotice(e.target.checked ? '✅ 公屏广播已开启' : '🔇 公屏广播已关闭') }}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
