---
title: High Traffic Sites And The Php Framework Dilemma
subtitle: Once someone has come up with the question<br>whether to use an own MVC Framework (PHP) for high traffic webshops.<br>It's my response to that.
tags:
    - php
    - frameworks
    - scalability
    - varnish
    - caching
excerpt: Once someone has come up with the question whether to use an own MVC Framework for high traffic webshops. The framework doesn't matter for that. Here's why.
image: dodgem_small.jpg
hero_image: dodgem2.jpg
---

Scalable systems have several factors, and they should be analyzed separately even if they make up a single system at the end of the day.

## Existing Or Custom Framework?

Obviously an existing one. I have authored a [PHP MVC Framework](https://bitbucket.org/fulopattila122/konekt-framework2), and it was a lot of fun for learning. There are still live sites running on it, but as most dev folkz state it, it's only good for gaining experience.
If you're doing it alone, you'll never be able to compete with systems used by hundreds of thousands and developed by dozens. My experience was that neither am I smarter nor have I the time necessary - so my super framework has always been half-done. Nonetheless you can learn a lot just by using an existing one.

## Which PHP Framework?

It depends. I have worked with these already (chronological order):

1. **Symfony 1**: was a nice one, lifespan is over, forget it for new projects (Symfony 2 is its successor, but they have actually nothing in common)
2. **Zend Framework 1**: Used to be among the first ones, but its deprecated.
3. **CodeIgniter**: Was an early bird as well. Avoid it. They're still not using namespaces and apparently don't give a shit about basic PSRs that are prevalent in the contemporary PHP world.
4. **Yii 1**: another oldie, was fast, now it's deprecated. (I've seen YII2 as well but haven't been working with it)
5. **Symfony 2/3**: One of the bests if not the best, but it's a bit chunky and requires an experienced developer.
6. **Phalcon**: It is written in C language (Zephyr - whatever) so it's freakin' fast. I like it a lot due to it's simplicity and flexibility but it's documentation is kinda crappy compared to the major competitors, and the entire system is generally less comprehensive.
7. **Laravel**: The people's framework. And is incredibly cool in the details. Fast enough. It's documentation is good, and if you consider [Laracasts](https://laracasts.com) then Laravel's docs are unbeatable. There are lots of extensions (similar to Symfony) available. But if you're experienced enough, you'll be probably pouting about it.

## Performance

It's incredibly important to answer yourself the question: **How many users do you want to scale your system for?** Simultaneously 500, 1000, 2000, 5000, 10000, 50000, ... ?

It's an essential matter whether it's a real demand or just a _nice to have_ feature.

Another important factor is that - even if it sounds weird - your framework of choice can only be a bottleneck at a low number of users. Why? Because no framework can help when you have simultaneously 10.000 users (at least not in the PHP world).
**Real performance is provided by the appropriate architecture/infrastructure.** This consists of multiple parts.

### Performance And The Code

The **most important is not to have something stupid in the code, especially not to execute too many SQL queries**. Things like loop or memory optimization or algorithm sharpening - that many developers think is magic - don't matter too much at this level. Obviously I'm talking about a mature codebase, written at least by middle level developers.
**The essence of tuning for high traffic is** exactly to unburden the application so **that just a very percentage of the requests will reach your code**.

### Performance And Web Server

I only have experience with apache and nginx. Nginx seems to be a bit faster, but again, what really matters is tuning. It is generally a good idea to use FPM for PHP since they run separately.
Numbers are important here as well, depending on the number of CPU cores, RAM, etc. There are a lots of articles available, just google it and get your hands dirty.

### Performance And The Database

This is an interesting topic. Similarly to the codebase, it's also important to minimize the number of SQL queries hitting the DB servers as much as possible - if it's possible at all.

For example in case of a webshop it would be stupid to keep querying the homepage/product index/product page trinity all the time. In my experience these constitute about 70% of the entire traffic. Cart and purchase operations obviously can't avoid hitting the database (except for querying unmodified carts).

It's important that your DB structure is appropriate, using indexes properly, knowing clearly which tables are being used more for reading and which ones rather for writing. In case of MySQL it's possible to play with storage engines accordingly.

If the load is really high, then you need a DB cluster. I happened to work with some people from the porn industry (the IT part ;) ) and they use a separate set of servers for writing and another set for reading. Btw. this scenario is supported out of the box by Laravel and Phalcon.

Another trick is caching query results, we usually use redis for that. This is where the Doctrine ORM excels out of the box.

###  Performance And Memcache/Redis

These memory based cache systems are pretty versatile. Apart from query caching as mentioned, there are many use cases. If you're application is running on multiple servers, you need to access session data from some common store - we use distributed redis for that.

It was an interesting experience that with redis we could reach 300.000 req/s when we switched from TCP/IP to unix sockets (both via localhost). But as far as I read, redis should be able to serve 1 million requests per sec.

### HTTP Cache

**This is the real thing**. We use varnish for that, but there are many others, nginx for example. The choice of software is actually less important, but according to my experience **this is what makes the dramatic difference**.

Your application sets the TTL (time to live) of the specific elements (pages, images, assets, etc) and then varnish will spit them back from the memory for the upcoming requests. And here comes the essence of it: your framework can even be written in assembly, it doesn't matter, because it won't be used.

Of course the party starts here: there are elements on your page which are perfectly the same for all your visitors and there are some of them which are user specific (cart, account, etc). Basically there are two solutions for that, one of them is called **ESI**. Another one is that you give a common skeleton, and you separately query the user specific parts by AJAX. Fortunately this can also be cached by varnish on a session basis, so it's likely that the request still won't hit your code, no php and no sql will be executed.

Another party animal is cache invalidation. Your application can instruct Varnish upon some events to remove a page from the cache - and request a fresh one. But what if a product gets a price update, which pages do we need to invalidate? This is what you use tagging for. In case a product is present on a page, we tag it on HTTP header level (by the product id). In case a product gets modified, we only have to instruct Varnish to purge every element from the cache with the specific tag. This is awesome.

Lastly, it's important to configure Varnish so that these internal HTTP "announcments" don't go out in the wild.

### CDN

Some parts of the HTTP cache can be outsourced to CDNs. This is emphasized in case your audience is geographically distributed. I'd recommend Cloudflare, but there are many other rockstars like rackspace, amazon s3+cloudfront, maxcdn, etc.

## E-commerce Platform

We've been using quite several ecommerce platforms during the years. Developing an own one can be pretty time and money consuming for the same reasons stated by MVC frameworks above. We made some custom sites as well, but lately we're working with Sylius. I wouldn't say I recommend it - not that it's not good. It has a steep learning curve.

I had my years with Magento. It's good platform, but incredibly complex. I will never go back.

There are a lots of new ecommerce platforms, I recommend reading these articles: [this one](https://medium.com/@salvoadriano/building-the-next-generation-ecommerce-26093f98d2d7#.sivhy43hv) and [this one](https://blog.fortrabbit.com/ecommerce-status-quo-2016).


## Conclusion

If still a custom system, then I think the framework should be chosen based on which one fits your level of knowledge and your coding style.

The framework primarily should serve your needs from the code maintainability perpective.

If you're experienced and/or educated enough, there's a high chance you'll use Symfony. But then, you already know all this :)

But in case you're not, I recommend Laravel. It's a modern, solid, unitary concept with well-tried patterns, great docs, videos(!) and community. Most important components already exists.

Of course you have to check out all of them and pick the one you like :)