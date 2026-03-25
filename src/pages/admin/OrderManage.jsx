import { useAdminStore } from '../../store/adminStore'

const TYPE_LABEL = { food: '🦞 食物', drink: '🍾 酒水', treat: '🎉 请全场', song: '🎵 点歌' }
const TYPE_COLOR = { food: '#34D399', drink: '#60A5FA', treat: '#F87171', song: '#FBBF24' }

export default function OrderManage() {
  const { orders } = useAdminStore()
  const total = orders.reduce((s, o) => s + o.cost, 0)
  const byType = orders.reduce((acc, o) => {
    acc[o.type] = (acc[o.type] || 0) + o.cost
    return acc
  }, {})

  return (
    <div>
      <div className="section-header">
        <div className="section-title">📋 订单 & 消费记录</div>
        <div style={{ color: '#FFD700', fontWeight: 700 }}>
          合计消耗：{total.toLocaleString()} 金币
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {Object.entries(byType).map(([type, cost]) => (
          <div key={type} className="stat-card" style={{ borderColor: `${TYPE_COLOR[type]}30` }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{TYPE_LABEL[type]}</div>
            <div style={{ color: TYPE_COLOR[type], fontWeight: 900, fontSize: 24 }}>
              {cost.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>金币</div>
          </div>
        ))}
      </div>

      {/* Order table */}
      <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>用户</th>
              <th>消费内容</th>
              <th>类型</th>
              <th>金币消耗</th>
              <th>时间</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '32px 0', fontSize: 13 }}>
                  暂无订单记录
                </td>
              </tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'monospace' }}>
                  #{o.id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18 }}>{o.avatar}</span>
                    <span style={{ color: '#fff', fontSize: 13 }}>{o.user}</span>
                  </div>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {o.items}
                </td>
                <td>
                  <span className={`badge ${o.type === 'treat' ? 'badge-red' : o.type === 'drink' ? 'badge-blue' : o.type === 'song' ? 'badge-yellow' : 'badge-green'}`}>
                    {TYPE_LABEL[o.type] || o.type}
                  </span>
                </td>
                <td>
                  <span style={{ color: TYPE_COLOR[o.type], fontWeight: 700, fontSize: 15 }}>
                    {o.cost.toLocaleString()}
                  </span>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{o.time}</td>
                <td><span className="badge badge-green">已完成</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
