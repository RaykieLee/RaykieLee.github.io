---
title: 2018-省赛-Java语言大学C组
date: 2018-11-05 17:59:45
toc: true
tags: [蓝桥杯,算法,]
---
2018第九届蓝桥杯Java语言C组&非官方答案
<!-- more -->
# 2018-省赛-Java语言大学C组
##### 1:哪天返回

小明被不明势力劫持。后被扔到x星站再无问津。小明得知每天都有飞船飞往地球，但需要108元的船票，而他却身无分文。
他决定在x星战打工。好心的老板答应包食宿，第1天给他1元钱。
并且，以后的每一天都比前一天多2元钱，直到他有足够的钱买票。
请计算一下，小明在第几天就能凑够108元，返回地球。

要求提交的是一个整数，表示第几天。请不要提交任何多余的内容。

````JAVA
	public static void main(String[] args) {
		int t=1,n=1,m=0;
		while(m<108) {
			t++;
			n+=2;
			m+=n;
		}
		System.out.println(t);
	}
````

##### 2；猴子分香蕉

5只猴子是好朋友，在海边的椰子树上睡着了。这期间，有商船把一大堆香蕉忘记在沙滩上离去。
第1只猴子醒来，把香蕉均分成5堆，还剩下1个，就吃掉并把自己的一份藏起来继续睡觉。
第2只猴子醒来，重新把香蕉均分成5堆，还剩下2个，就吃掉并把自己的一份藏起来继续睡觉。
第3只猴子醒来，重新把香蕉均分成5堆，还剩下3个，就吃掉并把自己的一份藏起来继续睡觉。
第4只猴子醒来，重新把香蕉均分成5堆，还剩下4个，就吃掉并把自己的一份藏起来继续睡觉。
第5只猴子醒来，重新把香蕉均分成5堆，哈哈，正好不剩！

请计算一开始最少有多少个香蕉。

需要提交的是一个整数，不要填写任何多余的内容。
````java
	public static void main(String[] args) {
		int sum=5;
		for(int i=4;i>0;i--)sum=sum*5+i;
		System.out.println(sum);
	}
````
##### 4；第几个幸运数

到x星球旅行的游客都被发给一个整数，作为游客编号。
x星的国王有个怪癖，他只喜欢数字3,5和7。
国王规定，游客的编号如果只含有因子：3,5,7,就可以获得一份奖品。

我们来看前10个幸运数字是：
3 5 7 9 15 21 25 27 35 45
因而第11个幸运数字是：49

小明领到了一个幸运数字 59084709587505，他去领奖的时候，人家要求他准确地说出这是第几个幸运数字，否则领不到奖品。

请你帮小明计算一下，59084709587505是第几个幸运数字。

需要提交的是一个整数，请不要填写任何多余内容。

