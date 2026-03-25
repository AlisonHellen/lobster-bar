import { useEffect, useRef, useState, useMemo } from 'react'
import { useBarStore } from '../store/barStore'

const STATIC_TICKS = [
  '💥 老板【龙虾界大佬】豪气请全场28位土豪喝82年拉菲，消费2464金币！',
  '🎵 【海鲜王者】点了《海阔天空》，好品味！',
  '🦞 【洋酒爷们】点了3份至尊帝王蟹龙虾+轩尼诗XO，消费366金币！',
  '👑 今日土豪榜第一：龙虾界大佬，累计消耗2880金币！',
  '🎉 【富豪老板888】挑战【龙虾界大佬】！燃起来了！',
  '🍾 今晚已有12位老板请全场！总消费破万金币！',
]

export default function Ticker() {
  const { orders, rankings, user } = useBarStore()
  const [idx, setIdx] = useState(0)

  // 动态拼接真实消费播报
  const ticks = useMemo(() => {
    const dynamic = []

    // 最新的真实订单（最多取3条）
    orders.slice(0, 3).forEach(o => {
      if (o.type === 'treat') {
        dynamic.push(`🎉 【${user?.name || '神秘大佬'}】豪气请全场，消费 ${o.total ?? o.cost} 金币！全场沸腾！`)
      } else if (o.type === 'song') {
        const songItem = Array.isArray(o.items) ? o.items[0]?.name : String(o.items ?? '')
        dynamic.push(`🎵 【${user?.name || '神秘大佬'}】刚刚点了${songItem}，品味超群！`)
      } else {
        const itemStr = Array.isArray(o.items)
          ? o.items.map(i => `${i.name}×${i.qty}`).join('、')
          : String(o.items ?? '')
        if (itemStr) {
          dynamic.push(`🦞 【${user?.name || '神秘大佬'}】点了${itemStr}，消费 ${o.total ?? o.cost} 金币！`)
        }
      }
    })

    // 今日榜第一名播报
    const top1 = rankings?.today?.[0]
    if (top1 && top1.todaySpend > 0) {
      dynamic.push(`👑 今日土豪榜第一：${top1.name}，累计消耗 ${top1.todaySpend} 金币！`)
    }

    // 合并：动态消息优先，不足时用静态填充
    const merged = [...dynamic, ...STATIC_TICKS]
    return merged.length > 0 ? merged : STATIC_TICKS
  }, [orders, rankings, user])

  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % ticks.length)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [ticks.length])

  // 当 ticks 更新时，如果当前 idx 越界则归零
  useEffect(() => {
    setIdx(i => (i >= ticks.length ? 0 : i))
  }, [ticks.length])

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1A0508, #2A0810, #1A0508)',
      borderBottom: '1px solid rgba(255,45,85,0.3)',
      padding: '6px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{
          background: '#FF2D55',
          color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '2px 12px', whiteSpace: 'nowrap',
          letterSpacing: 1,
        }}>
          📢 公屏
        </div>
        <div style={{
          flex: 1, overflow: 'hidden', padding: '0 16px',
        }}>
          <div
            key={idx}
            style={{
              fontSize: 12, color: '#FFD700',
              whiteSpace: 'nowrap',
              animation: 'ticker 8s linear forwards',
            }}
          >
            {ticks[idx]}
          </div>
        </div>
      </div>
    </div>
  )
}
