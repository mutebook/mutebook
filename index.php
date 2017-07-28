<?php
$isDevelopment = false;

// request;
if (($pg = @$_REQUEST['pg'])) {
  $isIndex = false;
  if (false === ($pos = strrpos($pg, '/'))) {
    $pagePath = '';
    $pageFile = $pg;
  } else {
    ++$pos;
    $pagePath = substr($pg, 0, $pos);
    $pageFile = substr($pg, $pos);
  }
} else {
  $isIndex = true;
  $pagePath = '';
  $pageFile = '';
}

// conf
$pagesPath  = 'pg/';

// detected above
// $pagePath: path from docRoot to current page ('' for index)
// $pageFile: current page file basename

$docRoot = dirname(__FILE__).'/';

?>
<!DOCTYPE html><html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="assets/icon.ico">
<link rel="stylesheet" href="assets/main.css">
<meta charset="utf-8">
<script charset="utf-8">
<?php // as in init.js

$jsPagePath = addslashes($pagePath);
$jsPageFile = addslashes($pageFile);

echo <<<EOT
var cm_book = {
  conf: {
    title:  'mutebook',
    banner: 'mutebook',
  },
  pagePath: '$jsPagePath',
  pageFile: '$jsPageFile',

  tocKey: function (indexOrKey) {
    if (Number.isInteger(indexOrKey))
      return Object.keys(this.toc)[indexOrKey];
    if (this.toc[indexOrKey])
      return indexOrKey;
  },
  resolveLink: function (ln) {
    if (0 <= ln.indexOf('://'))
      return ln;
    try {
      ln = '?pg=' + this.toc[ln][1]; // TODO hack
    } catch (err) {
      ln = ln.startsWith('/') ? ln : cm_book.pagePath + ln;
    }

    return ln;
  },
  resolveDirLink: function (ln) {
    ln = this.toc[ln][1];
    return ln.substr(0, ln.lastIndexOf('/'));
  },
  resolveSrc: function (key) {
    try {
      var src = '/index.php?pg=' + this.toc[key][1];
    } catch (err) {
      return '';
    }
    return src;
  },
  loadCSS: function (href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
  },
  loadScript: function (src, onLoad) {
    var where = document.body || document.head;
    var script = document.createElement('script');
    if (onLoad)
      script.onload = onLoad;
    script.src = src;
    script.charset = 'utf-8';
    where.appendChild(script);
    return script;
  },
  tocEntry: function (ln) {
    return cm_book.toc[ln];
  },
  tocTxLink: function (index) {
    try {
      var link = Object.keys(cm_book.toc)[index], tx = cm_book.toc[link][0];
      return [tx, link];
    } catch (err) {
      return ['', ''];
    }
  },
};


EOT;

// TOC
echo "cm_book.toc = {\n";

function split_line($l, $n) {
  return array_pad(array_map('trim', explode(';', $l)), $n, '');
}

$checkHashes = [];
function checkHash($path, $hash) {
  global $checkHashes;
  if (@$checkHashes[$hash])
    error_log("in path [$path], hash already exists: [$hash]");
  $checkHashes[$hash] = true;
  return $hash;
}

function toc($path, $sectionHash) {
  global $docRoot;
  if (!($f = @fopen($docRoot.$path.'TOC', 'r')))
    return;
  list($title, $hashPrefix) = split_line(fgets($f), 2);
  if ($hashPrefix)
    $hashPrefix .= ':';
  $indexHash = checkHash($path, $hashPrefix.'index');
  echo "'$indexHash': ['$title', '${path}index.cm', '$sectionHash', '$indexHash'],\n";
  while (!feof($f)) {
    if ($l = trim(fgets($f))) {
      list($file, $title, $hash) = split_line($l, 3);
      if ('/' === substr($file, -1)) { // sub
        toc($path.$file, $indexHash);
      } else {
        $pageHash = checkHash($path, $hashPrefix.$hash);
        echo "'$pageHash': ['$title', '$path$file', '$indexHash', '$indexHash'],\n";
      }
    }
  }
  fclose($f);
}

toc($pagesPath, '');

echo "};\n";
?>
</script>
</head>
<body>
<?php if ($isIndex): ?>
  <header>
    <span id="header-left"></span>
    <span id="banner"></span>
    <span id="nav"><a id="nav"></a></span>
  </header>

  <main>
    <nav id="nav">
      <menu></menu>
    </nav>
    <article></article>
  </main>

<?php else: ?>
<pre>
<?php
  $pos = -1;
  for (;;) {
    $pos = strpos($pagePath, '/', $pos+1);
    if (false === $pos)
      break;
    $prolog = @file_get_contents($docRoot.substr($pagePath,0,$pos+1).'prolog');
    if ($prolog)  
      echo $prolog."\n";
  }
?>
<?= htmlentities(@file_get_contents($docRoot.$pagePath.$pageFile)); ?>

----
{prev.left Back: } {next.right Next: }
</pre>
<?php endif; ?>
</body>
<script charset="utf-8">
(function () {
  try {
    eval('let arrow = () => 1');
  } catch (err) {
    document.querySelector('article').innerHTML =
      '<br/><h2>These pages require a newer version of JavaScript. ' +
      'Please use a modern web browser.</h2>';
    return;
  }
  Object.keys(cm_book.toc).forEach(function (ln, index) {
    cm_book.toc[ln].push(index);
  });

<?php if ($isIndex): ?>
  var article = document.querySelector('article');
  var iframe = document.createElement('iframe'); iframe.id = 'article';
  article.parentElement.replaceChild(iframe, article);
  cm_book.loadScript('js/cm_index.js');
<?php else: ?>
  cm_book.loadScript('js/cm.js',
    function() { cm_book.loadScript('js/page.js'); });
<?php endif; ?>
}());
</script>
</html>

