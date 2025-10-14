---
outline: deep
---

# Micro Rest Client

`mrc` : 支持微服务应用的 restful 客户端.

## 特性

- 支持服务自动发现（`nacos`）
- 支持拦截器 全局/单个
- 支持限流、重试、熔断
- 底层基于 `Okhttp`, 性能还行

## 用法

### 1. 引入依赖

```xml
    <dependency>
        <groupId>org.winterfell</groupId>
        <artifactId>mrc</artifactId>
        <version>1.1.2-SNAPSHOT</version>
    </dependency>
```

### 2. 编写 client

```java
@MrClient(name = "users-client", url = "https://jsonplaceholder.typicode.com/")
public interface UsersClient {

    @GET("users/{id}")
    Map getUser(@Path("id") String id);
}
```

::: tip 说明

> 注 1: ` @GET("users/{id}")` 中 `/` 开头表示从根路径开始,否则表示从当前路径开始

> 注 2： 自动服务发现基于 `nacos`, 根据配置的`name`属性去注册中心中找到对应的可用服务地址，此时会忽略 `url` 的配置信息

> 注 3： 支持 `https` 协议
> 
:::

### 3. 添加注解扫描

```java
@EnableMrClients(basePackages = {"cn.piesat.v.samples.clients"})
public class SampleApp {

    public static void main(String[] args) {
        SpringApplication.run(SampleApp.class, args);
    }
}
```

> 包名是 client 接口所在位置, 该注解也支持指定 client，参数: `clients`

### 4. 测试调用

```java
    @Resource
    UsersClient usersClient;

    @ApiOperation(value = "演示Mrc 返回 User结构体(来自web)", tags = "Mrc Api")
    @GetMapping("/users/{id}")
    public Map getSomeOne(@PathVariable String id) {
        try {
            return usersClient.getUser(id);
        } catch (Throwable e) {
            throw new WebApiException(e);
        }
    }
```

### 5. 更多用法

#### 连接参数定制

```java {10-14}
@Configuration
@AutoConfigureBefore(MrClientAutoConfiguration.class)
public class MrClientCustomConfig implements  MrClientConfigBuilderCustomizer {

    private static final Logger logger = LoggerFactory.getLogger(MrClientConfig.class);

    @Override
    public void customize(OkHttpClient.Builder builder) {
        logger.info("[mr-client] customize builder...");
        // 设置连接超时、连接池等参数
        builder.connectTimeout(3, TimeUnit.SECONDS)
                .readTimeout(5, TimeUnit.SECONDS)
                .followRedirects(true)
                .connectionPool(new ConnectionPool(20, 10, TimeUnit.SECONDS));
    }
}
```

#### 拦截器

`mrc` 支持全局拦截器和单个client的拦截器，下面分别说明

##### 全局拦截器

```java
@Configuration
public class MyMrcConfig implements MrClientInterceptorConfigurer {
    /**
     * defined interceptor
     *
     * @return
     */
    @Override
    public Interceptor config() {
        return new Interceptor() {
            @NotNull
            @Override
            public Response intercept(@NotNull Chain chain) throws IOException {
                // 为每个请求添加一个请求头
                return chain.proceed(chain.request().newBuilder().addHeader("X-name", "Snow").build());
            }
        };
    }
}
```

##### client拦截器
可以为单个 client 设置拦截器，从而可以进行请求参数处理等

::: code-group
```java [TodosClientInterceptor.java]
public class TodosClientInterceptor implements MrcInterceptor {
    @Override
    public boolean shouldSkip() {
        return false;
    }

    @Override
    public Interceptor nativeInterceptor() {
        return new Interceptor() {
            @Override
            public Response intercept(Chain chain) throws IOException {
                System.out.println("我是client级别的拦截器！");
                return chain.proceed(chain.request());
            }
        };
    }
}
```

```java [TodosClient.java]
@MrClient(name = "todo-client", url = "https://jsonplaceholder.typicode.com/",
        interceptor = TodosClientInterceptor.class) // [!code ++]
public interface TodosClient {

    @GET("todos/{id}")
     Map todos(@Path("id") String id);
}
```
:::


#### 限流、熔断、重试
支持对 client的请求配置重试、熔断等特性

##### 重试

```java
@MrClient(name = "users-client", url = "https://jsonplaceholder.typicode.com/",
        retry = @MrClientRetryParam(enabled = true, maxAttempts = 5, waitDurationInSeconds=2)) // [!code ++]
public interface UsersClient {

    @GET("users/{id}")
    Map getUser(@Path("id") String id);
}

```
参数说明:
- enabled: 是否启用重试
- maxAttempts: 最大重试次数
- waitDurationInSeconds: 重试间隔时间

##### 熔断
```java
@MrClient(name = "users-client", url = "https://jsonplaceholder.typicode.com/",
        circuitBreaker = @MrClientCircuitBreakerParam(enabled = true, failureRateThreshold=60, permittedNumberOfCallsInHalfOpenState = 5, waitDurationInOpenStateSeconds = 10)) // [!code ++]
public interface UsersClient {

    @GET("users/{id}")
    Map getUser(@Path("id") String id);
}
```
参数说明:
- enabled: 是否启用熔断
- failureRateThreshold: 熔断触发的失败率百分比
- permittedNumberOfCallsInHalfOpenState: 半开状态允许的最大调用次数
- waitDurationInOpenStateSeconds: 熔断打开状态的等待时间

##### 限流

> WIP
