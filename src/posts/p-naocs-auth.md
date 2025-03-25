---
title: Nacos 开启鉴权配置
date: 2025-03-18
tags: ["nacos", "微服务"]
outline: deep
---

# Nacos 开启鉴权配置

<PostMeta />
## 前言

- 2.2.2版本之前的Nacos默认控制台，无论服务端是否开启鉴权，都会存在一个登录页，这就导致很多用户被误导认为Nacos默认是存在鉴权的。
- Nacos自2.2.2版本开始，在未开启鉴权时，默认控制台将不需要登录即可访问，同时在控制台中给予提示，提醒用户当前集群未开启鉴权，在用户开启鉴权后，控制台才需要进行登录访问
- 开启鉴权功能之后，访问Nacos服务端API和控制台都需要输入用户名和密码（默认的用户名和密码都是nacos，可以登录控制台进行修改密码），可以提高Nacos的安全性，如果客户端（其它服务或者控制台用户）无法提供正确的用户名和密码，将无法访问Nacos Server，这样可以防止服务端被非授权访问，所以对于生产环境中的Nacos Server推荐设置为true
- 如果Nacos禁用鉴权功能，此时访问Nacos服务端API和控制台不需要任何登录即可匿名访问， **不推荐！！**

> 说明参考： https://nacos.io/docs/latest/manual/admin/auth/

## 修改配置
主要是修改 conf/application.properties 文件的相关内容：

1. 开启鉴权功能

```properties
nacos.core.auth.enabled=true
# 关闭使用user-agent判断服务端请求并放行鉴权的功能
nacos.core.auth.enable.userAgentAuthWhite=false
```

2. 自定义生成JWT令牌的密钥
```properties
### The default token (Base64 String):
nacos.core.auth.plugin.nacos.token.secret.key=d2hvc3lvdXJkYWRkeXF3ZXJ0eXVpb3Bhc2RmZ2hqa2x6eA==
```
> [!IMPORTANT]
> 注意这里的密钥需要是长度32位以上的并且用Base64编码后的字符串

3. 配置自定义身份识别的key和value
```
nacos.core.auth.server.identity.key=authKey
nacos.core.auth.server.identity.value=nacos
```


## 初始化管理员账号

当Nacos集群开启鉴权后访问Nacos控制台时，会校验是否已经初始化过管理员用户nacos的密码，若发现未初始化密码时，则会跳转至初始化密码的页面进行初始化。在该页面密码文本框内输入自定义密码，然后点击提交即可；

> [!IMPORTANT]
> 注意：若密码文本框内未输入自定义密码或输入空白密码，Nacos将会生成随机密码，请保存好生成的随机密码。

初始化成功后会弹窗提示初始化成功，并展示指定的密码或随机生成的密码，请保存好此密码。

## 客户端配置

在开启鉴权后，客户端连接nacos也需要提供用户信息
示例代码：
```java
try {
    // Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
  String serverAddr = "{serverAddr}";
  Properties properties = new Properties();
  properties.put("serverAddr", serverAddr);

    // if need username and password to login
        properties.put("username","${username}");
        properties.put("password","${password}");

  ConfigService configService = NacosFactory.createConfigService(properties);
  NamingService configService = NacosFactory.createNamingService(properties);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

如果是openapi的方式，则需要先进行login， 获取到认证的token，再调用接口信息

```shell
curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
```
拿到token后进行调用：
```shell
curl -X GET '127.0.0.1:8848/nacos/v2/cs/config?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&dataId=nacos.example.1&group=nacos_group'
```

<PostNav />