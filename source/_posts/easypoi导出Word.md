---
layout: butterfly
title: easypoi导出Word
date: 2020-05-13 16:34:19
tags:
---
## 导入依赖
```
       <dependency>
            <groupId>cn.afterturn</groupId>
            <artifactId>easypoi-base</artifactId>
            <version>3.0.3</version>
        </dependency>
        <dependency>
            <groupId>cn.afterturn</groupId>
            <artifactId>easypoi-web</artifactId>
            <version>3.0.3</version>
        </dependency>
        <dependency>
            <groupId>cn.afterturn</groupId>
            <artifactId>easypoi-annotation</artifactId>
            <version>3.0.3</version>
        </dependency>
```
## 模板 

```
		{{image}}
```
![UTOOLS1589359638024.png](https://img04.sogoucdn.com/app/a/100520146/055d73623cafb1e74480b36c37c411a8)
路径：file/exceltemplate
## 代码
### U
```java

   /**
     * 导出word
     * <p>第一步生成替换后的word文件，只支持docx</p>
     * <p>第二步下载生成的文件</p>
     * <p>第三步删除生成的临时文件</p>
     * 模版变量中变量格式：{{foo}}
     * @param templatePath word模板地址
     * @param temDir 生成临时文件存放地址
     * @param fileName 文件名
     * @param params 替换的参数
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     */
    public static void exportWord(String templatePath, String temDir, String fileName, Map<String, Object> params, HttpServletRequest request, HttpServletResponse response) {
        Assert.notNull(templatePath,"模板路径不能为空");
        Assert.notNull(temDir,"临时文件路径不能为空");
        Assert.notNull(fileName,"导出文件名不能为空");
        Assert.isTrue(fileName.endsWith(".docx"),"word导出请使用docx格式");
        if (!temDir.endsWith("/")){
            temDir = temDir + File.separator;
        }
        File temdir = new File(templatePath);
        if (!temdir.exists()) {
            System.out.println(temdir);
        }
        File dir = new File(temDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        try {
            String userAgent = request.getHeader("user-agent").toLowerCase();
            if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
                fileName = URLEncoder.encode(fileName, "UTF-8");
            } else {
                fileName = new String(fileName.getBytes("utf-8"), "ISO-8859-1");
            }
            XWPFDocument doc = WordExportUtil.exportWord07(templatePath, params);
            String tmpPath = temDir + fileName;
            FileOutputStream fos = new FileOutputStream(tmpPath);
            doc.write(fos);
            // 设置强制下载不打开
            response.setHeader("Content-Disposition", "attachment; filename=" + "strDate" + ".docx");

            response.setContentType("application/force-download");
            // 设置文件名
//            response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);
            OutputStream out = response.getOutputStream();
            doc.write(out);
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
//            delAllFile(temDir);//这一步看具体需求，要不要删
        }

    }
```
### 调用
```java
    @RequestMapping("export")
    public void export(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //2.获取静态资源：word模板和默认头像
        String templatePath =new File("").getAbsolutePath()+"/file/word";
        log.info("静态资源路径："+templatePath);

        //3.获取图片Base64转码
        //imagePath为图片所在的目录和图片名
        String imagePath = templatePath + "/6597b68d127104737849f8272efce9cf.jpg";
        //image为转换后的图片Base64字符串
//        String imageurl = Base64ByLocalUtil.ImageToBase64ByLocal(imagePath);
        ImageEntity image = new ImageEntity();
        image.setHeight(1000);
        image.setWidth(2500);
        image.setUrl(imagePath);

        Map<String,Object> params = new HashMap<>();
        params.put("image",image);
        //这里是我说的一行代码
        SciTestController.exportWord(new File("").getAbsolutePath()+reroute+"exceltemplate"+File.separator+"export.docx","D:/test","aaa.docx",params,request,response);
    }
```
