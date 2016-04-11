---
title: React Native中基于Pub/Sub的数据架构
layout: post
category: Chinese
tags:
- React native
- Pubsub
---

在完成我的第一个项目[子阅阅读器](http://ziyue.io)时，由于当时想象大部分的数据交换都利用ajax和服务器通信，也没有用户系统这些复杂的东西，因此没有使用看起来非常复杂的Flux架构。

在另外一个项目[寻味](http://xun-wei.com)中，虽然牵扯到大量的本地存储，但我还是没有使用Flux架构。主要原因在于不同component的层级不多，比较扁平，因此一个中央的HomePage就足够处理各种事件。但此时数据的交换是非常混乱的，比如说，在HomePage下管辖着两个平行的组件，一个是List，另一个是Map。希望达到的目的是，点击List上的一个项目，会在旁边的Map里有所反应，同时点击Map里的某个点，List组件也会相应更新。这样数据既从子组件传回父组件，又要从父组件传给子组件，完全是Flux架构的相反含义。当组件多了之后，项目（尤其是HomePage这个中央处理器）会变得混乱不堪。

但是，为了维持这个混乱的架构，我不得不做另外一件事来使其较容易管理：使用唯一一个state来管理程序的各种状态。这个state虽然唯一，但由于包含了程序的各种状态（和数据），因此体积非常之大。为了避免这种状况，只好在逻辑上削减页面的需求，通过增加更多的页面来管理，但随着页面增多，势必需要一个更高级别的管理器来控制一些程序内共享的状态，这样React的component会变多，数据的方向也会愈加混乱。这个经历让我意识到数据的单向流动的重要性。

在开启新的项目之前，我痛下决心彻底学习一下Flux或者相关架构思想，以免重蹈覆辙。但是Flux架构思想简单，实现繁琐复杂。有人推荐Flux思想的另外一个良好实现[Redux](https://github.com/rackt/redux)。据说这个Redux是连React创始人都交口称赞奔走相告的架构。我仔细阅读了Redux的文档，发现它的实现似乎更加繁琐，并且引入了一大堆奇奇怪怪的概念：比如“SmartComponent”，“DumbComponent”，比如“`mapStateToProps()`”。

尽管如此，除了数据的单向流动之外，我发现了它的两个重要思想：第一是使用唯一的state来管理应用，第二是通过`Array.prototype.reduce()`这个函数来操纵状态。第一点与我混乱架构的思想不谋而合。而第二点，则解决了困扰我的许多问题。

我在开发一个React（Native）架构的应用时，希望使用一个或几个分散的处理器和存储器来管理程序运行中的各种事件和数据，从而完成一个简略的Flux数据流，如下：

```
View - Action - Store - View
```

其中最关键的一步其实是最后一步，即如何让存储器告知View，数据已经发生变化，请更新。想到当时开发Obj-C的时候，里面有三种事件中心，其中有一个广播中心，似乎可以拿来一用。[PubSubJS](https://github.com/mroderick/PubSubJS)是一个非常优雅的事件系统的实现。最后，在它的帮助下，我成功实现了属于自己的Flux架构：

核心原理是View里触发Action，Action内部获取数据，调用Store存储器来进行状态管理，然后Store发布事件，View监听事件，变化后更新内部。这里有一点跟Redux完全不同的是，Redux利用纯函数式编程来处理state，而我的架构则把state存储于React Native提供的AsyncStorage中，需要的时候再拿出来更新。

下面为一个简单的示例。

```
// AppView.js
...
render() {
  return (
    <View>
      // two components
      <ListView/>
      <MapView/>
    </View>
  )
}

// ContentActions.js
module.exports = {
  clickItem() {
    return fetch(url)
      .then(res => res.json())
      .then((data) => {
        return ContentStores.setItem(data);
      });
  }
}

// ContentStores.js
module.exports = {
  setItem(data: Array) {
    return AsyncStorage.setItem('item', JSON.stringify(item))
      .then((res) => {
          PubSub.publish('ITEM_CLICKED')
      });
  }
}

// ListView.js
...
handleItemPress() {
  ContentActions.clickItem();
}
...

// MapView.js
...
ComponentDidMount() {
  PubSub.subscribe('ITEM_CLICKED', this.handleItemClicked);
},
ComponentWillUnmount() {
  PubSub.unsubscribe('ITEM_CLICKED', this.handleItemClicked);
}
...
...
```