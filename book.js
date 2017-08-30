var book = {
  conf: {
    title:  'Mutebook',
    banner: 'Mutebook',
  },

  pageRoot: 'pg/',
  pagePath: cm_pagePath, pageFile: cm_pageFile,
};

if (cm_.file.endsWith('.html')) // static
  book.pageFile = cm_.file;

// eof
