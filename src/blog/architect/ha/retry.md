---
title: 超时重试
category:
  - 高可用
order: 4
tag:
  - 服务高可用
  - retry
---

## 超时重试
超时重试机制是一种重要的容错手段，用于提高系统的可靠性和稳定性。当某个服务调用失败或超时时，通过重试机制可以尝试重新发起请求，以期在下一次尝试中获得成功。这种机制对应对网络抖动、瞬时故障等问题非常有效，但也需要合理设计以避免引入幂等之类的新的问题。   

## 超时
指调用一个远程服务时，在设定的时间内未收到响应，便认为请求超时。  
超时分为2种：
1. 读取超时
2. 链接超时

> 通常情况下，我们建议读取超时设置为 **1500ms** ,这是一个比较普适的值。  

> 如果系统或者服务对于延迟比较敏感的话，那读取超时值可以适当在 **1500ms** 的基础上进行缩短。
> 反之，读取超时值也可以在 **1500ms** 的基础上进行加长。  

> 连接超时可以适当设置长一些，建议在 **1000ms ~ 5000ms** 之内。

## 重试
当请求失败或超时时，重新发起请求的操作，需要设定重试的次数和间隔时间，以避免无限制重试导致资源浪费和雪崩效应。

## 超时重试的设计原则

### 幂等性：
确保重试的操作是幂等的，即多次执行同一个操作不会产生副作用。  
例如，查询操作通常是幂等的，但数据修改操作需要特别设计幂等性。

### 指数退避：
在每次重试之前，逐渐增加等待时间，常用的策略是指数退避（Exponential Backoff）。  
例如，第1次重试等待1秒，第2次重试等待2秒，第3次重试等待4秒，依此类推。  

### 最大重试次数：
设定最大重试次数，避免无限制重试导致系统资源耗尽。  
一般情况下，根据业务需要和故障恢复时间设定一个合理的重试次数。  

### 熔断机制：
与重试机制结合，当检测到连续多次重试失败时，触发熔断，暂时停止请求，以防止系统过载。  
熔断后可设置一段恢复时间，再次尝试调用服务。  

### 重试简单实现
```java
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.IOException;
import java.io.InputStream;

public class RetryExample {

    private static final int MAX_RETRY_ATTEMPTS = 5;
    private static final int INITIAL_RETRY_DELAY_MS = 1000; // 初始重试等待时间（毫秒）

    public static void main(String[] args) {
        String url = "http://example.com/api";
        try {
            String response = retryableHttpRequest(url);
            System.out.println("Response: " + response);
        } catch (Exception e) {
            System.err.println("Failed to get response: " + e.getMessage());
        }
    }

    public static String retryableHttpRequest(String urlString) throws Exception {
        int attempts = 0;
        long retryDelay = INITIAL_RETRY_DELAY_MS;

        while (attempts < MAX_RETRY_ATTEMPTS) {
            try {
                return httpRequest(urlString);
            } catch (IOException e) {
                attempts++;
                if (attempts >= MAX_RETRY_ATTEMPTS) {
                    throw new Exception("Max retry attempts reached", e);
                }
                System.out.println("Retry attempt " + attempts + " after " + retryDelay + " ms");
                Thread.sleep(retryDelay);
                retryDelay *= 2; // 指数退避
            }
        }
        throw new Exception("Request failed after " + MAX_RETRY_ATTEMPTS + " attempts");
    }

    private static String httpRequest(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setConnectTimeout(2000); // 连接超时时间
        connection.setReadTimeout(2000); // 读取超时时间

        InputStream responseStream = connection.getInputStream();
        return new String(responseStream.readAllBytes());
    }
}
```
### Spring retry 重试
1. 加入包引用

```java
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
</dependency>
```

开启重试功能
```java
@SpringBootApplication 
@EnableRetry 
@Slf4j 
public class TestApplication { 
    public static void main(String[] args) { 
        ConfigurableApplicationContext applicationContext = SpringApplication.run(TestApplication.class, args); 
        String res = applicationContext.getBean(RetryController.class).doSth(""); 
        System.out.println(res);
    } 
}
```

配置重试注解
```java
@Service 
@Slf4j 
public class RetryRequestService { 
    @Autowired 
    private OtherSystemSpi otherSystemSpi; 
    
    /**
     *   value = Exception.class：是指方法抛出RuntimeException异常时，进行重试。这里可以指定你想要拦截的异常。  
     *   maxAttempts：是最大重试次数。如果不写，则是默认3次。  
     *   backoff = @Backoff(delay = 100)：是指重试间隔。delay=100意味着下一次的重试，要等100毫秒之后才能执行。
     */
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 100)) 
    public String request(String param) { 
        double random = Math.random(); 
        if (random > 0.1) {
            throw new RuntimeException("超时"); 
        } 
        return "hello retry";
    } 
}
```
