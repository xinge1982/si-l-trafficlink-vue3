<template>
  <div class="track-play-map-box" id="roadMap"></div>
</template>
<script lang="ts">
import {
  ref,
  shallowRef,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { useI18n } from 'vue-i18n'
import http from '@/api/http'
import { useAppStore } from '@/store'
import mapUtils from '@/tool/mapUtils.js';

// assets
import icon3 from '../assets/image/screen/12k/video.png'
import icon9 from '../assets/image/screen/center/9.png'
import huo from '../assets/image/huo.png'
import evt from '../assets/image/possibleJam.png'
import camera1 from '../assets/image/screen/1920/camera1.png'
import camera2 from '../assets/image/screen/1920/camera2.png'

import weather0 from '../assets/image/screen/weather/0.png'
import weather1 from '../assets/image/screen/weather/1.png'
import weather2 from '../assets/image/screen/weather/2.png'
import weather3 from '../assets/image/screen/weather/3.png'
import weather4 from '../assets/image/screen/weather/4.png'
import weather5 from '../assets/image/screen/weather/5.png'
import weather6 from '../assets/image/screen/weather/6.png'
import weather7 from '../assets/image/screen/weather/7.png'
import weather8 from '../assets/image/screen/weather/8.png'
import weather9 from '../assets/image/screen/weather/9.png'

const appStore = useAppStore()
const { t } = useI18n()

// =====================
// types
// =====================
interface TrackOptions {
  play?: boolean
  tracks?: any
  geojson?: any
  vehiclePlate?: boolean
}

// =====================
// props
// =====================
const props = defineProps({
  options: {
    type: Object as () => TrackOptions,
    default: () => ({
      play:true,
      tracks:null
    })
  },

  crossData: {
    type:Object,
    default:()=>({})
  },

  trackPath: {
    type:Boolean,
    default:false
  },

  fixed: {
    type:Boolean,
    default:false
  },

  navigation: {
    type:String,
    default:'top-right'
  }
})

const emit = defineEmits<{
  (
      e:'parentMethod'
  ):void
}>()

// =====================
// state
// =====================

const trackID =
    ref<string | null>(null)

const vehicleInfo =
    ref<any>('')

const trackCode =
    ref<any>('')

// map objects should not be reactive deeply
const roadMap =
    shallowRef<any>(null)

const popup =
    shallowRef<any>(null)

const crossing =
    shallowRef<any>(null)

const weatherImgs = {
  0:weather0,
  1:weather1,
  2:weather2,
  3:weather3,
  4:weather4,
  5:weather5,
  6:weather6,
  7:weather7,
  8:weather8,
  9:weather9
}

// =====================
// computed
// =====================

const tracks = computed(()=>{
  return props.options.tracks
})

const crossId = computed(()=>{
  return props.crossData.crossId
})

// =====================
// lifecycle
// =====================

onMounted(()=>{

  getTrackCode()

  initMap()

})

onBeforeUnmount(()=>{

  if(roadMap.value){
    roadMap.value.remove()
  }

})

// =====================
// watchers
// =====================

watch(
    tracks,
    ()=>{

      if(
          roadMap.value &&
          roadMap.value.getSource(
              'geojson-point'
          )
      ){
        updateTrack()
      }

    }
)

watch(
    ()=>props.trackPath,
    value=>{

      if(!roadMap.value){
        return
      }

      roadMap.value.setLayoutProperty(
          'geojson-line',
          'visibility',
          value
              ?
              'visible'
              :
              'none'
      )

    }
)

watch(
    crossId,
    ()=>{

      removePopup()

      if(roadMap.value){
        roadMap.value.flyTo({
          center:[
            props.crossData.centerX,
            props.crossData.centerY
          ]
        })
      }

    }
)

watch(
    ()=>props.fixed,
    value=>{

      if(crossing.value){
        crossing.value.fixed=value
      }

    }
)
// =====================
// methods
// =====================
function updateTrack() {
  crossing.value && crossing.value.updateTrack(props.options.tracks.track);
  var size = getIconSize(roadMap.value.getZoom());
  var arr = props.options.tracks.track;
  var lnglats :any[] = [];
  var features:any[]  = [];
  var trackIdArr:any[]  = [];
  arr.forEach(t => {
    t.iconSize = size;
    /* 去掉对车头的修正
    if (t.objectType == 1) {
        t.driveAngle = t.driveAngle - roadMap.value.getBearing();
    } else {
        t.driveAngle = 0;
        t.iconSize = size * 0.6;
    };
    */
    var obj = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [t.lng, t.lat]
      },
      "properties": t,
    }
    lnglats.push(obj)
    var path :any[] = []
    if (window.APP_CONFIG.isProtobuf == 1) {
      t.path.forEach(p => {
        path.push(p.items)
      })
    } else {
      path = t.path;
    }
    var lineObj = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": path
      },
      "properties": t,
    }
    features.push(lineObj)
    trackIdArr.push(t.trackID)
    if (t.trackID == trackID.value) {
      vehicleInfo.value = t;
      addvehicleInfoBox()
    }
    var a = trackIdArr.indexOf(trackID.value)
    if (a < 0) {
      if (popup) {
        popup.value.remove()
      }
    }
  })
  var data2 = {
    "type": "FeatureCollection",
    "features": lnglats
  }
  var linedata2 = {
    "type": "FeatureCollection",
    "features": features
  }

  // var img = _props.options.vehiclePlate ? ["concat", "sprite_car-", ["to-string", ["get", "vehicleType"]], '-', ["to-string", ["get", "vehicleColor"]]] : "sprite_car-1-1";
  // roadMap.value.setLayoutProperty('geojson-point', 'icon-image', img);
  // roadMap.value.setLayoutProperty('geojson-point', "text-field", _props.options.vehiclePlate ? "{plateNumber}" : '');
  // roadMap.value.setLayoutProperty('geojson-point', 'icon-size', ['get', 'iconSize']);
  roadMap.value.getSource('geojson-point').setData(data2)
  roadMap.value.getSource('geojson-line').setData(linedata2)
  var stopLine = roadMap.value.getSource('stopLine');
  var textPoint = roadMap.value.getSource('textPoint');
  var dataArea = roadMap.value.getSource('dataArea');
  if (!stopLine) {
    return
  }
  var textSize = roadMap.value.getZoom() + 1;
  roadMap.value.setLayoutProperty('textPoint', 'text-size', textSize);
  stopLine._data.features.forEach((item, i) => {
    var index = props.options.tracks.lineString.findIndex(t => t.id === item.properties.id)
    if (index >= 0) {
      item.properties = props.options.tracks.lineString[index]
    }
  })
  textPoint._data.features.forEach((item, i) => {
    var index = props.options.tracks.textPoint.findIndex(t => t.id === item.properties.id)
    if (index >= 0) {
      item.properties = props.options.tracks.textPoint[index]
    }
  })
  dataArea._data.features.forEach((item, i) => {
    if (item.properties) {
      var index = props.options.tracks.dataArea.findIndex(t => t.id === item.properties.id)
      if (index >= 0) {
        item.properties = props.options.tracks.dataArea[index]
      }
    }
  })
  stopLine.setData(stopLine._data)
  textPoint.setData(textPoint._data)
  dataArea.setData(dataArea._data)
}
function createCustomLayer(layerName) {
  return {
    id: layerName,
    type: 'custom',
    renderingMode: '3d',
    onAdd: function(map, gl) {
      crossing.value = new MapABCCrossing(map, gl, {
        modelPath: window.APP_CONFIG.modelPath,
        defaultLights: true,
        enableSelectingObjects: true,
        minZoom: 17,
        modelScale: 0.8, //模型大小
        labelHeight: 1.8, //车牌高度
        fixed: props.fixed
      });
    },
    render: function(gl, matrix) {
      crossing.value.update();
    }
  }
}
async function getTrackCode(){
  const res = await http.get(
      window.APP_CONFIG.WEBSOCKET_URL +
      'cross/api/getTrackCode?'
  )

  trackCode.value = res.data
}

