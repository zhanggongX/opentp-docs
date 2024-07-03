---
title: 图论算法基础
category:
  - 图论算法
order: 1
tag:
  - 算法
  - 图
---

## 图论算法
主要用到的算法有，DFS、BFS、并查集、拓扑排序、拓扑排序 DP、基环树、单源最短路 Dijkstra、全源最短路 Floyd、最小生成树 Kruskal/Prim、欧拉路径、二分图、网络流等。

由于图论算法还是有一定难度的，所以博客更新较慢，但是每种算法都会逐渐更新到。

本篇博客，主要介绍 DFS/BFS/并查集 相关的一些图算法，其实基础的图论算法和网格图非常像，只不过网格图是通过一个二维数组来表示图，而图论算法里边的图，都是使用 Node 来表示的。

### Leetcode示例 [547 省份数量](https://leetcode.cn/problems/number-of-provinces/description/)
```text
有 n 个城市，其中一些彼此相连，另一些没有相连。
如果城市 a 与城市 b 直接相连，且城市 b 与城市 c 直接相连，那么城市 a 与城市 c 间接相连。
省份 是一组直接或间接相连的城市，组内不含其他没有相连的城市。
给你一个 n x n 的矩阵 isConnected ，
其中 
isConnected[i][j] = 1 表示第 i 个城市和第 j 个城市直接相连， 
isConnected[i][j] = 0 表示二者不直接相连。
返回矩阵中 省份 的数量。
```
请注意区分这个题目和网格图中示例 [网格图：岛屿数量](https://opentp.cn/blog/algorithm/40-grid.html#%E7%A4%BA%E4%BE%8B-200-%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F)的分别，在网格图岛屿数量的示例中，联通的是二维数组的各个点，即 (i,j) 和 (x,y) 两个点是否相连，而本题二维数组中的 1，表示 i 和 j 两个点相连。虽然都是可以使用 BFS/DFS/UnionFind 解决，但是还是不同的，这里的二维数组其实就是图的临界表，一般的图论算法中，解题都要先的到图的临接表，本题相当于直接给的就是临接表。
> 对 DFS/BFS/并查集 不熟悉可以参考 [网格图](http://localhost:8080/blog/algorithm/40-grid.html) 有相关介绍。


所以解法入下：
```java
// DFS/BFS
class Solution {
    
    private int[][] isConnected;
    private int cities;
    private boolean[] vis;
    private Queue<Integer> queue = new LinkedList<Integer>();
    
    public int findCircleNum(int[][] isConnected) {
        this.cities = isConnected.length;
        this.vis = new boolean[cities];
        this.isConnected = isConnected;

        int res = 0;
        for (int i = 0; i < cities; i++) {
            if (!vis[i]) {
                // bfs(i);
                // dfs(i);
                // 说明没有遍历到，是一个新的省份。
                res ++;
            }
        }
        return res;
    }

    private void dfs(int i) {
        for (int j = 0; j < cities; j++) {
            if (isConnected[i][j] == 1 && !vis[j]) {
                vis[j] = true;
                dfs(j);
            }
        }
    }

    private void bfs(int i){
        queue.offer(i);
        while(!queue.isEmpty()){
            int j = queue.poll();
            vis[j] = true;
            for(int k = 0; k < cities; k++){
                if(isConnected[j][k] == 1 && !vis[k]){
                    queue.offer(k);
                }
            }
        }
    }
}
```

并查集解法：
```java
class Solution {

    private int cities = 0;
    private int[] parent = null;

    public int findCircleNum(int[][] isConnected) {
        this.cities = isConnected.length;
        this.parent = new int[cities];
        // 初始化并查集
        initUnionF();

        for (int i = 0; i < cities; i++) {
            for (int j = i + 1; j < cities; j++) {
                if (isConnected[i][j] == 1) {
                    // 合并
                    union(i, j);
                }
            }
        }

        int provinces = 0;
        for (int i = 0; i < cities; i++) {
            if (parent[i] == i) {
                provinces++;
            }
        }
        return provinces;
    }

    public void initUnionF(){
        for (int i = 0; i < cities; i++) {
            parent[i] = i;
        }
    }

    public void union(int index1, int index2) {
        parent[find(index1)] = find(index2);
    }

    public int find(int index) {
        if (parent[index] != index) {
            parent[index] = find(parent[index]);
        }
        return parent[index];
    }
}
```
### 总结
简单的图算法，是先统计出 Node 的临接表，然后通过 BFS/DFS 遍历图，通过一些记忆化搜索，统计出答案，如果是图的连通性的问题，一般也可通过并查集来解决。

本题（lt 547） 因为相当于给出了临接表，所以没有统计的过程，因为和连通性也相关，所以使用 DFS/BFS、并查集，都可以解决。