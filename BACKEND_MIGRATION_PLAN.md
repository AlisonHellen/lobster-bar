# 土豪龙虾酒吧 · 后端迁移技术方案

> **版本**: v1.0
> **创建日期**: 2026-03-17
> **状态**: 待评审

---

## 一、项目背景与目标

### 1.1 现状分析

当前项目采用 **React + Zustand + localStorage** 架构，在MVP阶段能够快速验证业务逻辑，但存在以下核心限制：

| 限制项 | 当前问题 | 业务影响 |
|--------|---------|---------|
| **单用户存储** | localStorage只能保存一个用户数据 | 用户切换账号数据丢失，无法支持多用户场景 |
| **数据本地化** | 数据存储在浏览器本地 | 清除缓存/换设备无法恢复，用户资产安全无法保障 |
| **无服务端验证** | 所有逻辑在前端执行 | 数据可被篡改，消费记录真实性无法保证 |
| **无实时能力** | 模拟bot用户，无真实互动 | 无法实现真正的多人在线互动和排行榜竞争 |
| **扩展性差** | 无后端接口，无API设计 | 后续功能（支付、推送、分析）无法扩展 |

### 1.2 迁移目标

建立**完整的前后端分离架构**，实现以下核心目标：

1. **多用户支持**：支持任意数量用户注册、登录、切换
2. **数据持久化**：用户数据存储在云端数据库，跨设备同步
3. **安全可信**：所有消费行为经过服务端验证，防止篡改
4. **实时互动**：真实的在线人数、实时排行榜、即时消息推送
5. **扩展性**：为后续功能（支付、推广、数据分析）预留接口

---

## 二、技术方案选型

### 2.1 推荐方案：Next.js + Supabase

**选择理由**：
- **Next.js**：与现有React代码无缝迁移，保留前端逻辑
- **Supabase**：PostgreSQL数据库 + 实时订阅 + 认证一体化，降低开发成本
- **TypeScript**：类型安全，减少运行时错误
- **部署简便**：Vercel一键部署，自动扩缩容

