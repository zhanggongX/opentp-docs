---
title: JDk18新特性
category:
  - Java
order: 76
tag:
  - Java基础
  - JDK
---

## JDK18 新特性

JDK18 于 2022 年 3 月发布，作为一个非长期支持版本（非 LTS）。

### 1. 简单 Web 服务器（Simple Web Server）
JDK 18 引入了一个简单的命令行 Web 服务器，旨在提供一个轻量级的 HTTP 文件服务器，方便开发和测试。该服务器主要用于快速启动一个简单的 Web 服务，而不需要安装复杂的 Web 服务器软件。

```bash
# 启动简单的 Web 服务器，默认为当前目录，端口 8000
$ jwebserver

# 自定义根目录和端口
$ jwebserver --directory /path/to/directory --port 8080
```

通过这种方式，你可以快速在本地启动一个 Web 服务器，便于测试静态内容或本地开发。

### 2. UTF-8 作为默认字符集（JEP 400）
JDK 18 将 UTF-8 设定为默认字符集（Charset），这意味着在不指定字符集的情况下，所有的字符编码和解码操作都会使用 UTF-8。这一变化提高了跨平台的一致性和兼容性。

```java
// 以前可能会受到平台默认字符集的影响
String text = new String(byteArray, Charset.defaultCharset());

// JDK 18 中默认使用 UTF-8
String text = new String(byteArray); // 默认使用 UTF-8
```

### 3. switch 再次增强

JDK 18 引入了模式匹配 `switch` 的第二个预览版，这个特性扩展了 `switch` 语句，使其能够基于类型进行模式匹配，并且支持更多复杂的条件判断。

```java
public class PatternMatchingSwitchExample {
    public static void main(String[] args) {
        Object obj = 123;

        String result = switch (obj) {
            case Integer i -> "Integer: " + i;
            case String s -> "String: " + s;
            default -> "Unknown type";
        };

        System.out.println(result); // 输出: Integer: 123
    }
}
```

### 4. 外部函数和内存 API（第二次孵化）

外部函数和内存 API 提供了一个高效的方式来操作非堆内存和调用本地代码。在 JDK 18 中，该 API 进行了进一步的优化和增强。

```java
import jdk.incubator.foreign.*;

public class ForeignMemoryExample {
    public static void main(String[] args) {
        try (MemorySegment segment = MemorySegment.allocateNative(100)) {
            MemoryAccess.setByteAtOffset(segment, 0, (byte) 42);
            byte value = MemoryAccess.getByteAtOffset(segment, 0);
            System.out.println("Value: " + value); // 输出: Value: 42
        }
    }
}
```

### 5. 重新实现核心反射（JEP 416）

JDK 18 重新实现了核心反射，优化了反射调用的性能和内存使用。新的实现基于方法句柄，使得反射调用更加高效。

```java
import java.lang.reflect.*;

public class ReflectionExample {
    public static void main(String[] args) throws Exception {
        Method method = String.class.getMethod("length");
        String str = "Hello, World!";
        int length = (int) method.invoke(str);
        System.out.println("Length: " + length); // 输出: Length: 13
    }
}
```

### 6. 向量 API（第三次孵化）

JDK 18 继续扩展了 Vector API，它允许开发者利用 SIMD（单指令多数据）指令编写高性能的向量化代码，从而提升计算密集型应用的性能。

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

### 7. 增强的伪随机数生成器（JEP 356）

JDK 18 增强了伪随机数生成器的 API，引入了统一的接口，使得使用不同类型的伪随机数生成器更加灵活和方便。

```java
import java.util.random.*;

public class RandomExample {
    public static void main(String[] args) {
        RandomGenerator random = RandomGenerator.of("L64X128MixRandom");
        System.out.println(random.nextInt()); // 输出一个随机整数
    }
}
```

### 8. JDK 进程 API（JEP 102）

JDK 18 对进程 API 进行了扩展，增加了对本地进程和环境信息的访问，增强了跨平台的进程管理能力。

```java
import java.lang.ProcessHandle;

public class ProcessAPIExample {
    public static void main(String[] args) {
        ProcessHandle current = ProcessHandle.current();
        long pid = current.pid();
        System.out.println("Current PID: " + pid);
    }
}
```