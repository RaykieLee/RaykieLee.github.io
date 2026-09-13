---
layout: butterfly
title: Zabbix
date: 2020-05-27 14:53:48
tags: Zabbix 
---
## Linux下Zabbix服务端的安装配置
### 关闭selinux和firewall

#### 检测selinux是否关闭

[root@localhost ~]# getenforce  

Disabled                                     #Disabled 为关闭

#### 临时关闭

[root@localhost ~]# `setenforce 0`  #设置SELinux 成为enforcing模式

#### 永久关闭

[root@localhost ~]# `vi /etc/selinux/config：  ` 

将SELINUX=enforcing改为SELINUX=disabled 

设置后需要重启才能生效

### 查看默认防火墙状态

[root@localhost ~]# `firewall-cmd --state `

not running           #关闭后显示not running，开启后显示running

#### 停止firewall

[root@localhost ~]#` systemctl stop firewalld.service`

#### 禁止firewall开机启动

[root@localhost ~]#` systemctl disable firewalld.service`



### Zabbix3.4程序安装

#### 配置zabbix的yum源（重点是这里，多次尝试从官方下载的文件，在yum安装时会失败，看网上分析是被墙了）

[root@localhost ~]# `rpm -ivh http://mirrors.aliyun.com/zabbix/zabbix/3.0/rhel/7/x86_64/zabbix-release-3.0-1.el7.noarch.rpm`

`vim /etc/yum.repos.d/zabbix.repo`

请将zabbix.repo的内容清空，并将如下内容直接复制进去
```
[zabbix]

name=Zabbix Official Repository - $basearch

baseurl=http://mirrors.aliyun.com/zabbix/zabbix/3.0/rhel/7/$basearch/

enabled=1

gpgcheck=1

gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX

[zabbix-non-supported]

name=Zabbix Official Repository non-supported - $basearch

baseurl=http://mirrors.aliyun.com/zabbix/non-supported/rhel/7/$basearch/

enabled=1

gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX

gpgcheck=1
```


#### 安装zabbix程序包，安装mysql、zabbxi-agent

[root@localhost ~]# `yum install -y zabbix-server-mysql zabbix-web-mysql zabbix-agent mariadb-server`

#### 启动mariadb并设置开机启动，创建数据库实例，授权

[root@localhost ~]# `systemctl start mariadb `     #启动mariadb

[root@localhost ~]# `systemctl enable mariadb`  #设置开机启动

[root@localhost ~]#` mysql    `                         #登入数据库

MariaDB [(none)]>` create database zabbix character set utf8 collate utf8_bin; `  #创建数据库实例

Query OK, 1 row affected (0.00 sec)

MariaDB [(none)]> `grant all privileges on zabbix.* to zabbix@'%' identified by 'zabbix'; `  #授权所有主机访问数据库实例zabbix，用户名/密码：zabbix/zabbix

Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> `grant all privileges on zabbix.* to zabbix@localhost identified by 'zabbix';  ` #授权localhost主机名访问数据库实例zabbix，用户名/密码：zabbix/zabbix

Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> `grant all privileges on zabbix.* to zabbix@localhost.localdomain identified by 'zabbix'; ` #授权localhost.localdomain主机访问数据库实例zabbix，用户名/密码：zabbix/zabbix

Query OK, 0 rows affected (0.00 sec)

导入初始模式和数据

[root@localhost ~]#    `cd /usr/share/doc/zabbix-server  ` 后面使用Tab键补全              #进入create.sql.gz所在目录 此处路径会存在问题，因为zabbix的版本已经更新了。

[root@localhost zabbix-server-mysql-3.4.4]# `zcat create.sql.gz |mysql -uroot zabbix  `  #导入初始模式

#### 启动zabbix-server服务

##### 配置zabbix-server的配置文件zabbix_server.conf

[root@localhost zabbix-server-mysql-3.4.4]# `vi /etc/zabbix/zabbix_server.conf`

```
DBHost=localhost

DBName=zabbix

DBUser=zabbix

DBPassword=zabbix
```
##### 启动zabbix-server服务

[root@localhost zabbix-server-mysql-3.4.4]# `systemctl start zabbix-server  `         #启动zabbix-server服务

[root@localhost zabbix-server-mysql-3.4.4]# `systemctl enable zabbix-server  `     #设置zabbix-server服务开机自启动

##### 编辑Apache的配置文件，消注释设置正确的时区

[root@localhost zabbix-server-mysql-3.4.4]# `vi /etc/httpd/conf.d/zabbix.conf`

```
php_value max_execution_time 300

php_value memory_limit 128M

php_value post_max_size 16M

php_value upload_max_filesize 2M

php_value max_input_time 300

php_value always_populate_raw_post_data -1

php_value date.timezone Asia/Shanghai
```
启动httpd服务 ，设置开机启动httpd服务

[root@localhost ~]# `systemctl start httpd `       #启动httpd服务 

[root@localhost ~]# `systemctl enable httpd `   #设置开机启动httpd服务

### 启动zabbix-agent并设置开机自启动

[root@localhost ~]# `systemctl start zabbix-agent `         # 启动zabbix-agent服务

