---
layout: butterfly
title: springcloud之eureka&feign
date: 2020-05-08 14:48:24
tags: 
---
## pom
```java

        <!--        cloud-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>2.1.4.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>
    </dependencies>

    <!-- cloud 依赖-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
## pom
```java
eureka:
  instance:
    hostname: localhost
    preferIpAddress: true
  client:
    #   服务器端不注册eureka(默认true)
#    registerWithEureka: true
    #   服务器端不需要抓取服务列表(默认true)
#    fetchRegistry: false
    #   注册url(配置之后报错Reached through: #include "navbar.ftl"  [in template "eureka/status.ftl" at line 22, column 7])
    serviceUrl:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
      enabled: true #需要手动开启
```
当主页404加上
```java
spring:
  freemarker:
    preferFileSystemAccess: false
```
## Application
启动类加上注释
```java
@EnableEurekaServer
@EnableFeignClients
@EnableEurekaClient
```
## FeignClient
```java
@FeignClient(name="sc")
public interface ScappFeignClient {
    @RequestMapping(value = "/sciUserInfo/queryOneById", method = RequestMethod.GET)
    String findById(@RequestParam(value = "suiId", required = false) Long suiId);
}

```