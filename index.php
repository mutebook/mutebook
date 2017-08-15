<?php
chdir(dirname(__FILE__));

// configuration
const TITLE  = 'MuTeBook';        // the book title
const BANNER = 'MuTeBook';        // the book banner

const PAGES = 'pg/';              // where pages are

// server
const HTTPS = false;              // set to true if running as https://

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
