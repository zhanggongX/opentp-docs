---
title: Java并发
category:
  - Java
order: 5
tag:
  - Java基础
  - Java-concurrent
---

## 并发编程
### 线程的生命周期
#### 初始态(new)  
刚新建的线程一开始的状态，此时还没有调用 start 方法（new Thread）  
#### 运行态(runnable)
调用了 start 后等待运行的状态 (start)
#### 阻塞态(blocked)
线程运行被阻塞，需要等待释放锁等 (synchronized, reentrantLock.lock)(reentrantLock.unlock)
#### 等待态(waiting)
等待其他线程通知或中断，（Object.wait, Thread.join, LockSupport.park）（Object.notify, Object.notifyAll, join 的线程执行完， LockSupport.unpark ）
#### 超时等待态(time-waiting)
等待其他线程通知或中断，不过有超时时间（除了进入等待态的方法还有 sleep 方法）
#### 终止态(terminated)
线程终止

### 如何避免死锁
破坏请求与保持条件（一次性请求所有条件）  
破坏不剥夺条件（如果申请的资源被锁了，则释放自己持有的资源）  
破坏循环等待条件（例如两个资源 o1, o2，则多个线程都按照 o1->o2 的顺序申请资源）  

### sleep 和 wait 方法的区别
sleep 和 wait 都是将线程进入等待态  
最大的区别就是 sleep 不释放持有的锁， wait 释放锁  
wait 是对象的方法，sleep 是线程的方法  

### JMM
cpu有自己的内存模型，例如三级缓存、三级缓存等等。  
Java 由于跨平台的特性，就自己提供了一套内存模型，就是 JMM。  
可以把 JMM 看作是 Java 定义的并发编程的一组规范，抽象了线程和主内存的直接的关系，规定了Java源码到 cup指令的规范，主要是为了简化多线程编程增强可移植性。  

### JVM内存区域和 JMM内存模型
JVM 内存区域定义了 Java 虚拟机在运行的时，分区存储程序数据，比如堆存放对象等。   
JMM 主要是程序的并发有关，抽象了线程和主内存的关系，比如共享变量必须在主内存中等等，主要是为了简化多线程编程，增强系统可移植性。  

### happens-before 原则
例如: **操作1** happens-before **操作2**，意味着 **操作1** 的结果对 **操作2** 是可见的。即使 **操作1** 和 **操作2** 不在一个线程中，JMM也会保证 **操作1** 的结果也对 **操作2** 可见。  
#### happens-before 的一些规则
1. 程序顺序规则，线程按照书写顺序执行  
2. 结锁规则，结锁 happens-before 于 加锁  
3. volatile 变量规则，volatile 变量的写操作 happens-before 与所有的读操作  
4. 传递规则 A happens-before B, B happens-before C， 那么 A happens-before C  
5. 线程启动规则 线程的 start happens-before 线程的所有的动作。  

### Volatile
volatile 写操作 happens-before 所有的读操作，保证变量的可见性  
volatile 还可以防止指令重排，使用 Unsafe 的 内存屏障实现。  

### Synchronized
- 修饰实例方法锁当前对象  
- 修饰静态方法锁类对象  
- 修饰方法块自定义锁的内容  
- 它是一个非公平锁。  
#### 底层原理
锁语句块，编译的代码加上 monitorenter/monitorexit 指令，  
当执行到 monitorenter 代码的时候会尝试过去 moniter 的持有权，每个对象都内置了一个基于 C++实现的 ObjectMonitor ，  
获取到锁的线程执行代码，执行完通过 monitorexit 执行释放 moniter 的持有权。  

锁方法，在方法上加 ACC_synchronized 标识，来执行同步操作。  

锁定对象的markword头信息记录锁的状态，无-偏-轻-重，只有重量级锁 markword 才会指向 moniter 对象地址。  

JDK1.5 去掉了偏向锁，当一个线程来获取锁的时候会将锁定对象设置为偏向锁，如果有两个线程来竞争会升级为轻量级锁，如果一个线程持有锁另一个线程自旋超过一定次数或者有第三个线程来竞争，就会升级为重量级锁。
升级为重量级锁后才会竞争 monitor 对象，此时锁定的对象的 markword 头里存储的是 monitor 对象的地址。  

优化  
1.6之后，Synchronized 进行了大量的优化，增加了，自旋锁，自适应自旋锁，锁消除，锁粗化，偏向锁，轻量级锁等来减少锁开销。  
锁升级，无锁->偏向锁->轻量级锁->重量级锁，只可升级不可降级。

### 公平锁和非公平锁
公平锁让先申请的线程先得到锁（排队比较公平）。
非公平锁，不保证先申请的线程得到锁。

### 中断
Thread.interrupt 给线程发送中断信号
Thread.isInterrupted 判断是否被中断
Thread.interrupted 响应中断，清除中断标记
``` java
private static void demo() throws InterruptedException {
    Thread thread = new Thread(() -> {
        while (true) {
            // 响应中断
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("线程被中断，程序退出。");
                return;
            }

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                System.out.println("线程休眠被中断，程序退出。");
            }
        }
    });
    thread.start();
    Thread.sleep(2000);
    thread.interrupt();
}
```

### ThreadLocal
ThreadLoal 定义了一个 ThreadLocalMap 每个 Thread 对象内部都有个一个 ThreadLocalMap 对象，  
该对象的key是定义的 ThreadLocal 对象，value 则是通过 ThreadLocal set\get 的值，也就是说其实就是每个线程内都有一个Map对象，  
该对象存储了定义的 threadLocal 对象和设置的值，就能保持每个线程的值不一样了。  

ThreadLocalMap 的key 是弱引用，当没有变量指向 ThreadLocal 对象的时候发生GC，若引用将会被回收，此时 key = null, val != null 就发生了内存泄漏。  
如果使用线程池，则线程方法退出时候，在finally 方法中一定要调用一次 remove，防止脏数据。

### 线程池
#### 创建线程池
通过 ThreadPoolExecutor 来创建线程池
#### 参数
coreSize maxSize threadFactory, 等待队列，拒绝策略，回收时间/单位（当最大线程数大于核心线程数时的回收时间）  
#### 提供的拒绝策略
1. 抛出异常，
2. 使用提交线程2的线程1直接执行线程2。
3. 直接拒绝
4. 丢弃最早提交的未执行线程

### Future & CompletableFuture

### AQS
抽象队列同步器  
它是锁的基础，内部维护了一个 volatile 的变量 state，和一个 CLH 队列，队列里线程信息，线程 waitSatus, 前驱节点，后继节点。  
例如信号量（semaphore(5)）就是把 state 设置成5，多个线程申请的时候通过 CAS 来进行减少，减到0则不可再减少。  
CountDownLatch 同理  
























