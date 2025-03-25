---
outline: deep
---

# app-vertx-starter

```yaml
vertx:
  application:
    name: my-zoo-app  # 设置应用名称
  server:
    port: 8765  # http服务端口
    instances: 1 # 默认启动的实例数
  event-loop-pool-size: 16 # 时间循环池大小
  work-pool-size: 20   # 工作线程池大小

```