---
title: 二分算法
category:
  - 算法
order: 1
tag:
  - 算法
---

## 二分查找
框架很简单，细节是魔鬼。  

二分查找常用的场景：查询一个数，查找重复数的左边界，右边界。  
不彻底研究一下，针对不同的场景，很容易弄不清 mid +1 还是 -1， while 里 <= 还是 < 。  
弄不清就可能找不到真正的需要的下标。


```java
// 二分查找框架
int binarySearch(int[] nums, int target) {
    int l = 0, r = ...;

    while(...) {
        int mid = (l + r) / 2;
        if (nums[mid] == target) {
            ...
        } else if (nums[mid] < target) {
            l = ...
        } else if (nums[mid] > target) {
            r = ...
        }
    }
    return ...;
}

// 整体框架就是这样，唯一需要确定的就是代码中 ... 的部分了。
```

### 场景一：查找一个唯一数
```java
// 最简单的查找一个数的写法
int binarySearch(int[] nums, int target) {
    int l = 0; 
    int r = nums.length - 1;

    while(l <= r) {
        int mid = l + (r - l) / 2;
        if(nums[mid] == target)
            return mid; 
        else if (nums[mid] < target)
            l = mid + 1;
        else if (nums[mid] > target)
            r = mid - 1;
    }
    // 查找不到
    return -1;
}
```
### 场景二：查找左边界
```java
// 查找左侧边界
int binarySearch_left(int[] nums, int target) {
    int l = 0;
    int r = nums.length-1;
    
    while (l <= r) {
        int mid = (l + r) / 2;
        if (nums[mid] < target) {
            l = mid + 1;
        } else if (nums[mid] > target) {
            r = mid - 1;
        }else if (nums[mid] == target) {
            // 收缩右侧边界
            r = mid - 1;
        }
    }
    
    // l = 0, r = nums.length - 1，的情况下，
    // 退出 while 的条件是 l = r + 1;
    // 如果存在 target，此时 l 就是 target 的最左侧坐标，即左边界。
    // 如果不存在 target，此时 l 就是大于 target 的最小坐标。

    // 因为 l = r + 1，所以存在 l = nums.length 的情况。
    // 在这种情况，有两种返回结果。
    if(l == nums.length) return -1;
    if(l == nums.length) return nums.length - 1;

    // l != nums.length 的情况，根据题目返回不同的结果。
    return nums[l] == target ? l : -1;
    
    // 如果要返回 >= target 的最小坐标，
    // 如果 nums[l] == target，此时返回的是 target 的最小坐标。
    // 如果 nums[l] != target，这里 l 是 大于 target 的最小值。
    // 所以，逻辑统一，返回 l 即可。
    return l;
}
```
> 如果查找左边界，而 target 不存在，这里 l 是大于 target 的最小索引。

### 场景三：查找右边界
```java
// 查找右侧边界
int binarySearch_right(int[] nums, int target) {
    int l = 0;
    int r = nums.length-1;
    
    while (l <= r) {
        int mid = (l + r) / 2;
        if (nums[mid] < target) {
            l = mid + 1;
        } else if (nums[mid] > target) {
            r = mid - 1;
        }else if (nums[mid] == target) {
          // 收缩左侧边界
            l = mid + 1;
        }
    }
    
    // l = 0, r = nums.length - 1，的情况下，
    // 退出 while 的条件是 l = r + 1，即 r = l - 1;
    // 如果存在 target，此时 r 就是 target 的最右侧坐标，即右边界。
    // 如果不存在 target，此时 r 就是小于 target 的最大坐标。

    // 因为 r = l - 1，所以存在 l = -1 的情况。
    // 在这种情况，有两种返回结果。
    if(r < 0) return -1;
    if(r < 0) return 0;

    // r >= 0 的情况，根据题目返回不同的结果。
    return nums[r] == target ? r : -1;
    
    // 如果要返回 <= target 的最大坐标，
    // 如果 nums[r] == target，此时返回的是 target 的最大坐标。
    // 如果 nums[r] != target，这里 r 是 小于 target 的最大坐标。
    // 所以，逻辑统一，返回 r 即可。
    return r;
}
```
> 如果 target 不存在，搜索右侧边界的二分搜索返回的索引是小于 target 的最大索引。

