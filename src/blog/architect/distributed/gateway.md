---
title: 网关
category:
  - 分布式
order: 4
tag:
  - distributed
  - gateway
---

## 什么是网关？
微服务背景下，一个系统被拆分为多个服务，但是像安全认证，流量控制，日志，监控等功能是每个服务都需要的，没有网关的话，我们就需要在每个服务中单独实现，这使得我们做了很多重复的事情并且没有一个全局的视图来统一管理这些功能。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224082328-10ce0c29-973e-47b3-ae94-1d2dddc4be94.png#averageHue=%23f6f4f3&clientId=u2b10ad92-5b56-4&from=paste&height=441&id=u5b7bc0e9&originHeight=531&originWidth=791&originalType=binary&ratio=2&rotation=0&showTitle=false&size=33920&status=done&style=none&taskId=u6f73a4af-ff8c-4ba1-ad65-e46f495e4b6&title=&width=656.5)
一般情况下，网关可以为我们提供请求转发、安全认证（身份/权限认证）、流量控制、负载均衡、降级熔断、日志、监控、参数校验、协议转换等功能。
上面介绍了这么多功能，实际上，网关主要做了两件事情：**请求转发** + **请求过滤**。
由于引入网关之后，会多一步网络转发，因此性能会有一点影响（几乎可以忽略不计，尤其是内网访问的情况下）。 另外，我们需要保障网关服务的高可用，避免单点风险。
如下图所示，网关服务外层通过 Nginx（其他负载均衡设备/软件也行） 进⾏负载转发以达到⾼可⽤。Nginx 在部署的时候，尽量也要考虑高可用，避免单点风险。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224136131-00b4c514-7f6a-4b42-b765-f0e1808af316.png#averageHue=%23f5fdf6&clientId=u2b10ad92-5b56-4&from=paste&height=607&id=u5c90852e&originHeight=523&originWidth=456&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30016&status=done&style=none&taskId=u290af0a7-2a51-4a6e-b901-ee4407e382a&title=&width=529)

## [网关能提供哪些功能？](#网关能提供哪些功能)
绝大部分网关可以提供下面这些功能（有一些功能需要借助其他框架或者中间件）：

- **请求转发**：将请求转发到目标微服务。
- **负载均衡**：根据各个微服务实例的负载情况或者具体的负载均衡策略配置对请求实现动态的负载均衡。
- **安全认证**：对用户请求进行身份验证并仅允许可信客户端访问 API，并且还能够使用类似 RBAC 等方式来授权。
- **参数校验**：支持参数映射与校验逻辑。
- **日志记录**：记录所有请求的行为日志供后续使用。
- **监控告警**：从业务指标、机器指标、JVM 指标等方面进行监控并提供配套的告警机制。
- **流量控制**：对请求的流量进行控制，也就是限制某一时刻内的请求数。
- **熔断降级**：实时监控请求的统计信息，达到配置的失败阈值后，自动熔断，返回默认值。
- **响应缓存**：当用户请求获取的是一些静态的或更新不频繁的数据时，一段时间内多次请求获取到的数据很可能是一样的。对于这种情况可以将响应缓存起来。这样用户请求可以直接在网关层得到响应数据，无需再去访问业务服务，减轻业务服务的负担。
- **响应聚合**：某些情况下用户请求要获取的响应内容可能会来自于多个业务服务。网关作为业务服务的调用方，可以把多个服务的响应整合起来，再一并返回给用户。
- **灰度发布**：将请求动态分流到不同的服务版本（最基本的一种灰度发布）。
- **异常处理**：对于业务服务返回的异常响应，可以在网关层在返回给用户之前做转换处理。这样可以把一些业务侧返回的异常细节隐藏，转换成用户友好的错误提示返回。
- **API 文档：** 如果计划将 API 暴露给组织以外的开发人员，那么必须考虑使用 API 文档，例如 Swagger 或 OpenAPI。
- **协议转换**：通过协议转换整合后台基于 REST、AMQP、Dubbo 等不同风格和实现技术的微服务，面向 Web Mobile、开放平台等特定客户端提供统一服务。
- **证书管理**：将 SSL 证书部署到 API 网关，由一个统一的入口管理接口，降低了证书更换时的复杂度。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224216634-39684004-a336-4a3d-87c9-7aed781f1ee4.png#averageHue=%23f5e3c2&clientId=u2b10ad92-5b56-4&from=paste&height=261&id=udb3b599a&originHeight=406&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81976&status=done&style=none&taskId=u8dd2fddb-6204-41af-99f9-d6d70bf2ed9&title=&width=694)

