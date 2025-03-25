---
outline: deep
next: '数据库ORM | 介绍'
---

# 其他框架

长久以来， spring 体系在java后端开发中占据了重要的地位，spring生态功能丰富，但同时也存在资源消耗高、启动时间久、版本升级和兼容性等问题，在一些特定场景下，我们也可以考虑采用其他开发框架。

::: info
Springboot 3.x 可以打包成 native-image，可以减少启动时间与资源消耗，但需要 `JDK17+`，目前不在本文讨论范围之内。
:::

本章节主要介绍 `vertx` 和 `javalin` 框架。

## vertx

[Vert.x](https://vertx.io/docs/) 是一个基于 JVM 的异步、事件驱动的响应式应用平台。它为开发高性能、高并发、可伸缩的应用程序提供了一个灵活的框架，相较 spring 而言，Vert.x 非常轻量级且性能优异，适用于以下场景：

- **高性能 Web 应用**: Vert.x 可以构建高性能、高并发的 Web 应用程序，如 RESTful API、WebSocket 服务器等。
- **实时系统**: Vert.x 适用于构建实时系统，如聊天应用、游戏服务器等
- **微服务架构**: Vert.x 可以作为微服务架构的基础，构建分布式系统。
- **物联网应用**: Vert.x 可以用于构建物联网应用，处理大量的数据和设备。

### app-vertx-starter

`app-vertx-starter` 模块基于 Vert.x `4.x` 构建，添加了依赖注入、配置自动读取等功能，让开发者可以更专注于业务逻辑。

#### 1. 引入starter

```xml
<dependency>
    <groupId>cn.piesat.v</groupId>
    <artifactId>app-vertx-starter</artifactId>
    <version>1.1.0-SNAPSHOT</version>
</dependency>
```

#### 2. 创建 Application

```java{1}
@VertxBootApplication(basePackages = {"cn.piesat"})
public class VertxSampleApp {

    public static void main(String[] args) {
        VertxApplication.run(VertxSampleApp.class, true, args)
                .onComplete((evt) -> {
                    System.out.println(" app started.");
                });
    }
}
```

可以发现，经过 starter的封装，vertx 应用构建和 springboot很类似。

:::tip
从输出日志可以看出，vertx 应用启动很快，1s 之内
:::

#### 3. 编写业务代码
::: code-group
```java{1} [ZooConfig.java]
@VertxConfigurationProperties(prefix = "zoo")
public class ZooConfig {

    private String animal = "Monkey";

    /**
     * 启动的实例数
     */
    private int instances = 2;

    public int getInstances() {
        return instances;
    }

    public ZooConfig setInstances(int instances) {
        this.instances = instances;
        return this;
    }

    public String getAnimal() {
        return animal;
    }

    public ZooConfig setAnimal(String animal) {
        this.animal = animal;
        return this;
    }
}
```
```java [ZooService.java]
public interface ZooService {

    /**
     * .
     * @param name
     * @return
     */
    String sayHi(String name);
}
```

```java{1} [ZooServiceImpl.java]
@VertxComponent
public class ZooServiceImpl implements Serializable,  ZooService {

    private final ZooConfig config;

    @Inject
    public ZooServiceImpl(ZooConfig config) {
        this.config = config;
    }

    @Override
    public String sayHi(String name) {
        return String.format("Hello %s, Welcome to Vertx Zoo, Today is %s's day", name, config.getAnimal());
    }
}
```

```java{1,11} [ZooController.java]
@VertxRoute
public class ZooController extends AbstractVertxRoute {

    private final ZooService zooService;

    @Inject
    public ZooController(ZooService zooService) {
        this.zooService = zooService;
    }

    @VertxHttpRequest("/my")
    public String my() {
        return "alex".concat(String.valueOf(Math.random()));
    }

    @VertxHttpRequest(method = RequestMethod.GET, value = "/visit/:name")
    public String index(RoutingContext context) {
        return zooService.sayHi(param(context.request(), "name"));
    }

    @VertxHttpRequest("/json")
    public Map json() {
        HashMap<String, Object> map = MapUtil.of("foo", a);
        map.put("now", LocalDateTime.now());
        return map;
    }
}
```
:::

#### 4. 修改配置

```yaml
vertx:
  application:
    name: my-zoo-app
  server:
    port: 8765
    instances: 1
zoo:
  animal: Lion
```

#### 5. 启动测试

启动后 访问 `ip:8765/json` 测试

### 注解说明

#### @VertxBootApplication
标记入口类, 使用在应用启动类上。
参数
- basePackages: 扫描 vertx 组件的包路径，默认为当前包路径。
- enableProperties: 需要做自动注入的配置项对象类型，默认为空。

#### @VertxComponent

标记 vertx 自动注入组件，使用在类上，类似于 spring 的 @Component。

#### @VertxConfigurationProperties

标记一个 properties 配置类，可被自动注入管理

参数:
- prefix: 在yml配置文件中的前缀

#### @VertxRoute

标记一个 vertx 路由，使用在类上，类似于 spring 的 @Controller。
参数：
- value: 路由地址 默认 /
- blocking: 是否为阻塞模式，默认为 false

#### @VertxHttpRequest

标记一个 vertx 请求，使用在方法上，类似于 spring 的 @RequestMapping。
参数：
- value: 请求路径
- method: 请求方法，默认为 GET & POST
- blocking: 是否为阻塞模式，默认为 false



## javalin

[Javalin](https://javalin.io/archive/docs/v4.6.X.html) 是一个轻量级、简单且灵活的 Java Web 框架，基于 Jetty 服务器，请求处理速度快，内存占用低，代码简洁，学习成本低，支持ws等许多开箱即用的特性。
Javalin适合以下场景使用:
- RESTful API 开发： 接口开发速度快，路由定义清晰
- 原型开发和快速验证： 快速构建 Web 应用，开发周期短
- 微服务开发： 快速搭建轻量级服务，适合构建简单的 API 服务，低资源消耗

### app-javalin-starter


`app-javalin-starter` 模块基于 Javalin `4.x` 构建，集成了依赖自动注入、配置读取等功能，让开发者更专注于业务逻辑。

#### 1. 引入starter
```xml
<dependency>
    <groupId>cn.piesat.v</groupId>
    <artifactId>app-javalin-starter</artifactId>
    <version>1.1.0-SNAPSHOT</version>
</dependency>
```
#### 2. 创建 Application

```java{1}
@JavalinComponentScan("cn.piesat.v")
public class JavalinSampleApplication {

    public static void main(String[] args) {
        JavalinApplication.initialize(JavalinSampleApplication.class).run(args);
    }
}
```

#### 3. 编写业务代码

::: code-group
```java [Person.java]
@Data
@Accessors(chain = true)
public class Person {

    private String name;

    private Integer age;

    private String address;
    
}
```
```java{1} [PersonRepository.java]
@JavalinComponent
public class PersonRepository {

    public static final Map<String,Person> REPO = new HashMap<>(1);

    public boolean save(Person person) {
        REPO.computeIfAbsent(person.getName(), s -> REPO.put(s, person));
        return true;
    }

    public Collection<Person> findAll(){
        return REPO.values();
    }

    public Person findByName(String name) {
        return REPO.getOrDefault(name, new Person());
    }
}
```
```java{1,6} [SampleService.java]
@JavalinComponent
public class SampleService {

    private final PersonRepository personRepository;

    @Inject
    public SampleService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person save(Person person) {
        personRepository.save(person);
        return personRepository.findByName(person.getName());
    }

    public List<Person> list() {
       return new ArrayList<>(personRepository.findAll());
    }
}
```
```java{1} [SampleRestController.java]
@RequestController("/api/v1")
public class SampleRestController {

    private final SampleService sampleService;

    @Inject
    public SampleRestController(SampleService sampleService) {
        this.sampleService = sampleService;
    }

    @OpenApi(
            tags = "测试接口",
            summary = "保存",
            path = "/api/v1/persons",
            requestBody = @OpenApiRequestBody(content = @OpenApiContent(from = Person.class, type = ContentType.JSON), required = true),
            method = HttpMethod.POST)
    @RequestMapping(value = "/persons", method = HandlerType.POST)
    public Person savePerson(Context ctx) {
        return sampleService.save(ctx.bodyAsClass(Person.class));
    }

    @OpenApi(
            tags = "测试接口",
            summary = "列表",
            path = "/api/v1/persons",
            responses = {@OpenApiResponse(status = "200", content = @OpenApiContent(from = Resp.class, type = ContentType.JSON))},
            method = HttpMethod.GET)
    @RequestMapping(value = "/persons", method = HandlerType.GET)
    public List<Person> find(Context context) {
        return sampleService.list();
    }

}
```
:::

#### 4. 修改配置
```yaml {3}
javalin:
  server:
    port: 8088
  application:
    name: sample-javalin-main
  openapi:
    info:
      title: javalin示例应用API
      version: v1.0
      description: 描述xxxxxxx
      contact:
        name: Alex
        email: alexgis@yeah.net
    ignorePaths:
      - /routes
```

#### 5. 启动测试

启动 `JavalinSampleApplication`,看到输出日志 `Javalin started in 219ms \o/` 表示服务启动成功.

:::tip
启动时间可以看出，Javalin 真的很轻量级且快速，适合快速构建api接口类服务。
:::

### 注解说明

#### @JavalinComponentScan
使用在入口类上，表示扫描注入组件的包路径，默认为当前包路径。

#### @JavalinComponent

标记自动注入组件，使用在类上，类似于 spring 的 @Component。

#### @JavalinProperties

标记一个 properties 配置类，可被自动注入管理


#### @RequestController

标记一个web路由，使用在类上，类似于 spring 的 @Controller。

#### @RequestMapping

标记一个web请求，使用在方法上，类似于 spring 的 @RequestMapping。




