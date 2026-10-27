---
layout: default
title: Privacy Policy
permalink: /privacy/
---

# Privacy Policy

**App:** Santa Claus Video Call & Text (SantaCall) for iPhone and iPad, version 2.0 and later  
**Effective date:** 27 October 2026

## The short version

- SantaCall has no accounts. We never ask for your email, your name or your phone number.
- The video call from Santa works fully on your device. The camera preview is not recorded and not sent anywhere.
- Letters and chat with Santa are different: when a grown-up agrees, the text your child writes goes to our server, and an AI service (OpenAI) writes Santa's reply. Our server does not store your child's text.
- We keep a copy of Santa's reply for up to 24 hours, and daily counters for the free and Premium limits for 3 days.
- We don't show ads, we don't sell data, and we don't track you across other apps or websites.
- You can turn off AI replies and analytics in the app's settings at any time.

The rest of this policy explains the details.

## 1. Who we are

SantaCall is provided by Davyd Shapovalov, the seller of the app on the App Store ("we", "us"). We are the data controller for the personal data described in this policy.

Contact for privacy questions and anything else: tkachenko.daiv@gmail.com

## 2. What data we use

### 2.1 Data that stays on your device

The app keeps the following on your iPhone or iPad. It does not send it to us:

- the child you set up a call for: the name you picked from the list and the Girl / Boy / Any choice;
- the scheduled call, its time and the reminder setting;
- letter drafts, Santa's replies to letters (your "mailbox") and today's chat;
- your choices: AI replies on or off, analytics on or off, and the end time of a lock on the grown-up check;
- a sign-in token for our server (see 2.2).

Notifications about the call, the reminder and Santa's letters are created on your device. Their text, which can include your child's name, does not pass through our server.

You delete all of this by deleting the app. Today's chat is cleared at local midnight.

### 2.2 Letters and chat with Santa (only after a grown-up agrees)

To write Santa's replies, the app sends to our server:

