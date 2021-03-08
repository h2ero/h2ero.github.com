---
layout: post
title: 阿里云 RocketMQ Java SDK BUG 导致 OOM
tags: 
date: 2021-03-08 18:08:05
categories:
---

## 前言
在现在的公司做了一个类似神策运营的计划的服务，可以针对事件配置不过规则触发不同webhook, 支持常用的运算，逻辑运算，正则匹配。减少非常多的业务代码。

## 事故发生
某日业务反馈某一事件有50%左右没有被触发。于是开始介入排查。

### 消息轨迹

从上游服务拿到问题的用户发送RocketMQ的Message ID，然后查询消息轨迹发现消息未被所有的下游服务消费, 消费成功需要返回CommitMessage或者ReconsumeLater才会被认为成功。难道消息丢了？不过排查其他下游访问发现有被消费的日志,和阿里云工程师确认网络环境不好的情况消息轨迹不是可靠的。

### 消费服务排查
前一天晚上服务有发生重启, 查看了当时的k8s event log，发现当时OOM了，于是找运维导出现场日志文件。

1. OOM时候的JVM 的 heap profile 文件。
2. Java GC LOG

导出的heap文件导入jvisualvm中，查看， 基本信息栏便会有关键信息。
```
 字节总数: 1,071,951,371
    类总数: 12,250
    实例总数: 1,814,536
    类加载器: 59
    垃圾回收根节点: 3,264
    等待结束的暂挂对象数: 0

    在出现 OutOfMemoryError 异常错误时进行了堆转储
    导致 OutOfMemoryError 异常错误的线程: NettyClientPublicExecutor_2
```

```
"NettyClientPublicExecutor_2" prio=5 tid=84 RUNNABLE
    at java.lang.OutOfMemoryError.<init>(OutOfMemoryError.java:48)
    at java.util.Arrays.copyOf(Arrays.java:3236)
       Local Variable: byte[]#3043
    at java.io.ByteArrayOutputStream.grow(ByteArrayOutputStream.java:118)
    at java.io.ByteArrayOutputStream.ensureCapacity(ByteArrayOutputStream.java:93)
    at java.io.ByteArrayOutputStream.write(ByteArrayOutputStream.java:153)
    at com.aliyun.openservices.shade.com.alibaba.rocketmq.common.UtilAll.uncompress(UtilAll.java:267)
       Local Variable: byte[]#3042
       Local Variable: java.io.ByteArrayInputStream#1
       Local Variable: java.util.zip.InflaterInputStream#1
    at com.aliyun.openservices.shade.com.alibaba.rocketmq.common.message.MessageDecoder.decode(MessageDecoder.java:348)
       Local Variable: com.aliyun.openservices.shade.com.alibaba.rocketmq.common.message.MessageClientExt#3014
    at com.aliyun.openservices.shade.com.alibaba.rocketmq.common.message.MessageDecoder.decode(MessageDecoder.java:258)
    at com.aliyun.openservices.shade.com.alibaba.rocketmq.common.message.MessageDecoder.decodesBatch(MessageDecoder.java:398)
       Local Variable: java.nio.HeapByteBuffer#1
       Local Variable: java.util.ArrayList#2742
```

SDK代码触发的OOM, 同时按内存占用大小排序堆类数据，前面的都为Java语言自带的类型，在业务代码中并没有过多的使用，第一个最大的类为阿里云SDK的。
```
byte[]	1.6691870538804412	30,288 (1.7%)	988,850,651 (92.2%)
char[]	25.22468553944369	457,711 (25.2%)	26,832,864 (2.5%)
java.lang.String	25.208207497674334	457,412 (25.2%)	12,807,536 (1.2%)
java.util.HashMap$Node	11.836855262171706	214,784 (11.8%)	9,450,496 (0.9%)
java.util.HashMap$Node[]	1.3297063271271554	24,128 (1.3%)	3,767,424 (0.4%)
com.aliyun.openservices.shade.com.alibaba.rocketmq.common.message.MessageClientExt	1.110752280472804	20,155 (1.1%)	2,741,080 (0.3%)
```

