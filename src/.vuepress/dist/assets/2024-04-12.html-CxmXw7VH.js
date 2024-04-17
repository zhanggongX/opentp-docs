import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e as t}from"./app-BPft6X5f.js";const e={},p=t(`<h3 id="题目描述" tabindex="-1"><a class="header-anchor" href="#题目描述"><span>题目描述</span></a></h3><p>第 370 场周赛 Q1</p><p>一场比赛中共有 n 支队伍，按从 0 到 n - 1 编号。</p><p>给你一个下标从 0 开始、大小为 n * n 的二维布尔矩阵 grid 。对于满足 0 &lt;= i, j &lt;= n - 1 且 i != j 的所有 i, j ：如果 grid[i][j] == 1，那么 i 队比 j 队 强 ；否则，j 队比 i 队 强 。</p><p>在这场比赛中，如果不存在某支强于 a 队的队伍，则认为 a 队将会是 冠军 。</p><p>返回这场比赛中将会成为冠军的队伍。</p><p>解答一：<br> 时间负责度 O(n<sup>2</sup>)</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token comment">// 简单题直接贴代码 </span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">findChampion</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> grid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> row <span class="token operator">=</span> grid<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
        <span class="token keyword">int</span> col <span class="token operator">=</span> grid<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">;</span>

        <span class="token keyword">boolean</span> a <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> row<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            a <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
            <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> col<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>i <span class="token operator">!=</span> j <span class="token operator">&amp;&amp;</span> grid<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                    a <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token keyword">return</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解答二：<br> 时间复杂度 O(n)</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">findChampion</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> grid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 开始认为第0个队是冠军</span>
        <span class="token keyword">int</span> res <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token comment">// 遍历从 1 开始，因为此时认为 0 是冠军。</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> grid<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 如果遍历到 [i][res] == 1 说明 i 赢了 res, 则把 res 更新成 i。此时认为 i 是冠军。</span>
            <span class="token comment">// 因为我们是从 i = 1 更新过来的，所以 i 之前的数组肯定不会大于 res，如果大于 res 就不会走到这一步。所以继续 i+1 遍历即可。</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>grid<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>res<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                res <span class="token operator">=</span> i<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 遍历完，最大的就是 res。</span>
        <span class="token keyword">return</span> res<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),o=[p];function c(i,l){return s(),a("div",null,o)}const d=n(e,[["render",c],["__file","2024-04-12.html.vue"]]),k=JSON.parse('{"path":"/blog/algorithm/daily/2024-04-12.html","title":"240412-2923找到冠军 I","lang":"zh-CN","frontmatter":{"title":"240412-2923找到冠军 I","category":["leetcode"],"order":5,"tag":["数组","矩阵"],"description":"题目描述 第 370 场周赛 Q1 一场比赛中共有 n 支队伍，按从 0 到 n - 1 编号。 给你一个下标从 0 开始、大小为 n * n 的二维布尔矩阵 grid 。对于满足 0 <= i, j <= n - 1 且 i != j 的所有 i, j ：如果 grid[i][j] == 1，那么 i 队比 j 队 强 ；否则，j 队比 i 队 强 ...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/algorithm/daily/2024-04-12.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"240412-2923找到冠军 I"}],["meta",{"property":"og:description","content":"题目描述 第 370 场周赛 Q1 一场比赛中共有 n 支队伍，按从 0 到 n - 1 编号。 给你一个下标从 0 开始、大小为 n * n 的二维布尔矩阵 grid 。对于满足 0 <= i, j <= n - 1 且 i != j 的所有 i, j ：如果 grid[i][j] == 1，那么 i 队比 j 队 强 ；否则，j 队比 i 队 强 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-13T12:37:15.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"数组"}],["meta",{"property":"article:tag","content":"矩阵"}],["meta",{"property":"article:modified_time","content":"2024-04-13T12:37:15.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"240412-2923找到冠军 I\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-13T12:37:15.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":3,"title":"题目描述","slug":"题目描述","link":"#题目描述","children":[]}],"git":{"createdTime":1712901593000,"updatedTime":1713011835000,"contributors":[{"name":"zhanggong","email":"18523019@qq.com","commits":1},{"name":"zhanggong","email":"zhanggong@58.com","commits":1}]},"readingTime":{"minutes":1.28,"words":383},"filePathRelative":"blog/algorithm/daily/2024-04-12.md","localizedDate":"2024年4月12日","autoDesc":true}');export{d as comp,k as data};