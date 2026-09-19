---
layout: post
title: Jenkins安装记录
date: 2021-01-31 16:38:00
---

# Jenkins安装记录

安装环境 

- Window 10 Docker Engine v20.10.2

  拉取运行镜像 

  ```
     docker run -d -v D:\jenkins\data:/var/jenkins_home -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
  ```

  打开localhost:8080加载一段时间后进入登陆页面；
  
  ![image-20210131163823048](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210131163823048.png)

默认生成的密码可以之间查看容器日志或者查看页面中提供的地址；

![image-20210131164021195](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210131164021195.png)

![image-20210131164117139](C:\Users\94241\AppData\Roaming\Typora\typora-user-images\image-20210131164117139.png)

然后选择安装推荐的插件 

![image-20210131164419211](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210131164419211.png)

然后就在安装常用的插件了。

访问不到源可以更换成清华源 

[Jenkins 使用国内镜像快速安装（rpm安装）](https://blog.csdn.net/qiuyeyijian/article/details/104570642)

![image-20210131165717100](https://cdn.jsdelivr.net/gh/GayHub1/images/img/image-20210131165717100.png)

创建用户-》实例配置-》开始使用。
