---
title: Arthas
category:
  - 中间件
order: 61
tag:
  - arthas
---

## arthas
arthas 最有用的就是 
1. bashboard 查看系统情况
2. trace 查看接口耗时情况
3. orgnl & vmtool 线上执行方法调查线上问题。

### dashboard 实时数据面板 
#### 查询GC等情况 
1. ID java 级别的线程ID，跟jstack中的nativeID不是对应的
2. NAME 线程名
3. GROUP 线程组名
4. PRIORITY 优先级 越大优先级越高
5. STATE 线程状态 RUNABLE|WATING|TIMED_WATING|NEW|TEIMAL
6. CPU 线程cpu使用率 （某个线程的增量CPU时间/采样间隔时间）
7. DELTA_TIME 上次采样后线程运行增量CPU时间，格式为秒
8. TIME 线程运行总cpu时间 格式为 分：秒
9. INTERRUPTED 线程当前的中断位状态
10. DAEMON 是否是daemon线程

#### 内存区域 
1. Memory 各个区
2. used 使用情况
3. total
4. max 最大
5. GC gc类型、次数、时长

Runtime 区域 运行环境 
### thread 查看线程使用情况 
```
thread -n 3 显示最忙的3个线程
thread -all 显示所有匹配的线程
thread 16 查看线程16的栈信息
thread -b 查询 synchronized 关键字阻塞住的线程
thread -i 1000 统计最近1000ms内的线程cpu时间
thread -i 1000 -n 3 列出1000ms内最忙的3个线程
thread -- state WAITING 列出 等待状态的所有线程
```

### ognl 表达式 
```
// 执行静态变量的方法或者静态方法
sc -d cn.opentp.Demo 查看类加载器  

ognl '@java.lang.System@out.println("hello")'

// -c 指定classloader, 使用 classloader命令可以找到类加载器 HashCode
ognl -c 7f9a81e8 @org.springframework.boot.SpringApplication@logger

// 另一种指定类加载器的方式
$ ognl --classLoaderClass \
org.springframework.boot.loader.LaunchedURLClassLoader \
@org.springframework.boot.SpringApplication@logger

// 其他复杂的 ognl 表达式
$ ognl '#value1=@System@getProperty("java.home"), #value2=@System@getProperty("java.runtime.name"), {#value1, #value2}'
// 返回值：
 @ArrayList[
    @String[/opt/java/8.0.181-zulu/jre],
    @String[OpenJDK Runtime Environment],
]


ognl '#bean = @cn.opentp.config.SpringContextConfig@getBean("demoImpl"), #req = new cn.opentp.Req(), #req.setParam("a"), #res = #bean.query(#req) ' -c 5a2f016d
```

### watch 
```
watch com.bj58.teg.ep.okrplus.contract.IOkrOperationService okrSetting -b "{params,returnObj}"
```

### vmtool 执行方法 
```
vmtool --action getInstances --classLoaderClass org.springframework.boot.loader.LaunchedURLClassLoader \
    --className cn.opentp.DemoService \
    --express '#val=new cn.opentp.Req(),#val.setParam("a"), instances[0].okrSetting(#val)' -x 3
```
### options 全局配置开关 
options + tab 显示所有的选项，常用的有json-format 等 
```
option json-format true 支持json化的输出
option save-result true 打开后所有命令的运行结果都保存到 result.log 中
```
### retransform 
```
// 使用示例：
// 1.jad 反编译 UserController
jad --source-only com.example.demo.arthas.user.UserController > /tmp/UserController.java

// 2.查询 classloader hashcode
//sc -d *UserController | grep classLoaderHash

// 3.编辑 /tmp/UserController.java 文件

// 4.mc 编译加载文件
mc --classLoaderClass org.springframework.boot.loader.LaunchedURLClassLoader /tmp/UserController.java -d /tmp
// 或者
mc -c classloaderHash /tmp/UserController.java -d /tmp

// 5.retransform 重新加载 class
retransform /tmp/com/example/demo/arthas/user/UserController.class

// 再使用就是最新的代码了
// ps 使用限制 1.不允许新增加 field/method， 2.正在跑的函数，没有退出不能生效。
```

### 命令列表 
#### 基础 
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| cls  | 清屏  |  |
| session  | 显示 Arthas 会话信息，pid、session_id  |  |
| help  |  |  |
| reset  | 重置所有的增强代码  |  |
| version  | arthas 版本  |  |
| history  | 历史命令  |  |
| exit/quit, stop  | 退出，stop关闭服务  |  |
| keymap  | 快捷键列表  |  |
| cat  | 同 linux cat  |  |
| echo  | 同 linux echo  |  |
| grep  | 同 linux grep  | sysenv｜grep java  |
| tee  | 同 linux tee  | sysprop｜tee /tmp/log  |
| pwd  | 同 linux pwd  |  |
| plaintext  | 将输出去掉ANSI颜色  | jad demo.Class method｜plaintext  |
| wc  | 显示行号  | jad demo.Class method｜wc -l  |
| options  | 全局开关  | 见上方详细说明  |

