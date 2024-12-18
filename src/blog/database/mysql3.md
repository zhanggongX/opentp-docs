---
title: MySQL进阶3
category:
  - 数据库
order: 4
tag:
  - 数据库
  - mysql
---

## Explain

### 示例
```sql
EXPLAIN SELECT * FROM users WHERE username = 'zhangsan';
```

`EXPLAIN` 的输出如下：

```
+----+-------------+-------+------------+------+---------------+---------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key     | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+---------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | users | NULL       | ref  | idx_username  | idx_username | 102   | const |    1 |   100.00 | Using where |
+----+-------------+-------+------------+------+---------------+---------+---------+-------+------+----------+-------------+
```

- `id`：`1`，表示这个查询是一个简单查询。对于复杂的查询，如带有子查询或联合查询的，`id` 值可能会不同。
- `select_type`：`SIMPLE`，表示这是一个没有子查询的简单查询。
- `table`：`users`，查询的表是 `users`。
- `type`：`ref`，表示使用了索引扫描 *** 。
- `possible_keys`：`idx_username`，表示可能使用的索引是 `idx_username`。
- `key`：`idx_username`，实际使用的索引是 `idx_username`。
- `key_len`：`102`，表示索引键的长度是 102 字节。
- `ref`：`const`，表示查询条件是一个常量。
- `rows`：`1`，表示预计扫描 1 行。
- `filtered`：`100.00`，表示过滤条件通过的百分比是 100%。
- `Extra`：`Using where`，表示查询使用了 `WHERE` 条件过滤。

### select_type：`SELECT` 语句的类型，表示查询的类型。常见的类型有：
  - `SIMPLE`：简单查询，不包含子查询或联合查询。
  - `PRIMARY`：主查询，即最外层的查询。
  - `UNION`：`UNION` 操作的第二个或后续的查询。
  - `DEPENDENT UNION`：依赖于外部查询的 `UNION`。
  - `SUBQUERY`：子查询。
  - `DEPENDENT SUBQUERY`：依赖于外部查询的子查询。
  - `DERIVED`：派生表（临时表）。

### type：表访问方式，表示 MySQL 如何查找满足条件的行。访问方式的效率从高到低包括：
  - `system`：系统表，表中只有一行。
  - `const`：常量表，表中最多有一个匹配行。
  - `eq_ref`：唯一索引扫描，对于每个索引键值访问一个表中的一行。
  - `ref`：非唯一索引扫描，返回所有匹配的行。
  - `range`：索引范围扫描。
  - `index`：全索引扫描。
  - `ALL`：全表扫描。

### Extra：额外的信息，描述查询执行的详细情况。常见的值包括：
  - `Using index`：查询使用了覆盖索引。
  - `Using where`：查询使用了 `WHERE` 条件过滤。
  - `Using temporary`：查询使用了临时表。
  - `Using filesort`：查询使用了文件排序，表示需要额外的排序步骤。

## 分库分表
## 深度分页
## 冷热数据
## 数据库优化


## 参考
[深入理解 Mysql 索引底层原理](https://zhuanlan.zhihu.com/p/113917726)  
[next-key锁定范围](https://segmentfault.com/a/1190000040129107)  
[索引之道](https://juejin.cn/post/7161964571853815822)  
[MySQL 是怎样运行的：从根儿上理解 MySQL](https://relph1119.github.io/mysql-learning-notes/#/)
[两万字详解InnoDB的锁](https://juejin.cn/post/7094049650428084232)