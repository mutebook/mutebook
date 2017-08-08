<?php
chdir(dirname(__FILE__));
require('php/conf.php');

$isLocal = 'localhost' == $_SERVER['SERVER_NAME'];
$isDebug = $isLocal;

// $pagePath: relative path from index.php
// $pageFile: plain name

if ($isFrame = !($pg = @$_REQUEST['pg'])) {
  $pagePath = $pageFile = '';
} else {
  // is page
  if (false === ($pos = strrpos($pg, '/')))
    $pos = -1;

  ++$pos;
  $pagePath = substr($pg, 0, $pos); // '' or path
  $pageFile = substr($pg, $pos);    // plain name
}

?>
<!DOCTYPE html><html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="assets/icon.ico">
<link rel="stylesheet" href="assets/main.css">
<meta charset="utf-8">
<script charset="utf-8">
<?php require('conf.js') ?>
<?php require('php/compile_toc.php') ?>
<?php @require(TOC.'$') ?>

var cm_book = {
  conf: conf,
  toc: toc,

  pagePath: '<?=addslashes($pagePath)?>',
  pageFile: '<?=addslashes($pageFile)?>',

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
?>
</script>
</head>
<body>
<?php if ($isFrame) : ?>
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
    $prolog = @file_get_contents(substr($pagePath,0,$pos+1).'prolog');
    if ($prolog)
      echo $prolog."\n";
  }
?>
<?= htmlentities(@file_get_contents($pagePath.$pageFile)); ?>

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

<?php if ($isFrame): ?>
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

