---
title: Java集合
category:
  - Java
order: 40
tag:
  - Java基础
  - Java-collection
---

## Java 集合

### 集合概览图

![集合概览](/assets/blog/image/collection-all.png)

### ArrayList
#### ArrayList 扩容机制 
1, new ArrayList 时，创建了一个空数组  
2, add() 内容时，会创建一个默认长度为 10 的数组   
3, 当内容长度为10 的时候会扩容1.5 倍 即 oldCap + oldCap >> 1   
4, 安全的 ArrayList 请使用 CopyOnWriteArrayList<>();   
### HashMap 
#### HashMap 扩容机制
1, new HashMap() node数组为空，第一次put的时候，初始化长度为16   
2, new HashMap(n) 会将阈值设置为 n， 第一次put时候，将阈值给到容量，再把阈值设置为(容量x负载因子)  
3, 当容量大于阈值的时候，触发扩容，扩容为2倍，阈值更新为(新容量x负载因子)   
3, HashMap 并发操作扩容可能导致死循环，所以安全情况下，请使用 ConrrentHashMap   
hashMap 1.8之前是 数组+链表的方式存放数据 
#### HashMap 底层存储
1.8之前采用数组+链表来组成的。  
1.8之后，采用 数组+链表/红黑树来存。   
一般当链表长度大于8的时候，会变成红黑树   
当然要数组的长度大于64才会触发变红黑树，否则会优先给数组扩容。  
hashMap 的数组长度为2的次方，是为了计算hash值时方便。  

### ConcurrentHashMap 
1.8之前 使用分段数组+链表的方式存储数据   
1.8之后 concurrentHashMap 的存储方式和hashMap 一样   
1.8之前 对数组使用分段加密   
1.8之后 抛弃了桶（分段数组）的概念，直接对数组Node加密。 Node + CAS + Synchrionized 实现， Synchronized 锁定列表/红黑树的首节点。  
> ConcurrentHashMap 能保证线程的安全，但是不能保证复合操作的原子性。例如先判断是否存在，不存在的话，put数据，复合操作可以使用 PutIfAbsent, compute, computeIfAbsent putIfPresent等。

### ArrayList 和 LinkedList 的时间复杂度
ArrayList 非尾插 O(n)， 尾插 O(1)，如果需要扩容的话，尾插也是 O(n)  
LinkedList 头尾插入是 O(1) ，其他的位置也是 O(n)  
读取的话，ArrayList是 O(1), LinkedList 是 O(n)

### HashSet、LinkedHashSet、TreeSet 三者的区别
这三个类都实现了 Set 接口  
HashSet 底层是 hash 表，利用 hashMap 实现  
LinkedHashSet 底层是列表 , 利用 LinkedHashMap 实现  
TreeSet 底层是红黑树，适合 自定义排序的方式使用  

### Queue和Deque
#### Queue
增删查 add remove element  
增删查 offer poll peek （常用）
#### Deque
增删查 addFirst addLast  removeFirst removeLast    getFirst getLast   
增删查 offerFirst offerLast pollFirst pollLast peekFirst peekLast  
push = addFirst  
pop = removeFirst  


### BlockingQueue
阻塞队列，一个继承了 Queue 的阻塞队列，

### 为什么使用 Iterator 遍历数据可以增删
迭代器有个字段记录遍历到的位置，增删的时候会先同步位置，然后记录修改次数。  
modCount 是集合的变量  
expectedModCount 是itr的变量，当两者不一致的时候说明在遍历过程中，有人修改了集合，会抛出异常。  
#### 可以不使用迭代器，边遍历边删除元素吗？
可以，从后往前遍历即可。  
fail-fast(java.util)  
fail-safe(java.util.concurrent)  


### ArrayList 源码 doto
### LinkedList 源码 todo
### HashMap 源码 todo
### ConcurrentHashMap 源码 todo 
### LinkedHashMap 源码 todo
### CopyOnWriteArrayList 源码 todo
### ArrayBlockingQueue 源码 todo 
### LinkedBlockingQueue 源码 todo
### LinkedBlockingDeque 源码 todo
### PriorityQueue 源码 todo
### DelayQueue 源码 todo






