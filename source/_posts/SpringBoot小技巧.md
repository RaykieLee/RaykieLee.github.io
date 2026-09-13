---
layout: butterfly
title: SpringBoot小技巧
date: 2020-06-03 15:21:18
tags: SpringBoot
---
### Controller 接收时间
```java
@RequestParam(value = "date", required = false)@DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date;
```
@DateTimeFormat来控制入参，@JsonFormat来控制出参
@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")  

原文链接：https://blog.csdn.net/xiangluer/article/details/81913137
### 利用反射机制将实体类转Map
在Controller返回时需要在一个对象中加一个字段属性 ，又不想改动对应的实体类增加属性，于是将对象利用反射机制将实体类转Map再添加kay-value。
```java
    public static Map<String,Object> objectToMap(Object object){
        Map<String,Object> result=new HashMap<>();
        //获得类的的属性名 数组
        Field[]fields=object.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                //使用Modifier 判断过滤私有属性
                if (Modifier.isPrivate(field.getModifiers())) {
                    String name = new String(field.getName());
                    result.put(name, field.get(object));
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return result;
    }
```

### 在spring boot 调用 cmd 命令

```java
System.out.println(AreaUtil.camelName("ioaName"));
Runtime runtime = Runtime.getRuntime();
Process p = null;
try {
    //此处执行的是ipconfig命令，可以换成任何cmd 里的命令。
    p = runtime.exec("cmd /c ipconfig /all");
    System.out.println(AreaUtil.camelName("ioaName"));
    BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream(), "GBK"));
    String line = null;
    while ((line = reader.readLine()) != null) {
        System.out.println(line + "\n");
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (p != null) {
        p.destroy();
    }
}
System.out.println("do soming" + Calendar.getInstance().getTime());
```

