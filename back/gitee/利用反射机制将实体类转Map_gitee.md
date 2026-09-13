---
layout: butterfly
title: 利用反射机制将实体类转Map
date: 2020-06-03 14:00:44
tags: java
---
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

