---
outline: deep
---

# mrc

```yaml
mrc:
  show-url: true  # 在日志里输出调用的url
  rate-limiter:   # 限流开启以及参数设置
    enabled: true
    timeout-duration: 10s
  retry:
    enabled: true  # 重试开启以及参数设置
    max-attempts: 5
    wait-duration: 10s
  circuit-breaker:  # 熔断开启以及参数设置
    enabled: true
    failure-rate-threshold: 50

```