function initMap(){
  const item:any = props.crossData

  roadMap.value = new mapabcgl.Map({
    container:"roadMap",
    style:
    window.APP_CONFIG.MAP_STYLE,

    zoom:
    window.APP_CONFIG.EVENT_MAP_ZOOM,

    maxZoom:
    window.APP_CONFIG.maxZoom,

    minZoom:
    window.APP_CONFIG.minZoom,

    pitch:0,

    center:[
      item.centerX,
      item.centerY
    ]
  })

  roadMap.value.on(
      "style.load",
      ()=>{

        /*
         * load map images
         */
        loadMapImages()

        emit(
            'parentMethod'
        )

        roadMap.value.addLayer(
            createCustomLayer(
                'crossing'
            )
        )

      }
  )

  roadMap.value.on(
      "click",
      ()=>{
        removePopup()
      }
  )

}

function loadMapImages(){

  if(!roadMap.value){
    return
  }

  const images = [
    {
      name:'icon-camera',
      url:icon3
    },
    {
      name:'icon-camera-1',
      url:camera1
    },
    {
      name:'icon-camera-2',
      url:camera2
    },
    {
      name:'icon-three',
      url:icon9
    },
    {
      name:'icon-huo',
      url:huo
    },
    {
      name:'icon-evt',
      url:evt
    }
  ]

  images.forEach(item=>{

    roadMap.value.loadImage(
        item.url,
        (
            error:any,
            image:any
        )=>{

          if(error){
            console.error(
                'load image error',
                item.url,
                error
            )
            return
          }

          if(
              !roadMap.value.hasImage(
                  item.name
              )
          ){
            roadMap.value.addImage(
                item.name,
                image
            )
          }

        }
    )

  })

  /*
   * weather icons
   */
  Object.entries(
      weatherImgs
  )
      .forEach(
          ([key,url])=>{

            roadMap.value.loadImage(
                url,
                (
                    error:any,
                    image:any
                )=>{

                  if(error){
                    return
                  }

                  const name =
                      'w-' + key

                  if(
                      !roadMap.value.hasImage(
                          name
                      )
                  ){
                    roadMap.value.addImage(
                        name,
                        image
                    )
                  }

                }
            )

          }
      )

}
// =====================
// vehicle information popup
// =====================

