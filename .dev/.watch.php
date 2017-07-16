<?php
// adapted from https://github.com/dbergey/Reloadr

chdir($_SERVER['DOCUMENT_ROOT']);

$filenameLists = array_map('glob', explode(',', $_SERVER['QUERY_STRING']));
$fs = array();
foreach ($filenameLists as $l)
  $fs = array_merge($fs, $l);
foreach ($fs as &$f)
  $f = filemtime($f);

header('Last-Modified: '. date('r', @max($fs)));

// eof