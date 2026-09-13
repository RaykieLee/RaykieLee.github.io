---
layout: butterfly
title: nginx代理
date: 2020-04-17 17:02:51
mathjax: true
tags: [nginx]
---
## nginx 

### 安装与运行
解压压缩包进入解压路径 
cmd切换到该路径 
运行命令

```cmd
nginx
```
$\sum_{i=0}^N\int_{a}^{b}g(t,i)\text{d}t$
### 配置文件
配置文件路径在解压所在路径的conf文件夹下的nginx.conf
添加代理 
监听本机12345端口代理127.0.0.1:3306；

````lombok.config
stream {
    server {
        listen 12345;
        proxy_pass 127.0.0.1:3306;
    }
}
````

多个代理
```
stream {
    server {
        listen 3366;
        proxy_pass 172.16.33.25:3306;
    }
    server {
        listen 8068;
        proxy_pass 172.16.96.145:8068;
    }
    server {
        listen 25015;
        proxy_pass 172.16.99.11:25015;
    }
    server {
        listen 880;
        proxy_pass 172.16.99.13:80;
    }
}
```

### 访问方法
nginx所在ip加上监听的端口以及后续地址

例：

原网址： http://172.16.96.145:8068/sc_internship/sc2020/scbe/service-app-sample
在运行172.16.33.25运行nginx后监听8068端口代理对应的网址为
http://172.16.33.25:8068/sc_internship/sc2020/scbe/service-app-sample

### 配置文件修改重装载命令

```lombok.config
nginx -s reload
```

