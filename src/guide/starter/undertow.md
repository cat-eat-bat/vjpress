---
outline: deep
---

# 使用 undertow

`Undertow` 是一个优秀的 Web 服务器，在高并发、自定义需求、HTTP/2 等场景下具有显著优势。

Spring Boot 中使用 Undertow 的场景
- 高并发场景： 当应用程序需要处理大量的并发请求时，Undertow 的高性能优势会非常明显。
- 需要自定义 HTTP 处理逻辑： Undertow 提供了灵活的 API，可以自定义拦截器、过滤器等，满足各种定制化的需求。
- 需要支持 HTTP/2： 如果应用程序需要利用 HTTP/2 的特性，如多路复用、头部压缩等，Undertow 是一个不错的选择。
- 希望减少内存占用： Undertow 相比 Tomcat 等传统 Servlet 容器，内存占用更少，适合资源受限的环境。

为此，我们提供了一个组件 `app-starter-undertow` 方便切换到 undertow 容器:

```xml{3}
    <dependency>
        <groupId>org.winterfell</groupId>
        <artifactId>app-undertow-starter</artifactId>
        <version>1.4.0-SNAPSHOT</version>
    </dependency>
```

其他用法和上一章节无异。
