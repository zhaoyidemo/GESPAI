/**
 * GESP C++ 4-8级知识点数据
 * 严格按照《GESP C++编程能力等级标准》整理
 */

export interface KnowledgePoint {
  id: string;
  name: string;
  category: string;
  description: string;
  details?: string[];  // 学习要点
}

export interface LevelInfo {
  level: number;
  title: string;
  examTime: number;  // 考试时间（分钟）
  description: string;
  objectives: string;  // 考核目标
  points: KnowledgePoint[];
}

export const gespKnowledgeData: Record<string, LevelInfo> = {
  "4": {
    level: 4,
    title: "C++编程四级",
    examTime: 120,
    description: "掌握指针、二维数组、结构体、函数、递推算法、排序算法",
    objectives: "掌握C++指针类型、二维及多维数组的基本使用。掌握模块化设计思想，具备编写自定义函数程序的能力。掌握文件读写操作，并通过对排序算法、递推法的学习，可以根据不同的使用场景，合理选择最优的算法。",
    points: [
      {
        id: "pointer",
        name: "指针",
        category: "C++基础",
        description: "指针类型的定义、赋值、解引用",
        details: [
          "理解C++指针类型的概念",
          "掌握指针类型变量的定义",
          "掌握指针类型变量的赋值",
          "掌握指针的解引用操作"
        ]
      },
      {
        id: "2d-array",
        name: "二维及多维数组",
        category: "数据结构",
        description: "C++二维及多维数组的定义和使用",
        details: [
          "掌握二维数组的定义和初始化",
          "掌握二维数组元素的访问和遍历",
          "了解多维数组的使用"
        ]
      },
      {
        id: "struct",
        name: "结构体",
        category: "数据结构",
        description: "结构体定义、使用、数组、指针、嵌套",
        details: [
          "掌握结构体的定义和使用",
          "掌握结构体数组的使用",
          "掌握结构体指针的使用",
          "掌握结构体嵌套结构体",
          "掌握结构体做函数参数",
          "掌握结构体中const的使用场景"
        ]
      },
      {
        id: "function",
        name: "函数",
        category: "C++基础",
        description: "函数的声明、定义、调用及参数传递",
        details: [
          "掌握函数的定义、调用、声明",
          "掌握形参与实参的概念及区别",
          "掌握变量作用域（全局与局部）",
          "掌握值传递、引用传递、指针传递"
        ]
      },
      {
        id: "recursion-algo",
        name: "递推算法",
        category: "算法",
        description: "递推算法基本思想及递推关系式",
        details: [
          "掌握递推算法的基本思想",
          "掌握递推关系式的推导",
          "能够使用递推算法解决问题"
        ]
      },
      {
        id: "basic-sorting",
        name: "排序算法",
        category: "算法",
        description: "冒泡排序、插入排序、选择排序",
        details: [
          "了解内排序和外排序的概念及差别",
          "掌握冒泡排序的算法思想和代码实现",
          "掌握插入排序的算法思想和代码实现",
          "掌握选择排序的算法思想和代码实现",
          "理解排序算法的时间复杂度、空间复杂度和稳定性"
        ]
      },
      {
        id: "complexity-basic",
        name: "算法复杂度基础",
        category: "算法",
        description: "简单算法复杂度的估算（多项式、指数）",
        details: [
          "理解时间复杂度的概念",
          "理解空间复杂度的概念",
          "能够估算简单算法的复杂度"
        ]
      },
      {
        id: "file-operation",
        name: "文件操作",
        category: "C++基础",
        description: "文件重定向，读操作、写操作、读写操作",
        details: [
          "掌握文件操作中的重定向",
          "掌握文件的写操作",
          "掌握文件的读操作",
          "掌握文件的读写操作",
          "了解文本文件的分类"
        ]
      },
      {
        id: "exception-handling",
        name: "异常处理",
        category: "C++基础",
        description: "异常处理机制和常用方法",
        details: [
          "了解异常处理机制",
          "掌握异常处理的常用方法"
        ]
      }
    ]
  },
  "5": {
    level: 5,
    title: "C++编程五级",
    examTime: 180,
    description: "掌握初等数论、高精度运算、链表、二分算法、递归、分治、贪心算法",
    objectives: "掌握初等数论知识点，能够使用辗转相除法、埃氏筛法和线性筛法、唯一分解定理等知识解决问题。掌握单链表、双链表、循环链表的基本操作方法。掌握算法复杂度估算方法，熟悉二分法、分治法、贪心算法和递归算法的算法思想，能够根据实际情况选择合适的算法。掌握使用数组模拟高精度运算。",
    points: [
      {
        id: "number-theory",
        name: "初等数论",
        category: "数学",
        description: "素数、GCD/LCM、同余、约数、质因数分解",
        details: [
          "掌握素数与合数的概念",
          "掌握最大公约数与最小公倍数",
          "掌握同余与模运算",
          "掌握约数与倍数",
          "掌握质因数分解",
          "掌握奇偶性判断"
        ]
      },
      {
        id: "euclidean",
        name: "欧几里得算法",
        category: "算法",
        description: "辗转相除法求最大公约数",
        details: [
          "掌握辗转相除法的原理",
          "能够使用欧几里得算法求GCD",
          "理解算法的正确性证明"
        ]
      },
      {
        id: "prime-sieve",
        name: "素数筛法",
        category: "算法",
        description: "埃氏筛法和线性筛法",
        details: [
          "掌握埃氏筛法的原理和实现",
          "掌握线性筛法的原理和实现",
          "理解唯一分解定理"
        ]
      },
      {
        id: "complexity-advanced",
        name: "算法复杂度估算",
        category: "算法",
        description: "含多项式和对数的算法复杂度",
        details: [
          "掌握多项式复杂度的估算",
          "掌握对数复杂度的估算"
        ]
      },
      {
        id: "high-precision",
        name: "高精度运算",
        category: "算法",
        description: "C++数组模拟高精度加减乘除",
        details: [
          "掌握高精度加法",
          "掌握高精度减法",
          "掌握高精度乘法",
          "掌握高精度除法"
        ]
      },
      {
        id: "linked-list",
        name: "链表",
        category: "数据结构",
        description: "单链表、双链表、循环链表的基本操作",
        details: [
          "掌握链表的创建操作",
          "掌握链表的插入操作",
          "掌握链表的删除操作",
          "掌握链表的遍历操作",
          "掌握链表的反转操作",
          "理解单链表、双链表、循环链表的区别"
        ]
      },
      {
        id: "binary-search",
        name: "二分查找",
        category: "算法",
        description: "在有序数组中快速定位目标值",
        details: [
          "掌握二分查找算法的基本原理",
          "能够在有序数组中快速定位目标值"
        ]
      },
      {
        id: "binary-answer",
        name: "二分答案",
        category: "算法",
        description: "二分枚举法",
        details: [
          "掌握二分答案算法的基本原理",
          "能够使用二分答案解决相关问题"
        ]
      },
      {
        id: "recursion",
        name: "递归算法",
        category: "算法",
        description: "递归的原理、时间复杂度分析及优化",
        details: [
          "掌握递归算法的基本原理",
          "能够应用递归解决问题",
          "能够分析递归算法的时间复杂度和空间复杂度",
          "了解递归的优化策略"
        ]
      },
      {
        id: "divide-conquer",
        name: "分治算法",
        category: "算法",
        description: "归并排序和快速排序",
        details: [
          "掌握分治算法的基本原理",
          "掌握归并排序的实现",
          "掌握快速排序的实现"
        ]
      },
      {
        id: "greedy",
        name: "贪心算法",
        category: "算法",
        description: "贪心策略及最优子结构",
        details: [
          "掌握贪心算法的基本原理",
          "理解最优子结构的概念",
          "能够使用贪心算法解决相关问题"
        ]
      }
    ]
  },
  "6": {
    level: 6,
    title: "C++编程六级",
    examTime: 180,
    description: "掌握树、搜索算法(DFS/BFS)、简单动态规划、面向对象、栈和队列",
    objectives: "掌握树的基础知识，并能够分辨和使用哈夫曼树、完全二叉树、二叉排序树。掌握搜索算法，可以根据不同的实际问题选择最优的搜索算法。掌握动态规划的思路和步骤，能够解决一维动态规划问题和简单背包问题。掌握面向对象的概念和特性，并掌握类的创建及其基本使用方法。掌握栈、队列、循环队列的基本定义和常见操作。",
    points: [
      {
        id: "tree-basic",
        name: "树的基本概念",
        category: "数据结构",
        description: "树的定义、构造与遍历",
        details: [
          "掌握树的基本概念",
          "掌握树的构造方法",
          "掌握树的遍历算法"
        ]
      },
      {
        id: "huffman-tree",
        name: "哈夫曼树",
        category: "数据结构",
        description: "哈夫曼树的概念和应用",
        details: [
          "掌握哈夫曼树的概念",
          "掌握哈夫曼树的构造方法",
          "了解哈夫曼树的应用"
        ]
      },
      {
        id: "complete-binary-tree",
        name: "完全二叉树",
        category: "数据结构",
        description: "完全二叉树的概念和应用",
        details: [
          "掌握完全二叉树的概念",
          "理解完全二叉树的性质"
        ]
      },
      {
        id: "bst",
        name: "二叉排序树",
        category: "数据结构",
        description: "二叉排序树(BST)的概念和应用",
        details: [
          "掌握二叉排序树的概念",
          "掌握BST的插入和查找操作"
        ]
      },
      {
        id: "tree-encoding",
        name: "基于树的编码",
        category: "算法",
        description: "格雷编码和哈夫曼编码",
        details: [
          "理解格雷编码的原理",
          "理解哈夫曼编码的原理",
          "能够进行简单的编码应用"
        ]
      },
      {
        id: "dfs",
        name: "深度优先搜索(DFS)",
        category: "算法",
        description: "DFS算法的概念及应用",
        details: [
          "掌握DFS算法的概念",
          "掌握DFS的递归实现",
          "能够使用DFS解决相关问题"
        ]
      },
      {
        id: "bfs",
        name: "广度优先搜索(BFS)",
        category: "算法",
        description: "BFS算法的概念及应用",
        details: [
          "掌握BFS算法的概念",
          "掌握BFS的队列实现",
          "能够使用BFS解决相关问题"
        ]
      },
      {
        id: "binary-tree-search",
        name: "二叉树搜索",
        category: "算法",
        description: "二叉树的搜索算法",
        details: [
          "掌握二叉树的搜索方法",
          "能够根据问题选择合适的搜索算法"
        ]
      },
      {
        id: "dp-1d",
        name: "一维动态规划",
        category: "算法",
        description: "简单的一维DP问题",
        details: [
          "掌握动态规划的基本思想",
          "掌握一维动态规划的解题步骤",
          "能够使用代码解决一维DP问题"
        ]
      },
      {
        id: "simple-knapsack",
        name: "简单背包问题",
        category: "算法",
        description: "基础背包问题",
        details: [
          "理解背包问题的定义",
          "能够解决简单的背包问题"
        ]
      },
      {
        id: "oop-basic",
        name: "面向对象基础",
        category: "C++基础",
        description: "封装、继承、多态的基本概念",
        details: [
          "掌握面向对象的思想",
          "了解封装的概念",
          "了解继承的概念",
          "了解多态的概念"
        ]
      },
      {
        id: "class-basic",
        name: "类的创建和使用",
        category: "C++基础",
        description: "C++类的定义、创建和初始化",
        details: [
          "掌握类的定义方法",
          "掌握类的创建和初始化",
          "掌握类的基本使用方法"
        ]
      },
      {
        id: "stack",
        name: "栈",
        category: "数据结构",
        description: "栈的基本定义、应用场景和常见操作",
        details: [
          "掌握栈的基本定义",
          "掌握栈的入栈和出栈操作",
          "了解栈的应用场景"
        ]
      },
      {
        id: "queue",
        name: "队列",
        category: "数据结构",
        description: "队列和循环队列的基本操作",
        details: [
          "掌握队列的基本定义",
          "掌握队列的入队和出队操作",
          "掌握循环队列的实现",
          "了解队列的应用场景"
        ]
      }
    ]
  },
  "7": {
    level: 7,
    title: "C++编程七级",
    examTime: 180,
    description: "掌握数学库函数、复杂动态规划、图的定义与遍历、哈希表",
    objectives: "掌握常用数学库函数，了解相关函数概念与定义。掌握复杂动态规划，包括二维动态规划、求LIS、LCS等内容，并掌握利用滚动数组等的优化方法。了解图的定义与广搜和深搜的算法，泛洪算法。了解哈希表的概念和知识。",
    points: [
      {
        id: "math-functions",
        name: "数学库函数",
        category: "C++基础",
        description: "三角函数、对数函数、指数函数的使用",
        details: [
          "掌握三角函数：sin(x)、cos(x)等",
          "掌握对数函数：log10(x)返回以10为底的对数，log2(x)返回以2为底的对数",
          "掌握指数函数：exp(x)计算e的x次幂"
        ]
      },
      {
        id: "dp-2d",
        name: "二维动态规划",
        category: "算法",
        description: "二维DP及动态规划最值优化",
        details: [
          "掌握二维动态规划的基本思想",
          "掌握动态规划最值优化方法",
          "能够解决二维DP问题"
        ]
      },
      {
        id: "interval-dp",
        name: "区间动态规划",
        category: "算法",
        description: "区间DP的概念和应用",
        details: [
          "理解区间动态规划的概念",
          "掌握区间DP的状态定义",
          "能够解决区间DP问题"
        ]
      },
      {
        id: "lis",
        name: "最长上升子序列(LIS)",
        category: "算法",
        description: "求解最长上升子序列问题",
        details: [
          "理解最长上升子序列的概念",
          "掌握LIS的动态规划解法",
          "了解LIS的二分优化方法"
        ]
      },
      {
        id: "lcs",
        name: "最长公共子序列(LCS)",
        category: "算法",
        description: "求解最长公共子序列问题",
        details: [
          "理解最长公共子序列的概念",
          "掌握LCS的动态规划解法",
          "能够分析LCS的时间和空间复杂度"
        ]
      },
      {
        id: "rolling-array",
        name: "滚动数组优化",
        category: "算法",
        description: "基于滚动数组降低动态规划空间复杂度",
        details: [
          "理解滚动数组的原理",
          "掌握使用滚动数组优化空间复杂度",
          "能够将二维DP优化为一维"
        ]
      },
      {
        id: "graph-basic",
        name: "图的基本概念",
        category: "数据结构",
        description: "图的定义、种类和数据结构表示",
        details: [
          "掌握图的基本定义",
          "理解有向图和无向图的区别",
          "掌握图节点的度的概念",
          "掌握图的数据结构表示（邻接矩阵、邻接表）"
        ]
      },
      {
        id: "graph-traversal",
        name: "图的遍历",
        category: "算法",
        description: "基于DFS和BFS的图搜索与遍历",
        details: [
          "掌握图的深度优先遍历(DFS)",
          "掌握图的广度优先遍历(BFS)",
          "能够根据问题选择合适的遍历方法"
        ]
      },
      {
        id: "flood-fill",
        name: "泛洪算法",
        category: "算法",
        description: "图的泛洪(flood fill)算法",
        details: [
          "理解泛洪算法的原理",
          "掌握泛洪算法的实现",
          "了解泛洪算法的应用场景"
        ]
      },
      {
        id: "hash-table",
        name: "哈希表",
        category: "数据结构",
        description: "哈希表的概念与应用",
        details: [
          "掌握哈希表的基本概念",
          "理解哈希函数的作用",
          "掌握哈希表的应用"
        ]
      }
    ]
  },
  "8": {
    level: 8,
    title: "C++编程八级",
    examTime: 180,
    description: "掌握计数原理、排列组合、图论算法（最短路径、最小生成树）、算法优化",
    objectives: "掌握基本计数原理，理解加法原理和乘法原理的区别与使用。掌握排列组合概念，能够实现常见排列组合问题的编程求解方法。掌握杨辉三角形的概念和应用。掌握代数与平面几何的基本知识。掌握较为复杂算法的时间复杂度和空间复杂度分析方法，及其一般的算法优化技巧，能根据数学知识优化算法。",
    points: [
      {
        id: "counting-principle",
        name: "计数原理",
        category: "数学",
        description: "加法原理和乘法原理",
        details: [
          "掌握加法原理的概念和应用",
          "掌握乘法原理的概念和应用",
          "理解加法原理和乘法原理的区别"
        ]
      },
      {
        id: "permutation",
        name: "排列",
        category: "数学",
        description: "排列的基本概念和编程实现",
        details: [
          "掌握排列的基本概念",
          "掌握排列数的计算方法",
          "能够实现排列问题的编程求解"
        ]
      },
      {
        id: "combination",
        name: "组合",
        category: "数学",
        description: "组合的基本概念和编程实现",
        details: [
          "掌握组合的基本概念",
          "掌握组合数的计算方法",
          "能够实现组合问题的编程求解"
        ]
      },
      {
        id: "pascal-triangle",
        name: "杨辉三角",
        category: "数学",
        description: "杨辉三角形（帕斯卡三角形）的概念和实现",
        details: [
          "掌握杨辉三角形的定义",
          "理解杨辉三角形与组合数的关系",
          "掌握杨辉三角形的编程实现"
        ]
      },
      {
        id: "binary-lifting",
        name: "倍增法",
        category: "算法",
        description: "倍增法的概念和时间复杂度",
        details: [
          "理解倍增法的基本概念",
          "了解倍增法的时间复杂度",
          "能够使用倍增法解决相关问题"
        ]
      },
      {
        id: "algebra-geometry",
        name: "代数与平面几何",
        category: "数学",
        description: "方程求解和基本图形面积计算",
        details: [
          "掌握一元一次方程的求解",
          "掌握二元一次方程的求解",
          "掌握三角形、圆形、长方形等基本图形的面积计算"
        ]
      },
      {
        id: "mst",
        name: "最小生成树",
        category: "算法",
        description: "Kruskal算法和Prim算法",
        details: [
          "掌握最小生成树的概念",
          "掌握Kruskal算法的原理和实现",
          "掌握Prim算法的原理和实现"
        ]
      },
      {
        id: "shortest-path",
        name: "最短路径",
        category: "算法",
        description: "Dijkstra算法和Floyd算法",
        details: [
          "掌握最短路径的概念",
          "掌握单源最短路径的Dijkstra算法",
          "掌握多源最短路径的Floyd算法",
          "理解不同算法的适用场景"
        ]
      },
      {
        id: "complexity-analysis",
        name: "算法效率分析",
        category: "算法",
        description: "复杂算法的时间和空间复杂度分析",
        details: [
          "掌握较复杂算法的时间复杂度分析方法",
          "掌握较复杂算法的空间复杂度分析方法",
          "能够分析各类算法（排序、查找、树和图遍历、搜索、分治、动态规划等）的复杂度"
        ]
      },
      {
        id: "algorithm-optimization",
        name: "算法优化",
        category: "算法",
        description: "算法优化的一般方法和技巧",
        details: [
          "理解不同算法求解同一问题在复杂度上的差异",
          "掌握算法优化的一般方法",
          "理解使用数学知识辅助求解问题的技巧（如等差、等比数列求和公式）"
        ]
      }
    ]
  }
};

// 获取所有知识点的扁平数据（用于学习页面）
export function getKnowledgePointById(id: string): (KnowledgePoint & { level: number }) | null {
  for (const [levelKey, levelData] of Object.entries(gespKnowledgeData)) {
    const point = levelData.points.find(p => p.id === id);
    if (point) {
      return { ...point, level: parseInt(levelKey) };
    }
  }
  return null;
}

// 获取级别的考试信息
export function getLevelExamInfo(level: string) {
  const data = gespKnowledgeData[level];
  if (!data) return null;

  return {
    title: data.title,
    examTime: data.examTime,
    questionTypes: [
      { type: "单选题", count: 15, score: 2 },
      { type: "判断题", count: 10, score: 2 },
      { type: "编程题", count: 2, score: 25 }
    ]
  };
}