## 有哪些常见的网关系统？
### Netflix Zuul
Zuul 是 Netflix 开发的一款提供动态路由、监控、弹性、安全的网关服务，基于 Java 技术栈开发，可以和 Eureka、Ribbon、Hystrix 等组件配合使用。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224301848-c332d474-a4c4-46fc-96cd-047694a8c956.png#averageHue=%23aac6e0&clientId=u2b10ad92-5b56-4&from=paste&height=481&id=u4674f249&originHeight=790&originWidth=1013&originalType=binary&ratio=2&rotation=0&showTitle=false&size=451782&status=done&style=none&taskId=u0d6cda7c-3700-478d-9a27-09535a20a23&title=&width=616.5)
Zuul 主要通过过滤器（类似于 AOP）来过滤请求，从而实现网关必备的各种功能。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224315409-fad933f5-e153-415d-8375-afdb8cedca6d.png#averageHue=%23161616&clientId=u2b10ad92-5b56-4&from=paste&height=509&id=u84594ac0&originHeight=720&originWidth=960&originalType=binary&ratio=2&rotation=0&showTitle=false&size=95267&status=done&style=none&taskId=uceb1087c-2481-47d3-884b-84a9ea385ab&title=&width=678)
Zuul 1.x基于同步 IO，性能较差。Zuul 2.x 基于 Netty 实现了异步 IO，性能得到了大幅改进。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224398511-8ee29c0b-831e-4c63-9501-e6a8c958bcac.png#averageHue=%23070602&clientId=u2b10ad92-5b56-4&from=paste&height=555&id=uce758e59&originHeight=721&originWidth=872&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51364&status=done&style=none&taskId=u34264a36-483f-4a09-854e-eaae2e7bf94&title=&width=671)
### Spring Cloud Gateway
SpringCloud Gateway 属于 Spring Cloud 生态系统中的网关，其诞生的目标是为了替代老牌网关 **Zuul**。准确点来说，应该是 Zuul 1.x。SpringCloud Gateway 起步要比 Zuul 2.x 更早。
为了提升网关的性能，SpringCloud Gateway 基于 Spring WebFlux 。Spring WebFlux 使用 Reactor 库来实现响应式编程模型，底层基于 Netty 实现同步非阻塞的 I/O。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224432484-03b64235-3a0c-4a4d-927f-f77ebb97aa2d.png#averageHue=%23f7f7f7&clientId=u2b10ad92-5b56-4&from=paste&height=337&id=u37d131b9&originHeight=673&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=92196&status=done&style=none&taskId=uf4b27d7f-a1b1-4af5-8899-e94f39a1ec7&title=&width=800)
Spring Cloud Gateway 不仅提供统一的路由方式，并且基于 Filter 链的方式提供了网关基本的功能，例如：安全，监控/指标，限流。
Spring Cloud Gateway 和 Zuul 2.x 的差别不大，也是通过过滤器来处理请求。不过，目前更加推荐使用 Spring Cloud Gateway 而非 Zuul，Spring Cloud 生态对其支持更加友好。
### Spring Cloud Gateway 的工作流程？
Spring Cloud Gateway 的工作流程如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224618737-0ede838c-dbd4-476a-9a80-0009515c79f9.png#averageHue=%23fdfdfd&clientId=u9e4daa38-b26f-4&from=paste&height=264&id=u3eb91732&originHeight=384&originWidth=1001&originalType=binary&ratio=2&rotation=0&showTitle=false&size=89009&status=done&style=none&taskId=u4f9e9ba1-c701-4e0d-a65f-4d6c6828274&title=&width=688.5)
具体的流程分析：

