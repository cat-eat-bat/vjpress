---
title: Sedona 入门
date: 2025-04-20
tags: ["sedona","spark"]
outline: deep
---

# Apache Sedona 入门

<PostMeta />

## 介绍

[Apache Sedona](https://sedona.apache.org/latest/) 是一种用于处理大规模空间数据的集群计算系统，通过提供一系列开箱即用的分布式空间数据集和空间 SQL，扩展了现有的集群计算系统，如 Apache Spark、Apache Flink 和 Snowflake，这些系统可以高效地在机器间加载、处理和分析大规模空间数据。

主要架构如下：

![](https://sedona.apache.org/latest/image/sedona-ecosystem.png)


Sedona 目前支持三个分布式平台： `Spark` `Flink` `Snowflake`

> 本文以 `spark` 平台为例


## 安装

### 基础环境
- spark
- java
- maven

#### start spark

采用单机伪集群模式，本机作为`master`角色，同时作为一个 `worker` 角色，需要修改环境变量：

```shell
vim conf/spark-env.sh
```

添加以下变量值：

```
export SPARK_MASTER_HOST=localhost
export SPARK_MASTER_PORT=7077
export SPARK_MASTER_WEBUI_PORT=8088
```
分别启动 master 和 worker:

```shell
sbin/start-master.sh

sbin/start-worker.sh spark://localhost:7077 -c 4 -m 1G
```
> 这里 `worker` 指定了 cores 为 4 内存为 1GB

可以访问 `http://localhost:8088/` 查看 spark web 页面

#### add jars

将对应版本的jar包拷贝到 `${SPARK_HOME}/jars`

`sedona-spark-shaded-3.5_2.12-1.7.1.jar` `geotools-wrapper-1.7.1-28.5.jar`


## 使用

使用常用的 java 来实现示例代码。

### 创建工程

创建一个 maven java 工程

### 引入依赖

在 `pom.xml` 中引入相关依赖：

```xml
   <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <sedona.version>1.7.1</sedona.version>
        <spark.version>3.5.5</spark.version>
    </properties>
   <dependencies>
            <!-- Spark Core -->
            <dependency>
                <groupId>org.apache.spark</groupId>
                <artifactId>spark-core_2.12</artifactId>
                <version>${spark.version}</version>
            </dependency>

            <!-- Spark SQL -->
            <dependency>
                <groupId>org.apache.spark</groupId>
                <artifactId>spark-sql_2.12</artifactId>
                <version>${spark.version}</version>
            </dependency>

            <dependency>
                <groupId>org.apache.sedona</groupId>
                <artifactId>sedona-spark-shaded-3.5_2.12</artifactId>
                <version>${sedona.version}</version>
            </dependency>

            <!-- Optional: https://mvnrepository.com/artifact/org.datasyslab/geotools-wrapper -->
            <dependency>
                <groupId>org.datasyslab</groupId>
                <artifactId>geotools-wrapper</artifactId>
                <version>${sedona.version}-28.5</version>
            </dependency>

     <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
        </dependency>

        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
        </dependency>
 </dependencies>
```

### 测试代码

```java
   public static void main(String[] args) {
        SparkSession config = SedonaContext.builder()
                .master("spark://localhost:7077") // 本机集群
                .appName("readTestJava")
                .config("spark.serializer", KryoSerializer.class.getName())
                .config("spark.kryo.registrator", SedonaVizKryoRegistrator.class.getName()) // org.apache.sedona.viz.core.Serde.SedonaVizKryoRegistrator
                .getOrCreate();
        SparkSession sedona = SedonaContext.create(config);
        SedonaVizRegistrator.registerAll(sedona);

        Dataset<Row> points = sedona.read().format("csv")
                .option("delimiter", "\t").option("header", "false")
                .load("/Users/alex/data/swap/spark_test/spatial/points.csv");
        points.createOrReplaceTempView("points");
        points.printSchema();
        points.show();
    }
```

运行，查看输出

<PostNav />
