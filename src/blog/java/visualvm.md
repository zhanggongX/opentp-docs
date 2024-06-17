---
title: VisualVM
category:
  - Java
order: 60
tag:
  - Java基础
  - visualVm
---

## VisualVM 介绍
> 待完善

[官网](https://visualvm.github.io/)  
[官方文档](https://visualvm.github.io/documentation.html)  
- 插件：  
推荐安装 Visual GC 插件。

> VisualVM 建议启动是配置和线上一致的 JDK 版本，我之前用 JDK17 启动 VisualVM ，服务器版本是 JDK1.8，无法远程看的服务器状态。

### 本地分析
在启动应用程序后，将打开 VisualVM 的主窗口。缺省情况下，“应用程序” 窗口显示在主窗口的左窗格中。在 “应用程序” 窗口中，可以快速查看本地和远程 JVM 上运行的 Java 应用程序。
local 就是本地运行的 Java 应用。
> 生产环境用处不大，可以用来学习使用。

### 远程分析
VisaulVM 分析远程 JVM，需要开启 JMX 和 jstatd

- 开启 JMX
```shell
# 在启动 Java 应用程序时，需要添加 JMX 参数。
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -Djava.rmi.server.hostname=YOUR_REMOTE_SERVER_IP \
     -jar your-application.jar

```

- 开启 jstatd  
在 JDK 安装 bin 目录里添加 jstatd.all.policy 文件，文件内容为：
```shell
grant codebase "file:${java.home}/../lib/tools.jar" {
  permission java.security.AllPermission;
};
```
- 启动 jstatd
```shell
jstatd -J-Djava.security.policy=jstatd.all.policy -J-Djava.rmi.server.hostname=xx.xx.xxx.xx
```
然后就可以进行远程连接啦。

> 不过我一般都是使用 arthas 进行线上问题分析。[arthas介绍](https://opentp.cn/blog/java/Arthas.html)


### Heap 文件分析
当我们线上服务出现 OOM 或者 内存占用过高的情况下，这时进行在本地环境进行堆分析。这是我这边使用场景比较多的情况。
服务已经挂掉，只能进行本地分析啦。

首先，记得添加参数：
```shell
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/java_heapdump/
```
1. 把 dump 文件下载到本地。
2. VisualVM -> file -> load 加载 dump.hprof 文件。
3. VisualVM 主要有以下几个视图：
    - summary(概要) 包括堆信息（大小，类数量，GCRoots, Classloaders, 实例数量等），环境变量（系统信息，Java 版本等），JVM 参数，系统参数，通过实例数排序的类信息，通过实例大小排序的类信息，通过大小排序的实例信息，支配试图。
    > 如果存在 OOM，这里会有红色的提示（OutOfMemoryErrorThrad），点开很容易定为到内存溢出的位置。 
    - 对象视图，建议通过支配关系进行对象排序，找出占用内存最多的对象，分析它们是否合理。对疑似泄漏的对象进行引用链分析，查看哪些对象引用了这些疑似泄漏的对象，从而导致它们未被回收。
    - 线程视图，这里可以查看线程的信息，检查是否有线程长时间占用资源，或线程死锁等问题。
    - OQL 查询，


### 需要分析的重点

1. 大对象：查找并分析内存中占用大量空间的对象，确定是否合理。
2. 类实例数量：检查是否有某些类的实例数量异常多，导致内存消耗过大。
3. 未被释放的对象：找出生命周期过长的对象，特别是那些不应该长期存在的对象。
4. 引用路径：分析对象的引用路径，确定为什么对象没有被回收。
5. 类加载情况：检查是否有多余或重复的类被加载。
6. 垃圾回收根：查看哪些对象被 GC Root 引用，从而未被垃圾回收。

### 注意事项

1. 文件大小：堆转储文件可能非常大，占用大量磁盘空间，加载和分析可能需要时间和资源。
2. 性能影响：生成堆转储时，可能会影响应用程序的性能，因此建议在非高峰期或测试环境中生成。
3. 隐私和安全：堆转储文件可能包含敏感数据，应妥善保管并避免在不安全的环境中使用。
4. 内存溢出：在 VisualVM 分析大型堆转储文件时，可能会遇到内存不足问题。可以通过增加 VisualVM 的内存来解决。
5. 分析环境：尽量在本地或类似生产环境的机器上进行分析，以免影响实际运行环境。






## 参考文章
[visualvm工具远程对linux服务器上的JVM虚拟机进行监控与调优](https://www.cnblogs.com/zhujiqian/p/14578878.html)  
[VisualVM及模拟简单场景分析使用](https://juejin.cn/post/7034296284005531662)