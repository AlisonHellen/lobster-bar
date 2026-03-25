import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qytfagijvymipadkllzj.supabase.co'
const supabaseKey = 'sb_publishable_-ln3M7-QhuJp325uSQeGTQ_lraT_l2s'
const supabase = createClient(supabaseUrl, supabaseKey)

const LEVELS = [
  { level: 0, min: 0, label: '路人', icon: '👤' },
  { level: 1, min: 500, label: '普通土豪', icon: '🦞' },
  { level: 2, min: 2000, label: '白银土豪', icon: '🥈' },
  { level: 3, min: 5000, label: '黄金土豪', icon: '🥇' },
  { level: 4, min: 10000, label: '钻石土豪', icon: '💎' },
  { level: 5, min: 20000, label: '皇冠土豪', icon: '👑' },
]

function getLevel(total) {
  let l = LEVELS[0]
  for (const t of LEVELS) if (total >= t.min) l = t
  return l
}

const MENU = {
  lobster: [
    { name: '至尊帝王蟹龙虾', cost: 100 },
    { name: '黄金焗龙虾', cost: 50 },
    { name: '帝王蒜香虾', cost: 30 },
    { name: '十三香小龙虾', cost: 10 },
  ],
  liquor: [
    { name: '82年拉菲', cost: 88 },
    { name: '轩尼诗XO', cost: 66 },
    { name: '麦卡伦18年单麦芽', cost: 55 },
    { name: '普通威士忌', cost: 15 },
  ],
  drinks: [
    { name: '土豪特调鸡尾酒', cost: 12 },
    { name: '黄金柠檬水', cost: 18 },
    { name: '冰酿乌龙茶', cost: 5 },
  ],
}

const SONGS = [
  { title: '浮夸', singer: '陈奕迅', cost: 15 },
  { title: '富士山下', singer: '陈奕迅', cost: 5 },
  { title: '海阔天空', singer: 'Beyond', cost: 30 },
  { title: '光辉岁月', singer: 'Beyond', cost: 20 },
  { title: '夜曲', singer: '周杰伦', cost: 25 },
  { title: '七里香', singer: '周杰伦', cost: 10 },
]

const TREAT_PACKAGES = [
  { id: 'basic', name: '基础套餐', cost: 188, emoji: '🥃' },
  { id: 'luxury', name: '豪华套餐', cost: 388, emoji: '🍷' },
  { id: 'premium', name: '至尊套餐', cost: 688, emoji: '🍾' },
  { id: 'royal', name: '土豪套餐', cost: 1288, emoji: '👑' },
]

export { supabase, getLevel, MENU, SONGS, TREAT_PACKAGES }
