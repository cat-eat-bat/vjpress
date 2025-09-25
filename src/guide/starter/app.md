---
outline: deep
---

# app-spring-boot-starter

用于开发web应用的 springboot starter，在 [快速开始](../quickstart) 中已经使用过它，下面来详细介绍它的一些特性和用法.

## 版本更新

### 1.3.0-SNAPSHOT

- 接口文档升级到 openapi3 规范，引入了 springdoc 等 配置项目有所改变 代码中的注解需要切换到 swagger v3

## 接口在线文档

组件内引入了开源的 `knife4j` 在线文档组件，所以服务启动后，可通过 `ip:port/doc.html` 访问在线文档，大概长这样：

![在线文档截图](/images/api_doc.png)

### 如何禁用

```yaml{3,5}
springdoc:
  swagger-ui:
    enabled: false
  api-docs:
    enabled: false
```
::: info
默认是启用的，无需设置
:::

### 如何添加安全认证

```yaml{3-5}
openapi:
  basic:
    enabled: true
    username: demo
    password: Demo@1234
```

::: tip
出于安全考虑，推荐所有线上服务都开启此配置
:::

### 定制展示信息

```yaml
openapi:
  info:
    title: Sample Api
    description: "**示例接口描述**"
    version: v1.0
    contact:
      name: alex
    license: GPL-3.0
    terms-of-service-url: https://stackoverflow.com/
```

 ### 排除指定接口或包

排除指定url：

 ```yaml
springdoc:
  paths-to-exclude: /test/**,/demo/v1/**
 ```
> 也可以在代码中使用注解隐藏某个接口 `@Operation(summary = "演示xxx", hidden = true)`

排除特定包：
```yaml
springdoc:
  packages-to-exclude: com.example.internal
```

> 如果是只想开启某些url 或 package 只需要把 `exclude` 换成 `match`


## 接口限流

内置了两个限流注解：
- `@GuavaRateLimiter` : guava 的限流实现
- `@SentinelRateLimiter` : sentinel 的限流实现

在需要限流的接口上添加注解:

```java
    @GetMapping(value = "/buy/ticket")
    @SentinelRateLimiter(100) // [!code focus]
    public String ticket() {
        return "Your got it!";
    }
```

## 数据脱敏

业务开发里常常有数据脱敏的场景，实现数据脱敏的方法很多，为了保证传输过程中数据的安全性，一般需要在接口返回层就完成脱敏。

组件提供了注解 `@Sensitive` 用于对敏感字段进行脱敏处理，使用：

```java
public class Person implements Serializable {
    private String name;

    @Sensitive(type = SensitiveType.ADDRESS) // [!code focus]
    private String address;                // [!code focus]  
}
```

其中，内置了常用数据类型的脱敏，如 密码(`PASSWORD`)、地址(`ADDRESS`), 中文名(`CHINESE_NAME`), 身份证号(`ID_CARD`), 手机号(`MOBILE`), 邮箱地址(`EMAIL`)
当然，也支持自定制正则和 mask 字符，如:

```java
public class Person implements Serializable {
    private String name;

    @Sensitive(type = SensitiveType.EMPTY, pattern = "(.{3})(.{6})(.{3})(.+)", group = {2, 4}, mask = "x") // [!code focus]
    private String address;                // [!code focus]  
}
```
返回数据长这样：

```json
{
    "id": "1",
    "name": "Jacky",
    "address": "江苏省xxxxxx区安德xxxxxx", // [!code highlight]
  }
```
## 时间字段格式化

采用 jackson 序列化数据时，默认对于 jdk8 的`Local`时间类型，不能很好的展示，现在可在配置文件中自定义返回的格式（扩展了  `spring.jackson` 配置项）

```yaml
#  自定义 jackson 返回的时间字段的格式
spring:
  jackson:
    custom:
      local-date-format: yy年MM月dd
      local-time-format: HH:mm
```

## 附

### swagger v3注解变化说明

| 功能维度                  | Swagger 2 注解（已过时）                                                             | Swagger 3 注解（OpenAPI 3）                                       | 迁移备注                                              |
| --------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| **控制器/分组**            | `@Api(tags = "xxx")`                                                          | `@Tag(name = "xxx", description = "xxx")`                     | 可重复打标签；一个控制器支持多个 `@Tag`                           |
| **接口方法**              | `@ApiOperation(value = "xxx")`                                                | `@Operation(summary = "xxx", description = "xxx")`            | 新加 `operationId`、`deprecated`、`security` 等属性      |
| **路径参数/查询参数**         | `@ApiParam(value = "xxx", required = true)`                                   | `@Parameter(description = "xxx", required = true)`            | 包路径也换了：`io.swagger.v3.oas.annotations.*`          |
| **隐式参数**（非 Spring 注解） | `@ApiImplicitParam`/`@ApiImplicitParams`                                      | 直接 `@Parameter` 放在 `@Operation` 内                             | 3.0 不再区分“隐式”                                      |
| **请求/响应体模型**          | `@ApiModel(description = "xxx")` 类级别<br>`@ApiModelProperty(notes = "xxx")` 字段 | `@Schema(description = "xxx")` 类＋字段通用                         | 一个注解搞定，支持 `example`、`requiredMode`、`accessMode` 等 |
| **响应码描述**             | `@ApiResponses({@ApiResponse(code = 200, message = "xxx")})`                  | `@ApiResponse(responseCode = "200", description = "xxx")`     | 字段名从 `code→responseCode`，`message→description`    |
| **忽略某接口**             | 在 `Docket` 里 `apis()/paths()` 过滤                                              | 同上，或直接在方法写 `@Hidden`                                          | 更细粒度                                              |
| **安全/授权**             | `@ApiOperation(authorizations = {@Authorization(value = "jwt")})`             | `@Operation(security = {@SecurityRequirement(name = "jwt")})` | 先通过 `OpenAPI` Bean 声明 SecurityScheme，再引用          |


好了，本章节就到这里，如果需要更多业务功能特性，可完善此文档添加.
