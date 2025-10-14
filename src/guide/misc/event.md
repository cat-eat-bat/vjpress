---
outline: deep
---

# 事件管理

event-manager: 利用 `Disruptor` 实现的高性能的异步事件管理器。

## 介绍

`Disruptor` 是英国外汇交易公司LMAX开发的一个高性能队列，它通过一个环形队列来处理事件，从而避免了线程间的同步问题，从而拥有较高的处理性能，适用于以下场景:
- 消息队列: 可以作为高性能的消息队列，用于异步通信。
- 大数据处理： 可以用于大数据处理中的数据流处理。
- 游戏服务器： 可以用于处理游戏中的各种事件，如玩家操作、NPC行为等

## 使用

### 引入依赖
```xml
<dependency> 
    <groupId>org.winterfell</groupId>
    <artifactId>event-manager</artifactId>
    <version>1.1.0-SNAPSHOT</version>
</dependency>
```

### 定义事件和处理器等

:::code-group
```java [MyEvent.java]
public class MyEvent implements VinEvent<String> {

        private String message;

        public MyEvent() {
        }

        public String getMessage() {
            return message;
        }

        public MyEvent setMessage(String message) {
            this.message = message;
            return this;
        }

        @Override
        public void setPayload(String payload) {
            this.message = payload;

        }

        @Override
        public String toString() {
            return "MyEvent{" +
                    "message='" + message + '\'' +
                    '}';
        }
    }

```

```java [MyEventHandler.java]
public class MyEventHandler implements VinEventHandler<MyEvent> {

        @Override
        public void onEvent(MyEvent myEvent, long sequence, boolean endOfBatch) throws Exception {
            System.out.printf("from my handler: %s, sequence: %d, end: %s%n", myEvent.toString(), sequence, endOfBatch);

        }

        @Override
        public boolean support(Class<MyEvent> eventClass) {
            return eventClass.equals(MyEvent.class);
        }

        /**
         * 消费的次序 值越小越在前先消费
         *
         * @return
         */
        @Override
        public int ordinal() {
            return 100;
        }
    }
```
:::

### 创建事件管理器

```java
public static void main(String[] args) throws InterruptedException {
    VinEventManager eventManager = new VinEventManager(MyEvent::new, new MyHandlerRegistry());
    for (int i = 0; i < 10; i++) {
        eventManager.dispatch("hello world-".concat(String.valueOf(new Random().nextInt())));
    }
    System.out.println("-----main end-------");
    Thread.sleep(50000);
}
/**
 * 注册 事件消费者
 * spring 环境中一般是从 context 中获取 bean的实现
 */
static class MyHandlerRegistry implements VinEventHandlerRegistry<MyEvent> {    
    
    @Override
    public List<VinEventHandler<MyEvent>> eventHandlers() {
        List<VinEventHandler<MyEvent>> list = new ArrayList<>();
        list.add(new MyEventHandler());
        // 这里可以添加更多的处理器
        return list;
    }
}
```


