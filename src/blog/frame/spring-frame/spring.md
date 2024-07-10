---
title: Spring
category:
  - 常用框架
order: 1
tag:
  - frame
  - Spring
---

## SpringIOC
### @Autowired 和 @Resource 的区别
Autowired 属于 Spring 内置的注解，默认的注入方式为byType（根据类型进行匹配），也就是说会优先根据接口类型去匹配并注入 Bean （接口的实现类）。  
当一个接口存在多个实现类的话，byType这种方式就无法正确注入对象了，因为这个时候 Spring 会同时找到多个满足条件的选择，默认情况下它自己不知道选择哪一个。  
这种情况下，注入方式会变为 byName（根据名称进行匹配），这个名称通常就是类名（首字母小写）。
```java
// demoService 就是我们上面所说的名称
@Autowired
private DemoService demoService;
```
DemoService 接口有两个实现类: DemoService1 DemoService2， 且它们都已经被 Spring 容器所管理。  
```java
// 报错，byName 和 byType 都无法匹配到 bean
@Autowired
private DemoService demoServer;

// 正确注入 DemoService1 对象对应的 bean
@Autowired
private DemoService demoServer1;

// 正确注入 DemoService2 对象对应的 bean
// demoServer2 就是我们上面所说的名称
@Autowired
@Qualifier(value = "demoServer2")
private DemoService demoServer2;
```

@Resource属于 JDK 提供的注解，默认注入方式为 byName。如果无法通过名称匹配到对应的 Bean 的话，注入方式会变为byType。  
@Resource 有两个比较重要且日常开发常用的属性：name（名称）、type（类型）。  
```java
public @interface Resource {
    String name() default "";
    Class<?> type() default Object.class;
}
```
如果仅指定 name 属性则注入方式为byName，如果仅指定type属性则注入方式为byType，如果同时指定name 和type属性（不建议这么做）则注入方式为byType+byName。 
```java
// 报错，byName 和 byType 都无法匹配到 bean
@Resource
private DemoService demoService;

// 正确注入 DemoService1 对象对应的 bean
@Resource
private DemoService demoService1;

// 正确注入 demoService2 对象对应的 bean（比较推荐这种方式）
@Resource(name = "demoService2")
private DemoService demoService;
```

#### 总结
- @Autowired 是 Spring 提供的注解，@Resource 是 JDK 提供的注解。
- Autowired 默认的注入方式为byType（根据类型进行匹配），@Resource默认注入方式为 byName（根据名称进行匹配）。 
- 当一个接口存在多个实现类的情况下，@Autowired 和 @Resource 都需要通过名称才能正确匹配到对应的 Bean。 Autowired 可以通过 @Qualifier 注解来显式指定名称，@Resource 可以通过 name 属性来显式指定名称。
- @Autowired 支持在构造函数、方法、字段和参数上使用。@Resource 主要用于字段和方法上的注入，不支持在构造函数或参数上使用。  

### Spring 中 Bean 的作用域
1. singleton: IoC 容器中只有唯一的 bean 实例。 默认都是单例的。
2. prototype: 每次获取都会创建一个新的 bean 实例。也就是说，连续 getBean() 两次，得到的是不同的 Bean 实例。
3. request（仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
4. session（仅 Web 应用可用）: 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
5. application/global-session（仅 Web 应用可用）： 每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
6. websocket （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public BeanTest beanTest()() {
    return new BeanTest();
}

```
## Spring bean 生命周期
1. Bean容器找到配置的Bean定义。  
2. Bean容器利用反射创建Bean。  
3. 如果涉及到属性值调用 set 进行赋值。
4. 如果实现了 BeanNameAware，BeanFactoryAware执行相应的 set 方法。
5. 如果有和加载这个 Bean 的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessBeforeInitialization() 方法。
6. 如果实现了 InitializingBean [ɪˈnɪʃəlaɪzɪŋ] 接口，调用 afterPropertiesSet() [`prɒpətiz] 方法。
7. 如果有 init-methond 方法，则执行。
8. 如果有和加载这个 Bean 的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessAfterInitialization() 方法。
9. 当要销毁 Bean 的时候，如果 Bean 实现了 DisposableBean 接口，执行 destroy() 方法。
10. 当要销毁 Bean 的时候，如果 Bean 在配置文件中的定义包含 destroy-method 属性，执行指定的方法。


## Spring AOP
### Spring AOP 介绍
AOP(Aspect-Oriented Programming) 面向切面编程，能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。  

Spring AOP 基于动态代理实现，如果要代理的对象，实现了某个接口，则基于 JDK Proxy 去创建代理对象，对于没有实现接口的对象， 则基于 Cglib 生成一个被代理对象的子类来作为代理。  

