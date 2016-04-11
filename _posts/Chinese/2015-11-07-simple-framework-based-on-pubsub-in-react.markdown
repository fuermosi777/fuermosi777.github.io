---
title: React基于Pub/Sub的简单架构
layout: post
category: Chinese
tags:
- React
- Pubsub
---

> 在上篇文章中，我在比较了Flux和Redux两个架构中提出一种基于Pub/Sub观察者模式的架构，但在实际使用中发现效果十分不理想。虽然有了PubSub，但是由于动作发出者和接受者经常是同一个对象，导致当程序体积扩大后，代码十分混乱，并且会伴有未知的bug。
> 在事态进一步扩大之前，我及时收手，必须对此架构进行改进。整个架构虽说参考了Redux中的一些思想，但主要还是停留在Flux的思维层面，实际上并没有牵扯到Redux的一个精髓——即全场只有一个state。

经过两天的调整，一个承上启下的全新架构出炉了。这个架构的最大优点在于结构简单，除了PubSubJS之外没有任何依赖。下面是以一个简单的markdown编辑器为例的架构介绍：

## 目录

项目文件结构如下。

```
Project
|-- components
    |-- Editor
    |-- Preview
|-- actions
    |-- ContentActions.js
|-- stores
    |-- ContentStores.js
|-- entry.js
|-- Root.js
```

可见目录还是比较清晰和简单的。entry.js为项目入口文件，代码一看便知：

```
// entry.js
import React from 'react';  
import Root from './Root.jsx';
React.render(
    <Root/>, document.getElementById('container')
);
```

Redux架构中引入了较多的概念和模块，拿store来说，Redux需要`createStore()`，还有storeConfiguration，而在这个架构中，Root.js中起到了store的作用，它的state便是整个应用的所有状态和数据。

```
// Root.js
export default React.createClass({
    getInitialState() {
        return {
            markdown: '',
            preview: ''
        };
    },
    render() {
        return (
            <Editor state={this.state}/>
            <Preview state={this.state}/>
        );
    };
});
```

Root.js的state为整个应用的初始state，在此初始化两个变量，一个用来存储markdown的原始文字，而preview用来存储生成后的HTML。他们的初始值都是空字符。

在render部分中，直接粗暴直接地把Root.js的state传递给子模块们。这些子模块类似于Redux中的“智能模块”，共享应用内的全局state。

另外，Root中还有一个非常重要的方程，如下：

```
// Root.js
componentDidMount() {
    PubSub.subscribe('STATE_UPDATE', this.handleSubscribe);
},
handleSubscribe(type: String, state) {
    this.setState(state);
}
```

意思是在模块渲染后订阅一切关于state的更新，并在`handleSubscribe()`这个函数中更新state。这两个动作为本架构的核心。

接下来写动作的发出。在Editor中，部分代码如下：

```
// Editor.jsx
import ContentActions from '../actions/ContentActions.js';

...
render() {
    return (
        <div className="Editor">
            <textarea onChange={this.handleTextareaChange} value={this.props.state.markdown}/>
        </div>
    );
},
handleTextareaChange(e) {
    ContentActions.changeMarkdown(this.props.state, e.target.value);
}
...
```

在Editor这个模块中，放置一个`<textarea/>`来当做文字编辑器。任何变化都会通过handleTextareaChange()来处理；在处理函数中，传递当前的state和markdown的值给动作函数。另外，在`<textarea/>`中，它的值也是由props中传递过来的。

在ContentActions中处理所有的动作，如下：

```
// ContentActions.js
import ContentStores from '../stores/ContentStores.js';
import marked from 'marked';

export default {
    changeMarkdown(state: Object, markdown: String) {
        let newState = {...state, markdown: markdown, preview: marked(markdown)};
        return ContentStores.updateState(newState);
    }
};
```

动作处理的解释参见[这篇精彩的文章](http://www.jianshu.com/p/3334467e4b32):

> Redux 没有规定用什么方式来保存 State，可能是 Javascript 对象，或者是 Immutable.js 的数据结构。但是有一点，你最好确保 State 中每个节点都是 Immutable 的，这样将确保 State 的消费者在判断数据是否变化时，只要简单地进行引用比较即可，例如：
> `newState.todos === prevState.todos`
> 从而避免 Deep Equal 的遍历过程。

而在ContentStores中，我们完成对更新状态发出信号。

```
// ContentStores.js
import PubSub from 'pubsub-js';
updateState(state) {
    PubSub.publish('STATE_UPDATE', state);
}
```

这样，当`<textarea/>`中发出更新时，数据通过如下流动：

```
Editor -> ContentActions -> ContentStores -> Root -> Editor/Preview
```

饶了好大一个圈，最终目的是为了完成数据的单向流动，而不是在动作变多之后把一切搞得乱七八糟。

在Preview中，可以随时使用state传来的任何数据及更新：

```
// Preview.js
...
render() {
    return (
        <div className="Preview">
            <div dangerouslySetInnerHTML={{__html: this.props.state.preview}}/>
        </div>
    );
}
```

这个架构也适合处理各种异步请求，只要把所有的异步都放在action中，使用promise来控制流程。