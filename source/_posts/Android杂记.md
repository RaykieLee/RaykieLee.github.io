---
layout: post
title: Android杂记
date: 2022-05-29
tags: 读书笔记
cover: https://developer.android.google.cn/courses/images/android-for-developers.svg
---



最近一年在工作上除了后端开发之余还因为大学专业是Android开发，还被安排了开发了两个APP,算是重操旧业了。更新了一波Android的一些技术栈也将一些开发遇到的零零碎碎小问题记录了下来。

## 获取主题的颜色

```xml
android:background="?attr/colorPrimary"
```

## PagerView 嵌套Fragment 中RecyclerView失效的问题

### 重写了主页面

#### 原本布局

![](https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/20230529170259.png)

#### 修改后布局

​	![](https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/20230529170425.png)

修改后RecycleView与ViewPager冲突

### 解决办法

- ​    https://juejin.cn/post/6956588617758146573  
- ​    https://www.jianshu.com/p/a53af20c159a  

#### 方法一 官方推荐

用下面的[NestedScrollableHost](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fandroid%2Fviews-widgets-samples%2Fblob%2Fmaster%2FViewPager2%2Fapp%2Fsrc%2Fmain%2Fjava%2Fandroidx%2Fviewpager2%2Fintegration%2Ftestapp%2FNestedScrollableHost.kt)作为RecyclerView的容器可以解决滑动冲突，具体代码及注释如下：

```
//RecyclerView.java

...
//0  
private int mScrollState = SCROLL_STATE_IDLE;
...
@Override
public boolean onInterceptTouchEvent(MotionEvent e) {
   ...
   //1  
   final boolean canScrollHorizontally = mLayout.canScrollHorizontally();
   final boolean canScrollVertically = mLayout.canScrollVertically();
   ...
     
   switch (action) {
       ...
       case MotionEvent.ACTION_MOVE: {
               	...
                final int x = (int) (e.getX(index) + 0.5f);
                final int y = (int) (e.getY(index) + 0.5f);
         				//2
                if (mScrollState != SCROLL_STATE_DRAGGING) {
                    final int dx = x - mInitialTouchX;
                    final int dy = y - mInitialTouchY;
                    boolean startScroll = false;
                  	//2
                    if (canScrollHorizontally && Math.abs(dx) > mTouchSlop) {
                        mLastTouchX = x;
                        startScroll = true;
                    }
                    //3
                    if (canScrollVertically && Math.abs(dy) > mTouchSlop) {
                        mLastTouchY = y;
                        startScroll = true;
                    }
                  	//4
                    if (startScroll) {
                        setScrollState(SCROLL_STATE_DRAGGING);
                    }
                }
            } break;
       ...
   }
   //5
   return mScrollState == SCROLL_STATE_DRAGGING;
}
```

但似乎由于我ViewPager跟RecycleView中间套了个Fragemnt 使用这个方法闪退

#### 方法二 自定义View继承RecyclerView

```
public class RecyclerViewAtViewPager2 extends RecyclerView {

    public RecyclerViewAtViewPager2(@NonNull Context context) {
        super(context);
    }

    public RecyclerViewAtViewPager2(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public RecyclerViewAtViewPager2(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private int startX, startY;

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        switch (ev.getAction()) {
            case MotionEvent.ACTION_DOWN:
                startX = (int) ev.getX();
                startY = (int) ev.getY();
                getParent().requestDisallowInterceptTouchEvent(true);
                break;
            case MotionEvent.ACTION_MOVE:
                int endX = (int) ev.getX();
                int endY = (int) ev.getY();
                int disX = Math.abs(endX - startX);
                int disY = Math.abs(endY - startY);
                LogUtils.debugInfo("DispatchTouchEvent disX="+ disX + "; disY" + disY + "; canScrollHorizontally(startX - endX) = " + canScrollHorizontally(startX - endX) + "; canScrollVertically(startY - endY)" + canScrollVertically(startY - endY));
                if (disX > disY) {
                    //如果是纵向滑动，告知父布局不进行时间拦截，交由子布局消费，　requestDisallowInterceptTouchEvent(true)
                    getParent().requestDisallowInterceptTouchEvent(canScrollHorizontally(startX - endX));
                } else {
                    getParent().requestDisallowInterceptTouchEvent(canScrollVertically(startX - endX));
                }
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                getParent().requestDisallowInterceptTouchEvent(false);
                break;
        }
        return super.dispatchTouchEvent(ev);
    }
}
```



