---
title: 数据脱敏
category:
  - 数据安全
order: 2
tag:
  - 数据安全
  - 数据脱敏
---


## 数据脱敏
数据脱敏是通过改变敏感数据，使其在保留数据格式和功能的前提下失去真实意义的一种保护方法。数据脱敏广泛应用于测试环境、开发环境和数据分析场景，以确保敏感信息不被泄露。  
> 常见的数据脱敏场景:  
> 开发和测试环境：在开发和测试环境中使用脱敏数据，避免因真实数据泄露而导致的安全风险。  
> 数据分析：在数据分析和数据挖掘中使用脱敏数据，保护客户隐私。  
> 数据共享：在数据共享和数据交换中使用脱敏数据，确保数据接收方无法获取敏感信息。  
> 合规要求：满足各种数据隐私保护法律法规的要求等。  


## 数据脱敏的主要方法
- 字符替换：用随机字符或固定字符替换原始数据。例如，将信用卡号"1234 5678 9101 1121"替换为"XXXX XXXX XXXX 1121"。
- 数据混淆：打乱数据的顺序，使其失去原有意义。例如，将电话号码"123-456-7890"替换为"890-123-4567"。
- 数据加密：将数据通过加密算法转换为密文形式，需要解密密钥才能恢复原始数据。例如，将社保号码加密存储。
- 数据泛化：将精确数据替换为范围数据。例如，将年龄"33"替换为"30-40"。
- 数据删除：删除数据中的敏感字段。例如，删除姓名、地址等敏感信息。
- 数据置换：将数据替换为类似但不敏感的数据。例如，将真实姓名替换为常用的假名。
- 数据遮盖：对数据的部分内容进行遮盖，使其部分可见。例如，将电子邮件地址"abc@example.com"显示为"a**@example.com"。


## 常用脱敏工具
### jfairy
jfairy是一个Java库，用于生成虚假数据，包括名字、地址、信用卡号码等，简单易用，适用于生成脱敏数据进行测试，当需要生成虚假数据来替代真实敏感数据时比较合适。  
```java
import io.codearte.jfairy.Fairy;
import io.codearte.jfairy.producer.person.Person;

public class JFairyExample {
    public static void main(String[] args) {
        Fairy fairy = Fairy.create();
        Person person = fairy.person();

        System.out.println("Name: " + person.getFullName());
        System.out.println("Email: " + person.getEmail());
        System.out.println("Address: " + person.getAddress().getAddressLine1());
    }
}
```

### Apache Commons Lang
Apache Commons Lang提供了丰富的工具类，包括随机字符串生成器，可以用于简单的数据脱敏，适用于简单的字符替换和数据混淆。
```java
import org.apache.commons.lang3.RandomStringUtils;

public class CommonsLangExample {
    public static void main(String[] args) {
        String maskedEmail = maskEmail("abc@example.com");
        System.out.println("Masked Email: " + maskedEmail);
    }

    public static String maskEmail(String email) {
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];

        String maskedLocalPart = localPart.substring(0, 1) + 
            RandomStringUtils.randomAlphanumeric(localPart.length() - 2) + 
            localPart.substring(localPart.length() - 1);

        return maskedLocalPart + "@" + domain;
    }
}
```
### htool
HTool 是一个轻量级的工具库，提供了多种脱敏策略和工具。

```xml
<dependency>
    <groupId>com.github.houbb</groupId>
    <artifactId>htool</artifactId>
    <version>1.0.5</version>
</dependency>

```

```java
import com.github.houbb.sensitive.core.api.SensitiveUtil;
import com.github.houbb.sensitive.core.support.sensitive.SensitiveTypeEnum;

public class HToolDataMaskingExample {

    public static void main(String[] args) {
        // 原始数据
        String creditCardNumber = "1234-5678-9101-1121";
        String phoneNumber = "123-456-7890";
        String email = "abc@example.com";

        // 使用HTool进行脱敏处理
        String maskedCreditCardNumber = SensitiveUtil.desensitize(creditCardNumber, SensitiveTypeEnum.CARD_NO);
        String maskedPhoneNumber = SensitiveUtil.desensitize(phoneNumber, SensitiveTypeEnum.MOBILE_PHONE);
        String maskedEmail = SensitiveUtil.desensitize(email, SensitiveTypeEnum.EMAIL);

        // 输出结果
        System.out.println("Original Credit Card Number: " + creditCardNumber);
        System.out.println("Masked Credit Card Number: " + maskedCreditCardNumber);
        System.out.println("Original Phone Number: " + phoneNumber);
        System.out.println("Masked Phone Number: " + maskedPhoneNumber);
        System.out.println("Original Email: " + email);
        System.out.println("Masked Email: " + maskedEmail);
    }
}
```

HTool提供了一些常见的数据类型的脱敏策略，可以通过SensitiveTypeEnum来指定。

> CHINESE_NAME：中文名  
> ID_CARD：身份证号  
> MOBILE_PHONE：手机号码  
> EMAIL：电子邮箱  
> BANK_CARD：银行卡号  
> FIXED_PHONE：固定电话  
> ADDRESS：地址  
> PASSWORD：密码  
> CAR_NUMBER：车牌号  
> CARD_NO：信用卡号  

### 序列化脱敏
可以在数据序列化时进行脱敏，例如 Jackson，可以指定数据序列化逻辑。
```java
public class User {
    private String name;
    private String email;
    private String phoneNumber;

    // 省略构造函数、getter和setter方法
}
```

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class UserSerializer extends JsonSerializer<User> {
    @Override
    public void serialize(User user, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("name", maskString(user.getName()));
        jsonGenerator.writeStringField("email", maskString(user.getEmail()));
        jsonGenerator.writeStringField("phoneNumber", maskString(user.getPhoneNumber()));
        jsonGenerator.writeEndObject();
    }

    private String maskString(String original) {
        // 这里可以根据需要进行脱敏操作，比如只显示部分字符，用*代替敏感信息等
        return "****";
    }
}

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class DataMaskingExample {
    public static void main(String[] args) throws IOException {
        // 创建 ObjectMapper 实例
        ObjectMapper objectMapper = new ObjectMapper();

        // 注册自定义序列化器
        // 也可以使用注解方式
        SimpleModule module = new SimpleModule();
        module.addSerializer(User.class, new UserSerializer());
        objectMapper.registerModule(module);

        // 创建一个用户对象
        User user = new User("laozhang", "laozhang@example.com", "123-456-7890");

        // 序列化用户对象为 JSON 字符串
        String json = objectMapper.writeValueAsString(user);
        System.out.println("Serialized JSON: " + json);
    }
}

// 输出结果：  
Serialized JSON: {"name":"****","email":"****","phoneNumber":"****"}

```