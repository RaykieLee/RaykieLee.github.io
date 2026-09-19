'use strict';

hexo.extend.filter.register('before_generate', function () {
  const translations = hexo.theme.i18n.get('zh-CN');
  const english = hexo.theme.i18n.get('en');

  for (const key of Object.keys(english)) {
    if (key.startsWith('search.')) translations[key] = english[key];
  }

  hexo.theme.i18n.set('zh-CN', translations);
});
