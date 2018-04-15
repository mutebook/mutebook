<?php
chdir(dirname(__FILE__));   // chdir to site root
require('book.php');        // configuration
@include('stats.php');      // optional tracking
require('CM/_index.php');   // generate the site index

// eof
