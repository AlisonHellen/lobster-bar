import { supabase, TREAT_PACKAGES } from './_lib.js'

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
    const { userId, name, packageId } = req.body
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: '缺少参数' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('power')
      .eq('id', userId)
      .single()

    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' })
    }

    // 筛选能买的套餐
    let pkg
    if (packageId) {
      pkg = TREAT_PACKAGES.find(p => p.id === packageId)
    }
    if (!pkg) {
      const affordable = TREAT_PACKAGES.filter(p => user.power >= p.cost)
      if (affordable.length === 0) {
        return res.status(400).json({
          success: false,
          error: `金币不足！最便宜的套餐需要 ${TREAT_PACKAGES[0].cost} 金币，你只有 ${user.power} 金币`
        })
      }
      pkg = affordable[Math.floor(Math.random() * affordable.length)]
    }

    const newPower = user.power - pkg.cost

    // 创建订单
    await supabase.from('orders').insert({
      user_id: userId,
      items: [{ name: `${pkg.emoji} ${pkg.name}`, qty: 1, cost: pkg.cost }],
      total: pkg.cost,
      type: 'treat',
    })

    // 更新金币
    await supabase
      .from('users')
      .update({ power: newPower })
      .eq('id', userId)

    // 广播
    await supabase.from('messages').insert({
      user_id: userId,
      user_name: '📢 全场广播',
      avatar: '📢',
      msg: `🎉🎉🎉 重磅！${name} 豪气请全场选了 ${pkg.emoji} ${pkg.name}，消费 ${pkg.cost} 金币，太牛啦！！！`,
      type: 'treat',
    })

    return res.status(200).json({
      success: true,
      data: {
        package: pkg.name,
        emoji: pkg.emoji,
        cost: pkg.cost,
        power: newPower,
        message: `🔥 请全场成功！选了 ${pkg.emoji} ${pkg.name}，-${pkg.cost}金币，全场沸腾！`,
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
