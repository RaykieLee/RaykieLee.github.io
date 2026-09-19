---
layout: post
title: Centos7安装npm
date: 2020-05-12 17:01:07
tags: Centos7
---
## npm 
### 安装
- 下载
```
wget https://npm.taobao.org/mirrors/node/v10.14.1/node-v10.14.1-linux-x64.tar.gz
```
- 解压重命名 
```
tar -xvf  node-v8.0.0-linux-x64.tar.xz
mv node-v8.1.4-linux-x64 node
```
- 配置环境变量
```
vim /etc/profile
```
根据自己实际目录在文件末尾加入以下内容
```
#set for nodejs  
export NODE_HOME=/usr/local/node  
export PATH=$NODE_HOME/bin:$PATH
```
 使配置文件生效并查看是否安装成功
 ```
source /etc/profile
node -v
npm -v
 ```
可下载源码编译安装，但编译时间较长不推荐
```
wget https://npm.taobao.org/mirrors/node/v10.13.0/node-v10.13.0.tar.gz
```
## 一些nom命令
- 安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm -v
```
- 直接换源  
单次：``npm install --registry=https://registry.npm.taobao.org``   
永久： ``npm config set registry https://registry.npm.taobao.org``
- 查看数据源
```
npm config get registry
```
- 删除数据源
```
npm config rm proxy

npm config rm https-proxy
```
## pm2 start app.js
