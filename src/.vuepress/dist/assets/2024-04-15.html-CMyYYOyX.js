import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as s,d as t}from"./app-C83zSR47.js";const e={},p=t(`<h3 id="题目" tabindex="-1"><a class="header-anchor" href="#题目"><span>题目：</span></a></h3><p>不使用任何内建的哈希表库设计一个哈希映射（HashMap）。</p><p>实现 MyHashMap 类：</p><p>MyHashMap() 用空映射初始化对象<br> void put(int key, int value) 向 HashMap 插入一个键值对 (key, value) 。如果 key 已经存在于映射中，则更新其对应的值 value 。<br> int get(int key) 返回特定的 key 所映射的 value ；如果映射中不包含 key 的映射，返回 -1 。<br> void remove(key) 如果映射中存在 key 的映射，则移除 key 和它所对应的 value 。</p><h3 id="题解" tabindex="-1"><a class="header-anchor" href="#题解"><span>题解：</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token comment">// 简单题只贴代码</span>
<span class="token keyword">class</span> <span class="token class-name">MyHashMap</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token number">1000001</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">MyHashMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span>map<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">,</span> <span class="token keyword">int</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        map<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> map<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        map<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),o=[p];function c(i,l){return a(),s("div",null,o)}const d=n(e,[["render",c],["__file","2024-04-15.html.vue"]]),k=JSON.parse('{"path":"/blog/algorithm/daily/2024-04-15.html","title":"240415-706设计哈希映射","lang":"zh-CN","frontmatter":{"title":"240415-706设计哈希映射","category":["leetcode"],"order":7,"tag":["设计","数组","哈希表","链表","哈希函数"],"description":"题目： 不使用任何内建的哈希表库设计一个哈希映射（HashMap）。 实现 MyHashMap 类： MyHashMap() 用空映射初始化对象 void put(int key, int value) 向 HashMap 插入一个键值对 (key, value) 。如果 key 已经存在于映射中，则更新其对应的值 value 。 int get(in...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/algorithm/daily/2024-04-15.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"240415-706设计哈希映射"}],["meta",{"property":"og:description","content":"题目： 不使用任何内建的哈希表库设计一个哈希映射（HashMap）。 实现 MyHashMap 类： MyHashMap() 用空映射初始化对象 void put(int key, int value) 向 HashMap 插入一个键值对 (key, value) 。如果 key 已经存在于映射中，则更新其对应的值 value 。 int get(in..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-15T02:11:20.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"设计"}],["meta",{"property":"article:tag","content":"数组"}],["meta",{"property":"article:tag","content":"哈希表"}],["meta",{"property":"article:tag","content":"链表"}],["meta",{"property":"article:tag","content":"哈希函数"}],["meta",{"property":"article:modified_time","content":"2024-04-15T02:11:20.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"240415-706设计哈希映射\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-15T02:11:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":3,"title":"题目：","slug":"题目","link":"#题目","children":[]},{"level":3,"title":"题解：","slug":"题解","link":"#题解","children":[]}],"git":{"createdTime":1713147080000,"updatedTime":1713147080000,"contributors":[{"name":"zhanggong","email":"zhanggong@58.com","commits":1}]},"readingTime":{"minutes":0.68,"words":205},"filePathRelative":"blog/algorithm/daily/2024-04-15.md","localizedDate":"2024年4月15日","autoDesc":true}');export{d as comp,k as data};
