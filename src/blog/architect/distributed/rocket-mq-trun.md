---
title: RocketMQ实现最终一致性事务
category:
  - 分布式
order: 8
tag:
  - distributed
  - 分布式事务
  - 柔性事务
---

## 使用 RocketMQ
### 部署

[docker部署参考1](https://juejin.cn/post/7218438764100108325)  
[docker部署参考2](https://www.cnblogs.com/d1012181765/p/15603378.html)

由于我手头上只有一款 ARM 的 MAC，docker 上没找到支持 M1的 image 所以只能本地部署。  
[官方部署参考](https://rocketmq.apache.org/zh/docs/deploymentOperations/01deploy)  
[官方包下载链接](https://rocketmq.apache.org/zh/download/)
```java
// 下载
rocketmq-all-5.2.0-bin-release
// 解压之后进入 bin 目录


// 1. 启动 nameServer
nohup sh mqnamesrv &
// 启动成功
cat nohup.out 打印： 
The Name Server boot success. serializeType=JSON, address 0.0.0.0:9876

// 2. 启动borker+proxy
// 要先安装好 JDK
nohup sh mqbroker -n localhost:9876 --enable-proxy &
// 启动成功
rocketmq-proxy startup successfully


// 3. 创建事务主题
sh mqadmin updatetopic -n localhost:9876 -t TestTopic -c DefaultCluster
sh mqadmin updateTopic -n localhost:9876 -t TransactionTestTopic -c DefaultCluster -a +message.type=TRANSACTION
// message.type = Normal(默认), FIFO, Delay, Transaction
// 创建事务主题成功
create topic to localhost:10911 success.
TopicConfig [topicName=TransactionTestTopic, readQueueNums=8, writeQueueNums=8, perm=RW-, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false, attributes={+message.type=TRANSACTION}]

```

## 实现柔性事务
业务介绍：  
差旅系统接收第三方系统调用传入出差单信息，差旅系统再去同步信息给第三方，发送通知等。

### 依赖
```java
<dependencies>
        <dependency>
            <groupId>org.apache.rocketmq</groupId>
            <artifactId>rocketmq-spring-boot-starter</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.7.18</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
            <version>2.7.18</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>
```
### 配置
```java
spring:
  datasource:
    username: root
    password: mysql
    url: jdbc:mysql://127.0.0.1:3306/travel?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true&useSSL=false&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver

server:
  port: 8888

#rocketmq配置信息
rocketmq:
  name-server: localhost:9876
  producer:
    group: travel-producer
  consumer:
    group: travel-consumer
```

### 表设计
```java
/**
 * 流程数据
 */
public class ProcessData {
    private long id;
    private String processNo;
    private String userName;
    private String tripCity;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean deleted;
    private LocalDateTime createTime;
}

/**
 * 事务日志
 */
public class tranLog {
    private long id;
    private String tranType;
    private long tranId;
}
```

### 请求入口
```java
@RequestMapping("process/data")
@RestController
public class ProcessDataController {

    @Resource
    private ProcessDataService processDataService;

    @GetMapping("submit")
    public String submitData(ProcessData processData) {
        processDataService.submit(processData);
        return "success";
    }
}
```
### 业务实现
```java
@Service
public class ProcessDataServiceImpl implements ProcessDataService {

    private final String topic = "TransactionTestTopic";

    private final static AtomicLong idGen = new AtomicLong(1);
    @Resource
    private TransactionProducer transactionProducer;
    @Resource
    private JdbcTemplate jdbcTemplate;

    /**
     * 发送事务消息
     */
    @Override
    public void submit(ProcessData processData) {
        if (StringUtils.isEmpty(processData.getProcessNo())) {
            System.out.println("processNo不能为空");
            return;
        }
        boolean sendRes = transactionProducer.send(topic, JSON.toJSONString(processData));
        if (sendRes) {
            System.out.println("发送消息成功");
        } else {
            System.out.println("发送失败处理");
        }
    }

    /**
     * 处理本地事务
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void doSubmit(ProcessData processData) {
        // 随便造的数据
        processData.setId(idGen.getAndIncrement());
        processData.setUserName("user");
        processData.setTripCity("bj");
        processData.setStartDate(LocalDate.now());
        processData.setEndDate(LocalDate.now());
        processData.setDeleted(false);
        processData.setCreateTime(LocalDateTime.now());
        String sql = "insert into process_data(id, process_no, user_name, trip_city, start_date, end_date, deleted, create_time) values (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, processData.getId(), processData.getProcessNo(), processData.getUserName(), processData.getTripCity(), processData.getStartDate(), processData.getEndDate(), processData.isDeleted(), processData.getCreateTime());

        // 记录事务日志
        String tranSql = "insert into tran_log (id, tran_type, tran_id) values (?, ?, ?)";
        jdbcTemplate.update(tranSql, idGen.getAndIncrement(), "processData", processData.getProcessNo());
    }
}
```

### 事务消息发送
```java
@Component
public class TransactionProducer {

    @Resource
    private RocketMQTemplate rocketMQTemplate;

    /**
     * 发送事务消息
     *
     * @param topic 主题
     * @param msg   消息
     * @return 状态
     */
    public boolean send(String topic, String msg) {
        TransactionSendResult result = rocketMQTemplate.sendMessageInTransaction(topic, MessageBuilder.withPayload(msg).build(), null);
        return SendStatus.SEND_OK == result.getSendStatus();
    }
}
```

### 事务消息检查
```java
@RocketMQTransactionListener
public class TransactionListener implements RocketMQLocalTransactionListener {

    @Resource
    private ProcessDataService processDataService;
    @Resource
    private JdbcTemplate jdbcTemplate;

    /**
     * 执行本地事务
     *
     * @param message 消息
     * @param o       ext message
     * @return 本地事务状态
     */
    @Override
    public RocketMQLocalTransactionState executeLocalTransaction(Message message, Object o) {
        String str = new String((byte[]) message.getPayload(), StandardCharsets.UTF_8);
        System.out.println("执行本地事务： " + str);
        ProcessData processData = JSON.parseObject(str, ProcessData.class);
        try {
            // 执行消息
            processDataService.doSubmit(processData);
            // 执行成功
            return RocketMQLocalTransactionState.UNKNOWN;
        } catch (Exception e) {
            e.printStackTrace();
            // 执行异常
            return RocketMQLocalTransactionState.ROLLBACK;
        }
    }

    /**
     * 检查本地事务
     *
     * @param message 消息
     * @return 本地事务状态
     */
    @Override
    public RocketMQLocalTransactionState checkLocalTransaction(Message message) {
        String str = new String((byte[]) message.getPayload(), StandardCharsets.UTF_8);
        System.out.println("本地事务检查： " + str);
        ProcessData processData = JSON.parseObject(str, ProcessData.class);

        Integer count = jdbcTemplate.queryForObject("select count(1) from tran_log where tran_id = " + processData.getProcessNo(), Integer.class);
        System.out.println(count);
        if (count != null && count > 0) return RocketMQLocalTransactionState.COMMIT;
        else return RocketMQLocalTransactionState.UNKNOWN;
    }
}
```

### 消息消费
```java
Component
@RocketMQMessageListener(consumerGroup = "travel-consumer", topic = "TransactionTestTopic", messageModel = MessageModel.CLUSTERING)
public class TransactionConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String message) {
        System.out.println("消息消费：" + message);

        ProcessData processData = JSON.parseObject(message, ProcessData.class);
        // 执行信息同步其他平台
        System.out.println("信息同步");
        // 执行信息推送
        System.out.println("信息推送");
    }
}
```

## 测试
### 正常结果
```java
// 1. 事务消息发送成功
发送消息成功
// 2. 开始执行本地事务
执行本地事务： {"deleted":false,"id":0,"processNo":"11111"}
// 3. 消费端拿到消息
消息消费：{"deleted":false,"id":0,"processNo":"11111"}
// 4. 执行其他业务
信息同步
信息推送
```

### 模拟异常
```java
// 一，故意把执行本地事务的方法中的sql写错。
// 1. 事务消息发送成功
发送消息成功
// 2. 执行本地事务
执行本地事务： {"deleted":false,"id":0,"processNo":"222"}
// 此时抛出异常，返回了 Callback 给 rockmq, 事务中断，此时数据库无数据新增。
// 可以做服务降级，记录异常，人工处理。

// 二，事务成功不返回 RocketMQLocalTransactionState.COMMIT
// 1. 发送事务消息成功
发送消息成功
// 2. 执行回调，此处返回 RocketMQLocalTransactionState.UNKOWN
执行本地事务： {"deleted":false,"id":0,"processNo":"222"}
// 3. 执行本地事务检查，查看事务 log，log 内有内容，返回 RocketMQLocalTransactionState.COMMIT
本地事务检查： {"deleted":false,"id":0,"processNo":"222"}
// 4. 消息消费
消息消费：{"deleted":false,"id":0,"processNo":"222"}
// 5. 下游服务处理。
信息同步
信息推送

```

## 总结
以上就是rocketMQ的事务消息实例。  
JDK1.8  
使用 rocketmq-spring-boot-starter。  
[代码地址](https://github.com/zhanggongX/research/tree/master/rocketMQ)