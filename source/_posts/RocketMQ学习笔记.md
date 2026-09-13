---
layout: butterfly
title: RocketMQ学习笔记
date: 2022-05-28
tags: RocketMQ
cover: https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/cover_hu9145d0cb10e9c56d586699b94d669fc3_38014_1600x0_resize_box_3.png
---



#   RabbitMQ安装

## 安装

### 常规安装

[官网教程 ](https://rocketmq.apache.org/docs/quick-start/)

### Docker安装

```

```

### docker-compose部署

##### 单体

1. 创建文件夹

   ```sh
   mkdir -p RocketMQ/data/{broker,namesrv}/{conf,logs,store}/
   ```

   

2. 在RocketMQ文件夹下创建docker-compose.yaml文件

   ```
   version: '3.4'
   services:
     namesrv:
       image: apacherocketmq/rocketmq:4.5.0
       container_name: rmqnamesrv
       ports:
         - 9876:9876
       volumes:
         - ./data/namesrv/logs:/home/rocketmq/logs
       command: sh mqnamesrv
       networks:
         rmq:
           aliases:
             - rmqnamesrv
     broker:
       image: apacherocketmq/rocketmq:4.5.0
       container_name: rmqbroker
       ports:
         - 10909:10909
         - 10911:10911
         - 10912:10912
       volumes:
         - ./data/broker/logs:/home/rocketmq/logs
         - ./data/broker/store:/home/rocketmq/store
         - ./data/broker/conf/broker.conf:/home/rocketmq/rocketmq-4.5.0/conf/broker.conf
       command: sh mqbroker -n namesrv:9876 -c ../conf/broker.conf
       networks:
         rmq:
           aliases:
             - rmqnamesrv
       depends_on:
         - namesrv
     dashboard:
       image: apacherocketmq/rocketmq-dashboard:latest
       container_name: rocketmq-dashboard
       ports:
         - 8680:8080
       environment:
         JAVA_OPTS: "-Drocketmq.namesrv.addr=namesrv:9876"
       networks:
         rmq:
           aliases:
             - rmqnamesrv
       depends_on:
         - namesrv
   networks:
     rmq:
       name: rmq
       driver: bridge
   ```

3. 在.\data\broker\conf\下创建broker.conf文件

   ```
   brokerClusterName = DefaultCluster
   # brokerClusterName cluster地址 集群数量比较多是可以分成多个cluster 每个cluster一个业务
   brokerName = broker-a
   # brokerName broker 名称 master与slave使用同一个brokerName名称
   brokerId = 0
   # 0 表示Master 大于0 表示不同的slaveID 
   deleteWhen = 04
   # 删除消息的时间
   fileReservedTime = 48
   # 消息保留时间
   brokerRole = ASYNC_MASTER
   # brokerRole 主从同步策略
   # ASYNC_MASTER: 异步复制Master
   # SYNC_MASTER: 同步双写Master
   # SLAVE: slave
   flushDiskType = ASYNC_FLUSH
   #刷盘策略
   # ASYNC_FLUSH  异步
   # SYNC_FLUSH 同步
   brokerIP1=192.168.0.109
   # 设定broker机器对外暴露的ip地址
   ```

4. 在RocketMQ 输入docker-compose命令运行程序

   ```
   docker-compose up -d
   ```

   访问8680端口即可看见dashboard页面

![image-20220405173925770](C:\Users\94241\AppData\Roaming\Typora\typora-user-images\image-20220405173925770.png)

 export NAMESRV_SDDR=localhost:9876

