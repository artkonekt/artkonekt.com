---
title: Framework Agnostic PHP Applications
subtitle: Is it feasable<br>to develop for multiple<br>PHP frameworks at once?
tags:
    - php
    - frameworks
    - laravel
    - symfony
    - sylius
    - phalcon
    - composer
    - packagist
excerpt: There's an ongoing debate about making PHP applications/libraries to be framework agnostic. While the approach is 100% valid, there are many practical issues.
image: flirt_small.jpg
hero_image: flirt2.jpg
---

This post is a transcript of a discussion between me and [Bruno Skvorc](https://www.sitepoint.com/author/bskvorc/) under a [Sitepoint article about Phalcon](https://www.sitepoint.com/up-and-running-with-the-fastest-php-framework-on-php7-in-5-mins/). This way I'd like to send Bruno a big thank you for the inspiring conversation! ;)

I'm missing a concept from Phalcon similar to Laravel's Service Providers or Symfony Bundles. This probably would help others (even me) to start developing reusable extensions for phalcon that this cool framework unfortunately lacks yet.

> Just develop plain old PHP packages for Composer/Packagist, no need for bundles and service providers - they're all just shortcuts for DI containers anyway, and needlessly couple your package to a framework. Make something that works everywhere, and instruct people on how to use it well with a DI container instead.

That's the theory. Actually when you have to do something concrete, you choose right at the start at it's minimum an ORM, so it's immediately coupled to something more than just php. If you try to do it in a framework agnostic way, you end up in a serious design headache due to heavy abstractions.

Do you use collections or just plain arrays? If collections which one? Illuminate or Doctrine collections? Why? Plain arrays? Good luck with filtering, shrinking and other nice tasks on the go.

Which event/listener implementation will you use? All frameworks have their own. I was using a composer package with phalcon that relies on the very popular symfony events implementation. There's nothing that fits into phalcon's own event system.

Will you use SQL or some NoSQL like Mongo? Will you use a Datamapper or some ActiveRecord ORM?

When you answer all these questions you'll end up with a series of decisions that will tie you to other libraries/frameworks, at least for usual business applications.

I am actively maintaining some projects on packagist/github and my experience is that **simple libraries can be framework agnostic**. But for a more complex set of components (eg Sylius) it's not a real life scenario.

> But everything you list (ORM, Datamapper, event listeners) has a framework-agnostic packagist version - it's just a matter of pulling it into the app "the right way", no?

Yes it is true these libraries are framework agnostic themselves, but it's natural to have Doctrine with Symfony, Eloquent with Laravel, Phalcon with its own ORM, und so weiter. Of course it's possible to mix them up - something I used to do - but it's not a lucky choice IMHO.

We had this summer two client projects (one Laravel another Symfony) needing the very same functionality. I separated the common parts to a plain php standalone library (composer package), and the framework/orm specific things to their own separate packages. I almost have remained just with interfaces in the first part.

Let's say you have an entity called Promotion.

You want that to work both with Doctrine and Eloquent, and you want that to define in a framework agnostic way.

A real life example is in the Sylius repository, in their framework-agnostic [promotion package](https://github.com/Sylius/Promotion/blob/master/Model/Promotion.php).
This _"agnostic"_ package has tough bindings to Doctrine and some Symfony components, eg. their event-dispatcher component which is actually a foundation of the Symfony framework and is pretty unnatural on Laravel or on Phalcon.

On the other hand as you see the referenced POPO object defines all its properties:

```
    protected $id;
    /**
     * @var string
     */
    protected $code;
    /**
     * @var string
     */
    protected $name;
```

and so on. In case you want this to work with Eloquent as well, you're in trouble as Eloquent maps these properties via magic getters/setters so having these propertied explicitely defined would prevent Eloquent from working properly. There are workarounds of course, but then you are actually "eloquentizing" your Doctrine (DataMapper) based concept.

Beyond entities, dealing with migrations, views, asset handling, routes, event-listeneres and middlewares in a framework-agnostic way is a very dark area yet these days. These facilities are the properties of frameworks (and they handle it pretty well).

Of course this might change in the future, thanks for [PSRs](http://www.php-fig.org/psr/) evolving (eg. the upcoming [PSR-15](https://github.com/php-fig/fig-standards/tree/master/proposed/http-middleware) for middlewares standardization).

So according to my experience if one is about to build **complex** framework-agnostic components, that brave person is pretty much ends up experimenting alone. Or simply just gives up :)