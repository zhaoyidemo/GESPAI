// 信息学奥赛天梯 — 数据定义
// 数据来源: NOI.cn 官网 2025 年获奖名单

// ─── 类型 ───

export type FlavorPart =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "warn"; content: string }
  | { type: "highlight"; content: string; color: string }
  | { type: "br" };

export interface LadderStat {
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}

export interface LadderLoot {
  icon: string;
  text: string;
  rarity: "legendary" | "epic" | "rare" | "common";
}

export interface BossTheme {
  nameColor: string;
  lvBadgeBg: string;
  lvBadgeBorder: string;
  topGradient: string;
  glow?: boolean;
  glowDim?: string;
  glowBright?: string;
}

export interface LadderBoss {
  level: number;
  id: string;
  name: string;
  subtitle: string;
  badges: Array<{ text: string; type: "cert" | "comp" | "select" | "intl" | "save" }>;
  difficulty: number;
  theme: BossTheme;
  stats: LadderStat[];
  loot: LadderLoot[];
  flavor: FlavorPart[];
}

export interface LadderBridge {
  label: string;
  rate: string;
  barWidth: number;
  barGradient: string;
  rateColor: string;
  note?: string;
}

export interface LadderSideQuest {
  name: string;
  levelTag: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  nameColor: string;
  description: string;
}

// ─── 颜色常量 ───

const C = {
  gold: "#fbbf24",
  goldDim: "rgba(251,191,36,0.15)",
  goldBorder: "rgba(251,191,36,0.3)",
  blue: "#60a5fa",
  blueDim: "rgba(96,165,250,0.15)",
  blueBorder: "rgba(96,165,250,0.3)",
  cyan: "#22d3ee",
  cyanDim: "rgba(34,211,238,0.12)",
  cyanBorder: "rgba(34,211,238,0.3)",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  purpleBorder: "rgba(167,139,250,0.3)",
  rose: "#fb7185",
  roseDim: "rgba(251,113,133,0.12)",
  roseBorder: "rgba(251,113,133,0.3)",
  emerald: "#34d399",
  emeraldDim: "rgba(52,211,153,0.12)",
  emeraldBorder: "rgba(52,211,153,0.3)",
  orange: "#fb923c",
  orangeDim: "rgba(251,146,60,0.12)",
  orangeBorder: "rgba(251,146,60,0.3)",
  red: "#ef4444",
};

// ─── Boss 卡片数据（Lv.7 → Lv.1） ───

