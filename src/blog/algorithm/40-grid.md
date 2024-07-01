---
title: 网格
category:
  - 算法
order: 40
tag:
  - 算法
  - 网格图
  - dfs
  - bfs
---

## 网格图
网格图一般就是给一个二维数组，数组数字由1/0组成，代表不同的含义，例如1是陆地，0是水，题目一般求 `区域个数`，`感染问题（1 每次运算都会扩散）`，`着色问题` 等。  
网格图一般既可以使用 BFS、DFS、并查集解决，具体用法可以根据题目要求，选择合适的算法。

## 示例：[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/description/)
```text
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围。

示例 1：
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1
```

### DFS 解法。
```java
class Solution {
    // 四个方向
    private static final int[][] dir = {{-1, 0}, {0, -1}, {1, 0}, {0, 1}};
    // 点[i][j] 是否访问过
    private boolean[][] vis;
    // 源数组，省的在方法里来回传递。
    private char[][] grid;
    // 行数
    private int row;
    // 列数
    private int col;

    public int numIslands(char[][] grid) {
        row = grid.length;
        if (row == 0) return 0;
        col = grid[0].length;

        this.grid = grid;
        vis = new boolean[row][col];

        int res = 0;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (!vis[i][j] && grid[i][j] == '1') {
                    // 去进行深度遍历，同时在 vis 里记录所有能遍历到的点。
                    dfs(i, j);
                    // 如果这里能执行到，说明当前点是一个陆地，但是没有被 dfs 遍历到
                    // 那就说明不是一片岛，所以 res 要 +1；
                    res ++;
                }
            }
        }
        return res;
    }

    private void dfs(int i, int j) {
        vis[i][j] = true;
        for (int k = 0; k < 4; k++) {
            int newI = i + dir[k][0];
            int newJ = j + dir[k][1];
            if (inArea(newI, newJ) && grid[newI][newJ] == '1' && !vis[newI][newJ]) {
                dfs(newI, newJ);
            }
        }
    }

    private boolean inArea(int i, int j) {
        // 判断数组坐标 i，j 有没有越界。
        return i >= 0 && i < row && j >= 0 && j < col;
    }
}
```

### BFS 解法
```java
class Solution {
    // 四个方向
    private static final int[][] dir = {{-1, 0}, {0, -1}, {1, 0}, {0, 1}};
    // 点[i][j] 是否访问过
    private boolean[][] vis;
    // 源数组，省的在方法里来回传递。
    private char[][] grid;
    // 行数
    private int row;
    // 列数
    private int col;

    public int numIslands(char[][] grid) {
        row = grid.length;
        if (row == 0) return 0;
        col = grid[0].length;

        this.grid = grid;
        vis = new boolean[row][col];

        int res = 0;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (!vis[i][j] && grid[i][j] == '1') {
                    // 去进行广度遍历，同时在 vis 里记录所有能遍历到的点。
                    bfs(i, j);
                    // 如果这里能执行到，说明当前点是一个陆地，但是没有被 bfs 遍历到
                    // 那就说明不是一片岛，所以 res 要 +1；
                    res ++;
                }
            }
        }
        return res;
    }

    private void dfs(int i, int j) {
        vis[i][j] = true;
        for (int k = 0; k < 4; k++) {
            int newI = i + dir[k][0];
            int newJ = j + dir[k][1];
            if (inArea(newI, newJ) && grid[newI][newJ] == '1' && !vis[newI][newJ]) {
                dfs(newI, newJ);
            }
        }
    }

    private void bfs(int i, int j) {
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{i, j});
        vis[i][j] = true;

        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            
            for (int k = 0; k < 4; k++) {
                int newI = cur[0] + dir[k][0];
                int newJ = cur[1] + dir[k][1];

                if (inArea(newI, newJ) && grid[newI][newJ] == '1' && !vis[newI][newJ]) {
                    queue.offer(new int[]{newI, newJ});
                    vis[newI][newJ] = true;
                }
            }
        }
    }

    private boolean inArea(int i, int j) {
        // 判断数组坐标 i，j 有没有越界。
        return i >= 0 && i < row && j >= 0 && j < col;
    }
}
```

