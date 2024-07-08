---
title: 数学算法
category:
  - 算法
order: 80
tag:
  - 算法
  - 数学
---

## 最大公约数&最小公倍数
```java
/**
 * 求最小公倍数
 */
public int lcm(int a, int b) {
    return a * b / gcd(a, b);
}

/**
 * 计算最大公约数
 */
public int gcd(int a, int b) {
    // 如果 b 为 0，直接返回 a
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

```

### 应用
[lc 2748. 美丽下标对的数目](https://leetcode.cn/problems/number-of-beautiful-pairs/)

```text
给你一个下标从 0 开始的整数数组 nums 。
如果下标对 i、j 满足 0 ≤ i < j < nums.length ，
如果 nums[i] 的 第一个数字 和 nums[j] 的 最后一个数字 互质 ，
则认为 nums[i] 和 nums[j] 是一组 美丽下标对 。

返回 nums 中 美丽下标对 的总数目。

对于两个整数 x 和 y ，如果不存在大于 1 的整数可以整除它们，则认为 x 和 y 互质 。
换而言之，如果 gcd(x, y) == 1 ，则认为 x 和 y 互质，
其中 gcd(x, y) 是 x 和 y 的 最大公因数 。
```
#### 解法1
```java
// 笨解法。
class Solution {
    public int countBeautifulPairs(int[] nums) {
        int res = 0;
        for(int i = 0; i < nums.length; i++){
            for(int j = i+1; j < nums.length; j++){
                if(calc(nums[i], nums[j]) == 1){
                    res ++;
                }
            }
        }
        return res;
    }  

    private int calc(int a, int b){
        // 计算第一个数字
        while(a > 9){
            a = a / 10;
        }
        // 计算最后一个数字
        b = b % 10;
        // 求最大公约数
        return gcd(a,b);
    }

    private int gcd(int a, int b){
        return (b == 0) ? a : gcd(b, a % b);
    }
}
// 时间复杂度 log(n*logn)
```

#### 解法2
```java
/**
 * 遍历一次数组
 * int x = nums[i];
 * 
 * 两种算法：
 * 1. 从 0 遍历到 i，计算最高位和 x 的最低位是否互质。（就是上边那个解法）  
 * 2. 由于最高位是 1-9，遍历 1-9，看看 x 的最低位和 1-9 中的数字，谁互质，
 *    这时候只需要再使用一个数组，统计这个互质的数字在 i 之前出现了几次，即可。
 * 
 * 具体算法过程：
 * 1. 初始化返回值为 0
 * 2. 定义数组 cnt[10]， 用来统计 1-9的数字出现的次数。
 * 3. 遍历数组，取得值 x。
 * 4. 遍历 1-9，求的所有互质的数字，每个互质的数字的 cnt[1-9] 都要加到返回值。
 * 5. 最后把当前数字的 x 的最高位统计进 cnt 中。这样就能保证，我们统计的 cnt 中的个数，都是小于 x 的索引的。
 */
class Solution {
    public int countBeautifulPairs(int[] nums) {
        int ans = 0;
        int[] cnt = new int[10];
        for (int x : nums) {
            for (int y = 1; y < 10; y++) {
                if (cnt[y] > 0 && gcd(y, x % 10) == 1) {
                    ans += cnt[y];
                }
            }
            while (x >= 10) {
                x /= 10;
            }
            cnt[x]++; // 统计最高位的出现次数
        }
        return ans;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}

时间复杂度：O(n⋅(k+log⁡U))，其中 n 为 nums 的长度，k=10，U=max⁡(nums)。计算 GCD 的时间视作 O(1)。
```

## 求质数
质数又称素数。一个大于1的自然数，除了1和它自身外，不能被其他自然数整除的数叫做质数；否则称为合数（规定1既不是质数也不是合数）。
```java
private boolean isPrime(int n){
    for(int i = 2; i * i <= n; i++){
        if(n % i == 0) return false;
    }
    return n >= 2;
}
```
### 应用
```text
给你一个整数数组 nums。
返回两个（不一定不同的）质数在 nums 中 下标 的 最大距离。
```
```java
class Solution {
    public int maximumPrimeDifference(int[] nums) {
        int i = 0;
        while(!isPrime(nums[i])) i++;

        int j = nums.length - 1;
        while(!isPrime(nums[j])) j--;

        return j - i;
    }

    private boolean isPrime(int n){
        for(int i = 2; i * i <= n; i++){
            if(n % i == 0) return false;
        }
        return n >= 2;
    }
}
```