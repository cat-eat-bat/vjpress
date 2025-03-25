---
title: Postgres 扩展查询SQL
date: 2025-02-24
tags: ["postgres","extension"]
outline: deep
---

# Postgres 扩展查询SQL

<PostMeta />

> 以下sql语句测试版本：pg 15

## 列出已安装的扩展

```sql
SELECT * FROM pg_extension;
```
## 查看某个扩展是否已安装

```sql
select * from pg_extension where extname='vector';
```

##  列出可用的扩展

```sql
SELECT name FROM pg_available_extensions;
```

## 安装某个扩展

```sql
CREATE EXTENSION pgcrypto;
```

## 删除某个扩展

```sql
DROP EXTENSION pgcrypto;
```

## 移动扩展到其他模式

```sql
ALTER EXTENSION pgcrypto SET SCHEMA public;
```


<PostNav />