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
  const selTocItem = function (indexOrKey, anchor = '') {
    navCs.remove(clsIn);
    const key = book.tocKey(indexOrKey);
    if (!key)
      return false;

    const clsActive = 'active', clsActivePath = 'activepath', clsOpen = 'open';
    if (activeMenuKey) { // close
      let t = book.toc[activeMenuKey];
      while (t) {
        let div = t[6];
        if (div) div.classList.remove(clsOpen);
        const miCls = t[5].classList;
        miCls.remove(clsActive);
        miCls.remove(clsActivePath);
        miCls.remove(clsOpen);
        t = book.toc[t[2]];
      }
    }

    activeMenuKey = key;
    // open
    let t = book.toc[activeMenuKey];
    t[5].classList.add(clsActive);
    while (t) {
      let div = t[6];
      if (div) div.classList.add(clsOpen);
      t[5].classList.add(clsOpen);
      t = book.toc[t[2]];
      if (t && t[2]) t[5].classList.add(clsActivePath);
    }

    iframe.src = book.resolveSrc(key) + anchor;
    return true;
  };

  // construct menu
  let menuKeys = Object.keys(book.toc);
  let menuIndex = 0;
  const constructMenu = function (parentElem, currentSection) {
    while (menuIndex < menuKeys.length) {
      const key = menuKeys[menuIndex];
      const t = book.toc[key];
      const [title, file, parentSection, thisSection] = t;

      if (thisSection != currentSection && parentSection != currentSection)
        break;

      ++menuIndex;
      const a = document.createElement('a');
      a.addEventListener('click', () => selTocItem(key));
      const mi = document.createElement('menuitem');
      mi.innerHTML = title;
      parentElem.appendChild(a).appendChild(mi);
      t.push(mi);

      if (thisSection === currentSection) {
        t.push(null);
        continue;
      }

      mi.classList.add('section');
      const div = document.createElement('div');
      parentElem.appendChild(div);
      t.push(div);
      constructMenu(div, thisSection);
    }
  };

  constructMenu(menu, 'index');

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
  selTocItem(0);
}());

// eof
