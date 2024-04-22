---
title: 外观模式
category:
  - 设计模式
order: 5
tag:
  - 外观模式
  - 结构型设计模式
---

### 外观模式
为子系统中的一组接又提供一个一致的界面，此模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。


### 代码示例
```java
public Class A{
    public void doSomething(){
        // ....
    }
}

public Class B{
    public void doSomething(){
        // ....
    }
}

public Class C{
    public void doSomething(){
        // ....
    }
}

/**
 * 提供外观接口，封装内部负责的逻辑。
 */
public Class Facade{
    private ClassA a;
    private ClassB b;
    private ClassC c;

    public void doSomething(){
        a.doSomething();
        c.doSomething();
        d.doSomething();
    }
}
```
