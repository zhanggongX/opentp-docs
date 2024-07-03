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
    // 初始化一个用于存储源类的 LinkedHashSet
    this.sources = new LinkedHashSet<>();
    // 设置默认的 Banner 显示模式为控制台输出
    this.bannerMode = Mode.CONSOLE;
    // 设置是否在应用启动时记录启动信息，默认值为 true
    this.logStartupInfo = true;
    // 设置是否从命令行参数中添加属性，默认值为 true
    this.addCommandLineProperties = true;
    // 设置是否添加默认的 ConversionService，默认值为 true
    this.addConversionService = true;
    // 设置应用是否以 headless 模式运行，默认值为 true（headless 模式指没有图形界面的模式）
    this.headless = true;
    // 设置是否注册 JVM 关闭钩子来关闭 Spring 应用上下文，默认值为 true
    this.registerShutdownHook = true;
    // 初始化一个空的集合来存储额外的 Spring Profile
    this.additionalProfiles = Collections.emptySet();
    // 初始化标识符，表示是否使用了自定义环境，默认值为 false
    this.isCustomEnvironment = false;
    // 设置是否启用延迟初始化，默认值为 false（即所有 bean 都在应用启动时立即初始化）
    this.lazyInitialization = false;
    // 设置应用上下文工厂为默认工厂
    this.applicationContextFactory = ApplicationContextFactory.DEFAULT;
    // 设置应用启动监视器，默认值为无监视（`ApplicationStartup.DEFAULT`）
    this.applicationStartup = ApplicationStartup.DEFAULT;
    // 设置资源加载器（用于加载资源文件）
    this.resourceLoader = resourceLoader;
    // 断言主类（`primarySources`）不能为 null
    Assert.notNull(primarySources, "PrimarySources must not be null");
    // 将主类（`primarySources`）转换为 LinkedHashSet 进行存储
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    // ***** 根据类路径环境推断应用的 Web 应用类型
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    // 从 `spring.factories` 中获取 `BootstrapRegistryInitializer` 实例列表
    this.bootstrapRegistryInitializers = new ArrayList<>(this.getSpringFactoriesInstances(BootstrapRegistryInitializer.class));
    // ***** 从 `spring.factories` 中获取并设置 `ApplicationContextInitializer` 实例列表
    this.setInitializers(this.getSpringFactoriesInstances(ApplicationContextInitializer.class));
    // ***** 从 `spring.factories` 中获取并设置 `ApplicationListener` 实例列表
    this.setListeners(this.getSpringFactoriesInstances(ApplicationListener.class));
    // **** 试图推断出主应用类（即包含 `main` 方法的类）
    this.mainApplicationClass = this.deduceMainApplicationClass();
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
public ConfigurableApplicationContext run(String... args) {
    // 创建并记录应用启动的时间，生成一个启动监视对象
    Startup startup = Startup.create();
    // 如果配置了注册关闭钩子，启用 JVM 关闭钩子的注册
    if (this.registerShutdownHook) {
        SpringApplication.shutdownHook.enableShutdownHookAddition();
    }
    // 创建引导上下文，通常用于应用启动前的一些初始化操作
    DefaultBootstrapContext bootstrapContext = createBootstrapContext();
    // 声明一个可配置的应用上下文对象
    ConfigurableApplicationContext context = null;
    // 配置 headless 属性，确保在无头模式下运行
    configureHeadlessProperty();
    // 获取运行监听器列表，这些监听器会在应用启动的不同阶段触发相应的事件
    SpringApplicationRunListeners listeners = getRunListeners(args);
    // 通知监听器应用正在启动，引导上下文和主应用类作为参数传入
    listeners.starting(bootstrapContext, this.mainApplicationClass);
    
    try {
        // 封装应用启动参数
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        // ***** 准备环境，包括加载配置文件和设置系统属性
        ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
        // ***** 打印启动 Banner（可以在控制台或日志中显示应用的名称和版本等信息）
        Banner printedBanner = printBanner(environment);
        // ***** 创建应用上下文，决定使用哪种类型的应用上下文（如 Web 应用或非 Web 应用）
        context = createApplicationContext();
        // 设置应用启动监视对象
        context.setApplicationStartup(this.applicationStartup);
        // ***** 准备上下文，包括加载所有的 bean 定义和资源
        prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
        // ***** 刷新上下文，正式启动 Spring 容器，触发 bean 的初始化和依赖注入，真正去创建 Bean 实例。
        refreshContext(context);
        // 在上下文刷新后执行自定义的后处理逻辑
        afterRefresh(context, applicationArguments);
        // 记录应用启动的时间点
        startup.started();
        // 如果配置了记录启动信息，则记录应用启动的相关信息
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), startup);
        }
        // 通知监听器应用已经启动，并传递启动监视对象
        listeners.started(context, startup.timeTakenToStarted());
        // 执行应用程序的 `runners`，如 `CommandLineRunner` 和 `ApplicationRunner`
        callRunners(context, applicationArguments);
    }
    catch (Throwable ex) {
        // 捕获启动过程中的任何异常
        // 如果异常是放弃运行的异常类型，直接抛出
        if (ex instanceof AbandonedRunException) {
            throw ex;
        }
        // 处理运行失败，包括释放资源和记录错误信息
        handleRunFailure(context, ex, listeners);
        // 抛出一个状态非法异常，包装原始异常
        throw new IllegalStateException(ex);
    }
    
    try {
        // 如果上下文已经处于运行状态，通知监听器应用准备就绪
        if (context.isRunning()) {
            listeners.ready(context, startup.ready());
        }
    }
    catch (Throwable ex) {
        // 捕获通知监听器时的任何异常
        // 如果异常是放弃运行的异常类型，直接抛出
        if (ex instanceof AbandonedRunException) {
            throw ex;
        }
        // 处理运行失败，包括释放资源和记录错误信息
        handleRunFailure(context, ex, null);
        // 抛出一个状态非法异常，包装原始异常
        throw new IllegalStateException(ex);
    }
    
    // ***** 返回应用上下文对象
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
