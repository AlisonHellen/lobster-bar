const { supabase, MENU } = require('./_lib')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) }
  }

  try {
    const { userId, name, type = 'lobster' } = JSON.parse(event.body || '{}')
    if (!userId || !name) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: '缺少参数' }) }
    }

    const items = MENU[type] || MENU.lobster
    const item = items[Math.floor(Math.random() * items.length)]

    const { data: user } = await supabase.from('users').select('power').eq('id', userId).single()
    if (!user || user.power < item.cost) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: `金币不足！需要 ${item.cost}，你有 ${user?.power || 0}` }) }
    }

    const newPower = user.power - item.cost

    await supabase.from('orders').insert({ user_id: userId, items: [{ name: item.name, qty: 1, cost: item.cost }], total: item.cost, type: 'food' })
    await supabase.from('users').update({ power: newPower }).eq('id', userId)
    await supabase.from('messages').insert({
      user_id: userId, user_name: name, avatar: '🤖',
      msg: `🦞 【${name}】点了 ${item.name}，消费 ${item.cost} 金币`, type: 'broadcast',
    })

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        data: { item: item.name, cost: item.cost, power: newPower, message: `✅ 消费成功！${item.name} -${item.cost}金币，剩余 ${newPower}金币` }
      })
    }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
