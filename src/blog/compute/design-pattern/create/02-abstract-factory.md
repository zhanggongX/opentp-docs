---
title: 抽象工厂模式
category:
  - 设计模式
order: 3
tag:
  - 设计模式
  - 工厂模式
  - 抽象工厂模式
  - 创建型设计模式
---

## 抽象工厂模式
### 先回顾下其他两种工厂。
1. 简单工厂，提供一个工厂类，根据入参返回相应的对象。  
2. 工厂方法，定义一个工厂接口，提供多个工厂实现，根据具体的产品，实例不同的工厂，然后再用这个工厂去创建对象。  
3. 抽象工厂模式，是在工厂方法模式的上一个改进，抽象工厂把工厂方法中同一个家族的工厂进行了组合。  
> 例如构造电脑的配件，有各个品牌的电脑，各个品牌的电脑都有显示器，键盘，主板，如果使用工厂方法，则需要给各个品牌的各个配件都创建一个工厂，但是实际情况是一个品牌或者说一个家族的产品，可以放到一块的，这是一个更高层次的抽象，这就是抽象工厂模式。 

> 还比如说我们使用 sql, 有各种产品，有 Mysql、SqlServer, 如果有切换数据库的需求，肯定是把同一种数据库的各种创建 SQL 的方法放到同一个工厂中啦。  


### UML
![抽象工厂UML](abstract-factory.png)

```java
public abstract class AbstractFactory {

    public abstract InterABC getABC(String abc);

    public abstract Inter123 get123(String num);
}
```

```java
public class FactoryABC extends AbstractFactory{

    @Override
    public InterABC getABC(String abc) {
        if(abc == null){
            return null;
        }
        if(abc.equalsIgnoreCase("classA")){
            return new ClassA();
        } else if(abc.equalsIgnoreCase("classB")){
            return new ClassB();
        } else {
            return null;
        }
    }

    @Override
    public Inter123 get123(String num) {
        return null;
    }
}
```

```java
public class Factory123 extends AbstractFactory {

    @Override
    public InterABC getABC(String abc) {
        return null;
    }

    @Override
    public Inter123 get123(String num) {
        if (num == null) {
            return null;
        }
        if (num.equalsIgnoreCase("class1")) {
            return new Class1();
        } else if (num.equalsIgnoreCase("class2")) {
            return new Class2();
        } else {
            return null;
        }
    }
}
```

```java
public class FactorySelector {

    public static AbstractFactory getFactory(String choice) {

        if (choice.equalsIgnoreCase("abc")) {
            return new FactoryABC();
        } else if (choice.equalsIgnoreCase("123")) {
            return new Factory123();
        } else {
            return null;
        }
    }
}
```

```java
public interface InterABC {

    void doSomeThing();
}
```

```java
public class ClassA implements InterABC {

    @Override
    public void doSomeThing() {
        System.out.println("this is class A");
    }
}
```

```java
public class ClassB implements InterABC {

    @Override
    public void doSomeThing() {
        System.out.println("this is class B");
    }
}
```

```java
public interface Inter123 {

    void doOtherThing();
}
```

```java
public class Class1 implements Inter123{

    @Override
    public void doOtherThing() {
        System.out.println("this is class 1");
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        AbstractFactory abc = FactorySelector.getFactory("abc");
        AbstractFactory num = FactorySelector.getFactory("123");

        InterABC classA = abc.getABC("classA");
        Inter123 class1 = num.get123("class1");

        classA.doSomeThing();
        class1.doOtherThing();
    }
}
```
### 目的
提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。

他对比简单工厂，可以创建多个类型的对象。先根据类型获取不同的类型的工厂，再根据工厂去获取具体的对象。

优点：当一个产品族中的多个对象被设计成一起工作时，它能保证客户端始终只使用同一个产品族中的对象, 比如我们的数据库访问支持 Mysql 和 SqlServer,  使用抽象工厂模式，来回切换就非常方便， 通过抽象工厂创建具体的工厂，就能使用 Mysql 或者 SqlServer 的一系列接口了。    
缺点：产品族扩展非常困难，要增加一个系列的某一产品，既要在抽象的 Creator 里加代码，又要在具体的里面加代码。  

> 缺点增加新功能改动比较多，优点多种产品族切换比较方便。  