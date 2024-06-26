---
title: 虚拟线程
category:
  - Java
order: 32
tag:
  - Java基础
  - concurrent
  - 虚拟线程
---

## 线程的实现
开发语言实现线程主要有三种方式:
1. 使用内核线程实现(1:1实现)，
2. 使用用户线程实现(1:N实现)， 
3. 使用用户线程加轻量级进程混合实现(N:M 实现)。
### 1. 内核线程实现
使用内核线程实现的方式也被称为1:1实现。内核线程(Kernel-Level Thread，KLT)就是直接由 操作系统内核(Kernel，下称内核)支持的线程，这种线程由内核来完成线程切换，内核通过操纵调 度器(Scheduler)对线程进行调度，并负责将线程的任务映射到各个处理器上。  

每个内核线程可以视 为内核的一个分身，这样操作系统就有能力同时处理多件事情，支持多线程的内核就称为多线程内核 (Multi-Threads Kernel)。  

程序一般不会直接使用内核线程，而是使用内核线程的一种高级接口——轻量级进程(Light Weight Process，LWP)，轻量级进程就是我们通常意义上所讲的线程，由于每个轻量级进程都由一个内核线程支持，因此只有先支持内核线程，才能有轻量级进程。  
这种轻量级进程与内核线程之间1:1 的关系称为一对一的线程模型。  

### 2. 用户线程实现
使用用户线程实现的方式被称为1:N实现。  

广义上来讲，一个线程只要不是内核线程，都可以认为是用户线程(User Thread，UT)的一种，因此从这个定义上看，轻量级进程也属于用户线程，但轻量级进程的实现始终是建立在内核之上的，许多操作都要进行系统调用，因此效率会受到限制，并不具备通常意义上的用户线程的优点。  

而狭义上的用户线程指的是完全建立在用户空间的线程库上，系统内核不能感知到用户线程的存 在及如何实现的。用户线程的建立、同步、销毁和调度完全在用户态中完成，不需要内核的帮助。  

### 3. 混合实现
线程除了依赖内核线程实现和完全由用户程序自己实现之外，还有一种将内核线程与用户线程一起使用的实现方式，被称为 N:M 实现。  

在这种混合实现下，既存在用户线程，也存在轻量级进程。 用户线程还是完全建立在用户空间中，因此用户线程的创建、切换、析构等操作依然廉价，并且可以支持大规模的用户线程并发。而操作系统支持的轻量级进程则作为用户线程和内核线程之间的桥梁，这样可以使用内核提供的线程调度功能及处理器映射，并且用户线程的系统调用要通过轻量级进程来完成，这大大降低了整个进程被完全阻塞的风险。  

在这种混合模式中，用户线程与轻量级进程的数量 比是不定的，是N:M 的关系。  

### 总结
1. LWP 是程序使用内核线程的高级接口，用来和内核线程交互。  
2. 用户线程是开发语言自定义的线程，与内核线程无关。  
3. 目前来说主要的线程模型主要有三种
    - 1:1 一个用户线程对应一个 LWP，一个 LWP 对应一个内核线程（Java 普通线程的线程模型）。
    - 1:N 多个用户线程对应一个 LWP，一个 LWP 对应一个内核线程。
    - N:M 多个用户线程对应多个 LWP，一个 LWP 对应一个内核线程（java 虚拟线程的线程模型）。


## JDK 线程介绍
### 普通的线程
就 Linux 的 HotSpot 虚拟机来说, 它的每一个Java线程都是直接映射到一个操作系统原生线程来实现的，而且中间没有额外的间接结构。  

所以HotSpot自己是不会去干涉线程调度的(可以设置线程优先级给操作系统提供调度建议)，全权交给底下的操作系统去处理，所以何时冻结或唤醒线程、该给线程分配多少处理器执行时间、该把线程安排给哪个处理器核心去执行等，都是由操作系统完成的，也都是由操作系统全权决定的。

### 虚拟线程
Java线程的实现不受JVM规范约束，早在 JDK1.2 前的 Classic 虚拟机上的线程就是基于 Green Threads 用户线程实现的。但是在 JDK1.3 起大部分商用 Java 虚拟机都普遍的使用了基于操作系统原生线程模型来实现了，也就是 1:1 的线程模型。所以虚拟线程并不是什么新东西，目前只不过是为了更高的吞吐量在 JDK21 重新焕发了新春。
> 普遍指的是，一致有虚拟机支持用户线程，比如 JavaME 的 CLDC-HI 和 Solaris 平台的 HotSpot 虚拟机，由于 Solaris 操作系统的线程特性本来就可以同时支持 1:1 及 N:M 的线程模型，因此 Solaris 版的 HotSpot 也对应提供了两个平台专有的线程模型

## 为什么要增加虚拟线程
首先，随着互联网爆炸发展，现在的业务不论是请求量还是业务、架构复杂度，相比10年前都不可同日而语。

其次，在现在的微服务架构下，一次对外部业务请求的响应，往往需要分布在不同机器上的大量服务共同协作来实现，微服务架构在减少单个服务复杂度、增加复用性的同时，也不可避免地增加了服务的数量，所以这就要求每一个服务都必须在极短的时间内完成计算，这样组合多个服务的总耗时才不会太长; 也要求每一个服务提供者都要能同时处理数量更庞大的请求，这样才不会出现请求由于某个服务被阻塞而出现等待。  

但是 Java 目前的并发编程机制就与上述架构趋势产生了一些矛盾，1:1 的内核线程模型是如今Java虚拟机线程实现的主流选择，这种线程模型天然的缺陷是切换、调度成本高昂，系统能容纳的线程数量也很有限。  
在现在微服务架构以及高并发高可用，快速响应的情况下，用户线程切换的开销甚至可能会接近用于计算本身的开销，这就会造成严重的浪费。  

