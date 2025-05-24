---
outline: deep
---

# SSO 单点登录

前后端分离模式下实现单点登录功能。

## 流程
假设有两个应用服务sso-client1、sso-client2，以及一个认证服务 sso-server，为方便起见，下述过程中分别简写为 SC1、SC2、SS。

- 客户端访问 `SC1` 首页，向 `SC1` 发起请求，验证当前是否已登录（登录状态是否有效）
- `SC1` 验证登录状态：通过web请求 `SS` 进行身份验证 ，如果有效，则返回用户信息结束
如果无效 则跳转到登录路由，在登录路由页面， 先请求 `SC1` 获取认证中心地址，（如 `/sso/auth`）`SC` 后台拼接地址返回，前端接受到地址，在回调里转向到该地址（eg： `http://xxx/sso/auth?redirectUrl=xxx.com?back=xxx.com`）
此时，`SS` 接受到认证请求，跳转到 `SS` 的默认登录页面(如: `/sso-login`)，进行登录后(此时`SS`的前端页面会缓存登录成功后的 `token`)，派发 `ticket` 并重定向到 上述的前端页面，前端页面加载时 判断 `ticket` 是否存在，若存在，则使用 `ticket` 值访问 `SC1` 接口，验证身份并拿到 `token` ，完成登录

- 在上述前提下，客户端访问 `SC2` 首页，`SC2` 服务端验证当前是否已登录，未登录，则跳转到 `SS` 的登录页， 此时由于已经有了 `token`， 则无需输入用户名密码，自动生成 `ticket`，跳转到 `SC2` 的回调地址, `SC2` 服务端拿到 `ticket`，调用 `SS` 接口验证 `ticket`并换取`token`，返回到`SC2`前端页面，`SC2`前端缓存`token`，后续接着访问其他业务接口

## SSO服务端
引入依赖

```xml
<dependency>
    <groupId>cn.piesat.v</groupId>
    <artifactId>slardar-sso-server-starter</artifactId>
    <version>1.2.0-SNAPSHOT</version>
</dependency>
```

其他和正常的 slardar 服务一样配置即可，默认的 sso 端点是 `/sso/*`，也可以通过配置来修改:

```yaml
slardar:
  sso:
    ctx-path: /my-sso # 修改为自定义的端点前缀
```

## SSO客户端
在sso客户端引入依赖:

```xml
<dependency>
    <groupId>cn.piesat.v</groupId>
    <artifactId>slardar-sso-client-starter</artifactId>
     <version>1.2.0-SNAPSHOT</version>
</dependency>
```
修改配置，指定 sso 服务端地址:

```yaml
slardar:
  sso:
    server-url: http://localhost:9600/my-sso
```


## 测试验证

模拟客户端服务的页面访问后跳转到 `http://localhost:9600/sso/auth?url=https://xxx.client.com`

![sso](/images/sso_login.png)

