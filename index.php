<?php
// configuration
const PAGES  = './pg/';             // where pages are

const SC_PROJECT = 11395717, SC_SECURITY = '03ed7177';

// php hooks
// $phpHook = function () {
//   return 'Ä';
// };

chdir($dir = dirname(__FILE__).'/');

// statcounter.com
@include($dir.'statcounter.php');

// the rest of code
require($dir.'CM/_include_index_.php');

// eof
