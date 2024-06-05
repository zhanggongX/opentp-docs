---
title: 线程池
category:
  - Java
order: 31
tag:
  - Java基础
  - concurrent
  - threadPoolExecuter
---

## 线程池使用示例
```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ThreadPoolExample {

    public static void main(String[] args) {
        // 创建一个线程池，核心线程大小为 3
        ExecutorService executor = new ThreadPoolExecutor(3, 10, 1, TimeUnit.SECONDS, new BlockingArrayQueue<>(1024));

        // 提交任务给线程池执行
        for (int i = 1; i <= 10; i++) {
            // 创建一个任务实例，这里简单打印线程名称和任务编号
            Runnable task = new Task(i);
            // 将任务提交给线程池执行
            executor.execute(task);
        }

        // 关闭线程池
        executor.shutdown();
    }

    // 自定义任务类
    static class Task implements Runnable {
        private final int taskId;

        public Task(int taskId) {
            this.taskId = taskId;
        }

        @Override
        public void run() {
            // 执行任务
            System.out.println("Task " + taskId + " is running on thread: " + Thread.currentThread().getName());
            // 模拟任务执行时间
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Task " + taskId + " completed.");
        }
    }
}

```

结果打印：
```shell
Task 1 is running on thread: pool-1-thread-1
Task 3 is running on thread: pool-1-thread-3
Task 2 is running on thread: pool-1-thread-2
Task 2 completed.
Task 4 is running on thread: pool-1-thread-2
Task 1 completed.
Task 5 is running on thread: pool-1-thread-1
Task 3 completed.
Task 6 is running on thread: pool-1-thread-3
Task 4 completed.
Task 5 completed.
Task 8 is running on thread: pool-1-thread-1
Task 7 is running on thread: pool-1-thread-2
Task 6 completed.
Task 9 is running on thread: pool-1-thread-3
Task 8 completed.
Task 10 is running on thread: pool-1-thread-1
Task 7 completed.
Task 9 completed.
Task 10 completed.
```

线程池首先会先执行 3 个任务，然后这些任务有任务被执行完的话，才会去拿新的任务执行。  
## 分析执行原理

首先看看 `ThreadPoolExecutor` 的 `execute` 方法干了啥。

```java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();

    int c = ctl.get();
    // 获取线程池的状态
    if (workerCountOf(c) < corePoolSize) {
        // 如果当前工作线程数小于核心线程数，则创建新的线程，并启动该线程
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    // 能走到这里，说明工作线程大于核心线程数了
    // 如果线程池是运行状态，并且成功将任务加入到队列中。
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        // 再次检查线程池状态，如果不是运行状态，则从队列中移除任务并执行拒绝策略
        if (!isRunning(recheck) && remove(command))
            reject(command);
        // 如果没有线程在执行任务，则创建新的线程
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    // 如果线程池不是运行状态或无法将任务加入队列，则尝试创建非核心线程来处理任务
    else if (!addWorker(command, false))
        reject(command); // 无法创建线程则执行拒绝策略
}

// 工作线程计数
private int workerCountOf(int c) {
    return c & CAPACITY;
}

// 添加新工作线程
private boolean addWorker(Runnable firstTask, boolean core) {
    retry:
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN && ! (rs == SHUTDOWN && firstTask == null && ! workQueue.isEmpty()))
            return false;

        for (;;) {
            int wc = workerCountOf(c);
            if (wc >= CAPACITY || wc >= (core ? corePoolSize : maximumPoolSize))
                return false;
            if (compareAndIncrementWorkerCount(c))
                break retry;
            c = ctl.get();  // Re-read ctl
            if (runStateOf(c) != rs)
                continue retry;
        }
    }

    boolean workerStarted = false;
    boolean workerAdded = false;
    Worker w = null;
    try {
        w = new Worker(firstTask);
        final Thread t = w.thread;
        if (t != null) {
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                int rs = runStateOf(ctl.get());

                if (rs < SHUTDOWN || (rs == SHUTDOWN && firstTask == null)) {
                    if (t.isAlive()) // precheck that t is startable
                        throw new IllegalThreadStateException();
                    workers.add(w);
                    int s = workers.size();
                    if (s > largestPoolSize)
                        largestPoolSize = s;
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            if (workerAdded) {
                t.start();
                workerStarted = true;
            }
        }
    } finally {
        if (!workerStarted)
            addWorkerFailed(w);
    }
    return workerStarted;
}

// 比较并增加工作线程计数
private boolean compareAndIncrementWorkerCount(int expect) {
    return ctl.compareAndSet(expect, expect + 1);
}

// 获取运行状态
private int runStateOf(int c) {
    return c & ~CAPACITY;
}

// 从工作队列中移除任务
private boolean remove(Runnable task) {
    boolean removed = workQueue.remove(task);
    tryTerminate();
    return removed;
}

// 执行拒绝策略
private void reject(Runnable command) {
    handler.rejectedExecution(command, this);
}
```

