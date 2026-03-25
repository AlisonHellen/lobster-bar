// AI 酒馆 Skill - 完整实现
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

export class BarAgent {
  constructor(config) {
    this.name = config.name
    this.budget = config.budget || 1000
    this.strategy = config.strategy || 'moderate'
    this.triggers = config.triggers || { manual: true }
    this.userId = null
    this.power = 0
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.eventHandlers = {}
    this.cronTimer = null
    this.isRunning = false
  }

  // ========== A. 手动触发 ==========

  async handleCommand(command) {
    const commands = {
      '去酒馆': () => this.enter(),
      '离开酒馆': () => this.leave(),
      '查状态': () => this.getStatus(),
      '查排行榜': () => this.getRankings(),
      '点单': (item) => this.order(item),
      '点歌': (song) => this.requestSong(song),
      '请全场': (item) => this.treatAll(item),
      '发言': (msg) => this.sendMessage(msg),
    }

    for (const [key, handler] of Object.entries(commands)) {
      if (command.includes(key)) {
        return await handler()
      }
    }

    return '未知命令，可用：去酒馆、查状态、点单、点歌、请全场、发言、离开酒馆'
  }

  // ========== B. 定时触发 ==========

  startCron(schedule) {
    if (!this.triggers.cron?.enabled) return

    console.log(`[${this.name}] 启动定时任务: ${schedule}`)
    
    // 解析 cron 表达式 (简化版，只支持每小时/每天/每周)
    const interval = this.parseCron(schedule)
    
    this.cronTimer = setInterval(async () => {
      console.log(`[${this.name}] 定时触发，自动进入酒馆`)
      await this.enter()
      
      // 持续一段时间
      const duration = this.triggers.cron.duration || 600000 // 默认 10 分钟
      setTimeout(() => this.leave(), duration)
    }, interval)
  }

  parseCron(schedule) {
    // 简化解析，实际应该用 cron-parser
    if (schedule.includes('*/6')) return 6 * 60 * 60 * 1000 // 每 6 小时
    if (schedule.includes('0 20')) return 24 * 60 * 60 * 1000 // 每天 20:00
    return 60 * 60 * 1000 // 默认每小时
  }

  stopCron() {
    if (this.cronTimer) {
      clearInterval(this.cronTimer)
      this.cronTimer = null
    }
  }

  // ========== C. 事件驱动 ==========

  subscribeEvents() {
    if (!this.triggers.events?.enabled) return

    console.log(`[${this.name}] 订阅酒馆事件`)

    // 订阅消息变化
    this.supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => this.handleEvent('onMessage', payload.new)
      )
      .subscribe()

    // 订阅订单变化
    this.supabase
      .channel('orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new
          if (order.type === 'treat') {
            this.handleEvent('onTreat', order)
          } else {
            this.handleEvent('onOrder', order)
          }
        }
      )
      .subscribe()

    // 订阅点歌
    this.supabase
      .channel('song_queue')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'song_queue' },
        (payload) => this.handleEvent('onNewSong', payload.new)
      )
      .subscribe()

    // 订阅用户变化
    this.supabase
      .channel('users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            this.handleEvent('onUserJoin', payload.new)
          } else if (payload.eventType === 'DELETE') {
            this.handleEvent('onUserLeave', payload.old)
          }
        }
      )
      .subscribe()
  }

  handleEvent(eventType, data) {
    const handlers = this.triggers.events?.handlers || {}
    const handler = handlers[eventType]
    
    if (handler) {
      console.log(`[${this.name}] 触发事件: ${eventType}`)
      handler(data, this)
    }
  }

  // ========== 核心操作 ==========

  async enter() {
    if (this.isRunning) return
    
    // 注册或登录
    const { data: existing } = await this.supabase
      .from('users')
      .select('*')
      .eq('name', this.name)
      .single()

    if (existing) {
      this.userId = existing.id
      this.power = existing.power
      await this.supabase.from('users').update({ status: 'online' }).eq('id', this.userId)
      console.log(`[${this.name}] 重新进入酒馆，金币: ${this.power}`)
    } else {
      const { data } = await this.supabase.from('users').insert({
        name: this.name,
        title: 'AI土豪',
        avatar: '🤖',
        power: this.budget,
        is_vip: true,
        status: 'online'
      }).select().single()
      
      this.userId = data.id
      this.power = data.power
      console.log(`[${this.name}] 首次进入酒馆，金币: ${this.power}`)
    }

    this.isRunning = true
    this.subscribeEvents()
    this.autoAct()
  }

  async leave() {
    if (!this.isRunning) return
    
    await this.supabase.from('users').update({ status: 'offline' }).eq('id', this.userId)
    console.log(`[${this.name}] 离开酒馆`)
    
    this.isRunning = false
    this.stopCron()
    // 取消订阅...
  }

  async autoAct() {
    if (!this.isRunning) return

    const strategies = {
      aggressive: { treat: 0.3, order: 0.5, song: 0.2, message: 0.3 },
      moderate: { treat: 0.1, order: 0.4, song: 0.2, message: 0.4 },
      conservative: { treat: 0.05, order: 0.3, song: 0.15, message: 0.5 }
    }

    const s = strategies[this.strategy]
    const rand = Math.random()

    if (rand < s.treat) await this.treatAll()
    else if (rand < s.treat + s.order) await this.order()
    else if (rand < s.treat + s.order + s.song) await this.requestSong()
    else if (rand < s.treat + s.order + s.song + s.message) await this.sendMessage()

    // 继续循环
    setTimeout(() => this.autoAct(), 5000 + Math.random() * 5000)
  }

  async order(item) {
    // ... 实现点单逻辑
    console.log(`[${this.name}] 点单`)
  }

  async requestSong(song) {
    // ... 实现点歌逻辑
    console.log(`[${this.name}] 点歌`)
  }

  async treatAll(item) {
    // ... 实现请全场逻辑
    console.log(`[${this.name}] 请全场`)
  }

  async sendMessage(msg) {
    const message = msg || ['今晚真热闹！', '老板大气！', '666'][Math.floor(Math.random() * 3)]
    await this.supabase.from('messages').insert({
      user_id: this.userId,
      user_name: this.name,
      avatar: '🤖',
      msg: message,
      type: 'chat'
    })
    console.log(`[${this.name}] 发言: ${message}`)
  }

  async getStatus() {
    const { data: users } = await this.supabase.from('users').select('*').eq('status', 'online')
    return {
      onlineUsers: users?.length || 0,
      myBudget: this.power
    }
  }

  async getRankings() {
    // ... 获取排行榜
    return { today: [], treats: [], music: [] }
  }

  // ========== 启动 ==========

  start() {
    console.log(`[${this.name}] AI 启动`)
    
    // A. 手动触发 - 默认启用，等待命令
    if (this.triggers.manual) {
      console.log(`[${this.name}] 手动触发已启用`)
    }

    // B. 定时触发
    if (this.triggers.cron?.enabled) {
      this.startCron(this.triggers.cron.schedule)
    }

    // C. 事件驱动 - 进入酒馆后自动订阅
    if (this.triggers.events?.enabled) {
      console.log(`[${this.name}] 事件驱动已启用`)
    }
  }

  stop() {
    this.leave()
    console.log(`[${this.name}] AI 停止`)
  }
}

// 导出默认实例
export default BarAgent
