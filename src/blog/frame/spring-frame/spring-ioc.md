---
title: IOC初始化和Bean
category:
  - 常用框架
order: 4
tag:
  - frame
  - Springboot
---

## Springboot IOC 初始化

spring IOC 容器的初始化过程代码主要在   
`org.springframework.context.support.AbstractApplicationContext#refresh` 中。
```java
@Override
public void refresh() throws BeansException, IllegalStateException {
	synchronized (this.startupShutdownMonitor) {
		StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");

		// Prepare this context for refreshing.
		prepareRefresh();

		// Tell the subclass to refresh the internal bean factory.
		// 创建 BeanFactory 类型是 DefaultListableBeanFactory
		ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

		// Prepare the bean factory for use in this context.
		// 准备 BeanFactory 会给 BeanFactory 注册很多东西，包括 ClassLoader、Environment 等。
		prepareBeanFactory(beanFactory);

		try {
			// Allows post-processing of the bean factory in context subclasses.
			postProcessBeanFactory(beanFactory);

			StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
			// Invoke factory processors registered as beans in the context.
			// 执行 BeanFactoryPostProceesor ，扫描得到所有的 BeanDefinition 对象，只扫描不创建 Bean 对象。
			invokeBeanFactoryPostProcessors(beanFactory);

			// Register bean processors that intercept bean creation.
			// 注册拦截 Bean 创建的 Bean 处理器（如 BeanPostProcessor）
			registerBeanPostProcessors(beanFactory);
			beanPostProcess.end();

			// Initialize message source for this context.
			// 处理国际化
			initMessageSource();

			// Initialize event multicaster for this context.
			// 初始化事件多播器
			initApplicationEventMulticaster();

			// Initialize other special beans in specific context subclasses.
			// 初始化特殊 Bean，如果是 SpringWeb 应用，这里启动 tomcat
			onRefresh();

			// Check for listener beans and register them.
			// 注册监听器
			registerListeners();

			// Instantiate all remaining (non-lazy-init) singletons.
			// 初始化所有的非懒加载的 单例 Bean
			finishBeanFactoryInitialization(beanFactory);

			// Last step: publish corresponding event.
			// 完成初始化，发布相应的事件。
			finishRefresh();
		}

		catch (RuntimeException | Error ex ) {
			// 异常处理
			if (logger.isWarnEnabled()) {
				logger.warn("Exception encountered during context initialization - " +
						"cancelling refresh attempt: " + ex);
			}
			// Destroy already created singletons to avoid dangling resources.
			destroyBeans();

			// Reset 'active' flag.
			cancelRefresh(ex);

			// Propagate exception to caller.
			throw ex;
		}

		finally {
			// 清理 Bean 实例化时占用的缓存等。
			contextRefresh.end();
		}
	}
}
```

核心的步骤都加了中文注释。
主要流程如下：
1. 准备BeanFactory（DefaultListableBeanFactory）
   - 设置ClassLoader
   - 设置Environment
2. 扫描要放入容器中的Bean，得到对应的BeaDefinition(只扫描，并不创建)
3. 注册BeanPostProcessor
4. 处理国际化
5. 初始化事件多播器ApplicationEventMulticaster
6. 启动tomcat
7. 绑定事件监听器和事件多播器
8. 实例化非懒加载的单例Bean
9. 扫尾工作，比如清空实例化时占用的缓存等

## Bean 的生命周期
Bean 的生命周期大体上可以分为三个阶段：
- 创建阶段
- 使用阶段
- 销毁阶段

使用阶段和销毁阶段没啥好说的，主要看看创建阶段的代码流程。
### Bean 的创建阶段
Bean 的创建主要分为两个阶段：
- 实例化 Bean
- 初始化 Bean

