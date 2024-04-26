---
title: 访问者模式
category:
  - 设计模式
order: 10
tag:
  - 访问者模式
  - 行为型设计模式
---

### 访问者模式
表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。
> 您在朋友家做客，您是访问者，朋友接受您的访问，您通过朋友的描述，然后对朋友的描述做出一个判断，这就是访问者模式。

### 访问者模式的主要角色
1. Visitor 访问者接口，定义算法。
2. ConcreteVisitor 具体实现类，实现具体的算法。
3. Element 被访问者接口，增加一个 accept 方法，接收 Visitor 对象。
4. ConcreteElement 具体的被访问者对象，实现 accept 方法，接收具体的 ConcreteVisitor 对象， 然后在 accept 方法内调用 ConcreteVisitor 的算法 。
5. ObjectStructure 一个高层接口，1. 内部有一个 list 记录所有的 Element, 2. 提供一个 Accept 方法接收 ConcreteVisitor 对象，然后去遍历 Element 调用他们的 accept 方法。

### 代码示例
```java
// 定义一个表示元素的接口
public interface ComputerPart {
   public void accept(ComputerPartVisitor computerPartVisitor);
}
// 创建扩展了上述类的实体类 1
public class Keyboard  implements ComputerPart {
 
   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}

// 创建扩展了上述类的实体类 2
public class Monitor  implements ComputerPart {
 
   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}

// 创建扩展了上述类的实体类 3
public class Mouse  implements ComputerPart {
 
   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}

public class Computer implements ComputerPart {
   
   ComputerPart[] parts;
 
   public Computer(){
      parts = new ComputerPart[] {new Mouse(), new Keyboard(), new Monitor()};      
   } 
 
 
   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      for (int i = 0; i < parts.length; i++) {
         parts[i].accept(computerPartVisitor);
      }
      computerPartVisitor.visit(this);
   }
}

// 观察者
public interface ComputerPartVisitor {
   public void visit(Computer computer);
   public void visit(Mouse mouse);
   public void visit(Keyboard keyboard);
   public void visit(Monitor monitor);
}

// 观察者实现
public class ComputerPartDisplayVisitor implements ComputerPartVisitor {
 
   @Override
   public void visit(Computer computer) {
      System.out.println("Displaying Computer.");
   }
 
   @Override
   public void visit(Mouse mouse) {
      System.out.println("Displaying Mouse.");
   }
 
   @Override
   public void visit(Keyboard keyboard) {
      System.out.println("Displaying Keyboard.");
   }
 
   @Override
   public void visit(Monitor monitor) {
      System.out.println("Displaying Monitor.");
   }
}

public class Demo {
   public static void main(String[] args) {
 
      ComputerPart computer = new Computer();
      computer.accept(new ComputerPartDisplayVisitor());
   }
}

```

- 访问者模式适用于数据结构相对稳定的系统。
- 它把数据结构和作用于结构上的操作之间的耦合解脱开，使得操作集合可以相对自由地演化。
- 访问者模式的目的是要把处理从数据结构分离出来。
- 有比较稳定的数据结构，又有易于变化的算法的话，使用访问者模式就是比较合适的，因为访问者模式使得算法操作的增加变得容易。
- 访问者模式的优点就是增加新的操作很容易，因为增加新的操作就意味着增加一个新的访问者。访问者模式将有关的行为集中到一个访问者对象中。
> 访问者的缺点其实也就是使增加新的数据结构变得困难了。