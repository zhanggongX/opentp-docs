---
title: 工厂方法模式
category:
  - 设计模式
order: 2
tag:
  - 设计模式
  - 工厂方法模式
  - 创建型设计模式
---

### 介绍
简单工厂模式的最大优点在于工厂类中包含了必要的逻辑判断，根据客户端的选择条件动态实例化相关的类，对于客户端来说，去除了与具体产品的依赖。  
但是问题是如果我们要增加一个类，就需要去修改工厂方法，违背了开闭原则。   

工厂方法模式 (Factory Method)，定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。
> 就是给每一个类创建一个工厂。。这样虽然类多了，但是符合开闭原则，新增一个类，就新增一个类的工厂，对老的逻辑无需任何修改。

### 代码

```java
public interface Inter {

    void doSomething();
}

public class ClassA implements Inter{

    @Override
    public void doSomething() {
        System.out.println("classA");
    }
}

public interface Factory {

    Inter createBean();
}


public class ClassAFactory implements Factory{

    @Override
    public Inter createBean() {
        return new ClassA();
    }
}
// 后续增加ClassA，再增加一个ClassB。
// 类的数量将会膨胀，还不如简单工厂。。

```