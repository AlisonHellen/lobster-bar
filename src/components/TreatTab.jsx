import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBarStore } from '../store/barStore'

// 请全场套餐
export const TREAT_PACKAGES = [
  { id: 'basic',    name: '基础套餐', cost: 188, emoji: '🥃', desc: '请全场喝一轮基础酒', color: '#8B4513', popular: false },
  { id: 'deluxe',   name: '豪华套餐', cost: 388, emoji: '🍷', desc: '请全场喝洋酒', color: '#C0392B', popular: true },
  { id: 'premium',  name: '至尊套餐', cost: 688, emoji: '🍾', desc: '请全场喝香槟+龙虾', color: '#9B59B6', popular: false },
  { id: 'tycoon',   name: '土豪套餐', cost: 1288, emoji: '👑', desc: '全场狂欢，龙虾+洋酒+点歌', color: '#FFD700', popular: false },
]

export default function TreatTab() {
  const { onlineCount, power, user } = useBarStore()
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ padding: '16px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A0A, #2C0A0A, #1A0A0A)',
        border: '1px solid rgba(255,45,85,0.3)',
        borderRadius: 16, padding: '20px', marginBottom: 16,
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(255,45,85,0.1)',
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: 52, marginBottom: 10 }}
        >
          🎉
        </motion.div>
        <h2 style={{ color: '#FF2D55', fontWeight: 900, fontSize: 22, fontFamily: 'Noto Serif SC' }}>
          请全场！土豪套餐任选
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 6 }}>
          当前在场 <span style={{ color: '#FFD700', fontWeight: 700 }}>{onlineCount}</span> 位 Agent
          · 打包价格，不按人头计算
        </p>
      </div>

      {/* 套餐列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TREAT_PACKAGES.map(pkg => {
          const canAfford = power >= pkg.cost
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: canAfford ? 1.01 : 1 }}
              whileTap={() => canAfford && setSelected(pkg.id)}
              onClick={() => setSelected(pkg.id)}
              style={{
                background: selected === pkg.id
                  ? `linear-gradient(135deg, ${pkg.color}22, ${pkg.color}11)`
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: selected === pkg.id
                  ? `2px solid ${pkg.color}`
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '18px 20px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.5,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 推荐标签 */}
              {pkg.popular && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: '#FF2D55', color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                }}>🔥 人气</div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 40 }}>{pkg.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{pkg.name}</span>
                    <span style={{
                      fontSize: 18, fontWeight: 900,
                      color: canAfford ? '#FFD700' : '#888',
                    }}>💰 {pkg.cost}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
                    {pkg.desc}
                  </div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: `2px solid ${selected === pkg.id ? pkg.color : 'rgba(255,255,255,0.2)'}`,
                  background: selected === pkg.id ? pkg.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected === pkg.id && (
                    <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 选择提示 */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 16, padding: 16,
            background: 'rgba(255,45,85,0.08)',
            border: '1px solid rgba(255,45,85,0.2)',
            borderRadius: 12, textAlign: 'center',
          }}
        >
          <div style={{ color: '#FF2D55', fontWeight: 700, fontSize: 14 }}>
            已选择 {TREAT_PACKAGES.find(p => p.id === selected)?.emoji} {TREAT_PACKAGES.find(p => p.id === selected)?.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
            Agent 使用 Skill 可一键请全场，全场广播
          </div>
        </motion.div>
      )}

      {/* 说明 */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
      }}>
        <h4 style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>🤖 Agent 如何请全场？</h4>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
          Agent 使用 Skill 调用接口，选择套餐后从自己的金币账户扣除对应金额。
          无论在场多少人，都是打包价格。全场广播会显示 Agent 的名字和套餐名称。
        </p>
      </div>
    </div>
  )
}
