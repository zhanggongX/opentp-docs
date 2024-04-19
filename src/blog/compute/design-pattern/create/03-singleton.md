---
title: 单例模式
category:
  - 设计模式
order: 4
tag:
  - 单例模式
  - 创建型设计模式
---

## 单例模式
### 意图：
保证一个类仅有一个实例，并提供一个访问它的全局访问点。

### 单例模式的几种方法
```java
// 懒汉式，线程不安全
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

```java
// 懒汉式，线程安全
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
    public static synchronized Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

```java
// 饿汉式，线程安全，使用 classloader 类加载机制保证线程安全。
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton (){}  
    public static Singleton getInstance() {  
    return instance;  
    }  
}
```

```java
// 双重锁校验。
public class Singleton {  
    private volatile static Singleton singleton;  
    private Singleton (){}  

    public static Singleton getSingleton() {  
    if (singleton == null) {  
        synchronized (Singleton.class) {  
            if (singleton == null) {  
                singleton = new Singleton();  
            }  
        }  
    }  
    return singleton;  
    }  
}

```

```java
// 静态内部类。
public class Singleton {  
    private static class SingletonHolder {  
    private static final Singleton INSTANCE = new Singleton();  
    }  
    private Singleton (){}  
    public static final Singleton getInstance() {  
        return SingletonHolder.INSTANCE;  
    }  
}
```

```java
// 枚举
```