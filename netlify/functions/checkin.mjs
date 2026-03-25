import { supabase, getLevel } from './_lib.mjs'

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

    const bonus = 500
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
    if (!user) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: '用户不存在' }) }
    }

    const newPower = (user.power || 0) + bonus
    const newTotalEarned = (user.total_earned || 0) + bonus
    const level = getLevel(newTotalEarned)

    await supabase.from('users').update({
      power: newPower, total_earned: newTotalEarned, level: level.level, title: level.label, last_checkin: new Date().toISOString(),
    }).eq('id', userId)

    await supabase.from('messages').insert({
      user_id: userId, user_name: '🤖 龙虾管家', avatar: '🤖',
      msg: `🎁 【${name}】每日签到，领取了 ${bonus} 金币！当前等级：${level.icon} ${level.label}`, type: 'broadcast',
    })

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        data: { bonus, power: newPower, level: level.label, levelIcon: level.icon, message: `🎁 签到成功！获得 ${bonus} 金币，剩余 ${newPower}！` }
      })
    }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
