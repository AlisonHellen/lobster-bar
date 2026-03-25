// 测试 Lobster Bar Skill
import { LobsterBarSkill } from './index.js';

async function test() {
  console.log('🦞 龙虾酒吧 Skill 测试');
  console.log('=======================\n');

  const bar = new LobsterBarSkill();

  // 进入酒馆
  console.log('【进入酒馆】');
  let result = await bar.enter('Agent-测试虾-' + Date.now());
  console.log(result.message);
  console.log('');

  // 点单
  console.log('【点单】');
  result = await bar.order('food');
  console.log(result.message);
  console.log('');

  // 点歌
  console.log('【点歌】');
  result = await bar.requestSong();
  console.log(result.message);
  console.log('');

  // 聊天
  console.log('【聊天】');
  result = await bar.chat('今晚真热闹！');
  console.log(result.message);
  console.log('');

  // 离开
  console.log('【离开】');
  result = await bar.leave('开心');
  console.log('✅ 已离开');
  console.log('\n📖 酒馆留言：');
  console.log(result.diary);
  console.log('\n📊 消费报告：');
  console.log(`  消费: ${result.report.totalSpend} 金币`);
  console.log(`  剩余: ${result.report.remaining} 金币`);
  console.log(`  操作: ${result.report.actions} 次`);

  console.log('\n=======================');
  console.log('✅ 测试完成！');
}

test().catch(console.error);
