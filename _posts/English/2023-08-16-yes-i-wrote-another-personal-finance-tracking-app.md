---
title: Yes, I wrote another personal finance tracking app (Trellis)
layout: post
category: English
---

## Background Story

I have been using Ivan Pavlov's [Debit and Credit](https://debitandcredit.app/) on iOS and macOS since 2017. In the past 5 years, I have entered 12,500+ transactions out of my 30+ bank accounts. I use the app every time I make a purchase (online or onsite) or receive salary, and I perform manual bank statement reconciliations every two weeks. The app serves as a witness to my financial growth. It's a great app. One of the key reasons I chose it over other apps like Mint was actually due to a missing feature. Apps like Copilot or Mint require users to either enter credentials for their financial institutions or "connect" their banks via Plaid (which has a bad record of [violating](https://www.plaidsettlement.com/) user privacy). However, the Debit and Credit app does not. It forces users to enter each transaction manually, reminiscent of the old days. Honestly speaking, I don't believe many users would opt for this approach, but I did. It's not easy because it means that I can't afford to make any mistakes when recording a single transaction among my 20+ bank accounts (though I did make mistakes, and sometimes I just couldn't figure out where the discrepancy between the app and the bank statement originated from; that's when the "Other" category proves useful).

While I love the app, it does have some drawbacks that I eventually couldn't tolerate. As a result, I began developing my own finance tracking app.

1. The app exclusively operates within the Apple ecosystem. Despite being an Apple user for over a decade, I've recently found myself using numerous Android phones due to work requirements.
2. The bank reconciliation feature is cumbersome to use.
3. It lacks robust support for managing investment accounts. In the case of investment accounts, I've had to create two categories, namely "Capital gain" and "Capital loss," to effectively monitor the balance.
4. The analysis segment falls short in execution. The primary aim of any app in this category should be to enhance users' financial well-being through periodic analysis. While the Debit and Credit app excels at transaction tracking, it falls behind in the analysis aspect.
5. It wasn't developed by me. In other words, I lack the ability to add new features. I've shared numerous ideas with Ivan Pavlov, but I presume that, much like me, he might be short on time to implement those changes or might not share the same perspective.

## Design

Unlike the old times when I used to start with Sketch and create a number of mockups, I've now shifted to beginning with Xcode. As my experience as a programmer has grown over the years, my enthusiasm for UI design has waned. Instead, I find myself focusing more on UX, believing that it can be enhanced through iterations.

With that being said, I still require the new app to have an appealing appearance. After researching several similar apps, I've compiled a list of MVP features and conceptualized some mockups.

- Utilize tabs as a central navigation route (it's intuitive and user-friendly).
- The app's accent color should be orange (this could be customizable as a paid feature in the future; although I'm not entirely sure why, it seems to be a common trend these days).
- Display all transactions on the "homepage" and provide detailed analytical information.
- Support various types of accounts (including credit, debit, and investment accounts), categories (such as income and expenditure, gains and losses), and transactions (while the payee isn't crucial, notes are essential).
- Ensure data synchronization across devices (which is why I opted to begin with Swift and integrate CloudKit).

Naming is the most crucial aspect of design. I initially started with "Disciplin", missing the "e" from "Discipline," signifying that only the most disciplined individuals can effectively track their financial status. However, this word is a bit unusual and prone to typos, so I later changed it to "Trellis." This term likely implies that once you begin cultivating plants (managing finances) around a trellis, their growth will continue to build and endure over time.

## Implementation

Starting with SwiftUI on iOS, I made the decision to write a native Android app in the future if the need arises. I've been using [Things](https://culturedcode.com/things/) to manage tasks, and it has proven effective for a project scope as small as Trellis. Whenever a new idea or bug surfaces, I promptly jot it down in Things to clear my mind. Subsequently, when I have time, I categorize it as either "MVP," "Todo," or "Backlog," forming a simplified version of the Scrum methodology.

Remarkably, the first major feature I completed was the export/import function, initially intended for my own use. I required a way to export my transactions from Debit and Credit and import them into Trellis. I'm grateful that Debit and Credit includes a built-in option to export to CSV.

Given that this app is a part of my daily routine, my plan involves initiating development while continuing to use Debit and Credit simultaneously. After a certain period of concurrent usage to ensure everything functions as intended, the final transition will take place. This involves parting ways with Debit and Credit and fully embracing the capabilities of the new app.

Both my wife and I are acting as testers. We've been using both apps concurrently for over a month to ensure no vital features are overlooked. As of July 2023, the app is in good shape (with the exception of budgeting and recurring transactions, which I plan to add after the MVP launch).

With a 2-year-old at home, finding time for coding has proven extremely difficult. Daytimes are occupied by my regular job where I strive to contribute to the world by getting people to watch more ads on their TVs. Thus, my primary opportunity for coding is limited to weekends and the hours between 9pm and midnight, when my son is asleep. Each night, I manage to complete one or two tasks. Over time, the list of MVP requirements has grown progressively longer, until a moment arrived when I decided to exclusively add bugs to the list—a typical product management dilemma.

One major challenge I encountered was the cumbersome nature of CloudKit sharing among different iCloud users. One night, I experienced a complete data loss, forcing me to manually reconstruct 20 days' worth of transactions from Debit and Credit. To this day, I'm uncertain about the cause of this issue, but it highlighted the instability of CloudKit sharing. Consequently, I abandoned attempts in that direction and opted to explore other solutions like Realm sync or SQLite sharing at a later time. As a result, I removed sharing from the MVP list.

## Launch

By the end of mid-August, I successfully cleared all the empty checkboxes from the list. As a tester, my wife mentioned, "Even though I've grown accustomed to the way Debit and Credit works, I'm comfortable continuing to use Trellis in the future."

However, there are still some loose ends to tie up.

**Logo**

I created a logo using Adobe XD. Featuring an orange background (a linear gradient from a slightly darker to a lighter orange shade), I designed a calculator (the most indispensable tool for any accountant) inspired by the layout of macOS's official calculator. I altered the button and display colors to white, resulting in what I believe is a visually appealing design.

<img class="left layout-app-logo" src="/images/trellis/logo.webp">

**In-app Subscription**

I've decided to introduce this sooner rather than later. In the MVP, the only "pro" feature allows users to utilize a variety of custom bank logos, which I dedicated a night to create. I plan to incorporate additional features under the Pro category in the future. The revenue generated from subscriptions serves as one of the two driving factors that motivate me to continue enhancing this app (the other being my role as a core user).

**Privacy Policy & Terms of Service**

ChatGPT has been a lifesaver.

After undergoing a week-long review, [Apple approved Trellis 1.0](https://apps.apple.com/us/app/trellis-personal-finance/id6447228405).

## Future Plans

Currently, the list comprises over 70+ tasks. Although I haven't had the opportunity to create an exact plan (due to time constraints), I am committed to continually developing Trellis as a core user. In fact, this project is likely to be the most time-intensive app I've ever worked on. For upcoming updates, the next versions will include:

- Enhanced and more informative analytical charts, tables, and reports.
- Implementation of data sharing among different users.
- Integration of credit card rewards tracking.
- Introduction of recurring/scheduled transactions.
- ...

Stay tuned for more exciting developments on the horizon!
