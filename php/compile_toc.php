<?php
require_once dirname(__FILE__).'/conf.php';

class compileToc {
  private static function error ($msg) {
    throw new Exception($msg);
  }

  private static function splitLine ($l, $n) {
    return array_pad(array_map('trim', explode(';', $l)), $n, '');
  }

  private static function tocChangeTime ($path) {
    $time = 0;
    if ($d = @opendir($path)) {
      while (false !== ($f = readdir($d))) {
        if ('.' === $f[0])  // '.', '..''
          continue;
        if (is_dir(($pf = $path.$f)))
          $time = max($time, self::tocChangeTime($pf.'/'));
        else if(TOC === $f)
          $time = max($time, filectime($pf));
      }
    }
    return $time;
  }

  private $haveIds = [];
  private function checkUniqueId ($id) {
    if (@$this->haveIds[$id])
      self::error('duplicate id: ' . $id);
    $this->haveIds[$id] = true;
    return $id;
  }

  /* toc structure:
    lst:  #   -> [id, file, title]
    ids:  id  -> #
    ind:  #   -> # (to its index.cm; index.cm to itself)
    pnt:  #   -> # (to index.cm of parent dir, top -> null)
    fil:  file-> #
  */

  private $lst = '', $ids = '', $ind = '', $pnt = '', $fil = '';
  private $i = -1;    // count'em
  private $pfs = [];  // to generate prev / next

  public function traverse ($pntNo, $path) {
    if (!($f = @fopen($path.TOC, 'r')))
      self::error('bad toc path: ' . $path);

    // index toc entry
    list($idPrefix, $title) = self::splitLine(($l = fgets($f)), 2);
    if (!$idPrefix || !$title)
      self::error('bad toc line: ' . $l);

    $idPrefix .= ':';
    $indexId = self::checkUniqueId($idPrefix.INDEX);
    $file = INDEX.CM;

    $indNo = ++$this->i;

    $pf = $path.$file;
    $this->lst .= "[$indexId,$pf,$title],";
    $this->ids .= "'$indexId'=>$this->i,";
    $this->ind .= "$this->i=>$indNo,";
    $this->pnt .= "$this->i=>$pntNo,";
    $this->fil .= "'$pf'=>$this->i,";
    $this->pfs []= $pf;

    while (!feof($f)) {
      if ($l = trim(fgets($f))) {
        if ('#' == $l[0]) // comment
          continue;

        list($idOrSub, $file, $title) = self::splitLine($l, 3);
        if ($idOrSub && !$file && !$title) {
          if ('/' === substr($idOrSub, -1)) {
            $this->traverse($indNo, $path.$idOrSub);
            continue;
          }
        } else if ($idOrSub && $file && $title) {
          ++$this->i;
          $pageId = self::checkUniqueId($idPrefix.$idOrSub);
          $pf = $path.$file;
          $this->lst .= "[$pageId,$pf,$title],";
          $this->ids .= "'$pageId'=>$this->i,";
          $this->ind .= "$this->i=>$indNo,";
          $this->pnt .= "$this->i=>$pntNo,";
          $this->fil .= "'$pf'=>$this->i,";
          $this->pfs []= $pf;
          continue;
        }

        self::error('bad toc line: ' . $l);
      }
    }
    fclose($f);
  }

  public function compile () {
    if (self::tocChangeTime(PAGES) <= @filectime(TOC.'$'))
      return; // it is current

    try {
      $this->traverse(null, PAGES);
      file_put_contents(TOC.'$',
        "var toc={lst:[$this->lst],ids:{{$this->ids}},ind:{{$this->ind}},pnt:{{$this->pnt}},fil:{{$this->fil}}};",
        LOCK_EX);

      foreach ($this->pfs as $i => $pf) {
        $prev = @$this->pfs[$i-1]; $next = @$this->pfs[$i+1];
        file_put_contents($pf.'$',
        "var prevNext={prev:'$prev',next:'$next'}",
        LOCK_EX);
      }
    } catch (Exception $e) {
      error_log(' ** ' . $e->getMessage() . ' **');
    }
  }
}

(new compileToc)->compile();

// eof