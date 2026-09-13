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

---

发现了一个新的的[valine表情包仓库](https://github.com/GamerNoTitle/Valine-Magic)

原本配置修改一下下~~

valine下cdn改为

```yaml
  emojiCDN: https://cdn.jsdelivr.net/gh/GamerNoTitle/ValineCDN@master/ # emoji CDN
```

可以在仓库中选择其他的 cdn 与其他表情包

![image-20210829211449327](https://gitee.com/xiaozhuo_Q/images/raw/master/blog/image-20210829211449327.png)

新的 valine.json

```json
{
  "bilibilitv2": "bilibilitv/[tv_doge].png",
  "bilibilitv3": "bilibilitv/[tv_亲亲].png",
  "bilibilitv4": "bilibilitv/[tv_偷笑].png",
  "bilibilitv5": "bilibilitv/[tv_再见].png",
  "bilibilitv6": "bilibilitv/[tv_冷漠].png",
  "bilibilitv7": "bilibilitv/[tv_发怒].png",
  "bilibilitv8": "bilibilitv/[tv_发财].png",
  "bilibilitv9": "bilibilitv/[tv_可爱].png",
  "bilibilitv10": "bilibilitv/[tv_吐血].png",
  "bilibilitv11": "bilibilitv/[tv_呆].png",
  "bilibilitv12": "bilibilitv/[tv_呕吐].png",
  "bilibilitv13": "bilibilitv/[tv_困].png",
  "bilibilitv14": "bilibilitv/[tv_坏笑].png",
  "bilibilitv15": "bilibilitv/[tv_大佬].png",
  "bilibilitv16": "bilibilitv/[tv_大哭].png",
  "bilibilitv17": "bilibilitv/[tv_委屈].png",
  "bilibilitv18": "bilibilitv/[tv_害羞].png",
  "bilibilitv19": "bilibilitv/[tv_尴尬].png",
  "bilibilitv20": "bilibilitv/[tv_微笑].png",
  "bilibilitv21": "bilibilitv/[tv_思考].png",
  "bilibilitv22": "bilibilitv/[tv_惊吓].png",
  "bilibilitv23": "bilibilitv/[tv_打脸].png",
  "bilibilitv24": "bilibilitv/[tv_抓狂].png",
  "bilibilitv25": "bilibilitv/[tv_抠鼻].png",
  "bilibilitv26": "bilibilitv/[tv_斜眼笑].png",
  "bilibilitv27": "bilibilitv/[tv_无奈].png",
  "bilibilitv28": "bilibilitv/[tv_晕].png",
  "bilibilitv29": "bilibilitv/[tv_流汗].png",
  "bilibilitv30": "bilibilitv/[tv_流泪].png",
  "bilibilitv31": "bilibilitv/[tv_流鼻血].png",
  "bilibilitv32": "bilibilitv/[tv_点赞].png",
  "bilibilitv33": "bilibilitv/[tv_生气].png",
  "bilibilitv34": "bilibilitv/[tv_生病].png",
  "bilibilitv35": "bilibilitv/[tv_疑问].png",
  "bilibilitv36": "bilibilitv/[tv_白眼].png",
  "bilibilitv37": "bilibilitv/[tv_皱眉].png",
  "bilibilitv38": "bilibilitv/[tv_目瞪口呆].png",
  "bilibilitv39": "bilibilitv/[tv_睡着].png",
  "bilibilitv40": "bilibilitv/[tv_笑哭].png",
  "bilibilitv41": "bilibilitv/[tv_腼腆].png",
  "bilibilitv42": "bilibilitv/[tv_色].png",
  "bilibilitv43": "bilibilitv/[tv_调侃].png",
  "bilibilitv44": "bilibilitv/[tv_调皮].png",
  "bilibilitv45": "bilibilitv/[tv_鄙视].png",
  "bilibilitv46": "bilibilitv/[tv_闭嘴].png",
  "bilibilitv47": "bilibilitv/[tv_难过].png",
  "bilibilitv48": "bilibilitv/[tv_馋].png",
  "bilibilitv49": "bilibilitv/[tv_鬼脸].png",
  "bilibilitv50": "bilibilitv/[tv_黑人问号].png",
  "bilibilitv51": "bilibilitv/[tv_鼓掌].png",
  "bilibili22332": "bilibili2233/[2233娘_卖萌].png",
  "bilibili22333": "bilibili2233/[2233娘_吃惊].png",
  "bilibili22334": "bilibili2233/[2233娘_吐魂].png",
  "bilibili22335": "bilibili2233/[2233娘_喝水].png",
  "bilibili22336": "bilibili2233/[2233娘_困惑].png",
  "bilibili22337": "bilibili2233/[2233娘_大哭].png",
  "bilibili22338": "bilibili2233/[2233娘_大笑].png",
  "bilibili22339": "bilibili2233/[2233娘_委屈].png",
  "bilibili223310": "bilibili2233/[2233娘_怒].png",
  "bilibili223311": "bilibili2233/[2233娘_无言].png",
  "bilibili223312": "bilibili2233/[2233娘_汗].png",
  "bilibili223313": "bilibili2233/[2233娘_疑问].png",
  "bilibili223314": "bilibili2233/[2233娘_第一].png",
  "bilibili223315": "bilibili2233/[2233娘_耶].png",
  "bilibili223316": "bilibili2233/[2233娘_郁闷].png","Heybox1": "Heybox/expression_cube.png",
  "Heybox2": "Heybox/expression_cube_bingbujiandan.png",
  "Heybox3": "Heybox/expression_cube_bizui.png",
  "Heybox4": "Heybox/expression_cube_cangsang.png",
  "Heybox5": "Heybox/expression_cube_dalian.png",
  "Heybox6": "Heybox/expression_cube_doge.png",
  "Heybox7": "Heybox/expression_cube_gandong.png",
  "Heybox8": "Heybox/expression_cube_guai.png",
  "Heybox9": "Heybox/expression_cube_gugu.png",
  "Heybox10": "Heybox/expression_cube_han.png",
  "Heybox11": "Heybox/expression_cube_hbi.png",
  "Heybox12": "Heybox/expression_cube_heirenwenhao.png",
  "Heybox13": "Heybox/expression_cube_huaji.png",
  "Heybox14": "Heybox/expression_cube_jiayou.png",
  "Heybox15": "Heybox/expression_cube_jingya.png",
  "Heybox16": "Heybox/expression_cube_kaixin.png",
  "Heybox17": "Heybox/expression_cube_ku.png",
  "Heybox18": "Heybox/expression_cube_kun.png",
  "Heybox19": "Heybox/expression_cube_kuqi.png",
  "Heybox20": "Heybox/expression_cube_nu.png",
  "Heybox21": "Heybox/expression_cube_penshui.png",
  "Heybox22": "Heybox/expression_cube_qiliang.png",
  "Heybox23": "Heybox/expression_cube_shengqi.png",
  "Heybox24": "Heybox/expression_cube_shuijiao.png",
  "Heybox25": "Heybox/expression_cube_tanqi.png",
  "Heybox26": "Heybox/expression_cube_tanshou.png",
  "Heybox27": "Heybox/expression_cube_tu.png",
  "Heybox28": "Heybox/expression_cube_wa.png",
  "Heybox29": "Heybox/expression_cube_weiqu.png",
  "Heybox30": "Heybox/expression_cube_weixiao.png",
  "Heybox31": "Heybox/expression_cube_wulianku.png",
  "Heybox32": "Heybox/expression_cube_xia.png",
  "Heybox33": "Heybox/expression_cube_xiaocry.png",
  "Heybox34": "Heybox/expression_cube_xihuan.png",
  "Heybox35": "Heybox/expression_cube_xuexi.png",
  "Heybox36": "Heybox/expression_cube_yun.png",
  "Heybox37": "Heybox/expression_cube_zan.png",
  "Heybox38": "Heybox/expression_heyboxgirl.png",
  "Heybox39": "Heybox/expression_heyboxgirl_v2.png",
  "Heybox40": "Heybox/expression_heygirl.png",
  "Heybox41": "Heybox/expression_heygirl_aidao.png",
  "Heybox42": "Heybox/expression_heygirl_baipiaoguai.png",
  "Heybox43": "Heybox/expression_heygirl_chi.png",
  "Heybox44": "Heybox/expression_heygirl_chigua.png",
  "Heybox45": "Heybox/expression_heygirl_eihei.png",
  "Heybox46": "Heybox/expression_heygirl_haha.png",
  "Heybox47": "Heybox/expression_heygirl_haixiu.png",
  "Heybox48": "Heybox/expression_heygirl_henaicha.png",
  "Heybox49": "Heybox/expression_heygirl_huaji.png",
  "Heybox50": "Heybox/expression_heygirl_jing.png",
  "Heybox51": "Heybox/expression_heygirl_jixialai.png",
  "Heybox52": "Heybox/expression_heygirl_kaikele.png",
  "Heybox53": "Heybox/expression_heygirl_ku.png",
  "Heybox54": "Heybox/expression_heygirl_kujiuruhou.png",
  "Heybox55": "Heybox/expression_heygirl_nielian.png",
  "Heybox56": "Heybox/expression_heygirl_qiaokaixin.png",
  "Heybox57": "Heybox/expression_heygirl_qiehua.png",
  "Heybox58": "Heybox/expression_heygirl_rua.png",
  "Heybox59": "Heybox/expression_heygirl_toukan.png",
  "Heybox60": "Heybox/expression_heygirl_tu.png",
  "Heybox61": "Heybox/expression_heygirl_wuyu.png",
  "Heybox62": "Heybox/expression_heygirl_xihuan.png",
  "Heybox63": "Heybox/expression_heygirl_yiwen.png",
  "Heybox64": "Heybox/expression_heygirl_zhe.png",
  "Heybox65": "Heybox/expression_heziji_1.png",
  "Heybox66": "Heybox/expression_heziji_10.png",
  "Heybox67": "Heybox/expression_heziji_11.png",
  "Heybox68": "Heybox/expression_heziji_12.png",
  "Heybox69": "Heybox/expression_heziji_13.png",
  "Heybox70": "Heybox/expression_heziji_14.png",
  "Heybox71": "Heybox/expression_heziji_15.png",
  "Heybox72": "Heybox/expression_heziji_16.png",
  "Heybox73": "Heybox/expression_heziji_17.png",
  "Heybox74": "Heybox/expression_heziji_18.png",
  "Heybox75": "Heybox/expression_heziji_19.png",
  "Heybox76": "Heybox/expression_heziji_2.png",
  "Heybox77": "Heybox/expression_heziji_20.png",
  "Heybox78": "Heybox/expression_heziji_21.png",
  "Heybox79": "Heybox/expression_heziji_22.png",
  "Heybox80": "Heybox/expression_heziji_23.png",
  "Heybox81": "Heybox/expression_heziji_24.png",
  "Heybox82": "Heybox/expression_heziji_25.png",
  "Heybox83": "Heybox/expression_heziji_26.png",
  "Heybox84": "Heybox/expression_heziji_27.png",
  "Heybox85": "Heybox/expression_heziji_28.png",
  "Heybox86": "Heybox/expression_heziji_29.png",
  "Heybox87": "Heybox/expression_heziji_3.png",
  "Heybox88": "Heybox/expression_heziji_30.png",
  "Heybox89": "Heybox/expression_heziji_31.png",
  "Heybox90": "Heybox/expression_heziji_32.png",
  "Heybox91": "Heybox/expression_heziji_4.png",
  "Heybox92": "Heybox/expression_heziji_5.png",
  "Heybox93": "Heybox/expression_heziji_6.png",
  "Heybox94": "Heybox/expression_heziji_7.png",
  "Heybox95": "Heybox/expression_heziji_8.png",
  "Heybox96": "Heybox/expression_heziji_9.png",
  "Sweetie-Bunny1": "Sweetie-Bunny/12311678.png",
  "Sweetie-Bunny2": "Sweetie-Bunny/12311679.png",
  "Sweetie-Bunny3": "Sweetie-Bunny/12311680.png",
  "Sweetie-Bunny4": "Sweetie-Bunny/12311681.png",
  "Sweetie-Bunny5": "Sweetie-Bunny/12311682.png",
  "Sweetie-Bunny6": "Sweetie-Bunny/12311683.png",
  "Sweetie-Bunny7": "Sweetie-Bunny/12311684.png",
  "Sweetie-Bunny8": "Sweetie-Bunny/12311685.png",
  "Sweetie-Bunny9": "Sweetie-Bunny/12311686.png",
  "Sweetie-Bunny10": "Sweetie-Bunny/12311687.png",
  "Sweetie-Bunny11": "Sweetie-Bunny/12311688.png",
  "Sweetie-Bunny12": "Sweetie-Bunny/12311689.png",
  "Sweetie-Bunny13": "Sweetie-Bunny/12311690.png",
  "Sweetie-Bunny14": "Sweetie-Bunny/12311691.png",
  "Sweetie-Bunny15": "Sweetie-Bunny/12311692.png",
  "Sweetie-Bunny16": "Sweetie-Bunny/12311693.png",
  "Sweetie-Bunny17": "Sweetie-Bunny/12311694.png",
  "Sweetie-Bunny18": "Sweetie-Bunny/12311695.png",
  "Sweetie-Bunny19": "Sweetie-Bunny/12311696.png",
  "Sweetie-Bunny20": "Sweetie-Bunny/12311697.png",
  "Sweetie-Bunny21": "Sweetie-Bunny/12311698.png",
  "Sweetie-Bunny22": "Sweetie-Bunny/12311699.png",
  "Sweetie-Bunny23": "Sweetie-Bunny/12311700.png",
  "Sweetie-Bunny24": "Sweetie-Bunny/12311701.png",
  "Sweetie-Bunny25": "Sweetie-Bunny/12311702.png",
  "Sweetie-Bunny26": "Sweetie-Bunny/12311703.png",
  "Sweetie-Bunny27": "Sweetie-Bunny/12311704.png",
  "Sweetie-Bunny28": "Sweetie-Bunny/12311705.png",
  "Sweetie-Bunny29": "Sweetie-Bunny/12311706.png",
  "Sweetie-Bunny30": "Sweetie-Bunny/12311707.png",
  "Sweetie-Bunny31": "Sweetie-Bunny/12311708.png",
  "Sweetie-Bunny32": "Sweetie-Bunny/12311709.png",
  "Sweetie-Bunny33": "Sweetie-Bunny/12311710.png",
  "Sweetie-Bunny34": "Sweetie-Bunny/12311711.png",
  "Sweetie-Bunny35": "Sweetie-Bunny/12311712.png",
  "Sweetie-Bunny36": "Sweetie-Bunny/12311713.png",
  "Sweetie-Bunny37": "Sweetie-Bunny/12311714.png",
  "Sweetie-Bunny38": "Sweetie-Bunny/12311715.png",
  "Sweetie-Bunny39": "Sweetie-Bunny/12311716.png",
  "Sweetie-Bunny40": "Sweetie-Bunny/12311717.png",
  "Snow-Miku1": "Snow-Miku/3583066@2x.png",
  "Snow-Miku2": "Snow-Miku/3583067@2x.png",
  "Snow-Miku3": "Snow-Miku/3583068@2x.png",
  "Snow-Miku4": "Snow-Miku/3583069@2x.png",
  "Snow-Miku5": "Snow-Miku/3583070@2x.png",
  "Snow-Miku6": "Snow-Miku/3583071@2x.png",
  "Snow-Miku7": "Snow-Miku/3583072@2x.png",
  "Snow-Miku8": "Snow-Miku/3583073@2x.png",
  "Snow-Miku9": "Snow-Miku/3583074@2x.png",
  "Snow-Miku10": "Snow-Miku/3583075@2x.png",
  "Snow-Miku11": "Snow-Miku/3583076@2x.png",
  "Snow-Miku12": "Snow-Miku/3583077@2x.png",
  "Snow-Miku13": "Snow-Miku/3583078@2x.png",
  "Snow-Miku14": "Snow-Miku/3583079@2x.png",
  "Snow-Miku15": "Snow-Miku/3583080@2x.png",
  "Snow-Miku16": "Snow-Miku/3583081@2x.png",
  "Snow-Miku17": "Snow-Miku/3583082@2x.png",
  "Snow-Miku18": "Snow-Miku/3583083@2x.png",
  "Snow-Miku19": "Snow-Miku/3583084@2x.png",
  "Snow-Miku20": "Snow-Miku/3583085@2x.png",
  "Snow-Miku21": "Snow-Miku/3583086@2x.png",
  "Snow-Miku22": "Snow-Miku/3583087@2x.png",
  "Snow-Miku23": "Snow-Miku/3583088@2x.png",
  "Snow-Miku24": "Snow-Miku/3583089@2x.png",
  "Snow-Miku25": "Snow-Miku/3583090@2x.png",
  "Snow-Miku26": "Snow-Miku/3583091@2x.png",
  "Snow-Miku27": "Snow-Miku/3583092@2x.png",
  "Snow-Miku28": "Snow-Miku/3583093@2x.png",
  "Snow-Miku29": "Snow-Miku/3583094@2x.png",
  "Snow-Miku30": "Snow-Miku/3583095@2x.png",
  "Snow-Miku31": "Snow-Miku/3583096@2x.png",
  "Snow-Miku32": "Snow-Miku/3583097@2x.png",
  "Snow-Miku33": "Snow-Miku/3583098@2x.png",
  "Snow-Miku34": "Snow-Miku/3583099@2x.png",
  "Snow-Miku35": "Snow-Miku/3583100@2x.png",
  "Snow-Miku36": "Snow-Miku/3583101@2x.png",
  "Snow-Miku37": "Snow-Miku/3583102@2x.png",
  "Snow-Miku38": "Snow-Miku/3583103@2x.png",
  "Snow-Miku39": "Snow-Miku/3583104@2x.png",
  "Snow-Miku40": "Snow-Miku/3583105@2x.png",
  "Mafumafu1": "Mafumafu/199749454.png",
  "Mafumafu2": "Mafumafu/199749455.png",
  "Mafumafu3": "Mafumafu/199749456.png",
  "Mafumafu4": "Mafumafu/199749457.png",
  "Mafumafu5": "Mafumafu/199749458.png",
  "Mafumafu6": "Mafumafu/199749459.png",
  "Mafumafu7": "Mafumafu/199749460.png",
  "Mafumafu8": "Mafumafu/199749461.png",
  "Mafumafu9": "Mafumafu/199749462.png",
  "Mafumafu10": "Mafumafu/199749463.png",
  "Mafumafu11": "Mafumafu/199749464.png",
  "Mafumafu12": "Mafumafu/199749465.png",
  "Mafumafu13": "Mafumafu/199749466.png",
  "Mafumafu14": "Mafumafu/199749467.png",
  "Mafumafu15": "Mafumafu/199749468.png",
  "Mafumafu16": "Mafumafu/199749469.png",
  "Mafumafu17": "Mafumafu/199749470.png",
  "Mafumafu18": "Mafumafu/199749471.png",
  "Mafumafu19": "Mafumafu/199749472.png",
  "Mafumafu20": "Mafumafu/199749473.png",
  "Mafumafu21": "Mafumafu/199749474.png",
  "Mafumafu22": "Mafumafu/199749475.png",
  "Mafumafu23": "Mafumafu/199749476.png",
  "Mafumafu24": "Mafumafu/199749477.png"
}
```

# 更换字体

## 创建font文件夹

在`themes/butterfly/source/`下创建`font`文件夹

将`HarmonyOS_Sans_SC_Regular.ttf`和`JetBrainsMono-Regular.ttf`放进`font`

## 创建css

在`themes/butterfly/source/css/`下创建`font.css`

编辑`font.css`

```
CSS
复制成功@font-face{
    font-family: 'JetBrains Mono';
    font-display: swap;
    src: url('../font/JetBrainsMono-Regular.ttf') format("truetype");
}
@font-face{
    font-family: 'HarmonyOS Sans SC';
    font-display: swap;
    src: url('../font/HarmonyOS_Sans_SC_Regular.ttf') format("truetype");
}
body {
    font-family: 'JetBrains Mono','HarmonyOS Sans SC';
}
```

## 编辑`_config.butterfly.yml`

```
YAML
# Inject
# Insert the code to head (before '</head>' tag) and the bottom (before '</body>' tag)
# 插入代码到头部 </head> 之前 和 底部 </body> 之前
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/css/font.css">
  bottom:
    # - <script src="xxxx"></script>
```
