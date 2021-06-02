---
title: REST APIs vs. Backend for Frontend
subtitle: APIs and BFFs both serve JSON. What's the difference?
tags:
    - json
    - jwt
    - api
    - bff
    - architecture
excerpt: We often tend to think that anything that serves JSON via HTTP is an API. Not necessarily. Here's why.
image: simplicity_small.jpg
hero_image: simplicity.jpg
---

# API Everything?

As of 2021, JSON is dominating as the format used for exchanging structured
data. XML is still a thing of course, but JSON is the primary go-to
solution, thus I'll only focus on it.

**What is JSON over HTTP?** API, you might say.

API is an acronym for _Application Programming Interface_, that is a
very broad term. My very first encounter with APIs was the WinApi which
was basically a C library exposed via DLLs and it was made available for
other languages as well. No HTTP, no JSON of course, we're in 1998.

Let's jump to **REST API**s. REST is basically a style how functionality of
systems is being made available for other systems over HTTP. The most
important paradigms are HTTP, JSON and resource oriented CRUD via HTTP
verbs.

Another popular "style" is **GraphQL** which shares HTTP and JSON with REST
but has a different control language.

Despite the common characteristics, **there are quite several differences
between various "JSON over HTTP" backends**. This article will discuss the most
important ones.

## Consumer Difference

It's important to distinct the actors of the transactions. Interactions
can be made between two machines or between a human and a machine.

### Machine to Machine

Both REST and GraphQL are very popular for integrating systems, written
at a different time by different people, likely in a different
programming language.

These APIs provide a straightforward contract between these systems and
tell what and how can be done. An important factor is that in this
scenario that **two automated systems are talking to each other**.

### Human (Browser) to Machine

Long before SPAs and the Frontend's takeover of rendering HTML, we
already had AJAX. Back in the days, small JSON snippets were travelling
over HTTP asynchronously, mostly with the help of jQuery. This has
made applications faster and more usable.

Classic examples were fetching items of a dropdown depending on
the selection in another dropdown; or adding items to a shopping
cart without reloading the entire page.

Back in the days, to fetch and store these JSON snippets, web backends
used to access specific endpoints (controller actions in MVC terms) that
were part of the application but "talked" JSON instead of HTML.

Did jQuery talk to an API? I wouldn't say, unless we call every web
backend (ie. a collection of HTTP endpoints) an API.

An important differentiator is that in this case **a human, with the
help of a browser is interacting with the backend**.

### Backend for Frontend

Earlier, we used to have mostly HTML but partially JSON speaking backends
targeted for browsers. Machines talk a structured language (JSON, XML)
with each other.

Today with SPAs, browser based interaction has also become mostly JSON
but partially HTML.

