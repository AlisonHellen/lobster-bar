import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBarStore } from '../store/barStore'

const TABS = [
  { id: 'today', label: '今日土豪榜', icon: '🏆' },
  { id: 'treats', label: '请全场榜', icon: '🎉' },
  { id: 'music', label: '点歌土豪榜', icon: '🎵' },
]

const MEDALS = ['👑', '🥈', '🥉']
const RANK_LABELS = ['今日龙虾土豪王', '全场买单王', '点歌土豪']

export default function RankingTab() {
  const [activeTab, setActiveTab] = useState('today')
  const { rankings, user, totalSpent } = useBarStore()

  // 用 user.id（UUID）匹配，不是 'me'
  const myRank = activeTab === 'today'
    ? rankings.today.findIndex(r => r.id === user?.id) + 1
    : activeTab === 'treats'
    ? rankings.treats.findIndex(r => r.id === user?.id) + 1
    : rankings.music.findIndex(r => r.id === user?.id) + 1

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A2E, #2C1A4A)',
        border: '1px solid rgba(138,43,226,0.3)',
        borderRadius: 14, padding: '20px', marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>👑</div>
        <h2 style={{ color: '#FFD700', fontSize: 22, fontWeight: 900, fontFamily: 'Noto Serif SC' }}>
          土豪排行榜
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
          实时更新 · 每分钟刷新 · 金币消耗即排名
        </p>
        {myRank > 0 && (
          <div style={{
            marginTop: 12,
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 8, padding: '8px 16px',
            display: 'inline-block',
          }}>
            <span style={{ color: '#FFD700', fontWeight: 700 }}>
              你当前排名第 {myRank} 位
            </span>
            {myRank === 1 && <span style={{ marginLeft: 6 }}>👑</span>}
          </div>
        )}
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '9px 4px', borderRadius: 10,
              background: activeTab === tab.id ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
              border: activeTab === tab.id ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: activeTab === tab.id ? '#FFD700' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 400,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Today ranking */}
      {activeTab === 'today' && (
        <RankList
          items={rankings.today.slice(0, 10)}
          renderRight={(item) => (
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 16 }}>
                {item.todaySpend?.toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>金币</div>
            </div>
          )}
          badge="今日龙虾土豪王"
        />
      )}

      {/* Treats ranking */}
      {activeTab === 'treats' && (
        <RankList
          items={rankings.treats}
          renderRight={(item) => (
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FF2D55', fontWeight: 900, fontSize: 15 }}>
                {item.count}次请全场
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>
                {item.total?.toLocaleString()} 金币
              </div>
            </div>
          )}
          badge="全场买单王"
        />
      )}

      {/* Music ranking */}
      {activeTab === 'music' && (
        <RankList
          items={rankings.music}
          renderRight={(item) => (
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#87CEEB', fontWeight: 900, fontSize: 15 }}>
                {item.songs}首歌
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>
                {item.total} 金币
              </div>
            </div>
          )}
          badge="点歌土豪"
        />
      )}

      {/* My stats */}
      {user && (
        <div className="card" style={{ padding: '16px', marginTop: 16 }}>
          <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
            📊 我的今日战绩
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: '今日消费', value: totalSpent, unit: '金币', color: '#FFD700' },
              { label: '排名', value: myRank || '未上榜', unit: '', color: '#87CEEB' },
              { label: '身份', value: user.title, unit: '', color: '#FF2D55', small: true },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8, padding: '10px', textAlign: 'center',
              }}>
                <div style={{
                  color: stat.color, fontWeight: 900,
                  fontSize: stat.small ? 12 : 18,
                }}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                {stat.unit && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{stat.unit}</div>}
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RankList({ items, renderRight, badge }) {
  const { user } = useBarStore()
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {items.map((item, i) => {
        const isTop3 = i < 3
        const isMe = item.id === user?.id
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: isMe ? 'rgba(255,215,0,0.06)' : (i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'),
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              borderLeft: isMe ? '3px solid #FFD700' : '3px solid transparent',
            }}
          >
            {/* Rank */}
            <div style={{ width: 32, textAlign: 'center' }}>
              {isTop3 ? (
                <span style={{ fontSize: 20 }}>{MEDALS[i]}</span>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 700 }}>
                  {i + 1}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 28 }}>{item.avatar}</span>
              {i === 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  fontSize: 12,
                }}>👑</span>
              )}
            </div>

            {/* Name & title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: isMe ? '#FFD700' : '#fff',
                fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {item.name}
                {isMe && <span style={{ fontSize: 10, color: '#FFD700', background: 'rgba(255,215,0,0.15)', padding: '1px 4px', borderRadius: 4 }}>我</span>}
              </div>
              {i === 0 && (
                <div style={{ fontSize: 10, color: '#FF2D55', marginTop: 1, fontWeight: 700 }}>
                  🔥 {badge}
                </div>
              )}
              {item.title && i > 0 && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                  {item.title}
                </div>
              )}
            </div>

            {renderRight(item)}
          </motion.div>
        )
      })}
    </div>
  )
}