通过前边 IOC 的初始化流程可以看到方法 finishBeanFactoryInitialization(beanFactory); 执行了 Bean 的初始化，那么 Bean 整个创建阶段就在这个方法中。
```java
protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {
    // 初始化此上下文的转换服务。
    if (beanFactory.containsBean(CONVERSION_SERVICE_BEAN_NAME) &&
            beanFactory.isTypeMatch(CONVERSION_SERVICE_BEAN_NAME, ConversionService.class)) {
        // 如果存在转换服务的bean，并且类型匹配，就设置转换服务。
        beanFactory.setConversionService(
                beanFactory.getBean(CONVERSION_SERVICE_BEAN_NAME, ConversionService.class));
    }

    // 如果没有BeanFactoryPostProcessor（例如PropertySourcesPlaceholderConfigurer bean）注册嵌入式值解析器，
    // 则注册一个默认的嵌入式值解析器，主要用于注解属性值的解析。
    if (!beanFactory.hasEmbeddedValueResolver()) {
        beanFactory.addEmbeddedValueResolver(strVal -> getEnvironment().resolvePlaceholders(strVal));
    }

    // 提前初始化LoadTimeWeaverAware的beans，以便尽早注册它们的转换器。
    String[] weaverAwareNames = beanFactory.getBeanNamesForType(LoadTimeWeaverAware.class, false, false);
    for (String weaverAwareName : weaverAwareNames) {
        // 获取bean实例，这将触发初始化
        getBean(weaverAwareName);
    }

    // 停止使用临时的ClassLoader进行类型匹配。
    beanFactory.setTempClassLoader(null);

    // 允许缓存所有bean定义的元数据，不期望进一步的更改。
    beanFactory.freezeConfiguration();

    // ***** 实例化所有剩余的（非延迟初始化的）单例。
    beanFactory.preInstantiateSingletons();
}
```
可以看到在 beanFactory.preInstantiateSingletons(); 中具体执行 Bean 的创建。
```java
@Override
public void preInstantiateSingletons() throws BeansException {
    if (logger.isTraceEnabled()) {
        // 如果日志记录器启用了trace级别记录，记录预实例化单例的开始信息。
        logger.trace("Pre-instantiating singletons in " + this);
    }

    // 获取所有的 BeanName
    List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

    // 触发所有非懒加载单例beans的初始化...
    for (String beanName : beanNames) {
        RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
        
        if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
			// 非抽象类，单例，非懒加载。进入方法

            // 如果是工厂bean，获取工厂bean实例。
            if (isFactoryBean(beanName)) {
                Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
                // 如果bean是SmartFactoryBean的实例，并且标记为需要提前初始化，则获取bean实例。
                if (bean instanceof SmartFactoryBean<?> smartFactoryBean && smartFactoryBean.isEagerInit()) {
                    getBean(beanName);
                }
            }
            else {
                // 如果不是工厂bean，直接获取bean实例。
				// 看看这里怎么 getBean 的
                getBean(beanName);
            }
        }
    }

    // 触发所有适用beans的初始化后回调...
    for (String beanName : beanNames) {
        // 获取单例实例。
		// 解决循环依赖的三级缓存代码在这里。
        Object singletonInstance = getSingleton(beanName);
        // 如果单例实例是SmartInitializingSingleton的实例，则调用afterSingletonsInstantiated方法。
        if (singletonInstance instanceof SmartInitializingSingleton smartSingleton) {
            StartupStep smartInitialize = getApplicationStartup().start("spring.beans.smart-initialize")
                    .tag("beanName", beanName);
            // 执行初始化后回调。
            smartSingleton.afterSingletonsInstantiated();
            // 结束启动步骤。
            smartInitialize.end();
        }
    }
}
```
doGetBean 往下执行
```java
@Override
public Object getBean(String name) throws BeansException {
	return doGetBean(name, null, null, false);
}
```
doGetBean 有多个重载方法，最终执行逻辑里有这样一段代码
```
// Create bean instance.
// 源码注释：创建 bean 实例。所以 Bean 初次创建，逻辑就在这里。
if (mbd.isSingleton()) {
	sharedInstance = getSingleton(beanName, () -> {
		try {
			return createBean(beanName, mbd, args);
		}
		catch (BeansException ex) {
			// Explicitly remove instance from singleton cache: It might have been put there
			// eagerly by the creation process, to allow for circular reference resolution.
			// Also remove any beans that received a temporary reference to the bean.
			destroySingleton(beanName);
			throw ex;
		}
	});
	beanInstance = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
}
```
进入 createBean 方法中
```java
org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory
#createBean(java.lang.String, 
			org.springframework.beans.factory.support.RootBeanDefinition, 
			java.lang.Object[])

try {
	// 执行 创建 bean。
	Object beanInstance = doCreateBean(beanName, mbdToUse, args);
	if (logger.isTraceEnabled()) {
		logger.trace("Finished creating instance of bean '" + beanName + "'");
	}
	return beanInstance;
}
```

