---
layout: butterfly
title: OppoA8搞机的一次记录
date: 2022-06-22 00:09:24
tags: 刷机
cover: https://cdn.jsdelivr.net/gh/GayHub1/images@master/img/20230707001255.png
---

# OppoA8搞机的一次记录

自从主力机换成iqoo以来就很少折腾过手机了，也没啥精力折腾。但是最近家人应急入了一台OppoA8，成为了我的备用机。于是我就动了折腾的心思。顺带把折腾的过程记录下来。

温馨提示：搞机有风险，Root需谨慎

## 基本环境准备

现在手机基本上都带有BL锁了，需要获取Root权限几乎第一步都是解除BL锁。这个机型比较旧，可以强行解锁而不用去官网申请了，这点挺好的。

在解锁BL前需要在电脑上安装以下几样必备环境

- Mediatek VCOM 驱动程序
- Python 环境
- USBDK
- MTKClient

​	VCOM 驱动程序是特定的 USB 驱动程序，用于在基于 Windows 的计算机上检测联发科技手机。该驱动程序允许用户在砖砌手机上刷新固件，目前使用的是win11系统，由于联发科的驱动程序没有签名，所以在安装时需要关闭系统对没有前面的驱动验证。

### Win11和Win10禁用驱动程序强制签名

1. 单击“开始”，然后转到*“设置”>“Windows更新*”。
2. 点击**高级选择**中，随后选择**“恢复**”。
3. 在“高级启动一行”中，单击“**立即重新启动**”。
4. 启动后单击故障排除并选择**高级**选项。
5. 单击*启动设置>重新启动*。
6. 它将重新启动到具有各种选项的“启动设置”。
7. 按 F7 或 7 禁用**驱动程序签名强制**。

### 安装Mediatek VCOM 驱动程序

1. 打开设备管理器，点击一下本设备
2. 点击上方菜单栏中的操作，选择**添加过时硬件**
3. 在“添加硬件向导”窗口中，单击“下一步”。
4. 选择“安装我从列表中手动选择的硬件（高级）”，然后单击下一步。
5. 选择**显示所有设备**，然后单击下一步。
6. 现在单击从*磁盘安装*并找到驱动解压的文件夹。
7. 选择系统对应位数的驱动(32位选择X86，64位选择64即可，win11也可以使用win10的驱动)
8. 选择后，单击确定。然后单击下一步。
9. 如果弹出警告窗口，请单击仍然安装驱动程序软件。
10. 安装成功后，显示无设备连接无所谓正常现象。
11. 再次打开设备管理器并展开端口。
12. 如果存在黄色感叹号的设备，然后右键卸载。
13. 在“确认设备卸载”窗口中，取消选中“删除此设备的驱动程序软件”，然后单击“确定”。

好的，现在已经在PC上安装了MTK VCOM USB驱动程序。可以将联发科技手机与 PC 连接实现以传输文件、刷新固件、安装恢复等一系列操作以及救砖。

### Python 环境安装

Python我建议安装Anaconda进行一个环境管理，也可以直接安装Python。推荐的版本为3.10.5

注意无论Anaconda还是单纯Python都需要勾选**Add python to PATH**

```cmd
conda create -n oppoa8 python=3.10.4
conda activate oppoa8
```

#### USBDK

双击对应程序即可安装

### mtkclient

