---
outline: deep
---

# 多数据源

sorm 对多数据源提供了内置支持，无需额外添加插件，默认即可拥有多数据源能力。

## 添加数据源配置

```yaml
sorm:
  data-sources:
    #  默认的 h2 数据源
    default:
      url: jdbc:h2:/Users/alex/Data/swap/demo;AUTO_SERVER=true;CASE_INSENSITIVE_IDENTIFIERS=TRUE
      username: sa
      password:
      driver-class-name: org.h2.Driver
    # pg 数据源   // [!code ++]
    postgis:             // [!code ++]                                                     
      url: jdbc:postgresql://1.119.169.94:10039/postgres?currentSchema=public // [!code ++]
      username: postgres  // [!code ++]
      password: xxxxxxxxx  // [!code ++]
      driver-class-name: org.postgresql.Driver  // [!code ++]
  settings:
    ddl-auto: create_if_not_exist
    show-sql: true
    entity-packages: cn.piesat.v.sample.sorm.domain.entity
    dev-mode: true
```

## 修改实体类

::: code-group
```java [Student.java]
@Data
@Accessors(chain = true)
@Table(ds = "default") // [!code ++]
public class Student extends Model<Student> {

    @Id(autoStrategy = IdAutoStrategy.snow_flake)
    private String id;

    private String name;

    private int age;

}
```
```java [MyPoint.java]
@Data
@Accessors(chain = true)
@Table(ds = "postgis")   // [!code ++]
@EnableSpatialIndex(method = IndexMethods.GIST)  // [!code ++]
public class MyPoint extends Model<MyPoint> {

    @Id(autoStrategy = IdAutoStrategy.auto_increment)
    private Integer id;

    private String name;

    @GeometryColumn(type = GeometrySubTypes.POINT, srid = 4326)
    @TypeHandler(PointTypeHandler.class)
    private Point geom;

}
```
:::

`Student` 实体类使用默认的数据源，`MyPoint` 使用数据源 postgis，dao 操作时，会根据实体类上的 `@Table` 注解，自动选择对应的数据源。

:::tip
`PgTemplate` 需要手动指定其数据源:
```java {3}
    @Bean
    public PgTemplate pgTemplate() {
        return new PgTemplate("postgis");
    }
``
:::


