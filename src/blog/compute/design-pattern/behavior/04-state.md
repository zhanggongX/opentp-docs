---
title: 状态模式
category:
  - 设计模式
order: 4
tag:
  - 状态模式
  - 行为型设计模式
---

### 状态模式
当一个对象的内在状态改变时允许改变其行为，这个对象看起来像是改变了其类。  
状态模式主要解决的是当控制一个对象状态转换的条件表达式过于复杂时的情况。把状态的判断逻辑转移到表示不同状态的一系列类当中，可以把复杂的判断逻辑简化。  
状态模式最常用的场景就是状态机。  

### 状态机代码
```java
public class StateMachine {

   private State state;

   public void doAction(){
        state.doAction();
   }

}

public interface State {
   public void doAction(StateMachine stateMachine);
} 

public class StateA implements State {
   public String state = "A";
   
   public void doAction(StateMachine stateMachine) {
      System.out.println("this is state A");
      stateMachine.setState(new StateB()); 
   }
}

public class StateB implements State {
   public String state = "B";
   
   public void doAction(StateMachine stateMachine) {
      System.out.println("this is state B");
      stateMachine.setState(new StateA()); 
   }
}


public void Main(String[] args){
    StateMachine stateMachine = new StateMachine(new StateA());
    stateMachine.doAction();
    stateMachine.doAction();
    stateMachine.doAction();
}

```

### 优点
- 与特定状态相关的行为局部化，并且将不同状态的行为分割开来。   
- 将特定的状态相关的行为都放入一个对象中，由于所有与状态相关的代码都存在于某个 State 中，所以通过定义新的子类可以很容易地增加新的状态和转换。  
- 消除庞大的条件分支语句。  
- 状态模式通过把各种状态转移逻 辑分布到State 的子类之间，来减少相互间的依赖。   
> 当一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为时 ，就可以考虑使用状态模式了。