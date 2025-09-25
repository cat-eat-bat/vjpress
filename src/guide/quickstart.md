---
outline: deep
---

# 快速开始
本章节以一个小型的`web`应用来快速开始。

::: info
:blush: 聪明如你，肯定已经掌握了 springboot 开发的基础知识.
:::

## 引入依赖

```xml
    <dependency>
        <groupId>cn.piesat.v</groupId>
        <artifactId>app-spring-boot-starter</artifactId>
        <version>1.3.0-SNAPSHOT</version>
    </dependency>
```

::: tip
:neutral_face: 目前尚未发布到 gradle
:::

## 编写入口类

```java{1}
@SpringBootApplication(scanBasePackages = "cn.piesat")
public class SampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }
}
```
设置 `scanBasePackages` 让spring能扫描到依赖包.

## 添加模型

::: code-group
```java [Person.java]
public class Person implements Serializable {

    private String id;

    private String name;

    private Integer age;

    private String address;

    private String slogan;

    private LocalDateTime now = LocalDateTime.now();
    // 省略 gettter & setter
}
```

```java [PersonRepository.java]
@Repository
public class PersonRepository {

    private static final List<Person> persons = ImmutableList.of(new Person()
                    .setAge(30)
                    .setId("1")
                    .setName("Jacky")
                    .setAddress("江苏省南京市雨花台区安德门大街23号")
                    .setSlogan("Even after many years, will it hurt to think of you? My love is not easy to say."),
            new Person()
                    .setAge(40)
                    .setId("2")
                    .setName("Black")
                    .setAddress("江苏省南京市栖霞区仙隐北路2-17号")
                    .setSlogan("I don't have the strength to stay away from you anymore."));


    public Person findOne(String id) throws Throwable {
        Optional<Person> optional = persons.stream().filter(person -> person.getId().equalsIgnoreCase(id)).findFirst();
        return optional.orElseThrow((Supplier<Throwable>) () -> new RuntimeException("Not Found"));
    }
}
```
:::

## 添加controller

```java{1}
@RespAdvice
@RestController
@RequestMapping("/demo/api/v1")
@Tag(name = "测试api")
public class DemoApiController {

    private final PersonRepository personRepository;

    public DemoApiController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Operation(summary = "演示get请求 返回 字符串")
    @GetMapping("/name/{id}")
    public String getName(@PathVariable String id) {
        return "User".concat(id);
    }

    @Operation(summary = "演示请求限流")
    @GetMapping(value = "/buy/ticket", produces = MediaType.APPLICATION_JSON_VALUE)
    @GuavaRateLimiter(2) // [!code highlight]
    public String ticket() {
        return "Your got it!";
    }

    @Operation(summary = "演示get请求 返回 POJO")
    @GetMapping("/persons/{id}")
    public Person getPerson(@PathVariable String id) {
        try {
            return personRepository.findOne(id);
        } catch (Throwable e) {
            throw new WebApiException(e);
        }
    }

    @Operation(summary = "演示异常返回")
    @GetMapping("/ex")
    public void ex() {
        throw new WebApiException("error..");
    }
}

```

## 添加配置

```yaml
server:
  port: 8000
```

> 其他配置项目前不需要

## 启动服务

start正常后，可以查看接口文档：`http://127.0.0.1:8000/doc.html`

至此，已经完成了一个简单的springboot web 应用 :tada:

## 说明
让我们看看这个应用里目前具备了哪些能力：

- `@RespAdvice` 会自动包裹返回对象以及进行全局异常处理，可以看到，我们在 `controller` 方法的返回类型，无需再使用类似 `Resp`类去包裹
- `@GuavaRateLimiter` 对接口进行限流，当达到设定的 `qps`(示例代码设定的是 `2`) ，会返回:
```json
{
  "code": 1006,
  "message": "超出访问频率，请求被限制"
}
```
- 开箱即用的 swagger 在线文档
- 内置web接口安全支持，`app-starter`做了一些安全上的考虑，包括 默认加载了禁用 `TRACE` 请求的过滤器,
内置了对敏感字段脱敏的处理
:::details
可以使用 `@Sensitive` 对希望脱敏的字段进行注解，类似于:
```java
public class Person implements Serializable {

    private String id;

    private String name;

    private Integer age;

    @Sensitive(type = SensitiveType.ADDRESS) // [!code focus]
    private String address;  // [!code focus]

    private String slogan;

    private LocalDateTime now = LocalDateTime.now();
    // 省略 gettter & setter
}
```
此时，返回该对象时，该字段会显示为:

```json
{
    "id": "1",
    "name": "Jacky",
    "age": 30,
    "address": "江苏省南京市************", // [!code focus]
    "slogan": "Even after many years, will it hurt to think of you? My love is not easy to say.",
    "now": "2024-11-21 13:11:29"
  }
```
:::

好了，你可以接着探索更多组件的用法.✨


