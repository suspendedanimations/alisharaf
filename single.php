<?php
$context = Timber::get_context();
$context['work'] = new TimberPost();

Timber::render('views/single/single.twig', $context);