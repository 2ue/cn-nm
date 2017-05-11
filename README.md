# cn-nm
> 一个简单的中文和数字互转工具

[中文](https://github.com/2ue/cn-nm) | [English](./doc/en/README_en.md)

## 注意
由于javascript本身机制原因，容纳数值存在上下限，所以当数值过大，请以字符串形式传入。

## 使用方法
``` javascript
    var CNNM = require('cn-nm');
    CNNM.toCn('300000000056747740230023050789');
    //三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九
    CNNM.toNm('三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九');
    //300000000056747740230023050789.889909
```
