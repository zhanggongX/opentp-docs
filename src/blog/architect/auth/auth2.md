---
title: 认证授权
category:
  - 认证授权
order: 1
tag:
  - 认证授权
---

## 介绍
认证（Authentication）和授权（Authorization）是信息安全领域中的两个重要概念，尽管它们经常被一起提及，但实际上有着不同的功能和目的。

### 认证（Authentication）
认证是验证用户身份的过程，即确认用户确实是他们所声称的人。常见的认证方式包括：
1. 密码（Password）： 用户输入用户名和密码来证明其身份。
2. 多因素认证（MFA，Multi-Factor Authentication）： 除了密码外，还需要其他形式的验证，如短信验证码、电子邮件验证码、指纹识别等。
3. 生物识别（Biometrics）： 使用独特的生物特征如指纹、面部识别、虹膜扫描等进行身份验证。
4. 安全令牌（Security Tokens）： 使用硬件或软件令牌生成一次性密码（OTP，One-Time Password）。

### 授权（Authorization）
授权是在确认用户身份后，决定用户可以访问哪些资源和执行哪些操作的过程。授权通常在认证之后进行，是确保用户只能访问他们被允许访问的资源的一种安全措施。常见的授权机制包括：
1. 访问控制列表（ACL，Access Control List）： 定义了哪些用户或系统进程可以访问特定的资源，以及允许的操作类型（读、写、执行等）。
2. 基于角色的访问控制（RBAC，Role-Based Access Control）： 根据用户的角色分配权限，而不是单独分配给每个用户。比如，管理员角色有全面访问权限，而普通用户只能访问部分资源。
3. 基于属性的访问控制（ABAC，Attribute-Based Access Control）： 根据用户的属性（如部门、职位）以及资源的属性和环境条件来进行权限分配。
4. OAuth 和 OpenID Connect： OAuth是一种开放标准，用于在第三方应用程序和服务之间授权访问资源，而不需要共享密码。OpenID Connect是基于OAuth的身份验证协议。

### 区别与联系
- 区别： 认证是关于确认“你是谁”，而授权是关于确定“你能做什么”。
- 联系： 认证通常是授权的前提，只有在确认用户身份后，系统才会根据用户的身份信息进行相应的授权操作。  
> 认证：员工A登录系统，系统通过员工A的用户名和密码或其他认证方式确认其身份。  
> 授权：系统确认员工A的身份后，根据员工A的角色（如管理员、普通员工）决定其可以访问哪些数据和执行哪些操作。  

总之，认证和授权是信息安全中不可或缺的两部分，通过确保用户的身份并限制他们的访问权限，能够有效保护系统资源的安全和完整性。


## 认证-传统的会话认证
会话认证（Session-Based Authentication）是一种传统且广泛使用的用户认证方式，特别适用于Web应用。  
它通过在服务器端存储用户的会话信息，确保用户在访问受保护资源时能够维持一个持续的登录状态。

### 会话认证流程
1. 用户登录：用户在登录页面输入用户名和密码，并提交到服务器。
2. 验证身份：服务器验证用户的凭证。如果验证成功，服务器创建一个会话（Session）。
3. 生成会话ID：服务器为该会话生成一个唯一的会话ID（Session ID）。
4. 存储会话信息：服务器将会话ID和相关的用户信息存储在服务器端（如内存、数据库、缓存等）。
5. 发送会话ID：服务器将会话ID以cookie的形式发送到客户端浏览器。
6. 后续请求：在后续的每个请求中，客户端浏览器都会自动将会话ID包含在cookie中发送回服务器。
7. 验证会话：服务器接收到请求后，通过会话ID验证会话信息，从而识别用户身份并允许访问受保护的资源。

### 优点
- 简单易理解：会话认证机制直观，开发和维护成本低。
- 适合状态管理：可以在服务器端存储大量的用户状态信息。
- 良好的兼容性：适用于大多数Web应用和传统架构。

### 缺点
- 扩展性差：在分布式系统中，会话信息需要在不同服务器之间共享，管理复杂。
- 服务器负担大：会话信息存储在服务器端，占用服务器资源。
- 依赖cookie：需要确保客户端支持并启用cookie，且存在被盗用的风险。

### 注意事项
1. 安全性：
- 使用安全的随机生成器生成会话ID，防止预测攻击。
- 通过HTTPS传输cookie，防止中间人攻击。
- 设置 HttpOnly 和 Secure 属性，防止客户端脚本访问 cookie。
- 实现会话过期机制，定期清理过期会话，防止会话劫持。

2. 扩展性：
- 使用分布式会话存储（如Redis、Memcached）来共享会话信息，适应横向扩展。
- 考虑Session Stickiness（会话粘性），在负载均衡中保持用户请求分配到同一服务器。

3. 性能：
- 优化会话存储的读写性能，避免成为系统瓶颈。
- 使用缓存机制加速会话验证过程。

## 认证-JWT 认证

