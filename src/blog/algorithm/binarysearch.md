---
title: 二分查找
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

    // 判断 target 是否存在于 nums 中
    // 如果越界，target 肯定不存在，返回 -1
    if (l < 0 || l >= nums.length) {
        return -1;
    }
    // 判断一下 nums[left] 是不是 target
    return nums[l] == target ? left : -1;
}

```

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
    // 最终右边界是 l-1;

    // 不在范围内，返回-1
    if (l - 1 < 0 || l - 1 >= nums.length) {
        return -1;
    }
    // 查到的结果不等于，说明数组里没有，返回-1；
    return nums[l - 1] == target ? (l - 1) : -1;
}

```


### 总结
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

### 参考：
[labualdong算法笔记](https://labuladong.online/algo/essential-technique/binary-search-framework/#%E4%B8%89%E3%80%81%E5%AF%BB%E6%89%BE%E5%8F%B3%E4%BE%A7%E8%BE%B9%E7%95%8C%E7%9A%84%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE)