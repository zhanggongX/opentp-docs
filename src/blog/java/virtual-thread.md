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

## 虚拟线程简介

虚拟线程是 JDK 21 中引入的一种全新的并发编程模型。与传统的基于操作系统线程（OS Threads）的模型不同，虚拟线程是在 Java 虚拟机层面实现的，它们是一种用户级线程，不需要操作系统级别的线程支持。  

虚拟线程具有以下特点：
1. 轻量级：虚拟线程是轻量级的，创建和销毁的开销极小，可以轻松创建大量的虚拟线程，而不会导致系统资源耗尽。
2. 无需操作系统线程支持：与传统线程模型不同，虚拟线程不需要操作系统级别的线程支持，完全由 Java 虚拟机管理。
3. 可扩展性：虚拟线程的数量可以动态调整，可以根据应用程序的需求进行灵活配置，无需关注操作系统线程的限制。
4. 高性能：虚拟线程的轻量级特性和管理方式使得其具有更高的性能，可以更有效地利用系统资源，提升应用程序的吞吐量和响应速度。

## 虚拟线程与传统线程的比较

传统线程模型中，每个操作系统线程都需要分配一定的系统资源（如内核栈、内存空间等），并由操作系统进行调度和管理。
- 资源消耗：每个操作系统线程都会消耗较多的系统资源，当线程数量较大时，会导致系统资源的浪费和竞争。
- 上下文切换开销：线程之间的切换会涉及到上下文的保存和恢复，存在一定的开销。
- 调度延迟：操作系统调度线程的开销较大，可能导致线程调度的延迟。

虚拟线程通过在 Java 虚拟机层面实现，并采用用户级线程的方式管理，有效地解决了传统线程模型中存在的问题。它们可以更高效地利用系统资源，提升应用程序的性能和吞吐量。

## 虚拟线程的使用示例

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class VirtualThreadExample {

    public static void main(String[] args) {
        // 创建一个虚拟线程池
        ExecutorService executor = Executors.newVirtualThreadExecutor();

        // 提交任务给虚拟线程池执行
        for (int i = 1; i <= 10; i++) {
            // 创建一个任务实例，这里简单打印线程名称和任务编号
            Runnable task = () -> System.out.println("Task " + i + " is running on virtual thread: " + Thread.currentThread().getName());
            // 将任务提交给虚拟线程池执行
            executor.execute(task);
        }

        // 关闭虚拟线程池
        executor.shutdown();
    }
}
```

## 虚拟线程的前世今生