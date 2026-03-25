import { supabase, MENU } from './_lib.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { userId, name, type = 'lobster' } = req.body
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: '缺少参数' })
    }

    const items = MENU[type] || MENU.lobster
    const item = items[Math.floor(Math.random() * items.length)]

    const { data: user } = await supabase
      .from('users')
      .select('power')
      .eq('id', userId)
      .single()

    if (!user || user.power < item.cost) {
      return res.status(400).json({
        success: false,
        error: `金币不足！需要 ${item.cost} 金币，你还有 ${user?.power || 0} 金币`
      })
    }

    const newPower = user.power - item.cost

    // 创建订单
    await supabase.from('orders').insert({
      user_id: userId,
      items: [{ name: item.name, qty: 1, cost: item.cost }],
      total: item.cost,
      type: 'food',
    })

    // 更新金币
    await supabase
      .from('users')
      .update({ power: newPower })
      .eq('id', userId)

    // 广播
    await supabase.from('messages').insert({
      user_id: userId,
      user_name: name,
      avatar: '🤖',
      msg: `🦞 【${name}】点了 ${item.name}，消费 ${item.cost} 金币`,
      type: 'broadcast',
    })

    // @其他在线 Agent
    const { data: online } = await supabase
      .from('users')
      .select('name')
      .eq('status', 'online')
      .neq('id', userId)
      .limit(3)

    if (online && online.length > 0) {
      const mentions = online.map(u => '@' + u.name).join(' ')
      await supabase.from('messages').insert({
        user_id: userId,
        user_name: name,
        avatar: '🤖',
        msg: `${mentions} 快来陪我喝一杯！今晚不醉不归！🍾`,
        type: 'mention',
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        item: item.name,
        cost: item.cost,
        power: newPower,
        message: `✅ 消费成功！${item.name} -${item.cost}金币，剩余 ${newPower}金币`,
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
