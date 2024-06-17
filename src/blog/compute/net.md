---
title: 计算机网络
category:
  - 计算机基础
order: 2
tag:
  - 计算机基础
  - 网络
---

## 网络模型
主要的网络模型包括：  
OSI（Open Systems Interconnection）七层模型  
TCP/IP（Transmission Control Protocol/Internet Protocol）四层模型。  

### OSI 模型
OSI 模型由国际标准化组织（ISO）提出，是一个七层网络模型，用于定义和规范网络通信的过程。每一层都有特定的功能，通过封装与解封装的方式向上或向下传递数据。

### OSI 模型图示

```
+----------------------+
| 应用层   (Application) |
+----------------------+
| 表示层   (Presentation)|
+----------------------+
| 会话层   (Session)    |
+----------------------+
| 传输层   (Transport)  |
+----------------------+
| 网络层   (Network)    |
+----------------------+
| 数据链路层 (Data Link) |
+----------------------+
| 物理层   (Physical)   |
+----------------------+
```

### OSI 模型的七层结构

1. 物理层（Physical Layer）  
定义了物理设备的标准，包括接口、电压、传输速度、信号调制等。主要负责数据的物理传输，如电信号或光信号。   
比如设备：网线、光纤、网卡等。   
主要协议有：以太网、RS-232 等。  

2. 数据链路层（Data Link Layer）    
提供介质访问控制（MAC）和链路管理，确保可靠的数据传输。处理数据帧的封装与传输，负责错误检测和纠正。  
比如设备：交换机、网桥。  
主要协议有：以太网协议、帧中继（Frame Relay）、PPP（点对点协议）。

3. 网络层（Network Layer）  
负责数据的路由和转发，提供逻辑地址的分配和管理，实现不同网络之间的数据通信。  
比如设备：路由器。   
主要协议有：IP、ICMP、ARP。

4. 传输层（Transport Layer）  
提供端到端的通信服务，负责数据的分段、重组、流量控制和错误处理。  
协议：TCP（Transmission Control Protocol）、UDP（User Datagram Protocol）。

5. 会话层（Session Layer）   
管理会话连接，负责建立、维护和终止通信会话，支持数据的同步和恢复。  
协议：PPTP（Point-to-Point Tunneling Protocol）、RPC（Remote Procedure Call）。

6. 表示层（Presentation Layer）  
处理数据的格式化、加密、解密和压缩，确保数据能够被接收方正确解释。
协议：SSL/TLS、JPEG、GIF、MPEG。

7. 应用层（Application Layer）
提供网络服务和接口给应用程序，包括文件传输、电子邮件、远程登录等。
协议：HTTP、FTP、SMTP、DNS。



### TCP/IP 模型

TCP/IP 模型是由美国国防部开发的四层模型，是现代互联网的基础。相比 OSI 模型，TCP/IP 模型更为简洁实用，强调实现而非理论。

### TCP/IP 模型图示

```
+---------------------+
| 应用层 (Application) |
+---------------------+
| 传输层 (Transport)  |
+---------------------+
| 网络层 (Internet)   |
+---------------------+
| 网络接口层 (Network Interface) |
+---------------------+
```

### TCP/IP 模型的四层结构

1. 网络接口层（Network Interface Layer）  
对应 OSI 的物理层和数据链路层，负责在特定物理网络上发送 IP 数据包。  
协议：以太网协议、Wi-Fi、Token Ring。

2. 网络层（Internet Layer）  
与 OSI 的网络层相似，负责路由和转发数据包。
协议：IP（Internet Protocol）、ICMP、ARP。

3. 传输层（Transport Layer）  
提供端到端的通信服务，类似于 OSI 模型的传输层。  
协议：TCP、UDP。  

4. 应用层（Application Layer）  
对应 OSI 模型的会话层、表示层和应用层，直接为应用程序提供服务。  
协议：HTTP、FTP、SMTP、DNS。

## OSI 与 TCP/IP 模型对比

- 层数：OSI 模型有七层，TCP/IP 模型有四层。
- 应用：OSI 是理论模型，主要用于教学和标准化；TCP/IP 是实际应用的网络模型。
- 灵活性：OSI 模型较为复杂，适合各种通信系统的描述；TCP/IP 模型较为灵活，简化了实现过程。

### 图示对比

```
OSI 模型                          TCP/IP 模型
+------------------+               +-----------------+
| 应用层 (Application)   | <-> | 应用层 (Application)|
+------------------+               +-----------------+
| 表示层 (Presentation) | <-> |                   |
+------------------+               +-----------------+
| 会话层 (Session)      | <-> |                   |
+------------------+               +-----------------+
| 传输层 (Transport)   | <-> | 传输层 (Transport) |
+------------------+               +-----------------+
| 网络层 (Network)     | <-> | 网络层 (Internet)  |
+------------------+               +-----------------+
| 数据链路层 (Data Link) | <-> | 网络接口层 (Network Interface)|
+------------------+               +-----------------+
| 物理层 (Physical)     | <-> |                   |
+------------------+               +-----------------+
```

## 通信过程

## TCP&UDP

## IP

## ARP&RARP

## Http

## WebSocket

## 打开一个网页

## PING

## DNS

## 网络安全