---
title: JDk12新特性
category:
  - Java
order: 74
tag:
  - Java基础
  - JDK
---


## JDK 12 的新特性

JDK12 于 2019 年 3 月发布

## 1. Switch 表达式（预览特性）

JDK 12 引入了 `switch` 表达式，作为传统 `switch` 语句的增强版。`switch` 表达式可以返回值，并且支持新的 `case` 标签格式。这一特性目前是作为预览功能提供的，可能会在未来的版本中进行进一步调整。

```java
public class SwitchExpressionExample {
    public static void main(String[] args) {
        int dayOfWeek = 3;

        // `switch` 表达式使用 `->` 语法简化了代码，并返回了一个值 `dayName`。
        String dayName = switch (dayOfWeek) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6 -> "Saturday";
            case 7 -> "Sunday";
            default -> throw new IllegalArgumentException("Invalid day: " + dayOfWeek);
        };

        System.out.println("The day is: " + dayName);
    }
}
```

## 2. JVM 常量 API

JDK 12 引入了一个新的 `jdk.experimental.jvmsymbols` 包，提供了对 JVM 常量的支持。这些 API 允许开发者更方便地访问和操作类文件中的常量池项目。

```java
import java.lang.constant.*;

public class JVMConstantExample {
    public static void main(String[] args) {
        String stringConstant = "Hello, JVM!";
        ConstantDesc constantDesc = ConstantDescs.of(stringConstant);
        System.out.println("Constant: " + constantDesc);

        ClassDesc classDesc = ConstantDescs.of(String.class);
        System.out.println("Class: " + classDesc);
    }
}
```

通过这些 API，开发者可以更容易地操作和使用常量池中的数据。

## 3. G1 垃圾回收器改进
JDK 12 对 G1 垃圾回收器进行了改进，使得 G1 可以自动回收未使用的类。这项增强功能减少了元空间的内存占用，从而提升了垃圾回收的效率。

```bash
# 启用 G1 GC 并自动回收未使用的类
java -XX:+UseG1GC -XX:+ClassUnloadingWithConcurrentMark -jar myapp.jar
```

这项改进对内存管理有显著的优化效果，尤其是对长期运行的应用程序。

## 4. Shenandoah 垃圾回收器（实验性）
JDK 12 引入了 Shenandoah 垃圾回收器，它是一种低暂停时间的垃圾回收器，适用于需要极低延迟的应用场景。Shenandoah 通过在收集期间并发移动活跃对象，最大限度地减少了停顿时间。

```bash
# 使用 Shenandoah GC 运行应用
java -XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -jar myapp.jar
```
Shenandoah GC 适用于对延迟敏感的应用，如金融系统和高性能计算应用。

## 5. 微基准测试套件 Microbenchmark Suite

JDK 12 引入了一个微基准测试套件，作为 JDK 工具的一部分，帮助开发者评估代码性能。这套工具提供了标准化的基准测试机制，用于衡量 Java 代码的性能表现。

```bash
# 运行基准测试
java -jar jmh-samples.jar -f 1 -wi 5 -i 10
```

通过使用这个工具，开发者可以更好地分析和优化代码性能。


这项特性对于简单的代码验证和学习非常有用。

## 8. Raw String Literals（预览特性）

JDK 12 引入了原始字符串字面量（Raw String Literals），它是一种多行字符串表示方法，避免了转义字符的困扰。这一特性目前是作为预览功能提供的。

```java
public class RawStringLiteralExample {
    public static void main(String[] args) {
        String rawString = """
                This is a raw string
                that spans multiple lines.
                No escape sequences here!
                """;
        System.out.println(rawString);
    }
}
```

原始字符串字面量提供了更好的代码可读性，尤其是在处理多行文本时。

## 9. Compact Number Formatting

JDK 12 引入了紧凑数字格式化工具，允许根据区域设置以简短形式显示数字。这对需要处理国际化的应用程序非常有用。

```java
import java.text.NumberFormat;
import java.util.Locale;

public class CompactNumberExample {
    public static void main(String[] args) {
        NumberFormat nf = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
        System.out.println(nf.format(1000)); // 输出 "1K"
        System.out.println(nf.format(1000000)); // 输出 "1M"
    }
}
```

这个工具为开发者提供了简洁的数字表示方式，提升了用户体验。

## 10. Default CDS Archives

JDK 12 默认启用了类数据共享（CDS），这可以加快 JVM 的启动速度并减少内存使用。CDS 通过将常用的类存储在共享档案中，优化了类加载过程。

```bash
# 使用默认的 CDS 档案运行应用
java -Xshare:dump -jar myapp.jar
```

默认的 CDS 配置为应用程序启动提供了性能优化，尤其适用于短命周期的应用。