MapABCCrossingRoot = "static/libs/threeBox";
(function () {
    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }
    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }
    function load() {
        inputScript(`${MapABCCrossingRoot}/js/three.js`);
        inputScript(`${MapABCCrossingRoot}/js/MapABCThree.js`);
        inputCSS(`${MapABCCrossingRoot}/css/MapABCThree.css`);
        inputScript(`${MapABCCrossingRoot}/js/MapABCCrossing.js`);
        inputCSS(`${MapABCCrossingRoot}/css/MapABCCrossing.css`);
    }
    load();
})();