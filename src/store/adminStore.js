import { create } from 'zustand'
import { MENU_CATEGORIES, SONG_CATEGORIES } from '../data/gameData'

// ── 模拟用户数据（底座）──────────────────────────────────────
export const MOCK_USERS = [
  { id: 'u1', name: '龙虾界大佬', avatar: '👑', title: '至尊土豪', power: 1280, totalSpent: 2880, todaySpent: 2880, joinTime: '2026-03-15 20:10', status: 'online', treatCount: 5, songCount: 12 },
  { id: 'u2', name: '海鲜王者',   avatar: '💎', title: '钻石土豪', power: 340,  totalSpent: 1660, todaySpent: 1660, joinTime: '2026-03-15 20:35', status: 'online', treatCount: 3, songCount: 8 },
  { id: 'u3', name: '洋酒爷们',   avatar: '🥂', title: '钻石土豪', power: 720,  totalSpent: 1280, todaySpent: 1280, joinTime: '2026-03-16 19:00', status: 'online', treatCount: 2, songCount: 6 },
  { id: 'u4', name: '富豪老板888',avatar: '🦞', title: '普通土豪', power: 220,  totalSpent: 880,  todaySpent: 880,  joinTime: '2026-03-16 19:10', status: 'online', treatCount: 1, songCount: 5 },
  { id: 'u5', name: '壕无人性',   avatar: '💰', title: '普通土豪', power: 90,   totalSpent: 660,  todaySpent: 660,  joinTime: '2026-03-16 19:22', status: 'online', treatCount: 1, songCount: 4 },
  { id: 'u6', name: '钱多多',     avatar: '🎰', title: '普通土豪', power: 280,  totalSpent: 420,  todaySpent: 420,  joinTime: '2026-03-16 19:40', status: 'online', treatCount: 0, songCount: 3 },
  { id: 'u7', name: '夜总会VIP',  avatar: '🎸', title: '普通土豪', power: 140,  totalSpent: 280,  todaySpent: 280,  joinTime: '2026-03-16 20:01', status: 'online', treatCount: 0, songCount: 2 },
  { id: 'u8', name: '酒局老司机', avatar: '🍾', title: '普通土豪', power: 440,  totalSpent: 160,  todaySpent: 160,  joinTime: '2026-03-16 20:15', status: 'online', treatCount: 0, songCount: 1 },
]

// ── 模拟订单数据（底座）──────────────────────────────────────
export const MOCK_ORDERS = [
  { id: 'o001', user: '龙虾界大佬', avatar: '👑', items: '至尊帝王蟹龙虾×3',              type: 'food',  cost: 300,  time: '2026-03-16 21:05', status: 'done' },
  { id: 'o002', user: '海鲜王者',   avatar: '💎', items: '82年拉菲×1',                    type: 'drink', cost: 88,   time: '2026-03-16 21:08', status: 'done' },
  { id: 'o003', user: '洋酒爷们',   avatar: '🥂', items: '请全场·普通威士忌',             type: 'treat', cost: 420,  time: '2026-03-16 21:15', status: 'done' },
  { id: 'o004', user: '富豪老板888',avatar: '🦞', items: '黄金焗龙虾×2',                  type: 'food',  cost: 100,  time: '2026-03-16 21:20', status: 'done' },
  { id: 'o005', user: '龙虾界大佬', avatar: '👑', items: '请全场·轩尼诗XO',               type: 'treat', cost: 1848, time: '2026-03-16 21:30', status: 'done' },
  { id: 'o006', user: '壕无人性',   avatar: '💰', items: '土豪特调鸡尾酒×4',              type: 'drink', cost: 48,   time: '2026-03-16 21:35', status: 'done' },
  { id: 'o007', user: '钱多多',     avatar: '🎰', items: '十三香小龙虾×5',                type: 'food',  cost: 50,   time: '2026-03-16 21:42', status: 'done' },
  { id: 'o008', user: '海鲜王者',   avatar: '💎', items: '请全场·土豪特调',               type: 'treat', cost: 336,  time: '2026-03-16 21:50', status: 'done' },
  { id: 'o009', user: '洋酒爷们',   avatar: '🥂', items: '轩尼诗XO×2 + 起泡香槟×1',      type: 'drink', cost: 170,  time: '2026-03-16 22:00', status: 'done' },
  { id: 'o010', user: '龙虾界大佬', avatar: '👑', items: '鱼子酱刺身拼盘×2 + 82年拉菲×1', type: 'food',  cost: 248,  time: '2026-03-16 22:10', status: 'done' },
]

