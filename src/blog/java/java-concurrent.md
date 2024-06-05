---
title: Java并发
category:
  - Java
order: 3
tag:
  - Java基础
  - Java-concurrent
---

## 线程的生命周期
- 初始态(new):  刚新建的线程一开始的状态，此时还没有调用 start 方法（new Thread）  
- 运行态(runnable): 调用了 start 后等待运行的状态 (start)
- 阻塞态(blocked): 线程运行被阻塞，需要等待释放锁等。
> 加锁：(synchronized, reentrantLock.lock) 解锁： (reentrantLock.unlock)
- 等待态(waiting): 等待其他线程通知或中断。
> 进入等待态   （Object.wait, Thread.join, LockSupport.park）  
> 退出等待态： （Object.notify, Object.notifyAll, join 的线程执行完， LockSupport.unpark ）
- 超时等待态(time-waiting) 等待其他线程通知或中断，不过有超时时间（除了进入等待态的方法还有 sleep 方法）
- 终止态(terminated): 线程终止

## Synchronized
- 修饰实例方法锁当前对象  
- 修饰静态方法锁类对象  
- 修饰方法块自定义锁的内容  
- 它是一个非公平锁。  

### 底层原理
锁语句块，编译的代码加上 monitorenter/monitorexit 指令。    
当执行到 monitorenter 代码的时候会尝试获取 moniter 的持有权，每个对象都内置了一个基于 C++实现的 ObjectMonitor ，  
获取到锁的线程执行代码，执行完通过 monitorexit 执行释放 moniter 的持有权。  

锁方法，在方法上加 ACC_synchronized 标识，来执行同步操作。  

锁定对象的markword头信息记录锁的状态，无-偏-轻-重，只有重量级锁 markword 才会指向 moniter 对象地址。  

当一个线程来获取锁的时候会将锁定对象设置为偏向锁，如果有两个线程来竞争会升级为轻量级锁，如果一个线程持有锁另一个线程自旋超过一定次数或者有第三个线程来竞争，就会升级为重量级锁。  
升级为重量级锁后才会竞争 monitor 对象，此时锁定的对象的 markword 头里存储的是 monitor 对象的地址。  

JDK1.6之后，Synchronized 进行了大量的优化，增加了，自旋锁，自适应自旋锁，锁消除，锁粗化，偏向锁，轻量级锁等来减少锁开销。  
锁升级，无锁->偏向锁->轻量级锁->重量级锁，只可升级不可降级。
> 其实 HotSpot JVM 是支持锁降级的，但是锁升降级效率较低，如果频繁升降级的话对性能就会造成很大影响。重量级锁降级发生于 STW 阶段，降级对象为仅仅能被 VMThread 访问而没有其他 JavaThread 访问的对象。
> 被锁的对象都被垃圾回收了有没有锁还有啥关系？因此基本认为锁不可降级。  
   

JDK1.6 引入偏向锁。  
JDK8 默认开启偏向锁。  
JDK15 去掉了偏向锁。  
> 从 JDK 15 开始，偏向锁功能已经被移除，JVM 将直接使用其他锁优化技术，如轻量级锁和重量级锁。尽管偏向锁在特定场景下曾经提供了性能优势，但随着 JVM 的不断优化和现代硬件的改进，其实际收益已经减少。因此，偏向锁的移除简化了 JVM 的实现，同时也减轻了维护负担。

## ReentrantLock 
### synchronized 和 ReentrantLock 有什么区别
- 都是可重入锁
- synchronized 依赖于 JVM，ReentrantLock 依赖于 API
- ReentrantLock 比 synchronized 增加了一些高级功能
> ReentrantLock 的一些高级功能。
> 1. 等待可中断 : ReentrantLock提供了一种能够中断等待锁的线程的机制，通过 lock.lockInterruptibly() 来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。
> 2. 可实现公平锁 : ReentrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。
> 3. 可实现选择性通知（锁可以绑定多个条件）: synchronized关键字与 wait() 和 notify()/notifyAll() 方法相结合可以实现等待/通知机制。 ReentrantLock 借助 Condition 也可以实现

