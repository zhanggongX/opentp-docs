---
title: 模板方法
category:
  - 设计模式
order: 2
tag:
  - 模板方法
  - 行为型设计模式
---

### 介绍
定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
>模版方法其实就是把一些对象的通用逻辑抽象到一个抽象类里，然后各自特色的方法在抽象类中定义成抽象方法，给各个子类实现，使用的时候使用各个子类，就能走各自特定的逻辑。

### 代码
```java
public abstract class AbstractClass {

    // 这里就是模版方法
    protected void doSomething(){
        doSomethingA();
        doSomethingB();
    }

    // 这里是通用的一些逻辑
    protected void doSomethingA(){
        System.out.println("this is a");
    }

    // 这里是各个子类需要去实现的特色方法。
    protected abstract void doSomethingB();
}

public class ClassA extends AbstractClass {

    @Override
    protected void doSomethingB() {
        System.out.println("this is Class A doSomethingB");
    }
}

public class ClassB extends AbstractClass{

    @Override
    protected void doSomethingB() {
        System.out.println("this is Class B doSomethingB");
    }
}

public class Demo {

    public static void main(String[] args) {
        AbstractClass a = new ClassA();
        AbstractClass b = new ClassB();

        a.doSomething();
        b.doSomething();
    }
}
```