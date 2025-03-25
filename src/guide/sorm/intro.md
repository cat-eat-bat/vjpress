---
outline: deep
---

# 介绍

**SORM** 是一个轻量、简单易用的关系型数据库 ORM。当你厌烦了 Mybatis(plus) 的 xml 写法以及 JPA 的复杂配置时，你可以试试 SORM。



## 特性

- 多种数据库类型支持
- 多数据源支持
- 支持数据源配置加密
- 支持运行时数据库表自动生成(DDL)
- 支持数据表字段自动生成(DML)
- 支持 `springboot 2.x`、`javalin` 等框架集成
- 为 `postgis` 提供封装支持
- 内置支持多种连接池(`hikari`/`druid`， 可在配置中切换，默认 `hikari`)

## 数据库支持

- Mysql v5.7+
- H2数据库
- PostgresSQL（postgis）
- 达梦数据库(`v8`)
- 人大金仓

## 框架支持

- 支持 SpringBoot 2.x
- 支持 Javalin 4.x
- 支持 postgis 3.x

## 开始使用

本章节将介绍如何使用 `SORM`, 利用 [快速开始](../quickstart) 中搭建的 springboot web 项目为例，演示如何将 sorm 集成。

### 1. 引入依赖

```xml
       <dependency>
            <groupId>cn.piesat.v</groupId>
            <artifactId>app-spring-boot-starter</artifactId>
            <version>1.1.0-SNAPSHOT</version>
        </dependency>

       <dependency>
            <groupId>cn.piesat.v</groupId>
            <artifactId>sorm-spring-boot-starter</artifactId>
            <version>1.5.2-SNAPSHOT</version>
        </dependency>
        <!-- h2 数据库驱动 -->
       
       <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.2.220</version>
        </dependency>

```

### 2. 配置数据库连接信息
在 `application.yml` 中配置数据库连接信息：

```yaml 
server:  
  port: 8000
spring:
  application:
    name: sorm-sample
  profiles:
    active: local
  h2:
    console:
      enabled: true
swagger:
  title: Sorm 示例应用
  description: 示例应用描述
  version: 1.0

sorm:     // [!code focus]
  data-sources: // [!code focus]
    default:  // [!code focus]
      url: jdbc:h2:~/Data/swap/demo;AUTO_SERVER=true;CASE_INSENSITIVE_IDENTIFIERS=TRUE // [!code focus]
      username: sa  // [!code focus]
      password:  // [!code focus]
      driver-class-name: org.h2.Driver  // [!code focus]
  settings:  // [!code focus] 
    ddl-auto: create_if_not_exist  // [!code focus]
    show-sql: true   // [!code focus]
    entity-packages: cn.piesat.v.sample.sorm.domain.entity  // [!code focus]
    dev-mode: true  // [!code focus]

```

### 3. 创建实体类

::: code-group 
```java{3} [Student.java]
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
```java [JsonTextTypeHandler.java]
// 用于在 h2 数据库中转换 map 格式字段
public class JsonTextTypeHandler implements FieldTypeHandler<Map<String,?>> {

    Gson gson = new GsonBuilder()
            .enableComplexMapKeySerialization()
            .serializeNulls()
            .setPrettyPrinting()
            .setVersion(1.0)
            .create();

    /**
     * 从数据库结果获取实际 entity 字段值
     * eg： PGgeometry --> geojson
     *
     * @param record
     * @param columnName
     * @return
     */
    @Override
    public Map<String,?> getResult(Record record, String columnName) {
        return gson.fromJson(record.getStr(columnName), Map.class);
    }

    /**
     * 将 java 实体值正确地设置到数据库对象中
     *
     * @param record     数据库对象
     * @param columnName 数据库列名
     * @param parameter  实体参数
     */
    @Override
    public void setRecord(Record record, String columnName, Map<String,?> parameter) {
        record.set(columnName, Objects.isNull(parameter) ? "{}" : gson.toJson(parameter));
    }

}
```
:::

### 4. 编写 dao & service & controller
::: code-group
```java [StudentDao.java]
@Dao
public interface StudentDao extends BaseDao<Student, String> {
    
    /**
     * 根据名字查询实体
     */
    @Select("select * from student where name like concat('%', #para(name), '%')")
    List<Student> findByName(@Param("name") String name);
}
```

```java [StudentService.java]
@Service
public class StudentService {

    @Resource
    private StudentDao studentDao;

    public List<Student> queryByName(String name) {
        return studentDao.findByName(name);
    }

    public Student createOne(StudentAddCmd cmd) {
        Student student = new Student()
                .setName(cmd.getName())
                .setAge(cmd.getAge())
                .setAddress(cmd.getAddress())
                .setDeleted(0)
                .setEmail(cmd.getEmail())
                .setAttributes(cmd.getAttributes());
        boolean saved = studentDao.save(student);
        return saved ? student : null;
    }

    public Page<Student> queryPage(StudentQuery query) {
        return studentDao.queryForPage(query);
    }
}
```
```java [StudentQuery.java]
public class StudentQuery extends AbstractPageableAndSortableQuery {


    /**
     * 模糊匹配name
     */
    @CqeField(queryType = QueryType.like)
    private String name;

    /**
     * 范围查询
     */
    @CqeField(queryType = QueryType.range)
    private AgeRange age;

    /**
     * 默认的排序方式
     *
     * @return
     */
    @Override
    public String defaultOrderBy() {
        return "create_at:desc";
    }

    public String getName() {
        return name;
    }

    public StudentQuery setName(String name) {
        this.name = name;
        return this;
    }

    public AgeRange getAge() {
        return age;
    }

    public StudentQuery setAge(AgeRange age) {
        this.age = age;
        return this;
    }

    public static class AgeRange implements Range<Integer> {

        private Integer lower;

        private Integer upper;

        public AgeRange() {
        }

        @Override
        public Integer getLower() {
            return lower;
        }

        @Override
        public Integer getUpper() {
            return upper;
        }
    }
}

```

```java [ApiController.java]
@Api
@RestController
@RespAdvice
@RequestMapping("/api/v1/students")
public class ApiController {

    private final StudentService studentService;

    public ApiController(StudentService studentService) {
        this.studentService = studentService;
    }

    @ApiOperation("新增")
    @PostMapping("")
    public Student add(@RequestBody StudentAddCmd cmd) {
        return  studentService.createOne(cmd);
    }

    @ApiOperation("分页查询")
    @PostMapping("/query")
    public Page<Student> pageQuery(@RequestBody StudentQuery query) {
        return studentService.queryPage(query);
    }

}
```
:::

### 5. 修改入口类
```java
@SpringBootApplication(scanBasePackages = "cn.piesat")
@DaoScan("cn.piesat.v.sample.sorm.dao") // 这里配置dao扫描的位置 // [!code focus]
public class SormSampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SormSampleApplication.class, args);
    }
}
```


### 6. 启动项目

启动成功后，访问 `http://127.0.0.1:8000/doc.html` 查看接口文档

新建实体：

![创建实体](/images/sorm_demo_add.png)

分页查询:

![分页查询](/images/sorm_demo_page.png)


