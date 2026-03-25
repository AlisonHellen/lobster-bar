const { createClient } = require('@supabase/supabase-js')

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

module.exports = { supabase, getLevel }
