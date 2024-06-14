---
title: JVM基础工具
category:
  - Java
order: 60
tag:
  - Java基础
  - Java-JVM
---

## JVM 基础工具

### jps 虚拟机进程查看 
列出正在运行的虚拟机进程，并显示虚拟机执行主类 (Main Class，main() 函数所在的类) 名称以及这些进程的本地虚拟机唯一 ID(LVMID，Local Virtual Machine Identifier)。

JVM Process Status Tool (jps) 主要功能选项

| 参数            | 功能介绍                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- |
| -q              | 只显示 Java 进程的进程 ID，不显示类名、Jar 文件名或参数。                                          |
| -m              | 显示传递给 main 方法的参数。                                                                       |
| -l              | 显示主类的完全限定名称或 Jar 文件的完整路径。                                                      |
| -v              | 显示传递给 JVM 的参数。                                                                            |
| -V              | 显示传递给 JVM 的参数以及被显式指定的 Java 命令行标志。                                            |
| -? 或 -h        | 显示帮助信息。                                                                                     |
```shell
jps -v
96881 sdk.jar -Xmx256m
16627  -Xms128m -Xmx2048m -XX:ReservedCodeCacheSize=512m -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -XX:CICompilerCount=2 -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -ea -Dsun.io.useCanonCaches=false -Djdk.http.auth.tunneling.disabledSchemes="" -Djdk.attach.allowAttachSelf=true -Djdk.module.illegalAccess.silent=true -Dkotlinx.coroutines.debug=off -XX:ErrorFile=/Users/zhanggong/java_error_in_idea_%p.log -XX:HeapDumpPath=/Users/zhanggong/java_error_in_idea.hprof -Djb.vmOptionsFile=/Users/zhanggong/Library/Application Support/JetBrains/IntelliJIdea2020.3/idea.vmoptions -Didea.paths.selector=IntelliJIdea2020.3 -Didea.executable=idea -Didea.home.path=/Applications/IntelliJ IDEA.app/Contents -Didea.vendor.name=JetBrains
14441  -Xms128m -Xmx2048m -XX:ReservedCodeCacheSize=512m -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -XX:CICompilerCount=2 -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -ea -Dsun.io.useCanonCaches=false -Djdk.http.auth.tunneling.disabledSchemes="" -Djdk.attach.allowAttachSelf=true -Djdk.module.illegalAccess.silent=true -Dkotlinx.coroutines.debug=off -XX:ErrorFile=/Users/zhanggong/java_error_in_datagrip_%p.log -XX:HeapDumpPath=/Users/zhanggong/java_error_in_datagrip.hprof -Djb.vmOptionsFile=/Users/zhanggong/Library/Application Support/JetBrains/DataGrip2020.3/datagrip.vmoptions -Didea.paths.selector=DataGrip2020.3 -Didea.executable=datagrip -Didea.platform.prefix=DataGrip -Didea.vendor.name=JetBrains -Didea.home.path=/Applications/DataGrip.app/Contents
98648 Jps -Dapplication.home=/Users/zhanggong/Library/Java/JavaVirtualMachines/corretto-21.0.2/Contents/Home -Xms8m -Djdk.module.main=jdk.jcmd
29503 CliToolLauncher -Xms4m -Xmx64m -XX:+UseSerialGC -Dcli.name=server -Dcli.script=./elasticsearch-8.13.4/bin/elasticsearch -Dcli.libs=lib/tools/server-cli -Des.path.home=/Users/zhanggong/devTools/es/elasticsearch-8.13.4 -Des.path.conf=/Users/zhanggong/devTools/es/elasticsearch-8.13.4/config -Des.distribution.type=tar
```

