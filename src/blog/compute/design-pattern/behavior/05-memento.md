---
title: 备忘录模式
category:
  - 设计模式
order: 5
tag:
  - 备忘录模式
  - 行为型设计模式
---

### 备忘录模式
保存一个对象的某个状态，以便在适当的时候恢复对象。  
在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到原先保存的状态。  
Memento 模式比较适用于功能比较复杂的，但需要维护或记录属性历史的类，或者需要保存的属性只是众多属性中的一小部分时。   
Originator 可以根据保存的 Memento 信息还原到前一状态。  
如果在某个系统中使用命令模式时，需要实现命令的撤销功能，那么命令模式可以使用备忘录模式来存储可撤销操作的状态。  
有时一些对象的内部信息必须保存在对象以外的地方，但是必须要由对象自己读取，使用备忘录可以把复杂的对象内部信息对其他的对象屏蔽起来，从而可以恰当地保持封装的边界。  
> 游戏存档

### 代码示例
```java
/**
 * 备忘录类，用来记录
 */
public class Memento {
   private String state;
 
   public Memento(String state){
      this.state = state;
   }
 
   public String getState(){
      return state;
   }  
}

/**
 * 备忘发起类
 * 要保存的细节给封装在了Memento 中了，哪一天要更改保存的细节 也不用影响客户端了。 
 */
public class Originator {

   private String state;
 
   public void setState(String state){
      this.state = state;
   }
 
   public String getState(){
      return state;
   }
 
   public Memento saveStateToMemento(){
      return new Memento(state);
   }
 
   public void getStateFromMemento(Memento Memento){
      state = Memento.getState();
   }
}

/**
 *  管理者类
 */ 
public class CareTaker {
    // 保存备忘录列表
   private List<Memento> mementoList = new ArrayList<Memento>();
 
   public void add(Memento state){
      mementoList.add(state);
   }
 
   public Memento get(int index){
      return mementoList.get(index);
   }
}

public class MementoPatternDemo {
   public static void main(String[] args) {

      Originator originator = new Originator();
      CareTaker careTaker = new CareTaker();

      originator.setState("State #1");
      originator.setState("State #2");
      // 保存状态
      careTaker.add(originator.saveStateToMemento());

      originator.setState("State #3");
      // 保存状态
      careTaker.add(originator.saveStateToMemento());
      originator.setState("State #4");
 
      System.out.println("Current State: " + originator.getState());  

      // 获得历史备忘录  
      originator.getStateFromMemento(careTaker.get(0));
      System.out.println("First saved State: " + originator.getState());
      originator.getStateFromMemento(careTaker.get(1));
      System.out.println("Second saved State: " + originator.getState());
   }
}
```