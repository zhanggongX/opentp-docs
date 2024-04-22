---
title: 观察者模式
category:
  - 设计模式
order: 3
tag:
  - 观察者模式
  - 行为型设计模式
---

### 观察者模式
观察模式又叫发布-订阅模式。   
定义了一种一对多的依赖关系 ，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态发生变化时，会通知所有观察者对象，使它们能够自动更新自己。  

将一个系统分割成一系列相互协作的类有一个很不好的副作用，那就是需要维护相关对象间的一致性。我们不希望为了维持一致性而使各类紧密耦合，这样会给维护、扩展和重用都带来不便。  
而观察者模式的关键对象是主题 Subject 和观察者 Observer， 一个 Subject 可以有任意数目的依赖它的 Observer，一旦 Subject 的状态发生了改变，所有的 Observer 都可以得到通知。 Subject 发出通知时并不需要知道谁是它的观察者，也就是说，具体观察者是谁，它根本不需要知道。而任何一个具体观察 者不知道也不需要知道其他观察者的存在。  

观察者模式所做的工作其实就是在解除耦合。让耦合的双方都依赖于抽象，而不是依赖于具体。从而使得各自的变化都不会影响另一边的变化。  

这真是依赖倒转的体现。


### 代码示例
```java
public abstract class Subject {

    protected List<Observer> observers = new CopyOnWriteArrayList<>();

    public void add(Observer observer) {
        observers.add(observer);
    }

    public void remove(Observer observer) {
        observers.remove(observer);
    }

    public void doNotify() {
        for (Observer observer : observers) {
            observer.doUpdate();
        }
    }
}

public class SubjectA extends Subject {

    private int state;

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}


public interface Observer {

    void doUpdate();
}

public class ObserverA implements Observer {

    @Override
    public void doUpdate() {
        System.out.println("do update");
    }
}
```

### 真正的观察者模式
不应该互相有什么依赖、组合，而是基于事件驱动。  
notify 发出一个 **通知**, 所有观察者都关着这个事件。