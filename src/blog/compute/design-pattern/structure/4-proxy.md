---
title: 代理模式
category:
  - 设计模式
order: 4
tag:
  - 代理模式
  - 结构型设计模式
---

### 代理模式概述
代理模式(Proxy)，为其他对象提供一种代理以控制对这个对象的访问。  
代理模式对象实现被代理对象的接口，然后持用被代理对象的引用，调用代理的方法去实际调用被代理的方法，同时可以做一些增强。  
> 静态代理和动态代理。

### 代码
```java
public interface Inter {
   void doSomething();
}

public class RealBean implements Inter {
 
   @Override
   public void doSomething() {
      System.out.println("real bean");
   }
}

public class ProxyBean implements Inter{
 
   private RealBean realBean;
 
   @Override
   public void display() {
      if(realBean == null){
         realBean = new RealBean();
      }
      // 增强
      realBean.doSomething();
      // 增强
   }
}
```