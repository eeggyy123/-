export type WorldEchoIcon =
  | 'leaf'
  | 'robot'
  | 'rain'
  | 'mail'
  | 'plane'
  | 'forest'
  | 'ticket'
  | 'flame'
  | 'waves'
  | 'origami'
  | 'flower'
  | 'record'
  | 'feather';

export interface WorldEchoDefinition {
  movieId: string;
  eyebrow: string;
  title: string;
  invitation: string;
  awakenAction: string;
  response: string;
  keepsake: string;
  keepsakeStory: string;
  icon: WorldEchoIcon;
  accent: string;
  glow: string;
}

export const worldEchoDefinitions: WorldEchoDefinition[] = [
  {
    movieId: 'nausicaa', eyebrow: '腐海深处的清水', title: '一粒孢子落下之前，也曾想过要去哪里',
    invitation: '风掀开面罩的一角，地下室的水仍然清澈。把掌心放在玻璃上，等它慢慢落下。', awakenAction: '等一粒孢子落下',
    response: '它没有长成毒林，只在水面留下一个蓝色的圆。原来温柔的环境，也会改变一粒种子的决定。',
    keepsake: '被净水洗过的蓝色孢子', keepsakeStory: '它不会发芽，只在靠近风的时候轻轻发亮。', icon: 'leaf', accent: '#b9e6c7', glow: '#70c9ad',
  },
  {
    movieId: 'castle-in-the-sky', eyebrow: '云层上方的花园', title: '沉睡的机器人，掌心还护着一朵花',
    invitation: '石缝里的苔藓已经爬过它的肩。不要叫醒它，只替它拨开落在指节上的藤叶。', awakenAction: '拨开机器人掌心的藤叶',
    response: '一只很小的飞鸟从掌心飞走，露出一枚长满青苔的齿轮。它一直记得花园仍在运转。',
    keepsake: '长着青苔的小齿轮', keepsakeStory: '转动时没有声音，却会让手册里画下的云缓慢移动。', icon: 'robot', accent: '#c7e5c1', glow: '#8fc5a4',
  },
  {
    movieId: 'my-neighbor-totoro', eyebrow: '雨还没有停的车站', title: '伞沿落下第十二滴雨时，森林眨了一次眼',
    invitation: '站牌旁没有车。把伞稍微往左移一点，给那个看不见的庞然大物留出位置。', awakenAction: '一起等下一班猫巴士',
    response: '远处的树冠依次亮起，像有什么巨大而轻快的东西踏过夜色。一颗橡果滚到了鞋边。',
    keepsake: '听过雨声的橡果', keepsakeStory: '摇一摇，里面不是果仁，而是一小段越来越近的引擎声。', icon: 'rain', accent: '#d8e8ae', glow: '#a7cf78',
  },
  {
    movieId: 'kiki-delivery-service', eyebrow: '海边城市的屋顶', title: '有一封信没有地址，却写着“请交给正在长大的人”',
    invitation: '风把信压在红瓦下面。系好缎带，让它在扫帚后面多飞一会儿，也许地址会自己出现。', awakenAction: '把信系在风里',
    response: '信封飞过钟楼后变得很轻，邮戳上只剩一句话：迷路也属于独自生活的一部分。',
    keepsake: '没有地址的海风邮戳', keepsakeStory: '盖在空白纸上，会浮现今天最想送给自己的那句话。', icon: 'mail', accent: '#f1d1b5', glow: '#de9f83',
  },
  {
    movieId: 'porco-rosso', eyebrow: '亚得里亚海的机库', title: '红色机翼修好以后，还剩下一颗没有用上的铆钉',
    invitation: '菲奥说它不是多余，只是飞机决定把一点重量留给地面。拿起来，听听海风穿过金属的声音。', awakenAction: '轻敲红色机翼',
    response: '机库深处传来很短的一声回响，像一架飞机已经飞远，又像某个人终于愿意回来。',
    keepsake: '带着海盐的红色铆钉', keepsakeStory: '握紧时会变暖，松开后掌心留下一圈落日的颜色。', icon: 'plane', accent: '#f0c5a9', glow: '#d97665',
  },
  {
    movieId: 'princess-mononoke', eyebrow: '山兽神经过之后', title: '森林没有要求原谅，只长出了一片新叶',
    invitation: '把武器留在石头外面，赤脚走进刚刚恢复呼吸的泥土。不要追赶那些白色的小影子。', awakenAction: '把手放在新生的苔藓上',
    response: '一枚鹿蹄印里积起清水。它没有回答谁对谁错，只映出头顶同时存在的烟与树。',
    keepsake: '盛过晨光的鹿蹄印石', keepsakeStory: '两面颜色不同，却无论怎样翻转都保持同样的重量。', icon: 'forest', accent: '#c4d6aa', glow: '#7fa47d',
  },
  {
    movieId: 'spirited-away', eyebrow: '第六站台之后', title: '车票背面，慢慢浮出了你没有忘记的名字',
    invitation: '列车员没有来检票。对着窗上的倒影，在雾气里写下一个只有自己知道的称呼。', awakenAction: '在车窗上写下名字',
    response: '水面上的灯一盏盏退后，字迹却没有消失。它缩成一张更小的票，停在窗框边。',
    keepsake: '写着真名的半张车票', keepsakeStory: '另一半仍在列车上，所以无论走多远，它都知道回去的方向。', icon: 'ticket', accent: '#bce0e6', glow: '#79bdca',
  },
  {
    movieId: 'howls-moving-castle', eyebrow: '壁炉里最小的一点火', title: '卡西法打了个喷嚏，一颗星火掉进冷掉的茶杯',
    invitation: '它嘴上说不需要帮忙。还是把木柴往里面推一点，但别让苏菲看见桌角那块焦痕。', awakenAction: '替卡西法添一根木柴',
    response: '火焰一下蹿高，又故意装作什么也没发生。茶杯里多了一粒不会烫手的星星。',
    keepsake: '装在茶杯里的小星火', keepsakeStory: '夜里打开手册，它会替所有还没写完的句子照明。', icon: 'flame', accent: '#f7d795', glow: '#ef9c5b',
  },
  {
    movieId: 'ponyo', eyebrow: '潮水退去的窗台', title: '玻璃瓶里装着一朵没有回到海里的浪花',
    invitation: '宗介把瓶盖留得很松。靠近一点，让它听见屋子里早餐和笑声的声音。', awakenAction: '对瓶口轻轻呼一口气',
    response: '浪花变成一条小鱼绕了三圈，又安静下来。瓶底留下了一枚像月牙的透明鳞片。',
    keepsake: '会记住屋灯的透明鱼鳞', keepsakeStory: '靠近水时映出家的窗户，靠近窗时又映出遥远的海。', icon: 'waves', accent: '#bfe8e1', glow: '#68c7c6',
  },
  {
    movieId: 'the-wind-rises', eyebrow: '画满机翼的桌边', title: '一张失败的草图，被风折成了能够飞行的样子',
    invitation: '不要擦掉那些计算错误。沿着铅笔最犹豫的一条线折下去，让纸自己选择机翼。', awakenAction: '折起那条没有完成的线',
    response: '纸没有飞远，只绕过台灯，稳稳落在窗边。失败的线条在逆光里组成了新的弧度。',
    keepsake: '带着橡皮屑的纸机翼', keepsakeStory: '展开是错误的答案，折起来却刚好能穿过一阵风。', icon: 'origami', accent: '#d8e4e2', glow: '#95bfc4',
  },
  {
    movieId: 'only-yesterday', eyebrow: '山形县的黄昏', title: '红花染过的手指，把十岁的自己牵回了田埂',
    invitation: '篮子已经装满。留下一朵最小的红花，不必把今天所有的收成都交给明天。', awakenAction: '把一朵红花夹进旧课本',
    response: '书页合上时，远处驶过一列很慢的火车。童年的自己坐在最后一节车厢里挥了挥手。',
    keepsake: '夹在算术题里的红花', keepsakeStory: '花瓣染红了一个错误答案，却让那一页变得值得留下。', icon: 'flower', accent: '#e8c8b5', glow: '#cc8f7b',
  },
  {
    movieId: 'whisper-of-the-heart', eyebrow: '地球屋打烊以后', title: '唱片转到空白的最后一圈，仍有一句旋律不肯结束',
    invitation: '不要抬起唱针。把窗推开一点，让山坡上的夜风替这首歌补完最后一个小节。', awakenAction: '让唱片再转一圈',
    response: '钟表和小提琴同时慢了一拍。唱片中央落下一枚很薄的铜色音符，像一片秋叶。',
    keepsake: '唱片最后一圈的铜音符', keepsakeStory: '贴近耳边时，能听见写不下去的人重新落笔的声音。', icon: 'record', accent: '#e2c7a3', glow: '#bd936b',
  },
  {
    movieId: 'the-boy-and-the-heron', eyebrow: '塔楼门后的清晨', title: '苍鹭飞走以后，灰羽没有立刻落到地上',
    invitation: '石头已经不需要再垒高。伸出手，让那根羽毛自己决定是否留下。', awakenAction: '等灰羽落进掌心',
    response: '它在半空停了很久，最后轻得像一句没有说出口的告别。远处的门在同一刻安静合上。',
    keepsake: '选择留下的灰色羽毛', keepsakeStory: '它不指向另一个世界，只在你准备继续生活时指向前方。', icon: 'feather', accent: '#d5d2d9', glow: '#9d9aae',
  },
];

export const getWorldEcho = (movieId: string) => worldEchoDefinitions.find((echo) => echo.movieId === movieId);
