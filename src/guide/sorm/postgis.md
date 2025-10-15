---
outline: deep
---

# 空间数据支持

sorm 对 postgis 做了一定的封装支持，使其在业务中更便捷使用。

## 引入依赖

```xml
 <dependency>
     <groupId>org.winterfell</groupId>
     <artifactId>sorm-postgis</artifactId>
     <version>1.7.0-SNAPSHOT</version>
 </dependency>
```

## 创建实体类

```java {3,4,12-14}
@Data
@Accessors(chain = true)
@Table(ds = "postgis")
@EnableSpatialIndex(method = IndexMethods.GIST)
public class MyPoint extends Model<MyPoint> {

    @Id(autoStrategy = IdAutoStrategy.auto_increment)
    private Integer id;

    private String name;

    @GeometryColumn(type = GeometrySubTypes.POINT, srid = 4326)
    @TypeHandler(PointTypeHandler.class)
    private Point geom;

}
```

## 注入 bean

```java
    @Bean
    public PgTemplate pgTemplate() {
        return new PgTemplate("postgis");
    }
```

## 代码使用示例

```java
    @Resource
    private PgTemplate pgTemplate;


    /**
     * 创建空间表
     */
    @Test
    void testCreateTable() throws PgTableException {
        boolean b = pgTemplate.createGeoTable("my_polygon",
                Lists.newArrayList(new SqlTableColumn()
                        .setField("name")
                        .setNullable(false)
                        .setSqlType("varchar")), 
                    GeometrySubTypes.POLYGON, 4326);
    }
```

## 方法说明
`sorm-postgis` 包目前提供了以下类和方法，满足日常的空间数据操作。

### @GeometryColumn

标记实体类属性为空间字段，并指定空间字段类型等属性。

:::warning
该注解标记的字段默认不可为`null`
:::

- type: geometry 类型, OGC 标准geometry类型
- srid: 空间参考系统id


### @EnableSpatialIndex

为该数据表创建指定的空间索引。

- method: 索引方法，目前支持 `GIST`（默认）、`BRIN`、 `SPGIST` 


### PgTemplate
封装了操作pg数据库以及postgis的常用方法：

- **queryForList**: 查询列表
- **queryForObject**：查询并转换为对象
- **queryForMap**： 查询并转换为 Map
- **queryForPage**： 分页查询
- **executeSql**： 执行sql 返回影响行数
- **createGeoTable**： 创建空间表
- **tableExists**： 检测表是否存在



### PgGeometryUtil

提供了常用空间数据操作方法，如：

- **toWkt**： 将数据库的 geometry转为 WKT 格式
- **fromWkt**： 将 WKT 格式转为 geometry
- **toGeoJson**： 将数据库的 geometry转为 GeoJson 格式
- **fromGeoJson**： 将 GeoJson 格式转为 geometry
- **wkt2ogc**: 将 WKT 格式转为 OGC geometry格式
- **geojson3ogc**: 将 GeoJson 格式转为 OGC geometry格式

