---
title: docker run 命令详解
date: 2025-03-04
tags: ["docker"]
outline: deep
---

# docker run 命令详解

<PostMeta /> 

docker run 命令是 Docker 中最核心的命令之一，用于创建并运行一个新的容器。它提供了丰富的参数选项，可以让你对容器的运行方式进行精细控制。
以下是一些常用的 docker run 参数及其解释

- `-d`: 在后台（守护进程模式）运行容器
- `-it`: 创建一个交互式的 shell 会话 允许你与容器进行交互，例如运行命令
- `--name`: 为容器指定一个名称, 方便管理
- `--rm`: 容器运行结束后自动删除，避免保留无用的已停止容器 节省磁盘空间
- `-p`: 主机端口映射 如 `-p 8000:80`
- `--network`: 将容器连接到指定的网络 允许容器与其他容器或主机进行通信
- `-v`: 挂载一个卷，用于持久化存储数据，格式为 主机路径:容器路径，例如 -v /data:/app/data
- `--mount`: 挂载文件系统，docker volume，或者tmpfs 

- `-e`: 设置环境变量, 格式为 变量名=变量值，例如 -e MYSQL_ROOT_PASSWORD=secret
- `--cpus`: 限制容器使用的 CPU 数量
- `--memory`: 限制容器使用的内存量
- `--restart`: 用于指定容器的重启策略，
    - no: 默认值，即不会重启
    - on-failure[:max-retries] ：仅当容器以非零退出代码退出（表示错误）时，才会重启容器，可以选择指定最大重启尝试次数（例如，on-failure:5）
    - always：无论退出代码如何，容器都将始终重启
    - unless-stopped：除非用户明确停止容器，否则容器将重启

<PostNav />
