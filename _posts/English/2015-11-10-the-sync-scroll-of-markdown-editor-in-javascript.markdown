---
title: The Sync Scroll of Markdown Editor in Javascript
layout: post
category: English
tags:
- markdown
---

Markdown apps like StackEdit and MacDown have a feature called sync-scroll. It means that when the user is scrolling the editor, the previewer will also be scrolled based on the position of the editor.

It is a really useful function because I can always see how it looks like in the real web page, so I want this function in my own Markdown editor [WordMark](http://wordmarkapp.com).

My first try is based on percentage. I thought that since 0% of the editor is the top of the editor, and 100% of thte editor is the bottom the editor, so 0% and 100% of the previewer should also be the top and the bottom of the previewer.

```
handleScroll(e) {
    return e.target.offset.top / e.target.innerHeight;
}

shouldScroll(percentage) {
    var target = React.findDOMNode(this.refs.previewer);
    target.scrollTop = target.innerHeight * percentage;
}
```

However, it doesn't work. The main reason is that some elements (such as images) have different heights in editor and in previewer.

In editor, the image is just one line:

```
![image title](<image URL>)
```

In previewer, it will show the real image.

My second try is to to get the percentage of the position of the target line among all lines. One notable thing is that the line counts are also different in the editor and in the previewer for some reasons:

In Markdown, paragraphs have an extra empty gap line
In Markdown, bottom links should not be displayed
In previewer, `pre > code` is one big element with a lot of line breaks while in Markdown, they are independent lines.
Therefore I alwasy get the unequal line counts of the editor and the previewer.

My third try is to use the percentage position of each effective line in Markdown, and then reuse the percentage position back to the previewer. Instead of calculating the line counts separately, I use the same Markdown engine to get the line position.

```
handleScroll(e) {
    let scrollInfo = codeMirror.getScrollInfo();

    // get line number of the top line in the page
    let lineNumber = codeMirror.lineAtHeight(scrollInfo.top, 'local');
    // get the text content from the start to the target line
    let range = codeMirror.getRange({line: 0, ch: null}, {line: lineNumber, ch: null});
    var parser = new DOMParser();
    var doc = parser.parseFromString(marked(range), 'text/html');
    let totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote');
    return totalLines.length;
}
```

In previewer, we get the target line position and then get the scrollTop based on its index in all effective lines:

```
shouldPreviewScroll(length) {
    let body = React.findDOMNode(this.refs.body);
    let elems = body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote');
    if (elems.length > 0) {
        $(body).stop();
        $(body).animate({ scrollTop: elems[this.props.state.currentLine].offsetTop, queue: false });
    }
}
```