---
title: 桥接模式
category:
  - 设计模式
order: 2
tag:
  - 桥接模式
  - 结构型设计模式
---

### 介绍
桥接模式是软件设计模式中最复杂的模式之一，它把事物对象和其具体行为、具体特征分离开来，使它们可以各自独立的变化。  
事物对象仅是一个抽象的概念。如“圆形”、“三角形”归于抽象的“形状”之下，而“画圆”、“画三角”归于实现行为的“画图”类之下，然后由“形状”调用“画图”。  

将抽象部分与它的实现部分分离，不好理解，其实就是实现系统可能有多角度分类，每一种分类都有可能变化，那么就把这种多角度分离出来让它们独立变化，减少它们之间的耦合。  
也就是说，在发现我们需要多角度去分类实现对象，而只用继承会造成大量的类增加，不能满足开放-封闭原则时，就应该要考虑用桥接模式了。 

> 说的更通俗一点，如果一个系统单纯的使用继承，每次新增种类或者功能时候就比较复杂，   
> 例如手机系统和手机功能，如果让他们都是用继承关联在一起，每次新增一个手机功能，手机系统都要做相应的变化。  
> 这时候就可以用桥接模式了，桥接模式其实就是把复杂的继承，换成组合的方式来处理，例如手机功能不是继承手机系统，而是手机系统包含手机功能，手机系统类内部有一系列手机功能的对象。
> 这样每次新增手机功能或者手机功能变化，对手机系统完全无影响。

### 代码
```java
interface DrawingAPI
{
    public void drawCircle(double x, double y, double radius);
}

/** "ConcreteImplementor" 1/2 */
class DrawingAPI1 implements DrawingAPI
{
   public void drawCircle(double x, double y, double radius) 
   {
        System.out.printf("API1.circle at %f:%f radius %f\n", x, y, radius);
   }
}

/** "ConcreteImplementor" 2/2 */
class DrawingAPI2 implements DrawingAPI
{
   public void drawCircle(double x, double y, double radius) 
   { 
        System.out.printf("API2.circle at %f:%f radius %f\n", x, y, radius);
   }
}

/** "Abstraction" */
interface Shape
{
   public void draw();                             // low-level
   public void resizeByPercentage(double pct);     // high-level
}

/** "Refined Abstraction" */
class CircleShape implements Shape
{
   private double x, y, radius;
   private DrawingAPI drawingAPI;
   public CircleShape(double x, double y, double radius, DrawingAPI drawingAPI)
   {
       this.x = x;  this.y = y;  this.radius = radius; 
       this.drawingAPI = drawingAPI;
   }

   // low-level i.e. Implementation specific
   public void draw()
   {
        drawingAPI.drawCircle(x, y, radius);
   }   
   // high-level i.e. Abstraction specific
   public void resizeByPercentage(double pct)
   {
        radius *= pct;
   }
}

/** "Client" */
class BridgePattern {
   public static void main(String[] args)
   {
       Shape[] shapes = new Shape[2];
       shapes[0] = new CircleShape(1, 2, 3, new DrawingAPI1());
       shapes[1] = new CircleShape(5, 7, 11, new DrawingAPI2());

       for (Shape shape : shapes)
       {
           shape.resizeByPercentage(2.5);
           shape.draw();
       }
   }
}
```