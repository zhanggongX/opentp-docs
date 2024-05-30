---
title: Restful
category:
  - 工程质量
order: 1
tag:
  - 工程质量
  - Restful
---

## RESTful 介绍
RESTful 是一种基于 REST（Representational State Transfer，表述性状态转移）架构风格的网络服务设计原则。  
它是由 Roy Fielding 在他的博士论文中提出的。  
RESTful API 是一种通过 HTTP 协议进行通信的 API 设计风格，广泛应用于 Web 服务和微服务架构中。  

## RESTful 的核心概念
1. **资源（Resources）**
- 一切皆资源。资源是服务器上可供访问的对象，通常对应于数据库中的实体。每个资源由一个 URI（统一资源标识符）唯一标识。
- 例如，用户资源的 URI 可以是 `/users`，单个用户资源的 URI 可以是 `/users/{id}`。
> 网址中不能有动词，只能有名词，API 中的名词也应该使用复数。

2. **表示（Representation）**
- 资源的表示是指资源的具体内容，可以有多种格式，如 JSON、XML、HTML 等。
- 客户端和服务器通过资源的表示进行交互。

3. **状态转移（State Transfer）**
- 客户端通过对资源进行操作（HTTP 动词）来实现状态转移。每个请求都会导致服务器上的资源状态发生变化。

4. **无状态（Stateless）**
- 每个请求都是独立的，服务器不保存客户端的状态。所有的状态信息都包含在请求中，例如通过 URL、头部、请求体等传递。

## HTTP 动词
RESTful API 使用标准的 HTTP 动词来对资源进行操作：
- GET：读取资源。用于获取资源的表示。
> 例子：`GET /users`（获取所有用户），`GET /users/1`（获取 ID 为 1 的用户）

- POST：创建资源。用于向服务器提交数据并创建新资源。
> 例子：`POST /users`（创建新用户）

- PUT：更新资源。用于更新已存在的资源。
> 例子：`PUT /users/1`（更新 ID 为 1 的用户）

- DELETE：删除资源。用于删除已存在的资源。
> 例子：`DELETE /users/1`（删除 ID 为 1 的用户）

- PATCH：部分更新资源。用于对资源进行部分更新。
> 例子：`PATCH /users/1`（部分更新 ID 为 1 的用户）

## RESTful API 设计原则
1. 资源命名
- 资源的 URI 应该使用名词，并且尽量采用复数形式。
> 例子：`/users` 表示用户资源集合，`/users/1` 表示特定用户资源。

2. 使用 HTTP 动词
- 使用适当的 HTTP 动词对资源进行操作，保持语义一致性。

3. 版本控制
- 在 URI 中加入版本号，以便对 API 进行版本控制。
> 例子：`/v1/users`

4. 状态码
- 使用标准的 HTTP 状态码表示请求的结果。
  - 200 OK：请求成功。
  - 201 Created：资源创建成功。
  - 204 No Content：请求成功但无返回内容（通常用于 DELETE 操作）。
  - 400 Bad Request：请求格式错误。
  - 401 Unauthorized：未经授权。
  - 404 Not Found：资源未找到。
  - 500 Internal Server Error：服务器内部错误。

5. HATEOAS（Hypermedia As The Engine Of Application State）
- 通过超媒体驱动应用状态。响应中包含指向其他资源的链接，使客户端能够发现新的资源和操作。
```json
// 例子
{
  "id": 1,
  "name": "John Doe",
  "links": [
    {
      "rel": "self",
      "href": "/users/1"
    },
    {
      "rel": "friends",
      "href": "/users/1/friends"
    }
  ]
}
```

6. 内容协商（Content Negotiation）
- 客户端和服务器通过 HTTP 头部来协商资源的表示格式。
> 例子：客户端可以通过 `Accept` 头部指定希望接收的格式（如 `application/json`），服务器根据该头部返回相应格式的响应。

## RESTful API 示例
假设我们有一个用户资源：
#### 获取所有用户
- 请求：`GET /users`
- 响应：
  ```json
  [
    {"id": 1, "name": "laozhang"},
    {"id": 2, "name": "laoli"}
  ]
  ```

#### 获取特定用户
- 请求：`GET /users/1`
- 响应：
  ```json
  {"id": 1, "name": "laozhang"}
  ```

#### 创建新用户
- 请求：`POST /users`
- 请求体：
  ```json
  {"name": "laoli"}
  ```
- 响应：`201 Created`
  ```json
  {"id": 1, "name": "laoli"}
  ```

#### 更新用户
- 请求：`PUT /users/1`
- 请求体：
  ```json
  {"name": "laozhanga"}
  ```
- 响应：`200 OK`
  ```json
  {"id": 1, "name": "laozhanga"}
  ```

#### 删除用户
- 请求：`DELETE /users/1`
- 响应：`204 No Content`

## 总结
RESTful 是一种设计 Web 服务的架构风格，通过定义清晰的资源和操作规则，提供了一种简洁、高效的方式来进行客户端和服务器之间的通信。  
它使用标准的 HTTP 协议，通过明确的 URI 和 HTTP 动词来操作资源，具有无状态、可扩展、易于理解和实现等优点。  
在设计 RESTful API 时，需要遵循资源命名、HTTP 动词使用、版本控制、状态码和 HATEOAS 等原则，以确保 API 的一致性和易用性。