[详细内容参考](https://opentp.cn/blog/architect/auth/jwt.html)

## 认证的安全性
在实现认证系统时，确保安全性至关重要。认证系统的漏洞可能导致未授权访问、数据泄露以及其他安全威胁。

### 1. 使用强密码和安全策略
- 强密码要求：强制用户设置复杂的密码，包括大写字母、小写字母、数字和特殊字符。
- 定期更改密码：要求用户定期更新密码，以减少密码泄露的风险。
- 密码长度：建议密码长度至少为8-12个字符。
- 防止常见密码：禁止使用常见密码，如“password123”。

### 2. 密码存储和传输
- 密码散列：永远不要以明文形式存储密码。使用强散列算法（如 bcrypt, Argon2, PBKDF2）对密码进行散列处理。
```java
// 使用BCrypt进行密码散列
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode(plainPassword);
```
- 盐值处理：为每个密码生成唯一的盐值，并将其与密码一起散列，以防止彩虹表攻击。
- 安全传输：通过HTTPS传输敏感数据，确保数据在传输过程中不被窃取。

### 3. 多因素认证（MFA）
- 添加额外验证层：除了密码，还可以使用其他因素进行认证，如短信验证码、TOTP（基于时间的一次性密码）、硬件令牌等。
```java
// 示例：使用Google Authenticator进行TOTP认证
import com.warrenstrange.googleauth.GoogleAuthenticator;

GoogleAuthenticator gAuth = new GoogleAuthenticator();
int verificationCode = gAuth.getTotpPassword(secretKey);
```

### 4. 账户锁定和速率限制
- 账户锁定：在多次失败登录尝试后暂时锁定用户账户，以防止暴力破解。
- 速率限制：限制来自同一IP地址的请求频率，防止暴力破解和DDoS攻击。

### 5. 安全的会话管理
- 会话ID：使用安全的随机生成器创建唯一的会话ID，并将其存储在HTTP-only和Secure属性的Cookie中。
- 会话过期：设置会话的过期时间，并在用户长时间未活动时使会话失效。
- 会话固定攻击：防止会话固定攻击（Session Fixation），在用户登录时生成新的会话ID。

### 6. 防止跨站点请求伪造（CSRF）
- CSRF令牌：在每个表单中包含唯一的CSRF令牌，并在服务器端验证该令牌。
```java
// Spring Security中启用CSRF防护
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().and()
            .authorizeRequests().anyRequest().authenticated();
    }
}
```

### 7. 安全的JWT使用
- 签名算法：使用强大的签名算法（如HS256或RS256）来签名JWT，防止篡改。
- 短期有效性：设置JWT的有效期较短，减少令牌被盗用的风险。
- 刷新令牌：使用刷新令牌机制来延长用户会话，而不需要频繁登录。
- 敏感信息加密：不要在JWT的载荷中存储敏感信息，或对其进行加密。


## 授权-RBAC模型
基于角色的访问控制（Role-Based Access Control，RBAC）是一种常用的授权模型，它通过定义角色来简化权限管理。  
RBAC根据用户的角色授予权限，用户通过角色来访问系统中的资源和操作。

### RBAC的基本概念
1. 用户（User）：系统中的实际操作人员，可以是单个用户或用户组。
2. 角色（Role）：一组权限的集合，代表特定的工作职责或功能。例如，管理员、Leader、HR等。
3. 权限（Permission）：对系统资源的访问或操作许可。例如，读取、写入、删除权限。
4. 资源（Resource）：系统中的实体，可以是文件、数据库记录、应用功能等。
5. 用户-角色分配（User-Role Assignment）：将角色分配给用户。
6. 角色-权限分配（Role-Permission Assignment）：将权限分配给角色。

### RBAC的基本原则
1. 最小权限原则：用户只应拥有完成其工作所需的最少权限。
2. 职责分离：通过分配不同的角色来确保重要任务不由同一用户完成，以减少错误和欺诈风险。

### RBAC模型的实践
#### 1. 定义角色和权限
首先，定义系统中的角色和对应的权限。角色是权限的集合，每个角色代表一组相关的权限。
```sql
// 角色表
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

// 权限点表中
CREATE TABLE Permissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

```

#### 2. 用户-角色和角色-权限关系

```sql
// 用户角色表
CREATE TABLE UserRoles (
    id INT,
    user_id INT,
    role_id INT
);

// 角色权限表
CREATE TABLE RolePermissions (
    id INT,
    role_id INT,
    permission_id INT
);
```

### 优点和缺点
#### 优点
1. 易于管理：通过角色管理权限，可以简化权限分配和管理。
2. 可扩展性：可以轻松添加新的角色和权限，而无需修改现有的用户权限配置。
3. 灵活性：可以根据组织结构和业务需求定义角色和权限。

#### 缺点
1. 角色爆炸问题：在复杂的系统中，可能需要大量的角色来满足不同的权限组合，导致管理困难。
2. 缺乏细粒度控制：RBAC通常不能满足非常细粒度的权限控制需求。

### RBAC与其他模型的比较
- RBAC vs. ABAC（Attribute-Based Access Control）：
  - RBAC基于角色进行权限分配，适用于结构清晰的环境。
  - ABAC基于属性（如用户属性、资源属性）进行权限决策，更加灵活，但复杂度较高。

- RBAC vs. ACL（Access Control List）：
  - ACL为每个资源维护一个列表，列出可以访问该资源的用户或角色，适合细粒度控制。
  - RBAC通过角色简化了权限管理，适合较大规模的系统。

## 授权-ABAC模型
### todo

## OAuth2.0
[OAuth2.0 详细介绍](https://opentp.cn/blog/architect/auth/oauth.html)

## SSO
[SSO 详细介绍](https://opentp.cn/blog/architect/auth/sso.html)