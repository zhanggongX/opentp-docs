---
title: JWT
category:
  - 认证授权
order: 2
tag:
  - 认证授权
  - JWT
---

## JWT 认证
JSON Web Token (JWT) 是一种基于 JSON 的开放标准 (RFC 7519)，用于在各方之间作为 JSON 对象安全地传输信息。JWT 广泛应用于认证和授权场景，特别是在微服务中。

### JWT 的结构
JWT 由三个部分组成，每部分用点 (`.`) 分隔：  
> **头部(Header).载荷(Payload).签名(Signature)**

#### 1. 头部（Header）
头部通常由两部分组成：令牌类型（即 "JWT"）和使用的签名算法（如 HMAC SHA256 或 RSA）。
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
然后，将这个 JSON 对象进行 Base64Url 编码，形成 JWT 的第一部分。

#### 2. 载荷（Payload）
载荷部分包含声明（claims），声明是关于实体（通常是用户）和其他数据的陈述。声明有三种类型：
- **注册声明（Registered claims）：** 一组预定义的声明，不是强制的，但建议使用，如 `iss`（签发者）、`exp`（过期时间）、`sub`（主题）、`aud`（受众）等。
- **公开声明（Public claims）：** 可以随意定义的声明，但为了避免冲突，建议使用 URI 命名空间。
- **私有声明（Private claims）：** 自定义的声明，用于在共享信息的各方之间传递信息。

一个示例载荷如下：
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```
然后，将这个 JSON 对象进行 Base64Url 编码，形成 JWT 的第二部分。

#### 3. 签名（Signature）
为了创建签名部分，需要将编码后的头部、载荷和一个秘密（secret）或密钥（private key）进行加密，签名的目的是确保 JWT 未被篡改。
```java
SHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```
将生成的签名附加到编码后的头部和载荷的后面，形成完整的 JWT。
```
header.payload.signature
```

### JWT 认证流程
1. 用户认证： 用户使用其凭据（如用户名和密码）向服务器请求认证。
2. 服务器验证： 服务器验证用户凭据，如果有效，生成 JWT 并返回给用户。
3. 用户存储： 用户将收到的 JWT 存储在客户端（通常是 Local Storage 或 Cookie 中）。
4. 后续请求： 在每次请求中，用户将 JWT 包含在请求头（通常是 `Authorization: Bearer <token>`）中。
5. 服务器验证： 服务器接收到请求后，验证 JWT 的有效性和签名，并提取载荷中的信息进行授权。

### JWT 的优缺点
#### 优点
- 无状态： JWT 是无状态的，不需要在服务器端存储会话信息，减少服务器负担。
- 灵活性： 可以包含任何 JSON 兼容的数据，适应各种需求。
- 易于传输： 由于是基于 JSON 的，可以在 URL、Header、Body 中传输。
- 跨域支持： 适用于跨域认证，特别是微服务架构。
#### 缺点
- 不可撤销： 一旦 JWT 签发，除非到期或黑名单机制，无法撤销或更新。
- 安全性依赖于秘密管理： 需要妥善管理签名用的秘密或密钥，防止泄露。
- 载荷可见： 虽然签名部分保证了数据完整性，但载荷是可解码的，敏感信息应加密。

### 使用 JWT 的最佳实践
1. 使用 HTTPS： 始终在 HTTPS 下传输 JWT，防止中间人攻击。
2. 短期有效性： 令牌设置较短的过期时间（如15分钟），减少被盗用的风险。
3. 刷新令牌机制： 使用刷新令牌机制（refresh token）来延长用户会话而不需要重新登录。
4. 敏感信息加密： 不要在载荷中存储敏感信息，或者对敏感信息进行加密。
5. 黑名单机制： 实现令牌黑名单机制，允许撤销特定令牌。

### 示例
```java
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version> <!-- or whatever version you're using -->
    <scope>runtime</scope>
</dependency>
```

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtExample {

    // 生成签名密钥
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String createJwt() {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        // 设置JWT过期时间
        long expMillis = nowMillis + 3600000; // 1小时
        Date exp = new Date(expMillis);

        // 创建JWT
        String jws = Jwts.builder()
                .setSubject("user@example.com")
                .setIssuedAt(now)
                .setExpiration(exp)
                .claim("name", "John Doe")
                .claim("admin", true)
                .signWith(key)
                .compact();

        return jws;
    }

    public static void main(String[] args) {
        String jwt = createJwt();
        System.out.println("Generated JWT: " + jwt);
    }
}

```

```java
// 验证jwt
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class JwtVerifier {

    // 生成签名密钥（与生成JWT时使用的密钥相同）
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static void verifyJwt(String jwt) {
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);

            Claims claims = claimsJws.getBody();
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Name: " + claims.get("name"));
            System.out.println("Admin: " + claims.get("admin"));
            System.out.println("Expiration: " + claims.getExpiration());

        } catch (Exception e) {
            System.out.println("JWT verification failed: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Example JWT (replace with the JWT generated from JwtExample)
        String jwt = "<your-jwt-token>";
        verifyJwt(jwt);
    }
}

```