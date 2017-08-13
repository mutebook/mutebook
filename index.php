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

  goto: function (ln, anchor) {
    const ev = window.event;
    if (ev.ctrlKey || ev.metaKey)
      return true; // follow href in another tab
    top.postMessage(['goto', ln, anchor], '*');
    return false;
  },

  tocTxLink: function (idx) { // TOC move to somewhere
    try {
      var lst = this.toc.lst[idx];
      return [lst[2], lst[0]];
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
<?php endif ?>
}());
</script>
<?php if (!$isFrame && !$isDebug && defined('SC_PROJECT')): ?>
<script>
var sc_project = <?=SC_PROJECT?>, sc_invisible = 1, sc_security = '<?=SC_SECURITY?>';
</script>
<script src="<?= (HTTPS ? 'https://secure.' : 'http://www.') . 'statcounter.com/counter/counter.js' ?>"></script>
<?php endif ?>
</html>

