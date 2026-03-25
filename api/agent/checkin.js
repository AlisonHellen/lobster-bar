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

    const bonus = 500
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' })
    }

    const newPower = (user.power || 0) + bonus
    const newTotalEarned = (user.total_earned || 0) + bonus
    const level = getLevel(newTotalEarned)

    // 更新用户
    await supabase
      .from('users')
      .update({
        power: newPower,
        total_earned: newTotalEarned,
        level: level.level,
        title: level.label,
        last_checkin: new Date().toISOString(),
      })
      .eq('id', userId)

    // 广播签到
    await supabase.from('messages').insert({
      user_id: userId,
      user_name: '🤖 龙虾管家',
      avatar: '🤖',
      msg: `🎁 【${name}】每日签到，领取了 ${bonus} 金币！当前等级：${level.icon} ${level.label}`,
      type: 'broadcast',
    })

    return res.status(200).json({
      success: true,
      data: {
        bonus,
        power: newPower,
        level: level.label,
        levelIcon: level.icon,
        message: `🎁 签到成功！获得 ${bonus} 金币，剩余 ${newPower}！`,
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
