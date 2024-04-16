import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as t,d as r}from"./app-C83zSR47.js";const o="/assets/blog/image/collection-all.png",n={},i=r('<h2 id="java-集合" tabindex="-1"><a class="header-anchor" href="#java-集合"><span>Java 集合</span></a></h2><h3 id="集合概览图" tabindex="-1"><a class="header-anchor" href="#集合概览图"><span>集合概览图</span></a></h3><figure><img src="'+o+'" alt="集合概览" tabindex="0" loading="lazy"><figcaption>集合概览</figcaption></figure><h3 id="arraylist" tabindex="-1"><a class="header-anchor" href="#arraylist"><span>ArrayList</span></a></h3><h4 id="arraylist-扩容机制" tabindex="-1"><a class="header-anchor" href="#arraylist-扩容机制"><span>ArrayList 扩容机制</span></a></h4><p>1, new ArrayList 时，创建了一个空数组<br> 2, add() 内容时，会创建一个默认长度为 10 的数组<br> 3, 当内容长度为10 的时候会扩容1.5 倍 即 oldCap + oldCap &gt;&gt; 1<br> 4, 安全的 ArrayList 请使用 CopyOnWriteArrayList&lt;&gt;();</p><h3 id="hashmap" tabindex="-1"><a class="header-anchor" href="#hashmap"><span>HashMap</span></a></h3><h4 id="hashmap-扩容机制" tabindex="-1"><a class="header-anchor" href="#hashmap-扩容机制"><span>HashMap 扩容机制</span></a></h4><p>1, new HashMap() node数组为空，第一次put的时候，初始化长度为16<br> 2, new HashMap(n) 会将阈值设置为 n， 第一次put时候，将阈值给到容量，再把阈值设置为(容量x负载因子)<br> 3, 当容量大于阈值的时候，触发扩容，扩容为2倍，阈值更新为(新容量x负载因子)<br> 3, HashMap 并发操作扩容可能导致死循环，所以安全情况下，请使用 ConrrentHashMap<br> hashMap 1.8之前是 数组+链表的方式存放数据</p><h4 id="hashmap-底层存储" tabindex="-1"><a class="header-anchor" href="#hashmap-底层存储"><span>HashMap 底层存储</span></a></h4><p>1.8之前采用数组+链表来组成的。<br> 1.8之后，采用 数组+链表/红黑树来存。<br> 一般当链表长度大于8的时候，会变成红黑树<br> 当然要数组的长度大于64才会触发变红黑树，否则会优先给数组扩容。<br> hashMap 的数组长度为2的次方，是为了计算hash值时方便。</p><h3 id="concurrenthashmap" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap"><span>ConcurrentHashMap</span></a></h3><p>1.8之前 使用分段数组+链表的方式存储数据<br> 1.8之后 concurrentHashMap 的存储方式和hashMap 一样<br> 1.8之前 对数组使用分段加密<br> 1.8之后 抛弃了桶（分段数组）的概念，直接对数组Node加密。 Node + CAS + Synchrionized 实现， Synchronized 锁定列表/红黑树的首节点。</p><blockquote><p>ConcurrentHashMap 能保证线程的安全，但是不能保证复合操作的原子性。例如先判断是否存在，不存在的话，put数据，复合操作可以使用 PutIfAbsent, compute, computeIfAbsent putIfPresent等。</p></blockquote><h3 id="arraylist-和-linkedlist-的时间复杂度" tabindex="-1"><a class="header-anchor" href="#arraylist-和-linkedlist-的时间复杂度"><span>ArrayList 和 LinkedList 的时间复杂度</span></a></h3><p>ArrayList 非尾插 O(n)， 尾插 O(1)，如果需要扩容的话，尾插也是 O(n)<br> LinkedList 头尾插入是 O(1) ，其他的位置也是 O(n)<br> 读取的话，ArrayList是 O(1), LinkedList 是 O(n)</p><h3 id="hashset、linkedhashset、treeset-三者的区别" tabindex="-1"><a class="header-anchor" href="#hashset、linkedhashset、treeset-三者的区别"><span>HashSet、LinkedHashSet、TreeSet 三者的区别</span></a></h3><p>这三个类都实现了 Set 接口<br> HashSet 底层是 hash 表，利用 hashMap 实现<br> LinkedHashSet 底层是列表 , 利用 LinkedHashMap 实现<br> TreeSet 底层是红黑树，适合 自定义排序的方式使用</p><h3 id="queue和deque" tabindex="-1"><a class="header-anchor" href="#queue和deque"><span>Queue和Deque</span></a></h3><h4 id="queue" tabindex="-1"><a class="header-anchor" href="#queue"><span>Queue</span></a></h4><p>增删查 add remove element<br> 增删查 offer poll peek （常用）</p><h4 id="deque" tabindex="-1"><a class="header-anchor" href="#deque"><span>Deque</span></a></h4><p>增删查 addFirst addLast removeFirst removeLast getFirst getLast<br> 增删查 offerFirst offerLast pollFirst pollLast peekFirst peekLast<br> push = addFirst<br> pop = removeFirst</p><h3 id="blockingqueue" tabindex="-1"><a class="header-anchor" href="#blockingqueue"><span>BlockingQueue</span></a></h3><p>阻塞队列，一个继承了 Queue 的阻塞队列，</p><h3 id="为什么使用-iterator-遍历数据可以增删" tabindex="-1"><a class="header-anchor" href="#为什么使用-iterator-遍历数据可以增删"><span>为什么使用 Iterator 遍历数据可以增删</span></a></h3><p>迭代器有个字段记录遍历到的位置，增删的时候会先同步位置，然后记录修改次数。<br> modCount 是集合的变量<br> expectedModCount 是itr的变量，当两者不一致的时候说明在遍历过程中，有人修改了集合，会抛出异常。</p><h4 id="可以不使用迭代器-边遍历边删除元素吗" tabindex="-1"><a class="header-anchor" href="#可以不使用迭代器-边遍历边删除元素吗"><span>可以不使用迭代器，边遍历边删除元素吗？</span></a></h4><p>可以，从后往前遍历即可。<br> fail-fast(java.util)<br> fail-safe(java.util.concurrent)</p><h3 id="arraylist-源码-doto" tabindex="-1"><a class="header-anchor" href="#arraylist-源码-doto"><span>ArrayList 源码 doto</span></a></h3><h3 id="linkedlist-源码-todo" tabindex="-1"><a class="header-anchor" href="#linkedlist-源码-todo"><span>LinkedList 源码 todo</span></a></h3><h3 id="hashmap-源码-todo" tabindex="-1"><a class="header-anchor" href="#hashmap-源码-todo"><span>HashMap 源码 todo</span></a></h3><h3 id="concurrenthashmap-源码-todo" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap-源码-todo"><span>ConcurrentHashMap 源码 todo</span></a></h3><h3 id="linkedhashmap-源码-todo" tabindex="-1"><a class="header-anchor" href="#linkedhashmap-源码-todo"><span>LinkedHashMap 源码 todo</span></a></h3><h3 id="copyonwritearraylist-源码-todo" tabindex="-1"><a class="header-anchor" href="#copyonwritearraylist-源码-todo"><span>CopyOnWriteArrayList 源码 todo</span></a></h3><h3 id="arrayblockingqueue-源码-todo" tabindex="-1"><a class="header-anchor" href="#arrayblockingqueue-源码-todo"><span>ArrayBlockingQueue 源码 todo</span></a></h3><h3 id="linkedblockingqueue-源码-todo" tabindex="-1"><a class="header-anchor" href="#linkedblockingqueue-源码-todo"><span>LinkedBlockingQueue 源码 todo</span></a></h3><h3 id="linkedblockingdeque-源码-todo" tabindex="-1"><a class="header-anchor" href="#linkedblockingdeque-源码-todo"><span>LinkedBlockingDeque 源码 todo</span></a></h3><h3 id="priorityqueue-源码-todo" tabindex="-1"><a class="header-anchor" href="#priorityqueue-源码-todo"><span>PriorityQueue 源码 todo</span></a></h3><h3 id="delayqueue-源码-todo" tabindex="-1"><a class="header-anchor" href="#delayqueue-源码-todo"><span>DelayQueue 源码 todo</span></a></h3>',40),s=[i];function l(h,d){return a(),t("div",null,s)}const u=e(n,[["render",l],["__file","java-collection.html.vue"]]),g=JSON.parse('{"path":"/blog/java/java-collection.html","title":"Java集合","lang":"zh-CN","frontmatter":{"title":"Java集合","category":["Java"],"order":4,"tag":["Java基础","Java-collection"],"description":"Java 集合 集合概览图 集合概览集合概览 ArrayList ArrayList 扩容机制 1, new ArrayList 时，创建了一个空数组 2, add() 内容时，会创建一个默认长度为 10 的数组 3, 当内容长度为10 的时候会扩容1.5 倍 即 oldCap + oldCap >> 1 4, 安全的 ArrayList 请使用 Co...","head":[["meta",{"property":"og:url","content":"https://opentp.cn/blog/java/java-collection.html"}],["meta",{"property":"og:site_name","content":"opentp"}],["meta",{"property":"og:title","content":"Java集合"}],["meta",{"property":"og:description","content":"Java 集合 集合概览图 集合概览集合概览 ArrayList ArrayList 扩容机制 1, new ArrayList 时，创建了一个空数组 2, add() 内容时，会创建一个默认长度为 10 的数组 3, 当内容长度为10 的时候会扩容1.5 倍 即 oldCap + oldCap >> 1 4, 安全的 ArrayList 请使用 Co..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://opentp.cn/assets/blog/image/collection-all.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-08T06:04:53.000Z"}],["meta",{"property":"article:author","content":"zhanggong"}],["meta",{"property":"article:tag","content":"Java基础"}],["meta",{"property":"article:tag","content":"Java-collection"}],["meta",{"property":"article:modified_time","content":"2024-04-08T06:04:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java集合\\",\\"image\\":[\\"https://opentp.cn/assets/blog/image/collection-all.png\\"],\\"dateModified\\":\\"2024-04-08T06:04:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhanggong\\",\\"url\\":\\"opentp.cn\\"}]}"]]},"headers":[{"level":2,"title":"Java 集合","slug":"java-集合","link":"#java-集合","children":[{"level":3,"title":"集合概览图","slug":"集合概览图","link":"#集合概览图","children":[]},{"level":3,"title":"ArrayList","slug":"arraylist","link":"#arraylist","children":[]},{"level":3,"title":"HashMap","slug":"hashmap","link":"#hashmap","children":[]},{"level":3,"title":"ConcurrentHashMap","slug":"concurrenthashmap","link":"#concurrenthashmap","children":[]},{"level":3,"title":"ArrayList 和 LinkedList 的时间复杂度","slug":"arraylist-和-linkedlist-的时间复杂度","link":"#arraylist-和-linkedlist-的时间复杂度","children":[]},{"level":3,"title":"HashSet、LinkedHashSet、TreeSet 三者的区别","slug":"hashset、linkedhashset、treeset-三者的区别","link":"#hashset、linkedhashset、treeset-三者的区别","children":[]},{"level":3,"title":"Queue和Deque","slug":"queue和deque","link":"#queue和deque","children":[]},{"level":3,"title":"BlockingQueue","slug":"blockingqueue","link":"#blockingqueue","children":[]},{"level":3,"title":"为什么使用 Iterator 遍历数据可以增删","slug":"为什么使用-iterator-遍历数据可以增删","link":"#为什么使用-iterator-遍历数据可以增删","children":[]},{"level":3,"title":"ArrayList 源码 doto","slug":"arraylist-源码-doto","link":"#arraylist-源码-doto","children":[]},{"level":3,"title":"LinkedList 源码 todo","slug":"linkedlist-源码-todo","link":"#linkedlist-源码-todo","children":[]},{"level":3,"title":"HashMap 源码 todo","slug":"hashmap-源码-todo","link":"#hashmap-源码-todo","children":[]},{"level":3,"title":"ConcurrentHashMap 源码 todo","slug":"concurrenthashmap-源码-todo","link":"#concurrenthashmap-源码-todo","children":[]},{"level":3,"title":"LinkedHashMap 源码 todo","slug":"linkedhashmap-源码-todo","link":"#linkedhashmap-源码-todo","children":[]},{"level":3,"title":"CopyOnWriteArrayList 源码 todo","slug":"copyonwritearraylist-源码-todo","link":"#copyonwritearraylist-源码-todo","children":[]},{"level":3,"title":"ArrayBlockingQueue 源码 todo","slug":"arrayblockingqueue-源码-todo","link":"#arrayblockingqueue-源码-todo","children":[]},{"level":3,"title":"LinkedBlockingQueue 源码 todo","slug":"linkedblockingqueue-源码-todo","link":"#linkedblockingqueue-源码-todo","children":[]},{"level":3,"title":"LinkedBlockingDeque 源码 todo","slug":"linkedblockingdeque-源码-todo","link":"#linkedblockingdeque-源码-todo","children":[]},{"level":3,"title":"PriorityQueue 源码 todo","slug":"priorityqueue-源码-todo","link":"#priorityqueue-源码-todo","children":[]},{"level":3,"title":"DelayQueue 源码 todo","slug":"delayqueue-源码-todo","link":"#delayqueue-源码-todo","children":[]}]}],"git":{"createdTime":1712556293000,"updatedTime":1712556293000,"contributors":[{"name":"zhanggong","email":"zhanggong@58.com","commits":1}]},"readingTime":{"minutes":2.74,"words":821},"filePathRelative":"blog/java/java-collection.md","localizedDate":"2024年4月8日","autoDesc":true}');export{u as comp,g as data};