---
outline: deep
---

# datasources

```yaml
sorm:
  data-sources:
    #  默认数据源
    default:
      url: jdbc:h2:/Users/alex/Data/swap/demo;AUTO_SERVER=true;CASE_INSENSITIVE_IDENTIFIERS=TRUE
      username: sa
      password:
      driver-class-name: org.h2.Driver
      druid:
        enabled: true
        log-abandoned: true
        max-active: 20
    # pg 数据源
    postgis:
      url: jdbc:postgresql://1.10.22.200/postgres?currentSchema=public
      username: postgres
      password: xxxxxxx
      driver-class-name: org.postgresql.Driver
      druid:
        enabled: true
```