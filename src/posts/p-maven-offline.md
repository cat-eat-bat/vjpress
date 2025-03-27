---
title: maven 离线模式打包
date: 2025-03-25
tags: ["maven", "java"]
outline: deep
---

# maven 离线模式打包

<PostMeta />

主要描述maven如何在 offline 模式下，实现clean package等

## 在线下载依赖

需要先在线模式下，下载好应用所需要的所有依赖包（包含工程依赖、打包用到的maven插件依赖等）
```shell
# 创建离线依赖的本地目录
mkdir -p /data/repo-offline

# 下载依赖
mvn  dependency:go-offline -Dmaven.repo.local=/data/repo-offline

```

## 离线模式执行

此时，可以打开离线模式，执行编译、打包等：
```shell
mvn  clean package --offline  -P build-app-jar -Dmaven.repo.local=/data/repo-offline
```

<PostNav />
