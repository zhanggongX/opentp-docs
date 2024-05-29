---
title: 服务限流
category:
  - 高可用
order: 3
tag:
  - 服务高可用
  - 服务限流
---

## 服务限流介绍
服务限流是一种流量控制的策略，用于限制系统处理请求的速率或数量，以保护系统免受过多请求的影响。  
通过限制系统处理请求的速率或数量，可以有效地保障系统的稳定性和可用性，防止系统被过载和崩溃。

服务限流作用：
1. 保护系统资源： 限制系统处理请求的速率，避免资源被过度占用，保护系统的核心资源不被耗尽。
2. 防止恶意攻击： 限制对系统的请求速率，防止恶意攻击和请求的过度消耗资源，保护系统免受攻击。
3. 平滑流量： 限制系统处理请求的数量，使得系统能够平滑处理流量峰值，防止系统因流量突增而崩溃。

服务限流是保障系统稳定性和可用性的重要手段之一，通过限制系统处理请求的速率或数量，可以有效地保护系统免受过载和崩溃的影响。在设计和实现服务限流策略时，需要考虑系统的实际情况和业务需求，选择合适的限流算法和参数，以确保系统能够稳定可靠地运行。

## 常用的限流算法
1. **固定时间窗口的限流**：设置一个固定的时间窗口，统计在该时间窗口内系统处理的请求数量或速率，如果超过设定的阈值，则限制后续请求。
2. **滑动时间窗口的限流**：设置一个固定的时间窗口，统计在该时间窗口内系统处理的请求数量或速率，如果超过设定的阈值，则限制后续请求。
3. **漏桶算法**：维护一个固定容量的漏桶，每次请求到来时将请求放入漏桶中，如果漏桶已满，则限制后续请求。
4. **令牌桶算法**：维护一个固定容量的令牌桶，每次请求需要从令牌桶中获取令牌，如果令牌桶中的令牌数量不足，则限制后续请求。
5. **动态限流**：根据系统负载情况动态调整限流策略，使得系统能够根据实际情况灵活调整限流策略。

### 固定时间窗口的限流
有点： 固定时间窗口限流算法简单直观，易于理解和实现。  
缺点： 不平滑，比如1分钟控制1000次，前999次都在前10秒请求到服务器，两个窗口切换的时间，可能大于限流的限制流量。  
```java
public class FixedWindowRateLimiter  {

    private final int threshold;
    private volatile long windowStartTime;
    private final long windowUnit = 1000L;
    private final AtomicInteger counter = new AtomicInteger();

    public FixedWindowRateLimiter(int threshold) {
        this.threshold = threshold;
        this.windowStartTime = System.currentTimeMillis();
    }

    @Override
    public boolean tryAcquire() {
        long currentTime = System.currentTimeMillis();

        if (currentTime - windowStartTime >= windowUnit) {
            if (currentTime - windowStartTime >= windowUnit) {
                counter.set(0);
                windowStartTime = currentTime;
            }
        }

        return counter.incrementAndGet() <= threshold;
    }
}
```

