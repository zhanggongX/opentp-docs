---
title: Netty
category:
  - 常用框架
order: 1
tag:
  - frame
  - netty
---

### Netty 核心组件
- ServerBootstrap 服务端启动类 
- Bootstrap  客户端启动类
- EventLoopGroup 事件循环组
- EventLoop  事件循环
- Channel  
- ChannelPipeline
- ChannelHandler
- ChannelHandlerContext
- ByteBuf

### ServerBootstrap
用来启动服务器期，都是模板。。

### Bootstrap 
用来启动客户端，也是模板

### EventLoopGroup 
类似于线程池，服务端可以创建两个，
1. 一个 bossGroup 专门用来监听端口，监听新链接的到来，它关联一个 ServerChannel； 
2. 一个 workerGroup 专门用来处理已建立链接的 channel。

### EventLoop 
EventLoop 定义了 Netty 的核心抽象，用于处理连接的生命周期中所发生的事件。    
一个 EventLoopGroup 包含多个 EventLoop, 一个 EventLoop 对应一个线程。  
当新来一个连接的时候,workerGroup 创建一个 Channel 然后将 Channle 注册到 EventLoopGroup 中的某个 EventLoop 上。   
然后这个连接的整个生命周期中的所有事件,都有该 EventLoop 处理,也就是在该 EventLoop 绑定的 Thread 中处理。   
> 也就是说一个 Channel 注册到一个 EventLoop, 一个 EventLoop 会被分配给一个或者多个 Channel。  

### Channel&ChannelPipeline&ChannelHandler&ChannelHanderContext 关系
一个连接对应一个 Channel。   
一个 Channel 对应一个 ChannelPipeline。  
一个 ChannelPipeline 对应多个 ChannelHandler 包含部分 InboundHandler 和 部分 OutBoundHandler。  
一个 ChannelHandlerContext 对应一个 ChannelHandler。  
也就是说一个 ChannelPipline 内是一个双向链表, 链表内的内容是 ChannelHandlerContext, 该 Context 包含一个 ChannelHandler,并且表示该 Handler 是 Inbound 还是 Outbound。    
> 其实 ChannelhandlerContext 就是链表中 Node 的角色。

### Channel.write&ChannelHanlderContext.write
建议使用 Channel.write，它会让消息从最后一个 outbound 处理器往头部处理。  
ctx.write 则是从该 handler 开始往前找 outbound 处理，也就是说 channelPipeline 中该 handler 后的 outbound 将不会处理该消息。 



