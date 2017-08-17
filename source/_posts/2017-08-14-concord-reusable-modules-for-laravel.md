---
title: How To Build Reusable Modules For Laravel
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

I don't prefer copypaste, but today I say it is better then investing efforts in YAGNI features, that only create noise.

But after growing from solo to a team, and being specialized to E-commerce, one day I realized that it's approximately the 15th time in my life I'm implementing the "Add To Cart" functionality.

I became angry. And bitter. And annoyed. Is that my professional career?
Implementing basic things for all my life? To start from `CREATE TABLE products` all the time?

It felt painful, so I decided to act.
I've heard [Pain Driven Development](http://deviq.com/pain-driven-development/) from Jeffrey Way for the first time.

**Clients want all the same thing, but differently**; and we must ship the way they want. So we need the basics settled, reusable but modifiable.

There's a clear distinction between applications and libraries. Applications are for single use, libraries are for reusing in multiple applications.

When you're developing an application don't think about code re-use.
I attended Chad Fowler's presentation this year where he said:

> When someone mentions code reuse, just slap him in the face!

He's right. How come I'm still writing an article about code reuse?

Because you wouldn't code Wordpress, Symfony or Rails from scratch, would you? When you're using libraries or frameworks then you're actually practicing code reuse - it's just not your own code (usually).

