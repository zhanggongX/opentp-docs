---
title: Java IO
category:
  - Java
order: 20
tag:
  - Java基础
  - Java-IO
---


Java IO（输入/输出）是Java平台提供的一组API，用于执行系统输入和输出操作。Java IO API提供了一套丰富的类和接口，用于处理文件、数据流、序列化、网络编程等多种IO操作。

## Java IO 基本概念
Java IO 从流向上分类为： 输入流（Input Stream），用于从源读取数据和输出流（Output Stream），用于向目标写入数据。  
Java IO 从传输的数据类型上分为：字节流（InputStream/OutputStream）和字符流（Reader/Writer）。  
整个 Java IO 有几十个类，都是这流向和传输类型的各种组合而已。

## Java 网络IO
网络 I/O（Input/Output，即输入/输出）指的是在网络应用中，通过网络接口进行数据传输的过程。网络 I/O 通常涉及在不同计算机之间通过网络进行数据交换。  
Java 提供了丰富的类库来处理网络 I/O，主要包括基于阻塞 I/O（Blocking I/O）和非阻塞 I/O（Non-blocking I/O）以及异步IO 的模型。

### 1. 阻塞 I/O (Blocking I/O)

在阻塞 I/O 模型中，I/O 操作（如读写操作）会一直阻塞（等待），直到操作完成。例如，当一个线程从套接字读取数据时，它将一直等待，直到数据到达。

#### 主要类：
- `Socket` 和 `ServerSocket`: 用于 TCP 网络通信。
- `DatagramSocket` 和 `DatagramPacket`: 用于 UDP 网络通信。

#### 示例代码：
- TCP 客户端：
  ```java
  import java.io.*;
  import java.net.*;

  public class TCPClient {
      public static void main(String[] args) throws IOException {
          Socket socket = new Socket("localhost", 8080);
          PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
          BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
          
          out.println("Hello, Server");
          String response = in.readLine();
          System.out.println("Server response: " + response);
          
          in.close();
          out.close();
          socket.close();
      }
  }
  ```

- TCP 服务器：
  ```java
  import java.io.*;
  import java.net.*;

  public class TCPServer {
      public static void main(String[] args) throws IOException {
          ServerSocket serverSocket = new ServerSocket(8080);
          System.out.println("Server is listening on port 8080");

          while (true) {
              Socket clientSocket = serverSocket.accept();
              new ClientHandler(clientSocket).start();
          }
      }
  }

  class ClientHandler extends Thread {
      private Socket socket;

      public ClientHandler(Socket socket) {
          this.socket = socket;
      }

      public void run() {
          try {
              BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
              PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
              
              String message = in.readLine();
              System.out.println("Received: " + message);
              out.println("Echo: " + message);
              
              in.close();
              out.close();
              socket.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }
  ```

### 2. 非阻塞 I/O (Non-blocking I/O)
在非阻塞 I/O 模型中，I/O 操作是非阻塞的，线程不会因为等待 I/O 操作完成而被阻塞。Java 提供了 `java.nio` 包来支持非阻塞 I/O。

#### 主要类：
- `Selector`: 用于监视多个通道的 I/O 事件。
- `ServerSocketChannel` 和 `SocketChannel`: 非阻塞 I/O 的通道类。

#### 示例代码：
- 非阻塞 I/O 服务器：
  ```java
  import java.io.IOException;
  import java.net.InetSocketAddress;
  import java.nio.ByteBuffer;
  import java.nio.channels.SelectionKey;
  import java.nio.channels.Selector;
  import java.nio.channels.ServerSocketChannel;
  import java.nio.channels.SocketChannel;
  import java.util.Iterator;

  public class NonBlockingServer {
      public static void main(String[] args) throws IOException {
          Selector selector = Selector.open();
          ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
          serverSocketChannel.bind(new InetSocketAddress(8080));
          serverSocketChannel.configureBlocking(false);
          serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

          while (true) {
              selector.select();
              Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
              
              while (iterator.hasNext()) {
                  SelectionKey key = iterator.next();
                  iterator.remove();
                  
                  if (key.isAcceptable()) {
                      ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
                      SocketChannel socketChannel = serverChannel.accept();
                      socketChannel.configureBlocking(false);
                      socketChannel.register(selector, SelectionKey.OP_READ);
                  }
                  
                  if (key.isReadable()) {
                      SocketChannel socketChannel = (SocketChannel) key.channel();
                      ByteBuffer buffer = ByteBuffer.allocate(256);
                      int bytesRead = socketChannel.read(buffer);
                      
                      if (bytesRead == -1) {
                          socketChannel.close();
                      } else {
                          buffer.flip();
                          socketChannel.write(buffer);
                          buffer.clear();
                      }
                  }
              }
          }
      }
  }
  ```