#### 系统命令 
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| dashbord  | 实时数据面板  | 见上方详细说明  |
| thread  | 查看线程使用情况  | 见上方详细说明  |
| jvm  | 查看当前 JVM 信息  | jvm ｜ grep PATH  |
| sysprop  | 查看当前 JVM 的系统属性  |  |
| sysenv  | 查看当前JVM的环境变量  |  |
| vmoption  | JVM配置参数  | vmoption列出所有参数，【vmoption 参数 true/false】 修改参数  |
| vmtool  | 获取内存中的对象执行，或者强制GC  | 见上方详细信息  |
| perfcounter  | 查看当前jvm的 pref counter 信息  | perfcounter -d  |
| logger  | 查看程序日志配置信息  | logger  |
| getstatic  | 查看类的静态属性，建议使用 ognl 命令  | getstatic class field_name  |
| ognl  | 执行ognl表达式  | 见上方详细使用说明  |
| mbean  | 查看 managed bean 信息（JMX）  | mbean -i 1000 -n 50 java.lang:type=Threading *Count  |
| heapdump  | 约等于 jmap heap dump  | heapdump --live /tmp/dump.hprof  |
| memory  | 查看jvm 内存信息  |  |

#### 类命令 
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| sc  | 查看 JVM 已加载的类信息  | 模糊sc demo.* 具体 sc demo.MathGame [-e 正则] [-f field]  |
| sm  | 查看已加载类的方法信息  | sm java.lang.String 、 sm -d java.lang.String toString  |
| jad  | 反编译指定已加载类的源码  | jad --source-only demo.MathGame、jad demo.MathGame main, [c、classloader]  |
| mc-retransform  | 热更新class文件  | 见上方详细使用说明  |
| mc-redefine  | 热更新class文件，推荐使用 retransform, retransform可撤销，redefine则不行  |  |
| dump  | dump 已加载类的 bytecode 到特定目录  | dump -d /tmp/output java.lang.String  |
| classloader  | 查看 classloader 的继承树，urls，类加载信息  | classloadr、classloader -l、 classloader -c xxxx --load demo.MathGame  |

#### 增强命令 
| 命令 | 说明 | 示例 |
| --- | --- | --- |
| monitor  | 方法执行监控  | monitor -b -c 5 com.test.testes.MathGame primeFactors "params[0] <= 2"  |
| watch  | 函数执行数据观测  | 见上方详细使用说明  |
| trace  | 方法内部调用路径，并输出方法路径上的每个节点上耗时  | trace demo.MathGame run '#cost > 10'  |
| stack  | 输出当前方法被调用的调用路径  | stack demo.MathGame primeFactors '#cost>5'  |
| tt  | 方法执行数据的时空隧道，记录下指定方法每次调用的入参和返回信息，并能对这些不同的时间下调用进行观测  | tt -t demo.MathGame primeFactors、tt -t xTest print 'params[1] instanceof Integer'  |
| profiler  | 生成火焰图  | profiler start、 profiler stop --format html、 查看地址：http://localhost:3658/arthas-output/  |
| jfr  | 用于收集有关正在运行的 Java 应用程序的诊断和分析数据的工具  | jfr start -n myRecording --duration 60s -f /tmp/myRecording.jfr、 jfr stop -r 1  |

## 使用示例
### 接口慢，定位问题
使用 trace 命令，可以很清晰的显示接口整个调用链，以及耗时时间、循环调用次数、循环调用单次耗时，总耗时等。  
定位到具体的方法，进行优化。
> PS：接口慢的问题，大多还是查数据库慢导致的，最终还是进行数据查询优化。

### 服务整体慢
真对这种问题，查接口单次耗时就没啥意义了，这里可以用 moniter 进行监控 -c 可以指定统计周期，统计一个周期内接口的 RT。

### CPU 高的问题
- 非 Arthas 手段
1. jps 找到进程
2. top -Hp 找到具体线程
3. 根据线程ID，执行 jstack。
- Arthas   

执行 thread -n 10 即可，返回最耗时的 10 个线程。  
再执行 threa pid, 展示具体线程信息。

### 哪里调用的方法
有一个方法，多个地方都在调用。想确认哪里调用的怎么办。  
stack 命令解君愁。

### 本地跑没问题，线上不行，是不是类不一样啊
jad 命令可以查看线上类信息。

### 想看看线上某个接口，入参是啥，又返回了啥
watch 命令可以帮到您。

### 有一个接口返回的值和预想的不同
ognl / vmtools 都是可以的，直接在线上调用方法，Spring 项目也是某问题的啦。
> 调用查询肯定没问题，调用更删改，还是要谨慎。。

