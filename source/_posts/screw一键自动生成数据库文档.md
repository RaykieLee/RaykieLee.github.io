---
layout: butterfly
title: screw一键自动生成数据库文档
date: 2020-11-25 22:49:35
tags: [tool]
---

# screw 一键自动生成数据库文档！

screw 是最久在gitee看见的一个生成数据库文档的工具，简单实用体验后感觉非常简洁舒服

## 配置

###  

如果只是想简单的使用 screw 是不需要配置application.yml，只需要配置 **pom.xml**即可

- **引入依赖**

```
<dependency>
    <groupId>cn.smallbun.screw</groupId>
    <artifactId>screw-core</artifactId>
    <version>${lastVersion}</version>
 </dependency>
```

- ### Maven 插件编写代码

  ```
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
              <plugin>
                  <groupId>cn.smallbun.screw</groupId>
                  <artifactId>screw-maven-plugin</artifactId>
                  <version>1.0.3</version>
                  <dependencies>
                      <!-- HikariCP -->
                      <dependency>
                          <groupId>com.zaxxer</groupId>
                          <artifactId>HikariCP</artifactId>
                          <version>3.4.5</version>
                      </dependency>
                      <!--mysql driver-->
                      <dependency>
                          <groupId>mysql</groupId>
                          <artifactId>mysql-connector-java</artifactId>
                          <version>8.0.20</version>
                      </dependency>
                  </dependencies>
                  <configuration>
                      <!--username-->
                      <username>root</username>
                      <!--password-->
                      <password>password</password>
                      <!--driver-->
                      <driverClassName>com.mysql.cj.jdbc.Driver</driverClassName>
                      <!--jdbc url-->
                      <jdbcUrl>jdbc:mysql://localhost:3306/mall?characterEncoding=UTF-8&amp;useUnicode=true&amp;useSSL=false&amp;tinyInt1isBit=false&amp;serverTimezone=Asia/Shanghai</jdbcUrl>
                      <!--生成文件类型-->
                      <fileType>MD</fileType>
                      <!--打开文件输出目录-->
                      <openOutputDir>false</openOutputDir>
                      <!--生成模板-->
                      <produceType>freemarker</produceType>
                      <!--文档名称 为空时:将采用[数据库名称-描述-版本号]作为文档名称-->
                      <!--<docName>测试文档名称</docName>-->
                      <!--描述-->
                      <description>数据库文档生成</description>
                      <!--版本-->
                      <version>${project.version}</version>
                      <!--标题-->
                      <title>数据库文档</title>
                  </configuration>
                  <executions>
                      <execution>
                          <phase>compile</phase>
                          <goals>
                              <goal>run</goal>
                          </goals>
                      </execution>
                  </executions>
              </plugin>
          </plugins>
      </build>
      
  ```

> url中的&需要用 ``&amp;`` 转义

## 运行

配置完以后在 `maven` 中双击`Plugins ->screw-> screw:run`

![image-20201026104023277](http://images.zhuoke.xyz/img/image-20201026104023277.png)

![image-20201026105438795](http://images.zhuoke.xyz/img/image-20201026105438795.png)