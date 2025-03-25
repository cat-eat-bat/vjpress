---
outline: deep
---

# app-spring-boot-starter

## Swagger

```yaml
swagger:
  enabled: false   # 默认开启
  title: Sample Api
  description: "**示例接口描述**"
  version: v1.0
  contact-name: alex
  license: GPL-3.0
  terms-of-service-url: https://stackoverflow.com/
  authorization:
    auth-regex: '.*/(admin)/.*'  # 配置哪些请求需要验证权限

knife4j:
  basic:   # 为 doc.html 增加basic auth
    enable: true
    username: demo
    password: xxxx
```


## Jackson

```yaml
#  自定义 jackson 返回的时间字段的格式
jackson:
  date-time-format: yyyy-MM-dd HH:mm:ss.SSS
  local-date-format: yyyy年MM月dd
  local-time-format: HH:mm
```