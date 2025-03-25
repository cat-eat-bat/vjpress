---
title: ParadeDB 入门-1
date: 2025-02-24
tags: ["postgres","paradedb"]
outline: deep
---

# ParadeDB 入门-1

<PostMeta />

[ParadeDB](https://www.paradedb.com/) 是基于 Postgres 构建的现代 Elasticsearch 替代方案。专为实时、更新繁重的工作负载而构建。
有了它，不需要考虑复杂的数据同步工作，由于是 pg 扩展实现，所以具备pg数据库的事务等特性，用法也是通过 sql 语句就可以实现全文检索、聚合统计等es中的功能。

> 注： 目前该扩展仍在开发中，可在一些小型项目中进行尝试，另外，社区版目前无法支持集群化部署，但是否可以通过 Citus 来构建分布式环境，还需要进行验证。

## 安装
支持多种安装方式，最方便的还是docker安装：

选择`pg15`版本的镜像:
```shell
docker pull paradedb/paradedb:latest-pg15
```
运行容器：
```shell
docker run \
  --name paradedb \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydatabase \
  -v paradedb_data:/var/lib/postgresql/data/ \
  -p 5432:5432 \
  -d \
  paradedb/paradedb:latest-pg15
```

## 测试
ParadeDB 附带一个数据库存储过程，该过程会创建一个填充了模拟数据的表，以帮助测试入门。与 psql 连接后，运行以下命令以创建并检查此表。

```sql
CALL paradedb.create_bm25_test_table(
  schema_name => 'public',
  table_name => 'mock_items'
);

SELECT description, rating, category
FROM mock_items
LIMIT 3;
```

建立字段搜索需要的索引

```sql
CREATE INDEX search_idx ON mock_items
USING bm25 (id, description, category, rating, in_stock, created_at, metadata, weight_range)
WITH (key_field='id');
```

检索：

```sql
SELECT description, rating, category, paradedb.score(id)
FROM mock_items
WHERE description @@@ 'shoes' OR category @@@ 'footwear' AND rating @@@ '>2'
ORDER BY score DESC, description
LIMIT 5;
```

返回根据得分排序的数据

## 分词

影响全文检索结果的最显著的就是采用哪种分词方式，paradedb 默认支持多种分词器，可以通过以下 sql 查看：

```
SELECT * FROM paradedb.tokenizers();
```

返回的有：

```
default
raw
en_stem
stem
lowercase
white_space
regex_tokenizer
chinese_compatible
source_code
ngram
chinese_lindera
japanese_lindera
korean_lindera
icu

```

默认采用的是 `default`

### default

通过拆分空格和标点符号来对文本进行标记，过滤掉大于 255 字节的标记，并转换为小写

### white_space

与 default 类似，但仅基于空格进行拆分。筛选掉大于 255 字节的令牌并转换为小写
使用：

```sql{6,7}
CREATE INDEX search_idx ON mock_items
USING bm25 (id, description)
WITH (
    key_field = 'id',
    text_fields = '{
        "description": {
          "tokenizer": {"type": "whitespace"}
        }
    }'
);
```

### raw

将整个文本视为单个标记。筛选出大于 255 字节的标记并转换为小写

### regex_tokenizer

使用正则表达式对文本进行标记。可以使用 pattern 参数指定正则表达式。例如，`\\W+` 在非单词字符上进行拆分

启用：
```sql{7}
CREATE INDEX search_idx ON mock_items
USING bm25 (id, description)
WITH (
    key_field = 'id',
    text_fields = '{
        "description": {
          "tokenizer": {"type": "regex", "pattern": "\\W+"}
        }
    }'
);
```

### chinese_compatible

chinese_compatible 分词器通过将每个 CJK（中文、日语、韩语）字符视为单个词元，
并将非 CJK 字符分组为单个词元来执行简单的字符拆分。非字母数字字符（如标点符号）将被忽略，并且不会包含在任何令牌中

启用：
```sql{7}
CREATE INDEX search_idx ON mock_items
USING bm25 (id, description)
WITH (
    key_field = 'id',
    text_fields = '{
        "description": {
          "tokenizer": {"type": "chinese_compatible"}
        }
    }'
);
```
### chinese_lindera
Lindera 分词器是一种更高级的 CJK 分词器，它使用预构建的中文、日文或韩文词典将文本分解为有意义的词元（单词或短语），而不是单个字符
chinese_lindera 是针对中文的 lindera 分词器

### source_code

source_code 分词器通过根据代码中常用的大小写约定（如 camelCase 或 PascalCase）进行拆分来对文本进行标记。筛选出超过 255 字节的标记，并使用 ASCII 折叠将其转换为小写

启用：
```sql
CREATE INDEX search_idx ON mock_items
USING bm25 (id, description)
WITH (
    key_field = 'id',
    text_fields = '{
        "description": {
          "tokenizer": {"type": "source_code"}
        }
    }'
);
```

## 查询

ParadeDB 中使用 `@@@` 来进行全文检索，意思是“查找与全文查询匹配的所有行”。 `@@@` 接受两种类型的查询：

### Query String Syntax  查询字符串语法

语法：`@@@` 的左侧是**要搜索的字段**，右侧是查询字符串。
例如，以下查询返回 description 字段与查询 shoes 匹配的所有行

```sql
SELECT description, rating, category
FROM mock_items
WHERE description @@@ 'shoes';

```

> 此语法对 ORM 和预编译语句友好, 但可读性略差

::: tip  特殊字符
特殊字符 `+` 、` ^` 、` '`、 `：`、 `{`、 `}`、 `“`、 `[` 、 `]` 、 `（`、` ）`、` <`、` >`、`~` 、` ！` 、` \\` 、 `\*` 和 空格`SPACE` 必须在查询词内用 `\` 转义
:::

### Query Builder Syntax  查询生成器语法

`@@@` 的左侧是**键字段**，右侧是查询生成器函数或 JSON 对象。此语法对于捕获无法由查询字符串表示的更复杂的查询类型（如模糊匹配或术语级搜索）是必需的
示例：
::: code-group

```sql [查询函数语法]
SELECT description, rating, category
FROM mock_items
WHERE id @@@ paradedb.match('description', 'shoes');
```

```sql [JSON 对象语法]
SELECT description, rating, category
FROM mock_items
WHERE id @@@
'{
    "match": {
        "field": "description",
        "value": "shoes"
    }
}'::jsonb;
```

:::

> 注意上述两种语法的最主要区别，`@@@` 左侧字段类型不同


<PostNav />