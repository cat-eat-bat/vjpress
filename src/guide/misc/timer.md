---
outline: deep
---

# 定时器

`ring-timer`: 基于时间轮实现的简易定时调度器，适用于应用内部的一些定时任务。

## 引入
```xml
<dependency> 
    <groupId>org.winterfell</groupId>
    <artifactId>ring-timer</artifactId>
    <version>1.1.0-SNAPSHOT</version>
</dependency>
```

## 使用
```java
// 创建一个 manager 采用默认设置
TimerManager  manager = new TimerManager();
// 1. 以固定速率执行的任务
manager.addTimerJob(TimerJobs.newFixedRateJob("fixed-rate-job", Duration.ofSeconds(30L), timeout -> {
    boolean expired = timeout.isExpired();
    System.out.println(DateTimeUtil.formatDefault(LocalDateTime.now())+ expired);
}));
// 2. 延迟一定时间执行的任务
manager.addTimerJob(TimerJobs.newDelayJob("delay-job", Duration.ofMinutes(1), timeout -> {
    System.out.printf(Thread.currentThread().getName());
    System.out.println(DateTimeUtil.formatDefault(LocalDateTime.now()));
    System.out.println(timeout.isExpired());
}));

// 3. cron 表达式任务
manager.addTimerJob(TimerJobs.newCronJob("cron-job", "*/7 * * * * ?", timeout -> {
    boolean expired = timeout.isExpired();
    System.out.println("executed");
    System.out.println(DateTimeUtil.formatDefault(LocalDateTime.now())+ expired);
}));

// 启动
manager.start();
```
