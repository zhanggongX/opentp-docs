import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,d as t}from"./app-C83zSR47.js";const e={},p=t(`<h3 id="题目描述" tabindex="-1"><a class="header-anchor" href="#题目描述"><span>题目描述：</span></a></h3><p>不使用任何内建的哈希表库设计一个哈希集合（HashSet）。</p><p>实现 MyHashSet 类：</p><p>void add(key) 向哈希集合中插入值 key 。<br> bool contains(key) 返回哈希集合中是否存在这个值 key 。<br> void remove(key) 将给定值 key 从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。</p><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码"><span>代码：</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">MyHashSet</span> <span class="token punctuation">{</span>
    <span class="token keyword">boolean</span><span class="token punctuation">[</span><span class="token punctuation">]</span> nodes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">boolean</span><span class="token punctuation">[</span><span class="token number">1000009</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        nodes<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        nodes<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">contains</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> nodes<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">MyHashSet</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> bs <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token number">40000</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> bucketIdx <span class="token operator">=</span> key <span class="token operator">/</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> bitIdx <span class="token operator">=</span> key <span class="token operator">%</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token function">setVal</span><span class="token punctuation">(</span>bucketIdx<span class="token punctuation">,</span> bitIdx<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> bucketIdx <span class="token operator">=</span> key <span class="token operator">/</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> bitIdx <span class="token operator">=</span> key <span class="token operator">%</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token function">setVal</span><span class="token punctuation">(</span>bucketIdx<span class="token punctuation">,</span> bitIdx<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">contains</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> bucketIdx <span class="token operator">=</span> key <span class="token operator">/</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> bitIdx <span class="token operator">=</span> key <span class="token operator">%</span> <span class="token number">32</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token function">getVal</span><span class="token punctuation">(</span>bucketIdx<span class="token punctuation">,</span> bitIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">void</span> <span class="token function">setVal</span><span class="token punctuation">(</span><span class="token keyword">int</span> bucket<span class="token punctuation">,</span> <span class="token keyword">int</span> loc<span class="token punctuation">,</span> <span class="token keyword">boolean</span> val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> u <span class="token operator">=</span> bs<span class="token punctuation">[</span>bucket<span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">&lt;&lt;</span> loc<span class="token punctuation">)</span><span class="token punctuation">;</span>
            bs<span class="token punctuation">[</span>bucket<span class="token punctuation">]</span> <span class="token operator">=</span> u<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> u <span class="token operator">=</span> bs<span class="token punctuation">[</span>bucket<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token operator">~</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">&lt;&lt;</span> loc<span class="token punctuation">)</span><span class="token punctuation">;</span>
            bs<span class="token punctuation">[</span>bucket<span class="token punctuation">]</span> <span class="token operator">=</span> u<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">boolean</span> <span class="token function">getVal</span><span class="token punctuation">(</span><span class="token keyword">int</span> bucket<span class="token punctuation">,</span> <span class="token keyword">int</span> loc<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> u <span class="token operator">=</span> <span class="token punctuation">(</span>bs<span class="token punctuation">[</span>bucket<span class="token punctuation">]</span> <span class="token operator">&gt;&gt;</span> loc<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> u <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[p];function c(l,i){return s(),a("div",null,o)}const r=n(e,[["render",c],["__file","2024-04-14.html.vue"]]),d=JSON.parse('{"path":"/blog/algorithm/daily/2024-04-14.html","title":"240414-705设计哈希集合","lang":"zh-CN","frontmatter":{"title":"240414-705设计哈希集合","category":["leetcode"],"order":6,"tag":["设计","数组","哈希表","链表","哈希函数"],"description":"题目描述： 不使用任何内建的哈希表库设计一个哈希集合（HashSet）。 实现 MyHashSet 类： void add(key) 向哈希集合中插入值 key 。 bool contains(key) 返回哈希集合中是否存在这个值 key 。 void remove(key) 将给定值 key 从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/algorithm/daily/2024-04-14.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"240414-705设计哈希集合"}],["meta",{"property":"og:description","content":"题目描述： 不使用任何内建的哈希表库设计一个哈希集合（HashSet）。 实现 MyHashSet 类： void add(key) 向哈希集合中插入值 key 。 bool contains(key) 返回哈希集合中是否存在这个值 key 。 void remove(key) 将给定值 key 从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-14T03:29:18.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"设计"}],["meta",{"property":"article:tag","content":"数组"}],["meta",{"property":"article:tag","content":"哈希表"}],["meta",{"property":"article:tag","content":"链表"}],["meta",{"property":"article:tag","content":"哈希函数"}],["meta",{"property":"article:modified_time","content":"2024-04-14T03:29:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"240414-705设计哈希集合\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-14T03:29:18.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":3,"title":"题目描述：","slug":"题目描述","link":"#题目描述","children":[]},{"level":3,"title":"代码：","slug":"代码","link":"#代码","children":[]}],"git":{"createdTime":1713065260000,"updatedTime":1713065358000,"contributors":[{"name":"zhanggong","email":"18523019@qq.com","commits":2}]},"readingTime":{"minutes":0.87,"words":260},"filePathRelative":"blog/algorithm/daily/2024-04-14.md","localizedDate":"2024年4月14日","autoDesc":true}');export{r as comp,d as data};
