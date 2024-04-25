---
title: 享元模式
category:
  - 设计模式
order: 7
tag:
  - 享元模式
  - 结构型设计模式
---

### 享元模式
运用共享技术有效地支持大量细粒度的对象。  

主要角色：
- 享元工厂（Flyweight Factory）: 负责创建和管理享元对象，通常包含一个池（缓存）用于存储和复用已经创建的享元对象。  
- 抽象享元（Flyweight）: 定义了具体享元和非共享享元的接口，通常包含了设置外部状态的方法。
- 具体享元（Concrete Flyweight）: 实现了抽象享元接口，包含了内部状态和外部状态。内部状态是可以被共享的，而外部状态则由客户端传递。
- 客户端（Client）
> mybatis 的 configuration 就是享元工厂的角色，解析出来的反射对象，mappingstatement 等都在里边进行了缓存。  
> 享元模式可以避免大量非常相似类的开销。
> 在程序设计中，有时需要生成大量细粒度的类实例来表示数据。
> 如果能发现这些实例除了几个参数外基本上都是相同的，有时就能够受大幅度地减少需要实例化的类的数量。
> 如果能把那些参数移到类实例的外面，在方法调用时将它们传递进来，就可以通过共享大幅度地减少单个实例的数目。

```java
public interface Shape {
   void draw();
}

public class Circle implements Shape {
   private String color;
   private int x;
   private int y;
   private int radius;
 
   public Circle(String color){
      this.color = color;     
   }
 
   public void setX(int x) {
      this.x = x;
   }
 
   public void setY(int y) {
      this.y = y;
   }
 
   public void setRadius(int radius) {
      this.radius = radius;
   }
 
   @Override
   public void draw() {
      System.out.println("Circle: Draw() [Color : " + color 
         +", x : " + x +", y :" + y +", radius :" + radius);
   }
}
 
public class ShapeFactory {
   private static final HashMap<String, Shape> circleMap = new HashMap<>();
 
   public static Shape getCircle(String color) {
      Circle circle = (Circle)circleMap.get(color);
 
      if(circle == null) {
         circle = new Circle(color);
         circleMap.put(color, circle);
         System.out.println("Creating circle of color : " + color);
      }
      return circle;
   }
}

public class Demo {
   private static final String colors[] = 
      { "Red", "Green", "Blue", "White", "Black" };
   public static void main(String[] args) {
 
      for(int i=0; i < 20; ++i) {
         Circle circle = 
            (Circle)ShapeFactory.getCircle(getRandomColor());
         circle.setX(getRandomX());
         circle.setY(getRandomY());
         circle.setRadius(100);
         circle.draw();
      }
   }
   private static String getRandomColor() {
      return colors[(int)(Math.random()*colors.length)];
   }
   private static int getRandomX() {
      return (int)(Math.random()*100 );
   }
   private static int getRandomY() {
      return (int)(Math.random()*100);
   }
}

```

 >如果一个应用程序使用了大量的对象，而大量的这些对象造成了很大的存储开销时就应该考虑使用。
> 还有就是对象的大多数状态可以外部状态，如果删除对象的外部状态， 那么可以用相对较少的共享对象取代很多组对象，此时可以考虑使用享元模式。