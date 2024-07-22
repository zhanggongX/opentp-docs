---
title: Dijkstra
category:
  - 图论算法
order: 20
tag:
  - 算法
  - 图
---

## Dijkstra
一般翻译为迪杰斯特拉算法，主要是为了解决有向有权图（非负权）的最短路径问题。本文主要介绍，怎么从抽象一个图，到从普通的二叉树的层序遍历，再到图的层序遍历，最后实现 Dijkstra 算法。

### 图的抽象
首先说一下，我怎么遍历一个图，一般图论算法，都是给出边的数组，例如 `edges = [[0,1],[1,2],[0,2]]`，表示点0&1、1&2、0&2 之间各有一条边，通过三条边，把三个点连成了一个图。  
那我们实际解题的时候，一般都会把这个数组转成临接表 `List<Integer>[]`，来方便我们进行遍历，数组的下标就是点，数组的内容 `List<Integer>` 就是这个点通过边直接关联的所有点。
```java
/**
 * 图转临接表
 *
 * @param graph 图
 * @return 临接表
 */
public List<Integer>[] graphToConnectorList(int[][] graph) {
    List<Integer>[] g = new ArrayList[graph.length];
    Arrays.setAll(g, e -> new ArrayList<>());

    for (int[] cur : graph) {
        g[cur[0]].add(cur[1]);
        g[cur[1]].add(cur[0]);
    }
    
    return g;
}
// g : [[1,2],[0,2],[1,0]]
// 0 的 链接节点是 [1,2]
// 1 的 链接节点是 [0,2]
// 2 的 链接节点是 [1,0]
```
### 二叉树的 BFS 层序遍历
```java
void dfs(TreeNode root) {
    if (root == null) return;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);

    int depth = 1;
    while (!q.isEmpty()) {
        // 这里是遍历每一层的关键
        int size = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode curNode = q.poll();
            log.info("节点 {} 在第 {} 层", curNode.val, depth);
            // 下一层节点入队
            for (TreeNode child : curNode.children) {
                q.offer(child);
            }
        }
        // 层数+1
        depth++;
    }
}
```

### 无权图的 BFS 层序遍历
```java
int bfs(Integer start) {
    Queue<Integer> q; 
    // 记录走过的节点
    Set<Integer> vis; 
    
    q.offer(start); 
    visited.add(start);
    // 层级
    int depth = 0; 
    while (!q.isEmpty()) {
        // 层序遍历的核心逻辑
        int size = q.size();
        for (int i = 0; i < size; i++) {
            Integer cur = q.poll();
            log.info("从 {} 到 {} 的最短距离是 {}", start, cur, depth);

            // 将 cur 的相邻节点加入队列
            for (Integer x : cur的临接list) {
                if (x is not in vis) {
                    q.offer(x);
                    vis.add(x);
                }
            }
        }
        depth++;
    }
}
```

### Dijkstra 算法
无权图，其实就是相当于每条边权重都是 1 的有权图，因为每条边的长度都是 1，所以从起点进行 BFS 层序遍历的深度，就是起点到所有节点的的距离，但是针对有权图，单纯的 BFS 层序遍历就不行了。

Dijkastra 算法核心是三步：  
1. 选源点到那个节点近而且该节点未被访问。
2. 该最近节点标记为访问过。
3. 更新非访问节点到源点的距离（dist数组）。

