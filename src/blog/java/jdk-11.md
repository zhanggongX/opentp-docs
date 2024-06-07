---
title: JDk11新特性
category:
  - Java
order: 73
tag:
  - Java基础
  - JDK
---

## JDK 11 的新特性

Java 11，作为一个长期支持（LTS）的版本，于 2018 年 9 月正式发布。

## 1. 局部变量的类型推断
Java 11 进一步扩展了局部变量类型推断（introduced in Java 10），允许在 Lambda 表达式中使用 `var` 关键字。这不仅使代码更加简洁，还使得在 Lambda 表达式中添加注解变得更加容易。

```java
import java.util.function.Consumer;

public class LambdaVarExample {
    public static void main(String[] args) {
        Consumer<String> consumer = (var x) -> System.out.println(x.toUpperCase());
        consumer.accept("Hello, JDK 11!");
    }
}
```

## 2. 嵌套基于类的访问控制

JDK 11 引入了嵌套基于类的访问控制，旨在解决嵌套类访问外部类私有成员的问题。这一特性增强了嵌套类之间的访问控制，避免了不必要的暴露。

```java
public class OuterClass {
    private String outerField = "Hello from Outer";

    class InnerClass {
        void printOuterField() {
            // `InnerClass` 可以直接访问 `OuterClass` 的私有字段 `outerField`，无需额外的访问方法。
            System.out.println(outerField); // 直接访问外部类的私有成员
        }
    }

    public static void main(String[] args) {
        OuterClass outer = new OuterClass();
        InnerClass inner = outer.new InnerClass();
        inner.printOuterField();
    }
}
```

## 3. HTTP Client API

JDK 11 正式将新的 HTTP Client API 标准化，它支持现代化的 HTTP/2 协议，简化了异步和同步 HTTP 请求的处理。这使得网络编程更加便捷和高效。

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpClientExample {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://jsonplaceholder.typicode.com/posts"))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}
```

## 4. 动态类文件常量

JDK 11 引入了 `ConstantDynamic`，它允许在类文件中延迟加载常量。这减少了类文件的大小和类加载时间，从而提高了应用程序的性能。

```java
import java.lang.invoke.*;
public class ConstantDynamicExample {

    public static void main(String[] args) throws Throwable {

        MethodHandles.Lookup lookup = MethodHandles.lookup();
        CallSite callSite = ConstantBootstraps.makeConstant(lookup, "constantName", MethodType.methodType(String.class), "Hello, Dynamic Constant!");
        String constant = (String) callSite.getTarget().invoke();

        System.out.println(constant);
    }
}
```

## 5. ZGC 和 Epsilon 垃圾回收器

JDK 11 引入了两个新的垃圾回收器：ZGC（Z Garbage Collector）和 Epsilon。

- **ZGC** 是一个可伸缩、低延迟的垃圾回收器，适合处理大规模内存堆。它能够将暂停时间保持在 10 毫秒以下，从而提高了应用程序的性能。

```bash
# 使用 ZGC 运行应用
java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xmx10G -jar myapp.jar
```

- **Epsilon** 是一个“无操作”的垃圾回收器，不执行任何内存回收操作。它适用于内存管理不重要的短期任务，或需要确定性内存行为的场景。

```bash
# 使用 Epsilon GC 运行应用
java -XX:+UnlockExperimentalVMOptions -XX:+UseEpsilonGC -Xmx1G -jar myapp.jar
```

## 6. 运行时编译

JDK 11 允许开发者直接运行单个 Java 源文件，而不需要先进行编译。这一特性极大地简化了小型 Java 程序的开发和测试过程。

```bash
# 直接运行 Java 源文件
java HelloWorld.java
```

这种方式非常适合快速验证代码片段或进行简单的开发任务。
> 脚本化了

## 7. Flight Recorder

Flight Recorder 是一个轻量级的事件收集框架，用于监控和分析 Java 应用程序的性能。它集成到 JDK 中，帮助开发者诊断性能问题。

```bash
# 启用 Flight Recorder
java -XX:StartFlightRecording=duration=60s,filename=myrecording.jfr -jar myapp.jar
```

Flight Recorder 提供了详细的运行时数据，便于开发者深入了解应用程序的行为和性能瓶颈。

## 8. 移除 Java EE 和 CORBA 模块

Java 11 移除了 Java EE（Enterprise Edition）和 CORBA（Common Object Request Broker Architecture）模块，这些模块在 JDK 9 中已经被标记为弃用。

```bash
# Java EE 和 CORBA 模块在 JDK 11 中被移除
# 例如：javax.xml.bind, javax.activation 等
```

这意味着开发者需要寻找替代的解决方案，如使用外部库来实现相关功能。

## 9. 字符串和文件API的增强
Java 11为 String 类和 Files 类添加了一些新的方法，如 isBlank、lines、strip、repeat 等，以简化常见的字符串操作和文件读写操作。