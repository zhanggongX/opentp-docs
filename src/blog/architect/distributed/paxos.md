---
title: Paxos（帕克索斯）
category:
  - 分布式
order: 2
tag:
  - distributed
  - Paxos
---

### 什么是Paxos  
Paxos 算法是莱斯利·兰伯特（英语：Leslie Lamport）于1990年提出的一种基于消息传递且具有高度容错特性的共识（consensus）算法。  
需要注意的是，Paxos常被误称为 “一致性算法” 。但是 “一致性（consistency）” 和 “共识（consensus）” 并不是同一个概念。Paxos是一个共识（consensus）算法。  
paxos是一个被证明完备的分布式系统共识算法。  
共识算法主要是为了让分布式系统中多个节点对某个提案达成一致的算法。  

例如leader节点选举.  

#### basic-paxos
描述就多个节点之间对某个提案达成一致。  

#### multi-paxos
执行多个 basic-paxos 实例，就一系列值达成一致，其实就是多次执行 basic-paxos。  
Raft 是一个更简单的共识算法，它简化了 multi-paxos 的思想，让它更容易理解以及被工程化。  
除了 Raft 还有 zab，fast-paxos 都是在 paxos 基础上改进来的。  


### Paxos 算法的核心概念和流程：
#### 角色：
1. Proposer（提议者）：负责提出提案。
2. Acceptor（接受者）：负责接受或拒绝提案。
3. Learner（学习者）：负责学习已经达成的一致提案。
#### 基本流程：
Paxos 算法主要包括两个阶段：准备阶段（Prepare Phase）和接受阶段（Accept Phase）。
- 准备阶段：  
Proposer 选择一个提案编号（proposal number）并向一组 Acceptor 发送准备请求（prepare request）。   
Acceptor 接收到准备请求后，如果收到的提案编号大于之前接受的最高提案编号，则向 Proposer 发送承诺（promise），并在承诺中包含之前接受的最高提案的内容。  
如果 Acceptor 已经接受过更高编号的提案，则拒绝该提案。  
- 接受阶段：  
如果 Proposer 收到大多数 Acceptor 的承诺（promise），则向这些 Acceptor 发送接受请求（accept request），包含要提交的提案内容。  
Acceptor 收到接受请求后，如果之前没有接受过更高编号的提案，则接受该提案并将其提交。  

### Paxos 思想
Paxos 算法的核心思想是通过提案编号和多数派确认来保证分布式系统的一致性。  
它在理论上保证了安全性和活性，但在实际应用中，可能存在性能上的挑战和复杂性。  
因此，一些衍生算法和改进版本（如Multi-Paxos、Fast Paxos、Flexible Paxos等）被提出来应对实际应用中的需求和问题。

### Multi Paxos 思想
Basic Paxos 算法的仅能就单个值达成共识，为了能够对一系列的值达成共识，我们需要用到 Multi Paxos 思想。      
> Multi-Paxos 只是一种思想，这种思想的核心就是通过多个 Basic Paxos 实例就一系列值达成共识。  
> 也就是说，Basic Paxos 是 Multi-Paxos 思想的核心，Multi-Paxos 就是多执行几次 Basic Paxos。

### 示例：
[58的 paxos 算法实现](https://github.com/wuba/WPaxos)