### jstat 虚拟机统计信息监视
是用于监视虚拟机各种运行状态信息的命令行工具。它可以显示本地或者远程虚拟机进程中的 类加载、内存、垃圾收集、即时编译等 运行时数据。
```shell
# 对于命令格式中的 VMID 与 LVMID 需要特别说明一下: 如果是本地虚拟机进程，VMID 与 LVMID 是一致的; 如果是远程虚拟机进程，那 VMID 的格式应当是:
# [protocol:][//]lvmid[@hostname[:port]/servername]
jstat [ option vmid [interval[s|ms] [count]] ]
# jstat，option参数， 进程ID，每多少秒/毫秒查询一次，查询次数。
```
```shell
# 查询 16627 gc 的情况，每 1 秒查询一次，共 3 次。
jstat -gc 16627 1000 3

# 结果
# E，表示Eden，S0、S1，表示Survivor0、Survivor1，O，表示Old， M，表示 Metaspace， YGC，表示Young GC，FGC，表示Full GC， FGCT，表示Full GC Time， GCT，表示GC Time。
S0C         S1C         S0U         S1U          EC           EU           OC           OU          MC         MU       CCSC      CCSU     YGC     YGCT     FGC    FGCT     CGC    CGCT       GCT   
  55168.0     55168.0         0.0         0.0     441600.0     267871.5    1103632.0     381191.5   606592.0   583711.4   80464.0   71786.4   3403    40.359    58   272.942    74    11.759   325.060
  55168.0     55168.0         0.0         0.0     441600.0     270429.2    1103632.0     381191.5   606592.0   583711.4   80464.0   71786.4   3403    40.359    58   272.942    74    11.759   325.060
  55168.0     55168.0         0.0         0.0     441600.0     270429.2    1103632.0     381191.5   606592.0   583711.4   80464.0   71786.4   3403    40.359    58   272.942    74    11.759   325.060
```

选项 option 代表用户希望查询的虚拟机信息，主要分为三类: 类加载、垃圾收集、运行期编译状况。
| 参数         | 说明                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| `-class`     | 显示有关类加载器的统计信息，包括类加载数、卸载数、总耗时等。                           |
| `-compiler`  | 显示 JIT 编译器的统计信息，包括编译任务数、编译时间等。                                |
| `-gc`        | 显示与垃圾收集有关的统计信息，包括各代（Eden、Survivor、Old）中的容量、使用情况等。     |
| `-gccapacity`| 显示各代内存池的容量统计信息，包括最大容量、已用容量等。                               |
| `-gcutil`    | 显示各代内存池的利用率百分比，以及垃圾收集的统计信息。                                 |
| `-gccause`   | 显示 `-gcutil` 统计信息，同时显示最后一次和当前垃圾收集的原因。                        |
| `-gcnew`     | 显示新生代垃圾收集相关的统计信息，包括 Eden 和 Survivor 区的容量和使用情况等。         |
| `-gcnewcapacity` | 显示新生代的内存池容量统计信息，包括最大容量、当前容量等。                      |
| `-gcold`     | 显示老年代（tenured generation）垃圾收集相关的统计信息。                               |
| `-gcoldcapacity` | 显示老年代内存池容量统计信息。                                                   |
| `-gcmetacapacity` | 显示 Metaspace 区域的容量统计信息。                                              |
| `-gcpermcapacity` | 显示永久代内存池的容量统计信息（适用于 Java 7 及之前版本）。                      |
| `-printcompilation` | 显示正在编译的最后一个方法的统计信息。                                        |
| `-h`         | 显示 `jstat` 命令的帮助信息。                                                          |


### jinfo Java配置信息
jinfo (Configuration Info for Java) 的作用是实时查看和调整虚拟机各项参数。
```shell
# 命令格式
jinfo [ option ] pid

# 使用示例
jinfo -flag +PrintGC vmid 增加打印GC配置。

# 打印所有的配置信息
jinfo -flags 16627   
VM Flags:
-XX:CICompilerCount=2 -XX:ErrorFile=/Users/zhanggong/java_error_in_idea_%p.log -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/Users/zhanggong/java_error_in_idea.hprof -XX:InitialHeapSize=134217728 -XX:MaxHeapSize=2147483648 -XX:MaxNewSize=697892864 -XX:MaxTenuringThreshold=6 -XX:MinHeapDeltaBytes=196608 -XX:NewSize=44695552 -XX:NonNMethodCodeHeapSize=5825228 -XX:NonProfiledCodeHeapSize=265522842 -XX:OldSize=89522176 -XX:-OmitStackTraceInFastThrow -XX:ProfiledCodeHeapSize=265522842 -XX:ReservedCodeCacheSize=536870912 -XX:+SegmentedCodeCache -XX:SoftRefLRUPolicyMSPerMB=50 -XX:-UseAOT -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseConcMarkSweepGC 
```

