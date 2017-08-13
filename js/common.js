function loadCSS (href) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  return link;
};

function loadScript (src, onLoad) {
  var script = document.createElement('script');
  if (onLoad)
    script.onload = onLoad;
  script.src = src;
  script.charset = 'utf-8';
  (document.body || document.head).appendChild(script);
  return script;
};

function loadScripts (srcs) {
  if (srcs.length)
    loadScript(srcs.shift(),
      function() { loadScripts(srcs); });
};

// eof