进入 doCreateBean 中
```java
protected Object doCreateBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
		throws BeanCreationException {

	// 实例化bean。
	BeanWrapper instanceWrapper = null;
	if (mbd.isSingleton()) {
		// 如果是单例，尝试从缓存中获取Bean实例包装器。
		instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
	}
	if (instanceWrapper == null) {
		// 如果缓存中没有，调用createBeanInstance方法来创建Bean实例。
		// ****** 实例化，创建 Bean 对象。
		instanceWrapper = createBeanInstance(beanName, mbd, args);
	}
	Object bean = instanceWrapper.getWrappedInstance();
	Class<?> beanType = instanceWrapper.getWrappedClass();
	if (beanType != NullBean.class) {
		// 如果bean类型不是NullBean，设置目标类型。
		mbd.resolvedTargetType = beanType;
	}

	// 允许后处理器修改合并后的Bean定义。
	synchronized (mbd.postProcessingLock) {
		if (!mbd.postProcessed) {
			try {
				// 应用合并后的Bean定义后处理器。
				applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
			}
			catch (Throwable ex) {
				throw new BeanCreationException(mbd.getResourceDescription(), beanName,
						"合并Bean定义的后处理失败", ex);
			}
			// 标记为已后处理。
			mbd.markAsPostProcessed();
		}
	}

	// 即使在触发生命周期接口（如BeanFactoryAware）时，也要提前缓存单例以解决循环引用问题。
	boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
			isSingletonCurrentlyInCreation(beanName));
	if (earlySingletonExposure) {
		if (logger.isTraceEnabled()) {
			// 如果日志记录器启用了trace级别记录，记录提前缓存bean以解决潜在循环引用的信息。
			logger.trace("Eagerly caching bean '" + beanName +
					"' to allow for resolving potential circular references");
		}
		// 添加单例工厂以提前引用bean。
		addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
	}

	// 初始化bean实例。
	Object exposedObject = bean;
	try {
		// 填充bean属性。
		// ****** 依赖注入
		populateBean(beanName, mbd, instanceWrapper);
		// ****** 初始化bean。
		exposedObject = initializeBean(beanName, exposedObject, mbd);
	}
	catch (Throwable ex) {
		if (ex instanceof BeanCreationException bce && beanName.equals(bce.getBeanName())) {
			throw bce;
		}
		else {
			// 抛出Bean创建异常。
			throw new BeanCreationException(mbd.getResourceDescription(), beanName, ex.getMessage(), ex);
		}
	}

	if (earlySingletonExposure) {
		// 如果提前暴露了单例，检查是否有早期的单例引用。
		Object earlySingletonReference = getSingleton(beanName, false);
		if (earlySingletonReference != null) {
			if (exposedObject == bean) {
				// 如果暴露的对象是原始bean，则更新为早期单例引用。
				exposedObject = earlySingletonReference;
			}
			else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
				// 如果不允许在包装的情况下进行原始注入，并且存在依赖bean，则抛出异常。
				String[] dependentBeans = getDependentBeans(beanName);
				// ...（省略部分代码，与原始代码保持一致）
			}
		}
	}

	// 注册bean为可处置的。
	try {
		registerDisposableBeanIfNecessary(beanName, bean, mbd);
	}
	catch (BeanDefinitionValidationException ex) {
		throw new BeanCreationException(
				mbd.getResourceDescription(), beanName, "无效的销毁签名", ex);
	}

	// 返回暴露的对象。
	return exposedObject;
}
```
代码中有三个地方比较关键：
```java
// 这里执行了 Bean 实例化
if (instanceWrapper == null) {
	// 如果缓存中没有，调用createBeanInstance方法来创建Bean实例。
	// ****** 实例化，创建 Bean 对象。
	instanceWrapper = createBeanInstance(beanName, mbd, args);
}

// ****** 依赖注入
populateBean(beanName, mbd, instanceWrapper);
// ****** 初始化bean。
exposedObject = initializeBean(beanName, exposedObject, mbd);
```