- the letter: your child's first name, the age if chosen, the "This year I..." choices, the wishes and the signature;
- chat messages and your child's first name;
- the language and time zone of your device, so Santa replies in the right language and the daily limits reset at your local midnight;
- if you have Premium, the signed record of the subscription that Apple gives the app (the product, its dates and Apple's transaction numbers), so the server can check it and apply the Premium limit. The server checks it and does not store it;
- an anonymous ID.

**The anonymous ID.** When the app first talks to our server, the server gives it a random ID (anonymous sign-in with our provider Supabase). It is not linked to your email, your name or your Apple ID. We use it to count letters and messages for the daily limits and to deliver Santa's replies.

**What our server does with the text:**

1. A filter replaces personal details, such as an email address, a link, a phone number, a postal address or a school name, with "[private]".
2. OpenAI runs an automatic safety check (moderation) on the text.
3. OpenAI writes Santa's reply. Our server checks the reply in the same way and sends it to the app.

Our server does not store your child's text. It keeps only:

- a copy of Santa's reply for up to 24 hours, so the app can still get it if the connection drops or the app was closed;
- daily counters of letters and messages, for 3 days;
- a count of requests per minute, for 10 minutes, to stop misuse.

Our server logs record, for each request: the anonymous ID, which feature was used, the result and timings, the language, free or Premium (and the product, for subscriptions from older versions of the app), the safety check categories, the kinds of personal details the filter found (not the details themselves) and the size of the AI request. They never contain the text your child writes.

**IP address.** As with any internet connection, our server and its hosting provider see your device's IP address when the app connects. We don't use it to identify you.

**Without consent** no text is sent. Santa's reply to a letter is then built on your device from a letter we wrote in advance, and the chat is not available.

### 2.3 Names you ask us to record

If your child's name is not in the list and you type it under "Can't find the name?", the app sends only that name and the language to our server. It sends no anonymous ID and no other identifier. We use the list of requested names only to decide which names Santa records next. We don't promise to record any name.

### 2.4 Purchases

Premium subscriptions are sold and charged by Apple through the App Store. We don't see your card details or your Apple ID. Apple tells the app which subscription is active and until when, so the app can unlock Premium. Apple's privacy policy covers the payment.

When a subscription starts, renews, expires or is refunded, Apple's server sends our server a signed notice. We keep from it: the kind of event, the product, Apple's transaction numbers, the price and currency, the dates, and whether it was a test purchase. The notice has no name, no Apple ID and no anonymous ID, and we don't link it to the anonymous ID. We use it to count subscriptions and revenue. Our server sends a summary of each event (the event, the product, the price and currency) to Amplitude under a one-way code made from Apple's transaction number, not under any ID of your device.

Apple may also give us statistics about downloads and sales. Apple only shares usage statistics from people who agreed in iOS settings to share data with app developers, and only in a form that doesn't identify them.

### 2.5 Usage analytics and crash reports

To see which parts of the app work and which don't, the app uses two services:

- **Amplitude** (usage analytics) receives events about how the app is used: when the app is installed, updated or opened and how long it is used, and events such as a screen was opened, a call was scheduled, a purchase finished or was cancelled (with the product, price and currency), a letter was sent or a daily limit was reached. Each event comes with technical details: app version, device model, iOS version, language, and a random ID for the app on this device. It is not the advertising identifier (IDFA) and not the vendor identifier of iOS. Amplitude stores our data in its US data center.
- **Firebase Crashlytics** (by Google) receives a report when the app crashes: what the app was doing at that moment, device model, iOS version, app version, the time of the crash, and a random installation ID.

Analytics events and crash reports do not include the text of letters or chat messages, your child's name or age, or the anonymous ID our server uses.

The app does not send Amplitude a location. Like any internet service, Amplitude sees the IP address of the connection, and it may use it to estimate an approximate location, such as the country.

Usage analytics and crash reports are on when you install the app. You can turn them off and on at any time in the app's settings (the gear on the home screen). When they are off, the app sends no events and no crash reports, and crash reports not yet sent are deleted.

### 2.6 When you write to us

If you email us, we receive your email address, your message and anything you attach. We use it only to answer you.

### 2.7 Permissions the app asks for

- **Camera.** During the call, the front camera shows your child in a small window, like in a real video call. The picture stays on the screen. It is not recorded, saved or sent anywhere. If you say no, the window shows a silhouette.
- **Notifications.** Used for the call, the reminder and "A letter from Santa has arrived!". They are local notifications created on your device. We don't send push notifications from a server.
- **Photos (add only).** Used only when you tap "Save as a picture" on Santa's letter. The app adds the picture to your library and does not read your photos.

The app does not use the microphone, your location or your contacts.

## 3. How we get this data

- **From you and your child**, when you set up a call, write a letter or chat, type a name to be recorded, or email us.
- **Automatically from the app**, for the anonymous ID, the language and time zone, the analytics events and the crash reports.
- **From Apple**, for subscription status, notices about subscription events and App Store statistics.

We don't buy data and we don't get data about you from data brokers or social networks.

## 4. Why we use it

| Purpose | Data |
|---|---|
| Show the video call and remind you about it | Data on your device only (2.1) |
| Write and deliver Santa's replies to letters and chat | Letter and chat text, first name, language, time zone, anonymous ID (2.2) |
| Apply the free and Premium daily limits | Anonymous ID, daily counters, the signed subscription record (2.2) |
| Keep children safe and prevent misuse | Moderation and the personal-details filter, per-minute request counts, technical logs, IP address (2.2) |
| Choose which names to record next | Requested names and language (2.3) |
| Sell and unlock Premium | Subscription status from Apple (2.4) |
| Count subscriptions and revenue | Subscription notices from Apple, purchase events (2.4, 2.5) |
| Understand how the app is used and fix crashes | Analytics events, crash reports (2.5) |
| Answer your questions | Your email (2.6) |
| Meet legal duties | Records we must keep by law |

We don't use any of this data for advertising, we don't sell it, and we don't build profiles of you or your child for marketing. We don't use letters or chat messages to train AI models.

## 5. Legal bases (for users in the EEA, the UK and Switzerland)

- **Consent** (GDPR Art. 6(1)(a)): sending letters and chat messages to our server and OpenAI for AI replies. A grown-up gives this consent in the app (see section 12). Consent is also our basis for analytics and crash reports where the law requires consent.
- **Contract** (Art. 6(1)(b)): providing the app and Premium, delivering replies and applying the daily limits.
- **Legitimate interests** (Art. 6(1)(f)): keeping the service safe and working (logs, moderation, limits against misuse), choosing new names to record, counting subscriptions and revenue, and analytics and crash reports where consent is not required. Our interest is a safe app that works well. You can object at any time; the analytics switch in settings stops analytics and crash reports immediately.
- **Legal obligation** (Art. 6(1)(c)): where we must keep or share data by law.

Where a child is under the age at which they can consent on their own (between 13 and 16 depending on the EU country, 13 in the UK), the consent comes from a grown-up with parental responsibility (GDPR Art. 8).

## 6. Sensitive information

We don't ask for sensitive information such as health, religion or family problems. A child may still write about such things in a letter or the chat. That text is used only to write Santa's reply and is not stored on our server. The filter removes some personal details, but no filter is perfect. Please help your child keep addresses, phone numbers, school names and other private details out of letters and chat.

## 7. How long we keep data

| Data | Where | How long |
|---|---|---|
| Letter and chat text | Our server | Not stored. Used in memory to get the reply, then discarded |
| Santa's reply | Our server | Up to 24 hours, then deleted |
| Daily counters for limits | Our server | 3 days |
| Requests per minute | Our server | 10 minutes |
| Anonymous ID | Our server (Supabase) | Kept until you ask us to delete it. It holds no name, email or device identifier. Deleting it also deletes its counters and reply copies |
| Requested names | Our server | Until the name is recorded, and no longer than 60 days. A request holds only the name, the language and the day |
| Subscription notices from Apple | Our server | As long as accounting and tax law requires |
| Technical logs (anonymous ID, no child text) | Supabase | About 1 day |
| Letter and chat text sent to OpenAI | OpenAI | We ask OpenAI not to store it for later use. Under OpenAI's API data policy it may still keep it for up to 30 days to detect abuse, then deletes it, unless the law requires longer |
| Analytics events | Amplitude (United States) | Up to 1 year of history on our Amplitude plan. Deleted earlier on request |
| Crash reports | Firebase Crashlytics | Up to 90 days |
| Support emails | Our mailbox | As long as we need to answer you and keep a record of the request |
| Data on your device | Your device | Until you delete it or the app; today's chat until local midnight |

## 8. Who receives data

We share data only with the companies below. Apple handles purchases under its own privacy policy. The other providers process data for us under their data processing terms and may not use it for their own purposes, except where their terms allow it for safety and abuse monitoring.

| Provider | What it does for us | What it receives | Where |
|---|---|---|---|
| **Apple** (App Store, StoreKit) | Sells and renews subscriptions, delivers the app, sends our server notices about subscription events | Your purchase, handled under Apple's own privacy policy. The app sends Apple no data about letters, chat or calls | Apple's locations |
| **Supabase** | Hosts our server and database; gives out the anonymous ID | Anonymous ID, requests from the app (letter and chat text passes through without being stored), the signed subscription record (checked, not stored), counters, reply copies, requested names, subscription notices, IP address, technical logs | EU (Frankfurt, Germany) |
| **OpenAI** | Checks texts for harmful content and writes Santa's replies | Letter or chat text after our filter, including your child's first name, and the language. No anonymous ID or other identifier | United States |
| **Amplitude** | Usage analytics (only if analytics is on) | Usage events, random app ID on the device, app version, device model, iOS version, language, IP address of the connection. From our server: subscription events with the product, price and currency under a one-way code | United States |
| **Google** (Firebase Crashlytics) | Crash reports (only if analytics is on) | Crash reports, device model, iOS version, app version, random installation ID | United States |

We may also share data if the law requires it, to protect the safety of a child or others, or if SantaCall moves to another company. In that last case the new owner must keep to this policy or tell you before anything changes.

We don't sell personal data and we don't share it for advertising.

## 9. Data outside your country

Our server and database are in the EU (Frankfurt). Supabase is based in the United States, so some access from outside the EU may happen for support and operations. Amplitude, OpenAI and Google process data in the United States. When personal data from the EEA, the UK or Switzerland goes to a country without an adequacy decision, we rely on the safeguards in the provider's data processing terms, such as the European Commission's Standard Contractual Clauses, or on the EU-U.S. Data Privacy Framework where the provider is certified. You can ask us for a copy of these safeguards.

## 10. Your rights

Depending on where you live, you have the right to:

- know what data we have about you and get a copy (access, portability);
- correct wrong data;
- have data deleted;
- restrict or object to some uses, including analytics;
- withdraw consent at any time, without affecting what we did before;
- complain to a data protection authority (see section 17).

**How to use these rights:**

- **AI replies:** turn off "Santa's personal replies" in the app's settings. Letters then get replies from templates, and the chat closes.
- **Analytics and crash reports:** turn them off in the app's settings.
- **Data on your device:** delete the app.
- **Anything else:** write to tkachenko.daiv@gmail.com. We answer within one month.

Because SantaCall has no accounts, we usually can't tell which data on our server belongs to you. Most of it disappears on its own (see section 7). If you write to us, we will help as far as we can find your data, and we may ask for details that help us find it. We won't ask for more information than we need.

**US residents.** We don't sell personal information, we don't share it for cross-context behavioral advertising, and we don't use it for targeted advertising. You can ask to know or delete personal information through tkachenko.daiv@gmail.com, and we won't treat you differently for using your rights.

## 11. AI and automated processing

- When a grown-up agrees, Santa's replies to letters and chat are written by an AI model from OpenAI. No person writes them.
- Santa's replies in the app are marked as written with AI, so it's clear you are not talking with a real person (EU AI Act, Article 50).
- The safety check can block a message or a reply. Santa then answers with a short, friendly message instead. If a child sounds sad or unsafe, Santa gently suggests talking to a trusted grown-up.
- We don't make decisions about you or your child by automated means that have legal effects or similarly significant effects (GDPR Art. 22). The AI writes a fun reply; it decides nothing about you.
- If a reply seems wrong or upsetting, send a screenshot to tkachenko.daiv@gmail.com. A person will look at it.

## 12. Children

SantaCall is a family app. A grown-up sets up calls and buys Premium. A child takes part in the call and can write letters and chat with Santa with a grown-up nearby.

**The video call** works fully on the device. Nothing the child says or does in the call is recorded or sent, and the microphone is not used.

**Letters and chat** send what the child writes to our server and to OpenAI. So before the first letter or chat message:

1. **A grown-up check.** The app shows a simple multiplication problem that a grown-up must solve. After three wrong answers the check locks for 30 seconds. The same check stands before links that leave the app.
2. **Consent.** The app explains what is sent, who writes the replies and what we never do. Nothing is sent until the grown-up taps "I agree".

**What the check is not.** The check helps make sure a grown-up is present. It cannot confirm who that person is or that they are the child's parent. It is not a "verifiable parental consent" method under the US Children's Online Privacy Protection Act (COPPA).

**How we limit children's data:**

- no accounts, no email, no parent names;
- our server does not store the child's text; Santa's reply is kept for up to 24 hours;
- a filter removes personal details such as addresses, phone numbers, email addresses, links and school names before the text goes to the AI;
- Santa never asks for an address, a school or photos;
- no ads, no selling of data, no profiles for marketing;
- analytics and crash reports carry no names and no text the child writes.

**Parents' choices.** A grown-up can turn AI replies off at any time in the app's settings ("Santa's personal replies"). Without consent, letters get replies from templates built on the device, and the chat is not available. A grown-up can delete everything on the device by deleting the app.

If you think your child sent us personal information without a grown-up's agreement, write to tkachenko.daiv@gmail.com and we will delete what we can find.

## 13. How we protect data

- Data between the app and our server travels over encrypted connections (HTTPS).
- The keys for the AI service are kept on our server, not in the app.
- The app can't read our database directly; only our server code can.
- We collect as little as we can: no accounts, no stored child text, short retention.
- Only the people who run SantaCall can access the server, and only to run and fix the service.

No system is completely secure. If a breach affects your data, we will tell you and the authorities where the law requires it.

## 14. Cookies and tracking

The app does not use cookies. It does not use the advertising identifier (IDFA), it does not track you across other companies' apps or websites, and it does not share data with data brokers.

## 15. Changes to this policy

When we change this policy, we update the effective date at the top. If a change is important, for example new data or a new provider, we will tell you in the app before it applies. If a change needs your consent, we will ask again.

## 16. Contact

Davyd Shapovalov  
Email: tkachenko.daiv@gmail.com  
Web: https://santacall.github.io

## 17. Complaints

If you are in the EEA, the UK or Switzerland, you can complain to the data protection authority where you live or work, or where you think the problem happened. We'd be glad if you wrote to us first, so we can try to fix it.
