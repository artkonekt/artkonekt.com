---
title: How To Build Reusable And Extensible Modules For Laravel
subtitle: Is it feasable<br>to develop for multiple<br>PHP frameworks at once?
tags:
    - php
    - frameworks
    - laravel
    - composer
    - concord
excerpt: There's an ongoing debate about making PHP applications/libraries to be framework agnostic. While the approach is 100% valid, there are many practical issues.
image: flirt_small.jpg
hero_image: flirt2.jpg
---

When I started coding in '99, I wanted my first application to be the very best, so I spent a lot of time polishing it. I've created dozens of applications since then. Some patterns in my code were repeating and have settled with time. I had a lot of referential point in prior projects and often copypasted code.

I don't prefer copypaste, but it's better then investing efforts in YAGNI features, that only create noise.

After growing from solo to a team, and being specialized to E-commerce,
one day I realized that it's approximately the 15th time in my life I'm
implementing the "Add To Cart" functionality.
I became angry. And bitter. And annoyed. Is that my professional career?
Implementing basic things for all my life? To start from `CREATE TABLE products` all the time?

It felt painful, so I decided to act.
I've heard [Pain Driven Development](http://deviq.com/pain-driven-development/) from Jeffrey Way for the first time.

**Clients want all the same thing, but differently**; and we must ship the way they want. So we need the basics settled, reusable but modifiable.

When you're developing an application don't think about code re-use.
I attended Chad Fowler's presentation this year where he said:

> When someone mentions code reuse, just slap him in the face!

He's right. How come I'm still writing an article about code reuse?

Because you wouldn't code Wordpress, Symfony or Rails from scratch, would you? When you're using libraries or frameworks then you're actually practicing code reuse - it's just not your own code (usually).

After I realized the friction I started evaluating E-commerce solutions for PHP. I found and loved [Sylius](http://sylius.org), but after 2 years and 5 real life shops with it I decided to continue my journey with Laravel.

So I've found myself that I'm about to create an [E-commerce framework](https://vanilo.io) that actually requires code reuse (slap me) and extensibility.

I've learned a lot from Sylius, both practices to follow and practices to avoid. The very first thing was the need for a standard on how modularization will happen, including how to extend/modify/replace functionality from the basic modules. This is how [Concord](https://github.com/artkonekt/concord) came to life.

## Concord: Laravel Extension For Building Modular Applications

Concord was a markdown file first, a collection of guidelines that modules and host applications should comply with. I've also listed my frictions I've faced working with some systems.

### Friction #1: Lack Of Clarity

**In PHP, please.**

My primary friction working with Sylius/Symfony was that I'm not an XML/YAML/annotation programmer. I prefer coding with PHP. The service locator pattern combined with their XML configs spread across dozens of files is definitely flexible, but makes the code very obscure. How do you know which classes are intended to implement the `xyz.blabla.foo` service? How do you know what methods/properties do the consumers of that service expect? Not to mention the practice of 'gluing' service name strings so you can't just search your codebase for `xyz.blabla.foo`.

I was very enlightened to learn Laravel's DI can resolve services based from interfaces as well. It means your service name is the interface's FQCN, which is PHP, instead of being buried in XML and/or YML files. That way any class that's a candidate to represent that service is easy to locate as they need to implement that interface. For me it's a lot more clean.

### Friction #2: Needless Complexity

**Walk the extra mile... for nothing**

When I met situations like:

- Injecting factories as services to services of repositories in order to modify a default flag;
- Modifying 6 files to add a new menu item;
- Creating a twig extension for a specific currency formatting;
- Writing a service and hook it to events via XML in order to add someone to the bcc of an E-mail;

all made me feel that the extra mile I'm walking is a complete waste of time. And that time often was paid by me and not the client.

So I decided not to abstract/interface/inject everything as long as it doesn't hurt.

## Post Structure:

Problem - Agitation - Solution

## Writing The Post:

1. Research (find quotes & how others were facing the problem)
2. Organize
3. Write/finish


In my case I started evaluating E-commerce libraries, platforms and frameworks. We ended up using [Sylius](http://sylius.org). It's targeted to developers (which I am), built on top of Symfony which is one of my favorite 3 PHP frameworks. Pawel (the creator of Sylius) usually highlights the fact that Sylius is TDD/BDD in the first place. I do TDD myself, but if I'm honest I don't care at all if the platform is TDD. We've implemented 5 shops with Sylius and neither ran their tests once. Sylius is still a very good choice, but I found myself drifting away from some programming principles they're sticking to.

It was also Pawel, who told us he hasn't yet seen anyone switching from Symfony to another framework. Shortly afterwards we were 'forced' into using Laravel in a project. Becoming part of the Laravel community I re-learned simplicity and felt working with it like fresh air. (I still use and like Symfony - it's not a Symfony vs. Laravel debate).

I realized that I'm more efficient with Laravel so I started to look after E-commerce libraries/frameworks for Laravel.

Tension: multiple projects, same functions, different result.

Develop one app, no problem, don't think about code re-use.

## Why:

> But if it happens N times (N>5), you start itching.

## Personal Story

_story is built around conflict_

## Data Points

_Quotes from 15+ sources_

- Reference To Caffeinated Modules (how they tried solving the problem, why need another approach)

### Code Reuse

https://stackoverflow.com/a/268521/1016746

**RoadWarrior:**

> I think the first step is to get yourself into a mindset that it's going to take at least 3 iterations to create a reusable component. Why 3? Because the first time you try to reuse a component, you always discover something that it can't handle. So then you have to change it. This happens a couple of times, until finally you have a component that at least appears to be reusable.

Time to pick up a platform (WP, Magento, ...)

You want it your way.

The Laravel way. Clarity over flexibility.

App doesn't get extended - no need for flexibility.

Modules are reusable components, but they almost always need modification.

Using modules should be that you're using them the same Laravel way.

Problems you're facing:

- Modifying models (entities)
- Extending lists (enums)
- Modifying forms, validations
- Altering views, replacing layouts
- Anything else should be modifiable

Refer To Service Locator vs. Interface based location.
Refer To Strong Typing vs. Loose Typing (refer to Jeff Way)

Mention vanilo as the bigger scope for this.
Mention Sylius and how we sucked learning (maybe it's too much for first post?)

In-app modules versus separate modules

### Tie A Conclusion

Why Concord's solution is a good one