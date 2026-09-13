---
layout: mybatis-plus
title: Mybatis_plus使用笔记
date: 2020-03-27 14:54:35
tags: [MybatisPlus]
---
#使用Mybatis——plus 
## 使用通用模板
### 使用流程
- 实现层也要继承对应的实现类
- service层需要继承IService<实体类>
- mapper层继承对应的BaseMapper<实体类>
- ServiceImpl层继承ServiceImpl<对应的Mapper类, 实体类>
#### 实体类中 ID属性加注解
  @TableId(value = "spe_id", type = IdType.Auto)

| type                | function                  |
|---------------------|---------------------------|
| AUTO       | 主键自增（数据库中需要设置主键自增）        |   |   |
| NONE        | 默认 （跟随全局策略走）              |   |   |
| UUID        | UUID类型主键                  |   |   |
| ID\_WORKER | 数值类型 （数据库中也必须是数值类型 否则会报错） |   |   |
| ID\_WORKER\_STR | 字符串类型 （数据库也要保证一样字符类型）    |
| INPUT     | 用户自定义了  （数据类型和数据库保持一致就行） |
#### 全局主键策略实现

 需要在application.yml文件中添加
````yml
mybatis-plus:
  mapper-locations:
    - com/mp/mapper/*
  global-config:
    db-config:
      id-type: uuid/none/input/id_worker/id_worker_str/auto   表示全局主键都采用该策略（如果全局策略和局部策略都有设置，局部策略优先级高）
````
注意： 当设为自增时 saveOrUpdate时无法查重（每次id不一样 会自动自增）

## 使用 lambda 表达式 查询
### 条件构造器关系介绍
![](https://img-blog.csdn.net/20181001173726837?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3MDM0Mjk0/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
QueryWrapper  与 UpdateWrapper  都是Entity 对象封装操作类     
LambdaQueryWrapper 与 LambdaUpdateWrapper 是实现抽象类AbstractLambdaWrapper的子类 ： 用于Lambda语法使用的查询Wrapper
### 条件构造器使用中的各个方法格式和说明
![](https://img-blog.csdn.net/20181001202710403?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3MDM0Mjk0/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
### CRUD 例子
````java
    @Test
    public void delete() {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper
                .isNull("name")
                .ge("age", 12)
                .isNotNull("email");
        int delete = mapper.delete(queryWrapper);
        System.out.println("delete return count = " + delete);
    }

````
删除的查询条件为name字段为null的and年龄大于等于12的and email字段不为null的
```java
    @Test
    public void selectMaps() {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.isNotNull("name");
        List<Map<String, Object>> maps = mapper.selectMaps(queryWrapper);
        for (Map<String, Object> map : maps) {
            System.out.println(map);
        }
    }

    /**
     * 打印结果
     * {name=lqf, id=1046282328366391406, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391407, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391408, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391409, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391410, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391411, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391412, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391413, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391414, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391415, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391416, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391417, age=12, email=lqf@163.com, status=false}
     * {name=lqf, id=1046282328366391418, age=12, email=lqf@163.com, status=false}
     * json类型的键值对模式
     */
```
queryWrapper 实体对象封装操作类（为 null时查询所有信息）
```java

    /**
     * @param page         分页查询条件（可以为 RowBounds.DEFAULT）
     * @param queryWrapper 实体对象封装操作类（可以为 null）
     */
    @Test
    public void selectPage() {
        Page<User> page = new Page<>(1, 5);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();

        IPage<User> userIPage = mapper.selectPage(page, queryWrapper);
        System.out.println(userIPage);
    }
```
根据 entity 条件，查询全部记录（并翻页）
```java
    /**
     * @param entity        实体对象 (set 条件值,不能为 null)
     * @param updateWrapper 实体对象封装操作类（可以为 null,里面的 entity 用于生成 where 语句）
     */
    @Test
    public void update() {

        //修改值
        User user = new User();
        user.setStatus(true);
        user.setName("zhangsan");

        //修改条件s
        UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<>();
        userUpdateWrapper.eq("name", "lqf");

        int update = mapper.update(user, userUpdateWrapper);

        System.out.println(update);
    }
```
根据 whereEntity 条件，更新记录
## 使用 Mybatis-plus 自动生成实体类  
###  简单使用
#### 导入Maven依赖
```maven
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        <dependency>
            <groupId>org.freemarker</groupId>
            <artifactId>freemarker</artifactId>
        </dependency>
```
### 编写测试类
```java


import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.builder.ConfigBuilder;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.querys.MySqlQuery;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.FileType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * mybatis代码生成器
 */
// 演示例子，执行 main 方法控制台输入模块表名回车自动生成对应项目目录中
public class CodeGenerator {