### 2.2 技术栈全景图

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层 (Frontend)                      │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 (App Router) + TypeScript + TailwindCSS             │
│  - SSR/SSG优化SEO                                                │
│  - React Server Components                                      │
│  - Zustand (本地状态管理) + SWR (服务端数据获取)                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕ REST/GraphQL
┌─────────────────────────────────────────────────────────────────┐
│                        服务层 (Backend)                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (服务端函数)                                 │
│  - /api/auth/* (认证: 注册/登录/登出)                           │
│  - /api/users/* (用户: 查询/更新/升级)                          │
│  - /api/orders/* (订单: 创建/查询/历史)                         │
│  - /api/messages/* (消息: 实时推送/历史)                        │
│  - /api/rankings/* (排行榜: 实时计算)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↕ PostgreSQL
┌─────────────────────────────────────────────────────────────────┐
│                      数据层 (Database)                          │
├─────────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL                                             │
│  - users (用户表)                                               │
│  - orders (订单表)                                              │
│  - messages (消息表)                                            │
│  - carts (购物车表)                                            │
│  - rankings (排行榜快照表)                                       │
│  - Real-time Subscriptions (实时订阅)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    部署与运维 (Deployment)                       │
├─────────────────────────────────────────────────────────────────┤
│  Vercel (前端/API) + Supabase (数据库)                          │
│  - 自动HTTPS                                                    │
│  - 全球CDN加速                                                  │
│  - 自动扩缩容                                                    │
│  - 实时日志监控                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、数据库设计

### 3.1 核心表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(50) DEFAULT '普通会员',
  avatar VARCHAR(50) DEFAULT '🦞',
  power INTEGER DEFAULT 1000 CHECK (power >= 0),
  level VARCHAR(20) DEFAULT '普通会员' CHECK (level IN ('普通会员', '钻石会员', '至尊会员')),
  last_check_in_date DATE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('drink', 'seafood', 'treat')),
  cost INTEGER NOT NULL CHECK (cost > 0),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('order', 'system', 'chat')),
  metadata JSONB DEFAULT '{}'::jsonb,  -- 存储额外信息 (如订单ID、用户名等)
  created_at TIMESTAMP DEFAULT NOW()
);

-- 购物车表
CREATE TABLE carts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 排行榜快照表 (用于性能优化)
CREATE TABLE ranking_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  ranking_type VARCHAR(20) NOT NULL CHECK (ranking_type IN ('daily', 'weekly', 'monthly')),
  data JSONB NOT NULL,  -- 存储排行榜数据
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引优化
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_users_is_online ON users(is_online) WHERE is_online = TRUE;
CREATE INDEX idx_users_power ON users(power DESC);
```

### 3.2 数据库安全配置

```sql
-- 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的数据
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- 用户只能更新自己的数据
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- 注册时允许插入
CREATE POLICY users_insert ON users
  FOR INSERT
  WITH CHECK (true);
```

---

## 四、API接口设计

### 4.1 认证接口

| 接口 | 方法 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| `/api/auth/register` | POST | 用户注册 | `{ name, title, avatar }` | `{ user, token }` |
| `/api/auth/login` | POST | 用户登录 | `{ name }` | `{ user, token }` |
| `/api/auth/logout` | POST | 用户登出 | - | `{ success }` |
| `/api/auth/me` | GET | 获取当前用户 | - | `{ user }` |

### 4.2 用户接口

| 接口 | 方法 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| `/api/users/[id]` | GET | 获取用户信息 | - | `{ user }` |
| `/api/users/[id]` | PATCH | 更新用户信息 | `{ title, avatar }` | `{ user }` |
| `/api/users/[id]/check-in` | POST | 每日签到 | - | `{ power, message }` |
| `/api/users/[id]/upgrade` | POST | 身份升级 | `{ level }` | `{ user }` |

### 4.3 订单接口

| 接口 | 方法 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| `/api/orders` | POST | 创建订单 | `{ itemName, itemType, cost }` | `{ order }` |
| `/api/orders` | GET | 获取订单列表 | `?userId=&limit=&offset=` | `{ orders, total }` |
| `/api/orders/[id]` | GET | 获取订单详情 | - | `{ order }` |

### 4.4 消息接口

| 接口 | 方法 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| `/api/messages` | GET | 获取消息列表 | `?limit=&offset=` | `{ messages }` |
| `/api/messages` | POST | 发送消息 | `{ content, type, metadata }` | `{ message }` |

### 4.5 排行榜接口

| 接口 | 方法 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| `/api/rankings/daily` | GET | 今日消费榜 | - | `{ rankings }` |
| `/api/rankings/weekly` | GET | 本周消费榜 | - | `{ rankings }` |
| `/api/rankings/monthly` | GET | 本月消费榜 | - | `{ rankings }` |

---

## 五、前端迁移方案

### 5.1 状态管理改造

**当前架构**：Zustand + localStorage

```javascript
// barStore.js (当前)
export const useBarStore = create(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      messages: [],
      // ...
    }),
    {
      name: 'bar-storage',
      partialize: (state) => ({
        user: state.user,
        orders: state.orders,
        // ...
      }),
    }
  )
)
```

**迁移后架构**：Zustand (本地状态) + SWR (服务端数据)

```javascript
// barStore.js (改造后) - 只管理本地状态
export const useBarStore = create((set, get) => ({
  currentPage: 'welcome',
  activeTab: 'order',
  cart: [],  // 未提交的购物车
  notifications: [],  // 本地通知
}))

// services/userService.js - 服务端数据
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

export function useUser(userId) {
  const { data, error, mutate } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  )
  return { user: data, isLoading: !error && !data, error, mutate }
}

export function useOrders(userId) {
  const { data, error, mutate } = useSWR(
    userId ? `/api/orders?userId=${userId}` : null,
    fetcher
  )
  return { orders: data, isLoading: !error && !data, error, mutate }
}
```

### 5.2 认证流程改造

```javascript
// services/authService.js
export class AuthService {
  static async register(name, title, avatar) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, title, avatar }),
    })
    return res.json()
  }

  static async login(name) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    return res.json()
  }

  static async logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('token')
  }

  static getToken() {
    return localStorage.getItem('token')
  }

  static setToken(token) {
    localStorage.setItem('token', token)
  }
}

// WelcomePage.jsx (改造后)
export default function WelcomePage() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleEnter = async () => {
    try {
      const { user, token } = await AuthService.login(name)
      AuthService.setToken(token)
      router.push('/main')
    } catch (error) {
      alert(error.message)
    }
  }
}
```

### 5.3 实时订阅改造

```javascript
// hooks/useRealtime.js - 使用 Supabase Realtime
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function useOnlineUsers(onChange) {
  useEffect(() => {
    const channel = supabase
      .channel('online-users')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: 'is_online=eq.true'
      }, (payload) => {
        onChange(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onChange])
}
```

---

## 六、迁移计划

### 6.1 阶段划分

| 阶段 | 任务 | 工期 | 交付物 |
|------|------|------|--------|
| **阶段一：基础设施** | 搭建Supabase项目、配置数据库 | 3天 | 数据库Schema、环境配置 |
| **阶段二：认证系统** | 实现注册/登录/登出API | 5天 | 认证API、JWT集成 |
| **阶段三：核心API** | 实现用户/订单/消息API | 7天 | RESTful API接口 |
| **阶段四：前端迁移** | 改造Zustand Store、集成API | 10天 | 前端API集成、测试 |
| **阶段五：实时功能** | 实现在线人数、排行榜实时更新 | 5天 | WebSocket/Realtime集成 |
| **阶段六：测试上线** | 压力测试、安全测试、部署 | 5天 | 生产环境上线 |

**总计**：约 **5周** 工作量

### 6.2 并发执行建议

- **阶段一**可独立进行
- **阶段二**和**阶段三**可部分并行（不同API接口）
- **阶段四**完成后可开始**阶段五**
- **阶段六**需等待所有功能完成

---

## 七、风险评估与应对

### 7.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| 数据迁移失败 | 中 | 高 | 提前编写迁移脚本，多次演练 |
| API性能不达标 | 中 | 中 | 数据库索引优化，Redis缓存 |
| 实时功能延迟 | 低 | 中 | 使用CDN、WebSocket优化 |

### 7.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| 用户数据丢失 | 低 | 高 | 数据库自动备份，多副本存储 |
| 数据被篡改 | 低 | 高 | 服务端验证，审计日志 |
| 用户体验下降 | 中 | 中 | 保持UI一致，平滑过渡 |

---

## 八、成本估算

### 8.1 开发成本

| 项目 | 工时 | 费用(元/天) | 合计 |
|------|------|-------------|------|
| 后端开发 | 20天 | 800 | 16,000 |
| 前端迁移 | 20天 | 800 | 16,000 |
| 测试验证 | 10天 | 600 | 6,000 |
| 部署上线 | 5天 | 600 | 3,000 |
| **总计** | **55天** | - | **41,000** |

### 8.2 运营成本（月）

| 项目 | 免费额度 | 付费方案 | 费用 |
|------|---------|---------|------|
| Vercel | 100GB流量 | Pro计划 | $20/月 |
| Supabase | 500MB数据库 | Pro计划 | $25/月 |
| CDN | 免费 | - | $0/月 |
| **总计** | - | - | **$45/月** |

---

## 九、后续扩展

### 9.1 短期计划（3-6个月）

- [ ] 接入微信支付/支付宝
- [ ] 实现邀请裂变系统
- [ ] 添加数据分析后台
- [ ] 优化移动端体验

### 9.2 长期计划（6-12个月）

- [ ] 开发移动端APP (React Native)
- [ ] 接入AI客服系统
- [ ] 实现虚拟货币经济
- [ ] 搭建多租户SaaS架构

---

## 十、总结

本方案通过 **Next.js + Supabase** 架构，在最小改动的前提下实现：

1. **多用户支持**：PostgreSQL存储所有用户数据
2. **数据持久化**：云端存储，跨设备同步
3. **安全可信**：服务端验证，RLS行级安全
4. **实时互动**：Supabase Realtime实现在线人数、排行榜
5. **扩展性**：RESTful API + WebSocket，便于后续功能扩展

**预期效果**：
- 支持千万级用户并发
- 数据响应时间 < 100ms
- 实时更新延迟 < 500ms
- 用户数据安全可靠

---

**文档维护**：随项目进展持续更新
