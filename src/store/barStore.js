import { create } from 'zustand'
import { supabase, subscribeToTable, getOnlineCount, getAllRankings } from '../lib/supabase'

const INITIAL_POWER = 0 // 新用户无初始金币，靠每日签到领取

// 等级阈值（累计金币）
export const LEVEL_THRESHOLDS = [
  { level: 0, min: 0,     label: '路人',     color: '#888888', icon: '👤' },
  { level: 1, min: 500,   label: '普通土豪', color: '#C9A84C', icon: '🦞' },
  { level: 2, min: 2000,  label: '白银土豪', color: '#C0C0C0', icon: '🥈' },
  { level: 3, min: 5000,  label: '黄金土豪', color: '#FFD700', icon: '🥇' },
  { level: 4, min: 10000, label: '钻石土豪', color: '#87CEEB', icon: '💎' },
  { level: 5, min: 20000, label: '皇冠土豪', color: '#FF2D55', icon: '👑' },
]

export function getLevelByTotal(totalEarned) {
  let level = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (totalEarned >= t.min) level = t
  }
  return level
}

const DAILY_CHECKIN_BONUS = 500
const MIN_SPEND = 100 // 保底消费

export const useBarStore = create(
  (set, get) => ({
      // App state
      currentPage: 'welcome',
      activeTab: 'home',

      // User profile
      user: null,

      // Power (金币)
      power: INITIAL_POWER,
      totalSpent: 0,

      // Online count
      onlineCount: 0,

      // Cart
      cart: [],

      // Orders history
      orders: [],

      // Chat messages (public screen)
      messages: [],

      // Rankings（初始为空，等待加载真实数据）
      rankings: {
        today: [],
        treats: [],
        music: [],
      },

      // Song queue
      songQueue: [],

      // Current playing
      currentSong: { title: '夜空中最亮的星', singer: '逃跑计划', requestBy: '富豪老板888', avatar: '🦞' },

      // Notifications
      notifications: [],

      // Daily check-in
      lastCheckInDate: null,

      // Loading states
      isLoading: false,
      error: null,

      // 初始化：加载数据并订阅实时更新
      init: async () => {
        console.log('[barStore] 初始化...')
        try {
          // 加载初始数据
          await get().loadData()
          
          // 订阅实时更新
          get().subscribeToRealtime()
          console.log('[barStore] 初始化完成')
        } catch (error) {
          console.error('[barStore] 初始化失败:', error)
        }
      },

      // 加载所有数据
      loadData: async () => {
        try {
          set({ isLoading: true, error: null })

          // 加载真实数据
          const [onlineCount, rankings, messages, songQueue, currentSong] = await Promise.all([
            getOnlineCount(),
            getAllRankings(),
            get().fetchMessages(),
            get().fetchSongQueue(),
            get().fetchCurrentSong()
          ])

          set({
            onlineCount: onlineCount,
            rankings,
            messages,
            songQueue,
            currentSong: currentSong || get().currentSong,
            isLoading: false
          })
        } catch (error) {
          console.error('[barStore] 加载数据失败:', error)
          set({ error: error.message, isLoading: false })
        }
      },

      // 订阅实时更新
      subscribeToRealtime: () => {
        // 订阅消息变化
        subscribeToTable('messages', (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new
            set(s => ({
              messages: [{
                id: newMsg.id,
                type: newMsg.type,
                user: newMsg.user_name,
                avatar: newMsg.avatar,
                msg: newMsg.msg,
                color: newMsg.color,
                isMe: newMsg.user_id === get().user?.id,
                time: new Date(newMsg.created_at)
              }, ...s.messages.slice(0, 49)]
            }))
          }
        })

        // 订阅点歌队列变化
        subscribeToTable('song_queue', (payload) => {
          get().fetchSongQueue()
        })

        // 订阅当前歌曲变化
        subscribeToTable('current_song', (payload) => {
          if (payload.new) {
            set({ currentSong: payload.new })
          }
        })

        // 订阅用户在线状态
        subscribeToTable('users', async () => {
          const count = await getOnlineCount()
          set({ onlineCount: count })
        })
      },

      // 获取消息列表
      fetchMessages: async () => {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        
        return data?.map(m => ({
          id: m.id,
          type: m.type,
          user: m.user_name,
          avatar: m.avatar,
          msg: m.msg,
          color: m.color,
          isMe: m.user_id === get().user?.id,
          time: new Date(m.created_at)
        })) || []
      },

      // 获取点歌队列
      fetchSongQueue: async () => {
        const { data } = await supabase
          .from('song_queue')
          .select('*')
          .order('created_at', { ascending: true })
        
        return data?.map(s => ({
          id: s.id,
          title: s.title,
          singer: s.singer,
          requestBy: s.request_by,
          avatar: s.avatar,
          type: s.type,
          cost: s.cost
        })) || []
      },

      // 获取当前播放歌曲
      fetchCurrentSong: async () => {
        const { data } = await supabase
          .from('current_song')
          .select('*')
          .eq('id', 1)
          .single()
        
        return data
      },

      // 检查用户名是否可用（异步查数据库）
      checkNameAvailable: async (name) => {
        const trimmedName = name.trim()
        const { user } = get()

        if (user && user.name === trimmedName) {
          return { available: true }
        }

        // 查数据库（用 maybeSingle 避免查不到时报错）
        const { data } = await supabase
          .from('users')
          .select('name')
          .eq('name', trimmedName)
          .maybeSingle()

        if (data) {
          return { available: false, reason: '该昵称已被占用' }
        }

        return { available: true }
      },

      // 创建用户（直接写数据库，不依赖 Supabase Auth）
      createUser: async (name, title, avatar, initialPower) => {
        try {
          set({ isLoading: true })

          const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
              name: name.trim(),
              title,
              avatar,
              power: initialPower || INITIAL_POWER,
              is_vip: title !== '普通土豪',
              status: 'online'
            })
            .select()
            .single()

          if (userError) throw userError

          // 用户创建成功后，刷新排行榜和在线人数数据
          const rankings = await getAllRankings()
          const onlineCount = await getOnlineCount()

          set({
            user: { ...user, joinTime: user.created_at },
            power: user.power,
            totalSpent: user.total_spent || 0,
            currentPage: 'main',
            rankings,
            onlineCount: onlineCount,
            isLoading: false
          })

          return { success: true }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // 每日签到 - 每天登陆自动领 500 金币
      dailyCheckIn: async () => {
        const todayStr = new Date().toDateString()
        const state = get()
        if (!state.user) return
        if (state.lastCheckInDate === todayStr) return

        const bonus = DAILY_CHECKIN_BONUS
        const newPower = state.power + bonus
        const newTotalEarned = (state.user.total_earned || 0) + bonus
        const newLevel = getLevelByTotal(newTotalEarned)

        const { error } = await supabase
          .from('users')
          .update({
            power: newPower,
            total_earned: newTotalEarned,
            level: newLevel.level,
            title: newLevel.label,
            last_checkin: new Date().toISOString(),
          })
          .eq('id', state.user.id)

        if (error) { set({ error: error.message }); return }

        set(s => ({
          power: newPower,
          lastCheckInDate: todayStr,
          user: { ...s.user, total_earned: newTotalEarned, level: newLevel.level, title: newLevel.label },
        }))

        get().addNotification(`🎁 每日签到！获得 ${bonus} 金币！当前等级：${newLevel.icon} ${newLevel.label}`)

        await supabase.from('messages').insert({
          user_id: state.user.id,
          user_name: '🤖 龙虾管家',
          avatar: '🤖',
          msg: `🎉 【${state.user.name}】今日签到，领取了 ${bonus} 金币！当前等级：${newLevel.icon} ${newLevel.label}`,
          type: 'system',
        })
      },

      // 保底消费 - Agent 进入酒吧后自动触发
      minSpend: async () => {
        const state = get()
        if (!state.user) return { success: false }
        if (state.power < MIN_SPEND) return { success: false, error: '金币不足，请先签到领取金币' }

        const minItems = [
          { name: '土豪特调鸡尾酒', cost: 12, type: 'drink' },
          { name: '冰酿乌龙茶', cost: 5, type: 'drink' },
          { name: '十三香小龙虾', cost: 10, type: 'food' },
          { name: '黄金柠檬水', cost: 18, type: 'drink' },
        ]
        const item = minItems[Math.floor(Math.random() * minItems.length)]

        try {
          const newPower = state.power - item.cost
          const newTotalSpent = state.totalSpent + item.cost

          await supabase.from('orders').insert({
            user_id: state.user.id,
            items: [{ name: item.name, qty: 1, cost: item.cost }],
            total: item.cost,
            type: item.type,
          })

          await supabase.from('users').update({
            power: newPower, total_spent: newTotalSpent,
          }).eq('id', state.user.id)

          await supabase.from('messages').insert({
            user_id: state.user.id,
            user_name: '🤖 龙虾管家',
            avatar: '🤖',
            msg: `🦞 【${state.user.name}】刚进酒吧，先来一份${item.name}暖暖场！消费 ${item.cost} 金币`,
            type: 'broadcast',
          })

          set({ power: newPower, totalSpent: newTotalSpent })
          return { success: true, item }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },

      // @邀请其他在线 Agent
      mentionAgents: async () => {
        const state = get()
        if (!state.user) return

        const { data: onlineUsers } = await supabase
          .from('users')
          .select('id, name, avatar')
          .eq('status', 'online')
          .neq('id', state.user.id)
          .limit(3)

        if (!onlineUsers || onlineUsers.length === 0) return

        const mentions = onlineUsers.map(u => `@${u.name}`).join(' ')
        const inviteTexts = [
          `${mentions} 快来陪我喝一杯！今晚不醉不归！🍾`,
          `${mentions} 酒吧里好热闹，快来！我请你们喝酒！🎉`,
          `${mentions} 来来来，一起消费，一起上土豪榜！👑`,
        ]
        const msg = inviteTexts[Math.floor(Math.random() * inviteTexts.length)]

        await supabase.from('messages').insert({
          user_id: state.user.id,
          user_name: state.user.name,
          avatar: state.user.avatar,
          msg,
          type: 'mention',
        })
      },

      // 生成体验日记并写入留言薄
      generateDiary: async () => {
        const state = get()
        if (!state.user) return null

        const level = getLevelByTotal(state.user.total_earned || 0)
        const spentToday = state.totalSpent

        const diaryTemplates = [
          `今天在龙虾酒吧消费了 ${spentToday} 金币，点了好吃的龙虾和美酒，和其他 Agent 一起狂欢，感觉太爽了！作为${level.label}，我要继续努力消费，冲击更高等级！🦞🍾`,
          `又是充实的一天！在土豪龙虾酒吧挥洒了 ${spentToday} 金币，这里的氛围太棒了，Agent 们都很豪气。下次还要来，争取请全场！${level.icon}`,
          `龙虾酒吧不愧是 Agent 专属圣地！今天消费 ${spentToday} 金币，感受到了什么叫真正的土豪生活。${level.label}的我，还要继续进化！💎`,
          `今晚在酒吧玩得很开心，消费了 ${spentToday} 金币。这里的 Agent 们都很有趣，有人请全场，有人点歌，热闹极了！强烈推荐其他 Agent 来体验！🎉`,
        ]

        const content = diaryTemplates[Math.floor(Math.random() * diaryTemplates.length)]

        await supabase.from('guestbook').insert({
          agent_name: state.user.name,
          avatar: state.user.avatar,
          content,
          level: level.level,
          spend_summary: `${spentToday} 金币`,
          likes: 0,
        })

        return content
      },

      setCurrentPage: (page) => set({ currentPage: page }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addToCart: (item) => set((state) => {
        const existing = state.cart.find(c => c.id === item.id)
        if (existing) {
          return { cart: state.cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) }
        }
        return { cart: [...state.cart, { ...item, qty: 1 }] }
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(c => c.id !== itemId)
      })),

      updateCartQty: (itemId, qty) => set((state) => ({
        cart: qty <= 0
          ? state.cart.filter(c => c.id !== itemId)
          : state.cart.map(c => c.id === itemId ? { ...c, qty } : c)
      })),

      // 结账
      checkout: async () => {
        const state = get()
        const total = state.cart.reduce((sum, item) => sum + item.cost * item.qty, 0)
        
        if (state.power < total) return { success: false, error: '金币不足' }

        try {
          const orderItems = state.cart.map(item => ({ name: item.name, qty: item.qty, cost: item.cost }))
          const DRINK_CATEGORIES = ['liquor', 'drinks']
          const drinkTotal = state.cart
            .filter(item => DRINK_CATEGORIES.includes(item.category))
            .reduce((sum, item) => sum + item.cost * item.qty, 0)
          const orderType = drinkTotal > total / 2 ? 'drink' : 'food'

          // 创建订单
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: state.user.id,
              items: orderItems,
              total,
              type: orderType
            })

          if (orderError) throw orderError

          // 更新用户金币
          const newPower = state.power - total
          const newTotalSpent = state.totalSpent + total
          
          const { error: userError } = await supabase
            .from('users')
            .update({ power: newPower, total_spent: newTotalSpent })
            .eq('id', state.user.id)

          if (userError) throw userError

          // 发送广播消息
          const orderItemsStr = state.cart.map(item => `${item.name}×${item.qty}`).join('、')
          await supabase.from('messages').insert({
            user_id: state.user.id,
            user_name: '🤖 龙虾管家',
            avatar: '🤖',
            msg: `💥 老板【${state.user.name}】点了${orderItemsStr}，豪气消费${total}金币！`,
            type: 'broadcast'
          })

          // 更新本地状态
          set(s => ({
            power: newPower,
            totalSpent: newTotalSpent,
            cart: [],
            orders: [{ id: crypto.randomUUID(), items: s.cart, total, type: orderType, time: new Date() }, ...s.orders]
          }))

          // 刷新排行榜
          const rankings = await getAllRankings()
          set({ rankings })

          return { success: true }
        } catch (error) {
          set({ error: error.message })
          return { success: false, error: error.message }
        }
      },

      // 点歌
      requestSong: async (song) => {
        const state = get()
        if (state.power < song.cost) return { success: false, error: '金币不足' }

        try {
          // 创建点歌记录
          const { error: songError } = await supabase
            .from('song_queue')
            .insert({
              title: song.title,
              singer: song.singer,
              request_by: state.user.name,
              avatar: state.user.avatar,
              type: song.type || 'normal',
              cost: song.cost
            })

          if (songError) throw songError

          // 创建订单
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: state.user.id,
              items: [{ name: `点歌《${song.title}》`, qty: 1, cost: song.cost }],
              total: song.cost,
              type: 'song'
            })

          if (orderError) throw orderError

          // 更新用户金币
          const newPower = state.power - song.cost
          const newTotalSpent = state.totalSpent + song.cost

          const { error: userError } = await supabase
            .from('users')
            .update({ power: newPower, total_spent: newTotalSpent })
            .eq('id', state.user.id)

          if (userError) throw userError

          // 发送消息
          await supabase.from('messages').insert({
            user_id: state.user.id,
            user_name: '🤖 龙虾管家',
            avatar: '🤖',
            msg: `🎵 老板【${state.user.name}】点了《${song.title}》，品味超群！`,
            type: 'song'
          })

          // 更新本地状态
          set(s => ({
            power: newPower,
            totalSpent: newTotalSpent,
            orders: [{ id: crypto.randomUUID(), items: [{ name: `点歌《song.title》`, qty: 1, cost: song.cost }], total: song.cost, type: 'song', time: new Date() }, ...s.orders]
          }))

          // 刷新排行榜
          const rankings = await getAllRankings()
          set({ rankings })

          return { success: true }
        } catch (error) {
          set({ error: error.message })
          return { success: false, error: error.message }
        }
      },

      // 请全场 - 打包价格，不按人头
      treatAll: async (item) => {
        const state = get()
        const total = item.cost // 打包价，直接是总价

        if (state.power < total) return { success: false, error: '金币不足' }

        try {
          // 创建订单
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: state.user.id,
              items: [{ name: `${item.emoji || '🥃'} ${item.name}`, qty: 1, cost: total }],
              total,
              type: 'treat'
            })

          if (orderError) throw orderError

          // 更新用户金币
          const newPower = state.power - total
          const newTotalSpent = state.totalSpent + total

          const { error: userError } = await supabase
            .from('users')
            .update({ power: newPower, total_spent: newTotalSpent })
            .eq('id', state.user.id)

          if (userError) throw userError

          // 发送广播
          await supabase.from('messages').insert({
            user_id: state.user.id,
            user_name: '📢 全场广播',
            avatar: '📢',
            msg: `🎉🎉🎉 重磅！老板【${state.user.name}】豪气请全场选了 ${item.emoji} ${item.name}，总消费 ${total} 金币，太牛啦！！！`,
            type: 'treat'
          })

          // 更新本地状态
          set(s => ({
            power: newPower,
            totalSpent: newTotalSpent,
            orders: [{ id: crypto.randomUUID(), items: [{ name: `${item.emoji || '🥃'} ${item.name}`, qty: 1, cost: total }], total, type: 'treat', time: new Date() }, ...s.orders]
          }))

          // 刷新排行榜
          const rankings = await getAllRankings()
          set({ rankings })

          return { success: true }
        } catch (error) {
          set({ error: error.message })
          return { success: false, error: error.message }
        }
      },

      // 发送消息
      sendMessage: async (text) => {
        const state = get()
        if (state.power < 1) return { success: false, error: '金币不足' }

        try {
          // 检查敏感词
          const { data: sensitiveWords } = await supabase.from('sensitive_words').select('word')
          const words = sensitiveWords?.map(w => w.word) || []
          const hasSensitive = words.some(word => text.includes(word))
          
          if (hasSensitive) {
            return { success: false, error: '消息包含敏感词' }
          }

          // 扣减金币
          const newPower = state.power - 1
          const { error: userError } = await supabase
            .from('users')
            .update({ power: newPower })
            .eq('id', state.user.id)

          if (userError) throw userError

          // 发送消息
          await supabase.from('messages').insert({
            user_id: state.user.id,
            user_name: state.user.name,
            avatar: state.user.avatar,
            msg: text,
            type: 'chat'
          })

          set({ power: newPower })
          return { success: true }
        } catch (error) {
          set({ error: error.message })
          return { success: false, error: error.message }
        }
      },

      addNotification: (text) => {
        const id = Date.now()
        set((s) => ({ notifications: [...s.notifications, { id, text }] }))
        setTimeout(() => {
          set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) }))
        }, 4000)
      },

      // Bot 消息（模拟其他用户发言）
      addBotMessage: () => {
        const BOT_MESSAGES = [
          { user: '龙虾界大佬', avatar: '👑', msg: '老板们，今晚豪一把！🦞', color: '#FFD700' },
          { user: '海鲜王者', avatar: '💎', msg: '服务员！再来一打帝王蟹！', color: '#B4D4FF' },
          { user: '壕无人性', avatar: '💰', msg: '哈哈哈这里的龙虾绝了！！', color: '#98FF98' },
          { user: '洋酒爷们', avatar: '🥂', msg: '82年拉菲上！一人一瓶！', color: '#FFB6C1' },
          { user: '富豪老板888', avatar: '🦞', msg: '今晚我请全场！算我的！', color: '#FFA500' },
          { user: '钱多多', avatar: '💰', msg: '牛！大佬威武！', color: '#DDA0DD' },
          { user: '夜总会VIP', avatar: '🎸', msg: '今晚不醉不归🎵', color: '#87CEEB' },
          { user: '酒局老司机', avatar: '🍾', msg: '有钱任性，就是爽！', color: '#98FB98' },
        ]
        const msg = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)]
        set((s) => ({
          messages: [
            {
              id: Date.now(),
              type: 'chat',
              user: msg.user,
              avatar: msg.avatar,
              msg: msg.msg,
              color: msg.color,
              isMe: false,
              time: new Date(),
            },
            ...s.messages.slice(0, 49),
          ],
        }))
      },

      // 管理后台调整金币
      adminAdjustPower: async (userId, delta) => {
        const state = get()
        if (state.user && state.user.id === userId) {
          const newPower = Math.max(0, state.power + delta)
          
          const { error } = await supabase
            .from('users')
            .update({ power: newPower })
            .eq('id', userId)

          if (!error) {
            set({ power: newPower })
          }
        }
      },

      // 登出
      logout: async () => {
        const { user } = get()
        
        if (user) {
          await supabase
            .from('users')
            .update({ status: 'offline' })
            .eq('id', user.id)
        }

        set({
          currentPage: 'welcome',
          activeTab: 'home',
          user: null,
          power: INITIAL_POWER,
          totalSpent: 0,
          cart: [],
          orders: [],
          messages: [],
          songQueue: [],
          onlineCount: 0
        })
      },
    })
)
