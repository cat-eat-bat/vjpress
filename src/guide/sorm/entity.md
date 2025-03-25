---
outline: deep
---
# 实体对象

和多数 orm 框架一样，sorm 中支持数据库表和实体对象之间的映射关系，且支持在应用启动时，根据java实体对象自动生成数据库表。

:::tip
需要在配置中正确配置实体类位置以及开启自动生成数据库表功能。
```yaml {3,5}
sorm:
  settings:
    ddl-auto: create_if_not_exist
    show-sql: true
    entity-packages: cn.piesat.v.sample.sorm.domain.entity
    dev-mode: true
```
:::

实体类长这样:

```java
@Data
@Accessors(chain = true)
@Table
public class Student extends Model<Student> {

    @Id(autoStrategy = IdAutoStrategy.snow_flake)
    private String id;

    private String name;

    private int age;

    private String address;

    private String email;

    private int deleted;

    @Column(definition = "text")
    @TypeHandler(JsonTextTypeHandler.class)
    private Map<String, Object> attributes;

    @Column(updatable = false)
    private LocalDateTime createAt;

    @Column(insertable = false)
    private LocalDateTime updateAt;

}

```

下面描述每个注解的用法

## @Table

标记实体类为数据库表，参数有：

| 参数            | 说明              | 默认值          |  
| -------------- | ---------------- | --------------- |
| name           |  定义数据库表名称   | 空，则自动根据类名生成数据库表名 |
| prefix         |  数据库表名前缀，在`name`未设置时生效 | 空  |
| ds             |  数据源名称 多数据源时有效    | 空 则指派到第一个数据源 |
| comment        |  数据库表注释    | 空  |
| uniques        |  设置表唯一性约束，`@TableUnique`注解定义唯一约束字段集和名称  |   空  |
| indexes        |  设置表索引，`@TableIndex`注解定义索引字段和名称  |   空  |


## @Column
标记实体类字段为数据库表字段，参数有：

> 默认不需要添加此注解，sorm 会根据字段类型自动生成数据库字段类型，但在一些需要对生成的字段更多控制的场景下，可以手动指定。

| 参数            | 说明              | 默认值          |
| -------------- | ---------------- | --------------- |
| definition     |  明确指定数据库表字段类型，如: `varchar(128)` `bigint(128)` `int unsigned`   | 空，则自动根据字段类型生成数据库字段类型 | 
| comment      |  数据库表字段注释  | 空  |
| unique     |  是否唯一  | false  |
| updatable     |  是否可更新  | true  |
| insertable     |  是否可插入  | true  |
| nullable     |  是否可空  | true  |
| fill     |  字段默认填充值 `@ColumnFill` 定义字段填充值  | 空  |
| json     |  是否定义为 json 类型 | false |

## @Id
标记实体类字段为数据库表主键，参数有：

| 参数            | 说明              | 默认值          |
| -------------- | ---------------- | --------------- |
| autoStrategy     |  主键自动生成策略 `auto_increment` 数据库自增, 字段类型必须是数值类型，- `snow_flake`： 雪花算法, 字段类型是 long 或 string， `none`： 需要每次手动设置主键值  | auto_increment |
| autoPrefix     |  自动id的前缀，使自动生成的id更有语义，如: 订单表设置id为 `order_10002`  | 空 |

## @TypeHandler

标记某个实体字段使用自定义类型处理器，参数有：
| 参数            | 说明              | 默认值          |
| -------------- | ---------------- | --------------- |
| value         |  类型处理器类名  | 空 |

如一个处理 pojo 类型的类型处理器：
::: code-group
```java [Attribute.java]
@Data
@Accessors(chain = true)
public class Attribute implements Serializable {

    private String phoneNumber;

    private String major;

    private String height;

    private String weight;

}
```

```java [AttributeTypeHandler.java]
public class AttributeTypeHandler implements FieldTypeHandler<Attribute> {
    /**
     * 从数据库结果获取实际 entity 字段值
     *
     * @param record
     * @param columnName
     * @return
     */
    @Override
    public Attribute getResult(Record record, String columnName) {
        return GsonUtil.fromJson(record.get(columnName), Attribute.class);
    }

    /**
     * 将 java 实体值正确地设置到数据库对象中
     *
     * @param record     数据库对象
     * @param columnName 数据库列名
     * @param parameter  实体参数
     */
    @Override
    public void setRecord(Record record, String columnName, Attribute parameter) {
        record.set(columnName, GsonUtil.toJsonString(parameter));
    }
}
```
:::

使用:

```java
@Table(ds = "default")
public class Student extends Model<Student> {

    @Id(autoStrategy = IdAutoStrategy.snow_flake)
    private String id;

    private String name;

    private int age;

    private String address;

    private String email;

    @Column(definition = "text") // [!code focus]
    @TypeHandler(AttributeTypeHandler.class) // [!code focus]
    private Attribute attributes;  // [!code focus]

} 
```


## @Transient

标记某个实体字段不作为数据库字段，不会被持久化。