### 总结
这就是网格图 DFS/BFS 普通的解法，当然要根据不同的题目进行调整，大体上都是要通过 DFS/BFS 进行遍历，同时进行一些记录，再通过记录得出题目需要的结果。  

同时这里也记录下 BFS/DFS 的模板，进行树的遍历的时候， BFS/DFS 也是常用的算法。
```java
// DFS 算法框架。
private void dfs(int i, int j) {
    // DFS 遍历，进来之后，这里要判断下一步能继续深入的地方。
    // 如果是树结构，这里大概就是所有的子树，本题就是 i，j 的四个方向。
    for (。。。) {
        // 这里获取到下一个节点。
        next = 。。。
        // 这里进行判断，如果是树结构，一般需要判断树的值的大小等，
        // 如果是图，则需要判断图的来的方向，防止无限循环下去。
        // 本题这里判断了是否访问过，以及是否到了数组的边界外。
        if (assert next) {
            // 如果没有问题，则 dfs 递归下去。
            dfs(nexti, nextj);
        }
    }
}

// BFS 算法框架
private void bfs(int i, int j) {
    // BFS 算法一般需要队列来进行辅助。
    Queue<int[]> queue = new LinkedList<>();
    // 先把当前节点入队列。
    queue.offer(new int[]{i, j});

    // 循环直到队列为空
    while (!queue.isEmpty()) {
        // 1.
        // 如果需要进行层序遍历，即遍历是一层一层的往外扩散的，这里要先获取一些队列的长度
        // 就是说队列内，这个长度的数据都是一层的。
        int size = queue.size();
        for(int i = 0; i < size; i++){
          int[] cur = queue.poll();
          // 执行某一层的统计逻辑。
          // do logic
        }

        // 2.
        // 如果不需要层序遍历。则直接获取队列内容，处理即可。
        int[] cur = queue.poll();
        // do logic, 本题的 logic 就是记录当前点的四个方向，把他们入队列，并标记成访问过。
        for (int k = 0; k < 4; k++) {
            int newI = cur[0] + dir[k][0];
            int newJ = cur[1] + dir[k][1];

            if (inArea(newI, newJ) && grid[newI][newJ] == '1' && !vis[newI][newJ]) {
                queue.offer(new int[]{newI, newJ});
                vis[newI][newJ] = true;
            }
        }
    }
}
```

### 并查集解法
[并查集介绍](https://oi-wiki.org/ds/dsu/)
```java
public class Solution {

    private int row;
    private int col;

    public int numIslands(char[][] grid) {
        row = grid.length;
        if (row == 0) return 0;
        col = grid[0].length;

        // 空地的数量
        int spaces = 0;
        UnionFind unionFind = new UnionFind(row * col);
        int[][] dirs = {{1, 0}, {0, 1}};
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == '0') {
                    spaces++;
                } else {
                    for (int[] dir : dirs) {
                        int newI = i + dir[0];
                        int newJ = j + dir[1];
                        // 先判断坐标合法，再检查右边一格和下边一格是否是陆地
                        if (newI < row && newJ < col && grid[newI][newJ] == '1') {
                            unionFind.union(getIndex(i, j), getIndex(newI, newJ));
                        }
                    }
                }
            }
        }
        return unionFind.getCount() - spaces;
    }

    private int getIndex(int i, int j) {
        return i * col + j;
    }

    private class UnionFind {
        /**
         * 连通分量的个数
         */
        private int count;
        private int[] parent;

        public int getCount() {
            return count;
        }

        public UnionFind(int n) {
            this.count = n;
            parent = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }

        private int find(int x) {
            while (x != parent[x]) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        }

        public void union(int x, int y) {
            int xRoot = find(x);
            int yRoot = find(y);
            if (xRoot == yRoot) {
                return;
            }

            parent[xRoot] = yRoot;
            count--;
        }
    }
}
```