Spring AOP 也已经集成了 AspectJ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。  
AOP 切面编程涉及到的一些专业术语：
| 术语 | 含义 |
| --- | --- |
| 目标(Target)         | 被通知的对象 |
| 代理(Proxy)         | 向目标对象应用通知之后创建的代理对象 |
| 连接点(JoinPoint)      | 目标对象的所属类中，定义的所有方法均为连接点 |
| 切入点(Pointcut)   | 被切面拦截 / 增强的连接点（切入点一定是连接点，连接点不一定是切入点） |
| 通知(Advice)       | 增强的逻辑 / 代码，也即拦截到目标对象的连接点之后要做的事情 |
| 切面(Aspect)      | 切入点(Pointcut)+通知(Advice) |
| Weaving(织入)     | 将通知应用到目标对象，进而生成代理对象的过程动作 |

### Spring AOP 和 AspectJ AOP 区别
- Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。   
- Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。
- Spring AOP 已经集成了 AspectJ ，AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单，
- 如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

### AspectJ 定义的通知类型有哪些？
- Before（前置通知）：目标对象的方法调用之前触发
- After （后置通知）：目标对象的方法调用之后触发
- AfterReturning（返回通知）：目标对象的方法调用完成，在返回结果值之后触发
- AfterThrowing（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- Around （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### 多个切面的执行顺序如何控制？
1、通常使用 @Order 注解直接定义切面顺序，值越小优先级越高。  
2、实现Ordered 接口重写 getOrder 方法。

## Spring MVC
### 什么是 MVC
MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。  

### Spring MVC 的核心组件有哪些？
- DispatcherServlet： Servlet分发器，负责接收请求、分发，并给予客户端响应。
- HandlerMapping： 处理器映射器，根据 URL 去匹配查找能处理的 Handler ，并会将请求涉及到的拦截器和 Handler 一起封装。
- HandlerAdapter： 处理器适配器，根据 HandlerMapping 找到的 Handler ，适配执行对应的 Handler。
- Handler：请求处理器，处理实际请求的处理器。
- ViewResolver：视图解析器，根据 Handler 返回的逻辑视图 / 视图，解析并渲染真正的视图，并传递给 DispatcherServlet 响应客户端。

### SpringMVC 工作原理
1. 客户端（浏览器）发送请求， DispatcherServlet拦截请求。  
2. DispatcherServlet 根据请求信息调用 HandlerMapping。 HandlerMapping 根据 URL 去匹配查找能处理的 Handler（也就是 Controller 控制器），并会将请求涉及到的拦截器和 Handler 一起封装。  
3. DispatcherServlet 调用 HandlerAdapter 适配器执行 Handler。  
4. Handler 完成对用户请求的处理后，会返回一个 ModelAndView 对象给 DispatcherServlet，ModelAndView 顾名思义，包含了数据模型以及相应的视图的信息。Model 是返回的数据对象，View 是个逻辑上的 View。
5. ViewResolver 会根据逻辑 View 查找实际的 View。
6. DispaterServlet 把返回的 Model 传给 View（视图渲染）。
7. 把 View 返回给请求者（浏览器）

[Spring三级缓存](https://www.51cto.com/article/747437.html)

### 统一异常处理
使用到 @ControllerAdvice + @ExceptionHandler。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public BaseRes<?> handleAppException(BaseException ex, HttpServletRequest request) {
      //......
    }

    @ExceptionHandler(value = BusiExcetipn.class)
    public BaseRes<ErrorReponse> handleResourceNotFoundException(BusiExcetipn ex, HttpServletRequest request) {
      //......
    }
}
```
这种异常处理方式下，会给所有或者指定的 Controller 织入异常处理的逻辑（AOP），当 Controller 中的方法抛出异常的时候，由被 @ExceptionHandler 注解修饰的方法进行处理。  
ExceptionHandlerMethodResolver 中 getMappedMethod 方法决定了异常具体被哪个被 @ExceptionHandler 注解修饰的方法处理异常。  
```java
// getMappedMethod()会首先找到可以匹配处理异常的所有方法信息，然后对其进行从小到大的排序，最后取最小的那一个匹配的方法(即匹配度最高的那个)。
@Nullable
private Method getMappedMethod(Class<? extends Throwable> exceptionType) {
  List<Class<? extends Throwable>> matches = new ArrayList<>();
  //找到可以处理的所有异常信息。mappedMethods 中存放了异常和处理异常的方法的对应关系
  for (Class<? extends Throwable> mappedException : this.mappedMethods.keySet()) {
    if (mappedException.isAssignableFrom(exceptionType)) {
      matches.add(mappedException);
    }
  }
  // 不为空说明有方法处理异常
  if (!matches.isEmpty()) {
    // 按照匹配程度从小到大排序
    matches.sort(new ExceptionDepthComparator(exceptionType));
    // 返回处理异常的方法
    return this.mappedMethods.get(matches.get(0));
  }
  else {
    return null;
  }
}

