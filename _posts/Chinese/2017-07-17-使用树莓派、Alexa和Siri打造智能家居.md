---
title: 使用树莓派、Alexa和Siri打造智能家居系统
layout: post
category: Chinese
tags:
- iot
---

* TOC
{:toc}

## 引言

我目前的住址是唯一硅谷圣塔克拉拉某条街道的一间公寓。公寓不大，但是有很多墙壁开关和墙壁插头。其中某些开关可以控制某些插头是否通电。美国的公寓一般在客厅没有屋顶灯，一般情况下美国人把落地灯连接到墙壁插座上，然后通过能控制它的开关来开关灯。

听起来好像很方便，但实际上造成了巨大麻烦。插座的位置固定，所以落地灯的位置也必须靠近插座，否则就得使用难看的复杂的延长线。第二，由于开关在门口，所以想关灯只能走到门口去。

另外一个生活上亟须解决的痛点是，我经常两手拎着电脑包、健身包、外卖等等，站在门口一筹莫展。因为钥匙在电脑包内层里，想要开门要放下某个包，然后抓出钥匙。

现代生活往往导致家庭里有很多电器，而我尤其如此。我有一个电视、音响、投影仪、PS4、Apple TV等等。每次想看一个电影尤其复杂——要开电视，选择正确的HDMI接口，打开音响，选择音响信号输入，打开Apple TV...

这就是为什么我开始这个智能家居项目。每个人对智能家居的理解不同。有些人认为用手机遥控足够好，有些人则要求智能家居需要真正“智能“。而我认为使用手机来遥控各种电器并不能省事多少，而太过”智能“的系统又非常困难。我希望搭建一个以语音系统为基础，可以扩展的智能家居系统。

为了解决上述需求痛点，在项目开始的时候，我列下了一些目标。

## 需求、目标

- [x] 通过语音开关公寓内常用的灯
- [x] 抛弃钥匙，通过更好的方式来开、锁门
- [ ] 声控或者光控打开百叶窗
- [ ] 声控打开窗户
- [x] 声控打开关闭空调和电扇
- [ ] 每天音乐唤我起床
- [x] 使用更简单的方式来控制各种媒体数码产品

## 硬件购买清单

- 树莓派：Raspberry Pi 3 Model B
- 射频发射器和接收器：RioRand(TM) 433MHz RF transmitter and receiver
- 射频控制转接插座：Etekcity Wireless Remote Outlets
- Echo Dot (2nd Gen)
- 红外发射和接收器：MagicW 38KHz IR transmitter and receiver
- 舵机：Futaba S3003 Servo
- 三极管：2N3904 Transistor
- 跳线若干
- 面包板若干：Breadboards (400 pin)
- ESP8266 NodeMCU modules
- 乐高积木颗粒

## 基础设施设置

最后的方案是以 Amazon Echo Dot 和 Apple 的内置语音助手 Siri 为控制输入、以树莓派搭建控制中转中心、ESP8266无线模块为控制终端来搭建整个系统。本部分的设置主要为参考，随版本更新可能发生变化。

### 树莓派

1. 在美亚上下单，两天后收到。
1. 下载 [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) 系统，注意官方网站上的说明让用户使用软件把镜像文件烧录到U盘上，但这是错误的。只需要解压缩下载得到的压缩包，并把全部内容拷贝到U盘即可。
1. 树莓派连接显示器、鼠标、键盘，插入U盘，连接树莓派电源（5V mini USB 接口），树莓派会自动启动。
1. 根据屏幕提示，安装 Raspbian Jessie 系统。
1. 重启进入系统，设置 Wifi 连接，并允许 SSH 连接。为了方便，把计算机名称改为 pi，并修改初始密码。
1. 测试 SSH 连接：`$ ssh pi@pi.local`
1. 安装 Node.js
  - `$ sudo apt-get update`
  - `$ curl -sLS https://apt.adafruit.com/add | sudo bash`
  - `$ sudo apt-get install node`
1. 安装 Vim：`$ sudo apt-get vim`

### 使用 Homebridge 连接 Siri

目前市场上支持 Siri 的设备非稀少即昂贵。Homebridge 是一个基于 Node.js 的第三方 HomeKit 插件，能伪装出一系列支持 Siri 的设备。

