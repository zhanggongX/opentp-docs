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
paxos是一个被证明完备的分布式系统共识算法。  
共识算法主要是为了让分布式系统中多个节点对某个提案达成一致的算法。  

例如leader节点选举.  

#### basic-paxos
描述就多个节点之间对某个提案达成一致。  

#### multi-paxos
执行多个 basic-paxos 实例，就一系列值达成一致，其实就是多次执行 basic-paxos。  
Raft 是一个更简单的共识算法，它简化了 multi-paxos 的思想，让它更容易理解以及被工程化。  
除了 Raft 还有 zab，fast-paxos 都是在 paxos 基础上改进来的。  


### Basic-Paxos
paxos算法一共有三个角色：   
提议者 **Proposer**，提议者负责接受客户端的请求并发起提案。提案信息通常包括提案编号 (Proposal ID) 和提议的值 (Value)。  
接受者**Acceptor**，负责对提议者的提案进行投票，同时需要记住自己的投票历史。   
学习者**Learner**， 如果有超过半数接受者就某个提议达成了共识，那么学习者就需要接受这个提议，并就该提议作出运算，然后将运算结果返回给客户端。    

### Multi Paxos 思想
Basic Paxos 算法的仅能就单个值达成共识，为了能够对一系列的值达成共识，我们需要用到 Multi Paxos 思想。      
> Multi-Paxos 只是一种思想，这种思想的核心就是通过多个 Basic Paxos 实例就一系列值达成共识。  
> 也就是说，Basic Paxos 是 Multi-Paxos 思想的核心，Multi-Paxos 就是多执行几次 Basic Paxos。



