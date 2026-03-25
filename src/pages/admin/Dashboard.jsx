import { useAdminStore } from '../../store/adminStore'

export default function Dashboard() {
  const { stats, hourlyData, orders, users } = useAdminStore()

  const maxPower = Math.max(...hourlyData.map(d => d.power))

  const typeColor = { food: '#34D399', drink: '#60A5FA', treat: '#FF2D55', song: '#FBBF24' }
  const typeLabel = { food: '🦞 食物', drink: '🍾 酒水', treat: '🎉 请全场', song: '🎵 点歌' }

  // 动态计算消费类型分布
  const totalCost = orders.reduce((s, o) => s + o.cost, 0)
  const byType = orders.reduce((acc, o) => {
    acc[o.type] = (acc[o.type] || 0) + o.cost
    return acc
  }, {})
  const typeDistribution = Object.entries(byType)
    .map(([type, cost]) => ({
      type,
      cost,
      pct: totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0,
    }))
    .sort((a, b) => b.cost - a.cost)

  // 动态计算 KPI
  const realTreatCount = orders.filter(o => o.type === 'treat').length
  const realSongCount = orders.filter(o => o.type === 'song').length
  const onlineCount = users.filter(u => u.status === 'online').length
  const avgSpend = users.length > 0
    ? Math.round(users.reduce((s, u) => s + (u.todaySpent || 0), 0) / users.length)
    : 0

  // ── 运营分析指标 ──────────────────────────────────
  // 消费速率：最近 2 个时段的金币差值（模拟增速）
  const lastTwo = hourlyData.slice(-2)
  const consumeRate = lastTwo.length === 2
    ? lastTwo[1].power - lastTwo[0].power
    : 0
  const consumeRateTrend = consumeRate >= 0 ? '↑' : '↓'
  const consumeRateColor = consumeRate >= 0 ? '#34D399' : '#F87171'

  // 低活跃用户（今日消费为 0 的在线用户）
  const idleOnlineCount = users.filter(u => u.status === 'online' && (u.todaySpent || 0) === 0).length
  const idleRisk = idleOnlineCount >= 3 ? 'high' : idleOnlineCount >= 1 ? 'mid' : 'low'
  const idleRiskColor = { high: '#F87171', mid: '#FBBF24', low: '#34D399' }[idleRisk]
  const idleRiskLabel = { high: '⚠️ 高', mid: '💰 中', low: '✅ 低' }[idleRisk]

  // 请全场转化率（请全场订单 / 总订单）
  const treatRate = orders.length > 0
    ? Math.round((realTreatCount / orders.length) * 100)
    : 0

  // 最高单笔消费
  const maxOrder = orders.reduce((max, o) => o.cost > (max?.cost || 0) ? o : max, null)

  const recentOrders = orders.slice(0, 6)

  return (
    <div>
      <div className="section-header">
        <div className="section-title">📊 数据总览</div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          🟢 实时更新 · 最后同步 {new Date().toTimeString().slice(0,5)}
        </div>
      </div>

      {/* ── 运营分析预警条 ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 18 }}>
        {/* 消费速率 */}
        <div style={{
          background: 'rgba(52,211,153,0.06)', border: `1px solid ${consumeRateColor}30`,
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${consumeRateColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>消费速率（最近1h）</div>
            <div style={{ color: consumeRateColor, fontWeight: 900, fontSize: 16, marginTop: 2 }}>
              {consumeRateTrend} {Math.abs(consumeRate).toLocaleString()}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 3 }}>金币</span>
            </div>
          </div>
        </div>

        {/* 低活跃预警 */}
        <div style={{
          background: `${idleRiskColor}08`, border: `1px solid ${idleRiskColor}30`,
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${idleRiskColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>沉默用户预警</div>
            <div style={{ color: idleRiskColor, fontWeight: 900, fontSize: 16, marginTop: 2 }}>
              {idleOnlineCount} 人未消费
              <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 6 }}>{idleRiskLabel}</span>
            </div>
          </div>
        </div>

        {/* 请全场转化率 */}
        <div style={{
          background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)',
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,45,85,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎉</div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>请全场转化率</div>
            <div style={{ color: '#FF2D55', fontWeight: 900, fontSize: 16, marginTop: 2 }}>
              {treatRate}%
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 3 }}>({realTreatCount}/{orders.length}单)</span>
            </div>
          </div>
        </div>

        {/* 最高单笔消费 */}
        <div style={{
          background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)',
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,215,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏆</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>最高单笔消费</div>
            <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 16, marginTop: 2 }}>
              {maxOrder ? maxOrder.cost.toLocaleString() : 0}
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 3 }}>金币</span>
            </div>
            {maxOrder && (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {maxOrder.avatar} {maxOrder.user}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: '今日金币消耗', value: totalCost.toLocaleString(),       unit: '金币',  icon: '💰', color: '#FFD700', delta: '' },
          { label: '累计总金币',   value: stats.totalPower.toLocaleString(), unit: '金币',  icon: '💎', color: '#A78BFA', delta: '' },
          { label: '当前在线',     value: onlineCount,                       unit: '位土豪', icon: '👥', color: '#34D399', delta: '' },
          { label: '今日订单',     value: orders.length,                     unit: '单',    icon: '📋', color: '#60A5FA', delta: '' },
          { label: '请全场次数',   value: realTreatCount,                    unit: '次',    icon: '🎉', color: '#F87171', delta: '' },
          { label: '点歌次数',     value: realSongCount,                     unit: '首',    icon: '🎵', color: '#FBBF24', delta: '' },
          { label: '人均消费',     value: avgSpend.toLocaleString(),         unit: '金币',  icon: '📈', color: '#34D399', delta: '' },
          { label: '今日高峰',     value: stats.peakHour,                    unit: '',      icon: '🕙', color: '#A78BFA', delta: '' },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22 }}>{card.icon}</span>
              {card.delta && (
                <span style={{ fontSize: 11, color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '1px 6px', borderRadius: 10 }}>
                  {card.delta}
                </span>
              )}
            </div>
            <div style={{ marginTop: 12, color: card.color, fontWeight: 900, fontSize: 22 }}>
              {card.value}
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 4 }}>{card.unit}</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Hourly power chart */}
        <div className="stat-card">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14 }}>📈 逐时金币消耗</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>今日各时段消耗趋势</div>
          </div>
          <div className="chart-bar-wrap" style={{ height: 100 }}>
            {hourlyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className="chart-bar"
                  style={{
                    height: `${(d.power / maxPower) * 80}px`,
                    background: d.hour === stats.peakHour
                      ? 'linear-gradient(180deg, #FFD700, #B8860B)'
                      : 'linear-gradient(180deg, rgba(255,215,0,0.5), rgba(255,215,0,0.2))',
                    width: '100%',
                  }}
                  title={`${d.hour}: ${d.power}金币`}
                />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                  {d.hour.slice(0,2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order type distribution - dynamic */}
        <div className="stat-card">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14 }}>🍽️ 消费类型分布</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>今日订单分类占比</div>
          </div>
          {typeDistribution.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              暂无订单数据
            </div>
          ) : typeDistribution.map(row => (
            <div key={row.type} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{typeLabel[row.type] || row.type}</span>
                <span style={{ fontSize: 12, color: typeColor[row.type] || '#fff', fontWeight: 700 }}>
                  {row.cost.toLocaleString()} 金币 ({row.pct}%)
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.pct}%`, background: typeColor[row.type] || '#888', borderRadius: 3, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders + Top users */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent orders */}
        <div className="stat-card">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14 }}>📋 最新订单</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>用户</th>
                <th>内容</th>
                <th>金币</th>
                <th>类型</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontSize: 16 }}>{o.avatar}</span>{' '}
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{o.user}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.items}
                  </td>
                  <td style={{ color: '#FFD700', fontWeight: 700, fontSize: 13 }}>{o.cost}</td>
                  <td>
                    <span className={`badge badge-${o.type === 'treat' ? 'red' : o.type === 'drink' ? 'blue' : o.type === 'song' ? 'yellow' : 'green'}`}>
                      {typeLabel[o.type] || o.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top spenders */}
        <div className="stat-card">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14 }}>👑 今日消费排行</div>
          </div>
          {[...users].sort((a, b) => b.todaySpent - a.todaySpent).slice(0, 6).map((u, i) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 20 }}>{u.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#fff' }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{u.title}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 14 }}>{u.todaySpent.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>金币</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
