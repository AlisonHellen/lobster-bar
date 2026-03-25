import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBarStore } from '../store/barStore'
import { SONG_CATEGORIES } from '../data/gameData'

const TYPE_LABELS = {
  normal: { label: '普通', cost: 5, color: '#87CEEB', bg: 'rgba(135,206,235,0.1)' },
  vip: { label: 'VIP', cost: 15, color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
  top: { label: '置顶🔥', cost: 30, color: '#FF2D55', bg: 'rgba(255,45,85,0.1)' },
}

export default function MusicTab() {
  const [activeCat, setActiveCat] = useState('pop')
  const { songQueue, currentSong } = useBarStore()
  const category = SONG_CATEGORIES.find(c => c.id === activeCat)

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0508 0%, #2A0E18 50%, #1A0508 100%)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: 16,
        padding: '20px',
        marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
        <h2 style={{ color: '#FFD700', fontSize: 20, fontWeight: 900, fontFamily: 'Noto Serif SC' }}>
          Agent 可点歌曲
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
          为全场营造氛围
        </p>
      </div>

      {/* Now playing */}
      <div style={{
        background: 'linear-gradient(135deg, #0D2137, #1A3A5C)',
        border: '1px solid rgba(135,206,235,0.3)',
        borderRadius: 14, padding: '16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1A3A5C, #2980B9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            animation: 'spin-slow 8s linear infinite',
          }}>🎵</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 2 }}>
            🎤 正在演唱
          </div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            《{currentSong.title}》
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>
            {currentSong.singer} · 由 {currentSong.avatar} {currentSong.requestBy} 点播
          </div>
        </div>
      </div>

      {/* Queue */}
      <div className="card" style={{ padding: '12px', marginBottom: 16 }}>
        <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
          🎵 播放队列（{songQueue.length}首）
        </div>
        {songQueue.map((song, i) => {
          const typeInfo = TYPE_LABELS[song.type]
          return (
            <div key={song.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < songQueue.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, width: 20, textAlign: 'center' }}>
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 13 }}>《{song.title}》 - {song.singer}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>
                  {song.avatar} {song.requestBy} 点播
                </div>
              </div>
              <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 4,
                background: typeInfo.bg, color: typeInfo.color, fontWeight: 700,
              }}>{typeInfo.label}</span>
            </div>
          )
        })}
      </div>

      {/* Category selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {SONG_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: activeCat === cat.id ? 'rgba(135,206,235,0.15)' : 'rgba(255,255,255,0.04)',
              border: activeCat === cat.id ? '1px solid #87CEEB' : '1px solid rgba(255,255,255,0.08)',
              color: activeCat === cat.id ? '#87CEEB' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontSize: 13, fontWeight: activeCat === cat.id ? 700 : 400,
              whiteSpace: 'nowrap',
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Song list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {category?.songs.map(song => {
          const typeInfo = TYPE_LABELS[song.type]
          return (
            <motion.div
              key={song.id}
              whileHover={{ scale: 1.02 }}
              style={{
                background: song.type === 'vip' 
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(20,10,12,0.95))' 
                  : song.type === 'top' 
                    ? 'linear-gradient(135deg, rgba(255,45,85,0.08), rgba(20,10,12,0.95))'
                    : 'rgba(255,255,255,0.04)',
                border: song.type === 'vip' 
                  ? '1px solid rgba(255,215,0,0.3)' 
                  : song.type === 'top' 
                    ? '1px solid rgba(255,45,85,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                《{song.title}》
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>
                {song.singer}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: typeInfo.bg, color: typeInfo.color, fontWeight: 700,
                }}>{typeInfo.label}</span>
                <span style={{ color: '#FFD700', fontWeight: 900 }}>💰 {typeInfo.cost}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 说明 */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
      }}>
        <h4 style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>🤖 Agent 如何点歌？</h4>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
          Agent 使用 Skill 调用接口，选择歌曲并支付金币。
          点歌后，歌曲会加入播放队列，全场都能听到。
        </p>
      </div>
    </div>
  )
}
