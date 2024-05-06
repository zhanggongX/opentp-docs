---
title: Restful
category:
  - 工程质量
order: 1
tag:
  - 工程质量
  - Restful
---

## RESTful API 规范
![](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710409866184-b2db3e97-10d7-40fb-b545-b979de1695a1.png#averageHue=%23dddddd&clientId=u7bec3be8-fa6d-4&from=paste&id=u2e0cf3de&originHeight=215&originWidth=819&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u7cded97e-3486-46a6-95e1-6b6855d87b1&title=)
### 动作

- GET：请求从服务器获取特定资源。举个例子：GET /classes（获取所有班级）
- POST：在服务器上创建一个新的资源。举个例子：POST /classes（创建班级）
- PUT：更新服务器上的资源（客户端提供更新后的整个资源）。举个例子：PUT /classes/12（更新编号为 12 的班级）
- DELETE：从服务器删除特定的资源。举个例子：DELETE /classes/12（删除编号为 12 的班级）
- PATCH：更新服务器上的资源（客户端提供更改的属性，可以看做作是部分更新），使用的比较少，这里就不举例子了。
### 路径（接口命名）
路径又称"终点"（endpoint），表示 API 的具体网址。实际开发中常见的规范如下：

1. **网址中不能有动词，只能有名词，API 中的名词也应该使用复数。** 因为 REST 中的资源往往和数据库中的表对应，而数据库中的表都是同种记录的"集合"（collection）。如果 API 调用并不涉及资源（如计算，翻译等操作）的话，可以用动词。比如：GET /calculate?param1=11&param2=33 。
2. **不用大写字母，建议用中杠 - 不用下杠 _** 。比如邀请码写成 invitation-code而不是 ~~invitation_code~~ 。
3. **善用版本化 API**。当我们的 API 发生了重大改变而不兼容前期版本的时候，我们可以通过 URL 来实现版本化，比如 http://api.example.com/v1、http://apiv1.example.com 。版本不必非要是数字，只是数字用的最多，日期、季节都可以作为版本标识符，项目团队达成共识就可。
4. **接口尽量使用名词，避免使用动词。** RESTful API 操作（HTTP Method）的是资源（名词）而不是动作（动词）。

来举个实际的例子来说明一下吧！现在有这样一个 API 提供班级（class）的信息，还包括班级中的学生和教师的信息，则它的路径应该设计成下面这样。
```
GET    /classes：列出所有班级
POST   /classes：新建一个班级
GET    /classes/{classId}：获取某个指定班级的信息
PUT    /classes/{classId}：更新某个指定班级的信息（一般倾向整体更新）
PATCH  /classes/{classId}：更新某个指定班级的信息（一般倾向部分更新）
DELETE /classes/{classId}：删除某个班级
GET    /classes/{classId}/teachers：列出某个指定班级的所有老师的信息
GET    /classes/{classId}/students：列出某个指定班级的所有学生的信息
DELETE /classes/{classId}/teachers/{ID}：删除某个指定班级下的指定的老师的信息
```
反例
```
/getAllclasses
/createNewclass
/deleteAllActiveclasses
```
理清资源的层次结构，比如业务针对的范围是学校，那么学校会是一级资源:/schools，老师: /schools/teachers，学生: /schools/students 就是二级资源。
### 过滤信息（Filtering）
如果我们在查询的时候需要添加特定条件的话，建议使用 url 参数的形式。比如我们要查询 state 状态为 active 并且 name 为 guidegege 的班级：
```
GET    /classes?state=active&name=guidegege
```
比如我们要实现分页查询：
```
GET    /classes?page=1&size=10 //指定第1页，每页10个数据
```
### 状态码（Status Codes）
**状态码范围：**

| 2xx：成功 | 3xx：重定向 | 4xx：客户端错误 | 5xx：服务器错误 |
| --- | --- | --- | --- |
| 200 成功 | 301 永久重定向 | 400 错误请求 | 500 服务器错误 |
| 201 创建 | 304 资源未修改 | 401 未授权 | 502 网关错误 |
|  |  | 403 禁止访问 | 504 网关超时 |
|  |  | 404 未找到 |  |
|  |  | 405 请求方法不对 |  |

## RESTful 的极致 HATEOAS
**RESTful 的极致是 hateoas ，但是这个基本不会在实际项目中用到。**
**Hypermedia as the Engine of Application State,**
上面是 RESTful API 最基本的东西，也是我们平时开发过程中最容易实践到的。实际上，RESTful API 最好做到 Hypermedia，即返回结果中提供链接，连向其他 API 方法，使得用户不查文档，也知道下一步应该做什么。
上面是 RESTful API 最基本的东西，也是我们平时开发过程中最容易实践到的。实际上，RESTful API 最好做到 Hypermedia，即返回结果中提供链接，连向其他 API 方法，使得用户不查文档，也知道下一步应该做什么。
比如，当用户向 api.example.com 的根目录发出请求，会得到这样一个返回结果

```javascript
{"link": {
  "rel":   "collection https://www.example.com/classes",
  "href":  "https://api.example.com/classes",
  "title": "List of classes",
  "type":  "application/vnd.yourformat+json"
}}
```
上面代码表示，文档中有一个 link 属性，用户读取这个属性就知道下一步该调用什么 API 了。rel 表示这个 API 与当前网址的关系（collection 关系，并给出该 collection 的网址），href 表示 API 的路径，title 表示 API 的标题，type 表示返回类型 Hypermedia API 的设计被称为HATEOAS