### 可中断锁和不可中断锁有什么区别
可中断锁：获取锁的过程中可以被中断，不需要一直等到获取锁之后 才能进行其他逻辑处理。ReentrantLock 就属于是可中断锁。  
不可中断锁：一旦线程申请了锁，就只能等到拿到锁以后才能进行其他的逻辑处理。 synchronized 就属于是不可中断锁。

### 结合 Condition 使用
```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.LinkedList;
import java.util.Queue;

public class ProducerConsumer {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int MAX_SIZE = 10;
    private final Lock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public void produce(int value) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == MAX_SIZE) {
                notFull.await(); // 等待队列未满
            }
            queue.add(value);
            System.out.println("Produced " + value);
            notEmpty.signal(); // 唤醒等待获取元素的消费者
        } finally {
            lock.unlock();
        }
    }

    public int consume() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await(); // 等待队列非空
            }
            int value = queue.poll();
            System.out.println("Consumed " + value);
            notFull.signal(); // 唤醒等待添加元素的生产者
            return value;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        ProducerConsumer pc = new ProducerConsumer();

        // Producer thread
        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    pc.produce(i);
                    Thread.sleep(100); // 模拟生产时间
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        // Consumer thread
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    pc.consume();
                    Thread.sleep(150); // 模拟消费时间
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        producer.start();
        consumer.start();
    }
}
```
锁：
- 创建一个 ReentrantLock 对象 lock。
- 使用 lock.newCondition() 方法创建两个 Condition 对象：notFull 和 notEmpty。
- notFull 用于控制队列满时的等待和唤醒，notEmpty 用于控制队列空时的等待和唤醒。

生产者方法 produce
- 使用 lock.lock() 获取锁，确保操作的原子性。
- 在队列满时调用 notFull.await() 使当前线程等待，直到被唤醒。
- 在队列中添加元素后，调用 notEmpty.signal() 唤醒等待获取元素的消费者线程。
- 在 finally 块中调用 lock.unlock() 释放锁。

消费者方法 consume
- 使用 lock.lock() 获取锁，确保操作的原子性。
- 在队列为空时调用 notEmpty.await() 使当前线程等待，直到被唤醒。
- 从队列中取出元素后，调用 notFull.signal() 唤醒等待添加元素的生产者线程。
- 在 finally 块中调用 lock.unlock() 释放锁。

## ReentrantReadWriteLock
`ReentrantReadWriteLock` 是 Java 提供的一个读写锁实现，位于 `JUC` 包中。  
它允许更高的并发性，特别适合读多写少的场景。`ReentrantReadWriteLock` 提供了一对相关的锁：一个读锁和一个写锁。读锁是共享的，多个线程可以同时获取读锁，而写锁是独占的，一次只能有一个线程持有写锁。  
`ReentrantReadWriteLock` 有读锁、写锁，支持可重入，支持锁降级，支持公平锁和非公平锁
> **锁降级**：允许从写锁降级为读锁。即一个线程持有写锁时，可以获取读锁，然后释放写锁，从而实现锁降级。


### 使用示例

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockExample {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final ReentrantReadWriteLock.ReadLock readLock = rwLock.readLock();
    private final ReentrantReadWriteLock.WriteLock writeLock = rwLock.writeLock();
    private int value = 0;

    public void write(int newValue) {
        writeLock.lock();
        try {
            value = newValue;
            System.out.println(Thread.currentThread().getName() + " wrote " + newValue);
        } finally {
            writeLock.unlock();
        }
    }

    public int read() {
        readLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " read " + value);
            return value;
        } finally {
            readLock.unlock();
        }
    }

    public static void main(String[] args) {
        ReadWriteLockExample example = new ReadWriteLockExample();

        // Writer thread
        Thread writer = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                example.write(i);
                try { Thread.sleep(100); } catch (InterruptedException e) { e.printStackTrace(); }
            }
        }, "Writer");

        // Reader threads
        Thread reader1 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                example.read();
                try { Thread.sleep(50); } catch (InterruptedException e) { e.printStackTrace(); }
            }
        }, "Reader1");

        Thread reader2 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                example.read();
                try { Thread.sleep(50); } catch (InterruptedException e) { e.printStackTrace(); }
            }
        }, "Reader2");

        writer.start();
        reader1.start();
        reader2.start();
    }
}
```

### 公平锁和非公平锁
公平锁让先申请的线程先得到锁（排队比较公平）。  
非公平锁，不保证先申请的线程得到锁。

### 底层原理
`ReentrantReadWriteLock` 的实现依赖于内部的同步器（`AQS`）
> AbstractQueuedSynchronizer  

[AQS介绍](https://opentp.cn/blog/java/aqs.html)

## 死锁
```java
/**
 * 死锁代码示例
 */