[root@localhost ~]# `systemctl enable zabbix-agent`       # 设置zabbix-agent服务开机自启动
### Zabbix Web网页安装
- 在浏览器输入地址http://服务器ip/zabbix/setup.php，出现欢迎界面，点击下一步
- 出现必要条件检测界面，正常都是OK，点击下一步
- 配置DB连接，与zabbix_server.conf文件中主机、数据库名称、用户名、密码保持一致，点击下一步
![UTOOLS1590563756971.png](https://img01.sogoucdn.com/app/a/100520146/166f9acfc16ae93aa3610b8055b4d09c)
- zabbix服务器详细信息，点击下一步
- 安装前汇总，检查信息无误，点击下一步安装
- 安装成功 配置文件目录  Configuration file "/etc/zabbix/web/zabbix.conf.php" created.
- zabbix网页登录
  
  在浏览器输入http://zabbix服务器ip/zabbix/index.php，输入管理员用户名Admin(区分大小写)，默认密码zabbix，点击登入即可。
  ![UTOOLS1590563863434.png](https://img03.sogoucdn.com/app/a/100520146/717a18651ade170517a1c4f9e6bc64f6)



## Windows下Zabbix客户端配置
### 安装前注意事项
安装前请关闭 防火墙 或者修改防火墙规则 允许访问10050端口
尽量关闭360
### 下载agent
注意：下载的agent的版本应该尽量与server端的版本一致 （版本为：Zabbix 4.4.6）
[4.46安装包](https://www.yuque.com/attachments/yuque/0/2020/zip/1342721/1590550547641-90f64058-47c3-4b7a-9701-ee8729400554.zip?_lake_card=%7B%22uid%22%3A%221590550546218-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fzip%2F1342721%2F1590550547641-90f64058-47c3-4b7a-9701-ee8729400554.zip%22%2C%22name%22%3A%22zabbix_agent-4.4.6-windows-amd64.zip%22%2C%22size%22%3A844098%2C%22type%22%3A%22application%2Fx-zip-compressed%22%2C%22ext%22%3A%22zip%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%221gxiu%22%2C%22card%22%3A%22file%22%7D)


[agent官网压缩包下载网址](https://www.zabbix.com/cn/download_agents#tab:40LTS "安装包下载网址")



在c盘根目录下创建文件夹 zabbix 
将agent软件包解压到zabbix文件夹内
下载的软件包解压后有两个文件夹，分别是/bin,/conf
![1590463688(1).jpg](https://img01.sogoucdn.com/app/a/100520146/277e6af13053856f6bb97f4169b03e52)
### 修改配置
修改配置文件中的内容
配置文件位置：C:\zabbix\conf\zabbix_agentd.win.conf
```
LogFile=c:\zabbix\zabbix_agentd.log    //日志存放位置
Server=172.16.33.***         //zabbix_server主机IP地址
ServerActive=172.16.33.***       //zabbix_server主机IP地址
Hostname=172.16.33.***         //被监控主机名，自身主机名
```
## 安装
用管理员权限打开cmd
切换路径到C:\zabbix\bin
```
cd c:/zabbix/bin
```
指定配置文件安装
```
zabbix_agentd.exe -i -c C:\zabbix\conf\zabbix_agentd.conf
```
启动
```
zabbix_agentd.exe -s -c C:\zabbix\conf\zabbix_agentd.conf
```
安装运行成功截图
![1590464393(1).jpg](https://img04.sogoucdn.com/app/a/100520146/6efbfc02b589f49d56d296e96cfbc34f)
此时可在任务管理器中查看到zabbix_agent服务，正在运行
![1590464479(1).jpg](https://img02.sogoucdn.com/app/a/100520146/032c5edcb53c04c909d70cd1e27a44bb)
## agent卸载
在bin目录下
```
zabbix_agentd.exe -d -c C:\zabbix\conf\zabbix_agentd.conf
```
删除服务
```
sc delete "Zabbix Agent"
```




## Linux下 zabbix 客户端配置
### 配置zabbix的yum源

- 使用 vim命令 打开 nexus3-145-centos7.repo 文件
```
vim /etc/yum.repos.d/nexus3-145-centos7.repo
```


- 在末尾添加以下Zabbix镜像仓库配置
```
# 145私有Zabbix镜像仓库
[zabbix]
name=Zabbix Official Repository - $basearch
baseurl=http://172.16.96.145:8665/repository/yum-104/zabbix/zabbix/4.4/rhel/$releasever/$basearch/
gpgcheck=0
enabled=1
```
[配置公司私有源详细文档](http://172.16.99.11:25015/web/#/7?page_id=159 "详细文档")

#### 安装zabbix-agent

	 yum -y install zabbix-agent


#### 修改agent的配置文件

	vim /etc/zabbix/zabbix_agentd.conf

修改配置文件中的内容

```
LogFile=c:\zabbix\zabbix_agentd.log    //日志存放位置
Server=172.16.33.***         //zabbix_server主机IP地址
ServerActive=172.16.33.***       //zabbix_server主机IP地址
Hostname=172.16.33.***        //被监控主机名，自身主机名
```

####客户端相关命令

#####自启动
	systemctl enable zabbix-agent.service
#####启动命令
	systemctl start zabbix-agent.service
#####停止命令
	systemctl stop zabbix-agent.service
### 通过10050端口查看客户端是否运行
	netstat -tunple | grep 10050
![UTOOLS1590564093632.png](https://img02.sogoucdn.com/app/a/100520146/ef172a1f1fd5b65fbc2ffb1cb87be452)

[参考地址: CentOS7安装zabbix-agent](https://blog.csdn.net/wc1695040842/article/details/86811071)

#### 卸载zabbix-agent

	 yum -y remove zabbix-agent
	 
	 
作者：悠悠之生
链接：https://www.jianshu.com/p/75b9048bed25