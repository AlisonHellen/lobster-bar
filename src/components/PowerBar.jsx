import { useBarStore } from '../store/barStore'
export default function PowerBar() {
  const { user, power, totalSpent } = useBarStore()
  if (!user) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* User badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,215,0,0.08)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: 8, padding: '6px 12px',
      }}>
        <span style={{ fontSize: 20 }}>{user.avatar}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FFD700', lineHeight: 1 }}>
            {user.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
            {user.title}
          </div>
        </div>
      </div>

      {/* Power display */}
      <div style={{
        background: 'rgba(255,215,0,0.08)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: 8, padding: '6px 12px',
        textAlign: 'center', minWidth: 70,
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>
          💰 {power.toLocaleString()}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
          金币
        </div>
      </div>
    </div>
  )
}