1. **路由判断**：客户端的请求到达网关后，先经过 Gateway Handler Mapping 处理，这里面会做断言（Predicate）判断，看下符合哪个路由规则，这个路由映射后端的某个服务。
2. **请求过滤**：然后请求到达 Gateway Web Handler，这里面有很多过滤器，组成过滤器链（Filter Chain），这些过滤器可以对请求进行拦截和修改，比如添加请求头、参数校验等等，有点像净化污水。然后将请求转发到实际的后端服务。这些过滤器逻辑上可以称作 Pre-Filters，Pre 可以理解为“在...之前”。
3. **服务处理**：后端服务会对请求进行处理。
4. **响应过滤**：后端处理完结果后，返回给 Gateway 的过滤器再次做处理，逻辑上可以称作 Post-Filters，Post 可以理解为“在...之后”。
5. **响应返回**：响应经过过滤处理后，返回给客户端。

总结：客户端的请求先通过匹配规则找到合适的路由，就能映射到具体的服务。然后请求经过过滤器处理后转发给具体的服务，服务处理后，再次经过过滤器处理，最后返回给客户端。
### Spring Cloud Gateway 的断言是什么？
断言（Predicate）这个词听起来极其深奥，它是一种编程术语，我们生活中根本就不会用它。说白了它就是对一个表达式进行 if 判断，结果为真或假，如果为真则做这件事，否则做那件事。
在 Gateway 中，如果客户端发送的请求满足了断言的条件，则映射到指定的路由器，就能转发到指定的服务上进行处理。
断言配置的示例如下，配置了两个路由规则，有一个 predicates 断言配置，当请求 url 中包含 api/thirdparty，就匹配到了第一个路由 route_thirdparty。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224728005-2b0a9555-75f9-4ab9-8a2f-3e151e473637.png#averageHue=%230d2e4d&clientId=u9e4daa38-b26f-4&from=paste&height=400&id=u6813d625&originHeight=644&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=204599&status=done&style=none&taskId=udf469780-c86a-40a2-a42d-d0d75f391e8&title=&width=670)
常见的路由断言规则如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224758696-63bb3e58-63e8-4973-9eef-24b8d85e3f74.png#averageHue=%23d6eff0&clientId=u9e4daa38-b26f-4&from=paste&height=591&id=u2184becc&originHeight=1078&originWidth=1270&originalType=binary&ratio=2&rotation=0&showTitle=false&size=501789&status=done&style=none&taskId=udc369a4e-25cc-48ea-b6ae-25f18799eb3&title=&width=696)
### Spring Cloud Gateway 的路由和断言是什么关系？
Route 路由和 Predicate 断言的对应关系如下：
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224799869-638a02f7-23d7-4c54-ba88-4560d21ab59c.png#averageHue=%23b8e4b9&clientId=u9e4daa38-b26f-4&from=paste&height=719&id=u9b3a1733&originHeight=1196&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=319379&status=done&style=none&taskId=uf416aa5e-0d19-4cc4-801d-b729e653372&title=&width=649)

