---
title: JDk9新特性
category:
  - Java
order: 70
tag:
  - Java基础
  - JDK
---

## JDK9
### 1. 模块化
Java 平台模块系统，也称为 Project Jigsaw，是 JDK 9 引入的一个重大特性。它允许开发者将代码组织成模块，并定义模块之间的依赖关系。模块化系统使得应用程序的结构更加清晰和安全。  

模块化的核心是 `module-info.java` 文件，它定义了模块的元数据，包括模块的名称、导出的包、需要的其他模块等。
```java
// 示例：module-info.java
module com.example.myapp {
    // 表示需要的其他模块
    requires java.base;

    // 导出包，使得其他模块可以访问
    exports com.example.myapp.api;
}
```

#### 模块化的关键概念
- 模块（Module）：模块是模块化系统中的基本单位，包含了一组相关的类、接口和资源。
- 模块描述文件（module-info.java）：每个模块都有一个 `module-info.java` 文件，用于声明模块的名称、导出的包、依赖的模块等。
- 导出（Exports）：模块可以导出一个或多个包，使得其他模块可以访问这些包中的公共类。
- 开放（Opens）：模块可以开放某些包，允许其他模块通过反射访问这些包中的类。
- 依赖（Requires）：模块可以声明对其他模块的依赖关系。


### 2. JShell: 交互式编程工具
JShell 是一个交互式的 REPL（Read-Eval-Print Loop）工具，允许开发者像 Python 那样在命令行中快速测试和运行 Java 代码片段。
```sh
$ jshell
|  Welcome to JShell -- Version 9
|  For an introduction type: /help intro

jshell> int x = 10
x ==> 10

jshell> System.out.println(x * 2)
20
```

### 3. 新的 HTTP/2 客户端 API
JDK 9 引入了一个新的 HTTP/2 客户端 API，它提供了对 HTTP/2 和 WebSocket 的支持，允许开发者更高效地进行网络编程。

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(new URI("http://example.com"))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

### 4. 多版本 JAR 文件
多版本 JAR 文件允许开发者在同一个 JAR 文件中包含针对不同 Java 版本的类文件，从而在保持向后兼容的同时利用新版本的特性。

```sh
$ jar --create --file mrjar-example.jar --release 9 -C classes9 .
```

### 5. 集合增强
JDK 9 引入了便捷的集合工厂方法，允许开发者使用简洁的语法创建不可变集合。

```java
List<String> list = List.of("a", "b", "c");
Set<String> set = Set.of("a", "b", "c");
Map<String, Integer> map = Map.of("a", 1, "b", 2, "c", 3);
```

### 6. 流式 API 增强
JDK 9 对流 API 进行了增强，新增了一些方便的方法，如 `takeWhile`, `dropWhile` 和 `iterate`。

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
List<Integer> result = numbers.stream()
    .takeWhile(n -> n < 5)
    .collect(Collectors.toList());
System.out.println(result); // 输出: [1, 2, 3, 4]
```

### 7. 私有接口方法
JDK 9 允许在接口中定义私有方法，从而重用接口中的代码，提高代码的可维护性。

```java
public interface MyInterface {
    default void defaultMethod() {
        commonMethod();
    }