下边看下 Bean 的初始化流程。
```java
protected Object initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd) {
    // 1. 调用Bean的aware方法。
    invokeAwareMethods(beanName, bean);

    Object wrappedBean = bean;
    // 如果Bean定义不是合成的（即不是由Spring自动创建的），则应用初始化前的Bean后处理器。
    if (mbd == null || !mbd.isSynthetic()) {
		// 2. 执行 BeanPostProcessors before 方法
        wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
    }

    try {
        // 3. 调用初始化方法，如实现了InitializingBean接口的afterPropertiesSet方法，或者指定的init-method方法。
        invokeInitMethods(beanName, wrappedBean, mbd);
    }
    catch (Throwable ex) {
        // 如果初始化方法抛出异常，则抛出Bean创建异常。
        throw new BeanCreationException(
                (mbd != null ? mbd.getResourceDescription() : null), beanName, ex.getMessage(), ex);
    }
    // 如果Bean定义不是合成的，应用初始化后的Bean后处理器。
    if (mbd == null || !mbd.isSynthetic()) {
		// 4. 执行 BeanPostProcessors before 方法
        wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
    }

    // 返回包装后的Bean实例。
    return wrappedBean;
}
```
### 总结
以上就是 Bean 创建的整体流程。
- 创建对象
	1. 实例化
	2. 依赖注入
- 初始化
	1. 执行 Aware 接口
	2. 执行 BeanPostProcessor.postProcessBeforeInitialization
	3. 执行 InitializingBean（如果有 @PostContruct 先执行 @PostContruct）
	4. 执行 BeanPostProcessor.postProcessAfterInitialization
- 使用对象
- 销毁对象
	1. 执行 DisposableBean 回调（如果有 @PreDestory 先执行 @PreDestory）


## Bean 的循环依赖
### 什么是循环依赖
Springboot 2.6 之后，循环依赖支持默认关闭了，如果出现循环依赖，建议使用懒加载。  
循环依赖是指 Bean 对象循环引用，是两个或多个 Bean 之间相互持有对方的引用，例如 A → B → A
```java
@Component
public class A {
    @Autowired
    private B b;
}

@Component
public class B {
    @Autowired
    private A a;
}
```

### 三级缓存
为确保即使在循环依赖的情况下也能正确创建 Bean，Spring 通过三个 Map 来解决这个问题，就是我们常说的 `三级缓存` 如下：
```java
org.springframework.beans.factory.support.DefaultSingletonBeanRegistry

// 一级缓存
// 存放最终形态的 Bean（已经实例化、属性填充、初始化）， 也叫单例池，一般情况我们获取 Bean 都是从这里获取的，但是并不是所有的 Bean 都在单例池里面，原型 Bean 就不在里面。
/** Cache of singleton objects: bean name to bean instance. */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

// 二级缓存
// 存放过渡 Bean（半成品，尚未属性填充），也就是三级缓存中 ObjectFactory 产生的对象，与三级缓存配合使用的，可以防止 AOP 的情况下，每次调用 ObjectFactory#getObject() 都是会产生新的代理对象的。
/** Cache of early singleton objects: bean name to bean instance. */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

// 三级缓存
// 存放ObjectFactory，ObjectFactory的getObject()方法（最终调用的是getEarlyBeanReference()方法）可以生成原始 Bean 对象或者代理对象（如果 Bean 被 AOP 切面代理）。
/** Cache of singleton factories: bean name to ObjectFactory. */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

```
> 正常来说单纯解决循环依赖问题，两级缓存就够了，但是动态代理的情况存在，就必须使用三级缓存来解决。  

