---
title: 超时重试
category:
  - 高可用
order: 4
tag:
  - 服务高可用
  - retry
---

## 什么是超时机制
当一个请求超过一定的时间没有被处理的时候，这个请求就会直接被取消或者抛出指定异常。
超时分为2种：链接超时，读取超时
通常情况下，我们建议读取超时设置为 **1500ms** ,这是一个比较普适的值。如果你的系统或者服务对于延迟比较敏感的话，那读取超时值可以适当在 **1500ms** 的基础上进行缩短。反之，读取超时值也可以在 **1500ms** 的基础上进行加长，不过，尽量还是不要超过 **1500ms** 。连接超时可以适当设置长一些，建议在 **1000ms ~ 5000ms** 之内。

## 什么是重试
重试机制一般配合超时机制一起使用，指的是多次发送相同的请求来避免瞬态故障和偶然性故障。
### 重试策略
定时间隔重试，比如每隔1.5S重试一次
梯度间隔重试，比如第一次1S，第二次2S，第三次4S重试
重试次数一般设置为3次
### 重试幂等
防止重试导致服务端多次处理
### 重试实现
Spring retry
加入包引用
```
<!--springboot项目都不用引入版本号-->
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
<!--还是需要aop的支持的-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
</dependency>
```

开启重试功能
```
@SpringBootApplication 
@EnableRetry 
@Slf4j 
public class FastKindleApplication { 
    public static void main(String[] args) { 
        ConfigurableApplicationContext applicationContext = SpringApplication.run(FastKindleApplication.class, args); 
        String result = applicationContext.getBean(RetryController.class).doSth(""); 
 log.info(result); 
    } 
}
```

配置重试注解
```
@Service 
@Slf4j 
public class RetryRequestService { 
    @Autowired 
    private OtherSystemSpi otherSystemSpi; 
 
    @Retryable(value = RuntimeException.class, maxAttempts = 5, backoff = @Backoff(delay = 100)) 
    public String request(String param) { 
        double random = Math.random(); 
 log.info("请求进来了，随机值为：" + random); 
        if (random > 0.1) { 
            throw new RuntimeException("超时"); 
        } 
        return otherSystemSpi.request(param); 
    } 
}
```
value = RuntimeException.class：是指方法抛出RuntimeException异常时，进行重试。这里可以指定你想要拦截的异常。
maxAttempts：是最大重试次数。如果不写，则是默认3次。
backoff = @Backoff(delay = 100)：是指重试间隔。delay=100意味着下一次的重试，要等100毫秒之后才能执行。
