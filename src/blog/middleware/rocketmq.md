---
title: RocketMQ
category:
  - 中间件
order: 5
tag:
  - RocketMQ
---

## RocketMQ

## RocketMQ介绍
RocketMQ 是一个 **主题**
**模型** 的消息中间件，具有**高性能、高可靠、高实时、分布式** 的特点。它是一个采用 Java 语言开发的分布式的消息系统，由阿里巴巴团队开发，在 2016 年底贡献给 Apache，成为了 Apache 的一个顶级项目。 在阿里内部，RocketMQ 很好地服务了集团大大小小上千个应用，在每年的双十一当天，更有不可思议的万亿级消息通过 RocketMQ 流转。
## 队列模型和主题模型
### 队列模型
消息队列内部就是一个队列，但是多个消费者的情况下，一个队列肯定就不够用了，如果消息的生产者往多个队列写消息会影响资源和性能，而且如果生产者知道了消费者的个数再根据个数去发送消息，完全违背了解偶的初衷。
### 主题模型
主题模型就是发布-订阅模型，它就很好的解决了广播的问题。

## RocketMQ的消息模型
rocketMQ就是基于主题模型实现的
它的模型实现如图
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1709803553435-b11e4532-734a-40ed-826e-eab41a32a59a.png#averageHue=%23fbfaf8&clientId=uddd51625-8223-4&from=paste&height=278&id=u9020f786&originHeight=555&originWidth=1391&originalType=binary&ratio=2&rotation=0&showTitle=false&size=299376&status=done&style=none&taskId=uc7a69ac2-e95f-4128-917f-aca5613368d&title=&width=695.5)
整个模型有生产组，主题，消费组
生产组：生成消息，一般一个生产者组只生成相同的消息。
消费者组：代表某一类的消费者，比如我们有多个短信系统作为消费者，这多个合在一起就是一个 Consumer Group 消费者组，它们一般消费相同的消息。
Topic 主题：代表一类消息，比如订单消息，物流消息等等（一个主题有多个队列）。

## RocketMQ架构
RocketMQ 技术架构中有四大角色 NameServer、Broker、Producer、Consumer 。
**Broker**：主要负责消息的存储、投递和查询以及服务高可用保证。说白了就是消息队列服务器嘛，生产者生产消息到 Broker ，消费者从 Broker 拉取消息并消费。
> Topic 和队列的关系——一个 Topic 中存在多个队列，那么这个 Topic 和队列存放在哪呢？
> 一个 Topic 分布在多个 Broker上，一个 Broker 可以配置多个 Topic ，它们是多对多的关系。

**NameServer**：不知道你们有没有接触过 ZooKeeper 和 Spring Cloud 中的 Eureka ，它其实也是一个 **注册中心** ，主要提供两个功能：**Broker 管理** 和 **路由信息管理** 。说白了就是 Broker 会将自己的信息注册到 NameServer 中，此时 NameServer 就存放了很多 Broker 的信息(Broker 的路由表)，消费者和生产者就从 NameServer 中获取路由表然后照着路由表的信息和对应的 Broker 进行通信(生产者和消费者定期会向 NameServer 去查询相关的 Broker 的信息)。
**Producer**：消息发布的角色，支持分布式集群方式部署。说白了就是生产者。
**Consumer**：消息消费的角色，支持分布式集群方式部署。支持以 push 推，pull 拉两种模式对消息进行消费。同时也支持集群方式和广播方式的消费，它提供实时消息订阅机制。说白了就是消费者。
他们的关系如下图

