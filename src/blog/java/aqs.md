---
title: AQS
category:
  - Java
order: 32
tag:
  - Java基础
  - AQS
---

## AQS
`AbstractQueuedSynchronizer`（简称 AQS）是 Java 并发包（java.util.concurrent）中的一个核心组件，它为实现同步器（如 ReentrantLock、Semaphore、CountDownLatch 等）提供了一个框架。AQS 通过一个先进先出（FIFO）的等待队列来管理获取锁的线程，并通过一个整型状态变量来表示同步状态。

## AQS 的设计与结构
AQS 是一个抽象类，不能直接使用，需要通过继承来实现具体的同步器。AQS 提供了基本的同步机制和等待队列管理，具体的同步逻辑由子类实现。

### 主要成员变量
- 同步状态 (state)：一个 `volatile int` 类型的变量，表示当前的同步状态。子类通过 `getState()`、`setState(int newState)` 和 `compareAndSetState(int expect, int update)` 方法来访问和修改同步状态。
- 等待队列 (wait queue)：一个 FIFO 队列，用于管理等待获取锁的线程。等待队列的节点类型为 `Node`，每个节点包含一个线程引用和状态信息。

### 主要内部类
- Node：表示等待队列中的一个节点，包含线程引用、等待状态和指向前后节点的指针。
- ConditionObject：实现了 `Condition` 接口，用于管理线程等待队列，实现条件变量。

### 主要方法
- 独占模式：仅一个线程能获取锁，常用于实现独占锁（如 ReentrantLock）。
  - `acquire(int arg)`：以独占模式获取锁，如果锁不可用则将当前线程加入等待队列。
  - `release(int arg)`：释放独占模式下的锁，唤醒等待队列中的下一个线程。
- 共享模式：多个线程能共享锁，常用于实现信号量（如 Semaphore）。
  - `acquireShared(int arg)`：以共享模式获取锁，如果锁不可用则将当前线程加入等待队列。
  - `releaseShared(int arg)`：释放共享模式下的锁，唤醒等待队列中的一个或多个线程。

## AQS 的工作原理
AQS 的工作原理可以分为两个部分：同步状态的管理和等待队列的管理。

### 同步状态的管理
同步状态是 AQS 的核心，通过一个整型变量 `state` 来表示。子类需要实现 `tryAcquire(int arg)`、`tryRelease(int arg)`、`tryAcquireShared(int arg)` 和 `tryReleaseShared(int arg)` 方法，以定义具体的同步逻辑。
- tryAcquire(int arg)：尝试以独占模式获取锁。成功返回 true，失败返回 false。
- tryRelease(int arg)：尝试释放独占模式下的锁。成功返回 true，失败返回 false。
- tryAcquireShared(int arg)：尝试以共享模式获取锁。返回大于等于 0 表示成功，返回小于 0 表示失败。
- tryReleaseShared(int arg)：尝试释放共享模式下的锁。成功返回 true，失败返回 false。

### 等待队列的管理
等待队列是一个 FIFO 队列，用于管理获取锁失败的线程。每个节点包含线程引用和状态信息，当线程获取锁失败时，将其加入等待队列，并在锁释放时唤醒等待队列中的线程。
- enq(Node node)：将节点加入等待队列的尾部。
- addWaiter(Node mode)：创建节点并加入等待队列。
- acquireQueued(Node node, int arg)：以独占模式获取锁，如果锁不可用则将当前线程加入等待队列，并在锁可用时获取锁。
- doReleaseShared()：释放共享模式下的锁，并唤醒等待队列中的一个或多个线程。

## AQS 的应用

### ReentrantLock
ReentrantLock 是一个基于 AQS 实现的独占锁。它支持可重入、锁超时和中断。ReentrantLock 通过继承 AQS 并实现 `tryAcquire(int arg)` 和 `tryRelease(int arg)` 方法来定义独占锁的逻辑。

```java
public class ReentrantLock implements Lock, java.io.Serializable {
    private final Sync sync;

    abstract static class Sync extends AbstractQueuedSynchronizer {
        abstract void lock();

        @Override
        protected final boolean tryAcquire(int acquires) {
            // 实现获取锁的逻辑
        }

        @Override
        protected final boolean tryRelease(int releases) {
            // 实现释放锁的逻辑
        }
    }

    static final class NonfairSync extends Sync {
        final void lock() {
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
    }

    static final class FairSync extends Sync {
        final void lock() {
            acquire(1);
        }

        @Override
        protected final boolean tryAcquire(int acquires) {
            // 实现公平锁获取的逻辑
        }
    }

    public ReentrantLock() {
        sync = new NonfairSync();
    }

    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }

    public void lock() {
        sync.lock();
    }

    public void unlock() {
        sync.release(1);
    }
}
```

### Semaphore

Semaphore 是一个基于 AQS 实现的共享锁。它允许多个线程获取共享资源，控制并发数量。Semaphore 通过继承 AQS 并实现 `tryAcquireShared(int arg)` 和 `tryReleaseShared(int arg)` 方法来定义共享锁的逻辑。

```java
public class Semaphore implements java.io.Serializable {
    private final Sync sync;

    abstract static class Sync extends AbstractQueuedSynchronizer {
        Sync(int permits) {
            setState(permits);
        }

        final int getPermits() {
            return getState();
        }

        @Override
        protected final int tryAcquireShared(int acquires) {
            // 实现获取共享锁的逻辑
        }

        @Override
        protected final boolean tryReleaseShared(int releases) {
            // 实现释放共享锁的逻辑
        }
    }

    public Semaphore(int permits) {
        sync = new NonfairSync(permits);
    }

    public void acquire() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    public void release() {
        sync.releaseShared(1);
    }
}
```

### CountDownLatch

CountDownLatch 是一个基于 AQS 实现的同步工具类。它允许一个或多个线程等待一组操作完成。CountDownLatch 通过继承 AQS 并实现 `tryAcquireShared(int arg)` 和 `tryReleaseShared(int arg)` 方法来定义同步逻辑。

```java
public class CountDownLatch {
    private final Sync sync;

    private static final class Sync extends AbstractQueuedSynchronizer {
        Sync(int count) {
            setState(count);
        }

        int getCount() {
            return getState();
        }

        @Override
        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;
        }

        @Override
        protected boolean tryReleaseShared(int releases) {
            // 实现释放逻辑
        }
    }

    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
    }

    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    public void countDown() {
        sync.releaseShared(1);
    }

    public long getCount() {
        return sync.getCount();
    }
}
```

## 总结
AQS 是 Java 并发包中的一个强大且灵活的同步框架。通过 AQS，可以轻松地实现各种类型的同步器，如独占锁、共享锁和同步工具。理解 AQS 的设计与工作原理，对于深入掌握 Java 并发编程至关重要。在实际开发中，可以根据具体需求，继承 AQS 并实现相应的方法，以构建高效、健壮的并发控制机制。