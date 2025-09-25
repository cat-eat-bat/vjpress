---
outline: deep
---

# app-spring-boot-starter

## Openapi & doc

```yaml
# openapi(包含 knife4j 相关配置)
openapi:
  info:
    title: 'Sample Api'
    description: '**示例接口描述** 更多详细用法请参考具体配置项'
    terms-of-service: '服务条款：1.2.3.4... https://stackoverflow.com/'
    contact:
      name: 'Alex'
    version: '1.0.0'
  setting:
    language: zh_cn
    enable-version: true
  basic:
    enabled: true
    username: demo
    password: Demo@1234
  cors: true

# springdoc-openapi项目配置
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  api-docs:
    path: /v3/api-docs
    enabled: true
  paths-to-exclude: /mrc/** # 排除 也可以对单个接口采用 hidden = true
  packages-to-exclude: com.example.internal
```


## Jackson

```yaml
#  自定义 jackson 返回的时间字段的格式
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
    custom:
      local-date-format: YY年MM月dd日
      local-time-format: HH:mm:ss
```
