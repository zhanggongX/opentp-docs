import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as s,e as t}from"./app-B868GSZd.js";const e={},p=t(`<h2 id="项目部署" tabindex="-1"><a class="header-anchor" href="#项目部署"><span>项目部署</span></a></h2><h3 id="服务端" tabindex="-1"><a class="header-anchor" href="#服务端"><span>服务端</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>java -jar opentp-server.jar 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="客户端" tabindex="-1"><a class="header-anchor" href="#客户端"><span>客户端</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token comment">// 增加依赖</span>
<span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">&gt;</span></span>
    <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">&gt;</span></span>cn<span class="token punctuation">.</span>opentp<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">&gt;</span>
    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">&gt;</span></span>opentp<span class="token operator">-</span>client<span class="token operator">-</span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>starter<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">&gt;</span>
    <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">&gt;</span></span><span class="token number">1.0</span><span class="token operator">-</span><span class="token constant">SNAPSHOT</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">&gt;</span>

<span class="token comment">// 添加 @EnableOpentp 注解。</span>
<span class="token annotation punctuation">@EnableOpentp</span>
<span class="token annotation punctuation">@SpringBootApplication</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClientSpringExampleApp</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">ClientSpringExampleApp</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 线程池增加 @Opentp 注解。</span>
<span class="token annotation punctuation">@Opentp</span><span class="token punctuation">(</span><span class="token string">&quot;demoExecutor&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Bean</span>
<span class="token keyword">public</span> <span class="token class-name">ThreadPoolExecutor</span> <span class="token function">threadPoolExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">ArrayBlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token number">1024</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 就会自动收集线程池信息进行上报</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[p];function c(l,i){return a(),s("div",null,o)}const d=n(e,[["render",c],["__file","deploy.html.vue"]]),k=JSON.parse('{"path":"/quickstart/deploy.html","title":"项目部署","lang":"zh-CN","frontmatter":{"title":"项目部署","category":["quickstart"],"order":1,"tag":["opentp文档"],"description":"项目部署 服务端 客户端","head":[["meta",{"property":"og:url","content":"https://opentp.cn/quickstart/deploy.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"项目部署"}],["meta",{"property":"og:description","content":"项目部署 服务端 客户端"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-12T05:59:53.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"opentp文档"}],["meta",{"property":"article:modified_time","content":"2024-04-12T05:59:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"项目部署\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-12T05:59:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":2,"title":"项目部署","slug":"项目部署","link":"#项目部署","children":[{"level":3,"title":"服务端","slug":"服务端","link":"#服务端","children":[]},{"level":3,"title":"客户端","slug":"客户端","link":"#客户端","children":[]}]}],"git":{"createdTime":1712901593000,"updatedTime":1712901593000,"contributors":[{"name":"zhanggong","email":"zhanggong@58.com","commits":1}]},"readingTime":{"minutes":0.37,"words":110},"filePathRelative":"quickstart/deploy.md","localizedDate":"2024年4月12日","autoDesc":true}');export{d as comp,k as data};