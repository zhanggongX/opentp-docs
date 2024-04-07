---
title: Java进阶
category:
  - Java
order: 2
tag:
  - Java基础
---

## 稍微需要点基础的基础
### Java 异常类结构
1, 所有异常的父接口 Throwable    
2, 再下一层是 Exception 和 Error  
2.1, Error 包含 OOM 虚拟机Error, 栈溢出Error 等  
2.2, 异常包含受检异常 和 非受检异常。  
2.2.1, 受检异常主要有IO异常等，非受检异常主要是非法参数，空指针等，非受检异常都是 RuntimeException 以及其子类。   

### 范型
```java
// 范型类
public class Test<T>{
    private T a;

    public Test(T _a){
        this.a = _a;
    }

    private T getA(){
        return this.a;
    } 
}

// 使用
Test<String> test = new Test<>("abc);
```

```java
// 范型接口
public interface Test<T>{
    T doSomeThing();
}

public class TestA<T> implements Test<T>{
    @Override
    public T doSomeThing() {
        return null;
    }
}

public class TestB implements Test<String> {
    
    @Override
    public String doSomeThing() {
        return "abc";
    }
}
```

```java
// 范型方法
public <E> void doOtherThing(E e){
}
```

### 反射
反射就是通过某个类的Class对象，获得Class的Method 和 Field   
然后通过 Method/Field 的 invoke，调用具体的对象的方法和更新对象的数据。

```java
public static void main(String[] args) throws InvocationTargetException, IllegalAccessException, NoSuchFieldException {
    // 获取 orderItem 的 class
    Class<OrderItem> orderItemClass = OrderItem.class;
    // 创建对象
    OrderItem orderItem = new OrderItem();

    // 获取所有的公有方法
    Method[] methods = orderItemClass.getMethods();
    for(Method method : methods){
        // 设置状态
        if(method.getName().equals("setStatus")){
            method.invoke(orderItemDetailDTO, 8);
        }
    }

    // 获取私有字段
    Field orderStatus = orderItemDetailDTOClass.getDeclaredField("status");
    // 设置可访问
    orderItemStatus.setAccessible(true);

    // 获取字段值
    Integer statusVal = (Integer) orderItemStatus.get(orderItemDetailDTO);
    System.out.println(statusVal);
}
```

### SPI
SPI和API的区别  
API是服务方提供接口，服务方提供实现。  
SPI是调用方提供接口，服务方提供实现。  
#### 怎么使用SPI
首先调用方定义接口和方法  
服务方提供实现逻辑，在服务方的 META-INF/service 下提供提供一个文件，文件名是接口的全限定名，里边内容是接口的实现类。  
调用方引入服务方jar包，通过 ServiceLoader 类就可以加载到实现类  
这是JDK的默认约定，因为在 java.util.ServiceLoader 中写死了文件位置 META-INF/services

> Springboot starter 也是利用 SPI机制  
一个框架想提供一个 starter 就定义一些配置对象，然后把配置对象全限定名放入 META-INF/resource/spring.factories 中，  
Springboot启动的时候会加载所有依赖包中的 spring.factories 文件中的类，具体逻辑在 SpringFactoriesLoader类中。  
注意：springboot3 默认的文件不再是 spring.factories 改成了 org.springframework.boot.autoconfigure.AutoConfiguration.imports

### 序列化
1，不想序列化的字段使用 transient 字段修饰  
2，主要的序列化协议有 Hessian kryo protobuf protoStuff 等, 我的开源框架 opentp 的序列化默认就是 kryo  
3，json,xml 也是序列化的一种，可读性比较好，但是效率较低，生成的序列化流较大，一般不选择。  
4，为什么不推荐 jdk 默认序列化，因为不支持跨语言，性能也不咋好，还存在安全问题（输入的反序列化数据可以通过构造恶意输入，让反序列化产生奇奇怪怪的对象）。

### 代理
#### 静态代理
1，实现被代理对象的接口  
2，实现被代理对象接口，定义的方法  
3，引入被代理对象  
4，在代理对象的方法內，可以添加增强的逻辑，然后调用被代理对象的方法。  
> 太多简单不再举例。
#### 动态代理
1，JDK 动态代理
被代理对象有接口，使用JDK Proxy
```java
// 接口
public interface DemoInter {

    void test();
}

// 实现类
public class DemoClass implements DemoInter{

    @Override
    public void test() {
        System.out.println("test");
    }
}

// 测试
public class Demo {

    public static void main(String[] args) {
        // 被代理对象
        DemoInter demo = new DemoClass();

        // 代理对象
        DemoInter demo1 = (DemoInter) Proxy.newProxyInstance(demo.getClass().getClassLoader(), demo.getClass().getInterfaces(), new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(1);
                Object res = method.invoke(demo, args);
                System.out.println(2);
                return res;
            }
        });

        // 执行测试
        demo1.test();
    }
}

```
2,CGLIB 
被代理对象没有接口，则使用 CGLIB 生成代理对象
```java
引入依赖
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>

// demo 类
public class DemoClass {

    public void test() {
        System.out.println("test");
    }
}

// 注意这一段代码在 jdk9 之后会报错。
public class Demo {

    public static void main(String[] args) {

        Enhancer enhancer = new Enhancer();
        enhancer.setClassLoader(DemoClass.class.getClassLoader());
        enhancer.setSuperclass(DemoClass.class);
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                System.out.println(1);
                Object ob = methodProxy.invokeSuper(o, args);
                System.out.println(2);
                return ob;
            }
        });

        DemoClass o = (DemoClass) enhancer.create();
        o.test();
        System.out.println(1);
    }
}

```
#### 对比
1，JDK proxy 必须实现接口，CGLIB 不必，因为 CGLIB 是通过生成一个被代理类的子类来进行代理的，因此不能代理声明为 final 类型的类和方法。
2，JDK proxy 效率比较高
3，动态代理在运行时，才生成代理类字节码，并加载到 JVM 中的。


