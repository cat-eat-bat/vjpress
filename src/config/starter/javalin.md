---
outline: deep
---

# app-javalin-starter

```yaml
javalin:
  server:
    host: locaohost  # 指定server host
    port: 8088       # 指定server端口
  application:
    name: sample-javalin-main # 指定应用名称
  openapi:     # openapi 配置
    info:
      title: javalin示例应用API
      version: v1.0
      description: 描述xxxxxxx
      contact:
        name: Alex
        email: alexgis@yeah.net
    ignorePaths:  # 忽略的请求路由path
      - /routes
```