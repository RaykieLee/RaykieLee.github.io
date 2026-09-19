---
layout: post
title: ShardingShpere数据库中间件
date: 2021-05-31
tags: 零零散散
cover: https://cdn.jsdelivr.net/gh/GayHub1/images/img/1630253147433.png
---

# ShardingShpere数据库中间件

周末无聊，刚好看见狂神新出的ShardingShpere，以前看过他Redis的一个系列视频，几点还不错，就学习了一波并做了个笔记。（还氪了kuangstudy一个月会员，心疼）。

![image-20210608001754863](https://cdn.jsdelivr.net/gh/GayHub1/images/img/1630253147433.png)

## Apache ShardingSphere概述

关于这种概述一般[官网](http://shardingsphere.apache.org/index_zh.html)的介绍是最为准确与到位的。这里就贴上官网的概述。

> Apache ShardingSphere 是一套开源的分布式数据库解决方案组成的生态圈，它由 JDBC、Proxy 和 Sidecar（规划中）这 3 款既能够独立部署，又支持混合部署配合使用的产品组成。 它们均提供标准化的数据水平扩展、分布式事务和分布式治理等功能，可适用于如 Java 同构、异构语言、云原生等各种多样化的应用场景。
>
> Apache ShardingSphere 旨在充分合理地在分布式的场景下利用关系型数据库的计算和存储能力，而并非实现一个全新的关系型数据库。 关系型数据库当今依然占有巨大市场份额，是企业核心系统的基石，未来也难于撼动，我们更加注重在原有基础上提供增量，而非颠覆。
>
> Apache ShardingSphere 5.x 版本开始致力于可插拔架构，项目的功能组件能够灵活的以可插拔的方式进行扩展。 目前，数据分片、读写分离、数据加密、影子库压测等功能，以及 MySQL、PostgreSQL、SQLServer、Oracle 等 SQL 与协议的支持，均通过插件的方式织入项目。 开发者能够像使用积木一样定制属于自己的独特系统。Apache ShardingSphere 目前已提供数十个 SPI 作为系统的扩展点，仍在不断增加中。
>
> ShardingSphere 已于2020年4月16日成为 Apache 软件基金会的顶级项目。

## Mysql主从集群环境搭建

关于Mysql的话视频是使用 mysql rpm 安装搭建，而我本地是使用docker进行搭建的。这方面是存在一些出入的。

创建docker-compose文件夹以及文件；

![image-20210321204144844](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210321204144844.png)

###  配置docker-compose.yml

docker-compose.yml

```text
version: '2'
services:
  mysql-master:
    build:
      context: ./
      dockerfile: master/Dockerfile
    environment:
      - "MYSQL_ROOT_PASSWORD=root"
      - "MYSQL_DATABASE=replicas_db"
    links:
      - mysql-slave
    ports:
      - "33065:3306"
    restart: always
    hostname: mysql-master
  mysql-slave:
    build:
      context: ./
      dockerfile: slave/Dockerfile
    environment:
      - "MYSQL_ROOT_PASSWORD=root"
      - "MYSQL_DATABASE=replicas_db"
    ports:
      - "33066:3306"
    restart: always
    hostname: mysql-slave
```

### 主数据库配置

#### 配置Dockerfile

Dockerfile

```text
FROM mysql:5.7.17
MAINTAINER harrison
ADD ./master/my.cnf /etc/mysql/my.cnf
```

#### 配置my.cnf文件

my.cnf

```bash
[mysqld]
## 设置server_id，一般设置为IP，注意要唯一
server_id=100  
## 复制过滤：也就是指定哪个数据库不用同步（mysql库一般不同步）
binlog-ignore-db=mysql  
## 开启二进制日志功能，可以随便取，最好有含义（关键就是这里了）
log-bin=replicas-mysql-bin  
## 为每个session分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M  
## 主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed  
## 二进制日志自动删除/过期的天数。默认值为0，表示不自动删除。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
```

### 从数据库配置

#### 配置Dockerfile

Dockerfile

```text
FROM mysql:5.7.17
MAINTAINER harrison
ADD ./slave/my.cnf /etc/mysql/my.cnf
```

#### 配置my.cnf文件

```bash
[mysqld]
## 设置server_id，一般设置为IP，注意要唯一
server_id=101  
## 复制过滤：也就是指定哪个数据库不用同步（mysql库一般不同步）
binlog-ignore-db=mysql  
## 开启二进制日志功能，以备Slave作为其它Slave的Master时使用
log-bin=replicas-mysql-slave1-bin  
## 为每个session 分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M  
## 主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed  
## 二进制日志自动删除/过期的天数。默认值为0，表示不自动删除。
expire_logs_days=7  
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062  
## relay_log配置中继日志
relay_log=replicas-mysql-relay-bin  
## log_slave_updates表示slave将复制事件写进自己的二进制日志
log_slave_updates=1  
## 防止改变数据(除了特殊的线程)
read_only=1
```

### 创建容器

进入 `docker-compose`目录，运行 `docker-compose` 启动命令。

```bash
 docker-compose up -d
```

### 配置从数据库

#### 检查主库的状态

```bash
$ show master status;
```

记录 **主数据库** `binary-log` 的 **文件名称** 和 **数据同步起始位置**。

- File: replicas-mysql-bin.000003
- Position: 154

![image-20210321200215772](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210321200215772.png)

#### 从库配置主库信息

在 **从数据库** 上运行 **主数据库** 的相关配置 `sql` 进行主从关联

```sql
CHANGE MASTER TO
    MASTER_HOST='mysql-master',
    MASTER_USER='root',
    MASTER_PASSWORD='root',
    MASTER_LOG_FILE='replicas-mysql-bin.000003',
    MASTER_LOG_POS=154;
```

![image-20210321203202554](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210321203202554.png)

重启从库~ 两个Yes ，配置成功

#### 3021错误

> 3021 - This operation cannot be performed with a running slave io thread; run STOP SLAVE IO_THREAD FOR CHANNEL '' first.

```
stop slave;

SET GLOBAL SQL_SLAVE_SKIP_COUNTER = 1; 

START SLAVE;
```

status中依旧出现错误

>  Last_IO_Error: Got fatal error 1236 from master when reading data from binary log: 'Could not find first log file name in binary log index file'

最后看着这个MASTER_LOG_FILE文件前缀不对劲...发现设置了从库的bin日志文件~怪不得提示找不到文件 重新设置为Master的日志文件即可 

## 项目配置

[Demo地址](https://github.com/GayHub1/sharding_jdbc)

### 创建项目引入依赖

```
 <properties>
     <java.version>1.8</java.version>
     <sharding-sphere.version>4.0.0-RC1</sharding-sphere.version>
 </properties>
 <!-- 依赖web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- 依赖mybatis和mysql驱动 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<!--依赖lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!--依赖sharding-->
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>${sharding-sphere.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-core-common</artifactId>
    <version>${sharding-sphere.version}</version>
</dependency>
<!--依赖数据源druid-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.21</version>
</dependency>
```

### 读写分离

#### Yaml配置

```
server:
  port: 8085
spring:
  main:
    allow-bean-definition-overriding: true
  shardingsphere:
    # 参数配置，显示sql
    props:
      sql:
        show: true
    # 配置数据源
    datasource:
      # 给每个数据源取别名，下面的ds1,ds2,ds3任意取名字
      names: ds1,ds2,ds3
      # 给master-ds1每个数据源配置数据库连接信息
      ds1:
        # 配置druid数据源
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://47.115.94.78:3306/ksd-sharding-db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: mkxiaoer1986.
        maxPoolSize: 100
        minPoolSize: 5
      # 配置ds2-slave
      ds2:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://114.215.145.201:3306/ksd-sharding-db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: mkxiaoer1986.
        maxPoolSize: 100
        minPoolSize: 5
      # 配置ds3-slave
      ds3:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://114.215.145.201:3306/ksd-sharding-db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: mkxiaoer1986.
        maxPoolSize: 100
        minPoolSize: 5
    # 配置默认数据源ds1
    sharding:
     # 默认数据源，主要用于写，注意一定要配置读写分离 ,注意：如果不配置，那么就会把三个节点都当做从slave节点，新增，修改和删除会出错。
      default-data-source-name: ds1
    # 配置数据源的读写分离，但是数据库一定要做主从复制
    masterslave:
      # 配置主从名称，可以任意取名字
      name: ms
      # 配置主库master，负责数据的写入
      master-data-source-name: ds1
      # 配置从库slave节点
      slave-data-source-names: ds2,ds3
      # 配置slave节点的负载均衡均衡策略，采用轮询机制
      load-balance-algorithm-type: round_robin
# 整合mybatis的配置XXXXX
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.xuexiangban.shardingjdbc.entity
```

接下来就是正常的Mybatis增删查改代码与启动

![image-20210321222317413](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210321222317413.png)

![image-20211124214817213](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20211124214817213.png)

可以看见写入走的是 ds1 数据库 而读取是走的 ds2 

已经完成读写分离配置 

### 分库分表

库表的水平与垂直拆分

#### 垂直拆分

对库： 业务模块拆分、商品库，用户库，订单库

对表：表的字段过多，字段使用的频率不一。（可以拆分两个表建立1:1关系）

#### 水平拆分

对表进行水平拆分（也就是我们说的：分表）


#### 数据迁移

> 一般数据库的拆分也是有一个过程的，一开始是单表，后面慢慢拆成多表。那么我们就看下如何平滑的从MySQL单表过度到MySQL的分库分表架构。
> 1、利用mysql+canal做增量数据同步，利用分库分表中间件，将数据路由到对应的新表中。
> 2、利用分库分表中间件，全量数据导入到对应的新表中。
> 3、通过单表数据和分库分表数据两两比较，更新不匹配的数据到新表中。
> 4、数据稳定后，将单表的配置切换到分库分表配置上。

