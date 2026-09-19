---
layout: post
title: docker-compose部署应用
date: 2022-10-12 17:49:24
tags: docker

cover: https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/%E4%B8%8B%E8%BD%BD.webp
---

最近用docker-compose部署了一个小应用，包括了JeecgBoot中springboot与vue，python以及一些中间件，挺全的，于是记录一下过程。
后续其他的中间件都会逐步补充，算是一个docker部署各种项目及中间件的一个汇总

## 基础环境搭建

既然是用docker-compose部署就逃不开安装docker与docker-compose的啦

### Docker安装

- 安装依赖包

  ```
    sudo yum remove docker \
                      docker-client \
                      docker-client-latest \
                      docker-common \
                      docker-latest \
                      docker-latest-logrotate \
                      docker-logrotate \
                      docker-engine
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
  ```

- 配置仓库

  ```
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  ```

-  安装docker

  ```
    sudo yum install docker-ce -y --allowerasing
  ```

- 设置docker自启动

  ```
    sudo systemctl enable docker
  ```

- 启动docker服务

  ```
    sudo systemctl start docker
  ```

-  查看docker版本

  ```
    docker -v
  ```

### docker-compose 安装

```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-linux-x86_64" -o /usr/bin/docker-compose
chmod -R 777 /usr/bin/docker-compose
```

## Java部署

java springboot 的部署这里使用的是以前部署skywalking 的通用基础镜像

### 启动Jar包脚本

网上大部分教程都是将jar包直接打包进了镜像，这里使用脚本部署可以更加自由动态的运行jar包，将jar包与镜像解耦，不需要每一次改动jar包都需要重新打包进镜像

`startup.sh`

```bash
#!/bin/sh

#到工作目录下，获取该目录下最新版本的jar
WORK_DIR=/opt/docker/java/bootstrap
cd bootstrap

BOOT_JAR=`ls *.jar | sort -k1.5r | sed -n '1p;1q'`
echo ‘==================================’
echo '容器将启动下面的jar文件: '
echo $BOOT_JAR
echo ‘==================================’
java -Dfile.encoding=utf-8 -Djava.security.egd=file:/dev/./urandom -jar $BOOT_JAR "$@" 
```

 该脚本会启动`/opt/docker/java/bootstrap`目录下最新的jar包

### Dockerfile文件

DockerFile是用来构建docker 镜像文件 的构建文件

```
FROM centos:7
ENV LANG=C.UTF-8
RUN mkdir -p /usr/skywalking/agent/ &&\
  mkdir -p /usr/share/fonts/ &&\
  yum install -y font-adobe-100dpi ttf-dejavu fontconfig  mkfontscale
# A streamlined jre
ADD jdk1.8.0_131/ /usr/java/jdk1.8.0_131/
ADD skywalking-agent/ /usr/skywalking/agent/
ADD dumb-init  /usr/local/bin
ADD winfonts/  /usr/share/fonts/winfonts
# set env 
ENV JAVA_HOME /usr/java/jdk1.8.0_131

ENV PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
ENV CLASSPATH=.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
ENV JAVA_TOOL_OPTIONS=-javaagent:/usr/skywalking/agent/skywalking-agent.jar
#增加Java应用的变量
ENV HOME_PATH /opt/docker/java
ENV RUN_ENV  docker

# run container with base path:$HOME_PATH
WORKDIR $HOME_PATH
RUN  mkdir resources  &&  mkdir bin  && mkdir bootstrap  && mkdir -p /opt/attachment && chown -R root:root .
RUN mkfontscale && mkfontdir && fc-cache -fv 
COPY startup.sh  /opt/docker/java/bin
USER root
RUN chmod 777 /opt/docker/java/bin/startup.sh
RUN chmod 777 /usr/local/bin/dumb-init
VOLUME [ "/opt/attachment"]
ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD  /opt/docker/java/bin/startup.sh
```

