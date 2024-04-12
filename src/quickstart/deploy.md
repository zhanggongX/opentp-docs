---
title: 项目部署
category:
  - quickstart
order: 1
tag:
  - opentp文档
---

## 项目部署
### 服务端
```
java -jar opentp-server.jar 
```

### 客户端
```java
// 增加依赖
<dependency>
    <groupId>cn.opentp</groupId>
    <artifactId>opentp-client-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>

// 添加 @EnableOpentp 注解。
@EnableOpentp
@SpringBootApplication
public class ClientSpringExampleApp {
    public static void main(String[] args) {

        SpringApplication.run(ClientSpringExampleApp.class, args);
    }
}

// 线程池增加 @Opentp 注解。
@Opentp("demoExecutor")
@Bean
public ThreadPoolExecutor threadPoolExecutor() {
    return new ThreadPoolExecutor(10, 200, 100, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1024));
}

// 就会自动收集线程池信息进行上报
```
