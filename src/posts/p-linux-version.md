---
title: linux 查询系统版本信息命令
date: 2024-04-08
tags: ["运维", "linux"]
---

# linux 查询系统版本信息命令

<PostMeta />

在Linux中，查询系统版本的命令可以有多种实现方法，其中几种常用的方法如下：

1. 使用 lsb_release 命令：

```shell
lsb_release -a
```
这个命令会显示系统中已安装的Linux发行版的信息，包括发行版的名称、版本号等。

2. 使用cat命令读取/etc/issue文件：

```shell
cat /etc/issue
```

3. uname 命令

```shell
uname  -a
```

通常会显示 linux 内核版本信息等

4. redhat-release , 适用于 centos 等发行版

```shell
cat /etc/redhat-release
```
通常是显示 redhat 发行版信息等

<PostNav />
