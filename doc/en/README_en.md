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
    //三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九
    CNNM.toNm('三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九');
    //300000000056747740230023050789.889909
```
