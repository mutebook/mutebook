// to be used in index.html (book template)

(function () {
  /* global cm_book:false */
  const book = cm_book;

  // complete the document
  document.title = book.conf.title;
  document.querySelector('#banner').innerHTML = book.conf.banner;

  // sliding nav
  const nav = document.querySelector('nav#nav'),
        navCs = nav.classList;
  const clsIn = 'slideIn';
  document.querySelector('a#nav').onclick = () => navCs.toggle(clsIn);

  // menu
  const menu = nav.querySelector('menu');
  let activeMenuKey = null;

  // article frame
  const iframe = document.querySelector('iframe#article');

  // select menu item and fetch the article
  const selTocItem = function (indexOrKey, anchor) {
    navCs.remove(clsIn);
    const key = book.tocKey(indexOrKey);
    if (!key)
      return false;

    const clsActive = 'active';
    Object.keys(book.toc).forEach((key) => {
      const t = book.toc[key];
    });
    if (activeMenuKey)
      book.toc[activeMenuKey][4].classList.remove(clsActive);
    book.toc[activeMenuKey = key][4].classList.add(clsActive);

    iframe.src = book.resolveSrc(key) + anchor;
    return true;
  };

  // construct menu
  Object.keys(book.toc).forEach((key) => {
    const t = book.toc[key];
    const [lvl, title] = t;
    const cnt = lvl % 100, level = (lvl - cnt) / 100;

    const a = document.createElement('a');
    a.addEventListener('click', () => selTocItem(key, ''));

    const mi = document.createElement('menuitem');
    mi.innerHTML = title;
    mi.classList.add(`level${level}`);
    if (!cnt)
      mi.classList.add(`cnt0`);

    menu.appendChild(a).appendChild(mi);
    t.push(mi);
  });

  // communication from the article frame
  window.onmessage = (msg) => {
    try {
      const [tag, v1, v2] = msg.data;
      if ('goto' === tag && !selTocItem(v1, v2))
        window.location = v1 + v2; // not found in toc
    } catch (err) {
      // not sure if try/catch is needed
    }
  };

  // and initialize
  selTocItem(0, '');
}());

// eof