After I realized the friction I started evaluating E-commerce solutions for PHP. I found and loved [Sylius](http://sylius.org), but after 2 years and 5 real life shops with it I decided to continue my journey with Laravel.

So I've found myself that I'm about to create an [E-commerce framework](https://vanilo.io) that actually requires code reuse (slap me) and extensibility.

I've learned a lot from Sylius, both practices to follow and practices to avoid. The very first thing was the need for a standard on how modularization will happen, including how to extend/modify/replace functionality from the basic modules. This is how [Concord](https://github.com/artkonekt/concord) came to life.

## Concord: Laravel Extension For Building Modular Applications

> **Documentation**: https://artkonekt.github.io/concord

### Concord 101

Concord's primary feature is to enable Modules for Laravel Applications on top of Laravel's built in Service Providers.

**Modules**
Modules are the de-coupled implementations of the business logic built around a single purpose, like 'Client', 'Cart', 'Billing'.

**Boxes**
Boxes are optional and basically they're modules too. They wrap and connect several modules, and are intended to be customized by the final Application.

**Application**
Any Laravel 5.3+ application that incorporates modules.


### Modules

Modules are decoupled components. Technically they're a bunch of classes and files wired into the Laravel Application with their own dedicated Service Provider.

Modules can be situated in two ways:

- external modules (separate composer packages)
- in-app modules (usually under app/Modules/<ModuleName>)

The only difference between the two is how you consider them. External modules are to be used by several applications while in-app modules are unlikely be used elsewhere. In case of external/reusable modules Concord offers some nice facilities for altering the module's behavior which have not much sense in case of in-app modules.

### Directory Structure

Concord has a [default directory structure](https://artkonekt.github.io/concord/#/directory-structure) for various classes/files. This structure is called [Convention](https://artkonekt.github.io/concord/#/conventions) which you can freely customize.

Concord was a markdown file first, a collection of guidelines that modules and host applications should comply with. I've also listed my frictions I've faced working with some systems.

### Module Parts

Modules were designed so that they can encapsulate most common Laravel _parts_ like:

- Eloquent Models
- Migrations, seeds
- Events, listeners and their bindings
- Views, blade components
- Routes
- Controllers, Middlewares
- Request types (for validation)
- Commands

Concord registers them in Laravel when necessary, but it's possible to omit parts via configuration.

## Notable Features

### Altering Models

As an example there is the `Product` model defined in the product **module**. Your final **application** may want to alter/extend it so that it doesn't break the basic functionality of the module.

Possible modifications:

- Adding fields,
- Removing fields,
- Altering fields (via accessors and mutators),
- Adding scopes,
- Adding relationships.

Most of these can be done by adding migrations and extending the original Model class using simple OOP inheritance. The essence of the problem is **how will your lower level modules know that the system is using an extended class** for that entity?

**The answer is to tell concord to use your model instead:**

```php
    // Within AppServiceProvider's boot method:
    $this->app->concord->registerModel(
        \Vendor\ProductModule\Contracts\Product::class,
        \App\Product::class
    );
```

Concord's concept requires that modules define an interface for every Eloquent Model (`\Vendor\ProductModule\Contracts\Product` in this case).

`Models\Product` class gets bound to the `Contracts\Product` interface within the module (consider it as a default). If the application wants to extend that class, it invokes Concord's `registerModel()` again, and that's all.

The `registerModel()` method also silently [binds the interface to the implementation with Laravel's service container](https://laravel.com/docs/5.4/container#binding-interfaces-to-implementations) so you can simply type hint the interface at any point where [automatic injection](https://laravel.com/docs/5.4/container#automatic-injection) happens.

### Migrations

The migrations within Concord are just plain Laravel migrations. Starting with v5.3, Laravel supports migrations distributed in various folders, Concord is utilizing this facility.

It is possible to disable publishing of migrations in the module configuration:

`config/concord.php`:

```php
<?php
return [
    'modules' => [
        Konekt\Address\Providers\ModuleServiceProvider::class => [
            'migrations' => false
        ]
    ]
];
```
By default, migrations are published.

### Installation

Concord is a regular Laravel service provider.

Add the dependency to composer: `composer require konekt/concord`.

Register the provider in `config/app.php`:

```php
'providers' => [
    // Other Service Providers

    Konekt\Concord\ConcordServiceProvider::class,
];
```

Publish the config file:

```bash
php artisan vendor:publish --provider="Konekt\Concord\ConcordServiceProvider" --tag=config
```



### Friction #1: Lack Of Clarity

**In PHP, please.**

My primary friction working with Sylius/Symfony was that I'm not an XML/YAML/annotation programmer. I prefer coding with PHP. The service locator pattern combined with their XML configs spread across dozens of files is definitely flexible, but makes the code very obscure. How do you know which classes are intended to implement the `xyz.blabla.foo` service? How do you know what methods/properties do the consumers of that service expect? Not to mention the practice of 'gluing' service name strings so you can't just search your codebase for `xyz.blabla.foo`.

I was very enlightened to learn Laravel's DI can resolve services based on interfaces as well. It means your service name is the interface's FQCN, which is PHP, instead of being buried in XML and/or YML files. That way any class that's a candidate to represent that service is easy to locate as they need to implement that interface. For me it's a lot more clean.

### Friction #2: Needless Complexity

**Walk the extra mile... for nothing**

When I met situations like:

- Injecting factories as services to services of repositories in order to modify a default flag;
- Modifying 6 files to add a new menu item;
- Creating a twig extension for a specific currency formatting;
- Writing a service and hook it to events via XML in order to add someone to the bcc of an E-mail;

all made me feel that the extras mile I'm walking are a complete waste of time. And that time often was paid by me and not the client.

So I decided not to abstract/interface/inject everything as long as it doesn't hurt.





## Post Structure:

Problem - Agitation - Solution

## Writing The Post:

1. Research (find quotes & how others were facing the problem)
2. Organize
3. Write/finish

#### First Time With Laravel

When I saw Laravel for the first time, it was about version 4 or 3 I guess. My impression was it has a very funky looking site, easy to read documentation. I left off in about 2 minutes when I saw they're using 'statics' everywhere. Not me - said, and went back to my abstracts (which I'm pretty good at btw 😎).

#### The Sylius Story

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

http://blog.cognitect.com/blog/2016/6/16/the-new-normal-team-scale-autonomy

In-app modules versus separate modules

### Tie A Conclusion

Why Concord's solution is a good one