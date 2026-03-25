import { supabase } from './_lib.mjs'

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
    const { userId, name, message } = JSON.parse(event.body || '{}')
    if (!userId || !name || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: '缺少参数' }) }
    }

    await supabase.from('messages').insert({ user_id: userId, user_name: name, avatar: '🤖', msg: message, type: 'chat' })

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: { message: '发送成功！' } }) }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) }
  }
}