// ── 模拟公屏消息（底座）──────────────────────────────────────
const MOCK_MESSAGES = [
  { id: 'm1', user: '龙虾界大佬', avatar: '👑', msg: '今晚豪一把！🦞',          time: '21:05', status: 'ok',      type: 'chat' },
  { id: 'm2', user: '海鲜王者',   avatar: '💎', msg: '服务员！再来一打帝王蟹！', time: '21:07', status: 'ok',      type: 'chat' },
  { id: 'm3', user: '匿名用户',   avatar: '❓', msg: '这里有便宜的吗哈哈哈',    time: '21:10', status: 'warn',    type: 'chat' },
  { id: 'm4', user: '洋酒爷们',   avatar: '🥂', msg: '82年拉菲上！一人一瓶！',  time: '21:15', status: 'ok',      type: 'broadcast' },
  { id: 'm5', user: '壕无人性',   avatar: '💰', msg: '老板真豪😎',              time: '21:20', status: 'ok',      type: 'chat' },
  { id: 'm6', user: '垃圾账号',   avatar: '🤖', msg: '加微信发福利@@@',         time: '21:22', status: 'blocked', type: 'chat' },
  { id: 'm7', user: '富豪老板888',avatar: '🦞', msg: '今晚我请全场！算我的！',   time: '21:30', status: 'ok',      type: 'broadcast' },
]

// ── 图表数据 ──────────────────────────────────────────────────
const HOURLY_DATA = [
  { hour: '18:00', power: 120,  orders: 3 },
  { hour: '19:00', power: 480,  orders: 12 },
  { hour: '20:00', power: 1240, orders: 28 },
  { hour: '21:00', power: 3680, orders: 56 },
  { hour: '22:00', power: 5120, orders: 72 },
  { hour: '23:00', power: 4360, orders: 61 },
  { hour: '00:00', power: 2800, orders: 38 },
  { hour: '01:00', power: 1200, orders: 18 },
]

// ── 菜单/歌曲初始数据 ─────────────────────────────────────────
const buildMenuItems = () => {
  const items = []
  MENU_CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      items.push({ ...item, category: cat.id, categoryName: cat.name, enabled: true })
    })
  })
  return items
}

const buildSongItems = () => {
  const songs = []
  SONG_CATEGORIES.forEach(cat => {
    cat.songs.forEach(song => {
      songs.push({ ...song, category: cat.id, categoryName: cat.name, enabled: true })
    })
  })
  return songs
}

