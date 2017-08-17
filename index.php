<?php
// configuration
const TITLE  = 'Mutebook';        // the book title
const BANNER = 'Mutebook';        // the book banner

const PAGES  = './pg/';             // where pages are

// debugging
$isDebug = 'localhost' == @$_SERVER['SERVER_NAME'];

// php hooks
// $phpHook = function () {
//   return 'Ä';
// };

chdir($dir = dirname(__FILE__).'/');

// statcounter.com
@include($dir.'statcounter.php');

// the rest of code
require($dir.'CM/php/_include_index_.php');

// eof
