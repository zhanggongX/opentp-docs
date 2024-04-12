---
title: 建造者模式
category:
  - 设计模式
order: 4
tag:
  - 构建模式
---

### 用途
当一个类的构造函数参数比较多，而且这些参数有些是可选的时，我们通常有两种办法来构建它的对象。 
1. 折叠构造函数模式，ClassA(a) Class(B) Class(A,B) Class(A, B, C);
2. Bean Getter/Setter 方式。

缺点：  
第一种需要去确认构造方法。  
第二种使用者需要调用一堆Set方法。

建造者模式就可以解决这两种问题。
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