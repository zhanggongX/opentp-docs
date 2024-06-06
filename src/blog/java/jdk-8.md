---
title: JDk8新特性
category:
  - Java
order: 70
tag:
  - Java基础
  - JDK
---

## JDK8
### 1. Lambda 表达式
Lambda 表达式是 JDK 8 引入的一个重大特性，它使得函数式编程变得更加简洁和强大。  
Lambda 表达式允许将行为（代码）作为参数传递给方法，使代码更加简洁和可读。

### 2. 函数式接口
函数式接口是指只包含一个抽象方法的接口。JDK 8 引入了 `@FunctionalInterface` 注解，用于标记函数式接口。

```java
@FunctionalInterface
public interface MyFunctionalInterface {
    void doSomething();
}
```

### 3. Stream API
Stream API 提供了一种高效且易于使用的处理数据序列的方式。它支持函数式编程风格的操作，如过滤、映射、归约等。
```java
// 示例：使用 Stream API
List<String> names = Arrays.asList("A", "B", "C");
List<String> filteredNames = names.stream()
                                  .filter(name -> name.startsWith("A"))
                                  .collect(Collectors.toList());
```

### 4. 默认方法和静态方法
JDK 8 允许在接口中定义默认方法和静态方法。默认方法可以为接口提供默认实现，而静态方法则属于接口本身。

```java
public interface MyInterface {
    void abstractMethod();

    // 默认方法
    default void defaultMethod() {
        System.out.println("This is a default method");
    }

    // 静态方法
    static void staticMethod() {
        System.out.println("This is a static method");
    }
}
```

### 5. 新的日期和时间 API
JDK 8 引入了新的日期和时间 API (`java.time` 包)，提供了更好的日期和时间处理能力。它由 `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime` 等类组成。

```java
LocalDate date = LocalDate.now();
LocalTime time = LocalTime.now();
LocalDateTime dateTime = LocalDateTime.now();
```

### 6. Optional
`Optional` 类用于避免显式的 null 检查，提供了一种优雅的处理可能为空值的方式。

```java
// 示例：使用 Optional
Optional<String> optional = Optional.ofNullable("Hello");
optional.ifPresent(System.out::println);
```

### 7. Nashorn JavaScript 引擎
JDK 8 引入了 Nashorn JavaScript 引擎，可以在 JVM 上运行 JavaScript 代码。

```java
// 示例：使用 Nashorn 运行 JavaScript
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class NashornExample {
    public static void main(String[] args) throws ScriptException {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        engine.eval("print('Hello, Nashorn');");
    }
}
```

### 8. Base64 编码
JDK 8 引入了 `java.util.Base64` 类，用于支持 Base64 编码和解码。

```java
// 示例：使用 Base64 编码和解码
import java.util.Base64;

public class Base64Example {
    public static void main(String[] args) {
        String originalInput = "Hello, World!";
        String encodedString = Base64.getEncoder().encodeToString(originalInput.getBytes());
        System.out.println("Encoded: " + encodedString);

        byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
        String decodedString = new String(decodedBytes);
        System.out.println("Decoded: " + decodedString);
    }
}
```

### 9. 并行数组
JDK 8 引入了 `Arrays.parallelSort` 方法，使用 Fork/Join 框架对数组进行并行排序，提升大数组的排序性能。

```java
// 示例：使用并行排序
int[] array = {5, 3, 8, 1, 9, 2};
Arrays.parallelSort(array);
System.out.println(Arrays.toString(array));
```