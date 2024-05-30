---
title: SSO
category:
  - 认证授权
order: 4
tag:
  - 认证授权
  - SSO
---

## 什么是单点登录（SSO）

单点登录（Single Sign-On，SSO）是一种身份验证和授权机制，允许用户使用一个一组凭据（例如用户名和密码）一次性登录到一个系统，并在此之后能够访问多个相关但独立的软件系统或应用程序，而无需再次登录。  
SSO通过集中式的认证服务来管理用户的登录状态，提升用户体验和系统安全性。  
例如企业办公内部的 OA系统，考勤系统，绩效系统等，只需要登录一次，其他系统就不需要再进行登录。

## SSO 的工作原理
SSO的核心思想是由一个中央身份验证服务（如CAS）负责处理用户的身份验证，并生成一个令牌或票据（token/ticket）作为用户的登录凭证。  
其他应用程序（服务提供者，SP）通过验证该令牌或票据来确定用户的身份。

典型的SSO工作流程如下：
1. 用户请求访问应用程序A：  
用户访问应用程序A的受保护资源。应用程序A检查用户是否已登录。如果没有，则将用户重定向到SSO认证服务器。

2. SSO认证服务器处理登录请求：  
SSO认证服务器检查用户是否已在其他应用程序中登录。如果没有，要求用户输入凭据（如用户名和密码）进行身份验证。用户输入凭据并提交，SSO认证服务器验证凭据的有效性。

3. 生成并返回票据：  
SSO认证服务器验证用户身份后，生成一个票据（token/ticket），并将用户重定向回应用程序A，同时附带该票据。

4. 应用程序A验证票据：  
应用程序A接收到票据后，向SSO认证服务器验证该票据的有效性。SSO认证服务器验证票据有效后，应用程序A创建用户会话，用户成功登录。

5. 用户请求访问应用程序B：  
用户访问应用程序B的受保护资源。应用程序B检查用户是否已登录。如果没有，将用户重定向到SSO认证服务器。由于用户已在应用程序A登录过，SSO认证服务器直接返回一个新的票据给应用程序B。应用程序B验证票据并创建用户会话，用户无需再次登录即可访问应用程序B。

## SSO 的优缺点
优点：
1. 提升用户体验：用户只需一次登录即可访问多个应用程序，避免了频繁输入凭据的麻烦。
2. 集中管理：集中式的身份验证和授权机制简化了用户管理和权限管理。
3. 提高安全性：减少了用户凭据在多个系统中存储和传输的风险，集中管理认证逻辑，便于实施统一的安全策略。  

缺点：
1. 单点故障：如果SSO认证服务器出现问题，所有依赖于它的应用程序都将受到影响。
2. 实现复杂：需要在多个应用程序中集成SSO机制，可能增加开发和维护的复杂性。
3. 安全风险：如果SSO令牌被窃取，攻击者可能会获得对多个系统的访问权限。

## SSO 的实现方式
1. 基于Cookie的SSO：利用跨域共享Cookie的机制来实现用户的单点登录。
2. 基于Token的SSO：利用JWT（JSON Web Token）或其他令牌技术来实现单点登录，常见于现代Web应用。
3. 基于SAML的SSO：使用SAML（Security Assertion Markup Language）协议在身份提供者和服务提供者之间传递认证信息。
4. 基于OAuth 2.0的SSO：利用OAuth 2.0协议来实现授权和身份验证，通常结合OpenID Connect。

## 使用CAS实现SSO
### 1. 部署CAS服务器
从CAS官方网站下载CAS服务器的安装包，根据官方文档进行配置和部署。配置文件通常包括对认证方式（如LDAP、数据库等）的设置，票据有效期，重定向URL等。  

### 2. 配置CAS服务器
在CAS服务器的配置文件中，配置身份验证方式（如LDAP、数据库、Active Directory等），以及票据生成和验证规则。

### 3. 配置应用程序A和应用程序B
在每个需要集成SSO的应用程序中，配置CAS客户端。以Spring Boot应用为例：
#### Spring Boot依赖
在`pom.xml`中添加CAS客户端依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-cas</artifactId>
</dependency>
```

#### Spring Security配置
配置CAS客户端：
```java
@SpringBootApplication
@EnableWebSecurity
public class MyApplication extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/").permitAll()
                .anyRequest().authenticated()
            .and()
            .logout()
                .logoutSuccessUrl("https://cas.example.com/logout")
                .permitAll()
            .and()
            .cas()
                .loginProcessingUrl("/login/cas")
                .ticketValidator(new Cas20ServiceTicketValidator("https://cas.example.com"))
                .service("http://localhost:8080/login/cas");
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### 4. 测试SSO功能
部署和配置完毕后，可以通过以下步骤测试SSO功能：

1. 访问应用程序A的受保护资源。
2. 应用程序A将用户重定向到CAS服务器进行身份验证。
3. 用户在CAS服务器上进行身份验证并成功登录，CAS服务器生成票据并重定向回应用程序A。
4. 应用程序A验证票据并创建用户会话。
5. 用户访问应用程序B的受保护资源。
6. 应用程序B将用户重定向到CAS服务器，CAS服务器检测到用户已登录，直接生成新票据并重定向回应用程序B。
7. 应用程序B验证票据并创建用户会话，用户无需再次登录即可访问应用程序B。