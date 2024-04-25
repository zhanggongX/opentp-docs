---
title: 中介者模式
category:
  - 设计模式
order: 9
tag:
  - 中介者模式
  - 行为型设计模式
---

### 中介者模式
用一个中介对象来封装一系列的对象交互。 中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变 它们之间的交互。  
> 中介者模式很容易在系统中应用，也很容易在系统中误用 。当系统出现了‘多对多’ 交互复杂的对象群时，不要急于使用中介者模式，而要先反思系统在设计上是不是合理。  
1. Mediator 的出现减少了各个对象的耦合，使得可以独立地改 变和复用各个对象和 Mediator。  
2. 由于把对象如何协作进行了抽象，将中介作为一个独立的概念并将其封装在一个对象中，这样关注的对象就从对象各自本身的行为转移到它们之间的交互上来，也就是站在一个更宏观的角度去看待系统。  
3. 由于 ConcreteMediator 控制了集中化，于是就把交互复杂性变为了中介者的复杂性，这就使得中介者会变得比任何一个具体对象都复杂。
> 中介者模式一般应用于一组对象以定义良好但是复杂的方式进行通信的场合。以及想定制一个分布在多个类中的行为，而又不想生成太多的子类的场合。

### 代码示例

```java
// Mediator 中介者
public class ChatRoom {

   public static void showMessage(User user, String message){
      System.out.println(new Date().toString()
         + " [" + user.getName() +"] : " + message);
   }

}


public class User {
   private String name;
 
   public String getName() {
      return name;
   }
 
   public void setName(String name) {
      this.name = name;
   }
 
   public User(String name){
      this.name  = name;
   }
 
   public void sendMessage(String message){
      ChatRoom.showMessage(this,message);
   }
}

public class Demo {
   public static void main(String[] args) {

      User robert = new User("Robert");
      User john = new User("John");
 
      robert.sendMessage("Hi! John!");
      john.sendMessage("Hello! Robert!");
   }
}
```