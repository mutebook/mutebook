<?php

const PAGES = 'pg/';    // where pages are
const TOC   = '_toc';   // source TOC filesoc

const INDEX = 'index';  // index files
const CM    = '.cm';    // .cm file suffix

const TOC_JS = '$toc.js'; // pre-processed t

(function () {

function warn($msg) {
  error_log(' ** '.$msg.' **');
}

function splitLine($l, $n) {
  return array_pad(array_map('trim', explode(';', $l)), $n, '');
}

// last TOC modification
function tocTime ($path) {
  $time = 0;
  if ($d = @opendir($path)) {
    while (false !== ($f = readdir($d))) {
      if ('.' === $f[0])  // ., ..
        continue;
      if (is_dir(($pf = $path.$f)))
        $time = max($time, toctime($pf.'/'));
      else if(TOC === $f)
        $time = max($time, filectime($pf));
    }
  }
  return $time;
}

// preprocessed toc
if (tocTime(PAGES) <= @filectime(TOC_JS))
  return; // it is current

// ensure unique ids
$haveIds = [];
function checkId($id) {
  global $haveIds;
  if (@$haveIds[$id])
    warn('duplicate id: '.$id);
  else
    $haveIds[$id] = true;
  return $id;
}

class compileToc {
  private $list = '', $ids = '', $ind = '', $parent = '', $file = '', $i = -1;

  public function compile($parNo, $path) {
    if (!($f = @fopen($path.TOC, 'r'))) {
      warn('bad toc path: '.$path);
      return;
    }

    // index
    list($idPrefix, $title) = splitLine(($l = fgets($f)), 2);
    if (!$idPrefix || !$title) {
      warn('bad toc line: '.$l);
      return;
    }

    $idPrefix .= ':';
    $indexId = checkId($idPrefix.INDEX);
    $file = INDEX.CM;

    $indNo = ++$this->i;

    $this->list .= "[$indexId,$path$file,$title],";
    $this->ids  .= "'$indexId'=>$this->i,";
    $this->ind  .= "$this->i=>$indNo,";
    $this->parent .= "$this->i=>$parNo,";
    $this->file .= "'$path$file'=>$this->i,";

    while (!feof($f)) {
      if ($l = trim(fgets($f))) {
        if ('#' == $l[0])
          continue;
        list($idOrSub, $file, $title) = splitLine($l, 3);
        if ($idOrSub && !$file && !$title) {
          if ('/' === substr($idOrSub, -1)) {
            $this->compile($indNo, $path.$idOrSub);
            continue;
          }
        } else if ($idOrSub && $file && $title) {
          ++$this->i;
          $pageId = checkId($idPrefix.$idOrSub);
          $this->list .= "[$pageId,$path$file,$title],";
          $this->ids  .= "'$pageId'=>$this->i,";
          $this->ind  .= "$this->i=>$indNo,";
          $this->parent .= "$this->i=>$parNo,";
          $this->file .= "'$path$file'=>$this->i,";
          continue;
        }
        warn('bad toc line: '.$l);
      }
    }
    fclose($f);
  }

  public function output() {
    file_put_contents(TOC_JS,
      "var toc={list:[$this->list],ids:{{$this->ids}},ind:{{$this->ind}},parent:{{$this->parent}},file:{{$this->file}}};",
      LOCK_EX);
  }
}

$toc = new compileToc;
$toc->compile(null, PAGES);
$toc->output();

})();
// eof