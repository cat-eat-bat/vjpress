---
outline: deep
---

# 防火墙

`slardar` 支持拦截一些可能造成攻击的危险请求，例如启用了`BlackPath`的过滤器后，则会对相应的请求path进行拦截并返回。

## 内置过滤器
内置了几个常见的过滤器，主要有:

### 请求 path 黑名单

### 请求头参数限制

### host 地址限制

## 自定义实现

除了使用内置的防火墙过滤器，当然也支持自定义实现，自定义实现需要实现接口 `SlardarFirewallHandler`, 且注册为  spring bean， 如：

```java
@Component
public class MyFirewallHandler implements SlardarFirewallHandler {

    /**
     * 执行校验
     *
     * @param request  请求对象
     * @param response 响应对象
     * @param context  上下文 用于在运行时获取bean等
     * @param params   预留扩展参数
     */
    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response, SlardarContext context, Object params) throws SlardarException {
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String parameterName = parameterNames.nextElement();
            if (parameterName.contains("xss")) {
                throw new SlardarException("参数key中包含敏感词!");
            }
        }
    }

    /**
     * 是否启用该 handler 默认true
     *
     * @return
     */
    @Override
    public boolean isEnabled() {
        // false : 不启用
        return true;
    }
}
```

启用后，一旦请求参数含有 `xss` 字符串，则返回错误信息:

```json
{
  "message": "参数中包含敏感词!",
  "code": 500
}
```