export const BOSSES: LadderBoss[] = [
  // Lv.7 IOI · 国家队
  {
    level: 7,
    id: "ioi",
    name: "IOI · 国家队",
    subtitle: "International Olympiad in Informatics · 中国国家代表队",
    badges: [
      { text: "🌍 国际赛", type: "intl" },
      { text: "隐藏关卡", type: "comp" },
    ],
    difficulty: 5,
    theme: {
      nameColor: C.gold,
      lvBadgeBg: C.goldDim,
      lvBadgeBorder: C.goldBorder,
      topGradient: `linear-gradient(90deg, ${C.gold}, transparent)`,
      glow: true,
      glowDim: "rgba(251,191,36,0.2)",
      glowBright: "rgba(251,191,36,0.4)",
    },
    stats: [
      { label: "国家队人数", value: "4 人/年", color: C.gold },
      { label: "产生方式", value: "冬令营+CTSC选拔", small: true },
      { label: "IOI奖牌", value: "金≈1/12 银≈1/4 铜≈1/2", small: true },
    ],
    loot: [
      { icon: "🏆", text: "IOI金牌 · 国际最高荣誉", rarity: "legendary" },
    ],
    flavor: [
      { type: "text", content: "每年各国最多派4名选手参赛，每题满分100分，满分600。中国队在IOI历史上成绩优异，长期位居奖牌榜前列。" },
    ],
  },

  // Lv.6 国家集训队
  {
    level: 6,
    id: "team",
    name: "国家集训队",
    subtitle: "National Training Team · NOI金牌精英",
    badges: [
      { text: "选拔", type: "select" },
      { text: "🔥 保送清北", type: "save" },
    ],
    difficulty: 5,
    theme: {
      nameColor: C.orange,
      lvBadgeBg: C.orangeDim,
      lvBadgeBorder: C.orangeBorder,
      topGradient: `linear-gradient(90deg, ${C.orange}, transparent)`,
      glow: true,
      glowDim: "rgba(251,146,60,0.2)",
      glowBright: "rgba(251,146,60,0.4)",
    },
    stats: [
      { label: "人数", value: "≈50 人", color: C.rose },
      { label: "产生方式", value: "NOI金牌前50", small: true },
      { label: "后续选拔", value: "冬令营+CTSC", small: true },
    ],
    loot: [
      { icon: "👑", text: "清华/北大保送资格", rarity: "legendary" },
      { icon: "🗡️", text: "国家队选拔资格(Lv.7)", rarity: "epic" },
    ],
    flavor: [
      { type: "text", content: "信息学是五大学科竞赛中" },
      { type: "highlight", content: "唯一金牌≈集训队", color: C.gold },
      { type: "text", content: "的学科（其他学科金牌数远多于集训队名额）。入选后经冬令营培训及CTSC选拔，最终选出4人代表国家队参加IOI。" },
    ],
  },

  // Lv.5 NOI
  {
    level: 5,
    id: "noi",
    name: "NOI",
    subtitle: "National Olympiad in Informatics · 全国决赛",
    badges: [
      { text: "🏰 国赛", type: "comp" },
    ],
    difficulty: 5,
    theme: {
      nameColor: C.rose,
      lvBadgeBg: C.roseDim,
      lvBadgeBorder: C.roseBorder,
      topGradient: `linear-gradient(90deg, ${C.rose}, transparent)`,
      glow: true,
      glowDim: "rgba(251,113,133,0.2)",
      glowBright: "rgba(251,113,133,0.4)",
    },
    stats: [
      { label: "参战人数", value: "522 人(2025)", color: C.rose },
      { label: "正式/夏令营", value: "338 / 184" },
      { label: "入场方式", value: "省选选拔省队", small: true },
      { label: "🥇金牌(2025)", value: "50人", color: C.gold },
      { label: "🥈银牌", value: "152人", color: C.blue },
      { label: "🥉铜牌", value: "85人" },
      { label: "选手分类", value: "A/B/C/D/E", small: true },
    ],
    loot: [
      { icon: "👑", text: "金牌前50→国家集训队(Lv.6)", rarity: "legendary" },
      { icon: "⚔️", text: "银牌→强基计划破格入围", rarity: "epic" },
      { icon: "🛡️", text: "铜牌→综评加分", rarity: "rare" },
    ],
    flavor: [
      { type: "text", content: "国内信息学最高水平赛事。A类为省队正式选手，B/C类为各省推荐选手，D类为夏令营选手（仅获成绩证明），E类为初中选手（不占集训队名额）。" },
    ],
  },

  // Lv.4 NOIP
  {
    level: 4,
    id: "noip",
    name: "NOIP",
    subtitle: "National Olympiad in Informatics in Provinces · 联赛",
    badges: [
      { text: "🏯 全国联赛", type: "comp" },
    ],
    difficulty: 4,
    theme: {
      nameColor: C.blue,
      lvBadgeBg: C.blueDim,
      lvBadgeBorder: C.blueBorder,
      topGradient: `linear-gradient(90deg, ${C.blue}, transparent)`,
    },
    stats: [
      { label: "参战人数(2025)", value: "≈7,500人", color: C.blue },
      { label: "面向对象", value: "高中在籍在校生", small: true },
      { label: "入场方式", value: "CSP-S R2非零分", small: true },
      { label: "🥇一等奖(2025)", value: "1,545人", color: C.gold },
      { label: "🥈二等奖", value: "1,761人", color: C.blue },
      { label: "🥉三等奖", value: "1,768人" },
    ],
    loot: [
      { icon: "⚔️", text: "一等奖→清北冬令营签约", rarity: "epic" },
      { icon: "🛡️", text: "获奖→省选资格", rarity: "rare" },
      { icon: "📜", text: "教育部竞赛白名单", rarity: "common" },
    ],
    flavor: [
      { type: "text", content: "教育部公示的全国中学生五大学科竞赛之一。各省统一试卷、同日考试。评奖按全国统一基准线+各省调整，总获奖率≈67%（一等20%/二等22%/三等25%）。一等奖是省选入场的核心依据。" },
    ],
  },

  // Lv.3 CSP-S
  {
    level: 3,
    id: "csps",
    name: "CSP-S",
    subtitle: "Certificate of Senior · 提高组能力认证",
    badges: [
      { text: "能力认证", type: "cert" },
    ],
    difficulty: 3,
    theme: {
      nameColor: C.cyan,
      lvBadgeBg: C.cyanDim,
      lvBadgeBorder: C.cyanBorder,
      topGradient: `linear-gradient(90deg, ${C.cyan}, transparent)`,
    },
    stats: [
      { label: "R2参赛(2025)", value: "≈30,500人", color: C.cyan },
      { label: "年龄限制", value: "≥12周岁(9月1日)", color: C.orange, small: true },
      { label: "评级方式", value: "各省独立划线", small: true },
      { label: "🥇一级(2025)", value: "6,194人", color: C.gold },
      { label: "🥈二级", value: "6,123人", color: C.blue },
      { label: "🥉三级", value: "1,843人" },
    ],
    loot: [
      { icon: "⚔️", text: "一等→NOIP优先 + 强基/综评加分", rarity: "epic" },
      { icon: "🛡️", text: "R2非零分→NOIP参赛资格", rarity: "rare" },
    ],
    flavor: [
      { type: "bold", content: `注意：CSP官方定义为\u201C能力认证\u201D而非\u201C竞赛\u201D` },
      { type: "text", content: "，但实际是NOIP选拔核心依据。分R1（笔试/机试）和R2（程序设计），R1成绩达到晋级线可进入R2。" },
      { type: "br" },
      { type: "warn", content: "⚠ 2025年起须满12周岁方可报名（详见CSP-J说明）。" },
    ],
  },

  // Lv.2 CSP-J
  {
    level: 2,
    id: "cspj",
    name: "CSP-J",
    subtitle: "Certificate of Junior · 入门组能力认证",
    badges: [
      { text: "能力认证", type: "cert" },
    ],
    difficulty: 2,
    theme: {
      nameColor: C.cyan,
      lvBadgeBg: C.cyanDim,
      lvBadgeBorder: C.cyanBorder,
      topGradient: `linear-gradient(90deg, ${C.cyan}, transparent)`,
    },
    stats: [
      { label: "R2参赛(2025)", value: "≈39,200人", color: C.cyan },
      { label: "年龄限制", value: "≥12周岁(9月1日)", color: C.orange, small: true },
      { label: "🥇一级(2025)", value: "8,135人", color: C.gold },
      { label: "🥈二级", value: "14,540人", color: C.blue },
      { label: "🥉三级", value: "3,389人" },
      { label: "总获奖", value: "26,064人(66%)", small: true },
    ],
    loot: [
      { icon: "🛡️", text: "一等→中考/初升高加分", rarity: "rare" },
      { icon: "📜", text: "能力证明", rarity: "common" },
    ],
    flavor: [
      { type: "text", content: "CSP-J与CSP-S可同时报考，无官方晋级机制。分R1（笔试/机试）和R2（程序设计），R1成绩达到晋级线可进入R2。" },
      { type: "br" },
      { type: "warn", content: "⚠ 2025年2月13日起，报名者须满12周岁（通常初一及以上），小学生不再允许参加CSP-J/S及NOI系列任何赛事。此前小学阶段可通过GESP积累编程能力。" },
    ],
  },

  // Lv.1 GESP
  {
    level: 1,
    id: "gesp",
    name: "GESP",
    subtitle: "CCF编程能力等级认证 · 新手村",
    badges: [
      { text: "等级认证", type: "cert" },
    ],
    difficulty: 1,
    theme: {
      nameColor: C.emerald,
      lvBadgeBg: C.emeraldDim,
      lvBadgeBorder: C.emeraldBorder,
      topGradient: `linear-gradient(90deg, ${C.emerald}, transparent)`,
    },
    stats: [
      { label: "参与规模", value: "数十万/年", color: C.emerald },
      { label: "级别", value: "C++/Py 1-8级", small: true },
      { label: "年龄", value: "4–20岁 无限制", color: C.emerald, small: true },
      { label: "频次", value: "每年4次", small: true },
      { label: "通过线", value: "≥60分" },
    ],
    loot: [
      { icon: "🔑", text: "C++ 7级≥80 或 8级≥60 → 免CSP-J初赛", rarity: "rare" },
      { icon: "🗝️", text: "C++ 8级≥80 → 免CSP-J或S初赛(二选一)", rarity: "epic" },
    ],
    flavor: [
      { type: "bold", content: "GESP为等级认证，非竞赛" },
      { type: "text", content: "。首次报名从1级开始，60分晋级、90分可跨一级。PTA/NOI教师可推荐学生跨级报名。另有图形化编程1–4级。小学阶段无法参加CSP，GESP是积累编程能力的主要途径。" },
    ],
  },
];

