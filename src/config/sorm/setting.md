---
outline: deep
---

# settings

```yaml
sorm:
  settings:
    encrypt: 
        enabled: true  # 开启连接参数加密
        scopes: password #  指定 jdbc 参数加密范围，支持： url, username，用户名加密 password（默认）密码加密
    ddl-auto: create_if_not_exist # ddl 模式 create_always： 存在时 会先 drop none: 不做操作
    show-sql: true  # 在日志里输出 sql 语句
    entity-packages: cn.piesat.v.sample.sorm.domain.entity
    dev-mode: true  # 开发模式 生产环境不建议开启 
```