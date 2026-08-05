export interface MovieQuote {
  text: string;
  english?: string;
}

export const movieQuotes: Record<string, MovieQuote[]> = {
  nausicaa: [
    { text: '生命，是黑暗中闪烁的光。', english: 'Life is the light that twinkles in the dark.' },
    { text: '我们的生命就像风和声音，出生、回响，然后消失。' },
  ],
  'castle-in-the-sky': [
    { text: '大地在向我们每一个人诉说，只要用心倾听，就会明白。', english: 'The Earth speaks to all of us, and if we listen, we can understand.' },
    { text: '我们的孤独就像天空中漂浮的城市，仿佛是一个秘密，却无人诉说。' },
  ],
  'my-neighbor-totoro': [
    { text: '我们一起大笑看看，可怕的东西就会跑光光了。', english: "Let's have a laugh together, and the terrible things will run away." },
    { text: '有些不可思议，只会发生在愿意相信的人身边。' },
  ],
  'kiki-delivery-service': [
    { text: '跟随你的心，保持微笑。', english: 'Just follow your heart, and keep smiling.' },
    { text: '心情好极了，感觉连空气都有一点蓝蓝的了。' },
  ],
  'porco-rosso': [
    { text: '不会飞的猪，只不过是普通的猪。', english: "A pig that doesn't fly is just an ordinary pig." },
    { text: '好人都死在了天上，所以这里没有地狱。' },
  ],
  'princess-mononoke': [
    { text: '命运是任何人都无法改变的，但你可以选择面对它。', english: 'You cannot alter your fate. However, you can rise to meet it.' },
    { text: '我要用没有仇恨的眼睛看清这个世界。' },
  ],
  'spirited-away': [
    { text: '曾经发生过的事不可能忘记，只是暂时想不起来而已。', english: 'Once you meet someone, you never really forget them.' },
    { text: '以后还有很漫长的路，都要一个人走完，要依靠自己的能力。' },
  ],
  'howls-moving-castle': [
    { text: '世界这么大，人生这么长，总会有一个人，让你想要温柔地对待。' },
    { text: '对不起，你一直在等我，而我直到现在才来。' },
  ],
  ponyo: [
    { text: '不可以放开我的手喔。', english: "Don't let go of my hand." },
    { text: '我不知道有多喜欢你，但如果是来见你，我会用跑的。' },
  ],
  'the-wind-rises': [
    { text: '起风了，唯有努力生存。', english: 'The wind is rising. We must try to live.' },
    { text: '飞机是美丽的梦，天空在等待它们。' },
  ],
  'only-yesterday': [
    { text: '阴天、晴天和雨天，你喜欢哪一种？' },
    { text: '原来那些没有答案的童年，一直在陪我们长大。' },
  ],
  'whisper-of-the-heart': [
    { text: '因为你，我愿意成为一个更好的人。' },
    { text: '我早就决定，要这样载着你翻山越岭。' },
  ],
  'the-boy-and-the-heron': [
    { text: '你想活出怎样的人生？', english: 'How do you live?' },
    { text: '即使世界并不完美，也要选择属于自己的那条路。' },
  ],
};
