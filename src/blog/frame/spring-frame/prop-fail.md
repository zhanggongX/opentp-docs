---
title: 自定义 Springboot-starter 属性加载失败
category:
  - 常用框架
order: 1
tag:
  - frame
  - Spring
---

### 问题描述
我的开源项目 [opentp](https://github.com/zhanggongX/open-tp) 需要提供一个 spring-boot-starter 方便第三方使用 spring 框架集成 opentp-client。
但是写完发现属性加载不进来。  
代码如下：
```java
// opentp-client-spring-boot-starter 代码：
/**
 * 属性类
 */
@Component
@ConfigurationProperties(prefix = OpentpProperties.PREFIX)
public class OpentpProperties {

    public static final String PREFIX = "opentp";

    private String servers;
    private String name;

    public String getServers() {
        System.out.println("set servers");
        return servers;
    }

    public void setServers(String servers) {
        this.servers = servers;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

/**
 * 自动配置类
 */
@AutoConfiguration
@ConditionalOnBean(annotation = EnableOpentp.class)
@EnableConfigurationProperties(OpentpProperties.class)
public class OpentpAutoConfiguration implements InitializingBean {

    @Resource
    private OpentpProperties opentpProperties;

    @Override
    public void afterPropertiesSet() throws Exception {
        // 配置地址信息
        // 发现这里打断点，发现 OpentpProperties 对象的属性都是空的。
        List<InetSocketAddress> configInetSocketAddress = ServerAddressParser.parse(opentpProperties.getServers());
        cn.opentp.client.configuration.Configuration.configuration().serverAddresses().addAll(configInetSocketAddress);
    }

    @ConditionalOnMissingBean(OpentpClientBootstrap.class)
    @Bean
    public OpentpClientBootstrap opentpClientBootstrap() {
        return new OpentpClientBootstrap();
    }
}

// spring-boot-example 的配置文件，依赖项目 opentp-client-spring-boot-starter
opentp:
  servers: localhost:9527
  name: opentp-client1

```

经过各种debug，发现是我写的 BeanPostProcesser 导致的。

```java
// BeanPostProcessor 代码
// 该类主要是通过 postProcessAfterInitialization 扫描对象是否加了 @opentp 注解，  
// 如果是 ThreadPoolExecuter 且加了 @opentp，则创建 ThreadPoolContext 并缓存起来。
public class OpentpSpringBeanPostProcessor implements BeanPostProcessor, BeanFactoryAware, PriorityOrdered {

    private final static Logger log = LoggerFactory.getLogger(OpentpSpringBeanPostProcessor.class);

    private DefaultListableBeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = (DefaultListableBeanFactory) beanFactory;
    }

    @Override
    public int getOrder() {
        // 一开始是 return Ordered.HIGHEST_PRECEDENCE; 
        // 给了最高优先级，正是这里导致的属性配置失败。
//        return Ordered.HIGHEST_PRECEDENCE;
        return Ordered.LOWEST_PRECEDENCE;
    }

    /**
     * 在 spring bean 初始化回调
     * 如 InitializingBean 的 afterPropertiesSet 方法或者自定义的 init-method 之前被调用
     * 也就是说，这个方法会在bean的属性已经设置完毕，但还未进行初始化时被调用。
     *
     * @param bean     bean 对象
     * @param beanName bean name
     * @return bean
     * @throws BeansException 异常信息
     */
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return null;
    }

    /**
     * 在 spring bean 初始化后回调
     * 比如 InitializingBean 的 afterPropertiesSet 或者自定义的初始化方法之后被调用
     * 这个时候，bean的属性值已经被填充完毕。返回的bean实例可能是原始bean的一个包装。
     *
     * @param bean     bean 对象
     * @param beanName bean name
     * @return bean
     * @throws BeansException 异常信息
     */
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (!(bean instanceof ThreadPoolExecutor)) {
            return bean;
        }

        Opentp opentp = beanFactory.findAnnotationOnBean(beanName, Opentp.class);
        if (opentp == null) {
            return bean;
        }

        log.debug("OpentpThreadPoolScan find @Opentp bean name: {}, annotation value: {}", beanName, opentp.value());

        ThreadPoolContext threadPoolContext = new ThreadPoolContext((ThreadPoolExecutor) bean);
        Configuration configuration = Configuration.configuration();
        Map<String, ThreadPoolContext> threadPoolContextCache = configuration.threadPoolContextCache();

        if (threadPoolContextCache.containsKey(opentp.value())) {
            throw new OpentpDupException();
        }

        threadPoolContextCache.put(opentp.value(), threadPoolContext);
        return bean;
    }
}
```

### 解决方案
BeanPostProcessor 中实现了 PriorityOrdered 并提供了优先级排序，  
我一开始给的是 Ordered.HIGHEST_PRECEDENCE;   
这样就导致了属性加载不进来，改成 Ordered.LOWEST_PRECEDENCE; 后就没问题了。  
这就很奇怪了，需要仔细研究下原因。

### 问题分析