## 示例
### [34.在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)
```text
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。
请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。
你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
```
本题就是典型的查询 target 左右边界，且 target 不存在，就返回 -1 的情况，所以比较简单。
```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] res = new int[2];

        res[0] = searchL(nums, target);
        if(res[0] == -1){
            res[1] = -1;
        }else{
            res[1] = searchR(nums, target);
        }
    
        return res; 
    }

    private int searchL(int[] nums, int target){
        int l = 0, r = nums.length-1;
        while(l <= r){
            int mid = (l + r) / 2;

            if(nums[mid] > target){
                r =  mid - 1;
            }else if(nums[mid] < target){
                l = mid + 1;
            }else{
                r = mid - 1;
            }
        }

        if(l >= nums.length){
            return -1;
        }

        if(nums[l] != target) return -1;

        return l;
    }

    private int searchR(int[] nums, int target){
        int l = 0, r = nums.length-1;
        while(l <= r){
            int mid = (l + r) / 2;

            if(nums[mid] > target){
                r =  mid - 1;
            }else if(nums[mid] < target){
                l = mid + 1;
            }else{
                l = mid + 1;
            }
        }

        if(r < 0){
            return -1;
        }

        if(nums[r] != target) return -1;
        
        return r;
    }
}
```

### [2563. 统计公平数对的数目](https://leetcode.cn/problems/count-the-number-of-fair-pairs/description/)
```text
给你一个下标从 0 开始、长度为 n 的整数数组 nums ，和两个整数 lower 和 upper ，
返回 公平数对的数目 。

如果 (i, j) 数对满足以下情况，则认为它是一个 公平数对 ：
0 <= i < j < n，且
lower <= nums[i] + nums[j] <= upper
```
本题就是典型的查询 target 左右边界，且 target 不存在，不能返回 -1 的情况。

```java
class Solution {
    public long countFairPairs(int[] nums, int lower, int upper) {
        // 本题的条件中 0 <= i < j < n， 仅仅限定了 i != j。
        Arrays.sort(nums);
        
        long res = 0;
        for (int i = 0; i < nums.length; i++) {
            // 查找到 j > i 
            // 且 j ~ nums.length-1 索引的 nums 中 min ~ max 中间的数字，就是，公平数对数。
            int min = lower - nums[i];
            int max = upper - nums[i];
            // j 开始值 = i + 1

            // 查找 i+1 ~ nums.length-1，中 min 元素的左边界。
            int l = searchL(nums, i + 1, min);
            // searchL 返回的是 l, 退出条件是 l = r + 1，存在 l >= nums.length 的情况，这种情况符合条件的数为 0。
            if (l >= nums.length) continue;

            int r = searchR(nums, i + 1, max);
            // searchR 返回的是 r，同样，退出条件是 l = r + 1，即 r = l - 1，所以存在 r < 0 的情况，这种符合条件的同样是 0。
            if (l < 0) continue;

            // 其实上边的 if (l >= nums.length) continue; 
            // 和 if (l < 0) continue; 不写也行。
            // 因为如果 l = nums.length，r 必定 = nums.length-1
            // 如果 r = -1, 则 l 必定 = 0；
            // 这两种情况下 r - l + 1 都等于 0。
            // 但是为了更好的理解二分的不存在 target 不返回 -1 的情况，所以这里加了两个判断。
            res += (r - l + 1);
        }
        return res;
    }

    private static int searchR(int[] nums, int start, int target) {
        int l = start, r = nums.length - 1;
        while (l <= r) {
            int mid = (l + r) / 2;
            if (nums[mid] < target) {
                l = mid + 1;
            } else if (nums[mid] > target) {
                r = mid - 1;
            } else {
                l = mid + 1;
            }
        }
        return r;
    }

    private static int searchL(int[] nums, int start, int target) {
        int l = start, r = nums.length - 1;
        while (l <= r) {
            int mid = (l + r) / 2;
            if (nums[mid] < target) {
                l = mid + 1;
            } else if (nums[mid] > target) {
                r = mid - 1;
            } else {
                r = mid - 1;
            }
        }
        return l;
    }
}
```