下载mtkclient并解压就会得到一个mtkclient-main的文件夹。这是一个python项目，[GitHub地址](https://github.com/bkerler/mtkclient)在此，也可以自行去clone下来最新的版本。

mtkclient在使用之前还需要安装项目对应的依赖，在mtkclient的文件资源管理器的地址栏输入`cmd`并回车，即可在当前路径打开cmd命令行窗口了，输入使用以下命令安装对应的依赖环境

```cmd
python setup.py install
pip3 install -r requirements.txt
```

到这步基本的环境准备完毕就可以使用mtkclient解锁并root手机了

## 解锁BL

在命令行窗口运行命令

```
python mtk da seccfg unlock
```

手机关机，然后同时按住音量键与开机键，使用数据线连接电脑，（此时，如果前面驱动安装没问题的话设备管理器端口会出现新的设备）

命令行也会开始解锁，输出如下

```cmd
Port - Hint:

Power off the phone before connecting.
For brom mode, press and hold vol up, vol dwn, or all hw buttons and connect usb.
For preloader mode, don't press any hw button and connect usb.


..........Port - Device detected :)
Preloader -     CPU:                    MT6765/MT8768t(Helio P35/G35)
Preloader -     HW version:             0x0
Preloader -     WDT:                    0x10007000
Preloader -     Uart:                   0x11002000
Preloader -     Brom payload addr:      0x100a00
Preloader -     DA payload addr:        0x201000
Preloader -     CQ_DMA addr:            0x10212000
Preloader -     Var1:                   0x25
Preloader - Disabling Watchdog...
Preloader - HW code:                    0x766
Preloader - Target config:              0xe5
Preloader -     SBC enabled:            True
Preloader -     SLA enabled:            False
Preloader -     DAA enabled:            True
Preloader -     SWJTAG enabled:         True
Preloader -     EPP_PARAM at 0x600 after EMMC_BOOT/SDMMC_BOOT:  False
Preloader -     Root cert required:     False
Preloader -     Mem read auth:          True
Preloader -     Mem write auth:         True
Preloader -     Cmd 0xC8 blocked:       True
Preloader - Get Target info
Preloader - BROM mode detected.
Preloader -     HW subcode:             0x8a00
Preloader -     HW Ver:                 0xca00
Preloader -     SW Ver:                 0x0
Preloader - ME_ID:                      A5D379E83C20EE29E324EC859FFDDC38
Preloader - SOC_ID:                     8CC2210725B329C3E61AB73DD272EF9FED105ECD3313A78AE614B76678DCC0A9
PLTools - Loading payload from mt6765_payload.bin, 0x264 bytes
PLTools - Kamakiri / DA Run
Kamakiri - Trying kamakiri2..
Kamakiri - Done sending payload...
PLTools - Successfully sent payload: D:\mtkclient-main\mtkclient\payloads\mt6765_payload.bin
Port - Device detected :)
DA_handler - Device is protected.
DA_handler - Device is in BROM mode. Trying to dump preloader.
Successfully extracted preloader for this device to: preloader_oppo6765_19181.bin
DAXFlash - Uploading xflash stage 1 from MTK_AllInOne_DA_5.2152.bin
xflashext - Patching da2 ...
DAXFlash - Successfully uploaded stage 1, jumping ..
Preloader - Jumping to 0x200000
Preloader - Jumping to 0x200000: ok.
DAXFlash - Successfully received DA sync
DAXFlash - DRAM config needed for : 13014e47314a3953
DAXFlash - Sending emi data ...
DAXFlash - DRAM setup passed.
DAXFlash - Sending emi data succeeded.
DAXFlash - Uploading stage 2...
DAXFlash - Upload data was accepted. Jumping to stage 2...
DAXFlash - Successfully uploaded stage 2
DAXFlash - EMMC FWVer:      0x0
DAXFlash - EMMC ID:         G1J9S9
DAXFlash - EMMC CID:        13014e47314a395339100765b87b671f
DAXFlash - EMMC Boot1 Size: 0x400000
DAXFlash - EMMC Boot2 Size: 0x400000
DAXFlash - EMMC GP1 Size:   0x0
DAXFlash - EMMC GP2 Size:   0x0
DAXFlash - EMMC GP3 Size:   0x0
DAXFlash - EMMC GP4 Size:   0x0
DAXFlash - EMMC RPMB Size:  0x1000000
DAXFlash - EMMC USER Size:  0x1d1f000000
DAXFlash - HW-CODE         : 0x766
DAXFlash - HWSUB-CODE      : 0x8A00
DAXFlash - HW-VERSION      : 0xCA00
DAXFlash - SW-VERSION      : 0x0
DAXFlash - CHIP-EVOLUTION  : 0x0
DAXFlash - DA-VERSION      : 1.0
DAXFlash - Upload data was accepted. Jumping to stage 2...
DAXFlash - DA Extensions successfully added
sej - HACC init
sej - HACC run
sej - HACC terminate
sej - HACC init
sej - HACC run
sej - HACC terminate
sej - HACC init
sej - HACC run
sej - HACC terminate
Progress: |██████████████████████████████████████████████████| 100.0% Write (Sector 0x1 of 0x1, ) 0.02 MB/s
DA_handler - Successfully wrote seccfg.
```

最后看见成功解锁手机

## root

同样使用mtkclient来进行手机的root操作。首先使用命令提前手机中的boot与vbmeta.img镜像

```cmd
python mtk r boot,vbmeta boot.img,vbmeta.img
```

手机重复刚才动作，按音量和开机键然后连接电脑，boot.img文件就会提取到**mtkclient-main**文件夹下。

手机安装Magisk，可以通过github[下载路径](https://raw.iqiq.io/topjohnwu/magisk-files/26.1/app-release.apk)得到**app-release.apk**文件随后使用adb命令安装，并将**boot.img**上传到手机默认下载路径

```
adb install app-release.apk
adb push boot.img /sdcard/Download
```

安装后使用Magisk修复**boot.img**

1. 打开Magisk，点击安装
2. 选择修复boot文件
3. 然后**选择并修复一个文件**
4. 选择下载目录下的**boot.img**文件
5. 随后自动修复好该boot.img文件并输出到下载路径，文件名为magisk_patched-XXXX.img

将修复好的img拷贝到电脑并重命名

```cmd
adb pull /sdcard/Download/magisk_patched-26100_TAh9Z.img
mv magisk_patched-26100_TAh9Z.img boot.patched
```

执行命令输入boot即可

```cmd
python mtk w boot,vbmeta boot.patched,vbmeta.img.empty
```

关机，按音量跟电源键然后插入手机即可

回显如下，成功Root

```cmd
Port - Device detected :)
Preloader -     CPU:                    MT6765/MT8768t(Helio P35/G35)
Preloader -     HW version:             0x0
Preloader -     WDT:                    0x10007000
Preloader -     Uart:                   0x11002000
Preloader -     Brom payload addr:      0x100a00
Preloader -     DA payload addr:        0x201000
Preloader -     CQ_DMA addr:            0x10212000
Preloader -     Var1:                   0x25
Preloader - Disabling Watchdog...
Preloader - HW code:                    0x766
Preloader - Target config:              0xe5
Preloader -     SBC enabled:            True
Preloader -     SLA enabled:            False
Preloader -     DAA enabled:            True
Preloader -     SWJTAG enabled:         True
Preloader -     EPP_PARAM at 0x600 after EMMC_BOOT/SDMMC_BOOT:  False
Preloader -     Root cert required:     False
Preloader -     Mem read auth:          True
Preloader -     Mem write auth:         True
Preloader -     Cmd 0xC8 blocked:       True
Preloader - Get Target info
Preloader - BROM mode detected.
Preloader -     HW subcode:             0x8a00
Preloader -     HW Ver:                 0xca00
Preloader -     SW Ver:                 0x0
Preloader - ME_ID:                      A5D379E83C20EE29E324EC859FFDDC38
Preloader - SOC_ID:                     8CC2210725B329C3E61AB73DD272EF9FED105ECD3313A78AE614B76678DCC0A9
PLTools - Loading payload from mt6765_payload.bin, 0x264 bytes
PLTools - Kamakiri / DA Run
Kamakiri - Trying kamakiri2..
Kamakiri - Done sending payload...
PLTools - Successfully sent payload: D:\mtkclient-main\mtkclient\payloads\mt6765_payload.bin
Port - Device detected :)
DA_handler - Device is protected.
DA_handler - Device is in BROM mode. Trying to dump preloader.
DAXFlash - Uploading xflash stage 1 from MTK_AllInOne_DA_5.2152.bin
xflashext - Patching da2 ...
DAXFlash - Successfully uploaded stage 1, jumping ..
Preloader - Jumping to 0x200000
Preloader - Jumping to 0x200000: ok.
DAXFlash - Successfully received DA sync
DAXFlash - DRAM config needed for : 13014e47314a3953
DAXFlash - Sending emi data ...
DAXFlash - DRAM setup passed.
DAXFlash - Sending emi data succeeded.
DAXFlash - Uploading stage 2...
DAXFlash - Upload data was accepted. Jumping to stage 2...
DAXFlash - Successfully uploaded stage 2
DAXFlash - EMMC FWVer:      0x0
DAXFlash - EMMC ID:         G1J9S9
DAXFlash - EMMC CID:        13014e47314a395339100765b87b671f
DAXFlash - EMMC Boot1 Size: 0x400000
DAXFlash - EMMC Boot2 Size: 0x400000
DAXFlash - EMMC GP1 Size:   0x0
DAXFlash - EMMC GP2 Size:   0x0
DAXFlash - EMMC GP3 Size:   0x0
DAXFlash - EMMC GP4 Size:   0x0
DAXFlash - EMMC RPMB Size:  0x1000000
DAXFlash - EMMC USER Size:  0x1d1f000000
DAXFlash - HW-CODE         : 0x766
DAXFlash - HWSUB-CODE      : 0x8A00
DAXFlash - HW-VERSION      : 0xCA00
DAXFlash - SW-VERSION      : 0x0
DAXFlash - CHIP-EVOLUTION  : 0x0
DAXFlash - DA-VERSION      : 1.0
DAXFlash - Upload data was accepted. Jumping to stage 2...
DAXFlash - DA Extensions successfully added
DA_handler - Requesting available partitions ....
DA_handler - Dumping partition "boot"
Progress: |██████████████████████████████████████████████████| 100.0% Read (Sector 0x10000 of 0x10000, ) 7.80 MB/s7 MB/s
DA_handler - Dumped sector 1245184 with sector count 65536 as boot.img.
DA_handler - Dumping partition "vbmeta"
Progress: |██████████████████████████████████████████████████| 100.0% Read (Sector 0x4000 of 0x4000, ) 6.59 MB/s2 MB/s
DA_handler - Dumped sector 14843904 with sector count 16384 as vbmeta.img.
DA_handler - All partitions were dumped
```

## 安装管理器

目前我们已经应用Magisk面具，在这个基础上我们还可以安装各式的管理工具，打开Magisk Manager设置 打开Zygisk按钮 随后重启手机

以下安装工具均放到网盘，链接在文末可直接下载

- 太极（包含太极阳的magisk模块）
- colors 5.2 （可以关闭系统Root警告）
- LSPosed

