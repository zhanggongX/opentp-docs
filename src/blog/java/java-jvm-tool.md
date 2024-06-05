---
title: JVM工具详解
category:
  - Java
order: 6
tag:
  - Java基础
  - Java-JVM
---

### 一，jps 虚拟机进程情况 
jps    
java process status   
-lvm   
l 主类全名带进程号，  
m 启动时给主类的参数，   
v 进程启动时JVM参数   

### 二，jstat 虚拟机统计信息监视工具 
jstat -[options] pid  
jvm statistics monitoring tool  
|  参数| 说明|
|--|--|
|-class | 类装载卸载数量，总空间以及类装载耗时    |
|-gc     | 堆情况   |
|-gccapacity vmid | 和 gc基本一致，主要关注java堆各个区域用到的最大值最小值   |
|-gcutil vmid | 和 gc基本一致，主要关注已使用空间占比   |
|-gccause vmid  | 和 gcutil 基本一致，会额外输出上次gc的原因   |
|-gcnew vmid |  新生代 gc 情况   |
|-gcnewcapacity vmid  | 和 gcnew 基本一致，主要关注使用到的最小最大空间   |
|-gcold vmid  |  监视老年代GC情况   |
|-gcoldcapacity vmid  | 和gcold基本一致，主要关注使用最大最小空间   |
|-gcpermcapacity vmid   | 输出永久代使用的最大最小空间    |
|-compiler vmid  输出JIT | 编译器编译过的方法，耗时等信息   |
|-printcompilation vmid  | 输出已经被JIT编译过的方法   |
> 比如 jstat -gc -h3 31736 1000 10表示分析进程 id 为 31736 的 gc 情况，每隔 1000ms 打印一次记录，打印 10 次停止，每 3 行后打印指标头部。
### 三，jinfo 虚拟机配置信息工具-实时查看和调整虚拟机各项参数 
jinfo   
configuration info for java   
|  参数| 说明|
|--|--|
|-flag name|          to print the value of the named VM flag   |
|-flag [+/-] name |   to enable or disable the named VM flag（设置虚拟机参数）   |
|-flag name=value   | to set the named VM flag to the given value（设置虚拟机参数） |    
|-flags             |            to print VM flags    |
|-sysprops           |       to print Java system properties   |
|**no option**        |     to print both of the above   |
> 比如 jinfo -flag  PrintGC 17340

### 四，jmap 虚拟机内存映像工具 
jmap   
memory map for java   
-dump:/[live,] format=b, file='<'filename'>'  lvmid    
> example:  jmap -dump:live,format=b,file=test.bin 1123  live 表示只导出存活的对象 

-finalizerinfo 
> example： jmap -finalizerinfo 1123  F-Queue中等待执行 finalize方法的对象 

|  参数| 说明|
|--|--|
|-heap |显示虚拟机的堆信息 |
|-histo |显示堆中对象信息，类，实例数量，合计容量 |
|-clstats |以classloader 为统计口径显示类信息 |
|-F | dump失效的时候，强制生成内存快照 |

>Dump出内存， jmap -dump:format=b,file=/opt/dump/test.dump {PID}

### 五，虚拟机快照解析工具 
jhat  
jvm heap analysis tool  
jhap jmap出来的文件，建议使用 VisualVM 或者 JProfile   
访问解析结果，是IP:7000/   
> 比如 jhat C:\Users\SnailClimb\Desktop\heap.hprof

### 六，虚拟机堆栈跟踪工具 
jstack [option] vmid   
-F  强制   
-l  除堆栈外，展示锁的附加信息   
-m 如果调用本地方法，可以展示c/c++的堆栈   

### 七，JIT生成代码反汇编 
HSDIS   
经典的吞吐量优先的jvm配置   
-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC-XX:ParallelGCThreads=20 -XX:+UseParallelOldGC -XX:MaxGCPauseMillis=100 -XX:+UseAdaptiveSizePolicy    
堆大小 3550MB， 新生代 2g。 栈 128k。 新声代使用 UseParallelGC，并发GC线程数20，-XX:+UseParallelOldGC 老年代使用并发收集器。 

设置每次年轻代垃圾回收的最长时间为100 ms。 -xx:+UseAdaptiveSizePolicy   
设置此选项后，并行收集器自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低响应时该间或者收集频率，该值建议使用并行收集器时，并且一直打开。

经典的响应优先的jvm配置 
-Xms4g -Xmx4g -Xmn2g -Xss1024K -XX:MetaspaceSize=128M   
-XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC   
-XX:+UseCMSCompactAtFullCollectionXX:+UseCMSCompactAtFullCollection=5 -XX:CMSInitiatingOccupancyFraction=80  

堆大小4g，新声代2g，栈大小1MB，元空间大小128MB，并发收集线程数20个，  
老年代使用cms收集器，新生代使用 parNew 收集器，    
UseCMSCompactAtFullCollection 打开对老年代的压缩，  
UseCMSCompactAtFullCollection=5，fullgc 5次 后进行空间压缩，  
CMSInitiatingOccupancyFraction=80，老年代达到80% 触发GC





