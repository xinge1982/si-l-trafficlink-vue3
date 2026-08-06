window.APP_CONFIG = {
    //二维初始化地图配置项
    MAP_URL: 'https://192.168.11.151:55001/',
    MAP_STYLE:  'mapabc://style/mapabc80',
    MIN_MAP_STYLE: 'mapabc://style/mapabc80', //小地图样式
    MAP_CENTER: [114.291986,35.750176],
    MAP_ZOOM: 16, //地图公共组件默认层级
    EVENT_MAP_ZOOM: 18, //事件类地图组件默认层级
    minZoom: 8, //地图公共组件最小层级
    maxZoom: 21, //地图公共组件最大层级
    mapabcglToken: 'ec85d3648154874552835438ac6a02b2', //引擎token
    TRAFFIC_URL: 'http://13.75.103.188:8883/traffic?',//路况地址
    TRAFFIC_REFRESH_TIME: 60 * 1000,//路况刷新时间
    //三维初始化地图配置项
    threeMap: true,
    lookAt: {
        lng: 103.84109690549859,
        lat: 30.48073845691917,
        heading: 0.0, //水平角度
        pitch: -45, //垂直角度
        range: 200 //观察距离
    },
    tilesets: {
        type: 0,
        data: [{ path: "./static/assets/tileset/lanhe/tileset.json", default: true }]
    },//地面模型数据文件
    modelPath: "./static/libs/threeBox/model/car", //车辆模型路径
    skyBoxPath: './static/assets/images/skybox', //天空盒
    facilityPath: "./static/assets/tileset/lanhe/tileset.json", //设施数据文件
    imagerUrl: [
    {
      url: 'https://192.168.11.151:55004/tile/{z}/{x}/{y}?layer=tiledata13',
      maximumLevel: 20
    }],

    // 2.0版本配置项
    LargeScreenDemo: 0, //是否大屏演示数据
    PlayVideoDemo: 0, //是否要求playVideo接口使用演示视频
    PlayVideoDemoUrl: 'https://192.168.11.151:19002/live/test.live.ts', //可直接播放的demo视频地址
    isProtobuf: 1, //websocket推送数据方式，1:protobuf,0:json
    newLogin: true, //是否开启验证码登录方式
    SERVICE_URL: 'https://192.168.11.151:19400/webapi/v1/', //系统服务地址
    SERVICE_URL_v2: 'https://192.168.11.151:19400/webapi/v1/cross',//高速：expressway,路口：cross
    SERVICE_URL_screen: 'https://192.168.11.151:19400/webapi/v1/websocket/largeScreen/', //大屏服务地址
    WEBSOCKET_URL: 'https://192.168.11.151:28181/', //websocket服务
    LOGO_SERVICE: 'https://192.168.11.151:19300/', //登录服务
    //DEVICESERVICE_URL: 'https://192.168.11.151:28188/',
    //DEVICESERVICE_URL: 'https://localhost:18091/',
    WEB_TITLE_V2: '葛洲坝交投智慧道路监测服务平台',
    WEB_TYPE: 'cross',//cross：路口，highway：高速
    DefaultHometRoute: "/home",
    interVal: false,//是否开始首页12k大屏定时器
    intervalTime: 30000,//定时器间隔时间
    screenTitle: '葛洲坝交投智慧道路监测服务平台',
    leftTitle: '路网监测',
    rightTitle: '事件监测',
    nextRoute: [],
    fireAlarm: false,
    traffic: true,//首页全息路况工具显隐
    moduleName: '全息路口',
}
