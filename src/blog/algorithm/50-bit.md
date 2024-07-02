---
title: 位运算
category:
  - 算法
order: 50
tag:
  - 算法
  - 位操作
---

## 位运算
所有的位运算算法，其实都是对 `& ｜ ^` 的灵活运用。  

参考[io-wiki 位运算详解](https://oi-wiki.org/math/bit/)，这篇文章详细介绍了位运算，与或异或，取反，左移右移，运算符，以及一些算法应用，建议可以好好阅读下。

### 示例 [1486 数组异或操作](https://leetcode.cn/problems/xor-operation-in-an-array/)
```text
给你两个整数，n 和 start 。
数组 nums 定义为：nums[i] = start + 2*i（下标从 0 开始）且 n == nums.length 。
请返回 nums 中所有元素按位异或（XOR）后得到的结果。
```

```java
class Solution {
    public int xorOperation(int n, int start) {
        int res = 0;
        for(int i = 0; i < n; i++){
            res ^= (start + 2 * i);
        }
        return res;
    }
}
```
