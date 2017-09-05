<?php

const META_DESCRIPTION =
  'Online interactive textbook to learn and teach music technology and music production.';
const META_KEYWORDS =
  'Music technology, online teaching, music production, acoustics, electronics, digital audio';
const META_AUTHOR =
  'Thilo Schaller & Jan Burle';

const PAGES = 'pg/'; $pages = PAGES;

$book = <<<EOT
  title:  'Mutebook', banner: 'Mutebook', pages: '$pages',
  sc_project: 11395717, sc_security: '03ed7177',
EOT;

require(dirname(__FILE__).'/CM/_index.php');

// eof