于是找阿里云企业客服介入, 排查过程反反复复了好几次，答复是没有解释为什么MessageClientExt占用为什么这么大的问题。不过沟通的过程中了解了RocketMQ一些基本的概念。业务代码中取消息是拉模式,

```
客户端本地缓存的的消息数 = Min (MaxCachedMessageAmount , MaxCachedMessageSizeInMiB, pullThresholdForQueue\*队列数) 
```

官方文档解释为

```
maxCachedMessageAmount	客户端本地的最大缓存消息数据，默认值：1000，单位：条。
maxCachedMessageSizeInMiB	客户端本地的最大缓存消息大小，取值范围：16 MB~2 GB，默认值：512 MB。
```

## 排查SDK代码
阿里云企业客服解决不了于是拉了SDK的维护研发进群参与讨论，不过也没有解决问题。最后打开SDK，设置断点一步步调试SDK代码，最终发现MaxCachedMessageAmount , MaxCachedMessageSizeInMiB默认值并没有生效。问题代码如下。

```

public class ONSConsumerAbstract extends ONSClientAbstract {

    /** 默认值限制为5000条 */
    /**
     * Consumer允许在客户端中缓存的最大消息容量，默认值为512 MiB，设置过大可能会引起客户端OOM，取值范围为[16, 2048]
     * <p>
     * 考虑到批量拉取，实际最大缓存量会少量超过限定值
     * <p>
     * 该限制在客户端级别生效，限定额会平均分配到订阅的Topic上，比如限制为1000MiB，订阅2个Topic，每个Topic将限制缓存500MiB
     */

    private int maxCachedMessageAmount = 5000;


    public ONSConsumerAbstract(final Properties properties) {
        String configuredCachedMessageSizeInMiB = properties.getProperty(PropertyKeyConst.MaxCachedMessageSizeInMiB);

        String configuredCachedMessageAmount = properties.getProperty(PropertyKeyConst.MaxCachedMessageAmount);
        if (!UtilAll.isBlank(configuredCachedMessageAmount)) {
            maxCachedMessageAmount = Math.min(MAX_CACHED_MESSAGE_AMOUNT, Integer.valueOf(configuredCachedMessageAmount));
            maxCachedMessageAmount = Math.max(MIN_CACHED_MESSAGE_AMOUNT, maxCachedMessageAmount);
            // 这个设置的后面并没有设置， 移到下一行即可。
            this.defaultMQPushConsumer.setPullThresholdForTopic(maxCachedMessageAmount);
        }

    }

```

## 解决问题

和官方SDK研发确认，确实有BUG, 最后走到了pullThresholdForQueue\*队列数这个默认值，不过队列数线上设置的很大，所以最后导致堆积消息量太大，于是业务代码里面手动设置了下该值，上线内存占用500M左右，高峰期没有再出现问题。

## 为什么20000条就OOM
因为上游系统消息体实在太大了！！！所有东西都给塞了进去，而不是传一个ID。单个消息体达到了32K，线上JVM参数 -Xms1024m,-Xmx1024m, k8s配置也不是太合理，

```
   "resources": {
          "limits": {
            "cpu": "1",
            "memory": "1024Mi"
          },
          "requests": {
            "cpu": "100m",
            "memory": "200Mi"
          }

```

比较合理的是将request设置大一点。

## Rocket MQ 好用的一些特性
1. 延时消息
2. 事务
3. 消息轨迹
4. 顺序消息，（相同队列顺序和全局顺序）
5. 重置消费位点

## 使用注意点
1. 队列分配问题，队列比消费客户端少，会有客户端不消费消息，或者客户端分配队列数不一样的情况。
2. 消息可能会消费多次，需要做幂等。
3. 同一个客户端使用同一个group id消费一个topic会漏消息。

---
* 阿里云消息队列RocketMQ帮助文档: https://help.aliyun.com/product/29530.html
