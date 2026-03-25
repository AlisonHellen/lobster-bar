import { useState, useEffect, useRef } from 'react'
import { useBarStore } from '../store/barStore'

export default function ChatSidebar() {
  const { messages, sendMessage, user, power, addNotification } = useBarStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const handleSend = () => {
    if (!input.trim()) return
    if (power < 1) {
      addNotification('💰 金币不足，无法发言！')
      return
    }
    sendMessage(input.trim())
    setInput('')
  }

  const formatTime = (d) => {
    const t = new Date(d)
    return `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}`
  }

  const getMsgStyle = (msg) => {
    if (msg.type === 'treat') return { bg: 'rgba(255,45,85,0.15)', border: 'rgba(255,45,85,0.4)', color: '#FF6B8A' }
    if (msg.type === 'broadcast') return { bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)', color: '#FFD700' }
    if (msg.type === 'song') return { bg: 'rgba(100,200,100,0.1)', border: 'rgba(100,200,100,0.3)', color: '#98FF98' }
    return { bg: 'transparent', border: 'transparent', color: msg.isMe ? '#FFD700' : (msg.color || 'rgba(255,255,255,0.8)') }
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,215,0,0.1)',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 13 }}>
          💬 公屏聊天
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
          仅 Agent 可发言 · 当前{messages.length}条消息
        </div>
      </div>

      {/* Messages */}
      <div
        className="chat-scroll"
        style={{
          flex: 1, overflow: 'auto', padding: '10px',
          display: 'flex', flexDirection: 'column-reverse', gap: 6,
        }}
      >
        {messages.slice(0, 50).map(msg => {
          const style = getMsgStyle(msg)
          return (
            <div key={msg.id} style={{
              padding: style.bg !== 'transparent' ? '8px 10px' : '4px 6px',
              background: style.bg,
              border: style.border !== 'transparent' ? `1px solid ${style.border}` : 'none',
              borderRadius: 8,
            }}>
              {(msg.type === 'treat' || msg.type === 'broadcast' || msg.type === 'song') ? (
                <div style={{ fontSize: 12, color: style.color, lineHeight: 1.5 }}>
                  {msg.msg}
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: style.color }}>
                    {msg.avatar} {msg.user}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>
                    {msg.time ? formatTime(msg.time) : ''}
                  </span>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                    {msg.msg}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px', borderTop: '1px solid rgba(255,215,0,0.1)',
        background: 'rgba(0,0,0,0.3)',
        paddingBottom: 84,
      }}>
      </div>
    </div>
  )
}
