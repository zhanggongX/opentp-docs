---
title: 动态规划基础
category:
  - 动态规划
order: 1
tag:
  - 算法
  - 动态规划
---

## 分类
参考灵神的题单，给DP进行的一些分类。
- 一、入门 DP
- 二、网格图 DP
- 三、背包
- 四、经典线性 DP
- 五、状态机 DP
- 六、划分型 DP
- 七、其它线性 DP
- 八、区间 DP
- 九、状态压缩 DP（状压 DP）
- 十、数位 DP
- 十一、数据结构优化 DP
- 十二、树形 DP
- 十三、图 DP
- 十四、博弈 DP
- 十五、概率/期望 DP
- 专题：输出具体方案（打印方案）
- 专题：前后缀分解
- 专题：把 X 变成 Y
- 专题：跳跃游戏
- 其它 DP

## 什么是动态规划
动态规划问题一般就是求最值且无后效性的题目。  
而动态规划问题的解法，说到底就是穷举，把所有的可能性都穷举出来，自然就能得到最值。

虽然动态规划问题的解法是穷举，但是解法千变万化，这也是动态规划难的点，只要掌握了动态规划的思维，列出正确的状态转移公式，自然就能得到正确的答案。

动态规划的三要素是：重叠子问题、最优子结构、状态转移方程，重叠子问题和最优子结构的前提就是无后效性，即解决子问题后，后续更大的子问题，不能影响之前小子问题的结果。

思路就是：找到子问题，明确选择，明确状态转移方程。  
明确选择可以把它理解成树。不同的选择，就是不同的子树，一直 DFS 下去，就可以遍历一遍所有的选择。

## 举个例子
```text
70. 爬楼梯

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

示例 1：
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶

示例 2：
输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

```java

class Solution {
    public int climbStairs(int n) {
        // 特例返回
        if(n == 1) return 1;
        if(n == 2) return 2;

        int[] dp = new int[n+1];
        // 设置 dp 基础值
        dp[1] = 1;
        dp[2] = 2;

        for(int i = 3; i <= n; i++){
            // 到达台阶 i，可以从 i-1 台阶上来，也可能从 i-2 台阶上来，他们的值加一块，就是当前台阶的可能值
            // 直到 n 台阶
            // 这个也是该题的状态转移方程式。
            dp[i] = dp[i-1] + dp[i-2];
        }

        return dp[n];
    }
}
```

## 详解
虽然目前对简单的动态规划题有了一些心得，但是对于复杂的还是比较难以解决，而且理论基础也不够，后续会继续学习，总结理论，再更新本篇博客。

## 参考
- [动态规划解题套路框架](https://labuladong.online/algo/essential-technique/dynamic-programming-framework-2/)
- [动态规划入门：从记忆化搜索到递推](https://www.bilibili.com/video/BV1Xj411K7oF/)