    private void commonMethod() {
        System.out.println("This is a private method");
    }
}
```

### 8. 进程 API 增强
JDK 9 对进程 API 进行了增强，提供了对进程信息和管理的更好支持。

```java
ProcessHandle currentProcess = ProcessHandle.current();
System.out.println("PID: " + currentProcess.pid());
```

### 9. try-with-resources
- 增强的 try-with-resources：在 JDK 9 中，try-with-resources 语句可以更加简洁地使用已经声明的资源。

  ```java
  BufferedReader reader = new BufferedReader(new FileReader("test.txt"));
  try (reader) {
      System.out.println(reader.readLine());
  }
  ```

### 10. 增强的 CompletableFuture API
JDK 9 对 `CompletableFuture` 增加了许多新方法，如 `newIncompleteFuture`, `minimalCompletionStage`, `orTimeout`, `completeOnTimeout` 等。

  ```java
  CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello")
      .orTimeout(1, TimeUnit.SECONDS)
      .exceptionally(ex -> "Timed out");
  ```

## G1
JDK9默认垃圾回收器是 G1（Garbage First）  
G1 垃圾收集器是 Oracle 为 Java 7 及后续版本开发的一种面向多核处理器和大内存容量的服务器级垃圾收集器。  
G1 收集器旨在替代并行收集器（Parallel GC）和并发标记清除收集器（CMS）。G1 旨在提供高吞吐量和低暂停时间的平衡，适用于大多数服务器端应用。

### G1 收集器的特点

1. 区域化内存管理：
   - G1 将堆划分为多个相同大小的区域（Region），每个区域的大小可以在 1MB 到 32MB 之间自动调整。
   - 每个区域可以扮演不同的角色，如 Eden 区、Survivor 区和 Old 区。这种设计使得内存管理更加灵活和高效。

2. 并行和并发：
   - G1 使用多个 GC 线程来并行地执行垃圾收集工作，充分利用多核处理器的优势。
   - G1 进行并发标记，可以在应用程序运行时进行一些垃圾收集工作，减少应用程序停顿时间。

3. 预测停顿时间：
   - G1 可以通过设置最大停顿时间目标来预测和控制垃圾收集的停顿时间。
   - G1 根据停顿时间目标，智能地选择需要回收的区域，尽量满足用户设定的停顿时间要求。

4. 混合垃圾收集：
   - G1 结合了 Young Generation 和 Old Generation 的垃圾收集，进行混合垃圾收集（Mixed GC），提高了垃圾收集的效率。
   - 在混合垃圾收集阶段，G1 不仅回收年轻代的垃圾，还回收一些老年代的垃圾。

### G1 收集器的工作原理

1. 初始标记（Initial Marking）：
   - 初始标记阶段标记所有从 GC Roots 可达的对象。这个阶段需要暂停所有应用线程（STW，Stop The World），但时间很短。

2. 并发标记（Concurrent Marking）：
   - 并发标记阶段在应用程序运行的同时进行，标记所有存活的对象。这个阶段不会中断应用程序的执行。

3. 最终标记（Final Marking）：
   - 最终标记阶段需要再次暂停所有应用线程，完成标记过程中遗留的部分。这个阶段的停顿时间也相对较短。

4. 筛选回收（Cleanup）：
   - 筛选回收阶段首先对区域进行排序，确定哪些区域包含最多的垃圾，优先回收这些区域。回收过程同时处理年轻代和老年代的垃圾。

### 使用 G1 收集器的配置

要在 Java 应用中使用 G1 垃圾收集器，可以在启动 JVM 时添加以下参数：

```sh
java -XX:+UseG1GC -jar your-application.jar
```

此外，还可以使用一些其他参数来调整 G1 收集器的行为：

- -XX:MaxGCPauseMillis=\<N\>：设置最大 GC 停顿时间目标（毫秒）。
- -XX:InitiatingHeapOccupancyPercent=\<N\>：设置触发并发标记周期的堆占用百分比。
- -XX:ParallelGCThreads=\<N\>：设置用于并行垃圾收集的线程数。
- -XX:ConcGCThreads=\<N\>：设置用于并发标记的线程数。

### G1 收集器的优点和缺点
优点：
- 可预测的停顿时间：G1 可以设置停顿时间目标，适用于对响应时间要求较高的应用。
- 并行和并发：充分利用多核处理器的优势，提高垃圾收集效率。
- 混合垃圾收集：提高了老年代的回收效率，避免了传统垃圾收集器中的停顿问题。

缺点：
- 复杂性: G1 的内部机制复杂，调优可能需要较多的经验和测试。
- 开销：在某些情况下，G1 的并发操作可能带来额外的 CPU 开销。

### 总结
G1 垃圾收集器是一个面向服务器端应用的高性能垃圾收集器，旨在提供高吞吐量和低停顿时间的平衡。  
通过区域化内存管理、并行和并发回收机制，以及混合垃圾收集策略，G1 能够在大多数情况下有效地管理内存和垃圾收集，适用于现代多核处理器和大内存服务器的应用程序。  
如果你的应用对响应时间和停顿时间有较高要求，可以考虑使用 G1 垃圾收集器。  