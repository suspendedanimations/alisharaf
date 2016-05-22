<?php
/**
 * Template Name: Profile Template
 */

$context = Timber::get_context();
$context['post'] = new TimberPost();

Timber::render('views/about/about.twig', $context);