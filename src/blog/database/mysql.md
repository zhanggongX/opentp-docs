---
title: Mysql
category:
  - 数据库
order: 1
tag:
  - 数据库
  - mysql
---

### 数据库三大范式
1NF 第一范式：属性不可再分，确保每列的数据原子性。  
2NF 第二范式：在1NF基础上，确保表中的列都和主键相关，非主属性必须完全依赖于主键，主要意思是一个表中只能保存一种数据，不可以把多种数据保存在同一张数据库表中，例如主订单表，就只放主订单数据。商品相关放订单商品表或者叫自订单表中，如果都放在主订单表中，主订单表将会有很多重复的无意义的数据。  
3NF 第三范式：在2NF基础上，确保每列都和主键列直接相关，而不是间接相关，比如订单表不能存在用户信息，仅添加用户ID即可。  
>当然实际开发中也会用到反范式的情况，偶尔增加1、2个冗余字段，使得查询效率大大提高。

### 数据库查询语言
#### DDL：
Data Defainition Language 数据定义语言，主要是建表、改表、删表。
```sql
-- 创建表：
CREATE TABLE tab_name (
  id     		int         NOT NULL AUTO_INCREMENT COMMENT '主键',
  uid 			int         NOT NULL COMMENT '唯一流水id',
  name			varchar(20) NOT NULL DEFAULT '' COMMENT '名称',
  create_time	datetime    DEFAULT '1000-01-01 00:00:00' COMMENT '创建时间',
  update_time 	timestamp   default current_timestamp on update current_timestamp COMMENT '更新时间(会自动更新，不需要刻意程序更新)',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_uid (uid),
  KEY idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新建表注释';

-- 删表
DROP TABLE table_name;

-- 改表
-- 添加字符串型字段：
ALTER TABLE tab_name ADD col_name varchar(16) NOT NULL DEFAULT '' COMMENT '备注' AFTER  had_col_name;
-- 添加整型字段：
ALTER TABLE tab_name ADD col_name bigint  NOT NULL DEFAULT 0 COMMENT '备注' AFTER  had_col_name;
-- 添加加多个字段
ALTER TABLE tab_name 
	ADD col_1  varchar(10) NOT NULL DEFAULT '' COMMENT '备注' ,
	ADD col_2  varchar(20) NOT NULL DEFAULT '' COMMENT '备注' ;

-- 改字段类型
-- 主键由int(11)改为bigint(20)
ALTER TABLE tab_name MODIFY id bigint(20) NOT NULL AUTO_INCREASEMENT COMMENT '主键';
-- 单字段：
ALTER TABLE tab_name MODIFY COLUMN col_name bigint DEFAULT 0 COMMENT '备注';
-- 多字段：
ALTER TABLE tab_name MODIFY COLUMN col_name bigint DEFAULT 0 COMMENT '备注', MODIFY COLUMN col_name_1 bigint DEFAULT 0 COMMENT '备注';
-- 改字段备注
ALTER TABLE tab_name MODIFY COLUMN  col_name varchar(10) DEFAULT 0 COMMENT '改备注';
-- 改字段默认值
ALTER TABLE tab_name MODIFY COLUMN col_name bigint DEFAULT 100 COMMENT '备注';
-- 调整字段顺序
ALTER TABLE tab_name MODIFY COLUMN col_name bigint DEFAULT 100 COMMENT '备注' after other_col_name;
-- 改字段名称
ALTER TABLE tab_name CHANGE col_name new_col_name bigint DEFAULT 0 COMMENT '备注';
-- 加普通索引
ALTER TABLE tab_name ADD INDEX idx_col_col2 (col_name, col_name_1);
-- 加唯一索引
ALTER TABLE tab_name ADD UNIQUE uniq_name (col_name);
-- 改表备注
ALTER TABLE tab_name COMMENT='表备注';
-- 修改表自增值【必须比实际存储自增字段的最大值大】
ALTER TABLE tab_name auto_increment=xxx;
-- 改变表所有的字符列的字符集到一个新的字符集(示例为改为utf8mb4)
alter table tab_name convert to character set utf8mb4;

-- 删字段
-- 删一个字段
ALTER TABLE tab_name DROP COLUMN col_name;
-- 删多个字段
ALTER TABLE tab_name DROP COLUMN col_nam1, DROP COLUMN col_nam2;
-- 删除索引
ALTER TABLE tab_name DROP INDEX uniq_name;
```


