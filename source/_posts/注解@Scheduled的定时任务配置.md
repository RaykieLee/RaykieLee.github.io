title: 注解@Scheduled的定时任务配置
date: 2020-07-01 23:25:48
tags: [SpringBoot,定时任务]
layout: post

------------
# 注解@Scheduled的定时任务配置

在SpringBoot为我们内置了@Scheduled定时任务，添加相应的注解即可开启定时任务。
## 在入口程序类添加注解@EnableScheduling开启功能自动扫描
![](http://172.16.99.11:25015/server/../Public/Uploads/2020-06-17/5ee9d66b33806.png)
## 新建一个任务类


- 要在任务的类上写@Component
- 要在任务方法上写@Scheduled


```
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class Jobs {
    //表示方法执行完成后5秒
    @Scheduled(fixedDelay = 5000)
    public void fixedDelayJob() throws InterruptedException {
        System.out.println("fixedDelay 每隔5秒" + new Date());
    }

    //表示每隔3秒
    @Scheduled(fixedRate = 3000)
    public void fixedRateJob() {

        System.out.println("fixedRate 每隔3秒" + new Date());
    }

    //表示每天8时30分0秒执行
    @Scheduled(cron = "0 0,30 0,8 ? * ? ")
    public void cronJob() {
        System.out.println(new Date() + " ...>>cron....");
    }
}
```

## 设置定时任务时间间隔的三种方式
### fixedDelay
表示定时任务运行结束后才开始计时
### fixedRate
与任务运行时长无关
### cron时间表达式
设置每天或每小时每分钟等时间间隔来执行
cron表达式语法
```[秒] [分] [小时] [日] [月] [周] [年]```
cron一共有7位，但是最后一位是年，可以留空，所以我们可以写6位：
```
* 第一位，表示秒，取值0-59
* 第二位，表示分，取值0-59
* 第三位，表示小时，取值0-23
* 第四位，日期天/日，取值1-31
* 第五位，日期月份，取值1-12
* 第六位，星期，取值1-7，星期一，星期二...，注：不是第1周，第二周的意思
          另外：1表示星期天，2表示星期一。
* 第7为，年份，可以留空，取值1970-2099
```
举例：
```
0 */5 * * * ?   每5分钟执行
0 0 3 * * ?     每天3点执行
0 5 3 * * ?     每天3点5分执行
0 5 3 ? * *     每天3点5分执行，与上面作用相同
0 5/10 3 * * ?  每天3点的 5分，15分，25分，35分，45分，55分这几个时间点执行
0 10 3 ? * 1    每周星期天，3点10分 执行，注：1表示星期天    
0 10 3 ? * 1#3  每个月的第三个星期，星期天 执行，#号只能出现在星期的位置
```
[参考原文](https://www.jianshu.com/p/9d18039c0f08 "参考原文")


