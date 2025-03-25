---
outline: deep
---

# MFA

配置双因子认证的参数设置：

```yaml
slardar:
  mfa:
    enabled: true   # 是否开启 mfa 双因子认证 默认关闭
    otp-mode: email # otp 一次性密码的模式 默认是 email 如果是自定义实现 这里需要指定为自定义的 模式名称
    email:          # otp 模式的邮箱参数设置
      host: smtp.163.com
      port: 25
      username: who@163.com
      password: xxxxx
```