### jmap Java内存映像工具

jmap (Memory Map for Java) 命令用于生成堆转储快照(一般称为 heapdump 或 dump 文件)。 如果不使用 jmap 命令，要想获取 Java 堆转储快照也还有一些比较“暴力”的手段，譬如在 JVM 添加 -XX:+HeapDumpOnOutOfMemoryError 参数，可以让虚拟机在内存溢出异常出现之后自动生成堆转储快照文件，通过 -XX:+HeapDumpOnCtrlBreak 参数则可以使用 `[Ctrl]+[Break]` 键让虚拟机生成堆转储快照文件，又或者在 Linux 系统下通过 Kill -3 命令发送进程退出信号 “恐吓” 一下虚拟机，也能顺利拿到堆转储快照。  

jmap 的作用并不仅仅是为了获取堆转储快照，它还可以查询 finalize 执行队列、Java 堆和方法区的详细信息，如空间使用率、当前用的是哪种收集器等。  
```shell
# 命令格式
jmap [ option ] vmid
```

```shell
# 使用示例
jmap -dump:format=b,file=./heap.hprof 2840
Dumping heap to /home/work/heap.hprof ...
Heap dump file created
```

下面是 `jmap` 命令的选项表格，其中每个参数都对应了其说明。`jmap` 是 Java 内存映像工具，用于生成和分析 Java 应用程序的内存转储。

`jmap` Options

| 参数                | 说明                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `-dump:format=b,file=<filename> <pid>` | 生成堆转储文件（heap dump），并保存到指定的文件中。`format=b` 指定二进制格式。  |
| `-finalizerinfo <pid>` | 列出在 `Finalizer` 队列中等待终结的对象。                                                    |
| `-heap <pid>`       | 显示详细的 Java 堆信息，包括各个内存池的使用情况。                                               |
| `-histo[:live] <pid>` | 打印堆中对象的直方图。`live` 可选参数用于仅显示活动对象。                                      |
| `-permstat <pid>`   | 显示永久代（适用于 Java 7 及之前版本）内存信息，包括类加载器的统计信息。                           |
| `-F`                | 在目标虚拟机无响应时强制执行 jmap 操作。通常与其他选项组合使用，例如 `jmap -F -heap <pid>`。      |
| `-clstats <pid>`    | 打印类加载器的统计信息，包括类加载数、卸载数及每个类加载器的内存占用。                              |

### jstack Java堆栈跟踪工具
jstack(Stack Trace for Java) 命令用于生成虚拟机当前时刻的线程快照 (一般称为 threaddump )。线程快照就是当前虚拟机内每一条线程正在执行的方法堆栈的集合，生成线程快照的目的通常是定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间挂起等，都是导致线程长时间停顿的常见原因。线程出现停顿时通过 jstack 来查看各个线程的调用堆栈，就可以获知没有响应的线程到底在后台做些什么事情，或者等待着什么资源。
```bash
# 请求格式
jstack [ option ] vmid
```

jstack options
| 参数                  | 说明                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `-l <pid>`            | 显示具有锁信息的堆栈跟踪，包括与每个线程关联的锁和等待锁的信息。                                    |
| `-m <pid>`            | 显示 Java 和本地（native）堆栈帧的信息，这对于分析本地方法调用的问题非常有用。                      |
| `-F <pid>`            | 当目标虚拟机无响应时强制输出堆栈信息。通常会用于紧急情况下，可能会导致目标 JVM 的性能下降。         |
| `-h` 或 `-help`       | 显示 `jstack` 命令的帮助信息，包括可用选项和基本用法。                                             |


### jhat 虚拟机堆转储快照分析
分析 heapdump 文件。
jhat \opt\heap.hprof 分析快照
> 比较少用，因为分析工作是一个耗时而且极为耗费硬件资源的过程，一是一般不会在部署应用程序的服务器上直接分析堆转储快照。另外一个原因是jhat的分析功能相对来说比较简陋。





