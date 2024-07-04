---
title: Springboot启动流程
category:
  - 常用框架
order: 31
tag:
  - frame
  - Springboot
---

## Springboot 启动入口
```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
通过 run 方法点进去，发现整个流程，就两大步：  
一，new SpringApplication()  
二， 执行方法 org.springframework.boot.SpringApplication#run(java.lang.String...)。  
继续。。

## new SpringApplication()
new SpringApplication 源码：
```java
// Springboot 3.2.0
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    // 保存资源加载器实例，用于加载应用程序资源
    this.resourceLoader = resourceLoader;
    // 确保 primarySources 参数不为空
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    // 推断当前应用程序类型（如：SERVLET、REACTIVE、NONE）
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    // 从 Spring 工厂加载所有的 BootstrapRegistryInitializer 实例，并初始化 bootstrapRegistryInitializers 列表
    this.bootstrapRegistryInitializers = new ArrayList<>(
            getSpringFactoriesInstances(BootstrapRegistryInitializer.class));
    // 加载所有的 META-INF/spring.factories 中的 ApplicationContextInitializer 实例，并设置应用上下文初始化器
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
    // 加载所有的 META-INF/spring.factories  中的 ApplicationListener 实例，并设置应用程序事件监听器
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    // 推断并设置主应用程序类（通常是包含 main 方法的类）
    this.mainApplicationClass = deduceMainApplicationClass();
}


```
主要的步骤有：
- 确定 Spring 应用的类型
- 加载 ApplicationContextInitializer
- 加载 ApplicationListener
- 记录启动类

## org.springframework.boot.SpringApplication#run(java.lang.String...)
源代码：
```java
// Springboot 3.2.0
public ConfigurableApplicationContext run(String... args) {
    // 创建应用启动的记录实例
    Startup startup = Startup.create();
    // 如果启用了关闭钩子注册，则在 JVM 关闭时添加一个钩子来关闭 Spring 应用
    if (this.registerShutdownHook) {
        SpringApplication.shutdownHook.enableShutdownHookAddition();
    }
    // 创建引导上下文，用于在应用程序启动之前存储必要的信息
    DefaultBootstrapContext bootstrapContext = createBootstrapContext();
    // 定义应用上下文变量，稍后会被初始化
    ConfigurableApplicationContext context = null;
    // 配置系统属性来控制 GUI 相关行为，以支持无头环境（如服务器环境）
    configureHeadlessProperty();
    // 获取应用程序运行时的监听器集合
    SpringApplicationRunListeners listeners = getRunListeners(args);
    // 通知所有监听器应用程序正在启动
    listeners.starting(bootstrapContext, this.mainApplicationClass);
    try {
        // 创建应用程序参数实例，用于封装传递给应用程序的命令行参数
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        // 准备应用程序环境（如系统属性、环境变量等），并通知监听器
        ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
        // 打印 Banner
        Banner printedBanner = printBanner(environment);
        // 创建应用上下文实例
        context = createApplicationContext();
        // 设置应用程序的启动记录实例到上下文中
        context.setApplicationStartup(this.applicationStartup);
        // 准备应用程序上下文，包括加载各种资源、设置配置等
        prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
        // 刷新上下文，在这里创建所有的 Bean
        refreshContext(context);
        // 在上下文刷新后执行自定义逻辑
        afterRefresh(context, applicationArguments);
        // 标记应用程序启动完成
        startup.started();
        // 如果启用了启动信息日志记录，则记录启动信息
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), startup);
        }
        // 通知所有监听器应用程序已经启动
        listeners.started(context, startup.timeTakenToStarted());
        // 调用所有的 CommandLineRunner 和 ApplicationRunner 接口实现
        callRunners(context, applicationArguments);
    } catch (Throwable ex) {
        // 如果异常是因为放弃运行，则直接抛出
        if (ex instanceof AbandonedRunException) {
            throw ex;
        }
        // 处理运行时的异常，并通知监听器
        handleRunFailure(context, ex, listeners);
        // 抛出新的 IllegalStateException 异常
        throw new IllegalStateException(ex);
    }

    try {
        // 如果上下文已经在运行，则通知所有监听器应用程序已准备好
        if (context.isRunning()) {
            listeners.ready(context, startup.ready());
        }
    } catch (Throwable ex) {
        // 如果异常是因为放弃运行，则直接抛出
        if (ex instanceof AbandonedRunException) {
            throw ex;
        }
        // 处理运行时的异常，并通知监听器（没有提供监听器）
        handleRunFailure(context, ex, null);
        // 抛出新的 IllegalStateException 异常
        throw new IllegalStateException(ex);
    }

    // 返回应用上下文
    return context;
}
```
主要流程：
- 准备环境对象 Environment，用于加载系统属性等。
- 打印 Banner
- 实例化容器 Context
- 准备容器，为容器设置 Env、BeanFactoryPostProcesser，并加载主类对应的 BeanDefinition。
- 刷新容器（创建 Bean 实例）
- 返回容器

## 总结
#### 其实整个 Springboot 的启动过程，就两大步：
1. 创建 SpringApplication 对象。 
2. 执行 run 方法。

#### 在创建 SpringApplication 实例的时候，主要做几件事。
1. 确认应用类型，一般都是 servlet 类型，这种类型，会启动一个嵌入的 tomcat。
2. 从 spring.factories 或者 .imports 配置文件中，加载默认的 ApplicationContextInitializer 和 ApplicationListener 。
3. 记录当前启动的主类，将来包扫描会用。

##### 在 SpringApplication 对象创建好后，会执行它的 run 方法，主要做几件事。
1. 准备 Environment 对象，它里边会封装一下当前应用运行的环境的参数。
2. 实例化容器，创建 ApplicationContext 对象。
3. 容器创建好后，做一些准备工作，设置 env、beanFactoryPostProcessor 等，并加载主类对应的 Definition。
4. 刷新容器，这一步才会创建 Bean 实例。



#### 下一篇博客，会再详细记录下 SpringApplication.run 方法中的刷新容器部分，即 IOC 容器的创建过程。
