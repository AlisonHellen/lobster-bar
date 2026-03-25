import { useAdminStore } from '../../store/adminStore'

export default function BarConfig() {
  const { barConfig, updateBarConfig, addNotice } = useAdminStore()

  const save = (key, val) => {
    updateBarConfig(key, val)
    addNotice('✅ 配置已保存')
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">⚙️ 酒吧全局配置</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Basic config */}
        <div className="stat-card">
          <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            🍺 基础设置
          </div>

          <ConfigRow label="酒吧名称">
            <input
              className="admin-input"
              style={{ width: 200 }}
              value={barConfig.barName}
              onChange={e => updateBarConfig('barName', e.target.value)}
              onBlur={e => save('barName', e.target.value)}
            />
          </ConfigRow>

          <ConfigRow label="关门时间">
            <input
              className="admin-input"
              type="time"
              style={{ width: 120 }}
              value={barConfig.closingTime}
              onChange={e => save('closingTime', e.target.value)}
            />
          </ConfigRow>

          <ConfigRow label="酒吧开放状态">
            <label className="toggle">
              <input
                type="checkbox"
                checked={barConfig.isOpen}
                onChange={e => { save('isOpen', e.target.checked); addNotice(e.target.checked ? '🟢 酒吧已开放' : '🔴 酒吧已关闭') }}
              />
              <span className="toggle-slider" />
            </label>
          </ConfigRow>
        </div>

        {/* Power config */}
        <div className="stat-card">
          <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            💰 金币配置
          </div>

          <ConfigRow label="金币消耗倍率" desc="全局乘数，影响所有消费">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                className="admin-input"
                type="number"
                style={{ width: 80 }}
                step="0.1"
                min="0.1"
                max="10"
                value={barConfig.powerMultiplier}
                onChange={e => updateBarConfig('powerMultiplier', parseFloat(e.target.value))}
                onBlur={e => save('powerMultiplier', parseFloat(e.target.value))}
              />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>× 倍</span>
            </div>
          </ConfigRow>

          <ConfigRow label="在场人数(模拟)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="admin-btn admin-btn-danger"
                onClick={() => save('onlineCount', Math.max(1, barConfig.onlineCount - 5))}>−5</button>
              <span style={{ color: '#34D399', fontWeight: 700, fontSize: 18, minWidth: 32, textAlign: 'center' }}>
                {barConfig.onlineCount}
              </span>
              <button className="admin-btn admin-btn-primary"
                onClick={() => save('onlineCount', barConfig.onlineCount + 5)}>+5</button>
            </div>
          </ConfigRow>

          <div style={{
            marginTop: 14,
            background: 'rgba(255,215,0,0.06)',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>各身份初始金币</div>
            {[
              { label: '普通土豪', val: 500, color: '#C9A84C' },
              { label: '钻石土豪', val: 1000, color: '#B4D4FF' },
              { label: '至尊土豪', val: 2000, color: '#FF2D55' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: t.color, fontSize: 13 }}>{t.label}</span>
                <span style={{ color: '#FFD700', fontWeight: 700, fontSize: 13 }}>{t.val} 金币</span>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast config */}
        <div className="stat-card">
          <div style={{ color: '#F0E6C8', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            📢 广播与通知
          </div>

          <ConfigRow label="自动广播开关">
            <label className="toggle">
              <input
                type="checkbox"
                checked={barConfig.broadcastEnabled}
                onChange={e => save('broadcastEnabled', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </ConfigRow>

          <div style={{ marginTop: 14 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>广播触发条件说明</div>
            {[
              '用户点餐消费 → 自动广播',
              '用户请全场 → 全屏广播',
              '用户点歌 → 公屏播报',
              '用户发言 → 公屏显示',
            ].map(rule => (
              <div key={rule} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.5)', fontSize: 12,
                marginBottom: 6,
              }}>
                <span style={{ color: '#34D399' }}>●</span> {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="stat-card" style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: '#F87171', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            🚨 危险操作区
          </div>

          {[
            { label: '重置今日排行榜', desc: '清空今日土豪榜数据', btn: '重置排行' },
            { label: '清空公屏消息', desc: '删除所有聊天记录', btn: '清空消息' },
            { label: '全局广播打烊通知', desc: '向所有在线用户推送打烊提醒', btn: '发送通知' },
          ].map(op => (
            <div key={op.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div>
                <div style={{ color: '#fff', fontSize: 13 }}>{op.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{op.desc}</div>
              </div>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => addNotice(`⚠️ 操作执行：${op.label}`)}
              >
                {op.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfigRow({ label, desc, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{label}</div>
        {desc && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}
