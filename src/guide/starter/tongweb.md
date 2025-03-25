---
outline: deep
---

# 适配东方通

信创项目里，很多时候要求使用`Tongweb`作为 web 服务的容器，下面讲述如何适配东方通的 web 容器。

::: tip
下面的改造针对东方通企业版
:::

## 代码改造

改造入口类，继承 `SpringBootServletInitializer`

```java{8-13}
@SpringBootApplication(scanBasePackages = "cn.piesat")
public class SampleTongwebApplication extends SpringBootServletInitializer {

    /**
     *  这里表示使用外部的tomcat容器
     * @param builder
     * @return
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        // 注意这里要指向原先用main方法执行的启动类
        return builder.sources(SampleTongwebApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(SampleTongwebApplication.class, args);
    }
}
```

## 打包方式

采用 springboot maven plugin 打包为 war 包：

```xml{11-27}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <artifactId>tong-web-app-sample</artifactId>
    <description>TongWeb App Starter</description>

    <packaging>war</packaging>
     <build>
         <plugins>
             <plugin>
                 <groupId>org.apache.maven.plugins</groupId>
                 <artifactId>maven-war-plugin</artifactId>
                 <version>3.0.0</version>
                 <configuration>
                     <failOnMissingWebXml>false</failOnMissingWebXml>
                 </configuration>
             </plugin>
             <plugin>
                 <groupId>org.springframework.boot</groupId>
                 <artifactId>spring-boot-maven-plugin</artifactId>
             </plugin>
         </plugins>
     </build>
</project>

```

## 部署应用

1. 打开东方通 console： `ip:9060/console`

2. 部署：
   
   ![部署图](https://nync.piesat.cn/oss/images/tongweb_deploy.png)
