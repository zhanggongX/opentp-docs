---
title: Java基础
category:
  - Java
order: 1
tag:
  - Java基础
---


## 基础
### java的移位运算符
一共有三种  
|位移符号|作用|
|----|----|
| 左移(<<) | 左移运算符，向左移若干位，高位丢弃，低位补零。x << 1,相当于 x 乘以 2(不溢出的情况下)。 |
| 带符号右移(>>) |带符号右移，向右移若干位，高位补符号位，低位丢弃。正数高位补 0,负数高位补 1。x >> 1,相当于 x 除以 2。|
| 无符号右移(>>>) |无符号右移，忽略符号位，空位都以 0 补齐。 |
> Java 只支持 int 和 long 的位移，浮点型数据不支持位移，其他的例如 short、byte、char 等类型进行位移前，也是先将它的类型转成 int 型再进行位移。  

位移示例：
```java
(6 << 1 = 12)
0110 << 1 = 1100 = 12
(-6 << 1 = -12) 
11111111111111111111111111111010 << 1 = 11111111111111111111111111110100

(6 >> 1 = 3)  
0110 >> 1 = 0011 = 3
(-6 >> 1 = -3)  
11111111111111111111111111111010 >> 1 = 11111111111111111111111111111101(-3)


(6 >>> 1 = 3) 
0110 >>> 1 = 0011 = 3
(-6 >>> 1 = 2147483645) 
11111111111111111111111111111010 >>> 1 = 01111111111111111111111111111101(2147483645)
```
位移总结：
> << >> 是有符号位移，所以最高位是啥还是啥，位移完正数还是正数，负数还是负数，>>> 是无符号位移，最高位补0，如果是正数就是正常的位移，如果是负数，位移完变成了正数，注意没有 <<<。

### 包装类型的缓冲机制
Byte、Short、Integer、Long 这 4 种包装类默认创建了数值 [-128，127] 的相应类型的缓存数据    
Character 创建了数值在 [0,127] 范围的缓存数据  
Boolean 直接返回 True or False
> 注意，Float、Double 并没有缓存机制。
> 注意 缓存机制可能导致 == 判断两个值不相等，所以包装类型比较还是用 equals 吧

### 自动装箱和拆箱
其实代码编译后自动调用了 valueOf() 方法进行装箱，调用 xxValue() 方法进行拆箱。

### 浮点数精度丢失问题
计算机存储数据都是二进制的，而计算机位数是有限的，如果十进制转二进制发生循环就无法精准表达，例如 0.2 在转成二进制存储的时候，就会发生循环，无法使用二进制精准表达，就会出现精度丢失的问题。
> 建议使用 BigDecimal 或者使用 long 来表达精度数据，new BigDecimal("0.2"), 或者 200，表达 0.2。  
> 如果仅仅比较两个值是否相等，建议使用 compareTo 因为 compareTo 仅仅比较两个数值是否相等，例如 1.0 = 1, 如果用 equals 还会比较精度 1.0 != 1;

### BigInteger 
用来表示大于 Long.MAX_VALUE 的值。

### Java成员变量和局部变量

| 比较 | 成员变量 | 局部变量 |
|----|----|----|
| 位置| 类 | 方法 |
| 归属| 对象 | 方法 |
| 存储| 实例| 栈空间 |
| 生存时间| 实例创建-实例回收 | 方法调用-方法调用结束 |
| 默认值| 自动赋默认值，对象=null, 基础类型=0 | 不会自动赋值 |

### 面向对象的三大特征
封装，继承，多态。

### 接口和抽象类
根本的区别，接口是自顶而下的思想，抽象类是自底而上的设计。

### Object
它是所有类的父类。
```java
// native 获得当前类的引用对象
getClass
// native hash 码
hashCode
// 比较是否相等
equals
// native 创建并返回当前对象的 copy
clone
// 返回实例的哈希码的16进制字符串
toString
// native 唤醒一个在此对象监视器上等待的线程，如果有多个线程在等待只会唤醒任意一个。
notify
// native 唤醒所有在此对象监视器上等待的线程。
notifyAll
// 暂停线程的执行。
wait(long timeout)
// 同上
wait(long timeout, int nanos)
// 同上，无超时时间，一直等待。
wait()
// 被垃圾回收时触发。
finalize
```

### String, StringBuffer, StringBuilder 的区别
String 
是不可变的，内部使用 char[] 存储，jdk9 后优化成了 byte[] 存储，这个数组使用了 private final 进行修饰，也没有提供内部方法可以对它进行修改。  
例如语法糖的 a + b，其实就是创建了一个新的 StringBuilder 对象，拼接后生成了新的 String对象。

StringBuffer   
是安全的，它和 StringBuilder 都集成自 AbstactStringBuilder，它是基于模版方法模式，只不过StringBuilder 的所有方法都使用 Synchronied 进行了装饰，所以它是线程安全的。  

StringBuilder  
和 StringBuffer 差不多，只不过方法没有加锁，如果是方法内String拼接，使用 StringBuilder 即可。

### 字符串常量池
字符串常量池在堆中，是JVM为了提高String对象效率提供的一片区域，主要是为了避免字符串的重复创建，字符串常量池放入堆中也是为了提供垃圾回收效率。

### String#intern
一个 native 方法，作用是将指定的字符串对象的引用保存在字符串常量池中。  
1，如果字符串常量池中保存了对应的字符串对象的引用，直接返回该引用。  
2，如果字符串常量池中没有保存对应的字符串对象的引用，那就在字符串常量池中创建一个指向该字符串对象的引用并返回。   
3，例如：  
String s1 = "java", String s2 = new String("java"),   
String s3 = s1.intern(), String s4 = s2.intern();   
最终 s3， s4 得到的都是 s1 的对象引用。


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
//释放内存
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

    private int test;

    public static void main(String[] args) throws Exception{
        Unsafe unsafe = getUnsafe();
        assert unsafe != null;
        long offset = unsafe.objectFieldOffset(Demo.class.getDeclaredField("test"));
        Demo demo = new Demo();
        System.out.println(demo.test);
        unsafe.putInt(demo, offset, 42);
        System.out.println(demo.test);
        System.out.println(unsafe.getInt(demo, offset));
    }

    private static Unsafe getUnsafe() {
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
public final native boolean compareAndSwapObject(Object o, long offset,  Object expected, Object update);
public final native boolean compareAndSwapInt(Object o, long offset, int expected,int update);
public final native boolean compareAndSwapLong(Object o, long offset, long expected, long update);
// cas操作，使用 cpu的原子指令 cmpxchg 指令实现
```

#### 线程调度
```java
//取消阻塞线程
public native void unpark(Object thread);
//time 时间内，阻塞线程
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
// AQS 通过 LockSupport.park() 和 LockSupport.unpark() 实现线程的阻塞和唤醒的，底层就是调用 Unsafe 的 park、unpark。

public class Demo{
    public static void main(String[] args) {
    
        Thread curThread = Thread.currentThread();
        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(10);
                System.out.println("10秒后唤起主线程");
                unsafe.unpark(curThread);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("挂起当前线程");
        unsafe.park(false, 0L);
        System.out.println("主线程被唤醒");
    }
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

