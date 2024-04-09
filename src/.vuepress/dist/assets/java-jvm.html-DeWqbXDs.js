import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as e,c as t,f as n}from"./app-kPtiNsGp.js";const r={},s=n('<h2 id="jvm" tabindex="-1"><a class="header-anchor" href="#jvm"><span>JVM</span></a></h2><h3 id="jvm-启动过程" tabindex="-1"><a class="header-anchor" href="#jvm-启动过程"><span>JVM 启动过程</span></a></h3><h3 id="jvm堆什么时候加载进内存的" tabindex="-1"><a class="header-anchor" href="#jvm堆什么时候加载进内存的"><span>JVM堆什么时候加载进内存的</span></a></h3><h3 id="jvm各区域划分" tabindex="-1"><a class="header-anchor" href="#jvm各区域划分"><span>JVM各区域划分</span></a></h3><p>共享：堆，元空间，直接内存。<br> 私有：虚拟机栈，本地方法栈，程序计数器。</p><h3 id="字符串常量池" tabindex="-1"><a class="header-anchor" href="#字符串常量池"><span>字符串常量池</span></a></h3><p>字符串常量池在堆中，是JVM为了提高String对象效率提供的一片区域，主要是为了避免字符串的重复创建，字符串常量池放入堆中也是为了提供垃圾回收效率。</p><h3 id="运行时常量池" tabindex="-1"><a class="header-anchor" href="#运行时常量池"><span>运行时常量池</span></a></h3><p>Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池，而Class文件在元空间中。</p><h3 id="类加载过程-类的生命周期" tabindex="-1"><a class="header-anchor" href="#类加载过程-类的生命周期"><span>类加载过程/类的生命周期</span></a></h3><p>加载 -&gt; 验证 -&gt; 准备 -&gt; 解析 -&gt; 初始化 -&gt; 使用 -&gt; 卸载<br> 加载：加载Class文件，生成Class对象<br> 验证：验证Class文件是否符合JVM规范<br> 准备：正式为类变量分配内存并初始化类变量初始值，如果类变量没有final修饰，此阶段给默认值<br> 解析：解析阶段将类的符号引用替换为直接引用的过程，就是得到类引用的类，方法，字段在内存中的实际位置。<br> 初始化：new \\ getStatic \\ putStatic<br> 卸载：</p><h3 id="类结构" tabindex="-1"><a class="header-anchor" href="#类结构"><span>类结构</span></a></h3><p>魔数<br> 版本号<br> 常量池<br> 访问控制标识<br> 当前类、父类、接口数量、接口集合<br> 字段表集合<br> 方法表集合<br> 属性表集合</p><h3 id="对象创建过程" tabindex="-1"><a class="header-anchor" href="#对象创建过程"><span>对象创建过程</span></a></h3><p>类加载检查<br> 分配内存（指针碰撞（内存规整），空闲列表（内存不规整））<br> 初始化0值<br> 设置对象头<br> 执行 init 方法</p><h3 id="类加载器" tabindex="-1"><a class="header-anchor" href="#类加载器"><span>类加载器</span></a></h3><p>JDK内置的加载器<br> BootstrapClassLoader 启动类加载器，加载JDK核心代码，C++实现，无父加载器<br> extensionClassLoader 加载JDK扩展包Class<br> AppClassLoader 应用类加载器，加载我们写的程序，ClassPath 下的所有类</p><h3 id="什么是双亲委派模型" tabindex="-1"><a class="header-anchor" href="#什么是双亲委派模型"><span>什么是双亲委派模型</span></a></h3><p>类加载总是交给父加载器去加载，如果父加载器加载不了，再使用本加载器。</p><h4 id="双亲委派模型的好处" tabindex="-1"><a class="header-anchor" href="#双亲委派模型的好处"><span>双亲委派模型的好处</span></a></h4><p>双亲委派模型可以避免类的重复加载，例如我定义了一个 Object 类，双亲委派模型可以保证加载的是java.lang.Object 而不是我们自己定义的 Object</p><h4 id="自定义类加载器" tabindex="-1"><a class="header-anchor" href="#自定义类加载器"><span>自定义类加载器</span></a></h4><p>如果我们不想打破模型重写 findClass 即可，如果想打破模型，就要重写 loadClass 类了。</p><h4 id="打破双亲委派模型" tabindex="-1"><a class="header-anchor" href="#打破双亲委派模型"><span>打破双亲委派模型</span></a></h4><p>可以实现加载的类互相隔离。<br> SPI 的加载，SPI实现类需要使用 启动类加载器，但是代码又不在 启动类加载器的范围呢，可以使用线程上下文加载器，让启动类加载器借助子类加载器加载。<br> Tomcat 的类加载优先自己加载，自己加载不了再让父加载器加载，来保证多个war的多个应用隔离。</p><h3 id="垃圾回收" tabindex="-1"><a class="header-anchor" href="#垃圾回收"><span>垃圾回收</span></a></h3><h4 id="垃圾回收算法" tabindex="-1"><a class="header-anchor" href="#垃圾回收算法"><span>垃圾回收算法</span></a></h4><p>标记清理，标记整理</p><h3 id="jvm-参数" tabindex="-1"><a class="header-anchor" href="#jvm-参数"><span>JVM 参数</span></a></h3><p>-Xms4g -Xmx4g -Xmn2g -Xss1024K<br> -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC<br> -XX:+UseCMSCompactAtFullCollection -XX:CMSInitiatingOccupancyFraction=80<br> -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintTenuringDistribution<br> -XX:+PrintHeapAtGC -XX:+PrintReferenceGC -XX:+PrintGCApplicationStoppedTime<br> -XX:+PrintSafepointStatistics<br> -XX:PrintSafepointStatisticsCount=1<br> -Xloggc:/opt/gc/gc-%t.log -XX:+UseGCLogFileRotation<br> -XX:NumberOfGCLogFiles=14 -XX:GCLogFileSize=100M。</p><p>-Xms 最小堆<br> -Xmx 最大堆<br> -Xmn 新生代</p><p>-XX:MetaspaceSize 误区，它并不是元空间初始大小，元空间大小初始值是 20.8M，是触发GC的值<br> -XX:MaxMetaspaceSize(元空间最大值)</p><h3 id="jvm-常用工具" tabindex="-1"><a class="header-anchor" href="#jvm-常用工具"><span>JVM 常用工具</span></a></h3><h4 id="jps" tabindex="-1"><a class="header-anchor" href="#jps"><span>jps</span></a></h4><p>查看运行的 java 线程</p><h4 id="jstat" tabindex="-1"><a class="header-anchor" href="#jstat"><span>jstat</span></a></h4><p>收集jvm运行各种参数 jstat -gcutil vmid 显示垃圾收集信息</p><h4 id="jinfo" tabindex="-1"><a class="header-anchor" href="#jinfo"><span>jinfo</span></a></h4><p>jvm 配置信息 jinfo vmid 显示虚拟机的配置信息 jinfo -flag +PrintGC vmid 增加打印GC配置。</p><h4 id="jmap" tabindex="-1"><a class="header-anchor" href="#jmap"><span>jmap</span></a></h4><p>堆存储快照 生成快照 jmap -dump:format=b,file=\\opt\\heap.hprof 17340 jmap -heap vmid 查看堆的快照</p><h4 id="jstack" tabindex="-1"><a class="header-anchor" href="#jstack"><span>jstack</span></a></h4><p>jvm 的线程的堆栈信息 jstack vmid 查看 栈信息</p><h4 id="jhat" tabindex="-1"><a class="header-anchor" href="#jhat"><span>jhat</span></a></h4><p>分析 heapdump 文件。 jhat \\opt\\heap.hprof 分析快照</p>',45),i=[s];function l(p,h){return e(),t("div",null,i)}const d=a(r,[["render",l],["__file","java-jvm.html.vue"]]),m=JSON.parse('{"path":"/blog/java/java-jvm.html","title":"JVM","lang":"zh-CN","frontmatter":{"title":"JVM","category":["Java"],"order":5,"tag":["Java基础","Java-JVM"],"description":"JVM JVM 启动过程 JVM堆什么时候加载进内存的 JVM各区域划分 共享：堆，元空间，直接内存。 私有：虚拟机栈，本地方法栈，程序计数器。 字符串常量池 字符串常量池在堆中，是JVM为了提高String对象效率提供的一片区域，主要是为了避免字符串的重复创建，字符串常量池放入堆中也是为了提供垃圾回收效率。 运行时常量池 Class文件中除了有类的版...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/java/java-jvm.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"JVM"}],["meta",{"property":"og:description","content":"JVM JVM 启动过程 JVM堆什么时候加载进内存的 JVM各区域划分 共享：堆，元空间，直接内存。 私有：虚拟机栈，本地方法栈，程序计数器。 字符串常量池 字符串常量池在堆中，是JVM为了提高String对象效率提供的一片区域，主要是为了避免字符串的重复创建，字符串常量池放入堆中也是为了提供垃圾回收效率。 运行时常量池 Class文件中除了有类的版..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-08T06:04:53.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"Java基础"}],["meta",{"property":"article:tag","content":"Java-JVM"}],["meta",{"property":"article:modified_time","content":"2024-04-08T06:04:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JVM\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-08T06:04:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":2,"title":"JVM","slug":"jvm","link":"#jvm","children":[{"level":3,"title":"JVM 启动过程","slug":"jvm-启动过程","link":"#jvm-启动过程","children":[]},{"level":3,"title":"JVM堆什么时候加载进内存的","slug":"jvm堆什么时候加载进内存的","link":"#jvm堆什么时候加载进内存的","children":[]},{"level":3,"title":"JVM各区域划分","slug":"jvm各区域划分","link":"#jvm各区域划分","children":[]},{"level":3,"title":"字符串常量池","slug":"字符串常量池","link":"#字符串常量池","children":[]},{"level":3,"title":"运行时常量池","slug":"运行时常量池","link":"#运行时常量池","children":[]},{"level":3,"title":"类加载过程/类的生命周期","slug":"类加载过程-类的生命周期","link":"#类加载过程-类的生命周期","children":[]},{"level":3,"title":"类结构","slug":"类结构","link":"#类结构","children":[]},{"level":3,"title":"对象创建过程","slug":"对象创建过程","link":"#对象创建过程","children":[]},{"level":3,"title":"类加载器","slug":"类加载器","link":"#类加载器","children":[]},{"level":3,"title":"什么是双亲委派模型","slug":"什么是双亲委派模型","link":"#什么是双亲委派模型","children":[]},{"level":3,"title":"垃圾回收","slug":"垃圾回收","link":"#垃圾回收","children":[]},{"level":3,"title":"JVM 参数","slug":"jvm-参数","link":"#jvm-参数","children":[]},{"level":3,"title":"JVM 常用工具","slug":"jvm-常用工具","link":"#jvm-常用工具","children":[]}]}],"git":{"createdTime":1712556293000,"updatedTime":1712556293000,"contributors":[{"name":"zhanggong","email":"zhanggong@58.com","commits":1}]},"readingTime":{"minutes":3.25,"words":974},"filePathRelative":"blog/java/java-jvm.md","localizedDate":"2024年4月8日","autoDesc":true}');export{d as comp,m as data};
