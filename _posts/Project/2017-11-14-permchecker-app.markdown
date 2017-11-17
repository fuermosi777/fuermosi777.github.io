---
title: Permchecker for DOL
subtitle: A PERM filing status tracker app
layout: project
category: project
color: 9C62EA
bgcolor: DACBF2
image: permchecker/permchecker-app-icon.png
imagesize: small
description: Check the latest Permanent Labor Certification (PERM) stat, search for previous PERM filings and get daily notifications.
downloadlabel: App Store
downloadlink: https://itunes.apple.com/us/app/permchecker-for-dol/id1307750937?mt=8
tags:
- React Native
---

Introducing Permchecker for DOL, the only app you can find in the App Store to track Perm filing stats. [What is Perm?](https://www.uscis.gov/working-united-states/permanent-workers)

When you apply for a Perm, you would probably not receive a case number (A-* number), which is used to track the status of you Perm case. Most likely, however, you will know the filing date of your case. Therefore, to learn how many filings are certified per day and what the latest certified case date is essential to estimate the progress. All Perm filings are public data on [DOL's website](https://lcr-pjr.doleta.gov/index.cfm?event=ehLCJRExternal.dspQuickCertSearch), but the website itself is very difficult to use, and there is no notification feature.

Permchecker for DOL aims to solve this problem, by using a user-friendly card system to display the latest Perm filing date, a line chart indicating the approvals per day, and some other userful info.

![Permchecker for DOL](/images/permchecker/screen.png)

From a tech standpoint, Permchecker for DOL is created based on React Native. Multiple independent components were created to serve the fancy charts. A interactive line chart and bar chart are widely used in the app for displaying stat such as Top 10 Employer who filed most Perms across a selection of time ranges.

![Permchecker for DOL](/images/permchecker/code.png)

![Permchecker for DOL](/images/permchecker/demo1-b.gif)

![Permchecker for DOL](/images/permchecker/demo2-b.gif)

The source code is public on Github.

<a href="https://github.com/fuermosi777/permchecker-app" class="button" style="background-color: #9C62EA">Permchecker on Github</a>

And also published in the App Store.

<a href="https://itunes.apple.com/us/app/permchecker-for-dol/id1307750937?mt=8" class="button" style="background-color: #9C62EA">App Store</a>