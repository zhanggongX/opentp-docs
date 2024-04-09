---
title: Java IO
category:
  - Java
order: 3
tag:
  - Java基础
  - Java-IO
---

## Java IO
### 常见的IO模型
同步IO，同步非阻塞IO，IO多路复用，事件驱动IO，异步IO  
#### JAVA中常见的IO模型  
BIO，Socket/ServerSocket  
NIO（IO多路复用基于NIO） 三大核心组件  Channel，Selector，Buffer  
AIO  

### IO多路复用和同步非阻塞IO的区别
同步非阻塞IO模型，应用程序会一直发起 Read 调用，只不过读不到数据不会阻塞程序（当数据从内核态到用户态的过程中，仍然是阻塞的）。  
IO 多路复用会先发起 Select 调用，只有当内核数据准备好后才会发起 Read 调用（当数据从内核态到用户态的过程中，仍然是阻塞的）。  
区别就是一个是轮循所有的 IO，一个是只发起内核的 Select / epoll 调用  
> Ps：几乎所有的内核都支持 select , 而 epoll 是 select 的增强版本，linux2.6内核后才有，增强了IO效率。  

### Selector、Poll、Epoll 的区别
selector 和 poll 都是通过轮询监听的端口取到读写事件然后去处理
他们俩的区别就是 selector 底层是数组实现的，有个数限制即 1024 个，poll 底层是链表实现的，没有个数限制
epoll 则是事件驱动的，底层是红黑树，也没有链接个数限制。
epoll 三个 linux 函数，分别是 epoll_create 创建epoll 监听， epoll_ctl 加入到监听， epoll_wait 等待链接、读、写事件。


### NIO的三大组件
Selector  
基于事件驱动的I/O多路复用模型  
Selector 监控注册到其的 Channel，然后监听 Channel 的事件  
比如接受链接，发起链接，读，写  

Buffer  
jdk提供了各种buffer, intbuffer, bytebuffer 等等  
它的核心成员 capacity, limit, position, mark  
它的核心方法 flip(切换读模式) get put clean（切换写模式）  

Channel  
channel 是和文件打交道的，网络套接字也是文件  
read 将数据读取到 buffer  
write 将buffer数据写入channel  

### 零拷贝
NIO 的零拷贝，    
MappedByteBuffer 的零拷贝，基于 mmap，  
FileChanel 的 transferTo/transferFroom 基于 sendFile。  