```

## Spring 框架中的设计模式
设计模式参考：[设计模式概述](https://opentp.cn/blog/compute/design-pattern/design-pattern.html)

- 工厂设计模式 : Spring 使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
- 代理设计模式 : Spring AOP 功能的实现。
- 单例设计模式 : Spring 中的 Bean 默认都是单例的。
- 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- 包装器设计模式 : 如果项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- 观察者模式: Spring 事件驱动模型就是观察者模式很经典的一个应用。
- 适配器模式 : Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配 Controller。


## Spring 事务

### Spring 管理事务
- 编程式事务：在代码中硬编码(在分布式系统中推荐使用) : 通过 TransactionTemplate 或者 TransactionManager 手动管理事务，事务范围过大会出现事务未提交导致超时，因此事务要比锁的粒度更小。
- 声明式事务：在 XML 配置文件中配置或者直接基于注解（单体应用或者简单业务系统推荐使用） : 实际是通过 AOP 实现（基于@Transactional 的全注解方式使用最多）

### Spring 事务中哪几种事务传播行为?
**事务传播行为是为了解决业务层方法之间互相调用的事务问题。**  
当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。
```java
public enum Propagation {
    // 存在事务则加入，不存在事务则新建
    REQUIRED(0),
    // 存在事务则加入，不存在则非事务执行
    SUPPORTS(1),
    // 存在事务则抛异常
    MANDATORY(2),
    // 存在事务，则挂起事务，并创建新事务
    REQUIRES_NEW(3),
    // 存在事务，则挂起事务，并以非事务运行
    NOT_SUPPORTED(4),
    // 存在事务则抛异常，不存在事务则无事务运行
    NEVER(5),
    // 如果存在事务，则嵌套事务执行，不存在则新建事务。
    NESTED(6);

    private final int value;
    private Propagation(int value) {
        this.value = value;
    }
    public int value() {
        return this.value;
    }
}
```

### Spring 事务中的隔离级别
```java
public enum Isolation {
    // 数据库默认事务，MySQL 默认采用的 REPEATABLE_READ 隔离级别 Oracle 默认采用的 READ_COMMITTED 隔离级别
    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),
    // 读未提交
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),
    // 读已提交
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),
    // 可重复读
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),
    // 串行
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

    private final int value;

    Isolation(int value) {
        this.value = value;
    }
    public int value() {
        return this.value;
    }
}
```

### Spring 事务失效
常见的事务失效场景如下：
1. 方法定义有问题，Spring 事务要求方法必须是 public 且不能被 final/static 修饰
2. Spring AOP 内部调用，声明式事务是基于Spring AOP 实现的，其实就动动态代理，**如果方法A没有开启事务**，去调用开启事务的方法B，则此时是真实对象调用，非代理调用，则事务不生效。
3. 事务类未被 Spring 管理，即未注册成 Spring bean
4. 多线程调用，两个子事务不在同一个线程中，则某一个事务出现异常，另一个不会回滚。
5. 数据库引擎是否支持事务。
6. 事务未开启，Spring 需要xml中配置事务，Springboot 则自动开启了事务。
7. 异常未正确抛出，导致事务未回滚
8. 错误的事务传播特性，默认是如果当前有事务则加入当前事务，如果没有事务，则创建一个事务，如果事务传播特性设置了不使用事务，或者不存在事务，则以无事务运行，也会导致事务失效。
9. 未指定正确的回滚异常，默认只回滚 RuntimeException 和 Error, 需要手动指定回滚 Exception 或者 Throwable

### Spring 大事务
大事务可能会导致以下问题的：
1. 死锁
2. 锁等待
3. 回滚时间长
4. 接口超时
5. 并发大时数据库连接池占满
6. 数据库主从延迟
可以使用编程式事务，将事务解偶，使用 TransationTemplate.execute()

### Spring 事务使用的是 Spring 的事务，还是数据库的事务？
数据库的

### @Transactional 的使用注意事项总结
1. @Transactional 注解只有作用到 public 方法上事务才生效，不推荐在接口上使用；
2. 避免同一个类中调用 @Transactional 注解的方法，这样会导致事务失效；
3. 正确的设置 @Transactional 的 rollbackFor 和 propagation 属性，否则事务可能会回滚失败;
4. 被 @Transactional 注解的方法所在的类必须被 Spring 管理，否则不生效；
5. 底层使用的数据库必须支持事务机制，否则不生效；