传统的 Java Web 服务器的线程池的容量通常在几十个到两百之间，高并发情况下百万计的请求往线程池添加时，系统即使能处理得过来，但其中的切换损耗也是相当可观的。所以虚拟线程就焕发了第二春。  

举个栗子：
某个服务50ms响应一个请求，如果并发 200/s，那么在 Thread-per-request 模型下，需要 10个并发线程来处理，如果请求量到了 2000/s，那么就需要100个线程来处理，这时上下文切换带来的影响就比较大了。  
> 内核线程的调度成本主要来自于用户态与核心态之间的状态转换，而这两种状态转换的开销主要来自于响应中断、保护和恢复执行现场的成本。

## 虚拟线程
[openjdk JDK增强提案 JEP444 关于虚拟线程的介绍](https://openjdk.org/jeps/444)  
[oracle 文档关于虚拟线程的介绍](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html#GUID-15BDB995-028A-45A7-B6E2-9BA15C2E0501)

根据 JEP444，History 可以知道，JDK19开始引入虚拟线程，并在JDK21正常孵化。  

根据 JEP444 Goals 和 Non-Goals 可以知道虚拟线程只是为了更高的吞吐量，不会移除旧的线程或者使用旧的线程方法去实现虚拟线程逻辑，不会改变基本的线程并发模型，只是新增一种选择。  

根据 JEP444 Implications of virtual threads, Virtual threads are cheap and plentiful, and thus should never be pooled.(虚拟线程成本低且数量多，因此不应该使用线程池)

现在，JDK中的每个java.lang.Thread实例都是一个平台线程。平台线程在底层操作系统线程上运行Java代码，并在代码的整个生命周期内捕获操作系统线程。平台线程的数量受限于操作系统线程的数量。 
 
虚拟线程是 java.lang.thread的一个实例，它在底层操作系统线程上运行Java代码，但在代码的整个生命周期内不会捕获操作系统线程。  
这意味着许多虚拟线程可以在同一个操作系统线程上运行它们的Java代码，从而有效地共享它。当平台线程独占宝贵的操作系统线程时，虚拟线程不会。虚拟线程的数量可能比操作系统线程的数量大得多。 
 
虚拟线程是由 JDK 而不是操作系统提供的线程的轻量级实现。它们是用户模式线程的一种形式，在其他多线程语言中已经取得了成功 (例如，Go 中的 gooutine 和 Erlang中 的 processes)。   
在早期的Java版本中，用户模式线程甚至被称为“绿色线程”，当时操作系统线程还没有成熟和普及。然而，Java的绿色线程都共享一个操作系统线程(M:1调度)，并且最终被平台线程超越，实现为操作系统线程的包装器(1:1调度)。  
虚拟线程采用M:N调度，即大量的虚拟线程被调度到较少的操作系统线程上运行。  
> 注意了列位，虚拟线程是 M:N 模式的，即上边线程的实现中的第三中**混合实现**。

### 虚拟线程的调度
JDK 的调度器是 ForkJoinPool ，FIFO 的方式进行调度，默认情况下，它的并行度是 CPU 的核数；  
可以通过参数 jdk.virtualThreadScheduler.parallelism 进行调优；  
通过 jdk.virtualThreadScheduler.maxPoolSize 可以设置虚拟线程载体的最大线程数。   
JDK的调度器不是直接将虚拟线程分配给处理器，而是将虚拟线程分配给平台线程(这就是前面提到的虚拟线程的M:N调度)。然后平台线程像往常一样由操作系统调度。

调度器为虚拟线程分配的平台线程被称为虚拟线程的载体。  
一个虚拟线程可以在其生命周期内可能被安排在不同的载体上，也就是说，调度器不维护虚拟线程和平台线程之间任何关联。 即虚拟线程和运行它的平台线程在逻辑上是完全独立的。   
虚拟线程无法获取平台线程，thread.currentthread() 返回的值始终是虚拟线程，平台线程和虚拟线程的堆栈是分开的。  
虚拟线程中抛出的异常不包括在平台线程的的栈帧中。   
虚拟线程的堆栈不会出现在平台线程的栈帧中，反之亦然。   
平台线程的局部变量对虚拟线程不可见，反之亦然。

某一个虚拟线程并不会一直占用平台线程，如果某个虚拟线程被阻塞了，比如阻塞队列的 take，socket 阻塞调用等，平台线程会先卸载虚拟线程，等虚拟线程退出阻塞状态了会再次使用空闲的平台线程加载并执行它。  

### 虚拟线程检测
todo

### 虚拟线程最佳实践
> ps: 根据官方文档推荐，并没有实践
1. 不需要池化，虚拟线程轻量级且量大，不需要池化。
2. 虚拟线程的新生主要是为了提高吞吐量，所以比较适合IO密集型处理，不适合CPU密集型处理。比如一个请求有 IO 操作或者读取数据库操作，可以直接起两个虚拟线程去执行 IO 和读数据库，但是对于数据计算等需要CPU的，还是不建议起一个虚拟线程去处理。

### 使用示例
```java
public class DirectVirtualThreadExample {

    public static void main(String[] args) {
        // 创建并启动10个虚拟线程
        for (int i = 1; i <= 10; i++) {
            int taskId = i;
            // 创建一个虚拟线程
            Thread virtualThread = Thread.ofVirtual().start(() -> {
                System.out.println("Task " + taskId + " is running on virtual thread: " + Thread.currentThread().getName());
                // 模拟任务执行时间
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Task " + taskId + " completed.");
            });

            // 可选：在这里可以存储或管理创建的虚拟线程
        }
    }
}

```