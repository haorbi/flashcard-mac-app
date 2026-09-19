export const PRESET_DECKS = [
  {
    id: 'preset_cet4',
    name: '大学英语四级高频词',
    icon: 'GraduationCap',
    description: '四级考试核心必背词汇选段',
    isPreset: true,
    cards: [
      {
        id: 'c4_1',
        english: 'abandon',
        phonetic: '/əˈbændən/',
        pos: 'v.',
        chinese: '放弃，抛弃，离弃',
        exampleEn: 'Never abandon your dreams, no matter how hard it gets.',
        exampleZh: '无论变得多困难，都永远不要放弃你的梦想。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c4_2',
        english: 'abundant',
        phonetic: '/əˈbʌndənt/',
        pos: 'adj.',
        chinese: '丰富的，充裕的',
        exampleEn: 'Natural resources are abundant in this region.',
        exampleZh: '该地区的自然资源非常丰富。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c4_3',
        english: 'accumulate',
        phonetic: '/əˈkjuːmjəleɪt/',
        pos: 'v.',
        chinese: '积累，积聚',
        exampleEn: 'Knowledge accumulates step by step through daily reading.',
        exampleZh: '知识是通过每天的阅读一步步积累起来的。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c4_4',
        english: 'perspective',
        phonetic: '/pəˈspektɪv/',
        pos: 'n.',
        chinese: '视角，观点，远景',
        exampleEn: 'Try to see the problem from a fresh perspective.',
        exampleZh: '尝试从一个全新的视角来看待这个问题。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c4_5',
        english: 'resilient',
        phonetic: '/rɪˈzɪliənt/',
        pos: 'adj.',
        chinese: '有强韧适应力的，能迅速恢复的',
        exampleEn: 'Children are remarkably resilient to change.',
        exampleZh: '孩子们对变化的适应能力惊人地强。',
        mastered: false,
        reviewCount: 0
      }
    ]
  },
  {
    id: 'preset_cet6',
    name: '大学英语六级进阶词',
    icon: 'Award',
    description: '六级刷分必备高频核心词汇',
    isPreset: true,
    cards: [
      {
        id: 'c6_1',
        english: 'ambiguous',
        phonetic: '/æmˈbɪɡjuəs/',
        pos: 'adj.',
        chinese: '模棱两可的，含糊不清的',
        exampleEn: 'The wording of the contract was ambiguous.',
        exampleZh: '合同的措辞模棱两可。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c6_2',
        english: 'benevolent',
        phonetic: '/bəˈnevələnt/',
        pos: 'adj.',
        chinese: '仁慈的，慈善的',
        exampleEn: 'A benevolent smile warmed the atmosphere of the room.',
        exampleZh: '一个仁慈的微笑让房间里的气氛变得温暖起来。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c6_3',
        english: 'deteriorate',
        phonetic: '/dɪˈtɪəriəreɪt/',
        pos: 'v.',
        chinese: '恶化，变坏，退化',
        exampleEn: 'The weather condition deteriorated rapidly in the evening.',
        exampleZh: '傍晚时天气状况迅速恶化。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c6_4',
        english: 'inevitable',
        phonetic: '/ɪnˈevɪtəbl/',
        pos: 'adj.',
        chinese: '不可避免的，必然发生的',
        exampleEn: 'Change is an inevitable part of human progress.',
        exampleZh: '变革是人类进步不可避免的一部分。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'c6_5',
        english: 'pragmatic',
        phonetic: '/præɡˈmætɪk/',
        pos: 'adj.',
        chinese: '务实的，讲究实效的',
        exampleEn: 'We need a pragmatic solution to solve the energy crisis.',
        exampleZh: '我们需要一个务实的解决方案来解决能源危机。',
        mastered: false,
        reviewCount: 0
      }
    ]
  },
  {
    id: 'preset_tech',
    name: '程序员 & 科技英语',
    icon: 'Code2',
    description: 'IT 技术、开源软件与开发常用专业词汇',
    isPreset: true,
    cards: [
      {
        id: 't_1',
        english: 'asynchronous',
        phonetic: '/eɪˈsɪŋkrənəs/',
        pos: 'adj.',
        chinese: '异步的（指不按统一时钟节拍运行）',
        exampleEn: 'Asynchronous programming avoids blocking the main UI thread.',
        exampleZh: '异步编程可避免阻塞主 UI 线程。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 't_2',
        english: 'deprecated',
        phonetic: '/ˈdeprəkeɪtɪd/',
        pos: 'adj.',
        chinese: '已废弃的，不建议使用的',
        exampleEn: 'This API method has been deprecated in version 2.0.',
        exampleZh: '该 API 方法在 2.0 版本中已被废弃。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 't_3',
        english: 'idempotent',
        phonetic: '/ˌaɪdɛmˈpoʊtənt/',
        pos: 'adj.',
        chinese: '幂等的（多次执行效果与一次执行相同）',
        exampleEn: 'HTTP GET and PUT methods should be idempotent.',
        exampleZh: 'HTTP GET 和 PUT 方法应当是幂等的。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 't_4',
        english: 'refactor',
        phonetic: '/riːˈfæktər/',
        pos: 'v.',
        chinese: '重构（在不改变外部行为的前提下优化代码）',
        exampleEn: 'We should refactor this module to make it scalable.',
        exampleZh: '我们应当重构这个模块以使其更具扩展性。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 't_5',
        english: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        pos: 'adj.',
        chinese: '无处不在的，普遍存在的',
        exampleEn: 'Cloud computing has become ubiquitous in tech startups.',
        exampleZh: '云计算在科技初创公司中已变得无处不在。',
        mastered: false,
        reviewCount: 0
      }
    ]
  },
  {
    id: 'preset_daily',
    name: '日常高频地道口语',
    icon: 'MessageSquare',
    description: '生活交流、商务对话与地道习惯表达',
    isPreset: true,
    cards: [
      {
        id: 'd_1',
        english: 'hit the nail on the head',
        phonetic: '/hɪt ðə neɪl ɒn ðə hed/',
        pos: 'idiom',
        chinese: '一针见血，说中要害',
        exampleEn: 'Your analysis really hit the nail on the head.',
        exampleZh: '你的分析真是一针见血。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'd_2',
        english: 'play it by ear',
        phonetic: '/pleɪ ɪt baɪ ɪər/',
        pos: 'idiom',
        chinese: '随机应变，走一步看一步',
        exampleEn: 'We don\'t have a fixed plan for tomorrow, let\'s just play it by ear.',
        exampleZh: '我们明天没有固定的计划，到时候随机应变吧。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'd_3',
        english: 'out of the blue',
        phonetic: '/aʊt əv ðə bluː/',
        pos: 'idiom',
        chinese: '出乎意料地，突然地',
        exampleEn: 'She called me yesterday out of the blue.',
        exampleZh: '她昨天出乎意料地给我打了电话。',
        mastered: false,
        reviewCount: 0
      },
      {
        id: 'd_4',
        english: 'under the weather',
        phonetic: '/ˈʌndər ðə ˈweðər/',
        pos: 'idiom',
        chinese: '身体略感不适，有些小不舒服',
        exampleEn: 'I am feeling a bit under the weather today.',
        exampleZh: '我今天感觉身体有点小不舒服。',
        mastered: false,
        reviewCount: 0
      }
    ]
  }
];
