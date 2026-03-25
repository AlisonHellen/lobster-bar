import { GoldCoin, GoldCoinGlow, GoldCoin3D, GoldCoinSpin, GoldCoinLarge } from './GoldCoin'

// 金币图标展示页面
export default function CoinShowcase() {
  const coins = [
    { name: '基础金币', Component: GoldCoin, desc: '渐变 + 内阴影' },
    { name: '发光金币', Component: GoldCoinGlow, desc: '带光晕效果' },
    { name: '立体金币', Component: GoldCoin3D, desc: '径向渐变 + 边框' },
    { name: '旋转金币', Component: GoldCoinSpin, desc: '带动画效果' },
    { name: '大金币', Component: GoldCoinLarge, desc: '用于主要展示' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{ color: '#FFD700', marginBottom: 40 }}>💰 金币图标选择</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 30,
        maxWidth: 800,
        width: '100%',
      }}>
        {coins.map(({ name, Component, desc }) => (
          <div key={name} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 15,
          }}>
            <Component size={48} />
            <div style={{ color: '#fff', fontWeight: 'bold' }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
        告诉我你喜欢哪个，我应用到整个项目
      </div>
    </div>
  )
}
