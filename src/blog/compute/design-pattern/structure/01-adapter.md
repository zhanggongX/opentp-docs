---
title: 适配器模式
category:
  - 设计模式
order: 1
tag:
  - 适配器模式
  - 结构型设计模式
---

将一个类的接口转换成客户希望的另外一个接口。Adapter模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。也就是说如果一个接口，我们不能用，但是又不能去修改它，也不知道他的具体细节，那么就只能做一个适配器来适配它了。

这个模式比较简单，例如适配一个对象，方便别的方法调用，我们只需要定义一个适配对象，提供其他方法可以调用的接口，然后在适配对象中调用老的方法即可。  

适配器模式，应该是设计模式应用的比较少的模式了，一般都是适配旧的系统的才会可能用到，也就是在调用方和被调用方都不太容易修改的时候再使用适配器模式，否则还是提供新的方法比较好。 

```java
public interface Adapter {

    void request();
}
```

```java
public class ConcreteAdapter implements Adapter {

    public ConcreteAdapter(Target target){
        this.target = target;
    }

    @Override
    public void request() {
        System.out.println("适配器准备去请求特殊的接口");
        target.specificRequest();
        System.out.println("适配器请求特殊的接口成功");
    }
}
```


```java
public class Target {
    public void specificRequest() {
        System.out.println("特殊的请求");
    }
}
```

```java
public class MainClient {

    public static void main(String[] args) {
        Target target = new Tarage();
        Adapter adapter = new ConcreteAdapter(target);
        adapter.request();
    }
}
```