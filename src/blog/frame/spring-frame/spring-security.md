---
title: Spring Security
category:
  - 常用框架
order: 10
tag:
  - frame
  - Spring
---

Spring Security 是一个功能强大且高度可定制的认证和访问控制框架，适用于基于Spring的企业应用。  
它提供了全面的安全服务，包括身份认证、授权、安全审计等，帮助开发人员快速构建安全的Web应用和服务。

## 主要功能

1. 身份认证（Authentication）：
- 支持多种认证方式，包括用户名/密码、基于表单的认证、HTTP Basic认证、OAuth2、LDAP等。
- 提供了可扩展的认证机制，允许开发者自定义认证逻辑。

2. 授权（Authorization）：
- 通过角色和权限控制访问权限，支持基于URL的访问控制（即路径匹配）。
- 支持方法级别的安全控制（即通过注解限制特定方法的访问）。

3. 防护功能：
- 防止跨站请求伪造（CSRF）攻击。
- 防止会话固定攻击。
- 提供内容安全策略（Content Security Policy）和HTTP头安全设置。

4. 安全审计（Security Auditing）：
- 记录用户的登录、登出、失败的登录尝试等安全事件。
- 集成了Spring的事件机制，可以轻松地扩展和定制安全事件的处理。

## 核心组件
1. SecurityContext：
- 存储当前用户的安全信息，包括认证状态和权限信息。
- SecurityContextHolder 用于在整个应用程序中获取当前的安全上下文。

2. Authentication：
- 表示当前用户的认证信息，如用户名、密码、权限等。
- AuthenticationManager 负责处理认证请求。

3. GrantedAuthority：
- 表示用户的权限，通常对应于角色（Role）。

4. UserDetails：
- 封装了用户的详细信息，如用户名、密码、是否启用等。
- UserDetailsService 负责从数据源加载用户信息。

## 常见配置

Spring Security 的配置可以通过Java配置类或XML配置文件完成。  
以下是一个基本的Java配置示例：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // 所有用户都可以访问根路径和 `/home` 路径。
                .antMatchers("/", "/home").permitAll()
                // 其他路径需要认证。
                .anyRequest().authenticated()
                .and()
            .formLogin()
                // 配置了一个自定义的登录页面 `/login`。
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
            // 使用内存中的用户存储，定义了两个用户：`user` 和 `admin`。
            .withUser("user").password("user123").roles("USER")
            .and()
            .withUser("admin").password("admin123").roles("ADMIN");
    }
}
```

## Spring Security 使用

### 有哪些控制请求访问权限的方法
- permitAll()：无条件允许任何形式访问，不管你登录还是没有登录。
- anonymous()：允许匿名访问，也就是没有登录才可以访问。
- denyAll()：无条件决绝任何形式的访问。
- authenticated()：只允许已认证的用户访问。
- fullyAuthenticated()：只允许已经登录或者通过 remember-me 登录的用户访问。
- hasRole(String) : 只允许指定的角色访问。
- hasAnyRole(String) : 指定一个或者多个角色，满足其一的用户即可访问。
- hasAuthority(String)：只允许具有指定权限的用户访问
- hasAnyAuthority(String)：指定一个或者多个权限，满足其一的用户即可访问。
- hasIpAddress(String) : 只允许指定 ip 的用户访问。

### hasRole 和 hasAuthority 有区别吗？
可以看看松哥的这篇文章：[Spring Security 中的 hasRole 和 hasAuthority 有区别吗？](https://mp.weixin.qq.com/s/GTNOa2k9_n_H0w24upClRw)，介绍的比较详细。

### 如何对密码进行加密
如果我们需要保存密码这类敏感数据到数据库的话，需要先加密再保存。  
Spring Security 提供了多种加密算法的实现，开箱即用，非常方便。这些加密算法实现类的父类是 PasswordEncoder ，如果你想要自己实现一个加密算法的话，也需要继承 PasswordEncoder。
PasswordEncoder 接口一共也就 3 个必须实现的方法。
```java
public interface PasswordEncoder {
    // 加密也就是对原始密码进行编码
    String encode(CharSequence var1);
    // 比对原始密码和数据库中保存的密码
    boolean matches(CharSequence var1, String var2);
    // 判断加密密码是否需要再次进行加密，默认返回 false
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```
> 官方推荐使用基于 bcrypt 强哈希函数的加密算法实现类。

### 如何优雅更换系统使用的加密算法？
如果我们在开发过程中，突然发现现有的加密算法无法满足我们的需求，需要更换成另外一个加密算法，这个时候应该怎么办呢？  
推荐的做法是通过 DelegatingPasswordEncoder 兼容多种不同的密码加密方案，以适应不同的业务需求。  
从名字也能看出来，DelegatingPasswordEncoder 其实就是一个代理类，并非是一种全新的加密算法，它做的事情就是代理上面提到的加密算法实现类。在 Spring Security 5.0 之后，默认就是基于 DelegatingPasswordEncoder 进行密码加密的。  





