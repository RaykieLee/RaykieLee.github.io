---
layout: post
title: 内网穿透神器ZeroTier杂记
date: 2022-07-6 17:49:24
tags: 内网穿透
cover: https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/secure-technology.png
---
# 内网穿透神器ZeroTier杂记

最近吃灰已久的群晖又拿出来跑了，为了方便在外面也能连回公司nas，在家中也抛弃一定的安全性，搭建了一套内网穿透服务。对比其他方案**Frp** 受限于我那服务器5m小水管，ngrok应该也相差不大，对比下p2p方案的**ZeroTier**就很合适了。

## 官网创建虚拟组网

1. 登录[官网](https://my.zerotier.com)注册账号
2. 点击`Create A Network`按钮，创建虚拟组网
3. 点击列表中对应的虚拟，即可看见虚拟组网**id**
4. 拉到下方**Members**列表，当有新的设备加入时，需要在这里勾选对应设备，同意该设备加入虚拟组网，同时还可以在这设置设备的名称以及ip等信息

## 搭建MOON中转服务器

是的，接下来就是在国内的服务器上搭建Moon中转服务器，增加不同PC之间打洞的效率，如果想增加设备之间P2P打洞的成功率，建议终端设备打开NAT或IPV6.

如果没有国内云服务器也可以跳过这一步。

这里使用的**docker-compose**来快速搭建Moon服务器。

在`opt/docker/docker-compose/ZeroTier-Moon/`下创建文件`docker-compose.yaml`,文件内容如下

```yaml
version: "3.4"
services:
  zerotier-moon:
    image: seedgou/zerotier-moon
    container_name: "zerotier-moon"
    restart: always
    ports:
      - "9993:9993/udp"
    volumes:
      - ./config:/var/lib/zerotier-one
    entrypoint:
      - /startup.sh
      - "-4"
      - 139.199.229.21  
```

使用命令启动服务

```bash
docker-compose up -d
```

使moon节点加入虚拟组网。

```bash
docker exec zerotier-moon zerotier-cli join  XXXXX
```

`XXXXX`为第一步的虚拟组网的id。

在官网管理页面中同意moon节点加入。

查看日志获取设置moon节点的命令

```bash
docker-compose  logs -f --tail 100
```

查看日志获得一个类似的命令

```bash
zerotier-cli orbit XXXX XXXX
```

XXXX 为moonid

## 配置客户端

访问[官网下载页面](https://www.zerotier.com/download/)，根据设备系统下载对应客户端。**Zerotier** 拥有大量系统客户端：Windows、MacOS、iOS、Android、Linux、FreeBSD、Synology、QNAP等并且支持**Docker**中运行。基本涵盖了日常大部分的系统。

官网下载页面简单的包括了大量的客户端使用，这里简单提及Windows下的使用。

> IOS  客户端国内已经下架，需使用国外账号下载

> IOS 与Android 均不支持Moon

下载对应客户端按照默认选项按照即可。

安装后右击图标加入网络

![image-20230706161203141](https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/image-20230706161203141.png)

将虚拟组网id填入然后点击**Join** 按钮即可。在官网管理页面同意该设备加入。

运行命令将moon设为自建Moon

```
zerotier-cli orbit MoonId MoonId
```

运行命令查看zerotier信息

查看虚拟组网信息命令

```
zerotier-cli listpeers
```

