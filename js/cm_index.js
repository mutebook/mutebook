// to be used in index.html (book template)

(function () {
  /* global book:false */
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
  const selTocItem = function (id, anchor = '') { // TOC
    navCs.remove(clsIn);
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
        t = book.toc[t[2]]; // TOC
      }
    }

    activeMenuKey = id;
    // open
    let toc = book.toc;
    let idx = toc.ids[activeMenuKey];
    toc.mi[idx].classList.add(clsActive);
    while (null !== idx) {
      let div = toc.div[idx];
      if (div) div.classList.add(clsOpen);
      toc.mi[idx].classList.add(clsOpen);
      idx = toc.pnt[idx];
      if (null!==idx && null!==toc.pnt[idx])
        toc.mi[idx].classList.add(clsActivePath);
    }

    iframe.src = book.resolveSrc(id) + anchor;
    return true;
  };

  const gotogoto /*TODO consolidate with cm.goto */ = (ln, anchor) => {
    const ev = window.event;
    if (ev.ctrlKey || ev.metaKey)
      return true; // follow href in another tab
    top.postMessage(['goto', ln, anchor], '*');
    return false;
  };

  // construct menu
  let toc = book.toc;
  toc.mi = {};
  toc.div = {};
  let menuIndex = 0, menuKeys = Object.keys(toc.ids);
  const constructMenu = function (parentElem, currentIndex) {
    while (menuIndex < menuKeys.length) {
      const id = menuKeys[menuIndex];
      const index = toc.ids[id];
      const [id_, file, title] = toc.lst[index];
      const thisSection = toc.ind[index];
      const parentSection = toc.pnt[index];

      if (thisSection != currentIndex && parentSection != currentIndex)
        break;

      ++menuIndex;
      const arrow = document.createElement('a');
      arrow.classList.add('arrow');
      const a = document.createElement('a');
      a.href = '?pg=' + id;
      a.addEventListener('click', () => selTocItem(id));
      a.onclick = () => { return gotogoto(id, ''); };
      const mi = document.createElement('menuitem');
      a.innerHTML = title;
      const miElem = parentElem.appendChild(mi);
      miElem.appendChild(arrow);
      miElem.appendChild(a);
      toc.mi[index] = mi;

      if (thisSection === currentIndex) {
        toc.div[index] = null;
        continue;
      }

      mi.classList.add('section');
      const div = document.createElement('div');
      parentElem.appendChild(div);
      arrow.addEventListener('click', () => {
        mi.classList.toggle('open');
        div.classList.toggle('open');
      });

      toc.div[index] = div;
      constructMenu(div, thisSection);
    }
  };

  constructMenu(menu, 0);

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
  selTocItem(book.toc.lst[0][0]);
}());

// eof