    /**
     * <p>
     * 读取控制台内容
     * </p>
     */
    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotEmpty(ipt)) {
                return ipt;
            }
        }
        throw new MybatisPlusException("请输入正确的" + tip + "！");
    }

    public static void main(String[] args) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "/src/main/java");
        gc.setServiceName("%sService");//service 命名方式
        gc.setServiceImplName("%sServiceImpl");//service impl 命名方式
        // 自定义文件命名，注意 %s 会自动填充表实体属性！
        gc.setMapperName("%sMapper");
        gc.setXmlName("%sMapper");
        gc.setAuthor("cmx");
        gc.setOpen(false);
        // gc.setSwagger2(true); 实体属性 Swagger2 注解
        mpg.setGlobalConfig(gc);

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:oracle:thin:@xxx:xxx");
        // dsc.setSchemaName("public");
        dsc.setDriverName("oracle.jdbc.OracleDriver");
        dsc.setUsername("xxx");dsc.setPassword("xxx");
        mpg.setDataSource(dsc);

        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setModuleName(scanner("模块名"));
        pc.setParent("com.cmx.tcn");
        mpg.setPackageInfo(pc);

        // 自定义配置
        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                // to do nothing
            }
        };

        // 如果模板引擎是 freemarker
        String templatePath = "/templates/mapper.xml.ftl";
        // 如果模板引擎是 velocity
        // String templatePath = "/templates/mapper.xml.vm";

        // 自定义输出配置
        List<FileOutConfig> focList = new ArrayList<>();
        // 自定义配置会被优先输出
        focList.add(new FileOutConfig(templatePath) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                // 自定义输出文件名 ， 如果你 Entity 设置了前后缀、此处注意 xml 的名称会跟着发生变化！！
                return projectPath + "/src/main/resources/mapper/" + pc.getModuleName()
                        + "/" + tableInfo.getEntityName() + "Mapper" + StringPool.DOT_XML;
            }
        });
        /*
        cfg.setFileCreate(new IFileCreate() {
            @Override
            public boolean isCreate(ConfigBuilder configBuilder, FileType fileType, String filePath) {
                // 判断自定义文件夹是否需要创建
                checkDir("调用默认方法创建的目录");
                return false;
            }
        });
        */
        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);

        // 配置模板
        TemplateConfig templateConfig = new TemplateConfig();

        // 配置自定义输出模板
        //指定自定义模板路径，注意不要带上.ftl/.vm, 会根据使用的模板引擎自动识别
        // templateConfig.setEntity("templates/entity2.java");
        // templateConfig.setService();
        // templateConfig.setController();

        templateConfig.setXml(null);
        mpg.setTemplate(templateConfig);

        // 策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
//        strategy.setSuperEntityClass("com.baomidou.ant.common.BaseEntity");
        strategy.setEntityLombokModel(true);
        strategy.setRestControllerStyle(true);
//        strategy.setSuperControllerClass("com.baomidou.ant.common.BaseController");
        strategy.setInclude(scanner("表名，多个英文逗号分割").split(","));
//        strategy.setSuperEntityColumns("id");
        strategy.setControllerMappingHyphenStyle(true);
        strategy.setTablePrefix(pc.getModuleName() + "_");
        mpg.setStrategy(strategy);
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());
        mpg.execute();
    }

}

```
使用快捷键（ctrl+shift+F10）或者右键该类点击Run 运行代码 即可生成对应代码
### 常用参数
#### 设置Date策略
```java
    	AutoGenerator generator = new AutoGenerator();
		gc.setDateType(DateType.ONLY_DATE); // 时间策略 默认TIME_PACK
```
setDateType()可设置三种策略分别如下表：(数据库类型为datetime)

|           | ONLY\_DATE | SQL\_PACK | TIME\_PACK |
|-----------|------------|-----------|------------|
| 实体类对应数据类型 | Date       | Timestamp | Date       |

#### 自定义转换模板
模板语法官网:
[freemarker中文官方文档](http://freemaer.foofun.cn/dgui_quickstart_basics.html)
- 复制源码中默认的模板到entity.java.ftl文件至/main/resources/templates文件下方，重命名为entity2.java.ftl（ftl文件为freemarker模板）    
![查找源码模板](https://upload-images.jianshu.io/upload_images/8190955-061902949c8ba968.gif?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)
- 根据freemaeker语法修改模板    
导入Date包并修改为Date数据类型
```lombok.config
<#list table.fields as field>
    <#if (field.propertyType) =="LocalDateTime">
import java.util.Date;
    <#break>
    </#if>
</#list>
    <#if (field.propertyType) =="LocalDateTime">
    private Date ${field.propertyName};
    <#else>
    private ${field.propertyType} ${field.propertyName};
    </#if>
```
- Generator中设置模板路径

```java
		// 配置模板
		TemplateConfig templateConfig = new TemplateConfig();

		// 配置自定义输出模板
		//指定自定义模板路径，注意不要带上.ftl/.vm, 会根据使用的模板引擎自动识别
		 templateConfig.setEntity("templates/entity.java");
		// templateConfig.setService();
		// templateConfig.setController();

		templateConfig.setXml(null);
		generator.setTemplate(templateConfig);

		cfg.setFileOutConfigList(focList);
		generator.setCfg(cfg);
```

## mybatis-plus日志控制

## 开启日志

yml中配置中添加打印SQL配置：

在 **application.yml** 中 **mybatis-plus**下的 ** configuration:**下添加一行打印sql配置
```
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

```
添加mybatis-plus后整体配置为
```
mybatis-plus:
  type-aliases-package: com.sc.iot
  type-aliases-super-type: java.lang.Object
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true
    cache-enabled: true
    lazy-loading-enabled: true
    multiple-result-sets-enabled: true
    use-generated-keys: true
    default-statement-timeout: 60
    default-fetch-size: 100
```

### 日志生成路径

```
logging.path=/Users/jackie/workspace/rome/ 
logging.file=springbootdemo.log
```

- logging.path

该属性用来配置日志文件的路径

- logging.file

该属性用来配置日志文件名，如果该属性不配置，默认文件名为spring.log
重启项目后可以就可以看见 log文件了
![](http://images.zhuoke.xyz/5f042b8a3ca27.png)