这一系列的脚本使用了Centos作为基础镜像，加入了  `jdk1.8` `skywalking Agant` `dumb-init` `font`等文件，使用Centos作为基础镜像是为了减少一些奇奇怪怪的缺少驱动之类的因为系统原因导致的bug。为了减小镜像大小也可以使用`OpenJDK` 甚至于`alpine`作为基础镜像，可以极端的将镜像减少到大概100M左右。但是不推荐。
### docker-compose 运行
新建文件夹`jar`，将jar包配置相应的docker-compose.yaml文件运行即可
```
  # 文件服务
  pie-module-file:
    container_name: pie-module-file
    build:
      context: sc_base_java_images/
    volumes:
      - ./jar/pie-module-file-0.0.1-SNAPSHOT.jar:/opt/docker/java/bootstrap/pie-module-file-0.0.1-SNAPSHOT.jar
    ports:
      - 1729:1729
    environment:
      - "spring.datasource.dynamic.datasource.master.url=jdbc:mysql://mysql:3306/djszh?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false"
      - "spring.redis.host=redis"
    networks:
      - custom_net
    depends_on:
      - mysql
  # 系统后台服务
  pie-module-system:
    container_name: pie-module-system
    build:
      context: sc_base_java_images/
    volumes:
      - ./jar/pie-module-system-0.0.1-SNAPSHOT.jar:/opt/docker/java/bootstrap/pie-module-file-0.0.1-SNAPSHOT.jar
    ports:
      - 1788:1788
    environment:
      - "spring.datasource.dynamic.datasource.master.url=jdbc:mysql://mysql:3306/djszh?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false"
      - "spring.redis.host=redis"
    networks:
      - custom_net
    depends_on:
      - mysql
```
## VUE前端
### 修改后端地址配置
修改`vue.config.js`内后台地址为docker-compose对应的访问地址，如下所示
```
  devServer: {
    port: 3000,
    proxy: {
      '/pie-jeecg/api/file/': {
        target: 'http://pie-module-file:1729', //请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true,
        pathRewrite: {'^/pie-jeecg': '/'}
      },
      '/api/file/': {
        target: 'http://pie-module-file:1729', //请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true,
      },
      '/pie-jeecg': {
        target: 'http://pie-module-system:1788', //请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true
      }
    }         
  },
```
### 项目打包
运行`build`命令
![Alt text](https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/image.png)

运行后会生成dist文件夹，将文件夹拷贝至nginx的www文件夹下。

### 配置nginx

修改nginx配置文件添加以下代理映射

```conf
        location / {
          root   /usr/share/nginx/html;
          add_header Cache-Control no-store;
          index  index.html;
        }
        
        location ^~ /jeecg-boot {
          proxy_pass              http://pie-module-system:1788;
          proxy_set_header        Host 127.0.0.1;
          proxy_set_header        X-Real-IP $remote_addr;
          proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        }
```

### docker-compose 运行

```
  nginx-proxy:
    container_name: nginx-proxy
    image: nginx:latest
    privileged: true
    restart: always
    volumes:
       - ./nginx/conf:/etc/nginx
       - ./nginx/logs:/var/log/nginx
       - ./nginx/www:/usr/share/nginx/html
    ports:
      - 8002:443
    networks:
      - custom_net
```

## Python(显卡直通)