function addvehicleInfoBox(){
  const global:any =
      trackCode.value

  const info:any =
      vehicleInfo.value

  const clxx =
      t("home.vehicleInformation")

  const clhp =
      t("home.vehicleNumberPlate")

  const dqss =
      t("home.currentSpeed")

  const cpys =
      t("home.licensePlateColor")

  const xsjl =
      t("home.travelDistance")

  const cplx =
      t("home.licensePlateType")

  const dqjsd =
      t("home.currentAcceleration")

  const cllx =
      t("home.vehicleType")

  const ddsj =
      t("home.waitingTime")

  const csys =
      t("home.theColorOfCar")

  const xcsj =
      t("home.journeyTime")

  const clpp =
      t("home.vehicleBrands")

  const mblx =
      t("home.targetType")

  const clzpp =
      t("home.vehicleSub-brand")

  const tccs =
      t("home.numberOfStops")

  const ppcd =
      t("home.matchingLane")

  const html = `
<div class="vehicle-info-box">
  <div class="vehicle-info-box-title">
    ${clxx}
  </div>

  <div class="vehicle-info">

    <li>
      <b>${clhp}</b>
      <span>${info.plateNumber}</span>
    </li>

    <li>
      <b>车辆编号</b>
      <span>${info.trackID}</span>
    </li>

    <li>
      <b>${dqss}</b>
      <span>${info.speed} km/h</span>
    </li>

    <li>
      <b>${cpys}</b>
      <span>
        ${
      global.plateColors[
          info.plateColor
          ]
  }
      </span>
    </li>

    <li>
      <b>${xsjl}</b>
      <span>
        ${info.areaDist} m
      </span>
    </li>

    <li>
      <b>${cplx}</b>
      <span>
        ${
      global.plateTypes[
          info.plateType
          ]
  }
      </span>
    </li>

    <li>
      <b>${dqjsd}</b>
      <span>
        ${info.at} m/s2
      </span>
    </li>

    <li>
      <b>${cllx}</b>
      <span>
        ${
      global.vehicleTypes[
          info.vehicleType
          ]
  }
      </span>
    </li>

    <li>
      <b>${ddsj}</b>
      <span>
        ${info.delayTime} s
      </span>
    </li>

    <li>
      <b>${csys}</b>
      <span>
        ${
      global.vehicleColors[
          info.vehicleColor
          ]
  }
      </span>
    </li>

    <li>
      <b>${xcsj}</b>
      <span>
        ${info.travelTime} s
      </span>
    </li>

    <li>
      <b>${clpp}</b>
      <span>
        ${info.vehicleBrand}
      </span>
    </li>

    <li>
      <b>${mblx}</b>
      <span>
        ${
      global.objectType[
          info.objectType
          ]
  }
      </span>
    </li>

    <li>
      <b>${clzpp}</b>
      <span>
        ${info.vehicleSubbrand}
      </span>
    </li>

    <li>
      <b>${tccs}</b>
      <span>
        ${info.stops}
      </span>
    </li>

    <li>
      <b>${ppcd}</b>
      <span>
        ${info.matchLaneName}
      </span>
    </li>

  </div>
</div>
`

  addPopup(
      html,
      info.lng,
      info.lat,
      '',
      [0,-20]
  )
}

// =====================
// popup
// =====================

