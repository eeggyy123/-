export type DiscoveryId =
  | 'first-breeze'
  | 'paper-plane'
  | 'scarlet-wing'
  | 'sky-letter'
  | 'moving-door'
  | 'water-rail-ticket'
  | 'return-thread'
  | 'crosswind-station';

export interface JourneyDiscovery {
  id: DiscoveryId;
  name: string;
  description: string;
  hint: string;
}

export const journeyDiscoveries: JourneyDiscovery[] = [
  {
    id: 'first-breeze',
    name: '第一阵风',
    description: '你让久石让的旋律第一次在这个世界响起。',
    hint: '有些旅程，要从一段旋律开始。',
  },
  {
    id: 'paper-plane',
    name: '未寄出的纸飞机',
    description: '它从二郎的桌边起飞，正朝亚得里亚海而去。',
    hint: '听说《起风了》的云层里，藏着一封没有地址的信。',
  },
  {
    id: 'scarlet-wing',
    name: '亚得里亚海的红翼',
    description: '波鲁克替纸飞机找到了更高的风。',
    hint: '红色水上飞机知道通往天空城的航线。',
  },
  {
    id: 'sky-letter',
    name: '天空来信',
    description: '纸飞机终于抵达云层之上，旅程也有了回音。',
    hint: '云海尽头，有一座城仍在等待来信。',
  },
  {
    id: 'moving-door',
    name: '会移动的门',
    description: '你拨动了城堡门的颜色，四个世界从此有了彼此的地址。',
    hint: '哈尔的门把手旁，似乎还留着几种没有被选择的颜色。',
  },
  {
    id: 'water-rail-ticket',
    name: '水上列车车票',
    description: '车票没有写终点，窗外倒映着你尚未抵达的回忆。',
    hint: '汤屋远处的铁轨，只在水面安静下来时出现。',
  },
  {
    id: 'return-thread',
    name: '世界背面的门',
    description: '你第一次沿着来路返回，发现每个世界都悄悄保留着另一侧的门把手。',
    hint: '抵达并不是结束。试着在另一个世界寻找回去的方向。',
  },
  {
    id: 'crosswind-station',
    name: '没有时刻表的中转站',
    description: '三种来路在星图中央交汇。从此，风也可以替你决定下一站。',
    hint: '纸飞机、移动的门与水上列车，似乎正在把三枚印记带向同一个地方。',
  },
];

export const windRouteMovieIds = [
  'the-wind-rises',
  'porco-rosso',
  'castle-in-the-sky',
] as const;

export const windRouteDiscoveryIds: DiscoveryId[] = [
  'paper-plane',
  'scarlet-wing',
  'sky-letter',
];

export const magicDoorDestinations = [
  'my-neighbor-totoro',
  'ponyo',
  'porco-rosso',
  'the-boy-and-the-heron',
] as const;
