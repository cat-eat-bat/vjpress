---
outline: deep
---

# Sso

## Client

```yaml
slardar:
  sso:
    server-url: http://localhost:9600/sso # 指定sso服务端的地址
    ctx-path: /sso                        # 提供给sso client前端访问的端点的上下文路径 默认是 /sso
    ignores: /open/**                     # 忽略哪些接口url 即不需要经过sso验证
```

## Server

```yaml
slardar:
  sso:
    ctx-path: /sso   # sso server 端点的上下文路径 默认 /sso
    ticket:          # 传给sso client的票据的设置
      length: 6   # 票据的长度 默认12位随机数
      ttl: 30s    # 票据有效期 默认是 60s
```