#### 举例：[2642. 设计可以求最短路径的图类](https://leetcode.cn/problems/design-graph-with-shortest-path-calculator/description/)
```text
给你一个有 n 个节点的 有向带权图，节点编号为 0 到 n - 1。
图中的初始边用数组 edges 表示，
其中 edges[i] = [fromi, toi, edgeCosti] 表示从 fromi 到 toi 有一条代价为 edgeCosti 的边。

请你实现一个 Graph 类：
Graph(int n, int[][] edges) 
初始化图有 n 个节点，并输入初始边。

addEdge(int[] edge) 
向边集中添加一条边，其中 edge = [from, to, edgeCost] 。数据保证添加这条边之前对应的两个节点之间没有有向边。

int shortestPath(int node1, int node2) 
返回从节点 node1 到 node2 的路径 最小 代价。如果路径不存在，返回 -1 。一条路径的代价是路径中所有边代价之和。
```
这个例子很清晰的展示了 Dijkstra 的解题过程：
1. Graph(int n, int[][] edges) 方法，就是图的抽象，通过这个构造方法，可以把图抽象成临接表。
2. addEdge(int[] edge) ，图的抽象可以借助该方法，再调用该方法，就是往临接表添加内容。
3. 通过 Dijkstra 进行 BFS 遍历，并更新距离信息。

```java
class Graph {
    // 节点数目
    private int n;
    // 临界矩阵，因为需要记录权重，所以使用临接矩阵比较合适。
    private int[][] g;
    // 最大值
    private final int INF = 1 << 29;

    public Graph(int n, int[][] edges) {
        this.n = n;
        g = new int[n][n];
        for (int[] f : g) {
            Arrays.fill(f, INF);
        }
        for (int[] e : edges) {
            addEdge(e);
        }
    }

    public void addEdge(int[] edge) {
        g[edge[0]][edge[1]] = edge[2];
    }
    
    // Dijkstra 算法
    public int shortestPath(int node1, int node2) {
        // 距离记录
        int[] dist = new int[n];
        // 是否访问过
        boolean[] vis = new boolean[n];
        Arrays.fill(dist, INF);
        // 当前节点为 0
        dist[node1] = 0;

        for (int i = 0; i < n; ++i) {
            int t = -1;
            // 找到当前未被访问过的节点 j，并赋值给 t
            for (int j = 0; j < n; ++j) {
                if (!vis[j] && (t == -1 || dist[t] > dist[j])) {
                    t = j;
                }
            }
            // 标记 t 已被访问过
            vis[t] = true;
            for (int j = 0; j < n; ++j) {
                // 遍历所有节点， g[t][j] 如果没有边肯定是大于 dist[j] 的。
                // 所以能更新 dist[j] 的值的肯定是 t, j 之间有边路的，通过比较就能得到最小值的 dist[j].
                dist[j] = Math.min(dist[j], dist[t] + g[t][j]);
            }
        }

        // 如果没有到达，返回 -1， 否则返回距离。
        return dist[node2] >= inf ? -1 : dist[node2];
    }
}
```
可以进一步通过堆优化 Dijkstra 算法
```java
class Graph {

    // 邻接表
    private final List<int[]>[] g; 

    public Graph(int n, int[][] edges) {
        g = new ArrayList[n];
        Arrays.setAll(g, i -> new ArrayList<>());
        for (int[] e : edges) {
            addEdge(e);
        }
    }

    public void addEdge(int[] e) {
        g[e[0]].add(new int[]{e[1], e[2]});
    }

    public int shortestPath(int start, int end) {
        // dis[i] 表示从起点 start 出发，到节点 i 的最短路长度
        int[] dis = new int[g.length]; 
        Arrays.fill(dis, Integer.MAX_VALUE);
        dis[start] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> (a[0] - b[0]));
        pq.offer(new int[]{0, start});

        while (!pq.isEmpty()) {
            int[] p = pq.poll();
            // 距离
            int d = p[0];
            // 当前节点
            int x = p[1];
            // 已经计算出从起点到终点的最短路长度
            if (x == end) { 
                return d;
            }

            // x 之前出堆过，无需更新邻居的最短路
            if (d > dis[x]) { 
                continue;
            }
            
            for (int[] e : g[x]) {
                int y = e[0];
                int w = e[1];
                if (d + w < dis[y]) {
                    // 更新最短路长度
                    dis[y] = d + w; 
                    pq.offer(new int[]{dis[y], y});
                }
            }
        }
        // 返回没有结果的默认值。
        return -1; 
    }
}
```
