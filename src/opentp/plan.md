---
title: 开发计划
category:
  - opentp
order: 1
tag:
  - opentp文档
---

### opentp-serialization
- [ ] kryo 序列化
- [ ] 其他序列化方案

### opentp-rpc
- [ ] 基础功能开发


### opentp-server
- [x] 支持单机部署
- [ ] 支持集群部署
- [ ] 权限控制
- [ ] appID 和 appKey 申请


### opentp-client
- [ ] 直接引用 opentp-client 包
- [ ] Springboot 项目引用 opentp-client-spring-boot-starter opentp-client 包
- [ ] 高可用，集群不可用时定时重试