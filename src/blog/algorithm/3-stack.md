---
title: 单调栈
category:
  - 算法
order: 3
tag:
  - 算法
  - 单调栈
---

## 单调栈
栈其实就是一个先进后出（FILO）的队列，而单调栈就是在栈的基础上做了一些特殊逻辑，使得每次新元素入栈后，栈内的元素都保持有序，单调递增或单调递减。

## 详解
以 leetcode 496 为例：[496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)
- 暴力解法：
```java
// 时间复杂度为 O(nums1.length * nums2.length)
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[] res = new int[m];
    for (int i = 0; i < m; ++i) {
        int j = 0;
        while (j < n && nums2[j] != nums1[i]) {
            ++j;
        }
        int k = j + 1;
        while (k < n && nums2[k] < nums2[j]) {
            ++k;
        }
        res[i] = k < n ? nums2[k] : -1;
    }
    return res;
}
```

- 单调栈解法：
```java
// 时间复杂度为 O(nums1.length + nums2.length)
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Deque<Integer> stack = new ArrayDeque<>();
    Map<Integer, Integer> map = new HashMap<>();

    // 从后往前遍历
    for(int i = nums2.length - 1; i >= 0; i --){
        
        while(!stack.isEmpty() && stack.peek() <= nums2[i]){
            // 把栈里，所有小于当前数字的数都给 pop 了。
            // 那么此时 stack 里栈顶的元素，就是下一个大于当前数的数字。
            stack.pop();
        }
        // 如果栈未空，说明当前坐标 i 的元素是最大的，结果是-1，否则，记录下一个更大的数。
        map.put(nums2[i], stack.isEmpty() ? -1 : stack.peek());
        // 再把当前数 push 进栈，而且可以保证当前栈内的数字，是递增的。
        stack.push(nums2[i]);
    }

    int[] res = new int[nums1.length];
    for(int i = 0; i < nums1.length; i++){
        res[i] = map.get(nums1[i]);
    }
    
    return res;
}
```
### 思路
单调栈的问题，差不多都是这么解决的。使用 for 循环从后往前遍历，倒着入栈，刚好正着出栈。  

通过 while 循环是把两个大数值元素之间的小元素通过栈排除掉，因为解决下一个更大的问题，第一个大数值元素前的元素根本看不到中间这些小数值，这样我们就得到了一个递增的栈，这个就叫单调栈。  

单调栈算法的复杂度只有 O(n)。


## 变形题
### 1. [leetcode 739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
这里也是使用单调栈，但是栈里存的是数组的下标，而不是具体的值。
```text
题目描述：
给定一个整数数组 temperatures，表示每天的温度;
返回一个数组 answer，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。
如果气温在这之后都不会升高，请在该位置用 0 来代替。
```
直接套用上边的模板，简单进行逻辑改变即可，先上代码。
```java
public int[] dailyTemperatures(int[] temperatures) {
    Deque<Integer> stack = new ArrayDeque<>();
    int[] res = new int[temperatures.length];

    for(int i = temperatures.length - 1; i >= 0; i --){
        while(!stack.isEmpty() && temperatures[stack.peek()] <= temperatures[i]){
            stack.pop();
        }
        res[i] = stack.isEmpty() ? 0 : stack.peek() - i;
        // 栈里放的是数组的下标。
        stack.push(i);
    }

    return res;
}
```

### 2. [leetcode 503 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/description/)
这个题是 详解中的 496 题的变形，把数组变成了循环数组。
```text
题目描述：
给定一个循环数组 nums（nums[nums.length - 1] 的下一个元素是 nums[0]），
返回 nums 中每个元素的下一个更大元素 。
数字 x 的 下一个更大的元素 是按数组遍历顺序，这个数字之后的第一个比它更大的数，
这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1 。
```
解决循环数组思路，一般就是把数组拷贝一份放到原数组后，得到一个两倍长的数组，这样原来的后边没有更大数字的数也能找到前边更大的数，实际计算的时候，我们没必要真的去构造一个两倍长的数组，只需循环遍历两次即可。
```java
public int[] nextGreaterElements(int[] nums) {
    int len = nums.length;
    int[] res = new int[len];
    Arrays.fill(res, -1);

    Deque<Integer> stack = new ArrayDeque<>();
    // 循环两遍数组。
    for(int i = 2 * len - 1; i >= 0; i--){
        int curIdx = i % len;
        
        while(!stack.isEmpty() && stack.peek() <= nums[curIdx]){
            stack.pop();
        }
        if(!stack.isEmpty()){
            res[curIdx] = stack.peek();
        }
        stack.push(nums[curIdx]);
    }

    return res;
}
```

## 总结
单调栈的问题，大多都可以通过逆序入栈来解决，如果题目要的结果是下一个更大的数，栈中大概率就是存储的数组中的数字，如果题目要的是下一个更大数的距离、索引那么栈中大概率存的是数组的下标，要根据实际题目来判断。

至于循环数组，则直接遍历两边即可。


## 题单
[灵神的单调栈题单](https://leetcode.cn/circle/discuss/9oZFK9/)