import{_ as p}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as e,o,c,a as n,e as s,d as t,f as l}from"./app-7L2G2YDi.js";const i={},u=n("h2",{id:"kmp算法介绍",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#kmp算法介绍"},[n("span",null,"KMP算法介绍")])],-1),r=n("p",null,"KMP算法是一种用来快速匹配子字符串的算法，它使得由普通的匹配算法O(m*n)的复杂度降低到了O(m+n)。",-1),k=n("h2",{id:"普通字符串匹配",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#普通字符串匹配"},[n("span",null,"普通字符串匹配")])],-1),d={href:"https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/",target:"_blank",rel:"noopener noreferrer"},m=l(`<div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">strStr</span><span class="token punctuation">(</span><span class="token class-name">String</span> haystack<span class="token punctuation">,</span> <span class="token class-name">String</span> needle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> len1 <span class="token operator">=</span> haystack<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> len2 <span class="token operator">=</span> needle<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>len2 <span class="token operator">&gt;</span> len1<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> max <span class="token operator">=</span> len1 <span class="token operator">-</span> len2<span class="token punctuation">;</span>
        <span class="token comment">// 1 层循环</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> max<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">check</span><span class="token punctuation">(</span>haystack<span class="token punctuation">,</span> needle<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token keyword">return</span> i<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">check</span><span class="token punctuation">(</span><span class="token class-name">String</span> a<span class="token punctuation">,</span> <span class="token class-name">String</span> b<span class="token punctuation">,</span> <span class="token keyword">int</span> start<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 2 层循环</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> b<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span>i<span class="token operator">+</span>start<span class="token punctuation">)</span> <span class="token operator">!=</span> b<span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看出，方法是经历过两层循环的，所以时间复杂度是 O(m*n)，m和n分别代表两个字符串的长度，如果两个字符串都比较长，那这个复杂度匹配出来结果那是相当慢的，我们可以使用 KMP 来进行匹配。</p><h2 id="kmp算法" tabindex="-1"><a class="header-anchor" href="#kmp算法"><span>KMP算法</span></a></h2><p>先贴代码：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">strStr</span><span class="token punctuation">(</span><span class="token class-name">String</span> haystack<span class="token punctuation">,</span> <span class="token class-name">String</span> needle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>needle<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
        
        <span class="token keyword">int</span> n <span class="token operator">=</span> haystack<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> m <span class="token operator">=</span> needle<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        haystack <span class="token operator">=</span> <span class="token string">&quot; &quot;</span> <span class="token operator">+</span> haystack<span class="token punctuation">;</span>
        needle <span class="token operator">=</span> <span class="token string">&quot; &quot;</span> <span class="token operator">+</span> needle<span class="token punctuation">;</span>

        <span class="token keyword">char</span><span class="token punctuation">[</span><span class="token punctuation">]</span> s <span class="token operator">=</span> haystack<span class="token punctuation">.</span><span class="token function">toCharArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">char</span><span class="token punctuation">[</span><span class="token punctuation">]</span> p <span class="token operator">=</span> needle<span class="token punctuation">.</span><span class="token function">toCharArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 计算 next 数组</span>
        <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span>m <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">,</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> m<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>j <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> p<span class="token punctuation">[</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                j <span class="token operator">=</span> next<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> p<span class="token punctuation">[</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                j<span class="token operator">++</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            next<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> j<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 匹配</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>j <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> p<span class="token punctuation">[</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                j <span class="token operator">=</span> next<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>s<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> p<span class="token punctuation">[</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                j<span class="token operator">++</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">==</span> m<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> i <span class="token operator">-</span> m<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="前置知识" tabindex="-1"><a class="header-anchor" href="#前置知识"><span>前置知识</span></a></h3><p>字符串前缀和后缀。 例如字符串 abba，他的前缀是 a ab abb，后缀是 bba ba a</p><h3 id="算法解析" tabindex="-1"><a class="header-anchor" href="#算法解析"><span>算法解析</span></a></h3><p>首先两个约定，被匹配串定为 s，s的字符串索引为 i，匹配串定为 p，它的字符索引为 j 。 要想快速的匹配字符，那么有两个思路:</p><ol><li>是 s 不能往后回滚，即 i 只能往后 ++；</li><li>是 i 不能往前回滚的前提下，不能遗漏匹配结果，且让 j 尽量少往前回滚。</li></ol><h4 id="为啥-s-不用回滚" tabindex="-1"><a class="header-anchor" href="#为啥-s-不用回滚"><span>为啥 s 不用回滚</span></a></h4><p>因为 p 串会找到一个回滚的位置，不会导致漏匹配的。</p><h4 id="为啥-p-串不能直接再从-0-开始匹配" tabindex="-1"><a class="header-anchor" href="#为啥-p-串不能直接再从-0-开始匹配"><span>为啥 p 串不能直接再从 0 开始匹配</span></a></h4><p>当 s 和 p 遇见不匹配的字符时，j 如果回滚到 0 ，此时就可能发生漏匹配的问题。 例如<br> s = &quot;bcaaadcbc&quot; ,<br> p = &quot;aad&quot;<br> 例如当匹配到 i = 4， j = 2 的时候， &#39;a&#39; != &#39;d&#39; ，此时如果把 p 的指针 j 重新指向 0, 那么就会漏掉匹配结果。<br> 所以 KMP 算法，关键就是，就是在匹配过遇见不能匹配的字符时，j 指针往前回滚多少合适。</p><h4 id="怎么找到-p-串合适的回滚位置" tabindex="-1"><a class="header-anchor" href="#怎么找到-p-串合适的回滚位置"><span>怎么找到 p 串合适的回滚位置</span></a></h4><p>其实在匹配的过程中如果某个字符发生失配的情况，而且这个字符前的字符串中有相同的前缀和后缀，那么把 j 指向相同的前缀后的按个字符，就是最好的结果。<br> 例如：<br> bcaaadcbc<br> &amp;&amp;aad<br> 此时 p 串中的‘d’ 和 s 串中的‘a’ 不匹配，而 p 串中 ‘d’前边的字符串 aa，有相同的前缀 a 和相同的后缀 a，所以此时应该把 j 指向第 2 个 a。<br><strong>这是为啥呢？</strong><br> 仔细想想遇见不匹配的字符前的字符是不是都是匹配的？是的。<br> 所以遇见不匹配的字符后，是不是之前<strong>匹配好的字符</strong>的<strong>前缀和后缀相同的部分</strong>就不需要再去匹配了？<br> 就像 abcabd 如果最后一个 d 不匹配，说明前边的 abcab 是匹配的，那么前缀 ab 和后缀 ab是相同的，那么此时把 j 指向 c，是最好的，因为 ab 肯定是匹配上的啦。</p><h4 id="怎么实现-o-m-n" tabindex="-1"><a class="header-anchor" href="#怎么实现-o-m-n"><span>怎么实现 O(m+n)</span></a></h4><p>虽然道理是这样的，但是直接这么用，算法的时间复杂度还上升了。。<br> 所以我们要先算出来一个 next 数组。<br> 这个数组是干啥的呢？<br> 就是当第几个字符不匹配的时候，j 应该移动到前边第几个字符处。<br> 而计算 next 数组的时间是 O(m)，那么再遍历一遍 s 串，不需要嵌套循环的情况下，时间复杂度就是 O(m+n)；<br> 具体的实现见上方代码。</p>`,18),v={href:"https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/solutions/575568/shua-chuan-lc-shuang-bai-po-su-jie-fa-km-tb86/",target:"_blank",rel:"noopener noreferrer"};function b(h,y){const a=e("ExternalLinkIcon");return o(),c("div",null,[u,r,k,n("p",null,[s("以 leetcode 第28题为例。"),n("a",d,[s("28. 找出字符串中第一个匹配项的下标"),t(a)]),s(" ： 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。")]),m,n("p",null,[s("如果不理解，可以去 leetcode 看一下 宫水三叶 大佬的题解。"),n("a",v,[s("传送门"),t(a)])])])}const w=p(i,[["render",b],["__file","KMP.html.vue"]]),j=JSON.parse('{"path":"/blog/algorithm/KMP.html","title":"KMP算法","lang":"zh-CN","frontmatter":{"title":"KMP算法","category":["算法"],"order":3,"tag":["算法","字符匹配算法"],"description":"KMP算法介绍 KMP算法是一种用来快速匹配子字符串的算法，它使得由普通的匹配算法O(m*n)的复杂度降低到了O(m+n)。 普通字符串匹配 以 leetcode 第28题为例。28. 找出字符串中第一个匹配项的下标 ： 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/algorithm/KMP.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"KMP算法"}],["meta",{"property":"og:description","content":"KMP算法介绍 KMP算法是一种用来快速匹配子字符串的算法，它使得由普通的匹配算法O(m*n)的复杂度降低到了O(m+n)。 普通字符串匹配 以 leetcode 第28题为例。28. 找出字符串中第一个匹配项的下标 ： 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-04T13:53:45.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"算法"}],["meta",{"property":"article:tag","content":"字符匹配算法"}],["meta",{"property":"article:modified_time","content":"2024-04-04T13:53:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"KMP算法\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-04T13:53:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":2,"title":"KMP算法介绍","slug":"kmp算法介绍","link":"#kmp算法介绍","children":[]},{"level":2,"title":"普通字符串匹配","slug":"普通字符串匹配","link":"#普通字符串匹配","children":[]},{"level":2,"title":"KMP算法","slug":"kmp算法","link":"#kmp算法","children":[{"level":3,"title":"前置知识","slug":"前置知识","link":"#前置知识","children":[]},{"level":3,"title":"算法解析","slug":"算法解析","link":"#算法解析","children":[]}]}],"git":{"createdTime":1712238825000,"updatedTime":1712238825000,"contributors":[{"name":"zhanggong","email":"18523019@qq.com","commits":1}]},"readingTime":{"minutes":3.95,"words":1185},"filePathRelative":"blog/algorithm/KMP.md","localizedDate":"2024年4月4日","autoDesc":true}');export{w as comp,j as data};
