---
title: JDK21新特性(LTS)
category:
  - Java
order: 77
tag:
  - Java基础
  - JDK
---

## JDK21 新特性

JDK 21 于 2023 年 9 月发布，作为一个长期支持版本（LTS），前几个版本中很多特性在这个版本正式的发布了，所以如果觉得升级 JDK17 没有一步到位，也可以直接升级到 JDK21。 

### 1. 虚拟线程（正式）

虚拟线程在 JDK 21 中正式发布，它们是轻量级的线程，能够大规模创建，极大地简化了并发编程的复杂度。虚拟线程与传统的 Java 线程 API 完全兼容，但由于它们的轻量级特性，可以更高效地处理大量并发任务。


```java
public class VirtualThreadExample {
    public static void main(String[] args) throws InterruptedException {
        Thread.startVirtualThread(() -> {
            try {
                Thread.sleep(1000);
                System.out.println("Hello from a virtual thread!");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        Thread.sleep(2000); // 等待虚拟线程完成
    }
}
```

#### 使用场景

- 高并发服务器
- 大规模并行计算
- I/O 密集型任务

### 2. 记录模式（正式）

记录模式在 JDK 21 中正式发布，它允许开发者在模式匹配中使用记录（Record），从而简化了对复杂数据结构的解构和匹配。记录模式使得代码更加简洁和易于维护。

```java
public record Point(int x, int y) {}

public class RecordPatternExample {
    public static void main(String[] args) {
        Object obj = new Point(10, 20);

        if (obj instanceof Point(int x, int y)) {
            System.out.println("Point x: " + x + ", y: " + y);
        }
    }
}
```

#### 使用场景

- 数据解构和匹配
- 复杂数据处理

### 3. 模式匹配 for `switch`（正式）
模式匹配 `switch` 语句在 JDK 21 中正式发布，支持更复杂的条件判断和类型匹配。开发者可以使用 `switch` 语句进行更灵活的模式匹配，简化代码逻辑。

```java
public class PatternMatchingSwitchExample {
    public static void main(String[] args) {
        Object obj = "Hello";

        String result = switch (obj) {
            case String s when s.length() > 5 -> "Long String";
            case String s -> "Short String";
            case Integer i -> "Integer: " + i;
            default -> "Unknown type";
        };

        System.out.println(result); // 输出: Long String
    }
}
```

#### 使用场景

- 类型安全的模式匹配
- 复杂条件的简化表达

### 4. 外部函数和内存 API（正式）

外部函数和内存 API 在 JDK 21 中正式发布，它们提供了一种高效、安全的方式来操作非堆内存和调用本地代码。这些 API 简化了与 C/C++ 代码的集成，并且提升了性能。


```java
import jdk.incubator.foreign.*;

public class ForeignMemoryExample {
    public static void main(String[] args) {
        try (MemorySegment segment = MemorySegment.allocateNative(1024)) {
            MemoryAccess.setByteAtOffset(segment, 0, (byte) 42);
            byte value = MemoryAccess.getByteAtOffset(segment, 0);
            System.out.println("Value: " + value); // 输出: Value: 42
        }
    }
}
```

#### 使用场景

- 本地库调用
- 高性能数据处理

### 5. 结构化并发（正式）

结构化并发（Structured Concurrency）是一种编程模型，旨在管理并发任务的生命周期，使得并发任务的创建和资源的释放可以像作用域一样管理。它使得并发操作的边界清晰可见，简化了并发代码的编写和调试。

#### 主要特点

- 任务作用域：任务的生命周期与它们的作用域绑定，确保任务在作用域结束时全部完成。
- 资源管理：自动管理资源，减少资源泄漏的风险。
- 错误传播：通过结构化并发，错误可以在任务之间传递，使得异常处理更为简单和一致。
- 调试简化：任务的生命周期清晰，减少了调试并发问题的复杂性。

### 5.1 结构化并发的实现

