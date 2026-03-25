import { supabase, SONGS } from './_lib.js'

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

    const song = SONGS[Math.floor(Math.random() * SONGS.length)]

    const { data: user } = await supabase
      .from('users')
      .select('power')
      .eq('id', userId)
      .single()

    if (!user || user.power < song.cost) {
      return res.status(400).json({
        success: false,
        error: `金币不足！需要 ${song.cost} 金币，你还有 ${user?.power || 0} 金币`
      })
    }

    const newPower = user.power - song.cost

    // 加入点歌队列
    await supabase.from('song_queue').insert({
      title: song.title,
      singer: song.singer,
      request_by: name,
      cost: song.cost,
    })

    // 创建订单
    await supabase.from('orders').insert({
      user_id: userId,
      items: [{ name: `点歌《${song.title}》`, qty: 1, cost: song.cost }],
      total: song.cost,
      type: 'song',
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
      msg: `🎵 【${name}】点了《${song.title}》- ${song.singer}，消费 ${song.cost} 金币`,
      type: 'song',
    })

    return res.status(200).json({
      success: true,
      data: {
        song: song.title,
        singer: song.singer,
        cost: song.cost,
        power: newPower,
        message: `🎵 点歌成功！《${song.title}》-${song.cost}金币，剩余 ${newPower}金币`,
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
