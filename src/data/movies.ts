export interface Movie {
  id: string;
  title: string;
  titleEn: string;
  year: number;
  director: string;
  composer: string;
  cover: string;
  background?: string;
  synopsis: string;
  soundtrack: string;
  soundtrackName: string;
  stills: string[];
  colorTheme: string[];
  trivia: string[];
  recommendations: string[];
  mood: 'adventure' | 'fantasy' | 'romantic' | 'heartwarming' | 'epic' | 'nostalgic';
}

export const movies: Movie[] = [
  {
    id: 'nausicaa',
    title: '风之谷',
    titleEn: 'Nausicaä of the Valley of the Wind',
    year: 1984,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nausicaa%20of%20the%20Valley%20of%20the%20Wind%20anime%20movie%20poster%20with%20princess%20with%20glider%20in%20a%20toxic%20forest%20with%20giant%20insects%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '在一个被"腐海"笼罩的世界里，风之谷的公主娜乌西卡拥有与巨型昆虫交流的能力。她为了保护自己的家园和寻找净化世界的方法，踏上了一段危险的旅程。',
    soundtrack: '/music/nausicaa.mp3',
    soundtrackName: '风之谷',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nausicaa%20anime%20scene%20with%20princess%20flying%20on%20glider%20over%20toxic%20forest%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nausicaa%20anime%20scene%20with%20giant%20ohmu%20insect%20in%20the%20forest%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nausicaa%20anime%20scene%20with%20valley%20of%20wind%20village%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#2ECC71', '#87CEEB', '#E74C3C'],
    trivia: [
      '这部电影是吉卜力工作室成立前制作的，但被认为是吉卜力风格的奠基之作',
      '娜乌西卡的名字来源于荷马史诗《奥德赛》中的公主',
      '宫崎骏亲自绘制了超过80%的背景图',
      '腐海中的巨型昆虫"王虫"的设计灵感来自真实的昆虫'
    ],
    recommendations: ['castle-in-the-sky', 'princess-mononoke', 'spirited-away'],
    mood: 'epic'
  },
  {
    id: 'castle-in-the-sky',
    title: '天空之城',
    titleEn: 'Castle in the Sky',
    year: 1986,
    director: '宫崎骏',
    composer: '久石让',
    cover: '/images/local/天空之城/图片13.webp',
    background: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Castle%20in%20the%20Sky%20anime%20scene%20with%20floating%20islands%20and%20fantasy%20landscape%20Studio%20Ghibli%20watercolor%20style&image_size=landscape_16_9',
    synopsis: '故事讲述了一个名叫巴斯的男孩和一个名叫希达的女孩，为了寻找传说中的天空之城拉普达而展开的冒险。他们必须对抗海盗和军队的追击，同时揭开拉普达的秘密。',
    soundtrack: '/music/castle-in-the-sky.mp3',
    soundtrackName: '天空之城',
    stills: [
      '/images/local/天空之城/图片2.png',
      '/images/local/天空之城/图片3.png',
      '/images/local/天空之城/图片10.webp',
      '/images/local/天空之城/图片12.webp',
      '/images/local/天空之城/图片14.jpg'
    ],
    colorTheme: ['#87CEEB', '#98D8C8', '#2ECC71'],
    trivia: [
      '这是吉卜力工作室的第一部剧场版动画',
      '拉普达的名字来源于英国作家乔纳森·斯威夫特的《格列佛游记》',
      '电影中的机器人守卫成为了吉卜力的象征之一',
      '主题曲《伴随着你》是久石让最著名的作品之一'
    ],
    recommendations: ['nausicaa', 'howls-moving-castle', 'the-boy-and-the-heron'],
    mood: 'adventure'
  },
  {
    id: 'my-neighbor-totoro',
    title: '龙猫',
    titleEn: 'My Neighbor Totoro',
    year: 1988,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=My%20Neighbor%20Totoro%20anime%20movie%20poster%20with%20large%20friendly%20totoro%20spirit%20in%20a%20forest%20with%20bus%20stop%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '在东京附近的乡间，姐妹俩小月和小梅与父亲一起搬到了一座老房子里。她们很快发现了森林中的精灵世界，与巨大的龙猫成为了朋友，并经历了一段奇妙的冒险。',
    soundtrack: '/music/my-neighbor-totoro.mp3',
    soundtrackName: '风的通道',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=My%20Neighbor%20Totoro%20anime%20scene%20with%20totoro%20sleeping%20in%20a%20tree%20with%20fireflies%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=My%20Neighbor%20Totoro%20anime%20scene%20with%20catbus%20running%20through%20forest%20at%20night%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=My%20Neighbor%20Totoro%20anime%20scene%20with%20two%20little%20girls%20in%20a%20sunny%20forest%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      '/images/local/龙猫/图片2.png',
      '/images/local/龙猫/图片1.png'
    ],
    colorTheme: ['#98D8C8', '#2ECC71', '#F7DC6F'],
    trivia: [
      '龙猫的形象成为了吉卜力工作室的官方吉祥物',
      '电影中的猫巴士灵感来自日本的猫形状的公共汽车',
      '影片没有反派角色，展现了人与自然的和谐',
      '宫崎骏说龙猫是他童年想象中森林精灵的化身'
    ],
    recommendations: ['kiki-delivery-service', 'ponyo', 'whisper-of-the-heart'],
    mood: 'heartwarming'
  },
  {
    id: 'kiki-delivery-service',
    title: '魔女宅急便',
    titleEn: "Kiki's Delivery Service",
    year: 1989,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kikis%20Delivery%20Service%20anime%20movie%20poster%20with%20young%20witch%20flying%20on%20broomstick%20with%20black%20cat%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '13岁的魔女琪琪带着黑猫吉吉离开家乡，来到一个海边城市开始独立生活。她开了一家快递公司，用魔法扫帚为居民们送货，在这个过程中逐渐成长。',
    soundtrack: '/music/kiki.mp3',
    soundtrackName: '魔女宅急便',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kikis%20Delivery%20Service%20anime%20scene%20with%20witch%20flying%20over%20coastal%20city%20at%20sunset%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kikis%20Delivery%20Service%20anime%20scene%20with%20little%20witch%20in%20a%20bakery%20shop%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kikis%20Delivery%20Service%20anime%20scene%20with%20black%20cat%20sitting%20on%20a%20window%20sill%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#87CEEB', '#3498DB', '#D4A574'],
    trivia: [
      '琪琪的黑猫吉吉是宫崎骏养的猫的名字',
      '电影中的城市克里克对应真实的瑞典斯德哥尔摩',
      '这是宫崎骏第一部以少女为主角的电影',
      '影片探讨了成长和独立的主题'
    ],
    recommendations: ['my-neighbor-totoro', 'whisper-of-the-heart', 'ponyo'],
    mood: 'heartwarming'
  },
  {
    id: 'porco-rosso',
    title: '红猪',
    titleEn: 'Porco Rosso',
    year: 1992,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Porco%20Rosso%20anime%20movie%20poster%20with%20red%20pig%20fighter%20pilot%20in%20vintage%20airplane%20over%20Mediterranean%20sea%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '在第一次世界大战后的意大利，一名被诅咒变成猪的飞行员波鲁克·罗梭，以赏金猎人的身份在亚得里亚海上空打击空中强盗。他与美丽的飞机设计师菲奥之间产生了一段动人的故事。',
    soundtrack: '/music/summer.mp3',
    soundtrackName: '那个夏天',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Porco%20Rosso%20anime%20scene%20with%20vintage%20seaplane%20flying%20over%20Mediterranean%20sea%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Porco%20Rosso%20anime%20scene%20with%20airplane%20battle%20in%20the%20sky%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Porco%20Rosso%20anime%20scene%20with%20seaside%20town%20and%20airplanes%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#3498DB', '#E74C3C', '#D4A574'],
    trivia: [
      '波鲁克的名字"Porco Rosso"在意大利语中意为"红猪"',
      '这部电影是宫崎骏献给飞行员的情书',
      '影片中的飞机设计基于真实的一战战斗机',
      '红猪的形象反映了宫崎骏对战争的反思'
    ],
    recommendations: ['castle-in-the-sky', 'the-wind-rises', 'nausicaa'],
    mood: 'adventure'
  },
  {
    id: 'princess-mononoke',
    title: '幽灵公主',
    titleEn: 'Princess Mononoke',
    year: 1997,
    director: '宫崎骏',
    composer: '久石让',
    cover: '/images/local/森林公主/图片1.png',
    synopsis: '阿席达卡为了保护村庄，杀死了一只被诅咒的野猪神，自己也中了诅咒。为了寻找解除诅咒的方法，他来到了森林深处，卷入了人类与自然之间的战争，结识了被狼群养大的少女珊。',
    soundtrack: '/music/summer.mp3',
    soundtrackName: '那个夏天',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Princess%20Mononoke%20anime%20scene%20with%20forest%20spirits%20and%20deer%20god%20at%20night%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Princess%20Mononoke%20anime%20scene%20with%20wolf%20girl%20running%20through%20ancient%20forest%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Princess%20Mononoke%20anime%20scene%20with%20giant%20boar%20god%20in%20a%20battle%20scene%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#2ECC71', '#8B4513', '#E74C3C'],
    trivia: [
      '这是吉卜力第一部票房超过100亿日元的电影',
      '珊的名字"Mononoke"在日语中意为"妖怪"',
      '影片探讨了人与自然的冲突和共生',
      '森林之神的形象灵感来自日本神话中的山神'
    ],
    recommendations: ['nausicaa', 'spirited-away', 'the-boy-and-the-heron'],
    mood: 'epic'
  },
  {
    id: 'spirited-away',
    title: '千与千寻',
    titleEn: 'Spirited Away',
    year: 2001,
    director: '宫崎骏',
    composer: '久石让',
    cover: '/images/local/千与千寻/图片3.png',
    background: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Spirited%20Away%20anime%20scene%20with%20Chihiro%20and%20Haku%20flying%20over%20bathhouse%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
    synopsis: '10岁的少女千寻与父母一起搬家，途中误入神灵世界。父母因贪吃变成了猪，千寻必须在汤屋工作来拯救他们。在这个过程中，她经历了成长和蜕变。',
    soundtrack: '/music/spirited-away.mp3',
    soundtrackName: '千与千寻',
    stills: [
      '/images/local/千与千寻/图片4.png',
      '/images/local/千与千寻/图片2.png',
      '/images/local/千与千寻/图片6.png',
      '/images/local/千与千寻/图片1.png',
      '/images/local/千与千寻/图片5.png'
    ],
    colorTheme: ['#D7BDE2', '#F7DC6F', '#E74C3C'],
    trivia: [
      '这是吉卜力最成功的电影，全球票房超过3.5亿美元',
      '无脸男的形象成为了流行文化的经典符号',
      '汤屋的设计灵感来自日本传统温泉旅馆',
      '影片探讨了成长、记忆和身份的主题'
    ],
    recommendations: ['howls-moving-castle', 'princess-mononoke', 'the-boy-and-the-heron'],
    mood: 'fantasy'
  },
  {
    id: 'howls-moving-castle',
    title: '哈尔的移动城堡',
    titleEn: "Howl's Moving Castle",
    year: 2004,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Howls%20Moving%20Castle%20anime%20movie%20poster%20with%20magical%20walking%20castle%20in%20a%20fantasy%20landscape%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '18岁的少女苏菲被荒野女巫变成了90岁的老太婆，她逃离家来到了哈尔的移动城堡。在城堡里，她与哈尔、魔法师马鲁克以及会说话的火焰恶魔卡尔西法一起生活，经历了一段奇幻的冒险。',
    soundtrack: '/music/howls-moving-castle.mp3',
    soundtrackName: '人生的旋转木马',
    stills: [
      '/images/local/哈尔的移动城堡/图片12.jpg',
      '/images/local/哈尔的移动城堡/图片1.png',
      '/images/local/哈尔的移动城堡/图片2.png',
      '/images/local/哈尔的移动城堡/图片4.png',
      '/images/local/哈尔的移动城堡/图片7.png'
    ],
    colorTheme: ['#BB8FCE', '#F7DC6F', '#87CEEB'],
    trivia: [
      '基于英国作家戴安娜·韦恩·琼斯的同名小说改编',
      '哈尔的原型是英国演员大卫·鲍伊',
      '移动城堡的设计融合了多种建筑风格',
      '影片探讨了战争、爱与自我牺牲的主题'
    ],
    recommendations: ['castle-in-the-sky', 'spirited-away', 'nausicaa'],
    mood: 'fantasy'
  },
  {
    id: 'ponyo',
    title: '悬崖上的金鱼姬',
    titleEn: 'Ponyo',
    year: 2008,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ponyo%20anime%20movie%20poster%20with%20little%20goldfish%20girl%20with%20red%20hair%20on%20a%20cliff%20by%20the%20sea%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '金鱼波妞从深海逃到了人类世界，与5岁的小男孩宗介相遇。波妞渴望变成人类，她的父亲魔法师藤本试图将她带回海里。在一场海啸之后，波妞终于实现了变成人类的愿望。',
    soundtrack: '/music/ponyo.mp3',
    soundtrackName: '悬崖上的金鱼姬',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ponyo%20anime%20scene%20with%20goldfish%20girl%20swimming%20in%20clear%20blue%20ocean%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ponyo%20anime%20scene%20with%20little%20boy%20and%20girl%20on%20a%20boat%20in%20a%20storm%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ponyo%20anime%20scene%20with%20underwater%20world%20with%20colorful%20fish%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      '/images/local/悬崖上的金鱼公主/图片14.png',
      '/images/local/悬崖上的金鱼公主/图片15.png',
      '/images/local/悬崖上的金鱼公主/图片13.png'
    ],
    colorTheme: ['#3498DB', '#E74C3C', '#F7DC6F'],
    trivia: [
      '基于宫崎骏的同名漫画改编',
      '波妞的形象灵感来自宫崎骏小时候养的金鱼',
      '影片使用了超过17万张手绘原画',
      '主题曲《悬崖上的金鱼姬》由8岁小女孩演唱'
    ],
    recommendations: ['my-neighbor-totoro', 'kiki-delivery-service', 'whisper-of-the-heart'],
    mood: 'heartwarming'
  },
  {
    id: 'the-wind-rises',
    title: '起风了',
    titleEn: 'The Wind Rises',
    year: 2013,
    director: '宫崎骏',
    composer: '久石让',
    cover: '/images/local/起风了/图片4.png',
    background: '/images/local/起风了/图片1.png',
    synopsis: '影片讲述了日本著名飞机设计师堀越二郎的生平故事。他从小就梦想设计出美丽的飞机，长大后成为了一名航空工程师，设计出了著名的零式战斗机。同时，他与患有肺结核的菜穗子之间也展开了一段凄美动人的爱情故事。',
    soundtrack: '/music/the-wind-rises.flac',
    soundtrackName: '起风了',
    stills: [
      '/images/local/起风了/图片2.png',
      '/images/local/起风了/图片3.png',
      '/images/local/起风了/图片10.png'
    ],
    colorTheme: ['#87CEEB', '#F7DC6F', '#D4A574'],
    trivia: [
      '宫崎骏宣布退休后执导的"最后一部"电影',
      '基于堀越二郎的真实生平故事改编',
      '菜穗子的角色原型是宫崎骏的妻子',
      '影片探讨了梦想与现实的冲突'
    ],
    recommendations: ['porco-rosso', 'only-yesterday', 'the-boy-and-the-heron'],
    mood: 'romantic'
  },
  {
    id: 'only-yesterday',
    title: '岁月的童话',
    titleEn: 'Only Yesterday',
    year: 1991,
    director: '高畑勋',
    composer: '星胜',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Only%20Yesterday%20anime%20movie%20poster%20with%20young%20woman%20in%20countryside%20rice%20fields%20with%20memories%20Studio%20Ghibli%20watercolor%20style&image_size=portrait_4_3',
    synopsis: '27岁的妙子从东京回到故乡山形县探亲，在途中回忆起自己五年级时的点点滴滴。通过这些回忆，她重新审视了自己的人生，并在美丽的乡村中找到了内心的平静与自我认同。',
    soundtrack: '/music/summer.mp3',
    soundtrackName: '那个夏天',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Only%20Yesterday%20anime%20scene%20with%20rice%20fields%20in%20countryside%20with%20golden%20sunset%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Only%20Yesterday%20anime%20scene%20with%20young%20girl%20walking%20in%20country%20road%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Only%20Yesterday%20anime%20scene%20with%20family%20dinner%20in%20traditional%20Japanese%20house%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#98D8C8', '#F7DC6F', '#D4A574'],
    trivia: [
      '这是高畑勋执导的吉卜力经典作品',
      '影片没有奇幻元素，是一部现实主义作品',
      '妙子的回忆片段采用了不同的画风',
      '主题曲《爱花的少年》成为经典'
    ],
    recommendations: ['whisper-of-the-heart', 'my-neighbor-totoro', 'the-wind-rises'],
    mood: 'nostalgic'
  },
  {
    id: 'whisper-of-the-heart',
    title: '侧耳倾听',
    titleEn: 'Whisper of the Heart',
    year: 1995,
    director: '近藤喜文',
    composer: '野见佑二',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Whisper%20of%20the%20Heart%20anime%20movie%20poster%20with%20young%20girl%20reading%20books%20in%20a%20cozy%20bookstore%20with%20sunset%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '月岛雫是一个热爱阅读的女孩，她发现所有自己喜欢的书都被一个名叫"天泽圣司"的人借过。在寻找这个人的过程中，她认识了一只会说话的猫男爵，以及梦想成为小提琴工匠的圣司。',
    soundtrack: '/music/whisper-of-the-heart.mp3',
    soundtrackName: '侧耳倾听',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Whisper%20of%20the%20Heart%20anime%20scene%20with%20girl%20riding%20bicycle%20at%20sunset%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Whisper%20of%20the%20Heart%20anime%20scene%20with%20cat%20baron%20in%20an%20antique%20shop%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Whisper%20of%20the%20Heart%20anime%20scene%20with%20library%20interior%20with%20books%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#F7DC6F', '#87CEEB', '#D4A574'],
    trivia: [
      '这是近藤喜文唯一独立执导的吉卜力电影',
      '猫男爵后来出现在《猫的报恩》中',
      '影片的灵感来自宫崎骏的同名漫画',
      '主题曲《Country Road》成为经典'
    ],
    recommendations: ['my-neighbor-totoro', 'kiki-delivery-service', 'ponyo'],
    mood: 'romantic'
  },
  {
    id: 'the-boy-and-the-heron',
    title: '你想活出怎么样的人生',
    titleEn: 'The Boy and the Heron',
    year: 2023,
    director: '宫崎骏',
    composer: '久石让',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Boy%20and%20the%20Heron%20anime%20movie%20poster%20with%20boy%20and%20talking%20heron%20in%20a%20surreal%20fantasy%20world%20Studio%20Ghibli%20style&image_size=portrait_4_3',
    synopsis: '二战期间，少年真人的母亲在空袭中去世。他被送到乡下的亲戚家，遇见了一只会说话的苍鹭。苍鹭引导他进入了一个奇幻世界，在那里他必须面对自己的悲伤，并寻找活下去的意义。',
    soundtrack: '/music/summer.mp3',
    soundtrackName: '那个夏天',
    stills: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Boy%20and%20the%20Heron%20anime%20scene%20with%20boy%20and%20heron%20flying%20over%20surreal%20landscape%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Boy%20and%20the%20Heron%20anime%20scene%20with%20floating%20buildings%20and%20magical%20world%20Studio%20Ghibli%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Boy%20and%20the%20Heron%20anime%20scene%20with%20fireworks%20and%20beautiful%20sky%20Studio%20Ghibli%20watercolor&image_size=landscape_16_9'
    ],
    colorTheme: ['#D7BDE2', '#87CEEB', '#F7DC6F'],
    trivia: [
      '这是宫崎骏时隔10年再次执导的电影',
      '基于吉野源三郎的同名小说改编',
      '苍鹭的形象由宫崎骏亲自设计',
      '影片探讨了生命、死亡和成长的意义'
    ],
    recommendations: ['spirited-away', 'princess-mononoke', 'nausicaa'],
    mood: 'epic'
  }
];

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};
