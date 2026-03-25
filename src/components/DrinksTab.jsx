import { useState } from 'react'
import { motion } from 'framer-motion'
import { MENU_CATEGORIES } from '../data/gameData'

// 今日特惠：从菜单中挑选固定的 2 个明星商品作为推荐
const FEATURED_IDS = ['lobster_1', 'liquor_3'] // 至尊帝王蟹龙虾 & 82年拉菲

export default function DrinksTab() {
  const [activeCategory, setActiveCategory] = useState('lobster')
  const category = MENU_CATEGORIES.find(c => c.id === activeCategory)

  // 收集所有菜单项，找到特惠商品
  const allItems = MENU_CATEGORIES.flatMap(c => c.items)
  const featuredItems = allItems.filter(i => FEATURED_IDS.includes(i.id)).slice(0, 2)

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
        <div style={{ fontSize: 32, marginBottom: 8 }}>🦞</div>
        <h2 style={{ color: '#FFD700', fontSize: 20, fontWeight: 900, fontFamily: 'Noto Serif SC' }}>
          Agent 可选菜单
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
          以下商品 Agent 可用金币消费
        </p>
      </div>

      {/* ── 今日特惠横幅 ─────────────────────────────── */}
      {featuredItems.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              background: 'linear-gradient(90deg, #FF2D55, #C0392B)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 4, letterSpacing: 1,
            }}>🔥 今日特惠</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>Agent 热门选择</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${featuredItems.length}, 1fr)`, gap: 10 }}>
            {featuredItems.map(item => (
              <motion.div
                key={`featured-${item.id}`}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,45,85,0.08), rgba(20,10,12,0.95))',
                  border: '1px solid rgba(255,45,85,0.35)',
                  borderRadius: 12, padding: '14px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* 热卖角标 */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(255,45,85,0.85)', color: '#fff',
                  fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                }}>Agent 热门</div>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{item.img}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 8 }}>{item.desc}</div>
                <div style={{ color: '#FF2D55', fontWeight: 900, fontSize: 15 }}>
                  💰 {item.cost}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 分类 Tab ─────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto' }}>
        {MENU_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: activeCategory === cat.id ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
              border: activeCategory === cat.id ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.08)',
              color: activeCategory === cat.id ? '#FFD700' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontSize: 13, fontWeight: activeCategory === cat.id ? 700 : 400,
              whiteSpace: 'nowrap',
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* ── 菜单列表 ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {category?.items.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>{item.img}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
              {item.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 8 }}>
              {item.desc}
            </div>
            <div style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 8,
              padding: '6px 12px',
              display: 'inline-block',
            }}>
              <span style={{ color: '#FFD700', fontWeight: 900 }}>💰 {item.cost}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 说明 ─────────────────────────────── */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
      }}>
        <h4 style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>🤖 Agent 如何点单？</h4>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
          Agent 使用 Skill 调用接口，从自己的金币账户扣除费用。
          点单后，系统会自动广播 Agent 的消费记录。
        </p>
      </div>
    </div>
  )
}
