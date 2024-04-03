---
title: 快速幂
category:
  - 算法
order: 1
tag:
  - 算法
---

快速幂，也叫二进制取幂、平方法
> ps：本文章的例子都是求 a^n^ 次方

## 常规幂运算
```java
long pow(long a, long n){
    long res = 1;
    // 循环 * a
    while(n > 0){
        res *= a;
        n--;
    }
    return res;
}
```
### 存在的问题：
n的值比较大的时候比较慢，耗时 O(n);  
可以使用快速幂来解决
## 快速幂
```java
private long fastPow(long a, long n) {
    long ans = 1;
    for (; n > 0; n >>= 1) {
        if ((n & 1) == 1) {
            ans = ans * a;
        }
        a = a * a;
    }
    return ans;
}
```
使用快速幂可以将计算幂等的时间复杂度降为 O(log n)
### 快速幂数学原理
如果 n = x + y 则 a^n^ = a^x+y^ = a^x^ * a^y^  
例如：2^13^ = 2^1101^ = 2^8^ * 2^4^ * 2^1^;
>(13 的二进制 1101，所以 13 的和是 1000 + 0100 + 0001)    

快速幂就是利用了这个数学原理  
n 一共有 log~2~n + 1 位，所以我们计算 a^n^ 只需要计算 a^1^，a^2^，a^4^，....，a^log^~2~^n^ 然后再把他们中 n 的相应的二进制为为1 的数相乘即可。  
总耗时 O(log n)  
就像 2^13^, 普通乘法计算快速幂需要相乘13次，而快速幂只需要 2^8^ * 2^4^ *（不乘2^2^） * 2^1^， 即 256 * 16 * (不乘4) * 2 一共循环4次即可。
>因为13 = 1101，第2位为0，所以不需要乘以 2^2^。

### 代码实现
1，遍历n的所有位，逻辑代码为
```java
while(n > 0){
    if(n & 1 == 1){
        // 当前位是1
    }else{
        // 当前位是 0
    }
    // 向右移位
    n = n >> 1;
}
```
2，遍历所有位的时候，记录当前位的值，例如计算 a^n^ 我们需要记录 a^1^ a^2^ a^4^... 的数值，但是只将 n 中二进制值为 1 的 a^x^ 值乘到结果值中，所以代码就是这样的。
```java
private long fastPow(long a, long n) {
    long ans = 1;
    // 迭代，每次n向右位移1位
    for (; n > 0; n >>= 1) {
        // 如果当前位为1
        if ((n & 1) == 1) {
            // 则把 a的x次方 值记录到结果中。
            ans = ans * a;
        }
        // 每次循环都乘以a， 就是 a的1次方 a的2次方 a的4次方。
        a = a * a;
    }
    return ans;
}
```
### 版本迭代
如果数据较大需要取模，则加入mod值即可。
```java
private long qpow(long a, long n, long mod) {
    long ans = 1;
    for (; n > 0; n >>= 1) {
        if ((n & 1) == 1) {
            ans = ans * a % mod;
        }
        a = a * a % mod;
    }
    return ans;
}
```

用到快速幂的 leetcode 题：  
[1969. 数组元素的最小非零乘积](https://leetcode.cn/problems/minimum-non-zero-product-of-the-array-elements/)。  
[2580. 统计将重叠区间合并成组的方案数](https://leetcode.cn/problems/count-ways-to-group-overlapping-ranges/)

