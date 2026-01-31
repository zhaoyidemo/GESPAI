/**
 * GESP C++ 4-6级知识点数据
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
