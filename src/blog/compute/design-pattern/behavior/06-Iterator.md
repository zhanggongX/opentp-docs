---
title: 迭代器模式
category:
  - 设计模式
order: 6
tag:
  - 迭代器模式
  - 行为型设计模式
---

### 迭代器模式
提供一种方法顺序访问一个聚合对象中各个元素，而又不暴露该对象的内部表示。  

一个聚集对象，而且不管这些对象是什么都需要遍历的时候，你就应该考虑用迭代器模式。  

你需要对聚集有多种方式遍历时，可 以考虑用迭代器模式。  

为遍历不同的聚集结构提供 如开始、下一个、是否结束、当前哪一项等统一的接口。  

> 迭代器(Iterator)模式就是分离了集合对象的遍历行为，抽象出一个迭代器类来负责，这样既可以做到不暴露集合的内部结构，又可让外部代码透明地访问集合内部的数据。。  


### 代码
```java
// 参考JDK的迭代器。
public interface Iterator<E> {
    
    boolean hasNext();

    E next();
    
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}


protected static class LinkedListIterator<E> implements ListIterator<E>, OrderedIterator<E> {
        protected final AbstractLinkedList<E> parent;
        protected Node<E> next;
        protected int nextIndex;
        protected Node<E> current;
        protected int expectedModCount;

        protected LinkedListIterator(AbstractLinkedList<E> parent, int fromIndex) throws IndexOutOfBoundsException {
            this.parent = parent;
            this.expectedModCount = parent.modCount;
            this.next = parent.getNode(fromIndex, true);
            this.nextIndex = fromIndex;
        }

        protected void checkModCount() {
            if (this.parent.modCount != this.expectedModCount) {
                throw new ConcurrentModificationException();
            }
        }

        protected Node<E> getLastNodeReturned() throws IllegalStateException {
            if (this.current == null) {
                throw new IllegalStateException();
            } else {
                return this.current;
            }
        }

        public boolean hasNext() {
            return this.next != this.parent.header;
        }

        public E next() {
            this.checkModCount();
            if (!this.hasNext()) {
                throw new NoSuchElementException("No element at index " + this.nextIndex + ".");
            } else {
                E value = this.next.getValue();
                this.current = this.next;
                this.next = this.next.next;
                ++this.nextIndex;
                return value;
            }
        }

        public boolean hasPrevious() {
            return this.next.previous != this.parent.header;
        }

        public E previous() {
            this.checkModCount();
            if (!this.hasPrevious()) {
                throw new NoSuchElementException("Already at start of list.");
            } else {
                this.next = this.next.previous;
                E value = this.next.getValue();
                this.current = this.next;
                --this.nextIndex;
                return value;
            }
        }

        public int nextIndex() {
            return this.nextIndex;
        }

        public int previousIndex() {
            return this.nextIndex() - 1;
        }

        public void remove() {
            this.checkModCount();
            if (this.current == this.next) {
                this.next = this.next.next;
                this.parent.removeNode(this.getLastNodeReturned());
            } else {
                this.parent.removeNode(this.getLastNodeReturned());
                --this.nextIndex;
            }

            this.current = null;
            ++this.expectedModCount;
        }

        public void set(E obj) {
            this.checkModCount();
            this.getLastNodeReturned().setValue(obj);
        }

        public void add(E obj) {
            this.checkModCount();
            this.parent.addNodeBefore(this.next, obj);
            this.current = null;
            ++this.nextIndex;
            ++this.expectedModCount;
        }
    }
```