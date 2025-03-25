---
outline: deep
---

# Token
主要配置token的生成策略以及jwt的相关参数设置

```yaml
slardar:
  token:
    type: jwt  # 默认 jwt 如果是自定义token策略 这里需要指定为自定义的name
    jwt:
      sign-key: xxx # 签名的key  
      expiration: 3*60*60 # 过期时间 默认 1天 单位是 秒
    key: MyAuth # 请求头的 key 默认是Authorization
    separator: _MY_ # 生成的 token 中的分隔符 默认是 _
```