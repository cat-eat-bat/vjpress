---
outline: deep
---

# 其他配置

## Basic Auth
配置Basic Auth开启以及哪些url经过此验证
```yaml
slardar:
  basic:
    enable: true  # 是否开启 basic 认证
    # 配置哪些地址通过 basic auth 方式认证
    filter-urls: /api/name/**
```

## Api Signature
配置 Api 签名功能开启以及哪些url经过验签
```yaml
  signature:
    enable: true # 是否开启 api 签名认证 默认关闭
    filter-urls: /api/open/**
    header-key-prefix: 'Xk-' # 请求头 key 的前缀 可以避免和其他重复 默认 X-
```