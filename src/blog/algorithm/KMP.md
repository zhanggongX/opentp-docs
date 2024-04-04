---
title: KMP算法
category:
  - 算法
order: 3
tag:
  - 算法
  - 字符匹配算法
---

## KMP算法介绍
KMP算法是一种用来快速匹配子字符串的算法，它使得由普通的匹配算法O(m*n)的复杂度降低到了O(m+n)。
## 普通字符串匹配
以 leetcode 第28题为例。[28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/) ：
给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。
```java
class Solution {
    public int strStr(String haystack, String needle) {
        int len1 = haystack.length();
        int len2 = needle.length();
        if(len2 > len1) return -1;
        int max = len1 - len2;
        // 1 层循环
        for(int i = 0; i <= max; i++){
            if(check(haystack, needle, i)){
                return i;
            }
        }
        return -1;
    }

    private boolean check(String a, String b, int start){
        // 2 层循环
        for(int i = 0; i < b.length(); i++){
            if(a.charAt(i+start) != b.charAt(i)){
                return false;
            }
        }
        return true;
    }
}
```
可以看出，方法是经历过两层循环的，所以时间复杂度是 O(m*n)，m和n分别代表两个字符串的长度，如果两个字符串都比较长，那这个复杂度匹配出来结果那是相当慢的，我们可以使用 KMP 来进行匹配。
## KMP算法
先贴代码：
```java
class Solution {
    public int strStr(String haystack, String needle) {
        if (needle.isEmpty()) return 0;
        
        int n = haystack.length(), m = needle.length();
        haystack = " " + haystack;
        needle = " " + needle;

        char[] s = haystack.toCharArray();
        char[] p = needle.toCharArray();

        // 计算 next 数组
        int[] next = new int[m + 1];
        for (int i = 2, j = 0; i <= m; i++) {
            while (j > 0 && p[i] != p[j + 1]) {
                j = next[j];
            }
            if (p[i] == p[j + 1]) {
                j++;
            }
            next[i] = j;
        }

        // 匹配
        for (int i = 1, j = 0; i <= n; i++) {
            while (j > 0 && s[i] != p[j + 1]) {
                j = next[j];
            }
            if (s[i] == p[j + 1]) {
                j++;
            }
            if (j == m) {
                return i - m;
            }
        }

        return -1;
    }
}
```
### 前置知识
字符串前缀和后缀。
例如字符串 abba，他的前缀是 a ab abb，后缀是 bba ba a
### 算法解析
首先两个约定，被匹配串定为 s，s的字符串索引为 i，匹配串定为 p，它的字符索引为 j 。
要想快速的匹配字符，那么有两个思路:

1. 是 s 不能往后回滚，即 i 只能往后 ++；
2. 是 i 不能往前回滚的前提下，不能遗漏匹配结果，且让 j 尽量少往前回滚。
#### 为啥 s 不用回滚
因为 p 串会找到一个回滚的位置，不会导致漏匹配的。
#### 为啥 p 串不能直接再从 0 开始匹配
当 s 和 p 遇见不匹配的字符时，j 如果回滚到 0 ，此时就可能发生漏匹配的问题。
例如   
s = "bcaaadcbc" ,   
p = "aad"  
例如当匹配到 i = 4， j = 2 的时候， 'a' != 'd' ，此时如果把 p 的指针 j 重新指向 0, 那么就会漏掉匹配结果。  
所以 KMP 算法，关键就是，就是在匹配过遇见不能匹配的字符时，j 指针往前回滚多少合适。
#### 怎么找到 p 串合适的回滚位置
其实在匹配的过程中如果某个字符发生失配的情况，而且这个字符前的字符串中有相同的前缀和后缀，那么把 j 指向相同的前缀后的按个字符，就是最好的结果。  
例如：  
bcaaadcbc  
&&aad  
此时 p 串中的‘d’ 和 s 串中的‘a’ 不匹配，而 p 串中 ‘d’前边的字符串 aa，有相同的前缀 a 和相同的后缀 a，所以此时应该把 j 指向第 2 个 a。  
**这是为啥呢？**  
仔细想想遇见不匹配的字符前的字符是不是都是匹配的？是的。  
所以遇见不匹配的字符后，是不是之前**匹配好的字符**的**前缀和后缀相同的部分**就不需要再去匹配了？  
就像 abcabd 如果最后一个 d 不匹配，说明前边的 abcab 是匹配的，那么前缀 ab 和后缀 ab是相同的，那么此时把 j 指向 c，是最好的，因为 ab 肯定是匹配上的啦。
#### 怎么实现 O(m+n)
虽然道理是这样的，但是直接这么用，算法的时间复杂度还上升了。。  
所以我们要先算出来一个 next 数组。  
这个数组是干啥的呢？  
就是当第几个字符不匹配的时候，j 应该移动到前边第几个字符处。  
而计算 next 数组的时间是 O(m)，那么再遍历一遍 s 串，不需要嵌套循环的情况下，时间复杂度就是 O(m+n)；  
具体的实现见上方代码。


如果不理解，可以去 leetcode 看一下 宫水三叶 大佬的题解。[传送门](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/solutions/575568/shua-chuan-lc-shuang-bai-po-su-jie-fa-km-tb86/)