### 3. 异步 I/O (Asynchronous I/O)
异步 I/O 模型使得 I/O 操作能够在后台执行，线程不需要等待 I/O 操作完成，可以继续执行其他任务。Java 提供了 `java.nio.channels` 包来支持异步 I/O。

#### 主要类：
- `AsynchronousServerSocketChannel` 和 `AsynchronousSocketChannel`: 用于异步 I/O 的通道类。

#### 示例代码：
- 异步 I/O 服务器：
  ```java
  import java.io.IOException;
  import java.net.InetSocketAddress;
  import java.nio.ByteBuffer;
  import java.nio.channels.AsynchronousServerSocketChannel;
  import java.nio.channels.AsynchronousSocketChannel;
  import java.nio.channels.CompletionHandler;

  public class AsyncServer {
      public static void main(String[] args) throws IOException {
          AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open();
          serverChannel.bind(new InetSocketAddress(8080));
          
          serverChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
              @Override
              public void completed(AsynchronousSocketChannel result, Void attachment) {
                  serverChannel.accept(null, this); // accept the next connection
                  ByteBuffer buffer = ByteBuffer.allocate(256);
                  result.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
                      @Override
                      public void completed(Integer bytesRead, ByteBuffer buffer) {
                          buffer.flip();
                          result.write(buffer);
                      }

                      @Override
                      public void failed(Throwable exc, ByteBuffer attachment) {
                          exc.printStackTrace();
                      }
                  });
              }

              @Override
              public void failed(Throwable exc, Void attachment) {
                  exc.printStackTrace();
              }
          });

          // keep the main thread alive
          while (true) {
              try {
                  Thread.sleep(1000);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
      }
  }
  ```

### 选择适合的 I/O 模型
- 阻塞 I/O: 简单易用，适合低并发的应用。
- 非阻塞 I/O: 适合高并发应用，通过多路复用技术提高性能。
- 异步 I/O: 提供更高的并发处理能力，适合需要高性能和低延迟的应用。


### 常见的IO模型
同步IO，同步非阻塞IO，IO多路复用，事件驱动IO，异步IO  
BIO，Socket/ServerSocket  
NIO（IO多路复用基于NIO） 三大核心组件  Channel，Selector，Buffer  
AIO  

### IO多路复用和同步非阻塞IO的区别
同步非阻塞IO模型，应用程序会一直发起 Read 调用，只不过读不到数据不会阻塞程序（当数据从内核态到用户态的过程中，仍然是阻塞的）。  
IO 多路复用会先发起 Select 调用，只有当内核数据准备好后才会发起 Read 调用（当数据从内核态到用户态的过程中，仍然是阻塞的）。  
区别就是一个是轮循所有的 IO，一个是只发起内核的 Select / epoll 调用  
> Ps：几乎所有的内核都支持 select , 而 epoll 是 select 的增强版本，linux2.6内核后才有，增强了IO效率。  

### Selector、Poll、Epoll 的区别
selector 和 poll 都是通过轮询监听的端口取到读写事件然后去处理。  
他们俩的区别就是 selector 底层是数组实现的，有个数限制即 1024 个，poll 底层是链表实现的，没有个数限制。  
epoll 则是事件驱动的，底层是红黑树，也没有链接个数限制。  
epoll 三个 linux 函数，分别是 epoll_create 创建epoll 监听， epoll_ctl 加入到监听， epoll_wait 等待链接、读、写事件。

### NIO的三大组件
Selector  
基于事件驱动的I/O多路复用模型  
Selector 监控注册到其的 Channel，然后监听 Channel 的事件  
比如接受链接，发起链接，读，写  

