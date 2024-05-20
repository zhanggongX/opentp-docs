---
title: Raft
category:
  - 分布式
order: 3
tag:
  - distributed
  - Raft
---

## Raft 介绍
Raft是一种用于替代Paxos的共识算法。相比于Paxos，Raft的目标是提供更清晰的逻辑分工使得算法本身能被更好地理解，同时它安全性更高，并能提供一些额外的特性。  

Raft能为在计算机集群之间部署有限状态机提供一种通用方法，并确保集群内的任意节点在某种状态转换上保持一致。  
Raft算法的开源实现众多，在Go、C++、Java以及 Scala中都有完整的代码实现。Raft这一名字来源于"Reliable, Replicated, Redundant, And Fault-Tolerant"（“可靠、可复制、可冗余、可容错”）的首字母缩写。  
集群内的节点都对选举出的领袖采取信任，因此Raft不是一种拜占庭容错算法。  


## Raft 概念
> Raft实现了和Paxos相同的功能，它将一致性分解为多个子问题:  Leader选举(Leader election)、 日志同步(Log replication)、 安全性(Safety)、 日志压缩(Log compaction)、 成员变更(Membership change)等。 

### 节点类型
1，Leader， 负责发起心跳，响应客户端，创建日志，同步日志。  
2，Candidate，候选人，Follower 转化而来，发起投票和竞选。  
3，Follower， 接受 Leader 的心跳和日志同步数据，投票给 Candidate。  

Raft要求系统在任意时刻最多只有一个Leader，正常工作期间只有Leader和Followers。

### 任期
raft 算法将时间划分为任意长度的term（任期）以选举（election）开始，然后就是一段或长或短的稳定工作期（normal Operation）。 任期（term no）是递增的，这就充当了逻辑时钟的作用；如果没有选举出leader就结束了，然后会发起新的选举。

### 选举
一个或多个 Candidate 会尝试成为 Leader。如果一个 Candidate 赢得了选举，它就会在该任期内担任 Leader。如果没有选出 Leader，将会开启另一个任期，并立刻开始下一次选举。   
raft 算法保证在给定的一个任期最少要有一个 Leader。   
每个节点都会存储当前的 term no，当服务器之间进行通信时会交换当前的 term no，如果有服务器发现自己的 term no 比其他人小，那么他会更新到较大的 term 值。  
如果一个 Candidate 或者 Leader 发现自己的 term 过期了，他会立即变成 Follower。如果一台服务器收到的请求的 term 号是过期的，那么它会拒绝此次请求。  

### 日志
在 raft 算法中，leader将客户端请求（command）封装成一个个 log entry，将这些 log entries 复制（replicate）到所有 follower 节点，然后大家按相同顺序应用（apply）log entry中的command，则状态肯定是一致的。  
entry：每一个事件成为 entry，只有 Leader 可以创建 entry。   
> entry 的内容为 <term,index,cmd> 其中 cmd 是可以应用到状态机的操作。    

log：由 entry 构成的数组，每一个 entry 都有一个表明自己在 log 中的 index。  
只有 Leader 才可以改变其他节点的 log。  
entry 总是先被 Leader 添加到自己的 log 数组中，然后再发起共识请求，获得同意后才会被 Leader 提交给状态机。  
Follower 只能从 Leader 获取新日志和当前的 commitIndex，然后把对应的 entry 应用到自己的状态机中。


## Leader 选举过程
raft 使用心跳机制来触发 Leader 的选举。  
节点初始化为Follower，它能够收到来自 Leader 或者 Candidate 的有效信息，那么它会一直保持为 Follower 状态，并且刷新自己的 electionElapsed，重新计时。  
Leader向所有 Followers 周期性发送 heartbeat。 如果 Follower 在选举超时时间内没有收到 Leader 的 heartbeat，就会等待一段随机的时间后发起一次 Leader 选举。
为了开始新的选举，Follower 会自增自己的 term 号并且转换状态为 Candidate。然后他会向所有节点发起 RequestVoteRPC 请求，结果有以下三种情况:
> 1. 赢得选举，成为新的Leader。  
> 2. 其他节点赢得选举，退回 Follower 状态。  
> 3. 一轮选举结束，无人胜出，等待选举时间超时后发起下一次选举。  

> 赢得选举的条件是：一个 Candidate 在一个任期内收到了来自集群内的半数以上的选票。

在 Candidate 等待选票的时候，它可能收到其他节点声明自己是 Leader 的心跳，此时有两种情况：
> 1. 该 Leader 的 term 号大于等于自己的 term 号，说明对方已经成为 Leader，则自己回退为 Follower。  
> 2. 该 Leader 的 term 号小于自己的 term 号，那么会拒绝该请求并让该节点更新 term。  

Raft 协议选举会一直循环下去吗？谁也不服谁，都要当 Leader。  
不会，每一个 Candidate 节点在发起选举后，都会随机化一个新的选举超时时间，这种机制使得各个服务器能够分散开来，在大多数情况下只有一个服务器会率先超时。  

