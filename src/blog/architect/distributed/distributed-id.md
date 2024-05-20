---
title: 分布式ID
category:
  - 分布式
order: 4
tag:
  - distributed
  - 分布式ID
---

## 为什么需要分布式ID
但随着数据日渐增长，有可能需要对数据库进行分库分表，分库分表后仍需要有一个唯一ID来标识一条数据，数据库的自增ID显然不能满足需求；  
特别一点的如订单，也需要分布式ID，因为哪怕订单的数据量小也最后不要使用自增ID，因为使用自增ID，很容易让别人猜到整个系统一天的单量。。

## 分布式ID基本要求
1. **全局唯一**
2. **高性能**
3. **高可用**
4. **方便易用**
5. **安全**：ID 中不包含敏感信息。
6. **有序递增**
7. **可以有具体的业务含义**
8. **独立部署**

## 分布式ID解决方案
### UUID（不推荐）
- **优点**：生成速度比较快、简单易用，本地生成无网络消耗，具有唯一性（重复概率很小）。
- **缺点**：无序、存储消耗空间大、不安全、没有具体业务含义、需要解决重复ID问题，因为大部分ID还是Mysql数据库在使用，还是推荐递增ID，所以UUID还是不怎么合适。

### 数据库主键
数据库主键自增

- **优点**：实现简单，ID单调自增，数值类型查询速度快、存储消耗空间小。
- **缺点**：DB单点存在宕机风险，无法扛住高并发场景。

### 数据库的号段模式
```SQL
CREATE TABLE id_generator (
  id int(10) NOT NULL,
  max_id bigint(20) NOT NULL COMMENT '当前最大id',
  step int(20) NOT NULL COMMENT '号段的布长',
  biz_type	int(20) NOT NULL COMMENT '业务类型',
  version int(20) NOT NULL COMMENT '版本号',
  PRIMARY KEY (`id`)
) 
```
一批批号段ID用完，再次向数据库申请新号段，对max_id字段做一次update操作，update max_id= max_id + step，update成功则说明新号段获取成功，新的号段范围是(max_id ,max_id +step]。
由于多业务端可能同时操作，所以采用版本号version乐观锁方式更新，这种分布式ID生成方式，不会频繁的访问数据库，对数据库的压力小很多。

### NoSql(Redis) incr
Redis不同的持久化方式，会有不同的问题。
1. RDB会定时打一个快照进行持久化，如果Redis挂掉了，重启后会出现ID重复的情况。
2. AOF会对每条写命令进行持久化，由于incr命令的特殊性，会导致Redis重启恢复的数据时间过长。

### 雪花算法
Snowflake 是 Twitter 开源的分布式 ID 生成算法。Snowflake 由 64 bit 的二进制数字组成，这 64bit 的二进制被分成了几部分，每一部分存储的数据都有特定的含义：  
1. sign(1bit): 符号位（标识正负），始终为 0，代表生成的 ID 为正数。
2. timestamp (41 bits): 一共 41 位，用来表示时间戳，单位是毫秒，可以支撑 2 ^41 毫秒（约 69 年）
3. datacenter id + worker id (10 bits): 前 5 位表示机房 ID，后 5 位表示机器 ID。这样就可以区分不同集群/机房的节点。
4. sequence (12 bits): 一共 12 位，用来表示序列号。 序列号为自增值，代表单台机器每毫秒能够产生的最大 ID 数(2^12 = 4096), 单台机器每毫秒最多可以生成 4096 个 唯一 ID。

> 优点：生成速度比较快、生成的 ID 有序递增、比较灵活，可以进行改造。  
> 缺点：需要解决重复 ID 问题（ID 生成依赖时间，在获取时间的时候，可能会出现时间回拨的问题）， 依赖机器 ID 对分布式环境不友好， 固定的机器 ID 可能不够灵活。

## 分布式ID框架
- UidGenerator(百度、Snowflake)  
- Leaf(美团，Snowflake)  
- Tinyid(滴滴，数据库号段模式)
- IdGenerator(Snowflake)