Buffer  
jdk提供了各种buffer, intbuffer, bytebuffer 等等  
它的核心成员 capacity, limit, position, mark  
它的核心方法 flip(切换读模式) get put clean（切换写模式）  

Channel  
channel 是和文件打交道的，网络套接字也是文件  
read 将数据读取到 buffer  
write 将buffer数据写入channel  

## 零拷贝
### 什么是零拷贝
零拷贝技术旨在尽可能减少数据在用户态和内核态之间的拷贝次数。通过直接在内核态内传输数据，零拷贝可以显著提高数据传输效率。

### 零拷贝技术实现
1. DMA（Direct Memory Access，直接内存访问）  
DMA 是一种允许设备（如硬盘或网络接口卡）直接访问系统内存的技术。通过 DMA，数据可以直接在设备和内存之间传输，而无需经过 CPU，从而减少 CPU 负载。
> 在 DMA 技术出现之前，数据的拷贝都需要 CPU 参与，数据的拷贝占据了大量的 CPU 时间， DMA 技术出现后，数据拷贝期间只有少量的工作需要 CPU 参与。

2. sendfile 系统调用  
sendfile 是 Linux 提供的一种零拷贝系统调用，用于在文件描述符之间直接传输数据。sendfile 使数据从文件系统缓冲区直接传输到网络缓冲区，而无需在用户态和内核态之间进行拷贝。

3. mmap + write（Memory Mapping，内存映射）  
mmap 将文件的内容直接映射到进程的虚拟内存地址空间，使得应用程序可以像操作内存一样操作文件内容。这是一种内存映射技术，它可以将一个文件或者文件的一部分映射到内存中，形成一个虚拟内存文件，这样就可以直接操作内存中的数据，而不需要通过系统调用来读写文件，可以减少用户态和内核态之间的数据拷贝。

#### 总结
早期 I/O 操作，内存与磁盘的数据传输的工作都是由 CPU 完成的，而此时 CPU 不能执行其他任务，会特别浪费 CPU 资源。  
DMA 技术的出现，使得每个 I/O 设备都有自己的 DMA 控制器，通过这个 DMA 控制器，CPU 只需要告诉 DMA 控制器，我们要传输什么数据，从哪里来，到哪里去，就可以放心离开了。后续的实际数据传输工作，都会由 DMA 控制器来完成，CPU 不需要参与数据传输的工作。  
早期 DMA 只存在在主板上，如今由于 I/O 设备越来越多，数据传输的需求也不尽相同，所以每个 I/O 设备里面都有自己的 DMA 控制器， DMA 使得 CPU 从数据拷贝中解放了出来，否则会被整个计算机中最慢的硬盘拖累。  

目前实现零拷贝的方式主要有两种：mmap+wirte 和 sendfile

## 不同的文件传输方式对比
### 传统的文件传输
基于系统的read/write方法。
```c
read(file, tmp_buf, len);
write(socket, tmp_buf, len);
```
传统的文件传输会有四次用户态/内核态的切换和四次数据拷贝。  

四次用户态与内核态的上下文切换，因为发生了两次系统调用，一次是 read() ，一次是 write()，每次系统调用都得先从用户态切换到内核态，等内核完成任务后，再从内核态切换回用户态。  

上下文切换到成本较高，在高并发的场景下，会影响系统的性能。

四次数据拷贝，其中两次是 DMA 的拷贝，另外两次则是通过 CPU 拷贝的。
1. 把磁盘上的数据拷贝到操作系统内核的缓冲区里，这个拷贝的过程是通过 DMA 搬运的。
2. 把内核缓冲区的数据拷贝到用户的缓冲区里，于是我们应用程序就可以使用这部分数据了，这个拷贝到过程是由 CPU 完成的。
3. 把刚才拷贝到用户的缓冲区里的数据，再拷贝到内核的 socket 的缓冲区里，这个过程依然还是由 CPU 搬运的。
4. 把内核的 socket 缓冲区里的数据，拷贝到网卡的缓冲区里，这个过程又是由 DMA 搬运的。

