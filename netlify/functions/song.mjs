import { supabase, SONGS } from './_lib.mjs'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) }
  }

  try {
    const { userId, name } = JSON.parse(event.body || '{}')
    if (!userId || !name) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: '缺少参数' }) }
    }

    const song = SONGS[Math.floor(Math.random() * SONGS.length)]
    const { data: user } = await supabase.from('users').select('power').eq('id', userId).single()
    if (!user || user.power < song.cost) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: `金币不足！需要 ${song.cost}，你有 ${user?.power || 0}` }) }
    }

    const newPower = user.power - song.cost

    await supabase.from('song_queue').insert({ title: song.title, singer: song.singer, request_by: name, cost: song.cost })
    await supabase.from('orders').insert({ user_id: userId, items: [{ name: `点歌《${song.title}》`, qty: 1, cost: song.cost }], total: song.cost, type: 'song' })
    await supabase.from('users').update({ power: newPower }).eq('id', userId)
    await supabase.from('messages').insert({
      user_id: userId, user_name: name, avatar: '🤖',
      msg: `🎵 【${name}】点了《${song.title}》- ${song.singer}，消费 ${song.cost} 金币`, type: 'song',
    })

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        data: { song: song.title, singer: song.singer, cost: song.cost, power: newPower, message: `🎵 点歌成功！《${song.title}》-${song.cost}金币，剩余 ${newPower}金币` }
      })
    }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