````java
static ArrayList<Long>  threelist =new  ArrayList<>();
	static ArrayList<Long>  list =new  ArrayList<>();
	static ArrayList<Long>  fivelist =new  ArrayList<>();
	static ArrayList<Long>  sevenlist =new  ArrayList<>();
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner str =new Scanner(System.in);
		long input = str.nextLong();
		long num=3;
		add(3);
		add(5);
		add(7);
		while(num!=input) {
			num=Math.min(Math.min(threelist.get(0)*3, fivelist.get(0)*5), sevenlist.get(0)*7);
			if(num/threelist.get(0)==3) threelist.remove(0);
			if(num/fivelist.get(0)==5) fivelist.remove(0);
			if(num/sevenlist.get(0)==7) sevenlist.remove(0);
			add(num);
		}
		System.out.println(list.size()+1);
	}
	private static void add(long i) {
		if(!list.contains(i)) {
			list.add(i);
			threelist.add(i);
			fivelist.add(i);
			sevenlist.add(i);
		}
````
##### 5:书号验证

2004年起，国际ISBN中心出版了《13位国际标准书号指南》。
原有10位书号前加978作为商品分类标识；校验规则也改变。
校验位的加权算法与10位ISBN的算法不同，具体算法是：
用1分别乘ISBN的前12位中的奇数位（从左边开始数起），用3乘以偶数位，乘积之和以10为模，10与模值的差值再对10取模（即取个位的数字）即可得到校验位的值，其值范围应该为0~9。

下面的程序实现了该算法，请仔细阅读源码，填写缺失的部分。
````java
	static boolean f(String s){
		int k=1;
		int sum = 0;
		for(int i=0; i<s.length(); i++){
			char c = s.charAt(i);
			if(c=='-' || c==' ') continue;
			sum +=(k%2+1)*3*(int)('c'-48)+(k%2)*(int)('c'-48) ;  //填空
			k++;
			if(k>12) break; 
		}
		
		return s.charAt(s.length()-1)-'0' == (10-sum % 10)%10;
	}
	
	public static void main(String[] args){
		System.out.println(f("978-7-301-04815-3"));
		System.out.println(f("978-7-115-38821-6"));
	}
````

##### 6:打印大X

如下的程序目的是在控制台打印输出大X。
可以控制两个参数：图形的高度，以及笔宽。

用程序中的测试数据输出效果：
(如果显示有问题，可以参看p1.png)

高度=15, 笔宽=3
````
***           ***
 ***         ***
  ***       ***
   ***     ***
    ***   ***
     *** ***
      *****
       ***
      *****
     *** ***
    ***   ***
   ***     ***
  ***       ***
 ***         ***
***           ***
高度=8, 笔宽=5
*****  *****
 **********
  ********
   ******
   ******
  ********
 **********
*****  *****

请仔细分析程序流程，填写缺失的代码。


public class A
{
	static void f(int h, int w){
		System.out.println(String.format("高度=%d, 笔宽=%d",h,w));
		int a1 = 0;
		int a2 = h - 1;
		
		for(int k=0; k<h; k++){
			int p = Math.min(a1,a2);
			int q = Math.max(a1+w,a2+w);
			
			for(int i=0; i<p; i++) System.out.print(" ");
			
			if(q-p<w*2){
				for(int i=0; i<q-p; i++) System.out.print("*");; //填空
			}
			else{
				for(int i=0; i<w; i++) System.out.print("*");
				for(int i=0; i<q-p-w*2; i++) System.out.print(" ");
				for(int i=0; i<w; i++) System.out.print("*");
			}
			System.out.println();
			a1++;
			a2--;
		}
	}
	
	public static void main(String[] args){
		f(15,3);
		f(8,5);
	}
}

注意：只填写缺失的代码，不要拷贝已经存在的代码。
````

##### 8：等腰三角形

本题目要求你在控制台输出一个由数字组成的等腰三角形。
具体的步骤是：
1. 先用1,2,3，...的自然数拼一个足够长的串
2. 用这个串填充三角形的三条边。从上方顶点开始，逆时针填充。
比如，当三角形高度是8时：
````
       1
      2 1
     3   8
    4     1
   5       7
  6         1
 7           6
891011121314151
````

输入，一个正整数n(3<n<300),表示三角形的高度
输出，用数字填充的等腰三角形。

为了便于测评，我们要求空格一律用"."代替。

例如：
输入：
5

程序应该输出：
````
....1
...2.1
..3...2
.4.....1
567891011
````
再例如：
输入：
10

程序应该输出：
````
.........1
........2.2
.......3...2
......4.....2
.....5.......1
....6.........2
...7...........0
..8.............2
.9...............9
1011121314151617181
````


资源约定：
峰值内存消耗（含虚拟机） < 256M
CPU消耗  < 1000ms


请严格按要求输出，不要画蛇添足地打印类似：“请您输入...” 的多余内容。

所有代码放在同一个源文件中，调试通过后，拷贝提交该源码。
不要使用package语句。不要使用jdk1.7及以上版本的特性。
主类的名字必须是：Main，否则按无效代码处理。
##### 标8：小朋友崇拜圈

班里N个小朋友，每个人都有自己最崇拜的一个小朋友（也可以是自己）。
在一个游戏中，需要小朋友坐一个圈，
每个小朋友都有自己最崇拜的小朋友在他的右手边。
求满足条件的圈最大多少人？

小朋友编号为1,2,3,...N
输入第一行，一个整数N（3<N<100000）
接下来一行N个整数，由空格分开。

要求输出一个整数，表示满足条件的最大圈的人数。

例如：
输入：
9
3 4 2 5 3 8 4 6 9

则程序应该输出：
4

解释：
![p1.png](https://www.dropbox.com/s/3u7m7a9cc9dckr2/p1.png?dl=0&raw=1)
如图所示，崇拜关系用箭头表示，红色表示不在圈中。
显然，最大圈是[2 4 5 3] 构成的圈


再例如：
输入：
30
22 28 16 6 27 21 30 1 29 10 9 14 24 11 7 2 8 5 26 4 12 3 25 18 20 19 23 17 13 15

程序应该输出：
16

资源约定：
峰值内存消耗（含虚拟机） < 256M
CPU消耗  < 1000ms


请严格按要求输出，不要画蛇添足地打印类似：“请您输入...” 的多余内容。

所有代码放在同一个源文件中，调试通过后，拷贝提交该源码。
不要使用package语句。不要使用jdk1.7及以上版本的特性。
主类的名字必须是：Main，否则按无效代码处理。
````java
public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner str = new Scanner(System.in);
		int n = str.nextInt();
		int a[] = new int[n+1];
		for (int i = 1; i <= n; i++) {
			a[i]=str.nextInt();
		}
		int Max=0;
		int j;
		ArrayList<Integer> list = new ArrayList<Integer>();
		for (int i = 1; i <= n; i++) {
			j=i;
			while(list.indexOf(a[j])==-1){
				
				list.add(a[j]);
				j=a[j];
			}
			Max=Math.max(list.size(), Max);
			list.clear();
		}
		System.out.println(Max);
	}
````
##### 5:耐摔指数

x星球的居民脾气不太好，但好在他们生气的时候唯一的异常举动是：摔手机。
各大厂商也就纷纷推出各种耐摔型手机。x星球的质监局规定了手机必须经过耐摔测试，并且评定出一个耐摔指数来，之后才允许上市流通。

x星球有很多高耸入云的高塔，刚好可以用来做耐摔测试。塔的每一层高度都是一样的，与地球上稍有不同的是，他们的第一层不是地面，而是相当于我们的2楼。

如果手机从第7层扔下去没摔坏，但第8层摔坏了，则手机耐摔指数=7。
特别地，如果手机从第1层扔下去就坏了，则耐摔指数=0。
如果到了塔的最高层第n层扔没摔坏，则耐摔指数=n

为了减少测试次数，从每个厂家抽样3部手机参加测试。

如果已知了测试塔的高度，并且采用最佳策略，在最坏的运气下最多需要测试多少次才能确定手机的耐摔指数呢？

输入数据，一个整数n（3<n<10000）,表示测试塔的高度。
输出一个整数，表示最多测试多少次。

例如：
输入：
3

程序应该输出：
2

解释：
手机a从2楼扔下去，坏了，就把b手机从1楼扔；否则a手机继续3层扔下

再例如：
输入：
7

程序应该输出：
3

解释：
a手机从4层扔，坏了，则下面有3层，b,c 两部手机2次足可以测出指数；
若是没坏，手机充足，上面5,6,7 三层2次也容易测出。

资源约定：
峰值内存消耗（含虚拟机） < 256M
CPU消耗  < 1000ms


请严格按要求输出，不要画蛇添足地打印类似：“请您输入...” 的多余内容。

所有代码放在同一个源文件中，调试通过后，拷贝提交该源码。
不要使用package语句。不要使用jdk1.7及以上版本的特性。
主类的名字必须是：Main，否则按无效代码处理。



---------------------------------
笨笨有话说：
我觉得3个手机太难了，要是2个手机还可以考虑一下。

歪歪有话说：
想什么呢，你！要是1部手机还用你编程啊？那样的话只好从下往上一层一层测。



````
	public static void main(String[] args) {
		Scanner str =new  Scanner(System.in);
		System.out.println(num(str.nextInt()));
	}

	private static int num(int nextInt) {
		// TODO 自动生成的方法存根
		if(nextInt<=3) return 2;
		return num(nextInt/2)+1;
	}
````