---
title: E-commerce Platform For Laravel
subtitle: vanilo.io<br>are you in?
tags:
    - php
    - frameworks
    - laravel
    - vanilo
    - ecommerce
excerpt: I'm an E-commerce developer + love Laravel. But I hate to start every webshop from scratch. I haven't yet found a good E-commerce platform for Laravel, so I started to create one myself. Will you use it?
image: vanilo_laravel_ecommerce_small.jpg
hero_image: vanilo_laravel_ecommerce.jpg
---

I love E-commerce. And I love Laravel. I also love Symfony and Phalcon, but decided to move to Laravel as the primary framework.

Being an E-commerce developer means our job is to build and maintain quite several webshops, parelelly.

Every client's needs are unique but 80% of the features are actually common. That's exactly why Magento, Prestashop, SpreeCommerce and Sylius were built for.

## No E-commerce For Laravel (Yet)

I've made some research and [found](https://laracasts.com/discuss/channels/general-discussion/laravel-and-e-commerce) that the E-commerce library/framework offering for Laravel [is not very teasing](https://laravel.io/forum/02-02-2014-open-source-e-commerce-laravel-style).

And I'm not the only one, see [this reddit](https://redd.it/5yx83w):

> **Why is there no Laravel based e-commerce platforms?**
>
> The only "decent" one I can find is Aimeos. Other than that, there doesn't seem to be much else. Is it because It's easy enough to create an online shop from the standard Laravel framework? Is there any demand for such a platform?

I've found some [projects](https://github.com/mikimaine/ecommerce) which were either [abandoned](https://github.com/Jiro-Commerce/Jiro) and/or are rather [applications](https://github.com/mage2/laravel-ecommerce) [than](https://github.com/ant-vel/App) frameworks. I've also found aimeos which is a true e-commerce framework but IMO it's not native to Laravel.

## Native Laravel E-commerce

What I'd like to have is an E-commerce framework which is **very closely related to the Laravel family**. If a new Laravel version comes out it should have full support for that on the very first day. If a new Laravel feature is out it should support it immediately. It should **deviate from Laravel's common sense as little as possible**.

Free and Open Source of course.

## Foundations For Vanilo

We're about to build this Laravel E-commerce framework. It's called [Vanilo](https://vanilo.io).

I've built and operated many webshops on the battlefield during the years. Amongst which there were shops built with Magento, Sylius and some custom ones built with custom MVC, yii, phalcon and Laravel.

Last year we've built a proprietary solution with Laravel having lots of features using all the experience noted above. Including but not limited to physical/downloadable products, attributes, variants, a very flexible promotion system, a good enough cart + checkout, online payments, highly automated order processing including billing & shipping provider integration, client scoring, campaign tracking & configurable workflows.

We are allowed to transfer source code from that project to Vanilo.

## First Steps

Vanilo's goal is to start with only the basics (catalog, clients, cart, orders) but in a true Laravel way.

Another important thing what we've learnt from Sylius is that we want to **provide with a clean upgrade path right from v0.2 upwards** for every early adopter. Sylius has already had many live shops built with, but we (early adopters) were left alone with the struggle upgrading v0.x versions. No docs, but manually matching migrations often overlapping between branches. And I didn't care much how beautifully _*BDD*_ Sylius was in the depth of the `vendor/` folder.

As Lukas Kahwe Smith [mentions](https://blog.liip.ch/archive/2017/08/16/headless-b2b-marketplace.html) in his post:

> Sylius starting with the use of BDD which is also a great way to document behavior via test code. While initially this perfectionism prevented him (Pawel) building a community, the project has long overcome this and is now quite an active community.

We consider very important to help evolving every shop that chooses Vanilo as a platform.

## I Need Your 30 Seconds Help

I could write much longer about this topic, but I think the matter is clean: **building a truly Laravel E-commerce platform**.

Maybe it's only important for me, which is fine, but I'd like to know if that's the case. Maybe you resonate with me and you'd be happy as well to have such a solution available.

Please go to [vanilo.io](https://vanilo.io) and rate this idea with literally two clicks. If you really like it, please also subscribe so that we can get in touch.

Please also share your thoughts in the comments below.