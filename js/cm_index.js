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
  let activeMenuId = null;

  // article frame
  const iframe = document.querySelector('iframe#article');

  const indexSrc = function (id) {
    return 'index.php?pg=' + book.toc.lst[book.toc.ids[id]][1]; // TOC
  };

  // select menu item and fetch the article
  const selTocItem = function (id, anchor = '') {
    navCs.remove(clsIn);
    const clsActive = 'active', clsActivePath = 'activepath', clsOpen = 'open';
    if (activeMenuId) { // close
      let idx = book.toc.ids[activeMenuId];
      while (null !== idx) {
        let div = book.toc.div[idx];
        if (div) div.classList.remove(clsOpen);
        const miCls = book.toc.mi[idx].classList;
        miCls.remove(clsActive);
        miCls.remove(clsActivePath);
        miCls.remove(clsOpen);
        idx = book.toc.pnt[idx];
      }
    }

    activeMenuId = id;
    // open
    let toc = book.toc;
    let idx = toc.ids[activeMenuId];
    toc.mi[idx].classList.add(clsActive);
    while (null !== idx) {
      let div = toc.div[idx];
      if (div) div.classList.add(clsOpen);
      toc.mi[idx].classList.add(clsOpen);
      idx = toc.pnt[idx];
      if (null!==idx && null!==toc.pnt[idx])
        toc.mi[idx].classList.add(clsActivePath);
    }

    iframe.src = indexSrc(id) + anchor;
    return true;
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
      a.href = indexSrc(id);
      a.onclick = () => { return book.goto(id, ''); };
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