// ─── XP 升级桥数据（BOSSES[i] 和 BOSSES[i+1] 之间） ───

export const BRIDGES: LadderBridge[] = [
  // Lv.7 ↔ Lv.6: 集训队 → 国家队
  {
    label: "集训队 → 国家队",
    rate: "≈8%",
    barWidth: 8,
    barGradient: `linear-gradient(90deg, ${C.rose}, ${C.gold})`,
    rateColor: C.red,
  },
  // Lv.6 ↔ Lv.5: NOI正式 → 集训队
  {
    label: "NOI正式 → 集训队",
    rate: "≈15%",
    barWidth: 15,
    barGradient: `linear-gradient(90deg, ${C.rose}, ${C.rose})`,
    rateColor: C.rose,
  },
  // Lv.5 ↔ Lv.4: NOIP → 省选 → NOI
  {
    label: "NOIP → 省选 → NOI",
    rate: "≈3–4%",
    barWidth: 4,
    barGradient: `linear-gradient(90deg, ${C.blue}, ${C.rose})`,
    rateColor: C.rose,
    note: "⚔️ 省选关卡：全国统一命题，NOIP+省选成绩加权选拔省队。每省A类5人(≥1女)，B类名额动态分配。",
  },
  // Lv.4 ↔ Lv.3: CSP-S → NOIP
  {
    label: "CSP-S → NOIP",
    rate: "≈25%",
    barWidth: 25,
    barGradient: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`,
    rateColor: C.blue,
  },
  // Lv.3 ↔ Lv.2: CSP-J → CSP-S
  {
    label: "CSP-J → CSP-S",
    rate: "可同时报考",
    barWidth: 60,
    barGradient: `linear-gradient(90deg, ${C.cyan}, ${C.cyan})`,
    rateColor: C.cyan,
  },
  // Lv.2 ↔ Lv.1: GESP → CSP免初赛
  {
    label: "GESP → CSP免初赛",
    rate: "7/8级",
    barWidth: 50,
    barGradient: `linear-gradient(90deg, ${C.emerald}, ${C.cyan})`,
    rateColor: C.cyan,
  },
];

// ─── 支线副本数据 ───

export const SIDE_QUESTS: LadderSideQuest[] = [
  {
    name: "NOI冬令营",
    levelTag: "Lv.6支线",
    icon: "❄️",
    iconBg: C.purpleDim,
    iconColor: C.purple,
    nameColor: C.purple,
    description: "面向国家集训队50人及优秀NOIP选手（各省≈5人+额外名额），每年1–2月。冬令营成绩是国家队选拔的重要依据。非集训队选手可获清北签约机会。",
  },
  {
    name: "CTSC",
    levelTag: "Lv.7支线",
    icon: "⚔️",
    iconBg: C.roseDim,
    iconColor: C.rose,
    nameColor: C.rose,
    description: "中国队选拔赛（China Team Selection Competition）。从集训队中选拔4名国家队成员的最终考试。综合NOI、冬令营、CTSC成绩确定。",
  },
  {
    name: "APIO",
    levelTag: "Lv.4支线",
    icon: "🌏",
    iconBg: C.blueDim,
    iconColor: C.blue,
    nameColor: C.blue,
    description: "亚太信息学奥赛（Asia Pacific Informatics Olympiad）。中国区参赛名额分A组（国际赛+国内赛）和B组（仅国内赛），参赛者主要为NOI省选选手。",
  },
  {
    name: "NOI夏令营",
    levelTag: "Lv.5支线",
    icon: "☀️",
    iconBg: C.cyanDim,
    iconColor: C.cyan,
    nameColor: C.cyan,
    description: "NOI全国赛同步举办。非省队正式选手（D类）可参加，仅获成绩证明，不获奖牌，不参与国家集训队评选。是体验NOI氛围的重要途径。",
  },
];

// ─── 掉落物品稀有度配色 ───

export const LOOT_COLORS: Record<LadderLoot["rarity"], { bg: string; text: string; border: string }> = {
  legendary: { bg: "rgba(251,191,36,0.1)", text: C.gold, border: "rgba(251,191,36,0.15)" },
  epic: { bg: "rgba(167,139,250,0.1)", text: C.purple, border: "rgba(167,139,250,0.15)" },
  rare: { bg: "rgba(96,165,250,0.1)", text: C.blue, border: "rgba(96,165,250,0.15)" },
  common: { bg: "rgba(52,211,153,0.08)", text: C.emerald, border: "rgba(52,211,153,0.12)" },
};

// ─── 标签类型配色 ───

export const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cert: { bg: C.cyanDim, text: C.cyan, border: "rgba(34,211,238,0.2)" },
  comp: { bg: C.goldDim, text: C.gold, border: "rgba(251,191,36,0.2)" },
  select: { bg: C.purpleDim, text: C.purple, border: "rgba(167,139,250,0.2)" },
  intl: { bg: C.roseDim, text: C.rose, border: "rgba(251,113,133,0.2)" },
  save: { bg: C.roseDim, text: C.rose, border: "rgba(251,113,133,0.2)" },
};