## 日志同步
Leader 选出后，就开始接收客户端的请求。  
Leader 把请求封装成一个 entry，包含<index,term,cmd> 再将这个 entry 添加到自己的日志条目 (Log entries) 末尾，然后并行的向其他服务器发起 AppendEntries RPC，要求其他服务器复制这条 entry。  
当这条日志被复制到大多数服务器上，Leader 将这条日志应用到它的状态机，之后可以成为这个 entry 是 committed 的， 并向客户端返回执行结果。  

raft 保证以下两个性质: 
1. 如果不同日志中的两个条目有着相同的索引(index)和任期号(term)， 则它们所存储的命令是相同的。  
> 因为 Leader 在一个 term 内在给定的一个 log index 最多创建一条日志条目，而且仅有 Leader 可以生成 entry。
2. 如果不同日志中的两个条目有着相同的索引(index)和任期号(term)，则它们之前的所有条目都是完全一样的。
> 一致性检查

一致性检查：
一般情况下，Leader 和 Followers的日志总是保持一致，因此 AppendEntries 一致性检查通常不会失败。 然而万一出现 Leader 崩溃就可能会导致日志不一致，旧的 Leader 可能没有完全复制完日志中的所有条目。
总之 Follower 节点可能会比 Leader 节点少一些日志，也可能多一些日志，怎么解决呢？  
1. Leader 强制 Followers 复制它的日志来处理日志的不一致，Followers 上的不一致的日志会被 Leader 的日志覆盖。
2. Leader 为了使 Followers 的日志同自己的一致，Leader 需要找到 Followers 同它的日志一致的地方，然后覆盖 Followers 在该位置之后的条目。
3. Leader 会从后往前试，每次 AppendEntries 失败后尝试前一个日志条目，直到成功找到每个 Follower 的日志一致位点，然后向后逐条覆盖Followers在该位置之后的条目。
> 新日志条目创建时，会包含紧接着的之前的条目的 log index 和 term。

## 安全性
### 选举限制
1. 拥有最新的已提交的 log entry 的 Follower 才有资格成为 Leader。  
> 每个 Candidate 发送 RequestVoteRPC 时，都会带上最后一个 entry 的信息。所有节点收到投票信息时，会对该 entry 进行比较，如果发现自己的更新，则拒绝投票给该 Candidate。
2. Leader只能推进 commit index 来提交当前 term 的已经复制到大多数服务器上的日志，旧 term 日志的提交要等到提交当前 term 的日志来间接提交。


### 节点崩溃
如果 Leader 崩溃，集群中的节点在 electionTimeout 时间内没有收到 Leader 的心跳信息就会触发新一轮的选主，在选主期间整个集群对外是不可用的。  
如果 Follower 和 Candidate 崩溃，处理方式会简单很多。之后发送给它的 RequestVoteRPC 和 AppendEntriesRPC 会失败。由于 raft 的所有请求都是幂等的，所以失败的话会无限的重试。    
如果崩溃恢复后，就可以收到新的请求，然后选择追加或者拒绝 entry。  

### 时间与可用性
raft 的要求之一就是安全性不依赖于时间：系统不能仅仅因为一些事件发生的比预想的快一些或者慢一些就产生错误。为了保证上述要求，最好能满足以下的时间条件：
broadcastTime << electionTimeout << MTBF

- broadcastTime：向其他节点并发发送消息的平均响应时间；  
- electionTimeout：选举超时时间；  
- MTBF(mean time between failures)：单台机器的平均健康时间；  

broadcastTime应该比electionTimeout小一个数量级，为的是使Leader能够持续发送心跳信息（heartbeat）来阻止Follower开始选举；  
electionTimeout也要比MTBF小几个数量级，为的是使得系统稳定运行。当Leader崩溃时，大约会在整个electionTimeout的时间内不可用；我们希望这种情况仅占全部时间的很小一部分。  
由于broadcastTime和MTBF是由系统决定的属性，因此需要决定electionTimeout的时间。  
一般来说，broadcastTime 一般为 0.5～20ms，electionTimeout 可以设置为 10～500ms，MTBF 一般为一两个月。  

## 日志压缩
在实际的系统中，不能让日志无限增长，否则系统重启时需要花很长的时间进行回放，从而影响可用性。  
Raft采用对整个系统进行snapshot来解决，snapshot之前的日志都可以丢弃。  
每个副本独立的对自己的系统状态进行snapshot，并且只能对已经提交的日志记录进行snapshot。  
Snapshot中包含以下内容:
1. 日志元数据。最后一条已提交的 log entry的 log index和term。这两个值在snapshot之后的第一条log entry的AppendEntries RPC的完整性检查的时候会被用上。
2. 系统当前状态。

当 Leader 要发给某个日志落后太多的 Follower 的 log entry 被丢弃，Leader 会将 snapshot 发给 Follower。  
或者当新加进一台机器时，也会发送 snapshot 给它。发送 snapshot 使用 InstalledSnapshot RPC。  
进行 snapshot 既不要做的太频繁，会消耗磁盘带宽，也不要做的太少，否则一旦节点重启需要回放大量日志，影响可用性。推荐当日志达到某个固定的大小做一次snapshot。  
进行一次 snapshot 可能耗时过长，会影响正常日志同步。可以通过使用 copy-on-write 技术避免 snapshot 过程影响正常日志同步。




