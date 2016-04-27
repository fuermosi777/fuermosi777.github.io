I have done a number of researches in React's frameworks. An interesting thing to me is that I was never trying to read about or learn anything about frameworks when I was developing iOS apps. Programming in iOS is so nature. What makes Javascript codes so difficult to maintain after a massive increasing size of the code base is its asynchronous callbacks. React, as an innovative way of coding front-end interface, does not alleviate the difficulties, but focuses on the flow of the data. That's why there are so many frameworks such as Fluxx, Redux, Reflux, etc. The React was not meant for any large-scale application, not to mention desktop applications. Yet I like React very much. It's simple and elegant, and modularize everything.

The last React framework I am going to talk about, is not actually a framework, but a good use of two excellent tools: react-cursor and Async/Await.

The first tool, react-cursor, created by Dustin Getz, offers a awfully simple way to manage states in React. The application will have only one state, and the state can be accessed by all components freely. What makes it even better is that the cursor (the manager of the state), can be accessed asynchronously. For example, in the following code, the `cur` was touched twice while the second `cur` is the same as the first one.

```javascript
cur.refine('test').set(1);
setTimeout(() => {
	cur.refine('test').set(2);
}, 1000);
```

As a result, it has never been so smoothly to manipulate the state from every parts of the application. Fetching data from API, a certain module need not to worry about the inconsistency of accessing the state from other modules. The concept of "single direction data flow" becomes blurred, while the concentration of "single state management" is enforced.

The second brilliant tool is Async/Await functions that is being discussed in ES7. The use of Promise make my life easier, and yet does not solve the complexity brought by callbacks. One drawback of the use of Promise is that it might cause buried error if the chain is too long. In addition, the standard Promise fails to provide a `done()` method, which should be executed anyway whatever the result is. By wrapping `await` functions into try and catch, the capture of errors are convenient.

I used mainly these two tools to develop my first desktop application [WordMark](http://wordmarkapp.com). Although the application grows larger, the code base is still clean, maintainable and organized.