像百度的Paddle，阿里的[ModelScope](https://modelscope.cn/)均有对应的docker镜像，这里使用了PaddleSpeech进行了ASR服务与文字分割，使用镜像为`paddlecloud/paddlespeech:develop-gpu-cuda11.2-cudnn8-52c7c1`,虽然使用了了官方镜像，但在运行中出现了各种报错，最后根据CUDA版本重新在镜像内重新安装对应 paddl版本才启动成功。

### Dockerfile文件

重新安装的CUDA12版本的paddle，启动容器后启动PaddleSpeech Service

```
FROM paddlecloud/paddlespeech:develop-gpu-cuda11.2-cudnn8-52c7c1
ADD paddlespeech/ /mnt
ADD  cache/ /root
RUN  pip uninstall paddlepaddle_gpu -y
# RUN  pip download urllib3==1.23  -d ./package  -i https://mirror.baidu.com/pypi/simple 
# RUN  pip download paddlepaddle-gpu==2.5.1 -d ./package -f https://www.paddlepaddle.org.cn/whl/linux/mkl/avx/stable.html
# RUN  pip download torch torchvision torchaudio -d ./package 


pip3 install torch torchvision torchaudio

RUN  pip install /mnt/package/*.whl
CMD  paddlespeech_server start --config_file /mnt/speech_server/conf/application.yaml
```

- paddlespeech 包含了一些需要装的离线好的python依赖文件，与PaddleSpeech Service 启动文件

  > 这些依赖文件是通过 pip download paddlepaddle-gpu==2.5.1 -d ./package -f  命令离线下载到package文件夹中

- cache 则包含了PaddleSpeech Service  需要的一些缓存在系统中的初始化文件。

  > 这些文件通过 docker diff 容器id 可以查看到容器修改了哪些文件，这些文件可以通过-v 映射持久化到宿主机 或者 docker copy 命令 如`docker cp  96f7f14e99ab:/www /tmp/`将容器文件拷贝出来

### docker-compose 运行

docker-compose还需要将gpu映射到容器内，新版本的docker比较简单，只需要添加几行配置即可，而不需要nvidia-docker了，具体详情可以查看官网[Turn on GPU access with Docker Compose ](https://docs.docker.com/compose/gpu-support/)

```yaml
  paddlespeech:
    # image: paddlecloud/paddlespeech:develop-gpu-cuda11.2-cudnn8-52c7c1
    build:
      context: paddlespeech_server/
    container_name: paddlespeech
    volumes:
      - ./paddlespeech_server/paddlespeech:/mnt
    # command:   /bin/bash -c "while true;do echo hello docker;sleep 1;done"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - 8090:8090
    networks:
      - custom_net
```

> docker 命令直通显卡的话 添加参数--gpus all 即可

运行访问效果

![image-20231011110141114](https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/image-20231011110141114.png)

## ELK部署

这里的ELK是指elastic 的三大开源框架Elasticsearch、Logstash、Kibana。围绕着Elasticsearch这个分布式搜索和分析引擎的一套生态的一部分，常用作日志的集中收集处理的解决方案。但是[官网](https://www.elastic.co/guide/en/elasticsearch/reference/8.10/docker.html)的docker-compose 部署非常麻烦，这里使用的[docker-elk](https://github.com/deviantony/docker-elk#initial-setup)安装

### 必备软件包

**Debian/Ubuntu**

```
sudo apt update && sudo apt upgrade
sudo apt install curl vim git
```

**RHEL/CentOS/RockyLinux 8**

```
sudo yum -y update
sudo yum -y install curl vim git
```

**Fedora**

```
sudo dnf update
sudo dnf -y install curl vim git
```

### 克隆docker-elk

```
git clone https://github.com/deviantony/docker-elk.git
cd docker-elk
```

### 修改默认配置

 修改配置文件 **`docker-compose.yml`**

 > 通常，Elasticsearch 和 Logstash 都以分配给 JVM 堆大小的总主机内存的1/4开始。

####      **配置 Elasticsearch**  

- 集群名
- 禁用付费功能

 配置文件地址**`Elasticsearch/config/Elasticsearch.yml`**
```
elasticsearch:
  environment:
    ES_JAVA_OPTS: -Xm1g -Xms1g
    cluster.name: my-cluster
    xpack.license.self_generated.type: basic
```

####  配置 **Kibana**

 配置文件地址**`kibana/config/kibana.yml`**

   ```
   kibana:
     environment:
       SERVER_NAME: kibana.example.com
   ```

####  配置 Logstash

 ```
 logstash:
   environment:
     LS_JAVA_OPTS: -Xmx1g -Xms1g
 ```

####  配置用户名、密码和版本

 - 默认用户名**elastic**
  - 配置文件地址**`./.env`**
  - 修改版本号与对应密码  目前最新版本号为**8.3.2**

####  配置持久卷

 ```
mkdir -p /opt/docker/docker-compose/docker-elk/elasticsearch/data
mkdir -p /opt/docker/docker-compose/docker-elk/setup/data
docker volume create --driver local \
    --opt type=none \
    --opt device=/opt/docker/docker-compose/docker-elk/elasticsearch/data \
    --opt o=bind elasticsearch
docker volume create --driver local \
    --opt type=none \
    --opt device=/opt/docker/docker-compose/docker-elk/setup/data \
    --opt o=bind setup
docker volume list
 ```

  修改配置文件 **`docker-compose.yml`**末尾

  ```
    	  .......
    	  volumes:
    	    setup:
    	      external: true
    	    elasticsearch:
    	      external: true
  ```

###  运行

```
    	  docker-compose up -d
```