// ── Store ─────────────────────────────────────────────────────
export const useAdminStore = create((set, get) => ({
  // Auth
  isLoggedIn: false,
  adminName: '',
  loginError: '',

  // Active section
  activeSection: 'dashboard',

  // 用户列表：mock 底座 + 真实玩家（由 syncFromBar 写入）
  users: MOCK_USERS,

  // 订单：mock 底座 + 真实订单（由 syncFromBar 写入）
  orders: MOCK_ORDERS,

  // 公屏消息：mock 底座 + 真实消息（由 syncFromBar 写入）
  messages: MOCK_MESSAGES,

  menuItems: buildMenuItems(),
  songItems: buildSongItems(),

  // Config
  barConfig: {
    barName: '土豪龙虾酒吧',
    onlineCount: 28,
    isOpen: true,
    closingTime: '02:00',
    broadcastEnabled: true,
    sensitiveWords: ['便宜', '优惠', '加微信', '@@@'],
    powerMultiplier: 1.0,
  },

  stats: {
    totalPower: 18880,
    todayPower: 8280,
    onlineUsers: 8, // 初始为bot用户数量
    totalOrders: 86,
    treatCount: 12,
    songCount: 86,
    avgSpend: 392,
    peakHour: '22:00',
  },

  hourlyData: HOURLY_DATA,
  adminNotices: [],

  // ── 核心同步 action：barStore 有变化时调用此方法 ──────────────
  syncFromBar: (barState) => {
    const { user, power, totalSpent, orders: barOrders, messages: barMessages, songQueue } = barState

    // ── 1. 同步用户列表 ──────────────────────────────────────
    set(s => {
      let newUsers
      if (!user) {
        // 玩家已退出，移除真实玩家行，恢复 mock
        newUsers = s.users.filter(u => u.id !== 'me')
        if (newUsers.length === 0) newUsers = MOCK_USERS
      } else {
        const realUserRow = {
          id: 'me',
          name: user.name,
          avatar: user.avatar,
          title: user.title,
          power,
          totalSpent,
          todaySpent: totalSpent,
          joinTime: user.joinTime
            ? new Date(user.joinTime).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
            : new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          status: 'online',
          treatCount: barOrders.filter(o => o.type === 'treat').length,
          songCount: songQueue.filter(sq => sq.requestBy === user.name).length,
        }
        const base = MOCK_USERS.filter(u => u.name !== user.name)
        newUsers = [realUserRow, ...base]
      }

      // 动态更新在线人数：新用户列表中 status === 'online' 的数量
      const newOnlineCount = newUsers.filter(u => u.status === 'online').length

      return { users: newUsers, stats: { ...s.stats, onlineUsers: newOnlineCount } }
    })

    // ── 2. 同步订单列表 ──────────────────────────────────────
    if (user && barOrders.length > 0) {
      const realOrders = barOrders.map(o => ({
        id: `real_${o.id}`,
        user: user.name,
        avatar: user.avatar,
        items: Array.isArray(o.items)
          ? o.items.map(i => `${i.name}×${i.qty}`).join('、')
          : (Array.isArray(o.items) ? '' : String(o.items ?? '')),
        type: o.type || 'food',
        cost: o.total ?? 0,
        time: new Date(o.time).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'done',
      }))
      set({ orders: [...realOrders, ...MOCK_ORDERS] })
    } else if (user && barOrders.length === 0) {
      // 用户已登录但尚未下单：重置为 mock 底座，避免残留上一用户订单
      set({ orders: MOCK_ORDERS })
    } else if (!user) {
      set({ orders: MOCK_ORDERS })
    }

    // ── 3. 同步公屏消息 ──────────────────────────────────────
    if (barMessages.length > 0) {
      const realMessages = barMessages.slice(0, 30).map(m => ({
        id: `real_${m.id}`,
        user: m.user,
        avatar: m.avatar || '🦞',
        msg: m.msg,
        time: m.time ? new Date(m.time).toTimeString().slice(0, 5) : '--:--',
        status: 'ok',
        type: m.type || 'chat',
      }))
      set(s => ({ messages: [...realMessages, ...MOCK_MESSAGES] }))
    }
  },

  // ── Actions ──────────────────────────────────────────────────
  login: (user, pass) => {
    if (user === 'admin' && pass === 'lobster888') {
      set({ isLoggedIn: true, adminName: '龙虾掌柜', loginError: '' })
      return true
    }
    set({ loginError: '账号或密码错误，请重试' })
    return false
  },

  logout: () => set({ isLoggedIn: false, adminName: '' }),

  setSection: (s) => set({ activeSection: s }),

  // 调整金币（真实玩家由 barStore 处理，mock 用户直接改）
  adjustPower: (userId, delta) => {
    if (userId === 'me') return // 真实玩家由调用方处理
    set(s => ({
      users: s.users.map(u => u.id === userId ? { ...u, power: Math.max(0, u.power + delta) } : u)
    }))
  },

  banUser: (userId) => set(s => ({
    users: s.users.map(u => u.id === userId ? { ...u, status: u.status === 'banned' ? 'offline' : 'banned' } : u)
  })),

  // Menu actions
  toggleMenuItem: (itemId) => set(s => ({
    menuItems: s.menuItems.map(i => i.id === itemId ? { ...i, enabled: !i.enabled } : i)
  })),

  updateMenuPrice: (itemId, newCost) => set(s => ({
    menuItems: s.menuItems.map(i => i.id === itemId ? { ...i, cost: Number(newCost) } : i)
  })),

  toggleSong: (songId) => set(s => ({
    songItems: s.songItems.map(i => i.id === songId ? { ...i, enabled: !i.enabled } : i)
  })),

  // Message actions
  blockMessage: (msgId) => set(s => ({
    messages: s.messages.map(m => m.id === msgId ? { ...m, status: 'blocked' } : m)
  })),

  restoreMessage: (msgId) => set(s => ({
    messages: s.messages.map(m => m.id === msgId ? { ...m, status: 'ok' } : m)
  })),

  sendBroadcast: (text) => set(s => ({
    messages: [
      { id: `m_${Date.now()}`, user: '管理员广播', avatar: '📢', msg: text, time: new Date().toTimeString().slice(0, 5), status: 'ok', type: 'broadcast' },
      ...s.messages,
    ]
  })),

  updateBarConfig: (key, val) => set(s => ({
    barConfig: { ...s.barConfig, [key]: val }
  })),

  addNotice: (text) => {
    const id = Date.now()
    set(s => ({ adminNotices: [...s.adminNotices, { id, text }] }))
    setTimeout(() => set(s => ({ adminNotices: s.adminNotices.filter(n => n.id !== id) })), 3500)
  },
}))