public class DeadlockDemo {
    private static final Object lock1 = new Object();
    private static final Object lock2 = new Object();

    public static void main(String[] args) {
        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (lock1) {
                    System.out.println("Thread 1: Holding lock 1...");

                    try { Thread.sleep(50); } catch (InterruptedException e) {}

                    System.out.println("Thread 1: Waiting for lock 2...");
                    synchronized (lock2) {
                        System.out.println("Thread 1: Holding lock 1 & 2...");
                    }
                }
            }
        });

        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (lock2) {
                    System.out.println("Thread 2: Holding lock 2...");

                    try { Thread.sleep(50); } catch (InterruptedException e) {}

                    System.out.println("Thread 2: Waiting for lock 1...");
                    synchronized (lock1) {
                        System.out.println("Thread 2: Holding lock 2 & 1...");
                    }
                }
            }
        });

        thread1.start();
        thread2.start();
    }
}
```
### 死锁检查
查看 jvm 栈信息 ： jstack -l pid
```shell
"VM Periodic Task Thread" os_prio=31 tid=0x000000012600c800 nid=0x5803 waiting on condition 

JNI global references: 1510

# 如果程序中出现死锁，则此处会显示。
Found one Java-level deadlock:
=============================
"Thread-1":
  waiting to lock monitor 0x000000012000d8b0 (object 0x000000076aef8000, a java.lang.Object),
  which is held by "Thread-0"
"Thread-0":
  waiting to lock monitor 0x000000012000aec0 (object 0x000000076aef8010, a java.lang.Object),
  which is held by "Thread-1"

Java stack information for the threads listed above:
===================================================
"Thread-1":
        at com.xxx.DeadlockDemo$2.run(DeadlockDemo.java:34)
        - waiting to lock <0x000000076aef8000> (a java.lang.Object)
        - locked <0x000000076aef8010> (a java.lang.Object)
        at java.lang.Thread.run(Thread.java:748)
"Thread-0":
        at com.xxx.DeadlockDemo$1.run(DeadlockDemo.java:18)
        - waiting to lock <0x000000076aef8010> (a java.lang.Object)
        - locked <0x000000076aef8000> (a java.lang.Object)
        at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.