安装 [Homebridge](https://github.com/nfarina/homebridge):

```
$ sudo npm install -g --unsafe-perm homebridge
```

安装 [homebridge-cmdswitch2](https://github.com/luisiam/homebridge-cmdswitch2)。这个插件可以允许 Homebridge 使用命令行来控制设备的开关。

进入 `~/.homebridge` 新建一个 `config.json` 根据[示例文件](https://github.com/nfarina/homebridge/blob/master/config-sample.json) 弄一个简易的配置文件，然后启动 Homebridge 服务。

打开 iPhone 的 Home app，添加 Accessory，选择 Homebridge。

### Amazon Echo Dot

Amazon 有一套 Skills 系统，允许添加自定义的 Skill，但缺点是需要每次说"Alexa, tell x to do something"。非常奇怪。因此，放弃 Skills，使用 [Fauxmo](https://github.com/dsandor/fauxmojs)。这是一个 Node.js 插件，把自己伪装成一个 WeMo 的灯泡，但是除了“灯泡”这个属性之外，其他的东西都是可以自定义的，比如名字。

新建一个目录，进入后安装 fauxmojs：

```sh
$ npm install fauxmojs ip --save
```

使用下列示例代码新建一个简单的配置文件，它跟 Homebridge 的文件差不多。主要就是在 `handler()` 方法中执行具体的控制命令。具体内容稍后再添加。

```javascript
const FauxMo = require('fauxmojs');
const ip = require('ip');
const { spawnSync } = require('child_process');
const request = require('request');

let fauxMo = new FauxMo({
  ipAddress: ip.address(),
  devices: [{
    name: 'Living Room Light',
    port: 11000,
    handler(action) {
      if (action === 'on') {
        // do something
      } else if (action === 'off') {
        // do something else
      }
    }
  }]
});

console.log('started...');
```

### ESP8266 NodeMCU 模块

开发该模块首先必备一份针脚地图，注意 D4 的并非 GPIO4。

![NodeMCU pin map](/images/iot/nodemcu_pin_map.jpg)

下载安装 Arduino IDE for Mac。下载安装 NodeMCU 的驱动。[这个比较难找](https://kig.re/2014/12/31/how-to-use-arduino-nano-mini-pro-with-CH340G-on-mac-osx-yosemite.html)，如果 Mac 系统是最新的话，可能要费一些功夫。但还是附上[链接](https://kig.re/2014/12/31/how-to-use-arduino-nano-mini-pro-with-CH340G-on-mac-osx-yosemite.html)，并不保证一定有用。

使用一条 USB 转 mini USB 数据线（注意，需要一条数据线而不是普通的充电线），连接 Macbook 和 模块。

打开 Arduino IDE 软件。在菜单栏 Library 里安装 NodeMCU 的模块。重启 IDE。在 Port 处应该有两个，一个是什么什么蓝牙（Bluetooth），另外一个是类似 `SLAB_USBtoUART` 这样的名字，选择。在菜单栏，选择一个简单的示例文件，点击“上传”，此时模块有一个蓝色信号灯狂闪，上传结束后会立即执行或者报错。IDE 右上角有一个按钮可以打开控制台，但注意需要选择代码中正确的频道才能看见，否则可能是乱码。

## 灯

Etekcity 生产的遥控插座转接头是一个神器，美亚上30美元五个，平均一个六美元。而现有最便宜的支持 Siri 的单口插座则要至少20美元一个。

这个插座的原理就是使用遥控器来控制继电器，从而达到切断电流的目的。我们则要使用射频（RF)嗅探器来截获遥控器的射频信号码，然后使用发射器来达到跟遥控器相同的目的。

插座头的设置非常简单，插入插座中，按下旁边的按钮，红色LED灯闪烁，按下遥控器的某一个键，红灯闪烁三下表明已经记录，然后这个键就被指定给了这个插座。这样把五个插座头都配置好按钮，放在一边。接下来连接射频（RF）发射和接收器。

发射器和接收器都有电源（VCC），接地（GND）和数据
（DATA）接口，并在模块上有标注。发射器可能还有天线接口，暂时忽略之。使用跳线，把两个设备连接到树莓派的 GPIO 针口上。电源需要连接到3.3V上。

在树莓派上安装 [wiringPi](https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/)。

新建一个目录，克隆 [rf_pi](https://github.com/n8henrie/rf_pi)。

```sh
$ git clone https://github.com/n8henrie/rf_pi.git
$ cd rf_pi

# 编辑 send.cpp 文件，修改 GPIO 为真实的连接号码。如果发射器连接到了 GPIO 3，则需要修改为 3
$ vim send.cpp

$ make
```

开始录制射频信号：

```
$ ./RFSniffer
```

依次按遥控器上的按钮，屏幕上则会出现该按钮的代码。记住这些按钮对应的号码。

测试信号，把插座插到墙上，然后执行：

```
$ ./send 123456
```

如果一切正常，插座应该切换有电/断电模式。

### 整合到语音控制

对于 Siri，把下列代码添加到 `~/homebridge/config.json` 中：

```json
{
  "on_cmd": "/home/pi/workspace/rf_pi/send 5272835",
  "off_cmd": "/home/pi/workspace/rf_pi/send 5272836"
}
```

对于 Alexa，把下列代码添加到刚才建好的 `index.js` 中：

```javascript
const { spawnSync } from 'child_process';

// ...
if (action === 'on') {
  spawnSync('/home/pi/workspace/rf_pi/send', ['5272835'], { encoding: 'utf8'});
} else if (action === 'off') {
  spawnSync('/home/pi/workspace/rf_pi/send', ['5272844'], { encoding: 'utf8'});
}
```

测试：“Hey Siri, turn on the living room light“以及”Alexa, turn on the living room light“。

## 空调/风扇

家用电器中使用射频控制的非常少，大多还是频率为38kHz的红外信号。以空调为例。控制原理跟射频差不多，基本也是：解惑信号 -> 记录信号 -> 模拟发射信号。

使用 NodeMCU 模块直接录制红外信号：把红外（IR）接收器模块连接到 NodeMCU 模块上：VCC - 3.3V, GND - GND, Data - D5，注意 D5 是 GPIO 14 针脚。

使用[IRremoteESP8266](https://github.com/markszabo/IRremoteESP8266)红外包。下载至`<path>/Arduino/Libraries`目录中。重启 IDE。打开示例文件中名为 `IRrecvDumpV2.ino` 的文件。打开控制台（Serial Monitor），选择频道为 115200（或者实际频道），上传代码。

把空调遥控器对准红外接收器，按一下电源键。这里有个小技巧，按键的时候一定要快速，不要拖沓。每次录制出来的数据可能不同，最好多记录几次，待会测试的时候需要。IRremoteESP8266 包内置了一些知名品牌的红外信号格式，但是大多数可能还是显示“UNKNOWN”。比如：

```c
uint16_t acPowerRawData[37] = {8500,4300, 550,1600, 550,1600, 550,1600, 500,600, 550,1600, 550,600, 550,1600, 550,1600, 500,4300, 550,1600, 500,1650, 550,550, 550,1600, 550,550, 550,550, 550,550, 550,550, 600};
```

按照[下图](https://github.com/markszabo/IRremoteESP8266/wiki)连接红外发射器、三极管。

![IR sending](/images/iot/ir_sending.png)

_Copyright: [markszabo](https://github.com/markszabo/IRremoteESP8266/wiki)_

不过根据我的实际操作来看，此图的连线略有复杂。在面包板上直接使用左下角的几个针脚（3.3V, GND, D8）的话，连跳线都不需要。

打开一个新的 Aruduino IDE 窗口，使用[示例代码](https://github.com/fuermosi777/home-automation/blob/master/esp8266/WebServerIRSend_AC.ino)上传。把代码中的 `rawData` 变量换成实际录制的数组。

```c
irsend.sendRaw(acPowerRawData, 37, 38);
```

这一行代码发送了红外信号。第二个参数是数组的长度。第三个参数是红外频率，[一般家用电器为 38 kHz](https://en.wikipedia.org/wiki/Consumer_IR)。

对于整合来说，与射频类似，把控制命令放在对应的配置文件中。

- Siri: `curl http://ac.local/ac_power`
- Alexa: `request.get('http://ac.local/ac_power')`

## 门锁

市场上的智能门锁有几个缺陷：

1. 昂贵，动辄200美元
2. 不支持 Siri，而用一个 app 开锁不见得比钥匙方便多少
3. 需要拆掉现有的门锁

门锁的转动需要舵机来实现，订购 Futaba S3003 标准舵机，5V供电。测量家用门锁的尺寸，订购乐高模块。

把舵机分别连接至 ESP8266 模块的 5V电源、接地线（GND）和数据针脚（D2）上。一般红色为正极，黑色为地线，白色或黄色为数据（DATA）。

把 ESP8266 连接至 Mac，打开 Arduino IDE。新建一个文件。输入下列代码：

```c
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Servo.h> 

#define DELAY_BETWEEN_COMMANDS 1000
#define LOCK_DOOR 24
#define UNLOCK_DOOR 134

Servo myservo;

const char* ssid = "";
const char* password = "";
const char* hname = "lock";
int state = LOCK_DOOR;

ESP8266WebServer server(80);

const int led = BUILTIN_LED;

void setup(void){
  myservo.attach(4); // GPIO 4 D2
  myservo.write(LOCK_DOOR);
  
  pinMode(led, OUTPUT);
  digitalWrite(led, 1);
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  WiFi.hostname(hname);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin(hname)) {
    Serial.println("MDNS Responder Started");
  }

  server.on("/door_lock", [](){
    myservo.write(LOCK_DOOR);
    state = LOCK_DOOR;
    server.send(200, "text/plain", "Door locked");
  });

  server.on("/door_unlock", [](){
    myservo.write(UNLOCK_DOOR);
    state = UNLOCK_DOOR;
    server.send(200, "text/plain", "Door unlocked");
  });

  server.begin();
  Serial.println("HTTP Server Started");
}

void loop(void){
  server.handleClient();
}
```

其中，`LOCK_DOOR` 和 `UNLOCK_DOOR` 为两个储存舵机转动角度的常量。需要测试后替换为真实的“开”和“关”的角度。在 `ssid` 和 `password` 填入家用 Wifi 的信息。上传运行代码。

在浏览器中打开下列两个 URL 来测试门锁是否正常工作：

- `http://lock.local/door_lock`
- `http://lock.local/door_unlock`

一切正常后，整合至 Siri。

本文全部代码在 [Github 上托管](https://github.com/fuermosi777/home-automation)。