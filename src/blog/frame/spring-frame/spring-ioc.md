---
title: IOC初始化和Bean
category:
  - 常用框架
order: 32
tag:
  - frame
  - Springboot
---

## Springboot IOC 初始化

spring IOC 容器的初始化过程代码主要在 `org.springframework.context.support.AbstractApplicationContext#refresh` 中。
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
## Bean 的循环依赖


