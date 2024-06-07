---
title: JDk10新特性
category:
  - Java
order: 72
tag:
  - Java基础
  - JDK
---

JDK10 于 2018 年 3 月发布。

### 1. 局部变量类型推断
JDK 10 引入了 `var` 关键字，允许开发者在使用局部变量时不必显式声明其类型，而是由编译器根据变量的初始赋值自动推断类型。

#### 使用示例：局部变量类型推断

让我们详细看看局部变量类型推断的一个使用示例：

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TypeInferenceExample {
    public static void main(String[] args) {
        // 使用 var 进行类型推断
        var list = new ArrayList<String>();
        list.add("Java 10");
        list.add("Type Inference");

        for (var item : list) {
            System.out.println(item);
        }

        // 使用 var 声明 Map
        var map = new HashMap<String, Integer>();
        map.put("one", 1);
        map.put("two", 2);

        for (var entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

### 2. 统一的垃圾回收接口（Garbage-Collector Interface）
JDK 10 引入了一个统一的垃圾回收接口，使得不同的垃圾回收器可以更加方便地集成和替换。此接口旨在为未来的垃圾回收器提供一个一致的框架。

### 3. 并行化全局垃圾回收（JEP 307: Parallel Full GC for G1）
JDK 10 为 G1 垃圾回收器引入了并行化的全局垃圾回收，这意味着在内存回收过程中可以使用多线程，从而提高了性能和减少了停顿时间。  
从 Java9 开始 G1 就了默认的垃圾回收器，但是 Java9 的 G1 的 FullGC 依然是使用单线程去完成标记清除，为了最大限度地减少 Full GC 造成的应用停顿的影响，从 Java10 开始，G1 的 FullGC 改为并行的标记清除算法。

### 4. 应用程序类数据共享（JEP 310）
该特性扩展了现有的类数据共享（CDS）机制，使得应用程序类也可以共享。通过共享类元数据和其他数据，可以加快 JVM 的启动速度，并减少内存使用。   

JDK5 中就已经引入了类数据共享机制 (Class Data Sharing，简称 CDS)，允许将一组类预处理为共享归档文件，以便在运行时能够进行内存映射以减少 Java 程序的启动时间，当多个 Java 虚拟机（JVM）共享相同的归档文件时，还可以减少动态内存的占用量，同时减少多个虚拟机在同一个物理或虚拟的机器上运行时的资源占用。  

Java 10 对 CDS 再次拓展，其原理为：在启动时记录加载类的过程，写入到文本文件中，再次启动时直接读取此启动文本并加载。如果应用环境没有大的变化，启动速度就会得到提升。  

### 5. 线程局部管控
引入了线程本地握手机制，使得 JVM 可以在不停止所有线程的情况下执行线程本地的操作，如暂停和恢复单个线程。这个特性增强了 JVM 的性能和灵活性。

### 6. 实验性的基于 Java 的 JIT 编译器
引入了实验性的基于Java的JIT编译器，提供了一种新的JIT编译器原型，旨在提高峰值性能并减少JVM的内存占用。

### 7. 根证书（Root Certificates）（JEP 319: Root Certificates）
JDK 10 将一组默认的根证书添加到 JDK 中，以便开发人员可以更轻松地进行安全通信，而无需手动配置证书。这样可以简化 SSL/TLS 的设置过程。

### 8. 集合增强&流API
包括集合类（List、Set、Map）的copyOf方法，允许创建集合的不可变副本；  
ByteArrayOutputStream 和 ByteArrayInputStream 的 toString(Charset charset)方法， 提供了按照指定字符集将字节数据转换为字符串的能力；  
以及 InputStream 和 Reader 的 transferTo 方法，简化了数据传输操作。  