如果想 debug 看看解决循环依赖的源码可以从下边的标识的地方开始。
```java
org.springframework.beans.factory.support.AbstractBeanFactory#doGetBean 中

// Create bean instance.
if (mbd.isSingleton()) {
	// 这里开始，一步一步，可以走完完整的解决循环依赖流程。
	sharedInstance = getSingleton(beanName, () -> {
		try {
			return createBean(beanName, mbd, args);
		}
		catch (BeansException ex) {
			// Explicitly remove instance from singleton cache: It might have been put there
			// eagerly by the creation process, to allow for circular reference resolution.
			// Also remove any beans that received a temporary reference to the bean.
			destroySingleton(beanName);
			throw ex;
		}
	});
	beanInstance = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
}
```

还有三个比较关键的方法
```java
// 添加 ObjectFacotry 到第三级缓存 SingletonFactories 的代码
org.springframework.beans.factory.support.DefaultSingletonBeanRegistry#addSingletonFactory
// 把完整品放入到 singletonObjects 的代码
org.springframework.beans.factory.support.DefaultSingletonBeanRegistry#addSingleton
// 从三级缓存获取 bean 的过程。
org.springframework.beans.factory.support.DefaultSingletonBeanRegistry#getSingleton(java.lang.String, boolean)
```


### 总结
Bean 的循环依赖指的是 A 依赖 B，B 又依赖 A 这样的依赖闭环问题，在 Spring 中，通过三个对象缓存区来解决循环依赖问题，这三个缓存区被定义到了 DefaultSingletonBeanRegistry 中，分别是 singletonObjects 用来存储创建完毕的 Bean， earlySingletonObjecs 用来存储未完成依赖注入的 Bean ，还有 singletonFactories 用来存储创建 Bean 的 ObjectFactory 。  

假如说现在 A 依赖B，B依赖A，整个Bean的创建过程是这样的：  
1. 首先，调用 A 的构造方法实例化 A ，当前的 A 还没有处理依赖注入，暂且把它称为半成品，此时会把半成品 A 封装到一个 ObjectFactory 中，并存储到 singletonFactories 缓存区。
2. 接下来，要处理 A 的依赖注入了，由于此时还没有 B，所以得先实例化一个 B，同样的，半成品 B 也会被封装到 ObjectFactory 中，并存储到 singletonFactories 缓存区。
3. 接着，要处理 B 的依赖注入了，此时会找到 singletonFactories 中 A 对应的 ObjecFactory , 调用它的 getObject 方法得到刚才实例化的半成品 A (如果需要代理对象,则会自动创建代理对象,将来得到的就是代理对象)，把得到的半成品 A 注入给B ，并同时会把半成品 A 存入到 earlySingletonObjects 中，将来如果还有其他的类循环依赖了 A ，就可以直接从 earlySingletonObjects 中找到它了，那么此时 singletonFactories 中创建 A 的 ObjectFactory 也可以删除了。
4. 至此，B 的依赖注入处理完了后，B 就创建完毕了，就可以把 B 的对象存入到 singletonObjects 中了，并同时删除掉 singletonFactories 中创建 B 的 ObjectFactory
5. B 创建完毕后，就可以继续处理 A 的依赖注入了，把 B 注入给 A ，此时 A 也创建完毕了，就可以把 A 的对象存储到 singletonObjects 中，并同时删除掉 earlySingletonObjects 中的半成品A。
6. 到此，A 和 B 对象全部创建完毕，并存储到了 singletonObjects 中，将来通过容器获取对象，都是从 singletonObejcts 中获取。

借助于 DefaultSingletonBeanRegistry 的三个缓存区可以解决循环依赖问题。