![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1709880304316-b61eab6b-0361-4a4f-89da-f3df589e83fe.png#averageHue=%23f7f7f7&clientId=uefc2febd-557f-4&from=paste&height=283&id=uf99a699e&originHeight=522&originWidth=1281&originalType=binary&ratio=2&rotation=0&showTitle=false&size=144678&status=done&style=none&taskId=uff8b45a5-fda0-4301-b491-235bfb1336b&title=&width=693.5)
## 消费者模式
集群模式，每个集群只能收到一个
广播模式，集群的每个消费者都能收到
## 消费者方式
push和poll
push 也是 poll 的，只不过poll是短轮询，push是长轮询。
## 消息
消息的生命周期：
初始化，待消费，消费中，消费提交，消费删除（不会直接删除，只是标记已消费）。
### 定时消息
RocketMQ的定时消息分了18个等级。
在 4.x 版本中，只支持延时消息，默认分为 18 个等级分别为：1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h，也可以在配置文件中增加自定义的延时等级和时长。在 5.x 版本中，开始支持定时消息，在构造消息时提供了 3 个 API 来指定延迟时间或定时时间。
定时消息除了普通消息的各个阶段，还有个定时中：
定时中：定时消息被发送到服务端，和普通消息不同的是，服务端不会直接构建消息索引，而是会将定时消息**单独存储在定时存储系统中**，等待定时时刻到达。
### 顺序消息
顺序消息仅支持使用 MessageType 为 FIFO 的主题，即顺序消息只能发送至类型为顺序消息的主题中，发送的消息的类型必须和主题的类型一致。和普通消息发送相比，顺序消息发送必须要设置消息组。（推荐实现 MessageQueueSelector 的方式，见下文）。要保证消息的顺序性需要单一生产者串行发送。
单线程使用 MessageListenerConcurrently 可以顺序消费，多线程环境下使用 MessageListenerOrderly 才能顺序消费。
#### 原理：
RocketMQ只能保证分区有序，如果想全局有序，就自己实现 MessageQueueSelecter 相同的一组消息，发送到同一个分区队列中。
消费端多线程的话，使用MessageListenerOrderly
### 事务消息（保证本地事务和消息的一致性）
事务消息是 Apache RocketMQ 提供的一种高级消息类型，支持在分布式场景下保障消息生产和本地事务的最终一致性。简单来讲，就是将本地事务（数据库的 DML 操作）与发送消息合并在同一个事务中。例如，新增一个订单。在事务未提交之前，不发送订阅的消息。发送消息的动作随着事务的成功提交而发送，随着事务的回滚而取消。当然真正地处理过程不止这么简单，包含了半消息、事务监听和事务回查等概念，下面有更详细的说明。

## 顺序消费和重复消费问题
### 顺序消费
所谓严格顺序是指 消费者收到的 **所有消息** 均是有顺序的。严格顺序消息 **即使在异常情况下也会保证消息的顺序性** 。
但是，严格顺序看起来虽好，实现它可会付出巨大的代价。如果你使用严格顺序模式，Broker 集群中只要有一台机器不可用，则整个集群都不可用。你还用啥？现在主要场景也就在 binlog 同步。
所以一般还是用普通顺序消费，但是可以保证发送严格顺序。
目前RocketMQ发送有三种算法
1，轮询
2，最小投递延迟
3，自定义 MessageQueueSelector
### 发送异常
选择队列后会与 Broker 建立连接，通过网络请求将消息发送到 Broker 上，如果 Broker 挂了或者网络波动发送消息超时此时 RocketMQ 会进行重试。
重新选择其他 Broker 中的消息队列进行发送，默认重试两次，可以手动设置。

```java
producer.setRetryTimesWhenSendFailed(5);
```
### 消息过大
消息超过 4k 时 RocketMQ 会将消息压缩后在发送到 Broker 上，减少网络资源的占用。
### 重复消费
就两个字—— **幂等**。

## 使用RocketMQ实现分布式事务

## 消息堆积问题
1，生产者限流
2，增加消费者，同时增加 Queue
## 保证消息的不丢失
1，发送消息开启ACK
2，消费消息也开启ACK
3，RocketMQ的持久化（开启同步刷盘，单个节点）
4，开启同步复制（多个节点），主从broker都写入消息才算成功
5，如果是多主从broker为了保证消息的顺序性， 他要求在写入消息的时候，要求**至少消息复制到半数以上的节点之后**
## 回溯消息
回溯消费是指 Consumer 已经消费成功的消息，由于业务上需求需要重新消费，在RocketMQ 中， Broker 在向Consumer 投递成功消息后，**消息仍然需要保留** 。并且重新消费一般是按照时间维度，例如由于 Consumer 系统故障，恢复后需要重新消费 1 小时前的数据，那么 Broker 要提供一种机制，可以按照时间维度来回退消费进度。RocketMQ 支持按照时间回溯消费，时间维度精确到毫秒。

## RocketMQ高效读写
RocketMQ 内部主要是使用基于 mmap 实现的零拷贝(其实就是调用上述提到的 api)，用来读写文件，这也是 RocketMQ 为什么快的一个很重要原因。
```
FileChannel fileChannel = new RandomAccessFile("test.txt", "rw").getChannel();
MappedByteBuffer mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_WRITE, 0, fileChannel.size());
```
为啥不用 sendFile

## 存储机制
**CommitLog**：
**消息主体以及元数据的存储主体**，存储 Producer 端写入的消息主体内容,消息内容不是定长的。单个文件大小默认 1G ，文件名长度为 20 位，左边补零，剩余为起始偏移量，比如 00000000000000000000 代表了第一个文件，起始偏移量为 0，文件大小为 1G=1073741824；当第一个文件写满了，第二个文件为 00000000001073741824，起始偏移量为 1073741824，以此类推。消息主要是**顺序写入日志文件**，当文件满了，写入下一个文件。
**ConsumeQueue**：
消息消费队列，**引入的目的主要是提高消息消费的性能**(我们再前面也讲了)，由于RocketMQ 是基于主题 Topic 的订阅模式，消息消费是针对主题进行的，如果要遍历 commitlog 文件中根据 Topic 检索消息是非常低效的。Consumer 即可根据 ConsumeQueue 来查找待消费的消息。其中，ConsumeQueue（逻辑消费队列）**作为消费消息的索引**，保存了指定 Topic 下的队列消息在 CommitLog 中的**起始物理偏移量 offset，消息大小 size 和消息 Tag 的 HashCode 值。consumequeue 文件可以看成是基于 topic 的 commitlog 索引文件**，故 consumequeue 文件夹的组织方式如下：topic/queue/file 三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样 consumequeue 文件采取定长设计，每一个条目共 20 个字节，分别为 8 字节的 commitlog 物理偏移量、4 字节的消息长度、8 字节 tag hashcode，单个文件由 30W 个条目组成，可以像数组一样随机访问每一个条目，每个 ConsumeQueue文件大小约 5.72M；
**IndexFile：**
IndexFile（索引文件）提供了一种可以通过 key 或时间区间来查询消息的方法。这里只做科普不做详细介绍。
总结一下就是消息存储在 CommitLog文件中（每个文件的大小是1G，文件写满了生成下一个），文件名就是偏移量，consumeQueue相当于 CommitLog 的索引，保存了主题下的队列消息在 commitLog 中的起始物理位置偏移量 offset 和 消息大小 size 和 消息 tag 的hash值。




