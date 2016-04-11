---
title: Understand UIWebView
layout: post
category: blog
lang: en
tags:
- UIWebView
- Objective-C
---

When I was developing StudentDaily app, I was struggled for a long time in implementing view difference effect in Zhuhu Daily app. As in the following figure, the view is made up of a banner(`UIView`) and a browser(`UIWebView`). When you are scrolling down the `UIWebView` to read, the banner will be pushed up with a lower speed compared to the `UIWebView`.

<img src="/media/blog/1.jpeg" style="width:200px" />

I knew that this view must be made up of two parts because the image in the banner was quickly loaded while the seconde part was loaded after a while. Another clue is that the scrolling indicator on the right side clearly shows that the second part is the scroll view. However, if we put `UIView` with the banner image and the `UIWebView` as the subviews of the view, it is impossible to display that the `UIWebView` is on the top of the `UIView` because when the user is scrolling the `UIWebView`, the top `UIView` will cover the `UIWebView` all the time. Even if you send a `self.view insertSubView:atIndex:` message to determine the index, there is no way to cover the `UIView` with `UIWebView`.

It is time to study the `UIWebView`. It occurred to me that what if only a `UIWebView` is used? There is a `UIScrollView` on the `UIWebView`. Thus if I can add a subview in the `UIWebView` below the `UIScrollView`, then problem should be solved.

Now let's do this:

First of all, there is only one `UIWebView` in the page. We can setup the `contentInset` to leave a space for the banner:

	[_webView.scrollView setContentInset:UIEdgeInsetsMake(300, 0, 0, 0)];

After that we can create a `UIImageView` on top of the `UIWebView`:

	[_webView insertSubview:_banner atIndex:2];
	
Since we don't want the scrolling indicator shows incorrectly, we move it to the position where there is a space to the top using `scrollIndicatorInset` and reset its position in `scrollViewDidScroll`. `UIImageView` (the banner) can be reset position as well (`setFrame`) when scrolling delegate send messages.

```
- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
	float originY = scrollView.contentOffset.y + self.view.frame.size.width * 3/4;
	float percentage = scrollView.contentOffset.y/100;
	[(NavViewController *)self.navigationController setBgColor:percentage];
	// scroll banner
	[_banner setFrame:CGRectMake(0, 0 - originY, self.view.frame.size.width, self.view.frame.size.width * 3/4)];
}
```

Everything should be working now.