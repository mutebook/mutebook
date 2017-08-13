<?php
chdir(dirname(__FILE__));
require('php/conf.php');

// $pagePath: relative path from index.php
// $pageFile: plain name

if ($isFrame = !($pg = @$_REQUEST['pg'])) {
  // no 'pg' request, this is the navigation frame
  $pagePath = $pageFile = '';
} else {
  // this is a single page
  if (false === ($pos = strrpos($pg, '/')))
    $pos = -1;
  ++$pos;
  $pagePath = substr($pg, 0, $pos); // '' or path
  $pageFile = substr($pg, $pos);    // plain name
}

// precompile toc (if _toc sources modified)
if ($isFrame)
  require('php/compile_toc.php');

?>
<!DOCTYPE html><html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="assets/icon.ico">
<link rel="stylesheet" href="assets/main.css">
<meta charset="utf-8">
<script charset="utf-8" src ="js/common.js"></script>
<script charset="utf-8">
var book = {
  conf: {
    title:  '<?=addslashes(TITLE)?>',
    banner: '<?=addslashes(BANNER)?>',
  },
  toc: <?php @require(TOC.'$'); // precompiled toc ?>,

  pagePath: '<?=addslashes($pagePath)?>',
  pageFile: '<?=addslashes($pageFile)?>',

  resolveLink: function (ln) { // TOC move to cm.js
    if (0 <= ln.indexOf('://'))
      return ln;
    try {
      ln = '?pg=' + this.toc.lst[this.toc.ids[ln]][1]; // TODO hack // TOC
    } catch (err) {
      ln = ln.startsWith('/') ? ln : book.pagePath + ln;
    }

    return ln;
  },

  resolveDirLink: function (ln) { // TOC move to cm.js
    ln = this.toc.lst[this.toc.ids[ln]][1]; // TOC
    return ln.substr(0, ln.lastIndexOf('/'));
  },

  resolveSrc: function (key) { // TOC move to cm_index.js
    try {
      var src = '/index.php?pg=' + this.toc.lst[this.toc.ids[key]][1]; // TOC
    } catch (err) {
      return '';
    }
    return src;
  },

  tocEntry: function (ln) { // TOC move to page.js
    return this.toc.lst[this.toc.ids[ln]];
  },

  tocTxLink: function (index) { // TOC move to somewhere
    try {
      var link = this.toc.lst[index][0], tx = this.toc.lst[index][2]; // TOC
      return [tx, link];
    } catch (err) {
      return ['', ''];
    }
  },
};
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

<?php else: // is page ?>
<pre>
<?php
  // fetch prologs + page text
  $pos = -1;
  for (;;) {
    if (false === ($pos = strpos($pagePath, '/', $pos+1)))
      break;
    if (($prolog = @file_get_contents(substr($pagePath,0,$pos+1).'prolog')))
      echo htmlentities($prolog)."\n";
  }
  echo htmlentities(@file_get_contents($pagePath.$pageFile));
?>

----
{prev.left Back: } {next.right Next: }
</pre>
<?php endif ?>
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
<?php if ($isFrame): ?>
  var article = document.querySelector('article');
  var iframe = document.createElement('iframe'); iframe.id = 'article';
  article.parentElement.replaceChild(iframe, article);
  loadScript('js/cm_index.js');
<?php else: // is page ?>
  loadScripts(['js/cm.js', 'js/page.js']);
  <?php if (defined('SC_PROJECT')): ?>
var sc_project = <?=SC_PROJECT?>, sc_invisible = 1, sc_security = <?=SC_SECURITY?>;
loadScript(
  ('https:' == document.location.protocol ? 'https://secure.' : 'http://www.') +
  'statcounter.com/counter/counter.js');
  <?php endif; ?>
<?php endif; ?>
}());
</script>
</html>

