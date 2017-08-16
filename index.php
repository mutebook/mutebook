<?php
chdir(dirname(__FILE__));

// configuration
const TITLE  = 'Mutebook';        // the book title
const BANNER = 'Mutebook';        // the book banner

const PAGES = 'pg/';              // where pages are

// debugging
$isDebug = 'localhost' == @$_SERVER['SERVER_NAME'];

// php hooks
// $phpHook = function () {
//   return 'Ä';
// };

// statcounter.com
@include(dirname(__FILE__).'/statcounter.php');

// the rest of code
require('CM/php/_include_index_.php');

// eof