## 获取所有的已安装App列表

添加权限

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" tools:ignore="QueryAllPackagesPermission" />
```

获取已经安装的所有应用，PackageInfo系统类，包含应用信息

```java
private void getPackages() {
    // 获取已经安装的所有应用，PackageInfo系统类，包含应用信息
    List<PackageInfo> packages = getPackageManager().getInstalledPackages(0);
    for (int i = 0; i < packages.size(); i++) {
        PackageInfo packageInfo = packages.get(i);
        if ((packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) { //非系统用
            // AppInfo自定义类，包含应用信息
            AppInfo appInfo = new AppInfo();
            appInfo.setAppName(packageInfo.applicationInfo.loadLabel(getPackageManager()).toString()); //获取应用名称
            appInfo.setPackageName(packageInfo.packageName); //获取应用包名，可用于卸载和启动应用
            appInfo.setVersionName(packageInfo.versionName); //获取应用版本名
            appInfo.setVersionCode(packageInfo.versionCode); //获取应用版本号
            appInfo.setAppIcon(packageInfo.applicationInfo.loadIcon(getPackageManager())); //获取应用图标
        } else { // 系统应用
            
        }
    }
}
```

获取所有用户已安装APP并且读取ClassName

```java
private List<ResolveInfo> getAppInfos() {
    Intent intent = new Intent(Intent.ACTION_MAIN);
    intent.addCategory(Intent.CATEGORY_LAUNCHER);
    return getPackageManager().queryIntentActivities(intent, 0);
}

List<ResolveInfo> packages = getAppInfos();

String packName = packages.get(position).activityInfo.packageName;
String className = packages.get(position).activityInfo.name;
```

## 默认横屏

在`AndroidManifest.xml`文件的`activity`内添加`android:screenOrientation="landscape"`

```xml
<activity
    android:name=".MainActivity"
    android:screenOrientation="landscape">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

## 界面被输入法挤压

在`AndroidManifest.xml`文件中增加`android:windowSoftInputMode="adjustNothing"`，生效后界面不会被挤压。常用的值是`adjustPan`。

```xml
<activity
    android:name=".MainActivity"
    android:windowSoftInputMode="adjustNothing">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

## 隐藏虚拟按键

```java
/**
* 隐藏虚拟按键，并且全屏
*/
protected void hideBottomUI() {
    int uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_FULLSCREEN;

    if (android.os.Build.VERSION.SDK_INT >= 19) {
        uiFlags |= View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
    } else {
        uiFlags |= View.SYSTEM_UI_FLAG_LOW_PROFILE;
    }
    getWindow().getDecorView().setSystemUiVisibility(uiFlags);
    //解决虚拟按键弹出，无法再次隐藏的问题
    getWindow().getDecorView().setOnSystemUiVisibilityChangeListener((i) -> hideBottomUI());
}

/**
* 隐藏虚拟按键，并且全屏
*/
protected void hideBottomUIMenu() {
    //隐藏虚拟按键，并且全屏
    if (Build.VERSION.SDK_INT > 11 && Build.VERSION.SDK_INT < 19) { // lower api
        View v = this.getWindow().getDecorView();
        v.setSystemUiVisibility(View.GONE);
    } else if (Build.VERSION.SDK_INT >= 19) {
        Window _window = getWindow();
        WindowManager.LayoutParams params = _window.getAttributes();
        params.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE;
        _window.setAttributes(params);
    }
}
```

## 卸载系统签名应用

安装了系统证书签名的APP并且使用了`android:sharedUserId="android.uid.system"`时会出现报错`INSTALL_FAILED_SHARED_USER_INCOMPATIBLE`

使用adb命令卸载

-   `adb uninstall com.XXX.XXX`    

## json 转实体多重嵌套会转成Link

子类也需要添加注释

- - `@SerializedName`

- - `@Expose`

## 获取唯一设备ID

```
package com.lnt.lnt_skillappraisal_android.utils;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.UUID;

public final class DeviceIdUtils {
    private static final String TAG = DeviceIdUtils.class.getSimpleName();

    private static final String TEMP_DIR = "system_config";
    private static final String TEMP_FILE_NAME = "system_file";
    private static final String TEMP_FILE_NAME_MIME_TYPE = "application/octet-stream";
    private static final String SP_NAME = "device_info";
    private static final String SP_KEY_DEVICE_ID = "device_id";

    public static String getDeviceId(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(SP_NAME, Context.MODE_PRIVATE);
        String deviceId = sharedPreferences.getString(SP_KEY_DEVICE_ID, null);
        if (!TextUtils.isEmpty(deviceId)) {
            return deviceId;
        }
        deviceId = getIMEI(context);
        if (TextUtils.isEmpty(deviceId)) {
            deviceId = createUUID(context);
        }
        sharedPreferences.edit()
                .putString(SP_KEY_DEVICE_ID, deviceId)
                .apply();
        return deviceId;
    }

    private static String createUUID(Context context) {
        String uuid = UUID.randomUUID().toString().replace("-", "");

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            Uri externalContentUri = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
            ContentResolver contentResolver = context.getContentResolver();
            String[] projection = new String[]{
                    MediaStore.Downloads._ID
            };
            String selection = MediaStore.Downloads.TITLE + "=?";
            String[] args = new String[]{
                    TEMP_FILE_NAME
            };
            Cursor query = contentResolver.query(externalContentUri, projection, selection, args, null);
            if (query != null && query.moveToFirst()) {
                Uri uri = ContentUris.withAppendedId(externalContentUri, query.getLong(0));
                query.close();

                InputStream inputStream = null;
                BufferedReader bufferedReader = null;
                try {
                    inputStream = contentResolver.openInputStream(uri);
                    if (inputStream != null) {
                        bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                        uuid = bufferedReader.readLine();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (bufferedReader != null) {
                        try {
                            bufferedReader.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (inputStream != null) {
                        try {
                            inputStream.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else {
                ContentValues contentValues = new ContentValues();
                contentValues.put(MediaStore.Downloads.TITLE, TEMP_FILE_NAME);
                contentValues.put(MediaStore.Downloads.MIME_TYPE, TEMP_FILE_NAME_MIME_TYPE);
                contentValues.put(MediaStore.Downloads.DISPLAY_NAME, TEMP_FILE_NAME);
                contentValues.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + File.separator + TEMP_DIR);

                Uri insert = contentResolver.insert(externalContentUri, contentValues);
                if (insert != null) {
                    OutputStream outputStream = null;
                    try {
                        outputStream = contentResolver.openOutputStream(insert);
                        if (outputStream == null) {
                            return uuid;
                        }
                        outputStream.write(uuid.getBytes());
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        if (outputStream != null) {
                            try {
                                outputStream.close();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
            }
        } else {
            File externalDownloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File applicationFileDir = new File(externalDownloadsDir, TEMP_DIR);
            if (!applicationFileDir.exists()) {
                if (!applicationFileDir.mkdirs()) {
                    Log.e(TAG, "文件夹创建失败: " + applicationFileDir.getPath());
                }
            }
            File file = new File(applicationFileDir, TEMP_FILE_NAME);
            if (!file.exists()) {
                FileWriter fileWriter = null;
                try {
                    if (file.createNewFile()) {
                        fileWriter = new FileWriter(file, false);
                        fileWriter.write(uuid);
                    } else {
                        Log.e(TAG, "文件创建失败：" + file.getPath());
                    }
                } catch (IOException e) {
                    Log.e(TAG, "文件创建失败：" + file.getPath());
                    e.printStackTrace();
                } finally {
                    if (fileWriter != null) {
                        try {
                            fileWriter.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else {
                FileReader fileReader = null;
                BufferedReader bufferedReader = null;
                try {
                    fileReader = new FileReader(file);
                    bufferedReader = new BufferedReader(fileReader);
                    uuid = bufferedReader.readLine();

                    bufferedReader.close();
                    fileReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (bufferedReader != null) {
                        try {
                            bufferedReader.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    if (fileReader != null) {
                        try {
                            fileReader.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }

        return uuid;
    }

    private static String getIMEI(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return null;
        }
        try {
            TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            if (telephonyManager == null) {
                return null;
            }
            @SuppressLint({"MissingPermission", "HardwareIds"}) String imei = telephonyManager.getDeviceId();
            return imei;
        } catch (Exception e) {
            return null;
        }
    }
}
```

## 灰白模式

```
public class StudyApp extends Application {
 
    @Override
    public void onCreate() {
        super.onCreate();
 
        Paint mPaint = new Paint();
        ColorMatrix mColorMatrix = new ColorMatrix();
        mColorMatrix.setSaturation(0);
        mPaint.setColorFilter(new ColorMatrixColorFilter(mColorMatrix));
 
        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
 
            @Override
            public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {
                // 当Activity创建，我们拿到DecorView，使用Paint进行重绘
                View decorView = activity.getWindow().getDecorView();
                decorView.setLayerType(View.LAYER_TYPE_HARDWARE, mPaint);
            }
 
            ....
        });
    }
}
```

## Android检测NFC卡被拦截

`AndroidManifest.xml`新增`intent-filter`

```
<intent-filter>
    <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <data android:mimeType="text/plain" />
</intent-filter>
```

## 实现自定义消息声音

### 需要权限

```
    <!-- 读取存储空间的权限 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <!-- 设置铃声的权限 -->
    <uses-permission android:name="android.permission.WRITE_SETTINGS" />
```

### 可以使用以下代码来发送通知

```
    private void sendNotification(Context context) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if(pushContentModel.getUni()!=null){
            intent.putExtra("uni",pushContentModel.getUni());
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);

        String channelId = "my_channel_01";
        String channelName = "my_channel";
        // 设置自定义铃声
        String soundUri = ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + context.getPackageName() + "/" + R.raw.custom_notification_sound;
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
        // 创建通知渠道
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build();

            NotificationChannel notificationChannel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.setDescription("channelDescription");
            notificationChannel.enableLights(true);
            notificationChannel.enableVibration(true);
            notificationChannel.setSound(Uri.parse(soundUri), audioAttributes);
            notificationManager.createNotificationChannel(notificationChannel);
        }
        // 构建通知
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.mipmap.logo)
                .setContentTitle(pushContentModel.getTitle())
                .setContentText(pushContentModel.getContent())
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        notificationManager.notify(notificationId, builder.build());

    }
```

## EditText居右显示文本

```
android:textAlignment="textEnd"
```

## 安装更新APP

在您的 AndroidManifest.xml 文件中，检查 `FileProvider` 的声明：

```
<manifest>
    <!-- ... -->
    <application>
        <!-- ... -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.your.package.name.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>

```



在 res/xml 文件夹下的 `file_paths.xml` 文件中，确保正确配置根目录和文件路径：

```
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <files-path
        name="files-path"
        path="." />
    <cache-path
        name="cache-path"
        path="." />
    <external-files-path
        name="external_files"
        path="." />
    <external-cache-path
        name="external_cache"
        path="." />
    <external-path
        name="external_storage_root"
        path="." />
    <root-path
        name="my_image" path="."/>
</paths>
```



在Activity中调用

```
Intent intent = new Intent(Intent.ACTION_VIEW);
Uri apkUri = FileProvider.getUriForFile(getContext(), "com.sc.workstation.fileprovider", file);
intent.setData(apkUri);
intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
startActivity(intent);
```

