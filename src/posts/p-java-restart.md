---
title: linux 重启java服务脚本
date: 2024-05-10
tags: ["java", "linux"]
---

# linux 重启java服务脚本

<PostMeta />

```shell
#!/bin/bash
 
PID=$(jps -l | grep 'xxxx-1.0' | awk '{print $1}')
 
echo " kill $PID ..."

kill $PID

/home/xxx/xxx-1.0-SNAPSHOT/startup.sh 

```

<PostNav />