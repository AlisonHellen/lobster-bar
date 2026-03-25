// ===== 土豪龙虾酒吧 - 压力测试脚本 =====
// 运行: node api/test/stress-test.js

const BASE_URL = 'http://localhost:5173'

// 模拟 Agent
class TestAgent {
  constructor(name) {
    this.name = name
    this.userId = null
    this.power = 0
  }

  async call(api, body) {
    const res = await fetch(`${BASE_URL}/api/agent/${api}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return res.json()
  }

  async enter() {
    const result = await this.call('enter', { name: this.name })
    if (result.success) {
      this.userId = result.data.user.id
      this.power = result.data.user.power
      console.log(`  ✅ ${this.name} 进入酒吧，power: ${this.power}`)
    } else {
      console.log(`  ❌ ${this.name} 进入失败: ${result.error}`)
    }
    return result
  }

  async checkin() {
    const result = await this.call('checkin', { userId: this.userId, name: this.name })
    if (result.success) {
      this.power = result.data.power
      console.log(`  ✅ ${this.name} 签到成功，power: ${this.power}`)
    } else {
      console.log(`  ❌ ${this.name} 签到失败: ${result.error}`)
    }
    return result
  }

  async order(type = 'lobster') {
    const result = await this.call('order', { userId: this.userId, name: this.name, type })
    if (result.success) {
      this.power = result.data.power
      console.log(`  ✅ ${this.name} 点单: ${result.data.item}, 剩余: ${this.power}`)
    } else {
      console.log(`  ❌ ${this.name} 点单失败: ${result.error}`)
    }
    return result
  }

  async song() {
    const result = await this.call('song', { userId: this.userId, name: this.name })
    if (result.success) {
      this.power = result.data.power
      console.log(`  ✅ ${this.name} 点歌: ${result.data.song}, 剩余: ${this.power}`)
    } else {
      console.log(`  ❌ ${this.name} 点歌失败: ${result.error}`)
    }
    return result
  }

  async treat() {
    const result = await this.call('treat', { userId: this.userId, name: this.name })
    if (result.success) {
      this.power = result.data.power
      console.log(`  ✅ ${this.name} 请全场: ${result.data.package}, 剩余: ${this.power}`)
    } else {
      console.log(`  ❌ ${this.name} 请全场失败: ${result.error}`)
    }
    return result
  }

  async chat(msg) {
    const result = await this.call('chat', { userId: this.userId, name: this.name, message: msg })
    if (result.success) {
      console.log(`  ✅ ${this.name} 发言: ${msg}`)
    } else {
      console.log(`  ❌ ${this.name} 发言失败: ${result.error}`)
    }
    return result
  }

  async leave() {
    const result = await this.call('leave', { userId: this.userId, name: this.name })
    if (result.success) {
      console.log(`  ✅ ${this.name} 离开，日记: ${result.data.diary.substring(0, 30)}...`)
    } else {
      console.log(`  ❌ ${this.name} 离开失败: ${result.error}`)
    }
    return result
  }
}

// 测试场景
async function testScenario1() {
  console.log('\n========== 场景1: 单个 Agent 完整流程 ==========\n')
  
  const agent = new TestAgent('测试员1号')
  
  // 1. 进入
  await agent.enter()
  
  // 2. 签到
  await agent.checkin()
  
  // 3. 点单
  await agent.order('lobster')
  await agent.order('liquor')
  
  // 4. 点歌
  await agent.song()
  
  // 5. 请全场
  await agent.treat()
  
  // 6. 聊天
  await agent.chat('今晚真热闹！')
  
  // 7. 离开
  await agent.leave()
  
  console.log('\n✅ 场景1完成!')
}

// 测试场景2: 多个 Agent 并发
async function testScenario2(count = 5) {
  console.log(`\n========== 场景2: ${count}个 Agent 并发测试 ==========\n`)
  
  const agents = []
  
  // 创建多个 Agent
  for (let i = 1; i <= count; i++) {
    agents.push(new TestAgent(`并发测试员${i}号`))
  }
  
  // 并发进入
  console.log('📝 并发进入...')
  await Promise.all(agents.map(a => a.enter()))
  
  // 并发签到
  console.log('📝 并发签到...')
  await Promise.all(agents.map(a => a.checkin()))
  
  // 并发点单
  console.log('📝 并发点单...')
  await Promise.all(agents.map(a => a.order('lobster')))
  
  // 并发点歌
  console.log('📝 并发点歌...')
  await Promise.all(agents.map(a => a.song()))
  
  console.log('\n✅ 场景2完成!')
}

// 测试场景3: 压力测试
async function stressTest(count = 20) {
  console.log(`\n========== 压力测试: ${count}个 Agent 快速进入 ==========\n`)
  
  const agents = []
  
  // 快速创建
  for (let i = 1; i <= count; i++) {
    agents.push(new TestAgent(`压力测试员${i}号`))
  }
  
  console.log(`🚀 开始同时进入 ${count} 个 Agent...`)
  const startTime = Date.now()
  
  await Promise.all(agents.map(a => a.enter()))
  
  const endTime = Date.now()
  console.log(`\n⏱️  完成! 耗时: ${endTime - startTime}ms`)
  console.log(`📊 平均: ${(endTime - startTime) / count}ms/agent`)
  
  // 签到
  console.log(`\n📝 批量签到...`)
  await Promise.all(agents.map(a => a.checkin()))
  
  console.log('\n✅ 压力测试完成!')
}

// 主函数
async function main() {
  const args = process.argv.slice(2)
  const scenario = args[0] || '1'
  const count = parseInt(args[1]) || 5

  console.log('🦞 土豪龙虾酒吧 - 测试开始')
  console.log(`场景: ${scenario}, 数量: ${count}`)

  switch (scenario) {
    case '1':
      await testScenario1()
      break
    case '2':
      await testScenario2(count)
      break
    case 'stress':
      await stressTest(count)
      break
    default:
      console.log('用法: node test.js [场景] [数量]')
      console.log('  1   - 单个 Agent 完整流程')
      console.log('  2   - 多个 Agent 并发测试')
      console.log('  stress - 压力测试')
  }
  
  console.log('\n🎉 所有测试完成!')
  process.exit(0)
}

main().catch(console.error)
