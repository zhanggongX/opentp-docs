---
title: JVM
category:
  - Java
order: 50
tag:
  - Java基础
  - JVM
---

## JVM各区域划分
共享：堆，元空间，直接内存。  
私有：虚拟机栈，本地方法栈，程序计数器。  

## 字符串常量池
字符串常量池在堆中，是 JVM 为了提高 String 对象效率提供的一片区域，主要是为了避免字符串的重复创建，字符串常量池放入堆中也是为了提供垃圾回收效率。  

### 运行时常量池
Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池，而Class文件在元空间中。  

### 类加载过程/类的生命周期
加载 -> 验证 -> 准备 -> 解析 -> 初始化 -> 使用 -> 卸载  
加载：加载Class文件，生成Class对象  
验证：验证Class文件是否符合JVM规范  
准备：正式为类变量分配内存并初始化类变量初始值，如果类变量没有final修饰，此阶段给默认值  
解析：解析阶段将类的符号引用替换为直接引用的过程，就是得到类引用的类，方法，字段在内存中的实际位置。  
初始化：new \ getStatic \ putStatic  
卸载：  

### 类结构
魔数  
版本号  
常量池  
访问控制标识  
当前类、父类、接口数量、接口集合  
字段表集合  
方法表集合  
属性表集合  

### 对象创建过程
类加载检查  
分配内存（指针碰撞（内存规整），空闲列表（内存不规整））  
初始化0值  
设置对象头  
执行 init 方法  

### 类加载器
JDK内置的加载器   
BootstrapClassLoader 启动类加载器，加载JDK核心代码，C++实现，无父加载器  
extensionClassLoader 加载JDK扩展包Class  
AppClassLoader 应用类加载器，加载我们写的程序，ClassPath 下的所有类  

### 什么是双亲委派模型
类加载总是交给父加载器去加载，如果父加载器加载不了，再使用本加载器。  
#### 双亲委派模型的好处
双亲委派模型可以避免类的重复加载，例如我定义了一个 Object 类，双亲委派模型可以保证加载的是java.lang.Object 而不是我们自己定义的 Object  
#### 自定义类加载器
如果我们不想打破模型重写 findClass 即可，如果想打破模型，就要重写 loadClass 类了。  
#### 打破双亲委派模型
可以实现加载的类互相隔离。  
SPI 的加载，SPI实现类需要使用 启动类加载器，但是代码又不在 启动类加载器的范围呢，可以使用线程上下文加载器，让启动类加载器借助子类加载器加载。  
Tomcat 的类加载优先自己加载，自己加载不了再让父加载器加载，来保证多个war的多个应用隔离。  

### 垃圾回收
#### 垃圾回收算法
标记清理，标记整理  

### JVM 参数
-Xms4g -Xmx4g -Xmn2g -Xss1024K   
-XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC   
-XX:+UseCMSCompactAtFullCollection -XX:CMSInitiatingOccupancyFraction=80   
-XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintTenuringDistribution   
-XX:+PrintHeapAtGC -XX:+PrintReferenceGC -XX:+PrintGCApplicationStoppedTime   
-XX:+PrintSafepointStatistics    
-XX:PrintSafepointStatisticsCount=1   
-Xloggc:/opt/gc/gc-%t.log -XX:+UseGCLogFileRotation   
-XX:NumberOfGCLogFiles=14 -XX:GCLogFileSize=100M。  

-Xms 最小堆  
-Xmx 最大堆  
-Xmn 新生代   

-XX:MetaspaceSize 误区，它并不是元空间初始大小，元空间大小初始值是 20.8M，是触发GC的值  
-XX:MaxMetaspaceSize(元空间最大值)  

### JVM 常用工具
#### jps 
查看运行的 java 线程
#### jstat 
收集jvm运行各种参数
jstat -gcutil vmid 显示垃圾收集信息
#### jinfo 
jvm 配置信息
jinfo vmid 显示虚拟机的配置信息
jinfo -flag +PrintGC vmid 增加打印GC配置。
#### jmap
堆存储快照
生成快照 jmap -dump:format=b,file=\opt\heap.hprof 17340

```shell
jmap -dump:format=b,file=./heap.hprof 2840
Dumping heap to /home/work/heap.hprof ...
Heap dump file created
```

jmap -heap vmid 查看堆的快照
#### jstack
jvm 的线程的堆栈信息
jstack vmid 查看 栈信息
#### jhat
分析 heapdump 文件。
jhat \opt\heap.hprof 分析快照


