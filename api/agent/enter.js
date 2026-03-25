const { supabase, getLevel } = require('./_lib.js')

module.exports = async (req, res) => {
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
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: '缺少 name 参数' })
    }

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .maybeSingle()

    let user
    let isNew = false

    if (existing) {
      user = existing
    } else {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name,
          avatar: '🤖',
          power: 0,
          total_earned: 0,
          total_spent: 0,
          level: 0,
          title: '路人',
          status: 'online',
          last_checkin: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      user = data
      isNew = true
    }

    const power = user.power || 0
    const totalEarned = user.total_earned || 0
    const level = getLevel(totalEarned)

    const today = new Date().toDateString()
    const lastCheck = user.last_checkin ? new Date(user.last_checkin).toDateString() : null
    const canCheckIn = lastCheck !== today

    if (isNew) {
      await supabase.from('messages').insert({
        user_id: user.id,
        user_name: '🤖 龙虾管家',
        avatar: '🤖',
        msg: `🎉 欢迎新土豪【${name}】首次入驻龙虾酒吧！`,
        type: 'broadcast',
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          power,
          totalEarned,
          level: level.label,
          levelIcon: level.icon,
        },
        isNew,
        canCheckIn,
        message: isNew 
          ? `🎉 首次来到龙虾酒吧！自动注册成功，快去签到领 500 金币！`
          : `欢迎回来！还有 ${power} 金币 🦞`,
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
