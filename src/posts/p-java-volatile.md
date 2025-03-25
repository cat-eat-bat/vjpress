---
title: volatile 关键字解析
date: 2025-02-12
tags: ["java并发"]
outline: deep
---
# volatile 关键字解析

<PostMeta />

## 1. `volatile` 关键字的作用

在 Java 并发编程中，`volatile` 关键字主要有以下两个作用：

*   **保证可见性：** 当一个线程修改了被 `volatile` 修饰的变量的值时，其他线程能够立即看到修改后的值，而不是继续使用自己工作内存中的缓存值。
*   **禁止指令重排序：** `volatile` 关键字可以防止指令重排序，保证程序的执行顺序按照代码的编写顺序执行。

### 1.1 可见性

在 Java 内存模型中，每个线程都有自己的工作内存，工作内存中存储了共享变量的副本。当一个线程修改了共享变量的值时，它首先会修改自己工作内存中的副本，然后才会将修改后的值写回主内存。此时，其他线程的工作内存中仍然是旧的副本，因此它们无法立即看到修改后的值。

而当一个变量被 `volatile` 修饰时，线程对该变量的修改会立即写回主内存，并且会使其他线程工作内存中该变量的副本失效。这样，其他线程在读取该变量时，会强制从主内存中读取最新值，从而保证了可见性。

### 1.2 禁止指令重排序

为了提高程序的执行效率，编译器和处理器可能会对指令进行重排序。但是，在多线程环境下，指令重排序可能会导致程序出现意想不到的错误。

`volatile` 关键字可以防止指令重排序，保证程序的执行顺序按照代码的编写顺序执行。具体来说，`volatile` 关键字会插入内存屏障，确保在 `volatile` 变量之前的指令必须在 `volatile` 变量之后执行，并且 `volatile` 变量之后的指令必须在 `volatile` 变量之前执行。

## 2. `volatile` 关键字的用法场景

`volatile` 关键字通常用于以下场景：

*   **状态标志：** 当一个线程需要通知其他线程某个状态发生变化时，可以使用 `volatile` 变量作为状态标志。
*   **单例模式的双重检查锁：** 在实现单例模式时，可以使用 `volatile` 关键字来保证对象的可见性和防止指令重排序。

### 2.1 状态标志

```java
public class MyThread extends Thread {
    private volatile boolean running = true;

    public void run() {
        while (running) {
            // do something
        }
    }

    public void stopRunning() {
        running = false;
    }
}
```

在上面的代码中，`running` 变量被 `volatile` 修饰，用于控制线程的运行状态。当其他线程调用 `stopRunning()` 方法时，会将 `running` 变量的值设置为 `false`，此时正在运行的线程能够立即看到这个变化，并停止执行。

### 2.2 单例模式的双重检查锁

```java
public class Singleton {
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        Singleton result = instance;
        if (result == null) {
            synchronized (Singleton.class) {
                result = instance;
                if (result == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

在上面的代码中，`instance` 变量被 `volatile` 修饰，用于保证对象的可见性和防止指令重排序。这样可以确保在多线程环境下，只有一个线程能够创建 Singleton 实例。

## 3. 注意事项

*   `volatile` 关键字只能保证变量的可见性，不能保证原子性。如果需要保证原子性，可以使用 `synchronized` 关键字或 `Atomic` 类。
*   过度使用 `volatile` 关键字可能会影响程序的性能，因此应该谨慎使用。

## 总结

`volatile` 关键字是 Java 并发编程中一个重要的关键字，它可以保证变量的可见性和禁止指令重排序。合理使用 `volatile` 关键字可以有效地解决多线程环境下的并发问题。

<PostNav />
