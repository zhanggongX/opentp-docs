---
title: 命令模式
category:
  - 设计模式
order: 7
tag:
  - 命令模式
  - 行为型设计模式
---

### 命令模式
是一种数据驱动的设计模式，它属于行为型模式。请求以命令的形式包裹在对象中，并传给调用对象。调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象，该对象执行命令。  

有以下几个角色:
- 命令 command
- 具体命令 concreteCommand
- 接收者 receiver
- 调用/请求者 invoker
- 客户端 client
>  将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化: 对请求排队或记录请求日志，以及支持可撤销的操作。

### 代码
```java
// 命令 command
public interface Command {
   void execute();
}

// 命令A concreteCommand
public class CommandA impl Command{
    private Receiver receiver;

   public void execute(){
     System.out.println("A");
     receiver.doSomething();
   }
}

// 命令B concreteCommand
public interface CommandB impl Command{
    private Receiver receiver;

   public void execute(){
    System.out.println("A");
    receiver.doSomething();
   }
}

// 接收者 receiver
public class Receiver {
   
   public void doSomething(){
    //...
   }
}
// 调用/请求者
public class Invoker{
    private List<Command> clist = new ArrayList<>();

    public void add(Command command){
        clist.add(command);
    }

    public void execute(){
        for(Command commad : clist){
            command.execute();
        }
    }
}

public class Demo(){
    public void static main(String[] args){
        Receiver r = new Receiver();

        Command a = new CommandA(r);
        Command b = new CommandB(r);

        Invoker invoker = new Invoker();
        invoker.add(a);
        invoker.add(b);
        invoker.excute;
    }
}


```

### 命令模式的作用
1. 它能较容易地设计一个命令队列。
2. 在需要的情况下，可以较容易地将命令记入日志
3. 允许接收请求的一方决定是否要否决请求。
4. 可以容易地实现对请求的撤销和重做。
5. 由于加进新的具体命令类不影响其他的类，因此增加新的具体命令类很容易。   
> 其实还有最关键的优点就是命令模式把请求一个操作的对象与知道怎么执行一个操作的对象分割开。  
> 但是否是碰到类似情况就一定要实现命令模式呢?   
> 不一定了，比如命令模式支持撤销/恢复操作功能，但你还不清楚是否需要这个功能时，你要不要实现命令模式。  
> 敏捷开发原则告诉我们，不要为代码添加基于猜测的、实际不需要的功能。如果不清楚一个系统是否需要命令模式，一般就不要着急去实现它，事实上，在需要的时候通过重构实现这个模式并不困难，只有在真正需要如撤销/恢复操作等功能时，把原来的代码重构为命令模式即可。  