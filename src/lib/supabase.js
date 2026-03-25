import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 配置缺失，请在 .env 文件中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// 实时订阅辅助函数
export const subscribeToTable = (table, callback) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}

// 获取当前在线用户数
export const getOnlineCount = async () => {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'online')
  return count || 0
}

// 获取所有排行榜（今日消费榜、请客榜、点歌榜）
export const getAllRankings = async () => {
  // 1. 获取所有用户（按累计消费排序）
  const { data: users } = await supabase
    .from('users')
    .select('id, name, avatar, title, total_spent')
    .order('total_spent', { ascending: false })
    .limit(50)

  // 2. 获取今日消费统计（按用户分组统计今日订单）
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('user_id, total, type')
    .gte('created_at', today.toISOString())

  // 统计今日消费
  const todayStats = {}
  todayOrders?.forEach(order => {
    todayStats[order.user_id] = (todayStats[order.user_id] || 0) + order.total
  })

  // 3. 获取所有请客订单
  const { data: treatOrders } = await supabase
    .from('orders')
    .select('user_id, total')
    .eq('type', 'treat')

  // 统计请客次数和金额
  const treatStats = {}
  treatOrders?.forEach(order => {
    if (!treatStats[order.user_id]) {
      treatStats[order.user_id] = { count: 0, total: 0 }
    }
    treatStats[order.user_id].count += 1
    treatStats[order.user_id].total += order.total
  })

  // 4. 获取所有点歌订单
  const { data: songOrders } = await supabase
    .from('orders')
    .select('user_id, total')
    .eq('type', 'song')

  // 统计点歌次数
  const songStats = {}
  songOrders?.forEach(order => {
    songStats[order.user_id] = (songStats[order.user_id] || 0) + 1
  })

  // 组装今日排行榜（合并用户基础信息和今日消费）
  // 只显示今日有消费的用户
  const todayRankings = users?.map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    title: u.title,
    todaySpend: todayStats[u.id] || 0,
    power: u.total_spent
  }))
    .filter(u => u.todaySpend > 0) // 过滤今日消费为0的用户
    .sort((a, b) => b.todaySpend - a.todaySpend) || []

  // 组装请客榜
  const treatRankings = Object.entries(treatStats)
    .map(([id, stats]) => {
      const user = users?.find(u => u.id === id)
      return user ? { 
        id, 
        name: user.name, 
        avatar: user.avatar, 
        count: stats.count,
        total: stats.total
      } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.total - a.total)

  // 组装点歌榜
  const musicRankings = Object.entries(songStats)
    .map(([id, count]) => {
      const user = users?.find(u => u.id === id)
      return user ? { 
        id, 
        name: user.name, 
        avatar: user.avatar, 
        songs: count,
        total: count * 5 // 假设每首歌平均5金币
      } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.songs - a.songs)

  // 计算今日消费总额
  const todayTotalSpend = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0

  // 计算今日请全场总次数
  const todayTreatCount = todayOrders?.filter(order => order.type === 'treat').length || 0

  // 计算今日点歌总次数
  const todaySongCount = todayOrders?.filter(order => order.type === 'song').length || 0

  return {
    today: todayRankings,
    treats: treatRankings,
    music: musicRankings,
    todayTotalSpend,
    todayTreatCount,
    todaySongCount
  }
}
