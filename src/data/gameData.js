// ===== MENU DATA =====
export const MENU_CATEGORIES = [
  {
    id: 'lobster',
    name: '🦞 龙虾专区',
    emoji: '🦞',
    desc: '帝王级海鲜，专属土豪',
    items: [
      { id: 'l1', name: '至尊帝王蟹龙虾', desc: '1.5kg+进口波士顿龙虾，蒜蓉秘制', cost: 100, unit: '/份', img: '🦞', badge: '镇店之宝', hot: true,  category: 'lobster' },
      { id: 'l2', name: '黄金焗龙虾',     desc: '整只澳龙，黄油焗制，入口即化',   cost: 50,  unit: '/份', img: '🦀', badge: '招牌',    hot: true,  category: 'lobster' },
      { id: 'l3', name: '帝王蒜香虾',     desc: '新鲜大虎虾，蒜香爆炒',           cost: 30,  unit: '/盘', img: '🍤',                  hot: false, category: 'lobster' },
      { id: 'l4', name: '十三香小龙虾',   desc: '现炒现做，麻辣鲜香',             cost: 10,  unit: '/盘', img: '🦐',                  hot: false, category: 'lobster' },
      { id: 'l5', name: '鱼子酱刺身拼盘', desc: '顶级鱼子酱配时令刺身',           cost: 80,  unit: '/拼', img: '🍣', badge: 'VIP专属', hot: true,  category: 'lobster' },
    ]
  },
  {
    id: 'liquor',
    name: '🍾 洋酒专区',
    emoji: '🍾',
    desc: '顶级洋酒，彰显品味',
    items: [
      { id: 'w1', name: '82年拉菲红酒',     desc: '法国波尔多，酒王之王',         cost: 88, unit: '/瓶', img: '🍷', badge: '顶级',    hot: true,  category: 'liquor' },
      { id: 'w2', name: '轩尼诗XO',         desc: '法国干邑白兰地，富贵之选',     cost: 66, unit: '/瓶', img: '🥃', badge: '爆款',    hot: true,  category: 'liquor' },
      { id: 'w3', name: '麦卡伦18年单麦芽', desc: '苏格兰高地威士忌，年份珍藏',   cost: 55, unit: '/瓶', img: '🥃',                  hot: true,  category: 'liquor' },
      { id: 'w4', name: '普通威士忌',       desc: '调和威士忌，爽饮之选',         cost: 15, unit: '/杯', img: '🥛',                  hot: false, category: 'liquor' },
      { id: 'w5', name: '特调马天尼',       desc: '经典鸡尾酒，调酒师秘方',       cost: 20, unit: '/杯', img: '🍸',                  hot: false, category: 'liquor' },
      { id: 'w6', name: '起泡香槟',         desc: '庆功专属，气泡活跃',           cost: 38, unit: '/瓶', img: '🍾', badge: '庆功首选', hot: false, category: 'liquor' },
    ]
  },
  {
    id: 'drinks',
    name: '🍹 高端饮品',
    emoji: '🍹',
    desc: '特调好饮，不输洋酒',
    items: [
      { id: 'd1', name: '鱼子酱果汁',     desc: '顶级鱼子酱提香，限量供应', cost: 8,  unit: '/杯', img: '🫧', badge: '限量', hot: false, category: 'drinks' },
      { id: 'd2', name: '土豪特调鸡尾酒', desc: '金箔点缀，入口香甜',       cost: 12, unit: '/杯', img: '🍹', badge: '招牌', hot: true,  category: 'drinks' },
      { id: 'd3', name: '黄金柠檬水',     desc: '真金箔装饰，土豪专属',     cost: 18, unit: '/杯', img: '🍋',               hot: false, category: 'drinks' },
      { id: 'd4', name: '冰酿乌龙茶',     desc: '顶级茶底，清醒必备',       cost: 5,  unit: '/壶', img: '🍵',               hot: false, category: 'drinks' },
    ]
  },
]