#### DML
Data manipulation Language 数据库控制语言
```sql
-- insert
insert into table_name (col_name1, col_name2) values ('aa', 1),('bb', 2),('cc', 3);
-- insert update 
insert into table_name (col1, col2) values ('a', 1) on on duplicate key update col1 = values(col1), col2 = values(col2);

update table_name set col_name = 'aa' where id = xx;
delete table_name where id = xx;
```
#### DQL
Date Query Language 数据库查询语言
```sql
select a,b,c from table_name where id = xx;
group by 
having 
order by 
limit 1,1
```
> where 和 having 的区别
where 用于过滤，过滤后的数据才能参加聚合函数。即 where 在 group by 之前。
having 过滤分组，一般和 group by 配合使用，having 用来过滤分组后的数据。

#### DCL
Data Control Language 数据控制语句(dba 使用)
```sql
-- 分配权限给用户
grate 
-- 删除权限
revoke
```

### drop、truncate、delete 
delete 删除数据会产生 binlog 日志，当然就可以恢复数据。  
drop 直接删除表。  
truncate 相当于删除表然后重建表，不产生数据日志。  

### char 和 varchar 
1. char 是定长字符串，用来存储电话号，身份证号等长度一致的字符串。
2. varchar 是变长字符串，用来存储姓名，标题等内容。
3. char 如果存入的内容长度不到定义长度，会在右边填充空格，但是搜索时会去掉空格。
4. varchar 存储时需要一个或两个额外**字节**记录字符串的长度，搜索时不需要处理。
5. varchar 并不是设置的越大越好，请设置合理的长度，因为它虽然是变长的，设置的较大时不会占用资盘空间，但是搜索时 varchar 在内存中通常分配设置的大小的内存快来保存，例如排序时 varchar 就是按照设置的长度进行的，所以要设置合理的长度。

### mysql 不建议存储 TEXT 和 BLOB
TEXT 类型类似于 CHAR（0-255 字节）和 VARCHAR（0-65,535 字节），但可以存储更长的字符串，即长文本数据。  
TINYTEXT(0-255) / TEXT(0-65535)  / MEDIUMTEXT(0-16MB) / LONGTEXT(0-4GB)  

为什么不建议使用：
1. 不能有默认值
2. 无法使用内存临时表
3. 只能使用前缀索引
4. 消耗大量网络IO
5. DML 可能变慢

并不是不允许存储这两种内容的字段，如果真的需要可以单独建表存储，如果内容过大，还是建议使用对象存储。

### 为什么不建议使用 NULL
1. 不能使用 = 判断，只能使用 is NULL \ is not NULL  
2. 值不确定 select NULL = NULL 结果为 false;
3. 聚合函数会忽略 NULL
4. Count 函数如果 count(*) 会统计到 NULL 的行，如果 count(列) 则统计不到 NULL 的行，导致结果不一致。
5. '' 不占用空间， NULL 反而占用空间。

### Mysql SQL 执行过程
连接器 -> (缓存) -> 分析器 -> 优化器 -> 执行器 -> 存储引擎。
- 连接器 链接权限认证
- 缓存 8.0 已弃用，建议关闭
- 分析器 sql 解析
- 优化器 sql 解析后生成最优执行方案
- 插件式存储引擎 数据的存储和读取

### Mysql 存储引擎
5.5 之前默认是 MyISAM 5.5 之后是 InnoDB。现在几乎都是使用 InnoDB
两者的区别：
1. 是否支持事务。
2. 是否支持表锁。
3. 是否支持外键。
4. 是否支持 MVCC。
5. 是否支持数据恢复。  

毫无疑问：上边几种 InnoDB 支持 MyISAM 都不支持。