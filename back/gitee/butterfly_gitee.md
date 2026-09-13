---
title: 'butterfly '
date: 2020-02-03 13:01:58
tags: hexo
---
一个安装butterfly主题过程记录  
<!-- more -->
## 主題安裝和升級
安裝  
查看 npm 安装的模块
查看当前项目的依赖模块如下：
```npm ls --depth 0```


查看全局依赖模块命令如下：

```npm ls -g --depth 0```   
在你的博客根目录

``git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/Butterfly``
修改站點配置文件_config.yml，把theme（主題）改為Butterfly

## 添加 valine 评论
[官方文档](https://valine.js.org/quickstart.html)
安装 
```
npm install valine --save
```
配置
```
valine:
  enable: ture # if you want use valine,please set this value is true
  appId:  hxN4EMnnWWFNeyk4xbNxQJT7-gzGzoHsz # leancloud application app id
  appKey: lewYKS5k1rb7D5sVgI4QeTAx # leancloud application app key
  notify: false # valine mail notify (true/false) Deprecated in v1.4.0+
  verify: false # valine verify code (true/false) Deprecated in v1.4.0+
  pageSize: 10 # comment list page size
  avatar: monsterid # gravatar style https://valine.js.org/#/avatar
  lang: zh-cn # i18n: zh-CN/zh-TW/en/ja
  placeholder: Please leave your footprints # valine comment input placeholder(like: Please leave your footprints )
  guest_info: nick,mail,link #valine comment header info
  recordIP: false # Record reviewer IP
  serverURLs: # This configuration is suitable for domestic custom domain name users, overseas version will be automatically detected (no need to manually fill in)
  emojiCDN: //i0.hdslb.com/bfs/emote/ # emoji CDN
  enableQQ: false # enable the Nickname box to automatically get QQ Nickname and QQ Avatar
  requiredFields: nick,mail # required fields nick/mail/link
  bg: # valine background
  count: false # dispaly comment count in top_img
```
同時在 Hexo 下的 source/_data/ 創建一個 json 文件 valine.json
```json
{ 
"tv_doge": "6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png",
"tv_親親": "a8111ad55953ef5e3be3327ef94eb4a39d535d06.png",
"tv_偷笑": "bb690d4107620f1c15cff29509db529a73aee261.png",
"tv_再見": "180129b8ea851044ce71caf55cc8ce44bd4a4fc8.png",
"tv_冷漠": "b9cbc755c2b3ee43be07ca13de84e5b699a3f101.png",
"tv_發怒": "34ba3cd204d5b05fec70ce08fa9fa0dd612409ff.png",
"tv_發財": "34db290afd2963723c6eb3c4560667db7253a21a.png",
"tv_可愛": "9e55fd9b500ac4b96613539f1ce2f9499e314ed9.png",
"tv_吐血": "09dd16a7aa59b77baa1155d47484409624470c77.png",
"tv_呆": "fe1179ebaa191569b0d31cecafe7a2cd1c951c9d.png",
"tv_嘔吐": "9f996894a39e282ccf5e66856af49483f81870f3.png",
"tv_困": "241ee304e44c0af029adceb294399391e4737ef2.png",
"tv_壞笑": "1f0b87f731a671079842116e0991c91c2c88645a.png",
"tv_大佬": "093c1e2c490161aca397afc45573c877cdead616.png",
"tv_大哭": "23269aeb35f99daee28dda129676f6e9ea87934f.png",
"tv_委屈": "d04dba7b5465779e9755d2ab6f0a897b9b33bb77.png",
"tv_害羞": "a37683fb5642fa3ddfc7f4e5525fd13e42a2bdb1.png",
"tv_尷尬": "7cfa62dafc59798a3d3fb262d421eeeff166cfa4.png",
"tv_微笑": "70dc5c7b56f93eb61bddba11e28fb1d18fddcd4c.png",
"tv_思考": "90cf159733e558137ed20aa04d09964436f618a1.png",
"tv_驚嚇": "0d15c7e2ee58e935adc6a7193ee042388adc22af.png"
}
```


