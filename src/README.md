---
home: true
icon: home
title: 主页
heroImage: /logo.png
# bgImage: https://theme-hope-assets.vuejs.press/bg/6-light.svg
# bgImageDark: https://theme-hope-assets.vuejs.press/bg/6-dark.svg
bgImageStyle:
  background-attachment: fixed
heroText: Opentp
tagline: 业务代码零侵入、分布式、高可用、高并发、易扩展的的线程池监控工具
actions:
  - text: 快速开始
    icon: lightbulb
    link: ./quickstart/
    type: primary

  - text: 文档中心
    icon: /assets/image/doc.svg
    link: ./opentp/


copyright: false
footer: <a href="http://opentp.cn/" > opentp </a> | MIT 协议,  版权所有 © 2024 - present zhanggong | <a href="https://beian.miit.gov.cn/" target="_blank"> 豫ICP备2024059261号-1 </a> | <img src='police.png' height='12' width='12' /><a href="https://beian.mps.gov.cn/#/query/webSearch?code=41010202003313" rel="noreferrer" target="_blank">豫公网安备41010202003313</a>
---

#### 客户端：
1. 业务代码零侵入，只增加了两个线程，一个负责上报线程信息线程，一个守护线程负责监控连接。
2. 上报线程和守护线程速度都可以配置。

#### 服务端：
1. 服务可单机部署, 可集群部署。  
2. 服务集群基于 AP 理论，实现整个集群高可用。  
3. 自带 Gossip 协议框架实现，服务节点上线、下线，集群自动发现，不需要依赖任何第三方中间件。
4. 整体服务基于 Netty 框架实现，包括上报信息 TCP 服务和交互的 Restful 接口，支持高并发。