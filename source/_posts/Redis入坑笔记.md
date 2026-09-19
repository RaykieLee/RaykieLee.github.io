---
layout: post
title: Redis入坑笔记
date: 2020-11-23 00:04:02
tags: redis
cover: https://download.logo.wine/logo/Redis/Redis-Logo.wine.png
---



# Redis入坑笔记（道）

## 什么是Redis![查看源图像](https://download.logo.wine/logo/Redis/Redis-Logo.wine.png)

> Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster

以上是Redis官网对redis的简介，可以看出这是一个基于内存的非关系型的数据库，但是作用不仅仅是数据库还可以作为缓存以及消息的中间件。多种数据类型。虽然是基于内存的数据库也支持磁盘持久化。并且可以提供高可用的一些方案。

## Redis安装

### Windows安装

在Window下的安装较为简单，在[Windows](https://github.com/microsoftarchive/redis/releases) 页面选择最新版本下载。安装即可 ()

### Linux安装 

Linux 可以通过docker安装或者编译安装 ，相对来说docker安装比较方便。

#### docker安装

拉取镜像 

```shell
docker pull redis:latest
```

运行

```shell
 docker run -itd --name redis-test -p 6379:6379 redis
```

#### 编译安装

安装redis之前先安装C++编译环境，gcc

安装gcc

```
yum -y install gcc-c++
```

去官网下载使用wget命令获取redis最新压缩包 ，官网也提供了安装命令。tar命令解压（建议解压到opt路径下），cd到解压的路径，使用make命令编译。

```shell
wget http://download.redis.io/releases/redis-6.0.8.tar.gz
mv  redis-6.0.8.tar.gz /opt
tar -xzf redis-6.0.8.tar.gz
cd redis-6.0.8
make
```

程序已经默认安装好在/usr/loacl/bin下了

### 启动

redis 默认并不是后台启动 ，需要修改config中 **daemonize**属性改为yes

```
redis-server  redis.config
```

### 使用redis客户端连接

```
reids-cli -h 127.0.0.1  -p 6379
```


cli连接后关闭redis

```
shutdown
```

## 常用命令

- 查询所有key 

  ```
  keys *
  ```

## 数据结构

Redis底层数据结构一共有 6 种，分别是简单动态字符串、双向链表、压缩列表、哈希表、跳表和整数数组。利用各个数据结构不同的特性，在不同的场景下，动态组成了了各种数据类型，对应关系如下图所示：

![image-20210113220722832](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210113220722832.png)

Redis作为一个典型的键值对数据库，我们先来看看它的键值对都是如何保存的。
首先Redis服务器中每个服务器都是存在RedisService中长度为dbnum（默认为16）的RedisDB数组中，所以redis默认拥有16个数据库的。
RedisDB数组中每个数据库使用Redisdb结构来表示，而RedisDB数据库结构下的dict字典就保存该数据库所有的键值对信息；

![image-20210113223224391](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210113223224391.png)



### Dict 字典/哈希表

dict字典的底层是使用哈希表实现的，通过这哈希表可以高效的完成键值的关联与对键值对的管理。

而哈希表就是多个哈希桶构成的数组。每个键值对根据键的哈希值存储在相应的哈希桶中，存储在相同哈希桶的键值对的哈希节点通过链地址法连接。因而每个键值对节点都有指向对应key，val，以及下一个节点的指针。

![image-20210118105401587](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210118105401587.png)

那么作为一个哈希表，重点往往在散列函数，哈希冲突，扩容机制这几个点。

**散列函数**的作用在于计算哈希key最终存储在哪个哈希槽上，因此散列函数的算法除了效率还需要尽可能的将每个节点均匀地分散到哈希槽上，让散列尽可能的均匀。

redis在字典中具体使用散列的算法是 Murmurhash2。Murmurhash2是一种非加密hash算法，相对其他哈希散列算法。

> *这种算法即使输入的键是有规律的，算法仍能给出一个很好的随机分布性，计算速度非常快，使用简单。*

**哈希冲突** 当多个哈希节点被分配到同一个哈希槽时就会产生哈希冲突，在redis中就使用链地址法来解决，每个节点都有一个next指针来连接下一个节点，用链地址的形式连接多个节点在同一个哈希槽上现成一个单向链表，每加入一个新的节点时，由于每个哈希槽指针只指向链表的表头，所以是使用头插法，插入到链表的表头位置。

**渐近式rehash**

由于当哈希表内所保存的哈希节点越来越多时，就需要对哈希表的大小进行扩容，通过增加哈希桶的方式，使整个哈希表的负载因子（used/size）即每一个哈希桶内链表的个数在一个合理的范围。扩容的具体方式就用上了dict结构下的rehashidx变量与ht数组中另一个哈希表了。那么具体是如何进行渐进式rehash的呢？

1. 为另一个空闲的新哈希表分配空间。空间大小为>= 两倍旧哈希表所承载节点的2^n次方。（收缩时为一倍）

2. 将rehashidx由默认值-1设为0；开始渐进式rehash。

3. 每当对字典进行操作时，除了执行原本的操作还会将旧哈希表rehashidx索引对应的哈希槽内所有的哈希节点进行rehash（重新计算哈希值并根据新哈希表大小计算出在新哈希表的哈希槽）到新的哈希表。然后rehashidx++；

4. 当对旧哈希表所有的键值对都rehash到新的哈希表时重新将rehashidx设为-1. 

5. 释放的哈希表。将指向旧哈希表的指针指向新的哈希表，为原本新哈希表指针指向一个新的哈希表。这样整个渐进式rehash过程就完成了。

   这种渐进式rehash的方式保证了每一次的哈希表rehash的量不会过多，时间不会过久阻塞了单线程的redis。

   rehash的扩容触发条件会根据redis是否有在创建子进程（BGSAVE与BGREWRITEAOF）而改变。当有进行创建子进程的操作时，只有负载因子大于5才会进行rehash扩容否则只需大于1就可以进行rehash了。当负载因子小于0.1就会进行缩小。

   在渐进式rehash期间对字典的所有操作都会针对新旧哈希表进行操作的。

   

   

### 整数集合

### 双向链表

### 压缩列表

### skiplist 跳跃表

​	Redis使用跳跃表(skiplist)作为有序集合键的底层实现之一。skiplist本质上也是一种查找结构，用于解决算法中的查找问题（Searching）。一般查找问题的解法分为两个大类：一个是基于各种平衡树，一个是基于哈希表。但skiplist却比较特殊，它没法归属到这两大类里面。因为他是基于链表实现的。算是分治查找使用链表，在牺牲空间复杂度情况下产生的结构。

​	传统意义的单链表是一个线性结构。像有序的链表中大部分操作例如：插入，查找 都是需要一个O(n)的时间；

![img](http://images.zhuoke.xyz/img/20150530162529554)

​	先来看看skiplist比较基础的结构图，使用上图中所看到的的跳跃表。由于我们能够先通过每一个节点的最上层的指针先进行查找，将查找的值与目前节点的后继节点的值进行对比，如果大于则继续与后继指针对比，否则就下沉一层然后继续循环，直到找到该值在跳跃表的位置。（最后一定下沉到最下层）这样子就能跳过大部分的节点。然后再缩减范围，对以下一层的指针进行查找，若仍未找到，缩小范围继续查找。通过在每个节点增加多个后继指针就能够大大降低降低查找所需时间。原本O（n）也降低到O(logn);

基于redis是一种内存数据库，所以像使用B+tree实现索引这一类的数据结构只使用于存储在磁盘的mysql之类的数据库。基于哈希表又不满足数据库多样的需求，Redis 中的有序集合支持的核心操作主要有下面这几个： 

- 插入一个数据
- 删除一个数据
- 查找一个数据
- 按照区间查找数据（比如查找在[100,356]之间的数据）
- 迭代输出有序序列 

其中，插入、查找、删除以及迭代输出有序序列这几个操作，红黑树也能完成，时间复杂度和跳表是一样的，但是，按照区间来查找数据这个操作，红黑树的效率没有跳表高。

### SDS 简单动态字符串

关于String类型底层的数据结构，虽然redis是使用c编写的，但是String并没有用c语言的字符串来实现。而是使用了一种简单动态字符串（simple dynamic string），即SDS作为Redis默认字符串的数据结构。**SDS**

用于在以下方面

- 数据库的字符串

- 缓冲区（AOF模块的AOF缓冲区；客户端状态的输入缓冲区）

  可以看到SDS被大量应用在数据快速修改的场景。而C字符串长度每一次增加或减少都会程序都需要进行一次内存重分配。而SDS结构则进行了优化。类似于ArrayList，通过一些冗余空间来减少内存重新分配的次数，我们先来看一下SDS的结构。

  ```
  struct sdshdr {
  
  //字符串长度
  
     int len;
  
  //空闲字节
  
     int free;
  
  //实际存储数据buf的char型数组
  
      char buf[];
  };      
  ```

  SDS整个结构还是相对比较简单明了，直接存储了字符串的长度以及另外存储数组空闲字节

  ，这样设计就可以**直接获得字符串长度**，而不用遍历到空字符；另外使得存储数据的buf数组不用跟c字符串一样，强制使数据量与存储数据的数组容量一致，实现**空间预分配**与**惰性空间**释放大大减少了数据变化后内存空间重分配的次数。虽然SDS与C字符串一样以空字符结尾，但是SDS的APi都是二进制安全的，不但可以**避免缓冲区溢出**而且**可以使用原本C<string.h>中部分函数**。还可以保存二进制数据(图片，音视频等文件)。

### Redis Model

## **数据类型**

### String

#### 命令

- [SET](http://redisdoc.com/string/set.html)/[GET](http://redisdoc.com/string/get.html)/[SETNX](http://redisdoc.com/string/setnx.html)/[SETEX](http://redisdoc.com/string/setex.html)/[GETEX](http://redisdoc.com/string/psetex.html)/[GETSET](http://redisdoc.com/string/getset.html)    获取赋值
- [APPEND](http://redisdoc.com/string/append.html)/[SETRANGE](http://redisdoc.com/string/setrange.html)/[GETRANGE](http://redisdoc.com/string/getrange.html)   局部修改
- [INCR](http://redisdoc.com/string/incr.html)/[INCRBY](http://redisdoc.com/string/incrby.html)/[INCRBYFLOAT](http://redisdoc.com/string/incrbyfloat.html)/[DECR](http://redisdoc.com/string/decr.html)/[DECRBY](http://redisdoc.com/string/decrby.html) 增量/减量
- [MSET](http://redisdoc.com/string/mset.html)/[MSETNX](http://redisdoc.com/string/msetnx.html)/[MGET](http://redisdoc.com/string/mget.html) 批量操作

### Hash

#### 命令

- [HSET](http://redisdoc.com/hash/hset.html)/[HSETNX](http://redisdoc.com/hash/hsetnx.html)/[HGET](http://redisdoc.com/hash/hget.html)/[HKEYS](http://redisdoc.com/hash/hkeys.html)/[HVALS](http://redisdoc.com/hash/hvals.html)
- [HEXISTS](http://redisdoc.com/hash/hexists.html)/[HDEL](http://redisdoc.com/hash/hdel.html)/[HLEN](http://redisdoc.com/hash/hlen.html)/[HSTRLEN](http://redisdoc.com/hash/hstrlen.html)   对field 单独的操作
- [HINCRBY](http://redisdoc.com/hash/hincrby.html)/[HINCRBYFLOAT](http://redisdoc.com/hash/hincrbyfloat.html)
- [HMSET](http://redisdoc.com/hash/hmset.html)/[HMGET](http://redisdoc.com/hash/hmget.html)/[HGETALL](http://redisdoc.com/hash/hgetall.html)

### List

#### 命令

- [LPUSH](http://redisdoc.com/list/lpush.html)/[LPUSHX](http://redisdoc.com/list/lpushx.html)/[RPUSH](http://redisdoc.com/list/rpush.html)/[RPUSHX](http://redisdoc.com/list/rpushx.html)/[LPOP](http://redisdoc.com/list/lpop.html)/[RPOP](http://redisdoc.com/list/rpop.html)/[RPOPLPUSH](http://redisdoc.com/list/rpoplpush.html)   
- [LREM](http://redisdoc.com/list/lrem.html)
- [LLEN](http://redisdoc.com/list/llen.html)
- [LINDEX](http://redisdoc.com/list/lindex.html)
- [LINSERT](http://redisdoc.com/list/linsert.html)
- [LSET](http://redisdoc.com/list/lset.html)
- [LRANGE](http://redisdoc.com/list/lrange.html)
- [LTRIM](http://redisdoc.com/list/ltrim.html)
- [BLPOP](http://redisdoc.com/list/blpop.html)
- ### [BRPOP](http://redisdoc.com/list/brpop.html)
- [BRPOPLPUSH](http://redisdoc.com/list/brpoplpush.html)

### Set

#### 命令

- [SADD](http://redisdoc.com/set/sadd.html)
- [SISMEMBER](http://redisdoc.com/set/sismember.html)
- [SPOP](http://redisdoc.com/set/spop.html)
- [SRANDMEMBER](http://redisdoc.com/set/srandmember.html)
- [SREM](http://redisdoc.com/set/srem.html)
- [SMOVE](http://redisdoc.com/set/smove.html)
- [SCARD](http://redisdoc.com/set/scard.html)
- [SMEMBERS](http://redisdoc.com/set/smembers.html)
- [SSCAN](http://redisdoc.com/set/sscan.html)
- [SINTER](http://redisdoc.com/set/sinter.html)
- [SINTERSTORE](http://redisdoc.com/set/sinterstore.html)
- [SUNION](http://redisdoc.com/set/sunion.html)
- [SUNIONSTORE](http://redisdoc.com/set/sunionstore.html)
- [SDIFF](http://redisdoc.com/set/sdiff.html)
- [SDIFFSTORE](http://redisdoc.com/set/sdiffstore.html)

### Sorted Sets 

#### 命令

- [ZADD](http://redisdoc.com/sorted_set/zadd.html)
- [ZSCORE](http://redisdoc.com/sorted_set/zscore.html)
- [ZINCRBY](http://redisdoc.com/sorted_set/zincrby.html)
- [ZCARD](http://redisdoc.com/sorted_set/zcard.html)
- [ZCOUNT](http://redisdoc.com/sorted_set/zcount.html)
- [ZRANGE](http://redisdoc.com/sorted_set/zrange.html)
- [ZREVRANGE](http://redisdoc.com/sorted_set/zrevrange.html)
- [ZRANGEBYSCORE](http://redisdoc.com/sorted_set/zrangebyscore.html)
- [ZREVRANGEBYSCORE](http://redisdoc.com/sorted_set/zrevrangebyscore.html)
- [ZRANK](http://redisdoc.com/sorted_set/zrank.html)
- [ZREVRANK](http://redisdoc.com/sorted_set/zrevrank.html)
- [ZREM](http://redisdoc.com/sorted_set/zrem.html)
- [ZREMRANGEBYRANK](http://redisdoc.com/sorted_set/zremrangebyrank.html)
- [ZREMRANGEBYSCORE](http://redisdoc.com/sorted_set/zremrangebyscore.html)
- [ZRANGEBYLEX](http://redisdoc.com/sorted_set/zrangebylex.html)
- [ZLEXCOUNT](http://redisdoc.com/sorted_set/zlexcount.html)
- [ZREMRANGEBYLEX](http://redisdoc.com/sorted_set/zremrangebylex.html)
- [ZSCAN](http://redisdoc.com/sorted_set/zscan.html)
- [ZUNIONSTORE](http://redisdoc.com/sorted_set/zunionstore.html)
- [ZINTERSTORE](http://redisdoc.com/sorted_set/zinterstore.html)

### HyperLogLog

### GEO

### Pub/Sub

### Stream

## 高可用，可靠

### 复制

当有了持久化机制后，确保了redis断电重启后可以恢复好之前的数据，提高了可靠性，但是还无法避免服务不可用的状态，而提高可靠性最为常用的方式就是增加服务的实例节点，增加数据冗余。将一份数据保存到多个服务节点上。即使有的节点宕机情况整体依旧可以提供服务，减少对服务的影响；
redis则采用**读写分离**，主从同步的方式多个实例保存同一份数据；又主库提供写操作然后同步到其他从库；而读操作主从共同提供服务，在普遍读大于写的业务需求下提供较高的可靠性与性能；
而采用一写多从，读写分离的方式可以有效的避免了多个实例之间的分布式多个实例之间的数据一致性与事务的开销。那么具体又是如何实现主从直接的数据一致呢。

#### 数据同步

主要分为三大阶段：

![image-20210125230430426](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210125230430426.png)

##### 全量同步

首先 由从库发送**replicaof**命令到主库，主库通过**fullresync**命令返回自己的**runid**与offset 偏移量的确认主从关系后开始全量同步；

从库给主库发送**psync**命令，表示要进行数据同步，主库根据这个命令的参数来启动复制。psync命令包含了主库的runlD和复制进度offset两个参数。

主库执行bgsave命令后将生成的rdb文件发送给从库，从库接受rdb文件后先清空本地数据然后载入rdb文件。

主库将同步期间的写命令记录到replication buffer 中，待从库加载完先前的rdb文件就将replication buffer中命令发送给从库执行；完成第一次全量数据的同步；

##### 命令传播

在完成第一次主从同步后，主从之间的数据就达到数据的一致；但这种数据一致情况一定主库执行新的写操作就会被破坏；为此主库将与每一个从库维持一个**长链接**，在执行完写操作后对从服务器执行命令传播操作；即将该写操作发送给从服务器执行，维护主从数据库的一致性；

##### 部分重同步



### 哨兵

### 集群

### 持久化

​	Redis是一个内存型的数据库，它所有的数据都是保存在内存中的，而内存虽然可以快速的读写，但是一旦断电，内部存储的所有数据都会丢失。即使是像用作缓存的这种其他数据库仍有备份数据的场景，重新加载数据依旧会对其他的数据库造成一定的压力。所以为了就觉这方面的问题，Redis本身自己就提供了持久化的机制，分别为**AOF日志**与**RDB快照**两种持久化方式。

#### AOF日志

​	AOF日志是redis通过保存每一条对数据库操作的命令来实现最终对数据库所有数据的保存。是数据库常见的一种存储同步数据的一种方式。AOF持久化实现的主要过程通常分为命令追加,文件写入与同步三步。

##### 命令追加

​	服务器在每一次成功执行一条写命令后，就会以redis命令请求协议的格式追加到aof_buf缓冲区的末尾；

​	例如 成功执行一个普通的SET命令后以以下协议格式的内容追加到缓冲区。

​	命令： SET zhuoke blog

​	追加内容： 

```
*3
$3
set
$6
zhuoke
$4
blog
```

​	通过这种先执行成功再写入缓冲区的方式  可以**减去命令语法检查操作**与**不会阻塞写操作**却增加了成功执行命令后尚未持久化就宕机丢失数据的风险与在aof写盘时给下一个写操作造成阻塞的风险。

##### 文件同步写入

​	那么在命令追加阶段的风险其实都是可以通过控制文件的写入与同步的频率来减少这种风险。文件同步写入的操作会在服务器每一个事件循环结束前调用**flushAppendOnlyFile**这个函数来根据服务器的设置提供的频率来判断是否执行文件的同步与执行操作。而这个频率是由服务器提供的一个配置项 **appendfsync**来设置的。**appendfsync**具体有三个选项可供选择

- Always 每个写命令执行完立刻**同步写回**到磁盘；

- Everysec 每秒由一个线程专门负责执行将缓冲区内容写回到文件

- No 由操作系统控制缓冲区写回到磁盘文件

  三种策略对比优缺点

  ![image-20210121235326332](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210121235326332.png)



三种策略由上到下性能递增，而可靠性却相反在递减。具体选择就根据应用场景了。redis默认选项是一个折中选择了Everysec。

##### AOF文件载入

​	AOF光将数据保存到磁盘的操作还不行，我们还需要将文件存储到磁盘的aof日志文件读取会redis的内存空间。
前文提到，aof中具体保存的是redis命令格式的数据。因而只需要一个客户端读取aof文件中的命令发送给redis的服务端即可。
AOF具体的文件的载入的流程如下：

 - 服务端启动一个伪客户端（不带网络连接）
 - 读取并执行aof文件中的命令
 - 读取完毕，载入结束

##### AOF重写

​	随着aof日志不断的写入，aof文件的大小也会不断的增大，当aof过大时会影响aof追加与载入恢复数据的效率；这个时候redis就提供**aof重写机制**来**减少**aof文件的大小了；
​	AOF会保存redis执行成功的每一条写命令。当多条命令都是对同一个对象进行数据写操作时，往往这多条命令会存在大量冗余的数据；AOF重写是比较有意思的一个点，他重写并不是对原先aof文件内容使用压缩算法进行精简，而是**直接根 据数据库中键值对的最新数据生成对应的写命令**；使原本对应该键值对的多条写操作合并成一条；大大的压缩了aof文件的大小；
​	但是aof重写机制与aof原本机制最大不同在于，它并没有相关的配置项来控制落盘频率，每一次重写所有数据都是直接写入硬盘因而存在大量的读写操作；因为aof重写只有在aof文件比较大的时候才会进行重写，重写的频率并不频繁，所以可以使用较大的开销，直接开启了新的**子进程**对**数据副本**进行重写；

对数据副本进行重写却令重写期间的数据并没有拷贝到数据副本，导致数据库数据与aof文件数据不一致。因此redis在重写期间设置了aof重写的缓冲区，在重写期间，每一条写命令运行成功后除了需要加入原本的aof缓冲区外还需要追加到aof重写的缓冲区；那么整个aof重写的流程如下：

![image-20210123203057130](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210123203057130.png)

主进程

- 主进程创建出子进程**bgrewriteao**f并且拷贝出数据副本

- 执行写命令并分别追加到aof缓冲区与aof追加缓冲区；

- 接收到子进程发送的重写完成信号，将重写期间写命令追加到新aof文件中；

- 用新的aof文件覆盖旧aof文件；

子进程

- 开始重写 
- 遍历所有的键值对 （忽略过期的键）
- 根据键的类型镜像重写
- 重写完毕 
- 向主进程发送重写完成的信号 

可以看到由子进程来执行重写的操作可以很大程度避免了主进程的阻塞；但是在fork子进程与重写完毕将aof重写缓冲区内容追加到新aof文件依旧不可避免地产生**阻塞风险**；AOF文件载入时也是逐一执行命令，这样效率也比较慢；

#### RDB快照

说完aof日志那就来叨叨另一个持久化机制：RDB快照；与aof记录写命令不同，rdb是直接记录某个是时刻的内存内的数据写到磁盘上；

触发rdb文件生成的方式又两种，一种是命令形式，另一种是在配置文件设置好触发条件的自动间隔性保存；

redis有两个命令可以主动生成rdb文件；

- save ： 在主线程执行；会阻塞主线程；
- bgsave：创建一个子进程来执行；（默认配置选项）

配置文件中默认触发条件

```
save 900 1

save 300 10

save 60 1000
```

那么满足其中一个条件即可触发bgsave命令

例如： 在900秒内对数据库执行了一次修改命令 即可触发bgsave命令

最终配置文件中save的配置会被加载到redisServer中的 saveparams数组中；同时redisServer还保存了上次执行完rdb之后成功修改次数的计数器**dirty**与上次执行rdb的unix时间戳lastsave属性；

​	周期性函数serverCron每一执行就会根据这三个值来判断是否执行bgsave函数；

​	bgsave子进程与主进程之间共享所有内存数据；当主进程需要修改数据时就会使用操作系统提供COW(copy on write)写时复制技术；子进程读取复制出来的旧数据；主进程直接修改原来的数据；子进程与主进程之间数据避免影响；

​	![image-20210124213009859](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210124213009859.png)





那么对于平时redis我们应该用哪种方式来持久化呢？

![img](https://pic1.zhimg.com/80/v2-005677bf0c9c4937bddce3794f387a77_1440w.jpg?source=1940ef5c)

小孩子才做选择题~ 

平时日常可混合使用aof与rdb，使用rdb做全量备份，在两次rdb之间使用aof做增量备份；

这样一来，快照不用很频繁地执行，这就避免了频繁fork对主线程的影响。而且，AOF日志也只用记录两次快照间的操作，也就是说，不需要记录所有操作了，因此就不会出现文件过
大的情况了，也可以避免重写开销。

![image-20210124215636329](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210124215636329.png)
