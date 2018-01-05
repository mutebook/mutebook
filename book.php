<?php
$book = [
  'title'       => 'Mutebook',
  'banner'      => 'Mutebook',

  'description' => 'Online interactive textbook to learn and teach music technology and music production.',
  'keywords'    => 'Music technology, online teaching, music production, acoustics, electronics, digital audio',
  'author'      => 'Thilo Schaller & Jan Burle',

  'pages'       => 'pages/',
];

if ($_SERVER['SERVER_PORT'] < 8000 /* not debug */) {
  // piwik tracking

  $book['page_end'] = <<<HEREDOC
<script>
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://mutebook.me/piwik/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
HEREDOC;
}

// eof
