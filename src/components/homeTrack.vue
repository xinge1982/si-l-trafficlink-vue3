<template>
    <div class="track-play-map-box" id="homeMap"></div>
</template>
<script setup lang="ts">
import http from '@/api/http';

const { WEBSOCKET_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

var popup = null;

defineOptions({

    props: {
        options: {
            type: Object,
            default () {
                return {
                    play: true,
                    tracks: null,

                }
            }
        },
        crossData: {
            type: Object,
            default () {
                return {

                }
            }
        },

        trackPath: {
            type: Boolean,
            default () {
                return false
            }
        },
        fixed: {
            type: Boolean,
            default () {
                return false
            }
        },
        navigation: {
            type: String,
            default () {
                return 'top-right'
            }
        }

    },
    data() {
        return {
            trackID: null,
            vehicleInfo: '',
            popup: null,
            homeMap: null,
            trackCode: '',
            icon3: assetUrl('../assets/image/screen/12k/video.png'),
            icon9: assetUrl('../assets/image/screen/center/9.png'),
            huo: assetUrl('../assets/image/huo.png'),
            evt: assetUrl('../assets/image/possibleJam.png'),
            camera1: assetUrl('../assets/image/screen/1920/camera1.png'),
            camera2: assetUrl('../assets/image/screen/1920/camera2.png'),
            camera3: assetUrl('../assets/image/screen/1920/camera3.png'),
            camera4: assetUrl('../assets/image/screen/1920/camera4.png'),
            camera5: assetUrl('../assets/image/screen/1920/camera5.png'),
            camera6: assetUrl('../assets/image/screen/1920/camera6.png'),
            camera7: assetUrl('../assets/image/screen/1920/camera-3-0.png'),
            camera8: assetUrl('../assets/image/screen/1920/camera-4-0.png'),
            camera9: assetUrl('../assets/image/screen/1920/camera-5-0.png'),
            camera10:assetUrl('../assets/image/screen/1920/camera-6-0.png'),
            camera11: assetUrl('../assets/image/screen/1920/camera-1-0.png'),
            camera12:assetUrl('../assets/image/screen/1920/camera-2-0.png'),
            weatherImgs: {
                0: assetUrl('../assets/image/screen/weather/0.png'),
                1: assetUrl('../assets/image/screen/weather/1.png'),
                2: assetUrl('../assets/image/screen/weather/2.png'),
                3: assetUrl('../assets/image/screen/weather/3.png'),
                4: assetUrl('../assets/image/screen/weather/4.png'),
                5: assetUrl('../assets/image/screen/weather/5.png'),
                6: assetUrl('../assets/image/screen/weather/6.png'),
                7: assetUrl('../assets/image/screen/weather/7.png'),
                8: assetUrl('../assets/image/screen/weather/8.png'),
                9: assetUrl('../assets/image/screen/weather/9.png'),
                11: assetUrl('../assets/image/screen/weather/11.png'),
                14: assetUrl('../assets/image/screen/weather/14.png'),
                15: assetUrl('../assets/image/screen/weather/15.png'),
                16: assetUrl('../assets/image/screen/weather/16.png'),
                17: assetUrl('../assets/image/screen/weather/17.png'),
                18: assetUrl('../assets/image/screen/weather/18.png'),
                20: assetUrl('../assets/image/screen/weather/20.png'),
                29: assetUrl('../assets/image/screen/weather/29.png'),
                30: assetUrl('../assets/image/screen/weather/30.png'),
                53: assetUrl('../assets/image/screen/weather/53.png')
            },
            crossing: null



        }
    },

    created() {




    },
    mounted() {
        this.getTrackCode()

        this.initMap()
    },
    watch: {
        tracks(value) {

            if (this.homeMap.getSource('geojson-point')) {
                this.updateTrack()
            }
        },
        trackPath(value) {
            if (value) {
                this.homeMap.setLayoutProperty('geojson-line', 'visibility', 'visible');
            } else {
                this.homeMap.setLayoutProperty('geojson-line', 'visibility', 'none');
            }
        },
        crossId(item) {
            this.removePopup()

            this.homeMap.flyTo({
                center: [this.crossData.centerX, this.crossData.centerY]
            })
        },
        fixed(value) {
            if (this.crossing) {
                this.crossing.fixed = value
            }
        }
    },
    computed: {
        tracks() {
            return this.options.tracks
        },
        crossId() {
            return this.crossData.crossId
        }
    },
    beforeUnmount() {

        this.homeMap.remove()
    },
    methods: {
        getTrackCode() {

            var _this = this;
            var param = {

            };

            http.get(WEBSOCKET_URL + 'cross/api/getTrackCode?', { params: param }).then((data) => {
                this.trackCode = data.data;
            })
        },
        initMap() {
            const _this = this;
            const item = this.crossData;

            this.homeMap = new mapabcgl.Map({
                container: "homeMap",
                style: MAP_STYLE,
                zoom: MAP_ZOOM,
                maxZoom: maxZoom,
                minZoom: minZoom,
                pitch: 0,
                center: [item.centerX, item.centerY]
            });
            var pulsingDot = {
                    width: 100,
                    height: 100,
                    data: new Uint8Array(100 * 100 * 4),

                    onAdd: function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        this.context = canvas.getContext('2d');
                    },

                    render: function() {
                        var duration = 1000;
                        var t = (performance.now() % duration) / duration;

                        var radius = 100 / 2 * 0.3;
                        var outerRadius = 100 / 2 * 0.7 * t + radius;
                        var context = this.context;

                        // draw outer circle
                        context.clearRect(0, 0, this.width, this.height);
                        context.beginPath();
                        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                        context.fill();

                        // draw inner circle
                        context.beginPath();
                        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                        context.fillStyle = 'rgba(255, 100, 100, 1)';
                        context.strokeStyle = 'white';
                        context.lineWidth = 2 + 4 * (1 - t);
                        context.fill();
                        context.stroke();

                        // update this image's data with data from the canvas
                        this.data = context.getImageData(0, 0, this.width, this.height).data;

                        // keep the map repainting
                        _this.homeMap.triggerRepaint();

                        // return `true` to let the map know that the image was updated
                        return true;
                    }
                }
                this.homeMap.on("style.load", function() {

                    this.loadImage(_this.icon3, function(error, image) {

                        _this.homeMap.addImage('icon-camera', image);

                    })
                    this.loadImage(_this.camera1, function(error, image) {

                        _this.homeMap.addImage('icon-camera-1-1', image);

                    })
                    this.loadImage(_this.camera2, function(error, image) {

                        _this.homeMap.addImage('icon-camera-2-1', image);

                    })
                    this.loadImage(_this.camera3, function(error, image) {

                        _this.homeMap.addImage('icon-camera-3-1', image);

                    })
                    this.loadImage(_this.camera4, function(error, image) {

                        _this.homeMap.addImage('icon-camera-4-1', image);

                    })
                    this.loadImage(_this.camera5, function(error, image) {

                        _this.homeMap.addImage('icon-camera-5-1', image);

                    })
                    this.loadImage(_this.camera6, function(error, image) {

                        _this.homeMap.addImage('icon-camera-6-1', image);

                    })
                    this.loadImage(_this.camera11, function(error, image) {

                        _this.homeMap.addImage('icon-camera-1-0', image);

                    })
                    this.loadImage(_this.camera12, function(error, image) {

                        _this.homeMap.addImage('icon-camera-2-0', image);

                    })
                    this.loadImage(_this.camera7, function(error, image) {

                        _this.homeMap.addImage('icon-camera-3-0', image);

                    })
                    this.loadImage(_this.camera8, function(error, image) {

                        _this.homeMap.addImage('icon-camera-4-0', image);

                    })
                    this.loadImage(_this.camera9, function(error, image) {

                        _this.homeMap.addImage('icon-camera-5-0', image);

                    })
                    this.loadImage(_this.camera10, function(error, image) {

                        _this.homeMap.addImage('icon-camera-6-0', image);

                    })
                    this.loadImage(_this.icon9, function(error, image) {

                        _this.homeMap.addImage('icon-three', image);

                    })
                    this.loadImage(_this.huo, function(error, image) {

                        _this.homeMap.addImage('icon-huo', image);

                    })
                    this.loadImage(_this.evt, function(error, image) {

                        _this.homeMap.addImage('icon-evt', image);

                    })

                    this.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                    _this.$emit('parentMethod');
                    // _this.addLayer()
                    this.addLayer(_this.createCustomLayer('crossing'));
                    for (var key in _this.weatherImgs) {
                        (function(key) {
                            _this.homeMap.loadImage(_this.weatherImgs[key], function(error, image) {

                                _this.homeMap.addImage('w-' + key, image);
                            })

                        })(key)
                    }


                });
            this.homeMap.on("click", function(e) {


                _this.removePopup()

            });
        },
        addvehicleInfoBox() {

            var gloBal = this.trackCode,
                item = this.crossData,
                vehicleInfo = this.vehicleInfo;

            var clxx = this.$t("home.vehicleInformation"),
                clhp = this.$t("home.vehicleNumberPlate"),
                dqss = this.$t("home.currentSpeed"),
                cpys = this.$t("home.licensePlateColor"),
                xsjl = this.$t("home.travelDistance"),
                cplx = this.$t("home.licensePlateType"),
                dqjsd = this.$t("home.currentAcceleration"),
                cllx = this.$t("home.vehicleType"),
                ddsj = this.$t("home.waitingTime"),
                csys = this.$t("home.theColorOfCar"),
                xcsj = this.$t("home.journeyTime"),
                clpp = this.$t("home.vehicleBrands"),
                mblx = this.$t("home.targetType"),
                clzpp = this.$t("home.vehicleSub-brand"),
                tccs = this.$t("home.numberOfStops"),
                clnk = this.$t("home.vehicleYear"),
                ppcd = this.$t("home.matchingLane");
            var html = '<div class="vehicle-info-box">' +
                '<div class="vehicle-info-box-title">' + clxx + '</div>' +
                '<div class="vehicle-info">' +

                '<li><b>' + clhp + '</b><span>' + vehicleInfo.plateNumber + '</span></li>' +
                '<li><b>车辆编号</b><span>' + vehicleInfo.trackID + '</span></li>' +
                '<li><b>' + dqss + '</b><span>' + vehicleInfo.speed + ' km/h' + '</span></li>' +

                '<li><b>' + cpys + '</b><span>' + gloBal.plateColors[vehicleInfo.plateColor] + '</span></li>' +

                '<li><b>' + xsjl + '</b><span>' + vehicleInfo.areaDist + ' m' + '</span></li>' +
                '<li><b>' + cplx + '</b><span>' + gloBal.plateTypes[vehicleInfo.plateType] + '</span></li>' +

                '<li><b>' + dqjsd + '</b><span>' + vehicleInfo.at + 'm/s2' + '</span></li>' +
                '<li><b>' + cllx + '</b><span>' + gloBal.vehicleTypes[vehicleInfo.vehicleType] + '</span></li>' +

                '<li><b>' + ddsj + '</b><span>' + vehicleInfo.delayTime + ' s' + '</span></li>' +
                '<li><b>' + csys + '</b><span>' + gloBal.vehicleColors[vehicleInfo.vehicleColor] + '</span></li>' +
                '<li><b>' + xcsj + '</b><span>' + vehicleInfo.travelTime + ' s' + '</span></li>' +

                '<li><b>' + clpp + '</b><span>' + vehicleInfo.vehicleBrand + '</span></li>' +
                '<li><b>' + mblx + '</b><span>' + gloBal.objectType[vehicleInfo.objectType] + '</span></li>' +

                '<li><b>' + clzpp + '</b><span>' + vehicleInfo.vehicleSubbrand + '</span></li>' +

                '<li><b>' + tccs + '</b><span>' + vehicleInfo.stops + '</span></li>' +
                // '<li><b>' + clnk + '</b><span>' + vehicleInfo.vehicleYearBrand + '</span></li>' +
                '<li><b>' + ppcd + '</b><span>' + vehicleInfo.matchLaneName + '</span></li>' +

                '</div>' + '</div>'
            this.addPopup(html, vehicleInfo.lng, vehicleInfo.lat, '', [0, -20])
        },
        addPopup(html, lng, lat, type, offset) {
            if (popup) {
                popup.remove()
            }
            offset = offset ? offset : [0, 0]
            popup = new mapabcgl.Popup({
                    closeOnClick: true,
                    closeButton: false,
                    offset: offset
                })
                .setLngLat([lng, lat])
                .setHTML(html)
                .addTo(this.homeMap);

        },
        removePopup() {
            if (popup) {
                popup.remove()
                this.trackID = ''
            }
        },
        getIconSize(zoom) {
            if (zoom < 18) {
                return zoom * 0.00576 < 0.1 ? 0.1 : zoom * 0.00576;
            } else if (zoom >= 18 && zoom < 18.5) {
                return zoom * 0.0072;
            } else if (zoom >= 18.5 && zoom < 18.7) {
                return zoom * 0.00828;
            } else if (zoom >= 18.7 && zoom < 19) {
                return zoom * 0.00972;
            } else if (zoom >= 19 && zoom < 19.2) {
                return zoom * 0.01134;
            } else if (zoom >= 19.2 && zoom < 19.5) {
                return zoom * 0.01296;
            } else if (zoom >= 19.5 && zoom < 19.8) {
                return zoom * 0.01539;
            } else if (zoom >= 19.8 && zoom < 20.1) {
                return zoom * 0.01863;
            } else if (zoom >= 20.1 && zoom < 20.4) {
                return zoom * 0.02349;
            } else if (zoom >= 20.4 && zoom < 20.7) {
                return zoom * 0.02835;
            } else if (zoom >= 20.7 && zoom < 21) {
                return zoom * 0.0324;
            } else if (zoom >= 21) {
                return zoom * 0.03807;
            } else {
                return ((zoom - 18) + 0.1) * 0.23 < 0.1 ? 0.1 : ((zoom - 18) + 0.1) * 0.23;
            }
        },

        addLayer() {

            const _this = this;

            if (!_this.homeMap.getSource('geojson-point')) {

                var lnglats = [];
                var features = [];
                var obj = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": []


                    },

                    "properties": {},
                }
                var lineObj = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [

                        ]
                    },

                    "properties": {},
                }
                lnglats.push(obj)
                features.push(lineObj)
                _this.homeMap.addSource("geojson-point", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": lnglats
                    }
                });
                _this.homeMap.addSource("geojson-line", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": lnglats
                    }
                });

                // var img = _this.options.vehiclePlate ? ["concat", "sprite_car-", ["to-string", ["get", "vehicleType"]], '-', ["to-string", ["get", "vehicleColor"]]] : "sprite_car-1-1";

                // var size = _this.getIconSize(_this.homeMap.getZoom());

                // 车辆图层
                // _this.homeMap.addLayer({
                //     "id": "geojson-point",
                //     "type": "symbol",
                //     "source": "geojson-point",
                //     "minzoom": 17,
                //     "layout": {
                //         "icon-image": img,
                //         "icon-size": 0.1,
                //         "icon-rotate": ["get", "driveAngle"],
                //         "text-field": _this.options.vehiclePlate ? "{plateNumber}" : '',
                //         "text-size": 12,
                //         "icon-allow-overlap": true,
                //         "icon-ignore-placement": true,
                //         "text-allow-overlap": true,
                //         "text-ignore-placement": true,
                //         "text-font": [
                //             "sourcehansanscn-normal"
                //         ]
                //     },
                //     paint: {
                //         "text-halo-color": ["to-string", ["get", "plateBgColor"]],
                //         "text-color": ["to-string", ["get", "plateTextColor"]],
                //         "text-halo-width": 2

                //     },

                // });

                // 车辆圆点图层
                _this.homeMap.addLayer({
                    "id": "geojson-circle",
                    "type": "circle",
                    "source": "geojson-point",
                    "maxzoom": 17,
                    "minzoom": 12,
                    paint: {
                        "circle-blur": 1,
                        "circle-radius": 5,
                        "circle-color": ["to-string", ["get", "carPointColor"]],
                        "circle-stroke-color": ["to-string", ["get", "carPointColor"]],
                        "circle-stroke-width": 1

                    },

                });
                // 车辆轨迹线图层
                _this.homeMap.addLayer({
                    "id": "geojson-line",
                    "type": "line",
                    "source": "geojson-line",
                    "minzoom": 17,
                    paint: {

                        "line-color": "#fc7b6c",
                        "line-width": 2

                    },
                    layout: {
                        visibility: _this.trackPath ? 'visible' : 'none'
                    }
                });

                // _this.homeMap.on('click', 'geojson-point', function(e) {

                //     var item = e.features[0].properties;


                //     _this.trackID = item.trackID;


                // })
                // _this.homeMap.on('mousemove', 'geojson-point', function(e) {
                //     _this.homeMap.getCanvas().style.cursor = 'pointer';
                // })
                // _this.homeMap.on('mouseout', 'geojson-point', function(e) {
                //     _this.homeMap.getCanvas().style.cursor = '';
                // })
            }

            if (!this.options.geojson) {
                return
            }
            // 道路停止线图层
            var options = {
                maps: this.homeMap,
                features: this.options.geojson.lineString,
                opacity: 1,
                id: 'stopLine',
                color: ['get', 'fillColor'],
                strokeWeight: ["*", ["get", "type"], 4],
                beforeId: 'hdmap_dlm_z17_z23_zlevel'
            }
            this.mapUtils.addgeojsonLine(options);
            // 道路灯态计时图层
            var options1 = {
                maps: this.homeMap,
                features: this.options.geojson.textPoint,
                textField: "{name}",
                id: 'textPoint',
                textHaloColor: ["to-string", ["get", "fillColor"]],
                textColor: '#fff',
                // beforeId: 'geojson-point'

            }
            this.mapUtils.addgeojsonPoint(options1);
            // 道路检测器面图层
            var options2 = {
                maps: this.homeMap,
                features: this.options.geojson.dataArea,
                id: 'dataArea',
                color: ['get', 'fillColor'],
                opacity: ['get', 'fillOpacity'],
                beforeId: 'hdmap_dlm_z17_z23_zlevel'
            }
            this.mapUtils.addgeojsonPolygon(options2);

        },
        createCustomLayer(layerName) {
            var _this = this;
            return {
                id: layerName,
                type: 'custom',
                renderingMode: '3d',
                onAdd: function(map, gl) {
                    _this.crossing = new MapABCCrossing(map, gl, {
                        modelPath: modelPath,
                        defaultLights: true,
                        enableSelectingObjects: true,
                        minZoom: 17,
                        modelScale: 0.8, //模型大小
                        labelHeight: 1.8, //车牌高度
                        fixed: _this.fixed

                    });
                },
                render: function(gl, matrix) {
                    _this.crossing.update();
                }
            };
        },
        updateTrack() {
            var _this = this;

            if (!this.options.play) {
                return
            }

            this.crossing && this.crossing.updateTrack(this.options.tracks.track);
            var size = _this.getIconSize(_this.homeMap.getZoom());
            var arr = this.options.tracks.track;
            var lnglats = [];
            var features = [];
            var trackIdArr = [];
            arr.forEach(t => {
                t.iconSize = size;
                /* 去掉对车头的修正
                if (t.objectType == 1) {
                    t.driveAngle = t.driveAngle - _this.homeMap.getBearing();
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
                var path = [];
                var blindZone = [];
                lnglats.push(obj)
                if (isProtobuf == 1) {
                    t.path.forEach(p => {
                        path.push(p.items)
                    })
                    if (!!t.blindZone) {
                      t.blindZone.forEach(p => {
                        blindZone.push(p.items)
                      })
                    }
                } else {
                    path = t.path;
                    if (!!t.blindZone) {
                      blindZone = t.blindZone;
                    }
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
                var zoneObj = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": blindZone
                    },
                    "properties": t,
                }
                features.push(zoneObj)

                trackIdArr.push(t.trackID)
                if (t.trackID == _this.trackID) {

                    _this.vehicleInfo = t;
                    _this.addvehicleInfoBox()
                }

                var a = trackIdArr.indexOf(_this.trackID)
                if (a < 0) {
                    if (popup) {
                        popup.remove()
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


            // var img = _this.options.vehiclePlate ? ["concat", "sprite_car-", ["to-string", ["get", "vehicleType"]], '-', ["to-string", ["get", "vehicleColor"]]] : "sprite_car-1-1";

            // _this.homeMap.setLayoutProperty('geojson-point', 'icon-image', img);
            // _this.homeMap.setLayoutProperty('geojson-point', "text-field", _this.options.vehiclePlate ? "{plateNumber}" : '');
            // _this.homeMap.setLayoutProperty('geojson-point', 'icon-size', ['get', 'iconSize']);
            _this.homeMap.getSource('geojson-point').setData(data2)
            _this.homeMap.getSource('geojson-line').setData(linedata2)

            var stopLine = _this.homeMap.getSource('stopLine');
            var textPoint = _this.homeMap.getSource('textPoint');
            var dataArea = _this.homeMap.getSource('dataArea');
            if (!stopLine) {
                return
            }
            var textSize = _this.homeMap.getZoom() + 1;
            _this.homeMap.setLayoutProperty('textPoint', 'text-size', textSize);
            stopLine._data.features.forEach((item, i) => {
                var index = this.options.tracks.lineString.findIndex(t => t.id === item.properties.id)
                if (index >= 0) {
                    item.properties = this.options.tracks.lineString[index]
                }
            })

            textPoint._data.features.forEach((item, i) => {
                var index = this.options.tracks.textPoint.findIndex(t => t.id === item.properties.id)
                if (index >= 0) {
                    item.properties = this.options.tracks.textPoint[index]
                }
            })

            dataArea._data.features.forEach((item, i) => {
                if (item.properties) {
                    var index = this.options.tracks.dataArea.findIndex(t => t.id === item.properties.id)
                    if (index >= 0) {
                        item.properties = this.options.tracks.dataArea[index]
                    }
                }
            })

            stopLine.setData(stopLine._data)
            textPoint.setData(textPoint._data)
            dataArea.setData(dataArea._data)

        },


    }

});
</script>
<style>
.track-play-map-box {
    width: 100%;
    height: 100%;
}
</style>
