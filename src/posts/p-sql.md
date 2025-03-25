---
title: 常用sql示例
date: 2025-01-20
excerpt: pg数据库为例
tags: ["sql","pg"]
---

# 常用sql示例

<PostMeta />

> 所有sql以 PostgreSQL 数据库为准

## 随机返回n行数据

```sql
SELECT x.* FROM test_emp x  order by random() limit 5
```

::: tip 函数
random
:::

## 将NULL转换为实际值

**问题**

有些列为 NULL，但你不想返回 NULL，而想返回非 NULL 值。

**解决方案**

使用函数 `COALESCE` 将 NULL 值替换为实际值

```sql
select coalesce (job, 'worker') from test_emp;
```
::: tip 函数
coalesce
:::

<PostNav />
