---
title: RocketMQ 最佳实践
category:
  - 中间件
order: 5
tag:
  - RocketMQ
---

## 消费过程幂等
RocketMQ 无法避免消息重复（Exactly-Once），所以如果业务对消费重复非常敏感，需要在业务层面进行去重处理。

## 消费速度慢
### 提高消费并行度
绝大部分消息消费行为都属于 IO 密集型，即可能是操作数据库，或者调用 RPC，这类消费行为的消费速度在于后端数据库或者外系统的吞吐量，通过增加消费并行度，可以提高总的消费吞吐量，但是并行度增加到一定程度，反而会下降。所以，应用必须要设置合理的并行度。 如下有几种修改消费并行度的方法：

1. 同一个 ConsumerGroup 下，通过增加 Consumer 实例数量来提高并行度。可以通过加机器，或者在已有机器启动多个进程的方式。
2. 提高单个 Consumer 的消费并行线程，5.x PushConsumer SDK 可以通过PushConsumerBuilder.setConsumptionThreadCount() 设置线程数，SimpleConsumer可以由业务线程自由增加并发，底层线程安全；历史版本SDK PushConsumer可以通过修改参数 consumeThreadMin、consumeThreadMax实现。

> 在 RocketMQ 5.0 之前的版本中，包括PullConsumer、DefaultPushConsumer、DefaultPullConsumer、LitePullConsumer等，默认且仅能使用队列粒度负载均衡策略，所以就导致，同一个 ConsumerGroup 下，提供超过订阅队列数的 Consumer 实例无效。   

> 在 RocketMQ 5.0 后，提供了消息粒度负载均衡策略，同一消费者分组内的多个消费者将按照消息粒度平均分摊主题中的所有消息，即同一个队列中的消息，可被平均分配给多个消费者共同消费。

### 批量方式消费
某些业务流程如果支持批量方式消费，则可以很大程度上提高消费吞吐量，例如订单扣款类应用，一次处理一个订单耗时 1s，一次处理 10 个订单可能也只耗时 2s，这样即可大幅度提高消费的吞吐量。建议使用5.x SDK的 SimpleConsumer，每次接口调用设置批次大小，一次性拉取消费多条消息。

### 重置位点跳过非重要消息
发生消息堆积时，如果消费速度一直追不上发送速度，如果业务对数据要求不高的话，可以选择丢弃不重要的消息。

### 优化每条消息消费过程


## 数据安全问题
### Broker 角色
Broker 角色分为 ASYNC_MASTER（异步主机）、SYNC_MASTER（同步主机）以及SLAVE（从机）。  
如果对消息的可靠性要求比较严格，可以采用 SYNC_MASTER加SLAVE的部署方式。  
如果对消息可靠性要求不高，可以采用ASYNC_MASTER加SLAVE的部署方式。如果只是测试方便，则可以选择仅 ASYNC_MASTER 或仅 SYNC_MASTER 的部署方式。

### FlushDiskType
SYNC_FLUSH（同步刷新）相比于ASYNC_FLUSH（异步处理）会损失很多性能，但是也更可靠，所以需要根据实际的业务场景做好权衡。  


## 其他知识点
### 新创建的 ConsumerGroup 从哪里开始消费消息？
5.x SDK，在首次上线时会从服务器中的最新消息开始消费，也就是从队列的尾部开始消费；再次重新启动后，会从最后一次的消费位置继续消费。  
3.x/4.x SDK 则比较复杂，如果首次启动是在发送的消息在三天之内，那么消费者会从服务器中保存的第一条消息开始消费；如果发送的消息已经超过三天，则消费者会从服务器中的最新消息开始消费，也就是从队列的尾部开始消费。再次重新启动后，会从最后一次的消费位置继续消费。

### 消息在服务器上可以保存多长时间？
存储的消息将最多保存 3 天，超过 3 天未使用的消息将被删除。

### Broker崩溃以后有什么影响
1. Master节点崩溃  
消息不能再发送到该 Broker 集群，但是如果您有另一个可用的 Broker 集群，那么在主题存在的条件下仍然可以发送消息。消息仍然可以从 Slave 节点消费。

2. 一些Slave节点崩溃  
只要有另一个工作的 Slave，就不会影响发送消息。 对消费消息也不会产生影响，除非消费者组设置为优先从该Slave消费。 默认情况下，消费者组从 Master 消费。

3. 所有 Slave 节点崩溃  
向 Master 发送消息不会有任何影响，但是，如果 Master是 SYNC_MASTER，Producer会得到一个 SLAVE_NOT_AVAILABLE ，表示消息没有发送给任何 Slave。 对消费消息也没有影响，除非消费者组设置为优先从 Slave 消费。 默认情况下，消费者组从 Master 消费。