### 滑动时间窗口的限流
固定时间窗口限流算法的问题就是不够平滑，一个时间窗口 1S 允许 1000 个请求，如果 窗口1 的后半秒，处理了900个请求，窗口2 的前半秒处理了800个请求，那么两个窗口之间这一秒，实际处理了 1700 个请求，超过了阈值。  
例如下边示例，滑动窗口定义了一个队列，队列内小于 **当前时间-时间窗口** 的值出队列，当前时间进队列，就不会出现 **当前窗口前半秒+上个窗口后半秒** 激增的情况。  
这样就相当于把时间窗口在时间线上滑动了起来。  

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class SlidingWindowRateLimiter {
    private final Queue<Long> window; // 用于存储每个时间窗口的请求时间戳
    private final int windowSize;     // 时间窗口大小，单位：毫秒
    private final int maxRequests;    // 每个时间窗口内允许的最大请求数量

    public SlidingWindowRateLimiter(int windowSize, int maxRequests) {
        this.windowSize = windowSize;
        this.maxRequests = maxRequests;
        this.window = new ArrayDeque<>(maxRequests);
    }

    public synchronized boolean allowRequest() {
        long currentTime = System.currentTimeMillis();
        // 移除过期的时间窗口记录
        while (!window.isEmpty() && currentTime - window.peek() >= windowSize) {
            window.poll();
        }
        // 如果当前时间窗口内请求数量超过阈值，则拒绝请求
        if (window.size() >= maxRequests) {
            return false;
        }
        // 否则，接受请求并记录请求时间戳
        window.offer(currentTime);
        return true;
    }

    public static void main(String[] args) {
        // 创建固定时间窗口限流器，每秒钟最多允许处理 5 个请求
        FixedWindowRateLimiter limiter = new FixedWindowRateLimiter(1000, 5);
        // 模拟请求
        for (int i = 0; i < 10; i++) {
            if (limiter.allowRequest()) {
                System.out.println("处理请求 " + i);
            } else {
                System.out.println("请求 " + i + " 被限流");
            }
            try {
                Thread.sleep(200); // 模拟请求间隔
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

```

### 漏桶算法
漏桶算法的基本思想是将请求视为水滴滴入漏桶中，水滴以恒定的速率从桶中漏出。当桶满时，新的请求（或水滴）会被丢弃，表明流量已经超过限制。  
把请求排队，比如把队列设置为1000，然后消费端已固定的速度消费，如果超过1000则抛弃掉。   
缺点就是无法应对激增的流量。无法动态调整速率。

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class LeakyBucketRateLimiter {
    private final int capacity;                // 漏桶容量
    private final int leakRate;                // 漏出速率（每秒处理的请求数）
    private final BlockingQueue<Long> queue;   // 请求队列

    public LeakyBucketRateLimiter(int capacity, int leakRate) {
        this.capacity = capacity;
        this.leakRate = leakRate;
        this.queue = new LinkedBlockingQueue<>(capacity);

        // 启动漏桶线程，按照漏出速率处理请求
        Thread leakThread = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(1000 / leakRate);  // 控制漏出速率
                    queue.poll();                  // 处理请求
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });
        leakThread.setDaemon(true);
        leakThread.start();
    }

    // 尝试处理请求，返回是否允许处理该请求
    public boolean tryAcquire() {
        if (queue.remainingCapacity() > 0) {
            queue.offer(System.currentTimeMillis());
            return true;
        } else {
            return false; // 桶满，拒绝请求
        }
    }

    public static void main(String[] args) {
        // 创建漏桶限流器，容量为 10，每秒最多处理 5 个请求
        LeakyBucketRateLimiter rateLimiter = new LeakyBucketRateLimiter(10, 5);

        // 模拟请求
        for (int i = 0; i < 20; i++) {
            if (rateLimiter.tryAcquire()) {
                System.out.println("处理请求 " + i);
            } else {
                System.out.println("请求 " + i + " 被限流");
            }
            try {
                Thread.sleep(200); // 模拟请求间隔
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

```
### 令牌桶算法
令牌桶算法的基本思想是维护一个装有固定容量令牌的桶，按照固定速率向桶中添加令牌。每个请求需要消耗一个令牌才能被处理，如果桶中没有足够的令牌，请求将被拒绝或延迟处理。  
```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class TokenBucketRateLimiter {
    private final int capacity;                 // 桶的容量
    private final int refillRate;               // 令牌添加速率（每秒添加的令牌数）
    private final AtomicInteger tokens;         // 当前令牌数量
    private final ScheduledExecutorService scheduler; // 调度器，用于定时添加令牌

    public TokenBucketRateLimiter(int capacity, int refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = new AtomicInteger(capacity);

        // 初始化调度器，按照添加速率定时添加令牌
        this.scheduler = Executors.newScheduledThreadPool(1);
        this.scheduler.scheduleAtFixedRate(this::addTokens, 0, 1000 / refillRate, TimeUnit.MILLISECONDS);
    }

    // 添加令牌到桶中
    private void addTokens() {
        if (tokens.get() < capacity) {
            tokens.incrementAndGet();
        }
    }

    // 尝试处理请求，返回是否允许处理该请求
    public boolean tryAcquire() {
        if (tokens.get() > 0) {
            tokens.decrementAndGet();
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        // 创建令牌桶限流器，桶容量为 10，每秒添加 5 个令牌
        TokenBucketRateLimiter rateLimiter = new TokenBucketRateLimiter(10, 5);

        // 模拟请求
        for (int i = 0; i < 20; i++) {
            if (rateLimiter.tryAcquire()) {
                System.out.println("处理请求 " + i);
            } else {
                System.out.println("请求 " + i + " 被限流");
            }
            try {
                Thread.sleep(200); // 模拟请求间隔
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        rateLimiter.scheduler.shutdown();
    }
}

```

#### 使用 guava 的令牌桶。
```java
RateLimiter rateLimiter = RateLimiter.create(5, 3, TimeUnit.SECONDS);
for (int i = 0; i < 20; i++) {
    double sleepingTime = rateLimiter.acquire(1);
    System.out.printf("get 1 tokens: %sds%n", sleepingTime);
}
```

### 动态限流
根据接口总响应时长和请求数量，计算平均响应时长，再根据不同的响应时长，动态调整限流大小。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class DynamicRateLimiter {
    private final int baseRate;        // 基本限流速率
    private final int maxRate;         // 最大限流速率
    private final long checkInterval;  // 检查间隔时间，单位：毫秒
    private final AtomicInteger currentRate; // 当前限流速率
    private volatile long lastCheckTime;     // 上次检查时间
    private volatile long totalResponseTime; // 总响应时间
    private volatile int requestCount;       // 请求计数

    public DynamicRateLimiter(int baseRate, int maxRate, long checkInterval) {
        this.baseRate = baseRate;
        this.maxRate = maxRate;
        this.checkInterval = checkInterval;
        this.currentRate = new AtomicInteger(baseRate);
        this.lastCheckTime = System.currentTimeMillis();
        this.totalResponseTime = 0;
        this.requestCount = 0;
    }

    // 尝试处理请求，返回是否允许处理该请求
    public synchronized boolean tryAcquire() {
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastCheckTime >= checkInterval) {
            adjustRate();
            lastCheckTime = currentTime;
            totalResponseTime = 0;
            requestCount = 0;
        }
        if (currentRate.get() > 0) {
            currentRate.decrementAndGet();
            return true;
        }
        return false;
    }

    // 调整限流速率
    private void adjustRate() {
        if (requestCount > 0) {
            long averageResponseTime = totalResponseTime / requestCount;
            if (averageResponseTime > 500) { // 如果平均响应时间大于 500ms，降低限流速率
                currentRate.updateAndGet(rate -> Math.max(baseRate, rate - 1));
            } else if (averageResponseTime < 200) { // 如果平均响应时间小于 200ms，增加限流速率
                currentRate.updateAndGet(rate -> Math.min(maxRate, rate + 1));
            }
        } else {
            currentRate.set(baseRate);
        }
    }

    // 模拟处理请求，记录响应时间
    public void handleRequest(Runnable request) {
        long startTime = System.currentTimeMillis();
        if (tryAcquire()) {
            request.run();
            long responseTime = System.currentTimeMillis() - startTime;
            totalResponseTime += responseTime;
            requestCount++;
            currentRate.incrementAndGet(); // 请求处理完毕后，释放令牌
        } else {
            System.out.println("请求被限流");
        }
    }

    public static void main(String[] args) {
        DynamicRateLimiter rateLimiter = new DynamicRateLimiter(5, 10, 1000);

        // 模拟请求
        for (int i = 0; i < 20; i++) {
            rateLimiter.handleRequest(() -> {
                try {
                    Thread.sleep((int) (Math.random() * 400)); // 模拟请求处理时间
                    System.out.println("处理请求");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });

            try {
                Thread.sleep(200); // 模拟请求间隔
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 分布式限流
由于分布式系统中存在多个服务节点，分布式限流需要在全局范围内协调各节点的限流策略，以保证整体系统的稳定性和高可用性。

### 基于 Redis 的分布式限流实现示例
#### Redis 脚本
使用 Lua 脚本保证原子性操作。  
使用 Lua 脚本检查当前计数器的值，如果未超过限流阈值，则增加计数器并设置过期时间，否则返回 0 表示限流。  

```lua
-- rate_limit.lua
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0
else
    redis.call("INCRBY", key, 1)
    redis.call("EXPIRE", key, 1)
    return 1
end
```
#### lua 脚本解释：
- `KEYS[1]`：限流键。
- `ARGV[1]`：限流阈值。
- 检查当前计数器的值，如果超过阈值则返回 0，否则增加计数器并设置过期时间为 1 秒。

#### Java 实现
使用 Jedis 客户端连接 Redis 并执行限流操作。

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisRateLimiter {
    private static final String LUA_SCRIPT = "local key = KEYS[1] " +
                                             "local limit = tonumber(ARGV[1]) " +
                                             "local current = tonumber(redis.call('get', key) or '0') " +
                                             "if current + 1 > limit then " +
                                             "  return 0 " +
                                             "else " +
                                             "  redis.call('INCRBY', key, 1) " +
                                             "  redis.call('EXPIRE', key, 1) " +
                                             "  return 1 " +
                                             "end";

    private final JedisPool jedisPool;
    private final int limit;

    public RedisRateLimiter(String redisHost, int redisPort, int limit) {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        this.jedisPool = new JedisPool(poolConfig, redisHost, redisPort);
        this.limit = limit;
    }

    public boolean tryAcquire(String key) {
        try (Jedis jedis = jedisPool.getResource()) {
            Object result = jedis.eval(LUA_SCRIPT, 1, key, String.valueOf(limit));
            return result.equals(1L);
        }
    }

    public static void main(String[] args) {
        RedisRateLimiter rateLimiter = new RedisRateLimiter("localhost", 6379, 10);
        String key = "api_limit_test";

        for (int i = 0; i < 20; i++) {
            if (rateLimiter.tryAcquire(key)) {
                System.out.println("处理请求 " + i);
            } else {
                System.out.println("请求 " + i + " 被限流");
            }
            try {
                Thread.sleep(100); // 模拟请求间隔
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

分布式限流在分布式系统中是必不可少的，通过集中式协调服务、服务网关、分布式缓存等方式实现全局限流，可以有效地控制请求速率，保证系统的稳定性和高可用性。  
基于 Redis 的实现是一种常见且高效的分布式限流方式，通过 Lua 脚本保证原子性操作，简单易用，适用于多种场景。  

### 借助中间件
Redisson