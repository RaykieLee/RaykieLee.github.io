'use strict';

hexo.extend.filter.register('after_render:html', function (html) {
  const live2d = [
    '<div id="rembox">',
    '  <div id="landlord" style="display:block !important">',
    '    <div class="message" style="opacity:0"></div>',
    '    <canvas id="live2d" width="500" height="560" class="live2d"></canvas>',
    '    <input name="live_talk" id="live_talk" value="1" type="hidden">',
    '    <div class="live_ico_box"><div id="hideButton"></div></div>',
    '  </div>',
    '  <div id="open_live2d">召唤蕾姆</div>',
    '</div>',
    '<script>window.message_Path = "/live2d/"; window.talkAPI = "";</script>',
    '<script src="/js/vendor/jquery.min.js"></script>',
    '<script src="/live2d/js/live2d.js"></script>',
    '<script src="/live2d/js/message.js"></script>'
  ].join('');

  return html.replace(/<\/body>/i, live2d + '</body>');
});
