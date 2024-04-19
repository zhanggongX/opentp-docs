import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e}from"./app-B868GSZd.js";const t={},o=e(`<h3 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍"><span>介绍</span></a></h3><p>简单工厂模式的最大优点在于工厂类中包含了必要的逻辑判断，根据客户端的选择条件动态实例化相关的类，对于客户端来说，去除了与具体产品的依赖。<br> 但是问题是如果我们要增加一个类，就需要去修改工厂方法，违背了开闭原则。</p><p>工厂方法模式 (Factory Method)，定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。</p><blockquote><p>就是给每一个类创建一个工厂。。这样虽然类多了，但是符合开闭原则，新增一个类，就新增一个类的工厂，对老的逻辑无需任何修改。</p></blockquote><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码"><span>代码</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Inter</span> <span class="token punctuation">{</span>

    <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClassA</span> <span class="token keyword">implements</span> <span class="token class-name">Inter</span><span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;classA&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Factory</span> <span class="token punctuation">{</span>

    <span class="token class-name">Inter</span> <span class="token function">createBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClassAFactory</span> <span class="token keyword">implements</span> <span class="token class-name">Factory</span><span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Inter</span> <span class="token function">createBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ClassA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">// 后续增加ClassA，再增加一个ClassB。</span>
<span class="token comment">// 类的数量将会膨胀，还不如简单工厂。。</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),p=[o];function c(l,i){return s(),a("div",null,p)}const d=n(t,[["render",c],["__file","01-factory-method.html.vue"]]),m=JSON.parse('{"path":"/blog/compute/design-pattern/create/01-factory-method.html","title":"工厂方法模式","lang":"zh-CN","frontmatter":{"title":"工厂方法模式","category":["设计模式"],"order":2,"tag":["设计模式","工厂方法模式","创建型设计模式"],"description":"介绍 简单工厂模式的最大优点在于工厂类中包含了必要的逻辑判断，根据客户端的选择条件动态实例化相关的类，对于客户端来说，去除了与具体产品的依赖。 但是问题是如果我们要增加一个类，就需要去修改工厂方法，违背了开闭原则。 工厂方法模式 (Factory Method)，定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/compute/design-pattern/create/01-factory-method.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"工厂方法模式"}],["meta",{"property":"og:description","content":"介绍 简单工厂模式的最大优点在于工厂类中包含了必要的逻辑判断，根据客户端的选择条件动态实例化相关的类，对于客户端来说，去除了与具体产品的依赖。 但是问题是如果我们要增加一个类，就需要去修改工厂方法，违背了开闭原则。 工厂方法模式 (Factory Method)，定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"设计模式"}],["meta",{"property":"article:tag","content":"工厂方法模式"}],["meta",{"property":"article:tag","content":"创建型设计模式"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"工厂方法模式\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":3,"title":"介绍","slug":"介绍","link":"#介绍","children":[]},{"level":3,"title":"代码","slug":"代码","link":"#代码","children":[]}],"git":{"createdTime":null,"updatedTime":null,"contributors":[]},"readingTime":{"minutes":0.99,"words":298},"filePathRelative":"blog/compute/design-pattern/create/01-factory-method.md","autoDesc":true}');export{d as comp,m as data};