function addPopup(
    html:string,
    lng:number,
    lat:number,
    type?:string,
    offset:number[]=[0,0]
){

  if(
      popup.value
  ){
    popup.value.remove()
  }

  popup.value =
      new mapabcgl.Popup({
        closeOnClick:true,
        closeButton:false,
        offset
      })
          .setLngLat([
            lng,
            lat
          ])
          .setHTML(html)
          .addTo(
              roadMap.value
          )
}

function removePopup(){

  if(
      popup.value
  ){
    popup.value.remove()
    popup.value=null
    trackID.value=''
  }

}

// =====================
// icon size
// =====================

function getIconSize(
    zoom:number
){

  if(zoom < 18){
    return Math.max(
        zoom * 0.00576,
        0.1
    )
  }

  if(
      zoom >=18 &&
      zoom <18.5
  ){
    return zoom*0.0072
  }

  if(
      zoom >=18.5 &&
      zoom <18.7
  ){
    return zoom*0.00828
  }

  if(
      zoom >=18.7 &&
      zoom <19
  ){
    return zoom*0.00972
  }

  if(
      zoom >=19 &&
      zoom <19.2
  ){
    return zoom*0.01134
  }

  if(
      zoom >=19.2 &&
      zoom <19.5
  ){
    return zoom*0.01296
  }

  if(
      zoom >=19.5 &&
      zoom <19.8
  ){
    return zoom*0.01539
  }

  if(
      zoom >=19.8 &&
      zoom <20.1
  ){
    return zoom*0.01863
  }

  if(
      zoom >=20.1 &&
      zoom <20.4
  ){
    return zoom*0.02349
  }

  if(
      zoom >=20.4 &&
      zoom <20.7
  ){
    return zoom*0.02835
  }

  if(
      zoom >=20.7 &&
      zoom <21
  ){
    return zoom*0.0324
  }

  if(
      zoom >=21
  ){
    return zoom*0.03807
  }

  return Math.max(
      ((zoom-18)+0.1)*0.23,
      0.1
  )
}
// ==========================
// add map layers
// ==========================

function addLayer(){

  if(!roadMap.value){
    return
  }

  if(
      !roadMap.value.getSource(
          'geojson-point'
      )
  ){

    const emptyPoint:any = {
      type:'Feature',
      geometry:{
        type:'Point',
        coordinates:[]
      },
      properties:{}
    }

    roadMap.value.addSource(
        'geojson-point',
        {
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[
              emptyPoint
            ]
          }
        }
    )

    roadMap.value.addSource(
        'geojson-line',
        {
          type:'geojson',
          data:{
            type:'FeatureCollection',
            features:[]
          }
        }
    )

    // vehicle point
    roadMap.value.addLayer({
      id:'geojson-circle',
      type:'circle',
      source:'geojson-point',
      maxzoom:17,
      minzoom:12,

      paint:{
        'circle-blur':1,
        'circle-radius':5,

        'circle-color':[
          'to-string',
          [
            'get',
            'carPointColor'
          ]
        ],

        'circle-stroke-color':[
          'to-string',
          [
            'get',
            'carPointColor'
          ]
        ],

        'circle-stroke-width':1
      }

    })

    // track line
    roadMap.value.addLayer({
      id:'geojson-line',
      type:'line',
      source:'geojson-line',

      minzoom:17,

      paint:{
        'line-color':
            '#fc7b6c',

        'line-width':2
      },

      layout:{
        visibility:
            props.trackPath
                ?
                'visible'
                :
                'none'
      }

    })

  }

  if(
      !props.options.geojson
  ){
    return
  }

  const geo = props.options.geojson

  // stop line
  mapUtils.addgeojsonLine({
    maps:roadMap.value,
    features:geo.lineString,
    opacity:1,
    id:'stopLine',
    color:[
      'get',
      'fillColor'
    ],
    strokeWeight:[
      '*',
      [
        'get',
        'type'
      ],
      4
    ],
    beforeId:
        'hdmap_dlm_z17_z23_zlevel'
  })

  // text point
  mapUtils.addgeojsonPoint({
    maps:roadMap.value,
    features:geo.textPoint,
    textField:"{name}",
    id:'textPoint',
    textHaloColor:[
      'to-string',
      [
        'get',
        'fillColor'
      ]
    ],
    textColor:'#fff'
  })

  // detector area
  mapUtils.addgeojsonPolygon({
    maps:roadMap.value,
    features:geo.dataArea,
    id:'dataArea',
    color:[
      'get',
      'fillColor'
    ],
    opacity:[
      'get',
      'fillOpacity'
    ],
    beforeId:
        'hdmap_dlm_z17_z23_zlevel'
  })

}

</script>
<style>
.track-play-map-box {
  width: 100%;
  height: 100%;
}
</style>
