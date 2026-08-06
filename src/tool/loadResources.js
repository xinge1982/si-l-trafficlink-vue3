
//加载css与js文件
export default function asyncLoadJs (url) {
  return new Promise((resolve, reject) => {
    let srcArr = document.getElementsByTagName("script");
    let hasLoaded = false;
    for (let i=0;i<srcArr.length;i++){//判断当前js是否加载上
      hasLoaded = (srcArr[i].src==url)?true:false;
    }
    if (hasLoaded) {
      resolve();
      return;
    }
    let script = document.createElement('script')
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    }
    script.onerror = () => {
      reject();
    }
  })
}

export function loadCss(url){
  let css = document.createElement('link');
  css.href = url;
  css.rel = 'stylesheet';
  css.type = 'text/css';
  document.head.appendChild(css);
}

export function loadMineMapJs () {
  //加载css
  loadCss( MAP_URL+"webglapi/item?n=mapabc-gl-min&t=css&v=1.0&ak=ec85d3648154874552835438ac6a02b2");
  loadCss( "/css/mapabc-gl-draw.css");
  loadCss( "/css/font.css");
  //加载js
  return new Promise((resolve, reject) => {
    // asyncLoadJs("./static/js/minemap_wmts.js")//开发用
    
    asyncLoadJs(MAP_URL + "webglapi/item?n=mapabc-gl-min&t=js&v=1.0&ak=ec85d3648154874552835438ac6a02b2")//部署用
      .then(() => {

        return asyncLoadJs( MAP_URL +"webglapi/item?n=turf-min&t=js&v=1.0&ak=ec85d3648154874552835438ac6a02b2")
      })
      .then(() => {
        return asyncLoadJs("/js/mapabc-gl-draw.js")
      })
      .then(() => {
        // return asyncLoadJs("/js/deckgl.js")
      })
      .then(() => {
        return asyncLoadJs("/js/echarts.js")
      })
      .then(() => {
        return asyncLoadJs("/js/echarts-gl.js")
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}
