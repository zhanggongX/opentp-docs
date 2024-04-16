---
title: 建造者模式
category:
  - 设计模式
order: 4
tag:
  - 构建模式
  - 创建型设计模式
---

### 用途
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示的意图时，我们需要应用于一个设计模式，建造者(Builder)模式。   
建造者模式可以将一个产品的内部表象与产品的生成过程分割开来，从而可以使一个建造过程生成具有不同的内部表象的产品对象。   
如果我们用了建造者模式，那么用户就只需指定需要建造的类型就可以得到它们，而具体建造的过程和细节就不需知道了。  
> 举个例子：我们需要构造一个人，如果直接创建比较复杂，又要创建瘦人、胖人、高人、矮人，统统通过 new Bean 的方式去创建，那业务对象需要注意的比较多。  
> 如果是用构建者模式，我们为人类创建一个 Builder 类，把需要定义的内容都固定好，生成的时候，如果发现某些内容没有添加，就不允许 build()，就完全避免了出错的情况。  
> 建造者模式是在当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时适用的模式。  

```java
public class ABCDE {
    private final String a;//必须
    private final String b;//必须
    private final int c;//可选
    private final String d;//可选
    private final String e;//可选

    private ABCDE(Builder builder){
        this.a=builder.a;
        this.b=builder.b;
        this.c=builder.c;
        this.d=builder.d;
        this.e=builder.e;
    }
    public static class Builder{
        private String a;//必须
        private String b;//必须
        private int c;//可选
        private String d;//可选
        private String e;//可选

        // 控制必须传入。
        public Builder(String a,String b){
            this.a=a;
            this.b=b;
        }

        public Builder setUsbCount(int c) {
            this.c = c;
            return this;
        }
        public Builder setKeyboard(String d) {
            this.d = d;
            return this;
        }
        public Builder setDisplay(String e) {
            this.e = e;
            return this;
        }
        public ABCDE build(){
            return new ABCDE(this);
        }
    }
}
```