- **一对多**：一个路由规则可以包含多个断言。如上图中路由 Route1 配置了三个断言 Predicate。
- **同时满足**：如果一个路由规则中有多个断言，则需要同时满足才能匹配。如上图中路由 Route2 配置了两个断言，客户端发送的请求必须同时满足这两个断言，才能匹配路由 Route2。
- **第一个匹配成功**：如果一个请求可以匹配多个路由，则映射第一个匹配成功的路由。如上图所示，客户端发送的请求满足 Route3 和 Route4 的断言，但是 Route3 的配置在配置文件中靠前，所以只会匹配 Route3。
### Spring Cloud Gateway 如何实现动态路由？
在使用 Spring Cloud Gateway 的时候，官方文档提供的方案总是基于配置文件或代码配置的方式。
Spring Cloud Gateway 作为微服务的入口，需要尽量避免重启，而现在配置更改需要重启服务不能满足实际生产过程中的动态刷新、实时变更的业务需求，所以我们需要在 Spring Cloud Gateway 运行时动态配置网关。
实现动态路由的方式有很多种，其中一种推荐的方式是基于 Nacos 注册中心来做。 Spring Cloud Gateway 可以从注册中心获取服务的元数据（例如服务名称、路径等），然后根据这些信息自动生成路由规则。这样，当你添加、移除或更新服务实例时，网关会自动感知并相应地调整路由规则，无需手动维护路由配置。
其实这些复杂的步骤并不需要我们手动实现，通过 Nacos Server 和 Spring Cloud Alibaba Nacos Config 即可实现配置的动态变更，官方文档地址：[https://github.com/alibaba/spring-cloud-alibaba/wiki/Nacos-configopen in new window](https://github.com/alibaba/spring-cloud-alibaba/wiki/Nacos-config) 。
### Spring Cloud Gateway 的过滤器有哪些？
过滤器 Filter 按照请求和响应可以分为两种：

- **Pre 类型**：在请求被转发到微服务之前，对请求进行拦截和修改，例如参数校验、权限校验、流量监控、日志输出以及协议转换等操作。
- **Post 类型**：微服务处理完请求后，返回响应给网关，网关可以再次进行处理，例如修改响应内容或响应头、日志输出、流量监控等。

另外一种分类是按照过滤器 Filter 作用的范围进行划分：

- **GatewayFilter**：局部过滤器，应用在单个路由或一组路由上的过滤器。标红色表示比较常用的过滤器。
- **GlobalFilter**：全局过滤器，应用在所有路由上的过滤器。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224954467-f634b814-cdfe-4bc1-842b-3ec78be07dbf.png#averageHue=%23dadada&clientId=u9e4daa38-b26f-4&from=paste&height=406&id=u851cba84&originHeight=603&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=342801&status=done&style=none&taskId=ua5e76bca-dacd-4060-9a1b-f93d515f2e9&title=&width=727)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/39293052/1710224980810-7d63f343-e46d-40df-a974-728c74d11db2.png#averageHue=%23aeadad&clientId=u9e4daa38-b26f-4&from=paste&height=353&id=u3bd3260c&originHeight=528&originWidth=1042&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156864&status=done&style=none&taskId=u8da5e766-3b29-4975-a00b-4a76edcf1fd&title=&width=696)
### Spring Cloud Gateway 支持限流吗？
Spring Cloud Gateway 自带了限流过滤器，对应的接口是 RateLimiter，RateLimiter 接口只有一个实现类 RedisRateLimiter （基于 Redis + Lua 实现的限流），提供的限流功能比较简易且不易使用。
从 Sentinel 1.6.0 版本开始，Sentinel 引入了 Spring Cloud Gateway 的适配模块，可以提供两种资源维度的限流：route 维度和自定义 API 维度。也就是说，Spring Cloud Gateway 可以结合 Sentinel 实现更强大的网关流量控制。

### Spring Cloud Gateway 如何自定义全局异常处理？
在 SpringBoot 项目中，我们捕获全局异常只需要在项目中配置 @RestControllerAdvice和 @ExceptionHandler就可以了。不过，这种方式在 Spring Cloud Gateway 下不适用。
Spring Cloud Gateway 提供了多种全局处理的方式，比较常用的一种是实现ErrorWebExceptionHandler并重写其中的handle方法。
```
@Order(-1)
@Component
@RequiredArgsConstructor
public class GlobalErrorWebExceptionHandler implements ErrorWebExceptionHandler {
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
    // ...
    }
}
```
### OpenResty
根据官方介绍：
OpenResty 是一个基于 Nginx 与 Lua 的高性能 Web 平台，其内部集成了大量精良的 Lua 库、第三方模块以及大多数的依赖项。用于方便地搭建能够处理超高并发、扩展性极高的动态 Web 应用、Web 服务和动态网关。
### APISIX
APISIX 是一款基于 OpenResty 和 etcd 的高性能、云原生、可扩展的网关系统。
> etcd 是使用 Go 语言开发的一个开源的、高可用的分布式 key-value 存储系统，使用 Raft 协议做分布式共识。

与传统 API 网关相比，APISIX 具有动态路由和插件热加载，特别适合微服务系统下的 API 管理。并且，APISIX 与 SkyWalking（分布式链路追踪系统）、Zipkin（分布式链路追踪系统）、Prometheus（监控系统） 等 DevOps 生态工具对接都十分方便。





