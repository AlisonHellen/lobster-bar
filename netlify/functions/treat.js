const { supabase, TREAT_PACKAGES } = require('./_lib')

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
    const { userId, name, packageId } = JSON.parse(event.body || '{}')
    if (!userId || !name) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: '缺少参数' }) }
    }

    const { data: user } = await supabase.from('users').select('power').eq('id', userId).single()
    if (!user) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: '用户不存在' }) }
    }

    let pkg
    if (packageId) pkg = TREAT_PACKAGES.find(p => p.id === packageId)
    if (!pkg) {
      const affordable = TREAT_PACKAGES.filter(p => user.power >= p.cost)
      if (affordable.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: `金币不足！最便宜需要 ${TREAT_PACKAGES[0].cost}，你只有 ${user.power}` }) }
      }
      pkg = affordable[Math.floor(Math.random() * affordable.length)]
    }

    const newPower = user.power - pkg.cost

    await supabase.from('orders').insert({ user_id: userId, items: [{ name: `${pkg.emoji} ${pkg.name}`, qty: 1, cost: pkg.cost }], total: pkg.cost, type: 'treat' })
    await supabase.from('users').update({ power: newPower }).eq('id', userId)
    await supabase.from('messages').insert({
      user_id: userId, user_name: '📢 全场广播', avatar: '📢',
      msg: `🎉🎉🎉 重磅！${name} 豪气请全场选了 ${pkg.emoji} ${pkg.name}，消费 ${pkg.cost} 金币，太牛啦！！！`, type: 'treat',
    })

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        data: { package: pkg.name, emoji: pkg.emoji, cost: pkg.cost, power: newPower, message: `🔥 请全场成功！选了 ${pkg.emoji} ${pkg.name}，-${pkg.cost}金币，全场沸腾！` }
      })
    }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