```
### 如何避免死锁
破坏请求与保持条件（一次性请求所有条件）  
破坏不剥夺条件（如果申请的资源被锁了，则释放自己持有的资源）  
破坏循环等待条件（例如两个资源 o1, o2，则多个线程都按照 o1->o2 的顺序申请资源）  


## sleep 和 wait 方法的区别
sleep 和 wait 都是将线程进入等待态  
最大的区别就是 sleep 不释放持有的锁， wait 释放锁  
wait 是对象的方法，sleep 是线程的方法  

## JMM
cpu有自己的内存模型，例如三级缓存、三级缓存等等。  
Java 由于跨平台的特性，就自己提供了一套内存模型，就是 JMM。  
可以把 JMM 看作是 Java 定义的并发编程的一组规范，抽象了线程和主内存的直接的关系，规定了Java源码到 cup指令的规范，主要是为了简化多线程编程增强可移植性。  

## JVM内存区域和 JMM内存模型
JVM 内存区域定义了 Java 虚拟机在运行的时，分区存储程序数据，比如堆存放对象等。   
JMM 主要是程序的并发有关，抽象了线程和主内存的关系，比如共享变量必须在主内存中等等，主要是为了简化多线程编程，增强系统可移植性。  

## happens-before 原则
> **操作1** happens-before **操作2**，意味着 **操作1** 的结果对 **操作2** 是可见的。  
> 即使 **操作1** 和 **操作2** 不在一个线程中，JMM也会保证 **操作1** 的结果也对 **操作2** 可见。  

### happens-before 的一些规则
1. 程序顺序规则，线程按照书写顺序执行  
2. 结锁规则，结锁 happens-before 于 加锁  
3. volatile 变量规则，volatile 变量的写操作 happens-before 与所有的读操作  
4. 传递规则 A happens-before B, B happens-before C， 那么 A happens-before C  
5. 线程启动规则 线程的 start happens-before 线程的所有的动作。  

## Volatile
volatile 写操作 happens-before 所有的读操作，保证变量的可见性  
volatile 还可以防止指令重排，使用 Unsafe 的 内存屏障实现。  


## 中断
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

## ThreadLocal
ThreadLocal 的实现机制主要依赖于 ThreadLocalMap 类。  
每个 Thread 对象中都包含一个 ThreadLocalMap 类型的成员变量 threadLocals，用于存储线程局部变量。  
ThreadLocalMap 中的键是 ThreadLocal 对象，值是线程局部变量的值。  

- set 方法：通过当前线程获取其 threadLocals，然后将 ThreadLocal 对象作为键，线程局部变量作为值存入 ThreadLocalMap。
- get 方法：通过当前线程获取其 threadLocals，然后根据 ThreadLocal 对象获取对应的线程局部变量值。
- remove 方法：通过当前线程获取其 threadLocals，然后移除对应的 ThreadLocal 对象及其对应的值。

### 注意事项
- 避免内存泄漏：及时清理不再需要的 ThreadLocal 对象，以免造成内存泄漏。
- 使用结束后及时清理：线程池中的线程在使用完毕后需要手动清理 ThreadLocal 的值，以免线程重用时出现数据混乱。
- 谨慎使用 initialValue 方法：如果使用 initialValue 方法初始化 ThreadLocal，该方法可能会被多次调用，可以使用 withInitial 方法代替。
> ThreadLocalMap 的key 是弱引用，当没有变量指向 ThreadLocal 对象的时候发生GC，若引用将会被回收，此时 key = null, val != null 就发生了内存泄漏。  
如果使用线程池，则线程方法退出时候，在finally 方法中一定要调用一次 remove，防止脏数据。

## InheritableThreadLocal
InheritableThreadLocal 是 ThreadLocal 的一个子类，它与 ThreadLocal 类似，但具有一个额外的特性：子线程可以继承父线程的 InheritableThreadLocal 变量的值。    
InheritableThreadLocal 的实现机制与 ThreadLocal 类似，都是通过 ThreadLocalMap 类来实现的。  
区别在于，InheritableThreadLocal 在线程创建时，会将父线程的 InheritableThreadLocal 变量的值复制一份到子线程的 ThreadLocalMap 中。

## 线程池
### 创建线程池
通过 ThreadPoolExecutor 来创建线程池
### 参数
coreSize maxSize threadFactory, 等待队列，拒绝策略，回收时间/单位（当最大线程数大于核心线程数时的回收时间）  
### 提供的拒绝策略
1. 抛出异常，
2. 使用提交线程2的线程1直接执行线程2。
3. 直接拒绝
4. 丢弃最早提交的未执行线程

## Future & CompletableFuture

### `Future`
#### 主要方法

- `boolean cancel(boolean mayInterruptIfRunning)`：尝试取消任务的执行。
- `boolean isCancelled()`：如果任务在完成前被取消，则返回 `true`。
- `boolean isDone()`：如果任务已完成，则返回 `true`。
- `V get()`：等待任务完成并返回结果，如果任务被取消或发生异常，则抛出相应的异常。
- `V get(long timeout, TimeUnit unit)`：等待最多给定的时间以获取任务结果。

#### 示例

```java
import java.util.concurrent.*;

