// adapted from https://github.com/dbergey/Reloadr

let _watch_timeout  = 3333;
let _watch_loadTime = Date.parse(new Date());
let _watch_url      = '/.dev/.watch.php?'+ _watch_files.join(',');

function _watch_poll()	{
  let req = new XMLHttpRequest();
  req.open("GET", _watch_url);
  req.onload = function (e) {
    if (200 == req.status &&
        _watch_loadTime < Date.parse(req.getResponseHeader('Last-Modified')))
      location.reload();
    else
      setTimeout(function() { _watch_poll() }, _watch_timeout);
  };
  req.send();
}

_watch_poll();

// eof
