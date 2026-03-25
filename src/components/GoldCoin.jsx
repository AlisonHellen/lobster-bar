// 金币图标组件 - 带渐变和阴影效果
export function GoldCoin({ size = 24, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        boxShadow: `
          0 2px 4px rgba(0,0,0,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.2),
          inset 0 2px 4px rgba(255,255,255,0.4)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 'bold',
        color: '#B8860B',
        textShadow: '0 1px 1px rgba(255,255,255,0.5)',
        ...style
      }}
    >
      ¥
    </div>
  )
}

// 带发光效果的金币
export function GoldCoinGlow({ size = 24, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #FFF8DC 0%, #FFD700 30%, #FFA500 70%, #FF8C00 100%)',
        boxShadow: `
          0 0 10px rgba(255,215,0,0.6),
          0 2px 6px rgba(0,0,0,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.2),
          inset 0 2px 6px rgba(255,255,255,0.6)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 'bold',
        color: '#8B6914',
        textShadow: '0 1px 2px rgba(255,255,255,0.6)',
        ...style
      }}
    >
      $
    </div>
  )
}

// 立体金币
export function GoldCoin3D({ size = 24, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #FFFACD 0%, #FFD700 40%, #DAA520 80%, #B8860B 100%)',
        border: `2px solid #DAA520`,
        boxShadow: `
          0 4px 8px rgba(0,0,0,0.3),
          0 6px 12px rgba(0,0,0,0.2),
          inset 0 -3px 6px rgba(0,0,0,0.2),
          inset 0 3px 6px rgba(255,255,255,0.5)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: '900',
        color: '#8B4513',
        ...style
      }}
    >
      G
    </div>
  )
}

// 旋转金币（带动画）
export function GoldCoinSpin({ size = 24, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        boxShadow: `
          0 2px 8px rgba(255,165,0,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.2),
          inset 0 2px 4px rgba(255,255,255,0.4)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 'bold',
        color: '#B8860B',
        animation: 'coinSpin 2s linear infinite',
        ...style
      }}
    >
      ¥
    </div>
  )
}

// 大金币（用于主要展示）
export function GoldCoinLarge({ size = 40, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 35%, #FFF8DC 0%, transparent 50%),
          linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)
        `,
        boxShadow: `
          0 0 20px rgba(255,215,0,0.4),
          0 4px 12px rgba(0,0,0,0.3),
          inset 0 -3px 6px rgba(0,0,0,0.2),
          inset 0 3px 8px rgba(255,255,255,0.5)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 'bold',
        color: '#8B6914',
        textShadow: '0 1px 2px rgba(255,255,255,0.6)',
        ...style
      }}
    >
      ¥
    </div>
  )
}
