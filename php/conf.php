<?php

const TITLE  = 'MuTeBook'; // the book title
const BANNER = 'MuTeBook'; // the book banner

const PAGES = 'pg/';      // where pages are
const TOC   = '_toc';     // source TOC filesoc

const INDEX = 'index';    // index files
const CM    = '.cm';      // .cm file suffix

// server
const HTTPS = false;

// statcounter.com
const SC_PROJECT  = '11395717';
const SC_SECURITY = '03ed7177';

$isDebug = 'localhost' == @$_SERVER['SERVER_NAME'];

// eof