### Unsafe
提供一些不安全的操作，例如系统内存直接访问等，主要是调用一些 Native 方法。   
#### 内存操作
申请内存，设置值，内存copy，释放内存。
```java
//分配新的本地空间
public native long allocateMemory(long bytes);
//重新调整内存空间的大小
public native long reallocateMemory(long address, long bytes);
//将内存设置为指定值
public native void setMemory(Object o, long offset, long bytes, byte value);
//内存拷贝
public native void copyMemory(Object srcBase, long srcOffset,Object destBase, long destOffset,long bytes);
//清除内存
public native void freeMemory(long address);
```

#### 内存屏障
禁止load store 指令重排
```java
//内存屏障，禁止load操作重排序。屏障前的load操作不能被重排序到屏障后，屏障后的load操作不能被重排序到屏障前
public native void loadFence();
//内存屏障，禁止store操作重排序。屏障前的store操作不能被重排序到屏障后，屏障后的store操作不能被重排序到屏障前
public native void storeFence();
//内存屏障，禁止load、store操作重排序
public native void fullFence();
```

#### 对象操作
```java
public class Demo {

    private int value;

    public static void main(String[] args) throws Exception{
        Unsafe unsafe = reflectGetUnsafe();
        assert unsafe != null;
        long offset = unsafe.objectFieldOffset(Main.class.getDeclaredField("value"));
        Demo main = new Demo();
        System.out.println("value before putInt: " + main.value);
        unsafe.putInt(main, offset, 42);
        System.out.println("value after putInt: " + main.value);
        System.out.println("value after putInt: " + unsafe.getInt(main, offset));
    }

    private static Unsafe reflectGetUnsafe() {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            return (Unsafe) field.get(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

#### 数组操作
```java 
// 这两个方法配合起来使用，即可定位数组中每个元素在内存中的位置。
//返回数组中第一个元素的偏移地址
public native int arrayBaseOffset(Class<?> arrayClass);
//返回数组中一个元素占用的大小
public native int arrayIndexScale(Class<?> arrayClass);
``` 

#### CAS
```java
/**
  *  CAS
  * @param o         包含要修改field的对象
  * @param offset    对象中某field的偏移量
  * @param expected  期望值
  * @param update    更新值
  * @return          true | false
  */
public final native boolean compareAndSwapObject(Object o, long offset,  Object expected, Object update);

public final native boolean compareAndSwapInt(Object o, long offset, int expected,int update);

public final native boolean compareAndSwapLong(Object o, long offset, long expected, long update);

// cas操作，使用 cpu的 cmpxchg 指令实现
```

#### 线程调度
```java
//取消阻塞线程
public native void unpark(Object thread);
//阻塞线程
public native void park(boolean isAbsolute, long time);
//获得对象锁（可重入锁）
@Deprecated
public native void monitorEnter(Object o);
//释放对象锁
@Deprecated
public native void monitorExit(Object o);
//尝试获取对象锁
@Deprecated
public native boolean tryMonitorEnter(Object o);

// Jdk中的锁 AQS 很多用到线程操作 和 CAS

public static void main(String[] args) {
    // 当前线程（主线程）
    Thread mainThread = Thread.currentThread();
    new Thread(()->{
        try {
            TimeUnit.SECONDS.sleep(5);
            System.out.println("subThread try to unpark mainThread");
            // 挂起主线程
            unsafe.unpark(mainThread);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();

    System.out.println("park main mainThread");
    // 唤起线程
    unsafe.park(false,0L);
    System.out.println("unpark mainThread success");
}
```


#### Class操作
```java
//获取静态属性的偏移量
public native long staticFieldOffset(Field f);
//获取静态属性的对象指针
public native Object staticFieldBase(Field f);
//判断类是否需要初始化（用于获取类的静态属性前进行检测）
public native boolean shouldBeInitialized(Class<?> c);


@Data
public class Demo {
    public static String aa= "Demo";
    int bb;
}

private void staticTest() throws Exception {
    Demo demo = new Demo();
    // 也可以用下面的语句触发类初始化
    // 1.
    // unsafe.ensureClassInitialized(User.class);
    // 2.
    // System.out.println(User.name);
    System.out.println(unsafe.shouldBeInitialized(Demo.class));
    Field aField = User.class.getDeclaredField("aa");
    long fieldOffset = unsafe.staticFieldOffset(aField);
    Object fieldBase = unsafe.staticFieldBase(aField);
    Object object = unsafe.getObject(fieldBase, fieldOffset);
    System.out.println(object);
}

// 输出
false
aa
```

