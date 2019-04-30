# cn-nm
> A tool is that can inner-transformation number and Chinese.

[中文](https://github.com/2ue/cn-nm) | [English](./README_en.md)

## Tips
when you transformation number to Chinese, please use string as para to transmit;beucase javascript limited the number;
Accordingly, when you transformation Chinese to number, the result is string too;

## Doc
``` javascript
    var CNNM = require('cn-nm');
    CNNM.toCn('300000000056747740230023050789.889909');
    //叁十穰零伍千陆百柒十肆京柒千柒百肆十兆贰千叁百亿贰千叁百零伍万零柒百捌十玖点捌捌玖玖零玖
    CNNM.toNm('叁十穰零伍千陆百柒十肆京柒千柒百肆十兆贰千叁百亿贰千叁百零伍万零柒百捌十玖点捌捌玖玖零玖');
    //300000000056747740230023050789.889909
```