结构化并发使用了 `ExecutorService` 提供的服务，  
特别是 `ExecutorService.newStructuredExecutor()` 方法来创建一个结构化的执行器。这个执行器负责管理任务的执行和资源的自动释放。

#### Scope 和 Subtask

- Scope：定义了任务的生命周期范围。所有的并发任务在 Scope 结束之前必须完成。
- Subtask：在 Scope 内部创建的并发任务，必须在 Scope 结束之前完成。

#### 示例代码

以下是一个使用结构化并发的简单示例，展示了如何使用 `ExecutorService` 和 `Scope` 来管理并发任务。

```java
import java.util.concurrent.*;

public class StructuredConcurrencyExample {
    public static void main(String[] args) {
        // 创建 Scope：使用 `StructuredTaskScope.ShutdownOnFailure` 创建了一个结构化的任务作用域。它会在任何一个任务失败时自动关闭作用域。
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

            // 创建任务：使用 `scope.fork()` 创建两个并发任务。`fork()` 方法会启动新任务，并返回一个 `Future` 对象，用于获取任务结果。
            Future<String> future1 = scope.fork(() -> {
                Thread.sleep(1000); // 模拟一些耗时的操作
                return "Task 1 completed";
            });

            Future<String> future2 = scope.fork(() -> {
                Thread.sleep(500); // 模拟一些耗时的操作
                return "Task 2 completed";
            });

            // 等待任务完成：使用 `scope.join()` 等待所有任务完成。`join()` 方法会阻塞当前线程，直到所有任务完成或出现异常。
            scope.join();  // 等待所有任务完成

            // 获取结果
            // 获取结果：使用 `future.resultNow()` 获取任务结果。`resultNow()` 方法会在任务完成后立即返回结果。
            System.out.println(future1.resultNow());
            System.out.println(future2.resultNow());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

#### 运行结果

```
Task 1 completed
Task 2 completed
```

#### 结构化并发的优点

1. 简化代码：结构化并发使得并发代码更易于编写和理解，减少了并发代码的复杂性。
2. 资源安全：自动管理资源的分配和释放，减少了资源泄漏的风险。
3. 错误处理：通过 Scope 的管理，错误可以在任务之间传递，简化了错误处理。
4. 调试友好：任务的生命周期与作用域绑定，减少了并发问题的调试难度。

#### 结构化并发的应用场景

- 高并发服务器：结构化并发可以有效管理大规模的并发任务，适用于高并发服务器开发。
- 数据处理：在需要处理大量并发数据的应用中，结构化并发可以简化代码和提高效率。
- 任务调度：适用于需要动态管理并发任务的应用，如任务调度系统。


### 6. 向量 API（正式）

Vector API 在 JDK 21 中正式发布，它允许开发者利用 SIMD 指令编写高性能的向量化代码。Vector API 提供了丰富的数据类型和向量操作，使得数据密集型应用能够获得显著的性能提升。


```java
import jdk.incubator.vector.*;

public class VectorExample {
    public static void main(String[] args) {
        var species = FloatVector.SPECIES_256;
        var a = FloatVector.fromArray(species, new float[] {1, 2, 3, 4, 5, 6, 7, 8}, 0);
        var b = FloatVector.fromArray(species, new float[] {8, 7, 6, 5, 4, 3, 2, 1}, 0);
        var c = a.add(b);

        float[] result = new float[species.length()];
        c.intoArray(result, 0);
        System.out.println(Arrays.toString(result)); // 输出: [9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0]
    }
}
```

#### 使用场景

- 数值计算
- 数据分析


### 7. Java ZGC 增强

在 JDK 21 中，ZGC（Z Garbage Collector）迎来了多项显著的增强和改进。ZGC 是一种低延迟垃圾收集器，旨在提供高吞吐量和短暂停时间，使得应用程序能够在处理大量数据和高并发任务时保持稳定的性能。

[ZGC详解](https://opentp.cn/blog/java/jdk-zgc.html)