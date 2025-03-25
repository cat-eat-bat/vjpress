---
outline: deep
---

# srpc
rpc 组件的配置主要分为 客户端 和 服务端 的配置：

## client

```yaml
srpc:
  providers:  # rpc 服务提供者 
    - address: 127.0.0.1:5555       # rpc 服务地址
      access-token: YNKM45sMDafV    # 访问 token
      request-timeout: 600000       # 请求超时时间
  nacos-server-addr: 127.0.0.1:8088 #  nacos 注册中心地址; 用于 rpc 服务的自动发现 若配置此参数，则 providers 配置失效
```
## server

```yaml
srpc:
  server:
    port: 5555   # rpc 服务监听的 socket 端口
    access-token: YNKM45sMDafV # 访问 token 客户端需配置一致
    core-pool-size: 4
    max-pool-size: 16
```