---
title: 服务限流
category:
  - 高可用
order: 1
tag:
  - 服务高可用
  - 服务限流
---

## 常用的限流算法
### 固定窗口计算器
固定时间内能处理xx并发
缺点，不平滑，比如1分钟控制1000次，前999次都在前10秒请求到服务器，两个窗口切换的时间，可能大于限流的限制流量。
```
public class FixedWindowRateLimiter {
    Logger logger = LoggerFactory.getLogger(FixedWindowRateLimiter.class);
    //时间窗口大小，单位毫秒
    long windowSize;
    //允许通过的请求数
    int maxRequestCount;
    //当前窗口通过的请求数
    AtomicInteger counter = new AtomicInteger(0);
    //窗口右边界
    long windowBorder;
    public FixedWindowRateLimiter(long windowSize, int maxRequestCount) {
        this.windowSize = windowSize;
        this.maxRequestCount = maxRequestCount;
        this.windowBorder = System.currentTimeMillis() + windowSize;
    }
    public synchronized boolean tryAcquire() {
        long currentTime = System.currentTimeMillis();
        if (windowBorder < currentTime) {
            logger.info("window reset");
            do {
                windowBorder += windowSize;
            } while (windowBorder < currentTime);
            counter = new AtomicInteger(0);
        }

        if (counter.intValue() < maxRequestCount) {
            counter.incrementAndGet();
            logger.info("tryAcquire success");
            return true;
        } else {
            logger.info("tryAcquire fail");
            return false;
        }
    }
}
```
### 滑动窗口计算器
把时间分片，例如600次/分钟，那么我们控制1秒钟最多 600 / 60 （10）次
优点是解决了时间窗口交界问题，缺点还是不够平滑，第一个分片把处理次数用完，剩下的分片都只能啥也不处理。
```
public class SlidingWindowRateLimiter {
    Logger logger = LoggerFactory.getLogger(FixedWindowRateLimiter.class);
    //时间窗口大小，单位毫秒
    long windowSize;
    //分片窗口数
    int shardNum;
    //允许通过的请求数
    int maxRequestCount;
    //各个窗口内请求计数
    int[] shardRequestCount;
    //请求总数
    int totalCount;
    //当前窗口下标
    int shardId;
    //每个小窗口大小，毫秒
    long tinyWindowSize;
    //窗口右边界
    long windowBorder;

    public SlidingWindowRateLimiter(long windowSize, int shardNum, int maxRequestCount) {
        this.windowSize = windowSize;
        this.shardNum = shardNum;
        this.maxRequestCount = maxRequestCount;
        this.shardRequestCount = new int[shardNum];
        this.tinyWindowSize = windowSize / shardNum;
        this.windowBorder = System.currentTimeMillis();
    }
    public synchronized boolean tryAcquire() {
        long currentTime = System.currentTimeMillis();
        if (windowBorder < currentTime) {
            logger.info("window reset");
            do {
                shardId = (++shardId) % shardNum;
                totalCount -= shardRequestCount[shardId];
                shardRequestCount[shardId] = 0;
                windowBorder += tinyWindowSize;
            } while (windowBorder < currentTime);
        }

        if (totalCount < maxRequestCount) {
            logger.info("tryAcquire success:{}", shardId);
            shardRequestCount[shardId]++;
            totalCount++;
            return true;
        } else {
            logger.info("tryAcquire fail");
            return false;
        }
    }
}
```
### 漏桶算法
把请求排队，比如把队列设置为1000，然后消费端已固定的速度消费，如果超过1000则抛弃掉
缺点，无法应对激增的流量。无法动态调整速率

```

public class LeakyBucketRateLimiter {
    Logger logger = LoggerFactory.getLogger(LeakyBucketRateLimiter.class);
    //桶的容量
    int capacity;
    //桶中现存水量
    AtomicInteger water = new AtomicInteger();
    //开始漏水时间
    long leakTimestamp;
    //水流出的速率，即每秒允许通过的请求数
    int leakRate;

    public LeakyBucketRateLimiter(int capacity, int leakRate) {
        this.capacity = capacity;
        this.leakRate = leakRate;
    }

    public synchronized boolean tryAcquire() {
        //桶中没有水， 重新开始计算
        if (water.get() == 0) {
            logger.info("start leaking");
            leakTimestamp = System.currentTimeMillis();
            water.incrementAndGet();
            return water.get() < capacity;
        }
        //先漏水，计算剩余水量
        long currentTime = System.currentTimeMillis();
        int leakedWater = (int) ((currentTime - leakTimestamp) / 1000 * leakRate);
        logger.info("lastTime:{}, currentTime:{}. LeakedWater:{}", leakTimestamp, currentTime, leakedWater);
        //可能时间不足，则先不漏水
        if (leakedWater != 0) {
            int leftWater = water.get() - leakedWater;
            //可能水已漏光。设为0
            water.set(Math.max(0, leftWater));
            leakTimestamp = System.currentTimeMillis();
        }
        logger.info("剩余容量:{}", capacity - water.get());
        if (water.get() < capacity) {
            logger.info("tryAcquire sucess");
            water.incrementAndGet();
            return true;
        } else {
            logger.info("tryAcquire fail");
            return false;
        }
    }
}
```
### 令牌桶算法
我们定期往令牌桶里添加令牌，如果令牌满了就停止增加，消费端定期从桶里取令牌，取到就处理，取不到就不处理，达到限流作用。
## 单机限流
使用 guava 
```java
RateLimiter rateLimiter = RateLimiter.create(5, 3, TimeUnit.SECONDS);
for (int i = 0; i < 20; i++) {
    double sleepingTime = rateLimiter.acquire(1);
    System.out.printf("get 1 tokens: %sds%n", sleepingTime);
}
```

## 分布式限流
借助中间件
Redisson
Redis + lua
## 


