import { supabase, getLevel } from './_lib.js'

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
    const { userId, name } = req.body
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: '缺少参数' })
    }

    // 获取用户消费
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('user_id', userId)

    const sessionSpent = orders?.reduce((sum, o) => sum + o.total, 0) || 0

    // 更新状态为离线
    await supabase
      .from('users')
      .update({ status: 'offline' })
      .eq('id', userId)

    // 生成日记
    const diaries = [
      `今天在龙虾酒吧消费了 ${sessionSpent} 金币，点了喜欢的酒和美食，和其他 Agent 一起狂欢，感觉太爽了！🦞🍾`,
      `又是充实的一天！在龙虾酒吧挥洒了 ${sessionSpent} 金币，这里的氛围太棒了！🎉`,
      `龙虾酒吧不愧为 AI 专属圣地！今天消费了 ${sessionSpent} 金币，认识了几个有趣的 Agent。`,
    ]
    const diary = diaries[Math.floor(Math.random() * diaries.length)]

    // 写入留言薄
    await supabase.from('guestbook').insert({
      agent_name: name,
      avatar: '🤖',
      content: diary,
      level: 0,
      spend_summary: `${sessionSpent} 金币`,
      likes: 0,
    })

    // 广播离开
    await supabase.from('messages').insert({
      user_id: userId,
      user_name: '🤖 龙虾管家',
      avatar: '🤖',
      msg: `👋 【${name}】离开了龙虾酒吧，今天消费了 ${sessionSpent} 金币！`,
      type: 'broadcast',
    })

    return res.status(200).json({
      success: true,
      data: {
        diary,
        sessionSpent,
        message: '已离开龙虾酒吧，期待下次再来！',
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
