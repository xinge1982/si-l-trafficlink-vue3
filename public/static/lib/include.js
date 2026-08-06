/*
 * @Author: ray
 * @Date: 2021-02-20 11:38:05
 * @LastEditTime: 2021-07-06 11:11:30
 * @LastEditors: Please set LastEditors
 * @Description: 加载库
 * @FilePath: \TMEarthd:\ray\develop\temp\include\include.js
 */
(function () {
    var sdkUrl = "static/lib";

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    //加载类库资源文件
    function load() {
        inputScript(`${sdkUrl}/crypto-js.min.js`);  //js加密算法
        inputScript(`${sdkUrl}/Cesium/Cesium.js`); //cesium
        inputCSS(`${sdkUrl}/Cesium/Widgets/widgets.css`);  //cesium窗体组件样式
        inputScript(`${sdkUrl}/ABCEarth/ABCEarth.js`);  //ABCEarch
        inputCSS(`${sdkUrl}/ABCEarth/ABCEarth.css`); // ABCEacrh  样式
        inputScript(`${sdkUrl}/turf.min.js`);   //经纬度计算
        inputScript(`${sdkUrl}/CesiumNavigationMixin.min.js`);  //cesium导航插件
        inputScript(`${sdkUrl}/libgif.js`);  //cesium gif动画库
        inputScript(`${sdkUrl}/apng.js`); //cesium  png动画库
        //轨迹类库
        // inputScript(`${sdkUrl}/protobuf.min.js`)  //轨迹推送解析
        inputScript(`${sdkUrl}/ABCTraffic3D.js`)  //轨迹服务
        inputCSS(`${sdkUrl}/ABCTraffic3D.css`);  //轨迹服务样式
    }

    load();

     var _hmt = _hmt || [];
     (function () {
         var hm = document.createElement("script");
         hm.src = "https://hm.baidu.com/hm.js?0ea00fa5cd2ea0e8bab61734a4c63c1d";
         var s = document.getElementsByTagName("script")[0];
         s.parentNode.insertBefore(hm, s);
     })();
})();
