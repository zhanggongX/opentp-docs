---
title: OAuth2.0
category:
  - 认证授权
order: 3
tag:
  - 认证授权
  - OAuth2.0
---

## OAuth2.0 介绍
OAuth 2.0 是一种授权框架，允许第三方应用在资源所有者授权的情况下，获取对资源服务器上受保护资源的有限访问权限，而无需共享资源所有者的凭据。OAuth 2.0 广泛应用于现代 Web 应用和 API 中，用于提供安全的授权机制。

## OAuth 2.0 的主要角色
1. 资源所有者（Resource Owner）：通常是最终用户，拥有资源服务器上的受保护资源。
2. 客户端（Client）：请求访问资源的应用程序，可以是 Web 应用、移动应用等。
3. 资源服务器（Resource Server）：托管受保护资源的服务器，使用访问令牌来验证和授权请求。
4. 授权服务器（Authorization Server）：负责验证资源所有者身份、处理授权请求并颁发访问令牌。

## OAuth 2.0 的授权流程
OAuth 2.0 定义了多种授权方式（授权类型），包括授权码模式、简化模式、密码凭证模式和客户端凭证模式。

### 授权码模式（Authorization Code Grant）

授权码模式是最常用的授权方式，适用于服务器端应用程序。其流程如下：
1. 用户授权：用户在浏览器中访问客户端应用，客户端应用将用户重定向到授权服务器进行身份验证和授权。
2. 授权码颁发：用户同意授权后，授权服务器将授权码发送回客户端（通常通过重定向）。
3. 获取访问令牌：客户端使用授权码向授权服务器请求访问令牌。
4. 访问资源：客户端使用访问令牌向资源服务器请求受保护资源。

```plaintext
+--------+                               +----------------+
|        |--(A)- Authorization Request ->|                |
|        |                               |                |
|        |<-(B)-- Authorization Code ----|                |
|        |                               |                |
| Client |                               | Authorization  |
|        |--(C)-- Authorization Code --->|    Server      |
|        |          + Client Secret      |                |
|        |                               |                |
|        |<-(D)---- Access Token --------|                |
+--------+                               +----------------+
```

### 简化模式（Implicit Grant）
简化模式主要用于单页面应用（SPA）等不安全的客户端环境。其流程如下：
1. 用户授权：用户在浏览器中访问客户端应用，客户端应用将用户重定向到授权服务器进行身份验证和授权。
2. 访问令牌颁发：用户同意授权后，授权服务器直接将访问令牌发送回客户端（通过重定向）。

```plaintext
+--------+                               +----------------+
|        |--(A)- Authorization Request ->|                |
|        |                               |                |
|        |<-(B)------ Access Token ------|                |
|        |                               |                |
| Client |                               | Authorization  |
|        |                               |    Server      |
+--------+                               +----------------+
```

### 密码凭证模式（Resource Owner Password Credentials Grant）

密码凭证模式适用于用户信任客户端应用的情况。用户直接将其用户名和密码提供给客户端，客户端使用这些凭证向授权服务器请求访问令牌。

```plaintext
+--------+                               +----------------+
|        |--(A)- Username & Password --->|                |
|        |                               |                |
|        |<-(B)------ Access Token ------|                |
| Client |                               | Authorization  |
|        |                               |    Server      |
+--------+                               +----------------+
```

### 客户端凭证模式（Client Credentials Grant）

客户端凭证模式适用于应用之间的授权场景。客户端使用自身的凭证（如客户端ID和客户端密钥）向授权服务器请求访问令牌。

```plaintext
+--------+                               +----------------+
|        |--(A)- Client ID & Secret ---->|                |
|        |                               |                |
|        |<-(B)------ Access Token ------|                |
| Client |                               | Authorization  |
|        |                               |    Server      |
+--------+                               +----------------+
```

### OAuth 2.0 的令牌类型
1. 访问令牌（Access Token）：用于访问受保护资源的令牌，通常有一定的有效期。
2. 刷新令牌（Refresh Token）：用于获取新的访问令牌，当访问令牌过期时，客户端可以使用刷新令牌来请求新的访问令牌。刷新令牌的有效期通常比访问令牌长。

## 使用Java实现OAuth 2.0
### 1. 添加依赖
首先，在`pom.xml`中添加必要的依赖：
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.security.oauth.boot</groupId>
        <artifactId>spring-security-oauth2-autoconfigure</artifactId>
        <version>2.1.6.RELEASE</version>
    </dependency>
</dependencies>
```

### 2. 配置授权服务器
创建一个授权服务器配置类：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;

@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
    
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient("client-id")
                .secret("{noop}client-secret")
                .authorizedGrantTypes("authorization_code")
                .scopes("read", "write")
                .redirectUris("http://localhost:8080/callback");
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security.tokenKeyAccess("permitAll()")
                .checkTokenAccess("isAuthenticated()");
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        // 配置令牌存储、用户批准和授权码服务
    }
}
```

### 3. 配置资源服务器

创建一个资源服务器配置类：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/public/").permitAll()
                .antMatchers("/private/").authenticated();
    }
}
```

### 4. 配置Web安全
配置Spring Security以保护端点并使用OAuth 2.0授权。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .formLogin().permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 总结
OAuth 2.0 提供了一种灵活且安全的授权框架，允许第三方应用在资源所有者授权的情况下访问受保护资源。  
通过不同的授权模式，可以满足各种不同的应用场景和安全需求。  
在Java中，可以使用Spring Security OAuth 2.0轻松实现OAuth 2.0授权框架。