public class FutureExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Integer> future = executor.submit(() -> {
            TimeUnit.SECONDS.sleep(2);
            return 123;
        });

        System.out.println("Future result: " + future.get()); // 等待并获取结果
        executor.shutdown();
    }
}
```

### `CompletableFuture`
`CompletableFuture` 是 `Future` 的一个实现，并且扩展了 `Future`，提供了更多的功能。  
`CompletableFuture` 支持完成计算、组合多个异步任务以及响应计算结果。

- 手动完成：可以手动设置完成状态和结果。
- 异步回调：支持多种方式的回调，如 `thenApply`、`thenAccept`、`thenRun` 等。
- 组合操作：支持多个 `CompletableFuture` 的组合操作，如 `thenCombine`、`thenCompose` 等。
- 异常处理：支持异步任务的异常处理，如 `exceptionally`、`handle` 等。

#### 主要方法

- `static CompletableFuture<T> supplyAsync(Supplier<T> supplier)`：异步执行一个任务，返回一个 `CompletableFuture`。
- `CompletableFuture<T> thenApply(Function<? super T,? extends U> fn)`：当 `CompletableFuture` 完成时，应用函数并返回新的 `CompletableFuture`。
- `CompletableFuture<Void> thenAccept(Consumer<? super T> action)`：当 `CompletableFuture` 完成时，应用消费函数。
- `CompletableFuture<Void> thenRun(Runnable action)`：当 `CompletableFuture` 完成时，执行一个 `Runnable`。
- `CompletableFuture<T> exceptionally(Function<Throwable,? extends T> fn)`：当 `CompletableFuture` 完成时，如果出现异常，应用给定的函数并返回新的 `CompletableFuture`。
- `CompletableFuture<T> handle(BiFunction<? super T, Throwable, ? extends T> fn)`：当 `CompletableFuture` 完成时，无论是否异常，应用给定的函数并返回新的 `CompletableFuture`。

#### 示例
```java
import java.util.concurrent.*;

public class CompletableFutureExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            return 123;
        });

        future.thenAccept(result -> System.out.println("Future result: " + result));
        
        // 等待所有异步任务完成
        CompletableFuture<Void> allOf = CompletableFuture.allOf(future);
        allOf.join();
    }
}

// 线程池执行
public class CompletableFutureWithThreadPool {
    public static void main(String[] args) {
        // 创建一个自定义线程池
        ExecutorService executor = Executors.newFixedThreadPool(5);

        // 使用线程池执行异步任务
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            return 123;
        }, executor);

        // 处理异步任务结果
        future.thenAccept(result -> System.out.println("Result: " + result));

        // 关闭线程池
        executor.shutdown();
    }
}

// 多个线程池组合
import java.util.concurrent.*;

public class CompletableFutureMultipleTasks {
    public static void main(String[] args) {
        // 创建一个自定义线程池
        ExecutorService executor = Executors.newFixedThreadPool(5);

        // 异步任务 1
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            return 10;
        }, executor);

        // 异步任务 2
        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            return 20;
        }, executor);

        // 组合两个异步任务的结果
        CompletableFuture<Integer> combinedFuture = future1.thenCombineAsync(future2, (result1, result2) -> result1 + result2, executor);

        // 处理组合结果
        combinedFuture.thenAccept(result -> System.out.println("Combined Result: " + result));

        // 关闭线程池
        executor.shutdown();
    }
}

// 异常处理
public class CompletableFutureWithExceptionHandling {
    public static void main(String[] args) {
        // 创建一个自定义线程池
        ExecutorService executor = Executors.newFixedThreadPool(5);

        // 异步任务
        CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            if (true) {
                throw new RuntimeException("Simulated error");
            }
            return 123;
        }, executor);

        // 异常处理
        future.exceptionally(ex -> {
            System.out.println("Exception: " + ex.getMessage());
            return -1;
        }).thenAccept(result -> System.out.println("Result: " + result));

        // 关闭线程池
        executor.shutdown();
    }
}

```



### AQS
抽象队列同步器  
它是锁的基础，内部维护了一个 volatile 的变量 state，和一个 CLH 队列，队列里线程信息，线程 waitSatus, 前驱节点，后继节点。  
例如信号量（semaphore(5)）就是把 state 设置成5，多个线程申请的时候通过 CAS 来进行减少，减到0则不可再减少。  
CountDownLatch 同理  
























