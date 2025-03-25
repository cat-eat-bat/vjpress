---
outline: deep
---

# RPC 组件

`srpc` Simple RPC 简单易用的 rpc 组件

## 特性

- 轻量级、用法简单
- 无框架依赖、可与其他框架集成
- tcp 协议，性能还不错
- 支持服务自动发现 (`nacos`)
- 支持 `token` 验证

## 快速使用

先搭建一个 api 模块，用于提供 rpc 接口定义

```xml
    <dependency>
        <groupId>cn.piesat.v</groupId>
        <artifactId>srpc</artifactId>
        <version>1.1.0-SNAPSHOT</version>
    </dependency>
```

::: code-group

```java [PersonService.java]
public interface PersonService {

    PersonDTO find(String name);

    String plus(String a, String b);
}
```

```java [PersonDTO.java]
@Data
@Accessors(chain = true)
@ToString
public class PersonDTO implements Serializable {

    private static final long serialVersionUID = 7702920534629457322L;

    private String name;

    private Integer age;

    private Map attributes;

}
```

:::

接着搭建服务端和客户端模块：

::: tip
为了演示方便，这里把服务端和客户端都放在一个工程里，实际场景里是分开的。
::::

引入 api 和一些必要依赖：

```xml
   <dependency>
       <groupId>cn.piesat.v</groupId>
       <artifactId>srpc-sample-api</artifactId>
       <version>1.1.0-SNAPSHOT</version>
   </dependency>
   <dependency>
       <groupId>ch.qos.logback</groupId>
       <artifactId>logback-classic</artifactId>
       <version>1.4.12</version>
   </dependency>
```

服务端实现:

::: code-group

```java{8,14} [RpcSampleProvider.java]
public class RpcSampleProvider {

    public static void main(String[] args) {
        RpcProviderFactory providerFactory = RpcProviderFactory.builder()
                .accessToken("whosyourdaddy")
                .corePoolSize(10)
                .maxPoolSize(64)
                .port(5555) // 服务监听 5555 端口
                .build();
        providerFactory.start(new AsyncResultHandler() {
            @Override
            public void complete(Object result) {
                System.out.println("rpc server 启动成功！");
                providerFactory.addService(PersonService.class.getName(), new PersonServiceImpl());
            }
            @Override
            public void failed(Throwable error) {
                System.err.println("rpc server 启动失败");
            }
        });
    }
}
```

```java [PersonServiceImpl.java]
public class PersonServiceImpl implements PersonService {
    @Override
    public PersonDTO find(String name) {
        return new PersonDTO().setAge(RandomUtil.randomInt(20,50)).setName(name);
    }

    @Override
    public String plus(String a, String b) {
        return String.format("%s %s %s", a, b, RandomUtil.randomInt(20,50));
    }
}
```
:::

客户端实现：
::: code-group
```java [RpcSampleConsumer.java]
public class RpcSampleConsumer {

    public static void main(String[] args) {
        RpcConsumerFactory consumerFactory = RpcConsumerFactory.builder()
                .address("127.0.0.1:5555")
                .accessToken("whosyourdaddy")
                .build();

        PersonService personService = consumerFactory.getObject(PersonService.class);
        int count = 40;
        for (int i = 0; i < count; i++) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.err.println(e.getLocalizedMessage());
            }
            PersonDTO person = personService.find(RandomUtil.randomString(4));
            if (!Objects.isNull(person)) {
                System.out.printf("num: %d, response: %s \n", i, person.toString());
            }
        }
    }
}

```
:::

分别启动 RpcSampleProvider 和 RpcSampleConsumer ，可以看到服务调用结果。

## 集成 springboot

### 使用
springboot中使用会更加方便，引入下面的依赖:

```xml
 <dependency>
     <groupId>cn.piesat.v</groupId>
     <artifactId>srpc-spring-boot-starter</artifactId>
     <version>1.1.0-SNAPSHOT</version>
 </dependency>
```

服务端实现:

```java {1}
@RpcProvider
public class PersonServiceImpl implements PersonService {
    @Override
    public PersonDTO find(String name) {
        return new PersonDTO().setAge(RandomUtil.randomInt(20,50)).setName(name);
    }

    @Override
    public String plus(String a, String b) {
        return String.format("%s %s %s", a, b, RandomUtil.randomInt(20,50));
    }
}
```

服务端配置：

```yaml
srpc:
  server:
    port: 5555
    access-token: YNKM45sMDafV
```

客户端调用：

```java {6-7}
@CrossOrigin
@RestController
@RequestMapping("/api")
public class IndexController {

    @RpcInject
    private PersonService personService;


    @GetMapping("/plus/{a}/{b}")
    public String getPlus(@PathVariable String a, @PathVariable String b) {
        return personService.plus(a, b);
    }

}
```

客户端配置:

```yaml
srpc:
  providers:
    - address: 127.0.0.1:5555
      access-token: YNKM45sMDafV  # 和服务端保持一致
      request-timeout: 600000
```

### 注解说明

#### @RpcProvider

注解某个 rpc 接口的实现类,以便在 spring 启动时，provideFactory 可以扫描并注册该类, 在 rpc 服务端使用

:::tip
该注解包含 `@Service` 注解
:::

#### @RpcInject

自动注入 rpc 的接口类并在 spring 容器内注册，在rpc客户端使用

:::tip
使用此接口, 无需使用 `@AutoWried`
:::


