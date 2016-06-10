---
title: An implementation of a directory tree in React
layout: post
category: English
tags:
- React
---

In [WordMark](http://wordmarkapp.com)'s latest version (v2.1.6), I added a directory tree in the side bar to allow users to manage their Markdown posts without inside the application. The article aims to document what I did, providing a recursive method for the implementation.

For starting, I created two new components: `FolderTree` and `FolderLeaf`. The latter one is the recursive component. The very initial question I asked myself is how I wanted to store the directory data. There are two possible methods: store the entire directory tree structure in the first place and read tree only when user opens on directory (lazy). I chose the lazy method because I want this tree to be scalable and maintainable. The program does not know what kind of directory the user is going to add to the side bar, hence the program will have trouble if the directory is very deep and have too many sub-directory or files. The `FolderLeaf` is as follows:

```javascript
import path from 'path';

var FolderLeaf = React.createClass({
	collapsed: false,
    nodes: [],
    render() {
    	var nodes = [];
        if (this.nodes) {
			nodes = this.nodes.map((item, key) => {
            	if (item.type === 'directory') {
                	return <FolderLeaf key={key} root={item} />
                } else {
                	return (
                    	<div key={key}>
                            {path.basename(item.filename)}
                        </div>
                    );
                }
            });
        },
        return (
        	<div className="FolderLeaf">
            	<div className="parent">
                {path.basename(this.props.root.filename)}
                </div>
                {this.collapsed && nodes ? 
                	<div className="children">{nodes}</div> 
                : null}
            </div>
        );
    }
});
```

Simple as it is, putting `FolderLeaf` in `FolderTree` is the last step.

```javascript
<FolderLeaf key={key} root={item} />
```

Another crucial feature is to allow side bar directory to update its opened sub-directory in real time when users change the structure in Finder or Explorer. This can be done by `setInterval`. I added a timer to check if the `FolderLeaf` nodes are changed:

```javascript
handleParentClick(e) {
	this.collapsed = !this.collapsed;
    if (this.collapsed) {
    	this.nodeUpdater = setInterval(() => {
        	this.updateNodes();
        });
    } else {
    	clearInterval(this.nodeUpdater);
        this.nodeUpdater = null;
    }
},

componentWillUnmount() {
	if (this.nodeUpdater) {
        clearInterval(this.nodeUpdater);
        this.nodeUpdater = null;
    }
}
```

`updateNodes()` just simply reads all children of a specific directory and updates the nodes.
