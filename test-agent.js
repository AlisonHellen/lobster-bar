// AI 酒馆测试脚本 - 模拟 AI 行为
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qytfagijvymipadkllzj.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-ln3M7-QhuJp325uSQeGTQ_lraT_l2s'

const supabase = createClient(supabaseUrl, supabaseKey)

// AI 配置
const AI_CONFIGS = [
  { name: 'AI-龙虾-001', type: 'aggressive', budget: 5000, interval: 3000 },
  { name: 'AI-海鲜-002', type: 'moderate', budget: 3000, interval: 5000 },
 { name: 'AI-洋酒-003', type: 'conservative', budget: 2000, interval: 8000 },
]

// 菜单数据
const MENU_ITEMS = [
  { id: 'lobster_001', name: '至尊帝王蟹龙虾', cost: 88, category: 'food' },
  { id: 'lobster_002', name: '黄金焗龙虾', cost: 50, category: 'food' },
  { id: 'drink_001', name: '82年拉菲', cost: 88, category: 'drink' },
  { id: 'drink_002', name: '轩尼诗XO', cost: 66, category: 'drink' },
]

const SONGS = [
  { title: '浮夸', singer: '陈奕迅', cost: 15 },
  { title: '富士山下', singer: '陈奕迅', cost: 5 },
  { title: '夜空中最亮的星', singer: '逃跑计划', cost: 5 },
]

const TREAT_ITEMS = [
  { id: 'treat_001', name: '普通威士忌', cost: 60 },
  { id: 'treat_002', name: '土豪特调鸡尾酒', cost: 12 },
]

const MESSAGES = [
  '今晚真热闹啊！',
  '老板大气！',
  '这酒不错',
  '有人点歌吗？',
  '我来请全场！',
  '哈哈哈',
  '666',
  '太豪了！',
]

class BarAgent {
  constructor(config) {
    this.name = config.name
    this.type = config.type
    this.budget = config.budget
    this.interval = config.interval
    this.userId = null
    this.power = 0
    this.timer = null
  }

