---
title: 网络技术
date: 2018-11-18 14:31:14
toc: true
tags: [网络技术,Android,第一行代码笔记]
---
# 网络技术
<!-- more -->
声明权限 
>    <uses-permission android:name="android.permission.INTERNET" />
## WebView
```java
     WebView webView = (WebView) findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true);  //通过getSettings()设置浏览器属性  setJavaScriptEnabled(true)让Webview支持javaScript脚本
        webView.loadUrl("https://www.baidu.com"); 
        webView.setWebViewClient(new WebViewClient() {  
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;

                try{
                    if(!url.startsWith("http://") && !url.startsWith("https://")){
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                }catch (Exception e){//防止crash (如果手机上没有安装处理某个scheme开头的url的APP, 会导致crash)
                    return true;//没有安装该app时，返回true，表示拦截自定义链接，但不跳转，避免弹出上面的错误页面
                }

                // TODO Auto-generated method stub
                //返回值是true的时候控制去WebView打开，为false调用系统浏览器或第三方浏览器
                view.loadUrl(url);
                return true;
            }
        });
```
##### 解决ERR_UNKNOWN_URL_SCHEME这个错误
给WebView设置WebViewClient，并重写WebViewClient中的shouldOverrideUrlLoading方法. 
首先我们来了解下shouldOverrideUrlLoading(WebView view, String url)方法，该方法会在加载超链接时回调过来，所以通过重写shouldOverrideUrlLoading，可以实现对网页中超链接的拦截；返回值为boolean型，是true的时候控制去WebView打开，为false调用系统浏览器或第三方浏览器。默认false
## Http协议访问
#### HttpURLConnection

1.传入URL对象通过openConnection()获取HttpURLConnection对象
>                    URL url = new URL("http://www.baidu.com");
>                    connection = (HttpURLConnection) url.openConnection();
2.设置HTTP属性 如 请求方法 get post  连接超时
>                    connection.setRequestMethod("GET");
>                    connection.setConnectTimeout(8000);
>                    connection.setReadTimeout(8000);
3.获取输入流并读取
>
                    InputStream in = connection.getInputStream();
                    // 下面对获取到的输入流进行读取
                    reader = new BufferedReader(new InputStreamReader(in));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    showResponse(response.toString());
>
4.输出流
>
                    connection.setRequestMethod("GET");
                    DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
                    outputStream.writeBytes("xxxxxxx");
>
5.关闭连接
>                         connection.disconnect();
一般在应用中的 放在中多线程实例
```java
    public static void sendHttpRequest(final String address, final HttpCallbackListener listener) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection connection = null;
                try {
                    URL url = new URL(address);
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(8000);
                    connection.setReadTimeout(8000);
                    connection.setDoInput(true);
                    connection.setDoOutput(true);
                    InputStream in = connection.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    if (listener != null) {
                        // 回调onFinish()方法
                        listener.onFinish(response.toString());
                    }
                } catch (Exception e) {
                    if (listener != null) {
                        // 回调onError()方法
                        listener.onError(e);
                    }
                } finally {
                    if (connection != null) {
                        connection.disconnect();
                    }
                }
            }
        }).start();
    }

    public static void sendOkHttpRequest(final String address, final okhttp3.Callback callback) {
        Request request = new Request.Builder()
                .url(address)
                .build();
        client.newCall(request).enqueue(callback);
   }
````   
## OkHttp

在gradle中添加okhttp库
>    implementation 'com.squareup.okhttp3:okhttp:3.4.1'

创建OkHttpClient实例
>        OkHttpClient client = new OkHttpClient();
发起HTTP请求创建Request对象
>        Request request = new Request.Builder()
>                .url(address)
>                .build();
调用OkHttpClient的newCall方法创建Call对象,并用response存储返回的数据。

>         Response response = client.newCall(request).execute();
>           String responseData = response.body().string();
POST
构建RequestBody 对象存放参数
>     RequestBody requestBody = new ForBody.Builder()
>               .add("username","admin")
>               .add("password","123456")
>               .build();
在Request.Builder 中调用post()方法传入

>     Request request = new Request.Builder()
>         .url("http://www.baidu.com")       
>         .post(requestBody)
>         .build();
## XML 解析
#### PULL
1.获取XmlPullParserFactory实例
>              XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
2.通过XmlPullParserFactory实例得到XmlPullParser对象。
>            XmlPullParser xmlPullParser = factory.newPullParser();
3.将XML文件放入XmlPullParser.setInput方法中解析
>            xmlPullParser.setInput(new StringReader(xmlData));
4.解析过程 
 - 通过getEventType() 等于XmlPullParser.END_DOCUMENT 判断完成解析，等于XmlPullParser.START_TAG正在解析
 - getName()方法获取当前节点名字 根据 名字通过 nextText（）方法获得节点具体内容
 - next（）获取下一个事件
 #### SAX
1.获取SAXParserFactory实例
>             SAXParserFactory factory = SAXParserFactory.newInstance();
2.根据SAXParserFactory实例获取到XMLReader对象
>                          XMLReader xmlReader = factory.newSAXParser().getXMLReader();
 3.自定义一个类继承DefaultHandler，重写 5个方法。
  - startDocument() 开始 解析XML时调用
  - startElement（）开始解析节点的时候调用
  - characters（）解析节点中具体内容是调用
  - endElement（）结束解析节点的时候调用
   - endDocument() 结束解析XML时调用
   
4.讲自定义类实例放进XMLReader对象中，调用parse方法开始执行。
>         xmlReader.setContentHandler(handler);
>         xmlReader.parse(new InputSource(new StringReader(xmlData)));

## JSON 解析
#### JSONObject
将数据传入到JSONArray对象 遍历JSONArray中每一个JSONObject对象，直接用getString（）之类方法讲数据取出。
````java
            JSONArray jsonArray = new JSONArray(jsonData);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                String id = jsonObject.getString("id");
                String name = jsonObject.getString("name");
                String version = jsonObject.getString("version");
                Log.d("MainActivity", "id is J" + id);
                Log.d("MainActivity", "name is " + name);
                Log.d("MainActivity", "version is " + version);
            }
````
#### GSON
自动将JSON格式映射成对象。
1.加库
>     implementation 'com.google.code.gson:gson:2.7'
2.解析
>        Gson gson = new Gson();
>        JAVABean javabean = gson.fromJson(jsondata, Person.class);
        
当是Json数组时 借助TypeToken将期望解析成的数据类型（javabean）传入fromjson（）中。
````java
        Gson gson = new Gson();
        List<App> appList = gson.fromJson(jsonData, new TypeToken<List<App>>() {}.getType());
        for (App app : appList) {
            Log.d("MainActivity", "id is G" + app.getId());
            Log.d("MainActivity", "name is " + app.getName());
            Log.d("MainActivity", "version is " + app.getVersion());
        }
````
        
