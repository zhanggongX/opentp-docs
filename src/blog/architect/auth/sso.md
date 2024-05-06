---
title: SSO
category:
  - 认证授权
order: 3
tag:
  - 认证授权
  - SSO
---

## SSO 介绍
### 什么是 SSO
SSO 英文全称 Single Sign On，单点登录。SSO 是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。
例如你登录网易账号中心（[https://reg.163.com/](https://reg.163.com/)）之后访问以下站点都是登录状态。

- 网易直播 [https://v.163.com](https://v.163.com/)
- 网易博客 [https://blog.163.com](https://blog.163.com/)
- 网易花田 [https://love.163.com](https://love.163.com/)
- 网易考拉 [https://www.kaola.com](https://www.kaola.com/)
- 网易 Lofter [http://www.lofter.com](http://www.lofter.com/)
### SSO 有什么好处？

1. **用户角度** :用户能够做到一次登录多次使用，无需记录多套用户名和密码，省心。
2. **系统管理员角度** : 管理员只需维护好一个统一的账号中心就可以了，方便。
3. **新系统开发角度:** 新系统开发时只需直接对接统一的账号中心即可，简化开发流程，省时。
## SSO 设计与实现
本篇文章也主要是为了探讨如何设计&实现一个 SSO 系统
以下为需要实现的核心功能：

- 单点登录
- 单点登出
- 支持跨域单点登录
- 支持跨域单点登出
### 核心应用与依赖
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710470588773-ef23c852-2e89-42a2-ad63-2b8b77d1561b.png#averageHue=%23fdf7ee&clientId=u93c43c6c-e407-4&from=paste&height=383&id=ud0b59aeb&originHeight=765&originWidth=1138&originalType=binary&ratio=2&rotation=0&showTitle=false&size=60057&status=done&style=none&taskId=uad2412ed-b84b-42c0-a44e-9375e88b426&title=&width=569)

| 应用/模块/对象 | 说明 |
| --- | --- |
| 前台站点 | 需要登录的站点 |
| SSO 站点-登录 | 提供登录的页面 |
| SSO 站点-登出 | 提供注销登录的入口 |
| SSO 服务-登录 | 提供登录服务 |
| SSO 服务-登录状态 | 提供登录状态校验/登录信息查询的服务 |
| SSO 服务-登出 | 提供用户注销登录的服务 |
| 数据库 | 存储用户账户信息 |
| 缓存 | 存储用户的登录信息，通常使用 Redis |

### 用户登录状态的存储与校验
常见的 Web 框架对于 Session 的实现都是生成一个 SessionId 存储在浏览器 Cookie 中。然后将 Session 内容存储在服务器端内存中，这个 [ken.io](https://ken.io/) 在之前 [Session 工作原理](https://ken.io/note/session-principle-skill) 中也提到过。整体也是借鉴这个思路。
用户登录成功之后，生成 AuthToken 交给客户端保存。如果是浏览器，就保存在 Cookie 中。如果是手机 App 就保存在 App 本地缓存中。本篇主要探讨基于 Web 站点的 SSO。
用户在浏览需要登录的页面时，客户端将 AuthToken 提交给 SSO 服务校验登录状态/获取用户登录信息
对于登录信息的存储，建议采用 Redis，使用 Redis 集群来存储登录信息，既可以保证高可用，又可以线性扩充。同时也可以让 SSO 服务满足负载均衡/可伸缩的需求。

| 对象 | 说明 |
| --- | --- |
| AuthToken | 直接使用 UUID/GUID 即可，如果有验证 AuthToken 合法性需求，可以将 UserName+时间戳加密生成，服务端解密之后验证合法性 |
| 登录信息 | 通常是将 UserId，UserName 缓存起来 |

### 用户登录/登录校验
**登录时序图**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710470725499-4a8c93c4-bcf4-43f7-91f5-d4d0b9f98899.png#averageHue=%23fcfbfa&clientId=u93c43c6c-e407-4&from=paste&height=697&id=u76f33580&originHeight=1393&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=252472&status=done&style=none&taskId=ua1dca266-ff83-4a3c-a866-a1d8ba97cd6&title=&width=750)
按照上图，用户登录后 AuthToken 保存在 Cookie 中。 [domain=test.com](http://domain=test.com)
浏览器会将 domain 设置成 .test.com，
这样访问所有 *.test.com 的 web 站点，都会将 AuthToken 携带到服务器端。
然后通过 SSO 服务，完成对用户状态的校验/用户登录信息的获取。
**登录信息获取/登录状态校验**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710470861475-7aa39833-2af3-48a2-98ff-121af294975d.png#averageHue=%23fcfbf9&clientId=u93c43c6c-e407-4&from=paste&height=580&id=u76bf0445&originHeight=1160&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=210934&status=done&style=none&taskId=u8c2b72f5-26d1-44e6-aafd-aef0e22c0f0&title=&width=750)
### 用户登出
用户登出时要做的事情很简单：

1. 服务端清除缓存（Redis）中的登录状态
2. 客户端清除存储的 AuthToken

**登出时序图**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710470898312-b5b2d7f2-85ef-46e8-a878-8567123b91d3.png#averageHue=%23fcfbf9&clientId=u93c43c6c-e407-4&from=paste&height=521&id=u65758585&originHeight=1041&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=207249&status=done&style=none&taskId=ua87f6e5a-a517-44ac-997e-dbcd0964b3d&title=&width=750)

### 跨域登录、登出
前面提到过，核心思路是客户端存储 AuthToken，服务器端通过 Redis 存储登录信息。由于客户端是将 AuthToken 存储在 Cookie 中的。所以跨域要解决的问题，就是如何解决 Cookie 的跨域读写问题。
解决跨域的核心思路就是：

- 登录完成之后通过回调的方式，将 AuthToken 传递给主域名之外的站点，该站点自行将 AuthToken 保存在当前域下的 Cookie 中。
- 登出完成之后通过回调的方式，调用非主域名站点的登出页面，完成设置 Cookie 中的 AuthToken 过期的操作。

**跨域登录（主域名已登录）**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710470948347-29ce5f0b-6dec-45e8-9753-b5e52783f064.png#averageHue=%23fcfbf9&clientId=u93c43c6c-e407-4&from=paste&height=697&id=u2ab14b06&originHeight=1393&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=313367&status=done&style=none&taskId=u32e8b8f4-259e-474e-8a2a-f35b610000a&title=&width=750)
**跨域登录（主域名未登录）**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710471122976-9e90f47f-4c28-4a9e-815b-ff54b364d926.png#averageHue=%23fcfcfa&clientId=u93c43c6c-e407-4&from=paste&height=750&id=u03859689&originHeight=1500&originWidth=1206&originalType=binary&ratio=2&rotation=0&showTitle=false&size=262478&status=done&style=none&taskId=u304c5aef-feb0-49c2-b132-82ad3d7c272&title=&width=603)
**跨域登出**
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710471272079-c12df742-f805-4d66-a139-f098f610cd47.png#averageHue=%23fcfbf9&clientId=u93c43c6c-e407-4&from=paste&height=701&id=u75933bc6&originHeight=1402&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=287967&status=done&style=none&taskId=u64ca0674-0c3d-4be0-a34a-03e086b6084&title=&width=750)

## 说明

- 关于方案：这次设计方案更多是提供实现思路。如果涉及到 APP 用户登录等情况，在访问 SSO 服务时，增加对 APP 的签名验证就好了。当然，如果有无线网关，验证签名不是问题。
- 关于时序图：时序图中并没有包含所有场景，只列举了核心/主要场景，另外对于一些不影响理解思路的消息能省就省了。
