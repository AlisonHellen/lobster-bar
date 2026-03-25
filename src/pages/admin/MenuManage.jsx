import { useState } from 'react'
import { useAdminStore } from '../../store/adminStore'

const TYPE_LABELS = { normal: '普通 5金币', vip: 'VIP 15金币', top: '置顶 30金币' }
const TYPE_COLORS = { normal: '#87CEEB', vip: '#FFD700', top: '#FF2D55' }

export default function MenuManage() {
  const { menuItems, songItems, toggleMenuItem, updateMenuPrice, toggleSong, addNotice } = useAdminStore()
  const [tab, setTab] = useState('menu') // menu | song
  const [editPrice, setEditPrice] = useState(null) // { id, val }
  const [catFilter, setCatFilter] = useState('all')

  const menuCats = ['all', 'lobster', 'liquor', 'drinks']
  const catNames = { all: '全部', lobster: '🦞 龙虾专区', liquor: '🍾 洋酒专区', drinks: '🍹 高端饮品' }

  const filteredMenu = catFilter === 'all' ? menuItems : menuItems.filter(i => i.category === catFilter)

  const handlePriceSave = (id) => {
    updateMenuPrice(id, editPrice.val)
    addNotice('✅ 价格更新成功')
    setEditPrice(null)
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">🍽️ 菜单 & 歌单管理</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['menu', 'song'].map(t => (
            <button
              key={t}
              className={`admin-btn ${tab === t ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setTab(t)}
            >
              {t === 'menu' ? '🦞 点餐菜单' : '🎵 歌单管理'}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU TAB ─────────────────────────────────────── */}
      {tab === 'menu' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {menuCats.map(c => (
              <button
                key={c}
                className={`admin-btn ${catFilter === c ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                onClick={() => setCatFilter(c)}
                style={{ fontSize: 12 }}
              >
                {catNames[c]}
              </button>
            ))}
          </div>
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>菜品</th>
                  <th>分类</th>
                  <th>描述</th>
                  <th>金币单价</th>
                  <th>热门</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>{item.img}</span>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{item.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-yellow" style={{ fontSize: 11 }}>{item.categoryName}</span></td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.desc}
                    </td>
                    <td>
                      {editPrice?.id === item.id ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            className="admin-input"
                            type="number"
                            style={{ width: 70 }}
                            value={editPrice.val}
                            onChange={e => setEditPrice({ id: item.id, val: e.target.value })}
                          />
                          <button className="admin-btn admin-btn-primary" style={{ padding: '4px 8px' }} onClick={() => handlePriceSave(item.id)}>✓</button>
                          <button className="admin-btn admin-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setEditPrice(null)}>✕</button>
                        </div>
                      ) : (
                        <span
                          style={{ color: '#FFD700', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => setEditPrice({ id: item.id, val: item.cost })}
                          title="点击修改"
                        >
                          {item.cost} 金币 ✏️
                        </span>
                      )}
                    </td>
                    <td>{item.hot ? <span className="badge badge-red">🔥 热门</span> : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>}</td>
                    <td>
                      <span className={`badge ${item.enabled ? 'badge-green' : 'badge-gray'}`}>
                        {item.enabled ? '上架' : '下架'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-btn ${item.enabled ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                        onClick={() => { toggleMenuItem(item.id); addNotice(`${item.enabled ? '⬇️ 已下架' : '⬆️ 已上架'}：${item.name}`) }}
                      >
                        {item.enabled ? '下架' : '上架'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── SONG TAB ─────────────────────────────────────── */}
      {tab === 'song' && (
        <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>歌曲</th>
                <th>歌手</th>
                <th>分类</th>
                <th>类型/金币</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {songItems.map(song => (
                <tr key={song.id}>
                  <td style={{ color: '#fff', fontWeight: 600 }}>《{song.title}》</td>
                  <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{song.singer}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{song.categoryName}</span></td>
                  <td>
                    <span style={{ color: TYPE_COLORS[song.type], fontWeight: 700, fontSize: 13 }}>
                      {TYPE_LABELS[song.type]}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${song.enabled ? 'badge-green' : 'badge-gray'}`}>
                      {song.enabled ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-btn ${song.enabled ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                      onClick={() => { toggleSong(song.id); addNotice(`${song.enabled ? '🚫 已禁用' : '✅ 已启用'}：《${song.title}》`) }}
                    >
                      {song.enabled ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
