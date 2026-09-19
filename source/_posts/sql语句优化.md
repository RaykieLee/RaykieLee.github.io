---
layout: post
title: sql语句优化
date: 2020-06-27 17:42:43
tags: [sql]
---
# 单表优化
将日常工作或平时看到的sql的语句优化汇总 总结。暂时只是 记录了简单的的sql调优，对于数据库单表的分库分表以后有空再总结记录一下吧。
## 索引
- 索引并不是越多越好，要根据查询有针对性的创建，考虑在WHERE和ORDER BY命令上涉及的列建立索引，可根据EXPLAIN来查看是否用了索引还是全表扫描索引并不是越多越好，索引固然可以提高相应的 select 的效率，但同时也降低了 insert 及 update 的效率，因为 insert 或 update 时有可能会重建索引，所以怎样建索引需要慎重考虑，视具体情况而定。一个表的索引数最好不要超过6个，若太多则应考虑一些不常使用到的列上建的索引是否有必要。
- 值分布很稀少的字段不适合建索引，例如"性别"这种只有两三个值的字段
- 字符字段只建前缀索引
- 字符字段最好不要做主键
- 不用外键，由程序保证约束
- 尽量不用UNIQUE，由程序保证约束
使用多列索引时主意顺序和查询条件保持一致，同时删除不必要的单列索引
## 字段
- 尽量使用TINYINT、SMALLINT、MEDIUM_INT作为整数类型而非INT，如果非负则加上UNSIGNED
VARCHAR的长度只分配真正需要的空间
- 使用枚举或整数代替字符串类型
- 尽量使用TIMESTAMP而非DATETIME，
- 单表不要有太多字段，建议在20以内
- 避免使用NULL字段，很难查询优化且占用额外索引空间
- 用整型来存IP
## 查询SQL


### 表名顺序 
数据库的解析器按照从右到左的顺序处理FROM子句中的表名，FROM子句中写在最后的表将被最先处理，在FROM子句中包含多个表的情况下,你必须选择记录条数最少的表放在最后，如果有3个以上的表连接查询,那就需要选择那个被其他表所引用的表放在最后。

例如：查询员工的编号，姓名，工资，工资等级，部门名


```
select emp.empno,emp.ename,emp.sal,salgrade.grade,dept.dname
from salgrade,dept,emp
where (emp.deptno = dept.deptno) and (emp.sal between salgrade.losal and salgrade.hisal)
```
- 如果三个表是完全无关系的话，将记录和列名最少的表，写在最后，然后依次类推  
- 如果三个表是有关系的话，将引用最多的表，放在最后，然后依次类推

### WHERE
#### 连接顺序
数据库采用自右而左的顺序解析WHERE子句,根据这个原理,表之间的连接必须写在其他WHERE条件之左,那些可以过滤掉最大数量记录的条件必须写在WHERE子句的之右。

例如：查询员工的编号，姓名，工资，部门名
```
select emp.empno,emp.ename,emp.sal,dept.dname
from emp,dept
where (emp.deptno = dept.deptno) and (emp.sal > 1500)
```
#### 操作符
应尽量避免在 where 子句中使用!=或<>操作符，否则将引擎放弃使用索引而进行全表扫描。
#### null 值判断
应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：
```sql
select id from t where num is null
```

可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：
```sql
select id from t where num=0
```
#### like 
下面的查询也将导致全表扫描：
select id from t where name like '%abc%'
若要提高效率，可以考虑全文检索。(mysql的话 没救了 )

#### 避免使用参数
如果在 where 子句中使用参数，也会导致全表扫描。因为SQL只有在运行时才会解析局部变量，但优化程序不能将访问计划的选择推迟到运行时；它必须在编译时进行选择。然而，如果在编译时建立访问计划，变量的值还是未知的，因而无法作为索引选择的输入项。如下面语句将进行全表扫描：
```sql
select id from t where num=@num
```
可以改为强制查询使用索引：
```sql
select id from t with(index(索引名)) where num=@num
```
#### 避免对字段进行表达式操作
应尽量避免在 where 子句中对字段进行表达式操作，这将导致引擎放弃使用索引而进行全表扫描。如：
```sql
select id from t where num/2=100
```
应改为:
```sql
select id from t where num=100*2
```
#### 避免对字段进行函数操作

应尽量避免在where子句中对字段进行函数操作，这将导致引擎放弃使用索引而进行全表扫描。如：
```sql
select id from t where substring(name,1,3)='abc'--name以abc开头的id

select id from t where datediff(day,createdate,'2005-11-30')=0--'2005-11-30'生成的id
```
应改为:
```sql
select id from t where name like 'abc%'

select id from t where createdate>='2005-11-30' and createdate<'2005-12-1'
```
### 尽量使用 exists 代替 in 
多时候用 exists 代替 in 是一个好的选择：
```sql
select num from a where num in(select num from b)
```
用下面的语句替换：
```sql
select num from a where exists(select 1 from b where num=a.num)
```
### SELECT
#### 避免使用*号

数据库在解析的过程中,会将*依次转换成所有的列名，这个工作是通过查询数据字典完成的，这意味着将耗费更多的时间

```
select empno,ename from emp;
```
#### OR改写成IN
OR的效率是n级别，IN的效率是log(n)级别，in的个数建议控制在200以内
#### in 和 not in 
in 和 not in  也要慎用，否则会导致全表扫描，如：
```sql
select id from t where num in(1,2,3)
```
对于连续的数值，能用 between 就不要用 in 了：
```sql
select id from t where num between 1 and 3
```
### 尽量使用表变量来代替临时表。
尽量使用表变量来代替临时表。如果表变量包含大量数据，请注意索引非常有限（只有主键索引）。


参考网址
https://www.cnblogs.com/Little-Li/p/8031295.html