### 基于 mmap+write 的文件传输
传统的文件传输中 read() 系统调用的过程中会把内核缓冲区的数据拷贝到用户的缓冲区里，为了减少这一步开销，可以用 mmap() 替换 read() 系统调用函数。
```c
buf = mmap(file, len);
write(sockfd, buf, len);
```
mmap+write 会有四次用户态/内核态切换，但是只有三次数据拷贝。  
1. 应用进程调用了 mmap() 后，DMA 会把磁盘的数据拷贝到内核的缓冲区里。接着，应用进程跟操作系统内核「共享」这个缓冲区；  
2. 应用进程再调用 write()，操作系统直接将内核缓冲区的数据拷贝到 socket 缓冲区中，这一切都发生在内核态，由 CPU 来搬运数据；
3. 最后，把内核的 socket 缓冲区里的数据，拷贝到网卡的缓冲区里，这个过程是由 DMA 搬运的。

**这个过程中没有了 read 把数据从内核态拷贝到用户态和 write 把数据从用户态再写入到内核态。所以共四次上下文切换+三次数据拷贝，减少数据操作耗时**

### sendFile
在 Linux 内核版本 2.1 中，提供了一个专门发送文件的系统调用函数 sendfile()。
```c
#include <sys/socket.h>
ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
```
它可以替代前面的 read() 和 write() 这两个系统调用，这样就可以减少一次系统调用，也就减少了两次上下文切换的开销。  
该系统调用，可以直接把内核缓冲区里的数据拷贝到 socket 缓冲区里，不再拷贝到用户态，**这样就只有两次上下文切换，和三次数据拷贝。**

## Java 中的零拷贝实现
Java 提供了几种实现零拷贝的方式，主要通过 `java.nio` 包中的 `FileChannel` 类来实现。  
MappedByteBuffer 是基于 Linux 内核的 mmap + write 实现的。    
TransferTo 基于 Linux sendfile 实现。

### MappedByteBuffer
```java
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class MappedByteBufferExample {
    public static void main(String[] args) throws Exception {
        try (RandomAccessFile file = new RandomAccessFile("example.txt", "rw");
             FileChannel channel = file.getChannel()) {

            long size = channel.size();
            MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, size);

            for (int i = 0; i < size; i++) {
                byte b = buffer.get(i);
                buffer.put(i, (byte)(b + 1)); // Example modification: increment each byte by 1
            }
        }
    }
}

```


### TransferTo/TransferFrom
`transferTo` 方法将数据从一个文件通道直接传输到另一个通道，无需在用户态和内核态之间来回拷贝数据。  
`transferFrom` 方法将数据从一个通道传输到文件通道，类似于 `transferTo`。

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.channels.FileChannel;

public class ZeroCopyExample {
    public static void main(String[] args) throws Exception {
        try (FileInputStream fis = new FileInputStream("source.txt");
             FileOutputStream fos = new FileOutputStream("destination.txt");
             FileChannel sourceChannel = fis.getChannel();
             FileChannel destChannel = fos.getChannel()) {

            long position = 0;
            long count = sourceChannel.size();
            sourceChannel.transferTo(position, count, destChannel);
        }
    }
}
```

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.channels.FileChannel;

public class ZeroCopyExample {
    public static void main(String[] args) throws Exception {
        try (FileInputStream fis = new FileInputStream("source.txt");
             FileOutputStream fos = new FileOutputStream("destination.txt");
             FileChannel sourceChannel = fis.getChannel();
             FileChannel destChannel = fos.getChannel()) {

            long position = 0;
            long count = sourceChannel.size();
            destChannel.transferFrom(sourceChannel, position, count);
        }
    }
}
```



### 零拷贝的应用场景

- **文件传输**: 在服务器之间传输大文件时，使用零拷贝可以显著提高传输速度。
- **网络编程**: 高性能网络应用（如 Web 服务器、文件服务器）使用零拷贝技术来提高数据传输效率。
- **多媒体处理**: 处理大文件（如视频、音频）时，通过零拷贝减少不必要的内存拷贝，提高处理速度。

### 注意事项

- 零拷贝技术依赖于操作系统和底层硬件的支持，不同操作系统对零拷贝的支持情况不同。
- 在某些情况下，使用零拷贝可能会带来一些限制，例如在进行复杂的文件操作时可能不适用。


## 推荐
[小林coding的什么是零拷贝](https://www.xiaolincoding.com/os/8_network_system/zero_copy.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%9C%89-dma-%E6%8A%80%E6%9C%AF)