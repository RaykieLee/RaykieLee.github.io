---
layout: butterfly
title: contos7部署运行jar包
date: 2020-04-17 17:09:06
tags: [Centos7]
---
# 安装配置Centos7环境

## 网络配置
```
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```
将ONBOOT=no改为ONBOOT=yes
：wq 退出
 重启网络配置

## 安装传输文件
### 安装
```
yum install lrzsz -y
```
### 查看是否安装完成
````
rpm -qa | grep lrzsz -y
````
### 从服务器上传文件到本地：
```
sz
```
### 从本地上传文件到服务器：
```
rz
```
## CentOS7 开启端口
CentOS7之后，无法使用iptables控制Linuxs的端口，原因：Centos 7使用firewalld代替了原来的iptables。

### firewalld的基本使用
启动： systemctl start firewalld

关闭： systemctl stop firewalld

查看状态： systemctl status firewalld 

开机禁用  ： systemctl disable firewalld

开机启用  ： systemctl enable firewalld

### systemctl是CentOS7的服务管理工具中主要的工具，它融合之前service和chkconfig的功能于一体。
启动一个服务：systemctl start firewalld.service
关闭一个服务：systemctl stop firewalld.service
重启一个服务：systemctl restart firewalld.service
显示一个服务的状态：systemctl status firewalld.service
在开机时启用一个服务：systemctl enable firewalld.service
在开机时禁用一个服务：systemctl disable firewalld.service
查看服务是否开机启动：systemctl is-enabled firewalld.service
查看已启动的服务列表：systemctl list-unit-files|grep enabled
查看启动失败的服务列表：systemctl --failed

### 配置firewalld-cmd
查看版本： firewall-cmd --version

查看帮助： firewall-cmd --help

显示状态： firewall-cmd --state

查看所有打开的端口： firewall-cmd --zone=public --list-ports

更新防火墙规则： firewall-cmd --reload

查看区域信息:  firewall-cmd --get-active-zones

查看指定接口所属区域： firewall-cmd --get-zone-of-interface=eth0

拒绝所有包：firewall-cmd --panic-on

取消拒绝状态： firewall-cmd --panic-off

查看是否拒绝： firewall-cmd --query-panic
## 安装 java环境
```
yum -y install java-1.8.0-openjdk
```
使用rz上传 使用java -jar 运行jar包

参考：[CentOS 7 开放端口](https://www.cnblogs.com/Ryez/p/11504896.html)