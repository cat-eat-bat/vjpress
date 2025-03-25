---
outline: deep
---

# Login

```yaml
slardar:
  login:
    post-only: false      #登录接口只支持 post方式访问 默认 true
    captcha-enabled: false # 是否开启验证码验证 默认true
    encrypt:
      enabled: true    #是否开始登录密码加密 默认 false
      mode: sm4        #加解密实现 默认 AES
    max-attempts-before-locked: 3 # 登录最大尝试次数 默认 5
    failed-lock-duration: 2m   # 登录失败锁定时间 默认 1m
    login-success-code: 200   # 定制登录成功返回的code 默认是 0 
    url: /auth/login     # 登录接口url 默认 /login
    result-handler-type: custom # 认证结果处理器名称 默认是 default (内置默认处理）
    concurrent-policy: share   # 是否同端互斥 可选： 1. separate（默认，不互斥，每次都生成一个新token） 2. share（不互斥，共享同一个token） 3. mutex（同端互斥 即相同账户只能在一个 同端页面中有效登录）
```