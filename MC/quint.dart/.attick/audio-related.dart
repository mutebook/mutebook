/*
_fixData(typed_data.ByteBuffer buf) { // Firefox #$%#$%
  var int2list = (int v) => listN(4,(i) { var res = v % 256; v = v ~/ 256; return res; });
  var list2int = (List<int> l) {
    var res = 0; l.reversed.forEach((v) {
      res *= 256; res += v;
    });
    return res;
  };

  var pos = 0, lgt = buf.lengthInBytes, parts = [];

  var header = () => new String.fromCharCodes(new typed_data.Uint8List.view(buf,pos,4));
  var length = () => list2int(new typed_data.Uint8List.view(buf, pos, 4));

  if ('RIFF'!=header())   return null; pos += 4;
  if (lgt != length()+8)  return null; pos += 4;
  if ('WAVE' != header()) return null; pos += 4;

  do {
    var p = pos, h = header();
    pos += 4;
    num l = length();
    pos += 4 + l;
    var toCopy = 8 + l;
    if ('fmt ' == h) toCopy = math.min(toCopy, 24);
    if ('JUNK' != h) parts.add([p,toCopy]);  //
  } while (pos < lgt);

  var lCopy = sumList(parts,(j,i) => j[1]) + 12;

  var res = new typed_data.Uint8List(lCopy), resPos = 0;
  var copy = (List src) => src.forEach((e) => res[resPos++] = e);
  var slc = (int p, int l) => new typed_data.Uint8List.view(buf,p,l);

  copy(slc(0,4)); // RIFF
  copy(int2list(lCopy));
  copy(slc(8,4)); // WAVE

  print([lCopy,parts]);
  pos = 12; parts.forEach((j) {
    print([resPos,j]);
    copy(slc(j[0],j[1]));
  });

  print(99);
  return res.buffer;
}

*/
