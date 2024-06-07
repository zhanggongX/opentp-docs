---
title: JDk17新特性(LTS)
category:
  - Java
order: 74
tag:
  - Java基础
  - JDK
---

## JDK17 新特性

JDK17 是一个重要的长期支持版本（LTS），于 2021 年 9 月发布。
> 建议如果从 JDK8 升级 JDK 的话，最少也要升级到 JDK17。

### 1. 密封类（Sealed Classes）

密封类允许开发者显式地定义哪些类可以扩展或实现一个特定的类或接口。这一特性可以更好地控制类的继承结构，增强代码的安全性和可维护性。

```java
public abstract sealed class Shape permits Circle, Square {}

public final class Circle extends Shape {
    double radius;
}

public final class Square extends Shape {
    double side;
}
```

密封类通过 `permits` 关键字列出允许继承的子类，任何其他类试图继承 `Shape` 都会导致编译错误。

### 2. 模式匹配 for `switch`（预览）

模式匹配 for `switch` 语句引入了一种更简洁的方式来处理多种类型的 `switch` 语句，从而减少了样板代码，并提高了代码的可读性和可维护性。

```java
public class PatternMatchingSwitchExample {
    public static void main(String[] args) {
        Object obj = "Hello, World!";

        switch (obj) {
            case String s -> System.out.println("String: " + s);
            case Integer i -> System.out.println("Integer: " + i);
            default -> System.out.println("Unknown type");
        }
    }
}
```

### 3. 强封装 JDK 内部 API

JDK 17 进一步加强了对 JDK 内部 API 的封装，禁止通过反射访问这些内部 API。这一特性提高了应用的安全性和稳定性，鼓励开发者使用公开的 API。

```bash
# 启动应用时尝试访问内部 API 将会失败
java -jar myapp.jar
# 错误信息: Illegal reflective access
```

### 4. 外部函数和内存 API（孵化）

外部函数和内存 API 提供了一种安全且高效的方式来调用本地代码和操作外部内存。这对于需要与 C/C++ 库交互或处理大数据的应用非常有用。

```java
import jdk.incubator.foreign.*;

public class ForeignMemoryExample {
    public static void main(String[] args) {
        MemorySegment segment = MemorySegment.allocateNative(100);
        MemoryAccess.setIntAtOffset(segment, 0, 42);
        int value = MemoryAccess.getIntAtOffset(segment, 0);
        System.out.println("Value: " + value); // 输出: Value: 42
    }
}
```

### 5. 向量 API（孵化）

Vector API 允许开发者利用现代 CPU 的 SIMD（单指令多数据）指令来编写高性能的向量运算代码，从而提升应用的性能。

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

### 7. 预览特性：基于类的延迟初始化

延迟初始化允许开发者在类加载过程中延迟某些类的初始化，从而提高启动性能和减少内存占用。

```java
public class LazyInitializationExample {
    private static final class Holder {
        static final ExpensiveObject INSTANCE = new ExpensiveObject();
    }

    public static ExpensiveObject getInstance() {
        return Holder.INSTANCE;
    }
}
```

### 8. 增强的伪随机数生成器（JEP 356）

JDK 17 增强了伪随机数生成器 API，提供了更多种类的伪随机数生成器，并使得这些生成器的接口更加统一和灵活。

```java
import java.util.random.*;

public class RandomExample {
    public static void main(String[] args) {
        RandomGenerator random = RandomGenerator.of("L64X128MixRandom");
        System.out.println(random.nextInt());
    }
}
```

### 9. Unix-Domain Socket Channels

JDK 17 增强了对 Unix-Domain Sockets 的支持，通过 `java.nio.channels` 提供了高效的本地进程间通信（IPC）。

```java
import java.net.*;
import java.nio.channels.*;
import java.nio.ByteBuffer;
import java.nio.file.Path;

public class UnixDomainSocketExample {
    public static void main(String[] args) throws Exception {
        Path socketFile = Path.of("/tmp/mysocket");

        try (ServerSocketChannel server = ServerSocketChannel.open(StandardProtocolFamily.UNIX)
            .bind(UnixDomainSocketAddress.of(socketFile));
             SocketChannel client = SocketChannel.open(StandardProtocolFamily.UNIX)
                 .connect(UnixDomainSocketAddress.of(socketFile))) {
            ByteBuffer buffer = ByteBuffer.allocate(128);
            buffer.put("Hello, Unix-Domain Socket!".getBytes());
            buffer.flip();
            client.write(buffer);
        }
    }
}
```

### 10. `Strongly Encapsulate JDK Internals`

JDK 17 进一步强封装了 JDK 内部 API，不再允许通过反射等方式访问 JDK 内部类，强化了应用的安全性和代码的健壮性。

```bash
# 强封装 JDK 内部类
java -jar myapp.jar
```

### 11. 移除了 Experimental AOT 和 JIT 编译器

JDK 17 移除了实验性的 AOT（Ahead-Of-Time）和 JIT（Just-In-Time）编译器，这些编译器的功能已经被新的优化技术和工具所取代。