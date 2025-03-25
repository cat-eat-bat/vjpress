---
title: Java 实现限流方法
date: 2025-02-18
tags: ["限流","微服务"]
outline: deep
---
# Java 实现限流方法

<PostMeta />

限流是指限制系统的请求流量，防止因过多的请求导致系统崩溃。在 Java 中，可以使用多种方式实现限流，下面将介绍其中几种常见的方法：

## 1. 计数器算法

### 1.1 描述

计数器算法是最简单的限流算法。它维护一个计数器，记录单位时间内通过的请求数。当请求数达到阈值时，后续的请求将被拒绝。

### 1.2 代码示例

```java
public class CounterLimiter {
    private int limit; // 限制的请求数
    private int counter; // 当前计数器
    private long startTime; // 开始时间

    public CounterLimiter(int limit) {
        this.limit = limit;
        this.startTime = System.currentTimeMillis();
    }

    public synchronized boolean allow() {
        long currentTime = System.currentTimeMillis();
        if (currentTime - startTime > 1000) { // 单位时间为 1 秒
            counter = 0;
            startTime = currentTime;
        }
        if (counter < limit) {
            counter++;
            return true;
        }
        return false;
    }
}
```

### 1.3 优点

* 实现简单。

### 1.4 缺点

* 无法应对突发流量。

## 2. 令牌桶算法

### 2.1 描述

令牌桶算法以恒定的速率向桶中添加令牌，每个请求需要从桶中获取一个令牌，如果桶中没有令牌，则请求被拒绝。

### 2.2 代码示例

```java
import com.google.common.util.concurrent.RateLimiter;

public class TokenBucketLimiter {
    private RateLimiter rateLimiter;

    public TokenBucketLimiter(int permitsPerSecond) {
        this.rateLimiter = RateLimiter.create(permitsPerSecond);
    }

    public boolean allow() {
        return rateLimiter.tryAcquire();
    }
}
```

### 2.3 优点

* 可以应对突发流量。

### 2.4 缺点

* 实现相对复杂。

## 3. 漏桶算法

### 3.1 描述

漏桶算法维护一个固定容量的桶，请求以任意速率流入桶中，然后以恒定的速率从桶中流出。如果流入的速率过快，导致桶满，则后续的请求将被拒绝。

### 3.2 代码示例

```java
public class LeakyBucketLimiter {
    private int capacity; // 桶的容量
    private int rate; // 流出速率
    private int water; // 当前水量
    private long lastTime; // 上次请求时间

    public LeakyBucketLimiter(int capacity, int rate) {
        this.capacity = capacity;
        this.rate = rate;
        this.lastTime = System.currentTimeMillis();
    }

    public synchronized boolean allow() {
        long currentTime = System.currentTimeMillis();
        water = Math.max(0, water - (int) ((currentTime - lastTime) * rate / 1000)); // 计算剩余水量
        lastTime = currentTime;
        if (water < capacity) {
            water++;
            return true;
        }
        return false;
    }
}
```

### 3.3 优点

* 可以平滑流量。

### 3.4 缺点

* 实现相对复杂。

## 4. Redis 限流

### 4.1 描述

可以使用 Redis 实现分布式限流。

### 4.2 代码示例

```java
import redis.clients.jedis.Jedis;

public class RedisLimiter {
    private Jedis jedis;
    private String key;
    private int limit;

    public RedisLimiter(Jedis jedis, String key, int limit) {
        this.jedis = jedis;
        this.key = key;
        this.limit = limit;
    }

    public boolean allow() {
        long current = System.currentTimeMillis() / 1000;
        jedis.incr(key);
        jedis.expire(key, 60); // 设置过期时间为 60 秒
        if (jedis.get(key) > limit) {
            return false;
        }
        return true;
    }
}
```

### 4.3 优点

* 可以实现分布式限流。

### 4.4 缺点

* 需要引入 Redis。


<PostNav />