### 分析
`execute` 方法首先尝试创建新的核心线程处理任务，如果核心线程数已满，则将任务加入队列。如果队列也满了，最终尝试创建非核心线程处理任务。如果所有资源都已耗尽，则执行拒绝策略。

## 内置线程池（不推荐使用）

1. **FixedThreadPool（固定大小线程池）**：
   - `FixedThreadPool` 是一个固定大小的线程池，其中的线程数量是固定的。
   - 当有新任务提交时，如果当前线程数小于线程池的核心线程数，就会创建一个新线程来执行任务；如果当前线程数已达到核心线程数，则将任务放入阻塞队列中等待执行。
   - 适用于需要限制线程数量的情况，比如并发量已知或受限的情况。
   - FixedThreadPool 线程队列是 LinkedBlockingQueue()，大小为 Integer.MAX_VALUE，使用不当可能导致 OOM。

2. **CachedThreadPool（缓存线程池）**：
   - `CachedThreadPool` 是一个根据需求自动调整大小的线程池。
   - 当有新任务提交时，如果当前线程数小于核心线程数，则会创建一个新线程来执行任务；如果当前线程数已超过核心线程数，且有可用的空闲线程，则会重用空闲线程来执行任务；如果当前线程数已达到最大线程数，且所有线程都在执行任务，此时又有新任务提交，则会创建一个新线程来执行任务。
   - 适用于任务执行时间较短的场景，可以避免线程数量过多导致资源浪费。
   - CachedThreadPool 的最大线程池数是 Integer.MAX_VALUE，所以任务暴增的情况下，完全没有节制，可能会导致 OOM。

3. **SingleThreadExecutor（单线程线程池）**：
   - `SingleThreadExecutor` 是一个只有一个工作线程的线程池。
   - 所有任务都按顺序在同一个线程中执行，确保不会有并发问题。
   - 适用于需要顺序执行任务或者需要保证任务按照特定顺序执行的情况。
   - 问题同 FixedThreadPool，线程队列是 LinkedBlockingQueue()，大小为 Integer.MAX_VALUE，使用不当可能导致 OOM。

4. **ScheduledThreadPool（定时任务线程池）**：
   - `ScheduledThreadPool` 是一个可以执行定时任务的线程池。
   - 可以用来执行延迟任务或周期性任务，支持定时执行任务的功能。
   - 适用于需要执行定时任务的场景，比如定时任务调度、周期性数据处理等。
   - ScheduledThreadPool 任务队列使用 DelayedWorkQueue 添加元素满了之后会自动扩容原来容量的 1/2，最大扩容可达 Integer.MAX_VALUE，使用不当 OOM。

## 线程池的使用建议
1. 使用 ThreadPoolExecutor 构造线程池。
2. 不同业务使用不同的线程池
3. 线程池要命名，容易定位问题
4. 合理设置线程池参数，建议 CPU 密集型 N+1, IO 密集型 2N
> 网络读取，文件读取，数据库读取，这类都是 IO 密集型。
5. 线程池中的的线程的 ThreadLocal 记得删除