// ===== SONGS DATA =====
export const SONG_CATEGORIES = [
  {
    id: 'pop', name: '流行热歌', emoji: '🎵',
    songs: [
      { id: 'p1', title: '浮夸', singer: '陈奕迅', type: 'vip', cost: 15 },
      { id: 'p2', title: '富士山下', singer: '陈奕迅', type: 'normal', cost: 5 },
      { id: 'p3', title: '光年之外', singer: 'G.E.M.邓紫棋', type: 'vip', cost: 15 },
      { id: 'p4', title: '告白气球', singer: '周杰伦', type: 'top', cost: 30 },
      { id: 'p5', title: '七里香', singer: '周杰伦', type: 'normal', cost: 5 },
      { id: 'p6', title: '爱在西元前', singer: '周杰伦', type: 'normal', cost: 5 },
      { id: 'p7', title: '泡沫', singer: 'G.E.M.邓紫棋', type: 'vip', cost: 15 },
      { id: 'p8', title: '突然好想你', singer: '五月天', type: 'normal', cost: 5 },
    ]
  },
  {
    id: 'classic', name: '经典老歌', emoji: '🎸',
    songs: [
      { id: 'c1', title: '一无所有', singer: '崔健', type: 'normal', cost: 5 },
      { id: 'c2', title: '光辉岁月', singer: 'Beyond', type: 'vip', cost: 15 },
      { id: 'c3', title: '海阔天空', singer: 'Beyond', type: 'top', cost: 30 },
      { id: 'c4', title: '倒数', singer: '容祖儿', type: 'normal', cost: 5 },
      { id: 'c5', title: '明天会更好', singer: '群星', type: 'vip', cost: 15 },
      { id: 'c6', title: '千千阙歌', singer: '陈慧娴', type: 'normal', cost: 5 },
    ]
  },
  {
    id: 'rock', name: '摇滚嗨歌', emoji: '🤘',
    songs: [
      { id: 'r1', title: '夜空中最亮的星', singer: '逃跑计划', type: 'normal', cost: 5 },
      { id: 'r2', title: '老男孩', singer: '筷子兄弟', type: 'normal', cost: 5 },
      { id: 'r3', title: '晚星', singer: '邓丽君', type: 'vip', cost: 15 },
      { id: 'r4', title: '滚滚红尘', singer: '陈淑桦', type: 'vip', cost: 15 },
    ]
  },
  {
    id: 'hiphop', name: '嘻哈土豪', emoji: '💎',
    songs: [
      { id: 'h1', title: 'Money', singer: 'Lisa', type: 'top', cost: 30 },
      { id: 'h2', title: 'FOMO', singer: '热狗', type: 'vip', cost: 15 },
      { id: 'h3', title: '玩命', singer: 'MC HotDog', type: 'normal', cost: 5 },
      { id: 'h4', title: 'Rapgod土豪版', singer: '原创', type: 'top', cost: 30 },
    ]
  },
]

// ===== TREAT ITEMS =====
export const TREAT_ITEMS = [
  { id: 't1', name: '至尊帝王蟹龙虾', emoji: '🦞', desc: '每人1份，帝王级享受', cost: 100, category: 'food' },
  { id: 't2', name: '黄金焗龙虾', emoji: '🦀', desc: '每人1份，澳龙盛宴', cost: 50, category: 'food' },
  { id: 't3', name: '十三香小龙虾', emoji: '🦐', desc: '每人1盘，麻辣鲜香', cost: 10, category: 'food' },
  { id: 't4', name: '82年拉菲', emoji: '🍷', desc: '每人1瓶，法国酒王', cost: 88, category: 'drink' },
  { id: 't5', name: '轩尼诗XO', emoji: '🥃', desc: '每人1杯，干邑臻品', cost: 66, category: 'drink' },
  { id: 't6', name: '普通威士忌', emoji: '🥛', desc: '每人1杯，爽饮干杯', cost: 15, category: 'drink' },
  { id: 't7', name: '土豪特调鸡尾酒', emoji: '🍹', desc: '每人1杯，专属调制', cost: 12, category: 'drink' },
  { id: 't8', name: '起泡香槟', emoji: '🍾', desc: '每人1瓶，庆功必备', cost: 38, category: 'drink' },
]

export const TITLE_OPTIONS = [
  { id: 'normal', label: '普通土豪', desc: '初始500金币，开启土豪之路', power: 500, color: '#C9A84C', icon: '🦞' },
  { id: 'diamond', label: '钻石土豪', desc: '初始1000金币，贵族专属待遇', power: 1000, color: '#B4D4FF', icon: '💎' },
  { id: 'supreme', label: '至尊土豪', desc: '初始2000金币，至高无上身份', power: 2000, color: '#FF2D55', icon: '👑' },
]

export const AVATAR_OPTIONS = ['🦞', '👑', '💎', '🥂', '💰', '🎰', '🦀', '🍾', '🤑', '😎', '🎩', '💍']
