import Vue from 'vue'
const _this = new Vue();
import CryptoJS from "crypto-js";
import possibleJamImg from '../assets/image/possibleJam.png'
import dirImg from '../assets/image/dir.png'
export default {

    param: {
        markers: [],
        layers: [],
        labels: [],
        Intertime: null
    },
    Img: {
        'cross': possibleJamImg,
        'dir': dirImg
    },


    pulsingDot: {
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
            context.fillStyle = 'rgba(0,242,255,1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data;

            // keep the map repainting
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    },
    pulsingDot1: {
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
            context.fillStyle = 'rgba(199,26,52,1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data;

            // keep the map repainting
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    },
    /**
     * [setBestMap description]
     * @author liushan
     * @DateTime 2019-03-05T16:25:13+0800
     * @param    {Array}                lnglats
     * @param    {object}                 options
     */
    setBestMap(lnglats, options) {

        options = Object.assign({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            maxZoom: 24,
            pitch: 60,
            maps: null
        }, options);
        if (lnglats.length > 0) {
            options.maps.fitBounds(turf.bbox(turf.points(lnglats)), {
                padding: {
                    top: options.top,
                    bottom: options.bottom,
                    left: options.left,
                    right: options.right
                },
                maxZoom: options.maxZoom,
                pitch: options.pitch
            });
        }

    },

    addmapMarker(options, callback) {

        options = Object.assign({
            maps: null, //地图对象
            lng: '', //经度
            lat: '', //纬度
            markerType: 'all', //图标类型
            imgType: 'poi', //图片
            width: 24, //容器宽度
            height: 24, //容器高度
            title: '', //marker名称
            item: {}, //marker信息
        }, options);

        const img = this.Img[options.imgType];
        if (options.lng && options.lat) {
            const html = document.createElement('div');
            html.title = options.title;
            if (options.markerType == 'c3') {
                html.className = "animation";
                html.style.cssText = ' background-image:url(' + img + ');width:' + options.width + 'px;height:' + options.height + 'px;cursor:pointer;background-size: cover;'

            } else {
                html.style.cssText = ' background:url(' + img + ') no-repeat;width:' + options.width + 'px;height:' + options.height + 'px;cursor:pointer'

            };
            const marker = new mapabcgl.Marker(html)
                .setLngLat([options.lng, options.lat])
                .addTo(options.maps);

            html.addEventListener('click', function(e) {
                if (callback) {
                    callback(options.item, e);
                };

            });
            const obj = {
                marker: marker,
                type: options.markerType
            };
            this.param.markers.push(obj);
        } else {
            _this.$message.error('经纬度缺失');
        };

    },


    addPopup(options) {

        options = Object.assign({
            maps: null,
            lnglat: [],
            type: 'popup',
            offset: [0, 0],
            html: ''
        }, options);

        var popup = new mapabcgl.Popup({
                closeOnClick: true,
                closeButton: false,
                offset: options.offset
            })
            .setLngLat(options.lnglat)
            .setHTML(options.html)
            .addTo(options.maps);
        var obj = {
            marker: popup,
            type: options.type
        }
        this.param.markers.push(obj)
    },

    addmapLine(options) {

        options = Object.assign({
            maps: null, //地图对象
            type: 'line',
            id: 'line',
            lines: [],
            color: 'red',
            strokeWeight: 8,
            opacity: 0.8,
            visibility: 'visible',
            dasharray: [1000000, 0],
            arrow: false,
            minzoom: 1,
            lineGradient: []
        }, options);
        // console.log(options)
        if (options.lines.length == 0) {
            _this.$message.error('经纬度缺失');
            return
        };
        var geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": options.lines
                }
            }]
        };


        options.maps.addLayer({
            "id": options.id,
            "type": "line",
            "source": {
                "type": "geojson",
                "data": geojson,
                "lineMetrics": true,
            },
            "minzoom": options.minzoom,

            "layout": {
                'line-cap': 'round',
                'line-join': 'round',
                "visibility": options.visibility
            },
            "paint": {
                "line-color": options.color,
                "line-width": options.strokeWeight,
                "line-opacity": options.opacity,
                // "line-gradient":options.lineGradient,
                // "line-dasharray": options.dasharray

            }
        });
        console.log("mapUtils addLayer " + options.id)

        if (options.arrow) {
            options.maps.addLayer({
                "id": options.id + 1,
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": geojson
                },
                "minzoom": options.minzoom,

                "paint": {
                    "line-width": options.strokeWeight,
                    "line-pattern": 'dir',

                }
            });
            console.log("mapUtils addLayer " + (options.id+1))

        };
        var obj = {
            type: options.type,
            layers: options.id
        }

        this.param.layers.push(obj);
        return obj;
    },
    addgeojsonLine(options) {
        options = Object.assign({
            maps: null, //地图对象
            type: 'line',
            id: 'geojson-line',
            features: [],
            color: 'red',
            strokeWeight: 8,
            opacity: 1,
            visibility: 'visible',
            beforeId: ''

        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": options.features
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "line",
            "source": options.id,
            "paint": {
                "line-color": options.color,
                "line-width": options.strokeWeight,
                "line-opacity": options.opacity,

            },
            "layout": {
                "visibility": options.visibility
            }
        }, options.beforeId);
        console.log("mapUtils addLayer " + options.id)

    },
    addgeojsonPolygon(options) {
        options = Object.assign({
            maps: null, //地图对象
            type: 'fill',
            id: 'geojson-polygon',
            features: [],
            color: 'red',
            strokeWeight: 8,
            opacity: 0.8,
            visibility: 'visible',
            beforeId: ''

        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": options.features
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "fill",
            "source": options.id,
            "paint": {
                "fill-color": options.color,
                "fill-opacity": options.opacity,
            }
        }, options.beforeId);
        console.log("mapUtils addLayer " + options.id)

    },
    addPoint(options, callback, callback1, callback2) {
        options = Object.assign({
            maps: null, //地图对象
            id: 'point',
            coordinates: [],
            iconImg: '',
            iconSize: 1,
            item: null,
            type: '',
            beforeId: '',
            iconOverlap: true,
            iconPlacement: true,
            textOverlap: true,
            textPlacement: true,
            visibility: 'visible'
        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": options.coordinates
                    },
                    "properties": options.item
                }]
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "symbol",
            "source": options.id,
            "layout": {
                "icon-image": options.iconImg,
                "icon-size": options.iconSize,
                "icon-allow-overlap": options.iconOverlap,
                "icon-ignore-placement": options.iconPlacement,
                "text-allow-overlap": options.textOverlap,
                "text-ignore-placement": options.textPlacement,
                "visibility": options.visibility

            },

        }, options.beforeId);
        console.log("mapUtils addLayer " + options.id)

        var obj = {
            layers: options.id,
            type: options.type
        }
        this.param.layers.push(obj);
        options.maps.on('click', options.id, function(e) {
            if (callback) {
                callback(options.item, e)
            }

        })
        options.maps.on('mousemove', options.id, function() {
            if (callback1) {
                callback1(options.item)
            }

        })
        options.maps.on('mouseleave', options.id, function() {
            if (callback2) {
                callback2(options.item)
            }

        })
    },
    addgeojsonPoint(options) {
        options = Object.assign({
            maps: null, //地图对象
            id: 'geojson-point',
            features: [],
            iconImg: '',
            textField: '',
            iconSize: 8,
            textHaloColor: '',
            textColor: '',
            visibility: 'visible',

        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": options.features
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "symbol",
            "source": options.id,
            "layout": {
                "icon-image":options.iconImg,
                "icon-size": options.iconSize,

                "text-field": options.textField,
                "text-padding": 18,
                "text-allow-overlap": true,
                "text-ignore-placement": true,
                "text-size": 18,
                "text-font": [
                    "sourcehansanscn-normal"
                ],
                "text-rotation-alignment": "auto",
                // "icon-text-fit-padding":8
            },
            "paint": {
                "text-halo-color": options.textHaloColor,
                "text-color": options.textColor,
                "text-halo-width": 1

            }
        });
        console.log("mapUtils addLayer " + options.id)

    },
    addHeatmap(options){
        options = Object.assign({
            maps: null, //地图对象
            id: 'heatmap-source',
            features: [],
            radius:30

        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": options.features
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "heatmap",
            "source": options.id,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
                "heatmap-radius": options.radius,
                //一个热力图单个数据点的热力程度，默认值为1；要求：值大于等于0，支持使用property中某个的热力值
                "heatmap-weight": {
                    "property": "mag",
                    "stops": [[0, 0], [3, 1], [10, 2]]
                },
                // 用于统一控制热力值的强度，默认值1；要求：值大于等于0，可根据zoom level进行插值设置
                "heatmap-intensity": 1,
                // 表示热力图颜色阶梯，阶梯的值域范围为0-1，默认值为["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "red"
                ],
                // 表示热力图的不透明度，默认值1；值域范围0-1，可根据zoom level进行插值设置
                "heatmap-opacity": 1,
            }
        });
        console.log("mapUtils addLayer " + options.id)
    },
    addHeatmapLayer(options){
        options = Object.assign({
            maps: null, //地图对象
            id: 'heatmap-source',
            features: [],
            radius:30

        }, options);

        options.maps.addSource(options.id, {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": options.features
            }
        });

        options.maps.addLayer({
            "id": options.id,
            "type": "heatmap",
            "source": options.id,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
                "heatmap-radius": options.radius,
                //一个热力图单个数据点的热力程度，默认值为1；要求：值大于等于0，支持使用property中某个的热力值
                "heatmap-weight": {
                    "property": "mag",
                    "stops": [[0, 0], [3, 1], [10, 2]]
                },
                // 用于统一控制热力值的强度，默认值1；要求：值大于等于0，可根据zoom level进行插值设置
                "heatmap-intensity": 1,
                // 表示热力图颜色阶梯，阶梯的值域范围为0-1，默认值为["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "red"
                ],
                // 表示热力图的不透明度，默认值1；值域范围0-1，可根据zoom level进行插值设置
                "heatmap-opacity": 1,
            }
        }, options.layer);
        console.log("mapUtils addLayer " + options.id)
    },
    setVisibility(visibility, type, maps) {
        var layers = this.param.layers;

        if (layers.length > 0) {
            for (var i = 0; i < layers.length; i++) {
                if (type) {
                    if (layers[i].type == type) {
                        maps.setLayoutProperty(layers[i].layers, 'visibility', visibility);
                    }
                } else {
                    maps.setLayoutProperty(layers[i].layers, 'visibility', visibility);
                }

            };

        };
    },


    addmapPolygon(options, callback) {
        options = Object.assign({
            maps: null, //地图对象
            type: 'Polygon',
            id: 'Polygon',
            gons: [],
            color: 'red',
            opacity: 0.8,
            item: null,
            index: null
        }, options);

        if (options.gons.length == 0) {
            _this.$message.error('经纬度缺失');
            return
        };
        var geojson = {

            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [options.gons]
            }

        };


        options.maps.addLayer({
            "id": options.id,
            "type": "fill-extrusion",
            "source": {
                "type": "geojson",
                "data": geojson
            },
            "maxzoom": 15,
            "paint": {
                "fill-extrusion-opacity": options.opacity,
                "fill-extrusion-color": options.color,
                'fill-extrusion-height': [
                    "interpolate", ["linear"],
                    ["zoom"],
                    0, 0,
                    18, 0
                ],

            }
        });
        console.log("mapUtils addLayer " + options.id)

        var obj = {
            type: options.type,
            layers: options.id
        }

        this.param.layers.push(obj);
        options.maps.on('click', options.id, function() {
            if (callback) {
                callback(options.item, options.index)
            }

        })

    },

    addmapLabel(options, callback) {
        options = Object.assign({
            maps: null, //地图对象
            bgcolor: '#458e25',
            shadowcolor: null,
            lng: '', //经度
            lat: '', //纬度
            name: '',
            type: 'label',
            index: null,
            item: {}, //信息
            fontsize: 12,
            paddingtop: 0,
            paddingleft: 5
        }, options);
        var html = document.createElement('div');
        var b = document.createElement("b");
        var span = document.createElement("span");
        // b.innerHTML = options.index + 1;
        b.className = "maplabelIndex";

        html.appendChild(b);

        span.innerHTML = options.name;
        span.style.cssText = 'z-index:1000;display:inline-block;background:' + options.bgcolor + ';cursor:pointer;' + 'font-size:' + options.fontsize + 'px;padding:' + options.paddingtop + 'px ' + options.paddingleft + 'px;';

        html.appendChild(span);



        var marker = new mapabcgl.Marker(html)
            .setLngLat([options.lng, options.lat])
            .addTo(options.maps);
        html.addEventListener('click', function() {
            if (callback) {
                callback(options.item, options.index);
            }

        })

        var obj = {
            marker: marker,
            type: options.type
        }
        this.param.markers.push(obj)



    },
    addPointAndLine(options) {
        options = Object.assign({
            maps: null, //地图对象
            geojson: {
                "type": "FeatureCollection",
                "features": []
            }
        }, options);

        options.maps.addSource('geojson', {
            "type": "geojson",
            "data": options.geojson
        });
        options.maps.addLayer({
            id: 'measure-points',
            type: 'circle',
            source: 'geojson',
            paint: {
                'circle-radius': 5,
                'circle-color': '#36a3bf'
            },
            filter: ['in', '$type', 'Point']
        });
        options.maps.addLayer({
            id: 'measure-lines',
            type: 'line',
            source: 'geojson',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#36a3bf',
                'line-width': 2.5
            },
            filter: ['in', '$type', 'LineString']
        });
    },
    geometricComputation(options) {
        var _this = this;
        options = Object.assign({
            maps: null, //地图对象
            geojson: {
                "type": "FeatureCollection",
                "features": []
            },
            linestring: {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            },

        }, options);

        options.maps.on('click', function(e) {


            _this.setDrawtipData(options, e)
        });
        options.maps.on('mousemove', function(e) {
            var features = options.maps.queryRenderedFeatures(e.point, { layers: ['measure-points'] });
            options.maps.getCanvas().style.cursor = (features.length) ? 'pointer' : 'crosshair';
        });
    },
    setDrawtipData(options, e) {
        if (!options.maps.getSource('geojson')) {

            return
        }
        var distanceContainer = document.getElementById('distance');
        var features = options.maps.queryRenderedFeatures(e.point, { layers: ['measure-points'] });
        if (options.geojson.features.length > 1) options.geojson.features.pop();

        distanceContainer.innerHTML = '';
        if (features.length) {
            var id = features[0].properties.id;
            options.geojson.features = options.geojson.features.filter(function(point) {
                return point.properties.id !== id;
            });
        } else {
            var point = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        e.lngLat.lng,
                        e.lngLat.lat
                    ]
                },
                "properties": {
                    "id": String(new Date().getTime())
                }
            };

            options.geojson.features.push(point);
        }

        if (options.geojson.features.length > 1) {
            options.linestring.geometry.coordinates = options.geojson.features.map(function(point) {
                return point.geometry.coordinates;
            });

            options.geojson.features.push(options.linestring);

            var value = document.createElement('span');
            value.textContent = '总距离: ' + turf.lineDistance(options.linestring).toLocaleString() * 1000 + 'm';
            distanceContainer.appendChild(value);

        }

        options.maps.getSource('geojson').setData(options.geojson);


    },
    clearDrawtip(options) {
        options = Object.assign({
            maps: null, //地图对象
            geojson: {
                "type": "FeatureCollection",
                "features": []
            },
            linestring: {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            }
        }, options);

        var distanceContainer = document.getElementById('distance');
        distanceContainer.innerHTML = '';
        options.maps.removeLayerAndSource('measure-lines');
        options.maps.removeLayerAndSource('measure-points');
        options.maps.removeSource("geojson")
        options.maps.on('mousemove', function(e) {

            options.maps.getCanvas().style.cursor = '';
        });

    },
    clearTimer() {
        clearInterval(this.param.Intertime)
    },
    removeLayers(type, maps) {

        var maps = maps ? maps : map;
        var layers = this.param.layers,
            _index = [],
            k = 0;;

        if (layers.length > 0) {


            if (type) {

                layers.forEach(item => {
                    if (item.type == type) {
                        maps.removeLayerAndSource(item.layers);
                        maps.removeLayerAndSource(item.layers + 1);
                    }

                })
                layers.splice(layers.findIndex(item => item.type === type), 1)
            } else {
                layers.forEach(item => {
                    maps.removeLayerAndSource(item.layers);
                    maps.removeLayerAndSource(item.layers + 1);
                })
                layers = [];

            }



        };

    },

    minremoveLayers(type) {
        var layers = this.param.layers;

        if (layers.length > 0) {
            for (var i = 0; i < layers.length; i++) {
                if (type) {
                    if (layers[i].type == type) {

                        minmap.removeLayerAndSource(layers[i].layers);
                    }
                } else {

                    minmap.removeLayerAndSource(layers[i].layers);
                    this.param.layers = [];
                }


            };

        };

    },
    removeMarkers(type) {

        var _this = this;
        var markers = this.param.markers;
        if (markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                if (type) {
                    if (markers[i].type == type) {

                        markers[i].marker.remove();
                    }
                } else {
                    markers[i].marker.remove();
                    this.param.markers = [];
                }

            };

        };

    },
    removeLabels() {
        var labels = this.param.labels;
        if (labels.length > 0) {
            for (var i = 0; i < labels.length; i++) {
                labels[i].remove()
            };
            this.param.labels = [];
        };

    },
    removeAll() {

        this.removeLayers();
        this.removeMarkers();
        this.removeLabels();
    },
    // @params(num:number),分钟
    getDateYMD(dateType, num, dateStr,s) {
        var num = num ? num : 0;
        var s = s ? s : 0;
        var date = dateStr ? dateStr.replace(/-/g, '/') : '';
        var myDate = date ? new Date(date) : new Date();
        myDate.setMinutes(myDate.getMinutes() + num);
        myDate.setSeconds(myDate.getSeconds() + s);
        var m = myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        var d = myDate.getDate() <= 9 ? '0' + (myDate.getDate()) : myDate.getDate();

        var hour = myDate.getHours() < 10 ? '0' + (myDate.getHours()) : myDate.getHours();
        var min = myDate.getMinutes();
        var s = myDate.getSeconds();
        if (dateType == "hms") {
            return hour + ':' + (min < 10 ? "0" + min : min) + ':' + (s < 10 ? "0" + s : s);
        };
        if (dateType == "ymdhms") {
            return myDate.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min) + ':' + (s < 10 ? "0" + s : s);
        };
        if (dateType == "ymdhm") {
            return myDate.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min);
        };
        if (dateType == "ymd") {
            return myDate.getFullYear() + '-' + m + '-' + d;
        };

        if (dateType == "ym") {
            return myDate.getFullYear() + '-' + m
        }
        if (dateType == "y") {
            return myDate.getFullYear()
        }
        if (dateType == "week") {
            var day = myDate.getDay();
            var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var week = weeks[day];
            return week;
        }

    },

    Encrypt(word) {
        var keyHex = CryptoJS.enc.Utf8.parse("1234567890mapabc");
        var iv = CryptoJS.enc.Utf8.parse("1234560405060708");
        var encrypted = CryptoJS.AES.encrypt(word, keyHex, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

}