### [1170.比较字符串最小字母出现频次](https://leetcode.cn/problems/compare-strings-by-frequency-of-the-smallest-character/description/)
```text
定义一个函数 f(s)，统计 s  中（按字典序比较）最小字母的出现频次 ，其中 s 是一个非空字符串。

例如，若 s = "dcce"，那么 f(s) = 2，因为字典序最小字母是 "c"，它出现了 2 次。

现在，给你两个字符串数组待查表 queries 和词汇表 words 。对于每次查询 queries[i] ，需统计 words 中满足 f(queries[i]) < f(W) 的 词的数目 ，W 表示词汇表 words 中的每个词。

请你返回一个整数数组 answer 作为答案，其中每个 answer[i] 是第 i 次查询的结果。
```
整体二分过程是固定的，根据不同题意要返回不同的值。
```java
class Solution {
    public int[] numSmallerByFrequency(String[] queries, String[] words) {
        // 先算出来所有的 words 的值
        int[] w = new int[words.length];
        for(int i = 0; i < w.length; i++){
            w[i] = f(words[i]);
        }
        // 排序
        Arrays.sort(w);

        int res[] = new int[queries.length];
        for(int i = 0; i < queries.length; i++){
            int q = f(queries[i]);
            // 求当前值的右侧边界。
            res[i] = searchR(w, q);
        }

        return res;
    }

    private int searchR(int[] nums, int target){
        // 右边界套路代码开始。。。
        int l = 0, r = nums.length-1;
        while(l <= r){
            int mid = (l + r) / 2;
            if(nums[mid] < target){
                l = mid + 1;
            }else if(nums[mid] > target){
                r = mid - 1;
            }else{
                l = mid + 1;
            }
        }
        // 右边界套路代码结束。。。

        // 如果 r < 0, 说明 nums 中的所有值都大于 target，此时返回整个数组的长度。
        if(r < 0) return nums.length;

        // 分析 target 在不在 nums 中。
        // 前面说过，如果 target 存在 nums 中，r 是 target 的最右边界。
        // 此时答案是 nums.length - r - 1;
        // 如果 target 不存在 nums 中，r 是小于 target 的最大坐标，结果同样是 nums.length - r - 1。 
        return nums.length - r - 1;
    }

    private int f(String s){
        int res = 1;
        char[] sc = s.toCharArray();
        Arrays.sort(sc);

        for(int i = 1; i < sc.length; i++){
            if(sc[i] != sc[i-1]){
                break;
            }
            res++;
        }

        return res;
    }
}
```

## 总结
确定 while 里使用 < 还是使用 <= 是根据区间来决定的，如果两端都是闭区间 [0, len-1]，则使用 <=, 如果左闭右开 [0, len) 则使用 < 。  
确定 mid + 1, 还是 mid - 1，mid，则是根据下一步的搜索区间来判断的。  

为了逻辑统一，简化二分查找，特意做了以下总结，记牢记好，再不怕二分查找。  
1. 统一使用闭区间。l=0, r = len - 1;
2. 在 1 的前提下，while 内统一使用 while(l <= r) 。
3. 在 1 的前提下，只有 l = mid + 1, r = mid - 1, 没有等于 mid。
4. 在 1 的前提下，简单定位唯一 target，不相等使用第3条逻辑，相等直接返回 mid。
5. 在 1 的前提下，寻找左边界，不相等使用第3条逻辑，相等 r = mid - 1; （收缩右侧边界)
6. 在 1 的前提下，寻找右边界，不相等使用第3条逻辑，相等 l = mid + 1; （收缩左侧边界）  
至此就解决了所有的二分查找问题。


## 参考：
[labualdong算法笔记](https://labuladong.online/algo/essential-technique/binary-search-framework/#%E4%B8%89%E3%80%81%E5%AF%BB%E6%89%BE%E5%8F%B3%E4%BE%A7%E8%BE%B9%E7%95%8C%E7%9A%84%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE)  
[灵神的二分算法题单](https://leetcode.cn/circle/discuss/SqopEo/)