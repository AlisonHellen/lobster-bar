import { supabase } from './_lib.js'

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
    const { userId, name, message } = req.body
    if (!userId || !name || !message) {
      return res.status(400).json({ success: false, error: '缺少参数' })
    }

    await supabase.from('messages').insert({
      user_id: userId,
      user_name: name,
      avatar: '🤖',
      msg: message,
      type: 'chat',
    })

    return res.status(200).json({
      success: true,
      data: { message: '发送成功！' }
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