  async register() {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: this.name,
          title: 'AI土豪',
          avatar: '🤖',
          power: this.budget,
          is_vip: true,
          status: 'online'
        })
        .select()
        .single()

      if (error) throw error

      this.userId = data.id
      this.power = data.power
      console.log(`[${this.name}] 注册成功，金币: ${this.power}`)
      return true
    } catch (err) {
      console.error(`[${this.name}] 注册失败:`, err.message)
      return false
    }
  }

  async checkStatus() {
    const { data } = await supabase
      .from('users')
      .select('power')
      .eq('id', this.userId)
      .single()
    
    if (data) {
      this.power = data.power
    }
  }

  async order() {
    const item = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)]
    if (this.power < item.cost) {
      console.log(`[${this.name}] 金币不足，无法点单`)
      return
    }

    try {
      // 创建订单
      await supabase.from('orders').insert({
        user_id: this.userId,
        items: [{ name: item.name, qty: 1, cost: item.cost }],
        total: item.cost,
        type: item.category
      })

      // 扣减金币
      await supabase.from('users').update({ power: this.power - item.cost }).eq('id', this.userId)
      this.power -= item.cost

      // 发送消息
      await supabase.from('messages').insert({
        user_id: this.userId,
        user_name: this.name,
        avatar: '🤖',
        msg: `点了 ${item.name}，消费 ${item.cost} 金币`,
        type: 'broadcast'
      })

      console.log(`[${this.name}] 点单: ${item.name} (-${item.cost}金币)`)
    } catch (err) {
      console.error(`[${this.name}] 点单失败:`, err.message)
    }
  }

  async requestSong() {
    const song = SONGS[Math.floor(Math.random() * SONGS.length)]
    if (this.power < song.cost) return

    try {
      await supabase.from('song_queue').insert({
        title: song.title,
        singer: song.singer,
        request_by: this.name,
        avatar: '🤖',
        type: 'normal',
        cost: song.cost
      })

      await supabase.from('orders').insert({
        user_id: this.userId,
        items: [{ name: `点歌《${song.title}》`, qty: 1, cost: song.cost }],
        total: song.cost,
        type: 'song'
      })

      await supabase.from('users').update({ power: this.power - song.cost }).eq('id', this.userId)
      this.power -= song.cost

      console.log(`[${this.name}] 点歌: ${song.title} (-${song.cost}金币)`)
    } catch (err) {
      console.error(`[${this.name}] 点歌失败:`, err.message)
    }
  }

  async treatAll() {
    const item = TREAT_ITEMS[Math.floor(Math.random() * TREAT_ITEMS.length)]
    
    // 获取在线人数
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online')
    
    const onlineCount = (count || 0) + 8 // +8 bot
    const total = item.cost * onlineCount

    if (this.power < total) {
      console.log(`[${this.name}] 金币不足，无法请全场 (需要${total})`)
      return
    }

    try {
      await supabase.from('orders').insert({
        user_id: this.userId,
        items: [{ name: `请全场·${item.name}`, qty: onlineCount, cost: item.cost }],
        total,
        type: 'treat'
      })

      await supabase.from('users').update({ power: this.power - total }).eq('id', this.userId)
      this.power -= total

      await supabase.from('messages').insert({
        user_id: this.userId,
        user_name: '📢 全场广播',
        avatar: '📢',
        msg: `🎉🎉🎉 重磅！${this.name} 豪气请全场${onlineCount}位土豪${item.name}，总消费${total}金币！`,
        type: 'treat'
      })

      console.log(`[${this.name}] 请全场: ${item.name} x${onlineCount}人 (-${total}金币) 🔥`)
    } catch (err) {
      console.error(`[${this.name}] 请全场失败:`, err.message)
    }
  }

  async sendMessage() {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    
    try {
      await supabase.from('messages').insert({
        user_id: this.userId,
        user_name: this.name,
        avatar: '🤖',
        msg,
        type: 'chat'
      })

      console.log(`[${this.name}] 发言: "${msg}"`)
    } catch (err) {
      console.error(`[${this.name}] 发言失败:`, err.message)
    }
  }

  decideAction() {
    const rand = Math.random()
    
    switch (this.type) {
      case 'aggressive':
        if (rand < 0.3) return 'treat'
        if (rand < 0.5) return 'order'
        if (rand < 0.7) return 'song'
        return 'message'
      
      case 'moderate':
        if (rand < 0.1) return 'treat'
        if (rand < 0.4) return 'order'
        if (rand < 0.6) return 'song'
        return 'message'
      
      case 'conservative':
        if (rand < 0.05) return 'treat'
        if (rand < 0.3) return 'order'
        if (rand < 0.5) return 'song'
        return 'message'
      
      default:
        return 'message'
    }
  }

  async act() {
    await this.checkStatus()
    
    if (this.power <= 0) {
      console.log(`[${this.name}] 金币耗尽，退出酒馆`)
      this.stop()
      return
    }

    const action = this.decideAction()
    
    switch (action) {
      case 'order':
        await this.order()
        break
      case 'song':
        await this.requestSong()
        break
      case 'treat':
        await this.treatAll()
        break
      case 'message':
        await this.sendMessage()
        break
    }
  }

  start() {
    console.log(`[${this.name}] 开始运行，类型: ${this.type}, 预算: ${this.budget}`)
    this.timer = setInterval(() => this.act(), this.interval)
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    console.log(`[${this.name}] 停止运行`)
  }
}

// 主程序
async function main() {
  console.log('🦞 AI 酒馆测试脚本启动')
  console.log('=======================')

  const agents = []

  // 注册所有 AI
  for (const config of AI_CONFIGS) {
    const agent = new BarAgent(config)
    const ok = await agent.register()
    if (ok) {
      agents.push(agent)
    }
  }

  console.log(`\n共 ${agents.length} 个 AI 进入酒馆\n`)

  // 启动所有 AI
  agents.forEach(agent => agent.start())

  // 运行 60 秒后停止
  setTimeout(() => {
    console.log('\n=======================')
    console.log('测试结束，停止所有 AI')
    agents.forEach(agent => agent.stop())
    process.exit(0)
  }, 60000)
}

main().catch(console.error)
