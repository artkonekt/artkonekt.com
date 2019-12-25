<?php
/**
 * Contains the Sculpin Kernel class.
 *
 * @copyright   Copyright (c) 2017 Attila Fulop
 * @author      Attila Fulop
 * @license     MIT
 * @since       2017-08-09
 *
 */


use Nickpeirson\Sculpin\Bundle\SitemapBundle\SculpinSitemapBundle;
use Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel;

class SculpinKernel extends AbstractKernel
{
    protected function getAdditionalSculpinBundles(): array
    {
        return [
            SculpinSitemapBundle::class
        ];
    }
}
