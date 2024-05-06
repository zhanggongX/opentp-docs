---
title: Spring Security
category:
  - 常用框架
order: 3
tag:
  - frame
  - Spring
---

### 有哪些控制请求访问权限的方法？
![](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710754694703-79b75d75-99e6-4048-9747-5396889abdde.png#averageHue=%2341454f&clientId=ueb88ef89-7f58-4&from=paste&id=u30cedde8&originHeight=212&originWidth=650&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uc304c4dd-7bc8-4698-8fa4-35ce915d336&title=)

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
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710754757566-5df6c2b1-c484-4f7b-a452-3e4745400989.png#averageHue=%2344362a&clientId=ueb88ef89-7f58-4&from=paste&height=302&id=ue44d9800&originHeight=318&originWidth=650&originalType=binary&ratio=2&rotation=0&showTitle=false&size=144576&status=done&style=none&taskId=u0b1ca88e-9d08-4109-b5e2-13cffc09432&title=&width=617)
官方推荐使用基于 bcrypt 强哈希函数的加密算法实现类。
### 如何优雅更换系统使用的加密算法？
如果我们在开发过程中，突然发现现有的加密算法无法满足我们的需求，需要更换成另外一个加密算法，这个时候应该怎么办呢？
推荐的做法是通过 DelegatingPasswordEncoder 兼容多种不同的密码加密方案，以适应不同的业务需求。
从名字也能看出来，DelegatingPasswordEncoder 其实就是一个代理类，并非是一种全新的加密算法，它做的事情就是代理上面提到的加密算法实现类。在 Spring Security 5.0 之后，默认就是基于 DelegatingPasswordEncoder 进行密码加密的。





