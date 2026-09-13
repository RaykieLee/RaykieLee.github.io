---
layout: butterfly
title: SpringBoot语法技巧
date: 2020-06-03 15:21:18
tags: SpringBoot
---
### Controller 接收时间
```java
@RequestParam(value = "date", required = false)@DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date;
```
@DateTimeFormat来控制入参，@JsonFormat来控制出参
@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")  

原文链接：https://blog.csdn.net/xiangluer/article/details/81913137