Have they become the same? I think not, and software architecture has
a invented a term for that: [Backend for Frontend](https://samnewman.io/patterns/architectural/bff/).

Backend for Frontend - or short **BFF** - is simply a backend dedicated
to User Interfaces. As usual, BFF is more than just that, but in general
the term can help mind-mapping the conceptual difference.

#### Terminology

I prefer to call backends that serve JSON for **User Interfaces = BFFs**;
and backends that serve JSON for other **backends = APIs**.

This is not a 100% precise terminology, but in the daily practice helps
to separate apples from oranges.

## Authentication Difference

Regardless of whether both actors are machines or one of them is a human,
we can differentiate the actors as **Provider** and **Consumer** (aka
client/server).

The Provider is the one that exposes functionality, thus defines the
rules.

The Consumer must comply and in most of the cases must be identified.

The Provider can either identify **concrete users** (eg. via user+pass,
token) or identify **anonymous users** across requests, with the help of
cookies/sessions.

And here comes another important difference between machine-to-machine
and browser-to-machine interactions*:

- machine-to-machine is rarely anonymous and has no browser involved;
- browser-to-machine _can be_ anonymous and there is a browser

> *: One may note that a phone app is a UI, therefore it's human-to-machine
> but (usually) there's no browser. That is true, and albeit the topic
> is closely related, it's not being further discussed in this article.

### Token or Not Token

Token based authentication is where the consumer is passing a unique
string (a token) to the provider to identify itself.

We tend to think that when there's no session and cookies involved, then
we're in the brave new world of tokens.

In fact, **JWT Tokens** - a widely used format - brings a fundamentally
different concept, it is a so-called [Self-contained Token]((https://dev.to/getd/json-web-tokens-jwt-vs-sessionid-explained-in-2-mins-1mcn)).

The most important thing to understand is that a JWT token works like a
passport, ie it contains who you are, and the reader will read your data
from the passport (token) and not from the database.
[This article](https://float-middle.com/json-web-tokens-jwt-vs-sessions/)
explains the concept with a brilliant analogy I wish I would've read
when I first learned about JWT.

**API Tokens** in turn are static, and basically replace username and
password. Whenever the Consumer passes the token to the Provider, mostly
in an HTTP header it needs to do extra work to find out which user it
belongs to, and then what the user can do. This extra work often
requires a database lookup.

**Cookie Based Authentication** is when you store a string (session id)
in your browser and the browser keeps passing that string to the server
as an HTTP header. Basically the same thing as the API Token does,
except that API tokens never expire.

As you see, Cookie based authentication and API tokens are fundamentally
the same. Cookies are being managed by your browser, but API tokens are
the application's responsibility to store, fetch and pass with every
request. Cookies and API tokens have much more in common than API tokens
and JWT tokens, despite the name.

### Security Considerations

API tokens are the least secure since basically it is the same as
passing the username and password in each request. These tokens rarely
expire, therefore should be handled with care.

Sessions stored as cookies are more secure because they have an expiry,
which is not only known by the server, but the browser as well.

Both API tokens and sessions can be revoked any time at the server.

JWT tokens are cryptographically signed, but they give permissions to
their holders until they expire. The JWT token is like a VIP card, it
contains who you are **and** what you can do. Compromised tokens can't
be revoked at the server, unless you maintain a blacklist of tokens at
every edge that accepts tokens (a feature JWT was not designed for).

### Anonymous vs.Logged-in Users

When you're browsing the web, you're mostly anonymous. You still want
to be distinguished from other anonymous users, eg. when placing a
product in the cart of a webshop or when watching a youtube video.

This is called identification of anonymous users.

API tokens were not designed to identify anonymous users.

JWT tokens technically can be used for that, but its `sub` claim
typically stores the user id (client_id in OAuth terms).

Cookie based sessions were designed to identify both anonymous users
and users with an identity (ie. logged in users).

### API vs. BFF Authentication

Returning to the machine vs. browser and BFF vs. API division, the
followings are the key differences regarding Authentication:

**Machine to machine** involves a user with an identity and there's no
browser. As a verdict, **APIs** should use either a JWT or a static API
token.

**Browser to machine** can be both a user with an identity or an
anonymous user and there's a browser. As a verdict, **BFFs** are best to
use cookie based sessions for that purpose as it's safe enough and works
out of the box.

Laravel's Sanctum (subsystem for SPA authentication) just does the very
same thing: https://laravel.com/docs/8.x/sanctum#how-it-works-spa-authentication

Sometimes we try to fix things that aren't broken. Cookies are not bad.
Since you've been reading this article, millions of cookies have been
created, used and expired.

It doesn't mean they're perfect or that you can't have problems with
your app's authentication, but the problem you have, may be completely
unrelated to cookies and sessions.

## Structural Difference

A third difference between APIs and BFFs is their structure.

REST APIs are built around resources which can be imagined as tables and
records in a relational database. It's a bit vague, but what actually
happens is the mapping of tables and records to HTTP endpoints and HTTP
verbs as CRUD operations.

REST APIs are very versatile but are not perfect for complex querying
and telling the backend to omit or include parts of the response.
GraphQL can solve the latter two problems which makes it a good
candidate to act as backend for frontends.

There can be however still some endpoints that are particularly
necessary for the UI to work and make no sense for an API. Such
endpoints could be auth endpoints like login, logout, password reminder,
or the typical "me" endpoint which returns the user data of the current
user.

A machine user will typically not have "a cart" which is a singleton
in the browser. The currently identified user in the browser will want
to have a single cart, whereas a "machine user" can create as many carts
or orders as many it wants and operate on them.

An API user can have access to all the carts in the system whereas the
plain user coming from a browser only to his/her own ones.

All these differences require you to structure the two backend endpoints
differently and end up having an API and a BFF.

APIs (both RESTful and GraphQL style ones) are resource oriented and
BFFs are goal oriented. It's perfectly fine to add utility endpoints
to BFFs which would be weird to see in APIs.

## Couldn't We Just Have One API?

Yes we could. Such as we could have a backend rendering the HTML and no
fancy react 💩. Similarly, we can keep CSS next to HTML.

I'm not arguing for atomic fragmentation, or for a micro<XYZ\> approach.

What I'm arguing for is:

- Segment your application along well defined use cases.
- Don't mix machine targeted APIs and JSON speaking backends targeted for UI rendering.
- Don't ditch sessions and cookies when in a browser context.

It will keep things simple and straightforward.

> [_duplication is far cheaper than the wrong abstraction_](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)<br>
> --Sandy Metz