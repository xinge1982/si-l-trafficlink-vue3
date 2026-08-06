<template>
    <div class="box cross-valuate-box">
        <div class="crossInfo">
            <div class="crossInfo_content">
                <div class="cesiumMap" style="width:100%;height:100%;">
                    <div id="cesiumMap" style="width:100%;height:100%;" ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        track: null
    },
    data() {
        return {
            trackMgr: null,
            crossData: '',
            viewer: null,
            weatherSystem: null,
            defaultSkyAtmosphere: {},
            demoTrack: null,
            demoTrackPerson: {
                "crossId": "13EUF0ALN60",
                "trackID": 9900001,
                "objectType": 3,
                "vehicleColor": 0,
                "vehicleType": 301,
                "vehicleBrand": "",
                "vehicleSubbrand": "",
                "vehicleYearBrand": "",
                "entryLane": "",
                "exitLane": "13EUF0ALN6013EQQ0ALP20022011",
                "matchLane": "13EUF0ALN6013EQQ0ALP20022011",
                "matchLaneName": "西北  1",
                "driveAngle": 303,
                "entryRoad": 0,
                "exitRoad": 0,
                "lat": 34.9956137,
                "lng": 116.2135323,
                "plateColor": 6,
                "plateNumber": "",
                "plateType": 0,
                "speed": 0.0,
                "at": 0.08,
                "state": 1,
                "crossing": 0,
                "fromWay": 0,
                "areaDist": 0.0,
                "stopLineDist": -1,
                "delayTime": 0,
                "stops": 0,
                "travelTime": 26.96,
                "time": "1760943037120",
                "plateBgColor": "#0000ff",
                "plateTextColor": "#ffffff",
                "lampState": "",
                "remainTime": 0,
                "lampEstimated": 0,
                "driveStops": 0,
                "idealPassTime": 0,
                "passTime": 0,
                "sectionPlanId": "",
                "timePlanId": "",
                "detectorId": "",
                "excludeArea": 0,
                "crossPosition": 0,
                "recoveryCross": "1082122878089",
                "carPointColor": "#e8e8e8",
                "trackSign": "",
                "ridOffset": 153.2,
                "z": 0,
                "queueNumber": 0,
                "headTime": 0,
                "queueEnd": 0,
                "radarSpeed": 0.0,
                "specialVehicleType": "非特殊车型",
                "entryCongestionFlag": 0,
                "originTrackId": 0,
                "queueZone": 1602,
                "speedConfidence": 0,
                "uniqId": "13EUF0ALN60-1760943010160-9900001",
                "metricLane": "",
                "showFocus": 0,
                "rid": "13EUF0ALN6013EQQ0ALP200",
                "ridKmPile": 0,
                "posConfidence": 0,
                "excludeEvents": "",
                "enforceEvents": "",
                "systemType": 1,
                "iconSize": 0.1
            },
            demoTrackStopCar: {
                "crossId": "13EUF0ALN60",
                "trackID": 9900002,
                "objectType": 1,
                "vehicleColor": 0,
                "vehicleType": 1,
                "vehicleBrand": "",
                "vehicleSubbrand": "",
                "vehicleYearBrand": "",
                "entryLane": "",
                "exitLane": "13EUF0ALN6013EQQ0ALP20022011",
                "matchLane": "13EUF0ALN6013EQQ0ALP20022011",
                "matchLaneName": "西北  1",
                "driveAngle": 303,
                "entryRoad": 0,
                "exitRoad": 0,
                "lat": 34.9956137,
                "lng": 116.2135323,
                "plateColor": 6,
                "plateNumber": "鲁NAS121",
                "plateType": 0,
                "speed": 0.0,
                "at": 0.08,
                "state": 1,
                "crossing": 0,
                "fromWay": 0,
                "areaDist": 0.0,
                "stopLineDist": -1,
                "delayTime": 0,
                "stops": 0,
                "travelTime": 26.96,
                "time": "1760943037120",
                "plateBgColor": "#0000ff",
                "plateTextColor": "#ffffff",
                "lampState": "",
                "remainTime": 0,
                "lampEstimated": 0,
                "driveStops": 0,
                "idealPassTime": 0,
                "passTime": 0,
                "sectionPlanId": "",
                "timePlanId": "",
                "detectorId": "",
                "excludeArea": 0,
                "crossPosition": 0,
                "recoveryCross": "1082122878089",
                "carPointColor": "#e8e8e8",
                "trackSign": "",
                "ridOffset": 153.2,
                "z": 0,
                "queueNumber": 0,
                "headTime": 0,
                "queueEnd": 0,
                "radarSpeed": 0.0,
                "specialVehicleType": "非特殊车型",
                "entryCongestionFlag": 0,
                "originTrackId": 0,
                "queueZone": 1602,
                "speedConfidence": 0,
                "uniqId": "13EUF0ALN60-1760943010160-9900002",
                "metricLane": "",
                "showFocus": 0,
                "rid": "13EUF0ALN6013EQQ0ALP200",
                "ridKmPile": 0,
                "posConfidence": 0,
                "excludeEvents": "",
                "enforceEvents": "",
                "systemType": 1,
                "iconSize": 0.1
            }
        }
    },
    created() {

    },
    mounted() {
        this.initViewer()
    },
    watch: {
        track(value) {
            this.updateTrack()
        },
    },
    methods: {
        initViewer() {
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNDRmOTdiMS1mNWQ1LTQ0MTctYWRhMC0zNGZjZjk1NjgzNmQiLCJpZCI6MTAxNjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTU4MTQ0NjN9.ejboCzDUFnHQ1Jx7EIKzw8KnxM9ZUC0-W_lcWldREOs';

            const viewer = this.viewer = new Cesium.Viewer('cesiumMap', {
                imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),
                selectedImageryProviderViewModel: null, // 禁用默认选择的图层
                baseLayer: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                shouldAnimate: true,
                navigationHelpButton: false, //右上角 Help
                animation: false, // 左下角 圆盘动画控件
                timeline: true, //时间轴
                fullscreenButton: false, //右下角 全屏控件
                // contextOptions: {
                //     webgl: {
                //         logarithmicDepthBuffer: false,
                //     },
                //     requestWebgl2: true, //需要WebGL2.0
                //     scene3DOnly: true, //仅支持3D模式
                // },
            });
            const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((click) => {
                // 获取点击的地球坐标
                const pickedPosition = viewer.scene.pickPosition(click.position);

                console.log(pickedPosition)

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            // 启用太阳光照
            //viewer.scene.globe.enableLighting = true;

            // 设置时间，以观察动态的光照效果
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(2024, 10, 18, 12));

            viewer.scene.globe.baseColor = Cesium.Color.LIGHTSLATEGRAY; // 修改基础颜色
            viewer.scene.globe.dayAlpha = 1.0; // 白天透明度

            // 启用模型阴影
            //viewer.shadows = true;

            // 调整光源强度
            viewer.scene.light.color = new Cesium.Color(1, 1, 1, 0.8);
            // viewer.scene.light.color = new Cesium.Color(255.0/255.0, 223.0/255.0, 186.0/255.0, 0.8); // 金色和淡粉色的柔和混合，表现出温暖的晨光
            // viewer.scene.light.color = new Cesium.Color(255.0/255.0, 204.0/255.0, 153.0/255.0, 0.8); // 温暖的橙黄色，模拟日落时柔和的暖光。

            // 先移除所有默认图层
            viewer.imageryLayers.removeAll();

            // 最小缩放距离
            viewer.scene.screenSpaceCameraController.maximumZoomDistance = 300;

            // 添加影像图
            if (!!imagerUrl) {
                imagerUrl.forEach(item => {
                    let layers = viewer.imageryLayers;
                    var imageryProvider = new Cesium.UrlTemplateImageryProvider(item);
                    const imageryLayer2 = Cesium.ImageryLayer.fromProviderAsync(
                        imageryProvider
                    );
                    layers.add(imageryLayer2);
                });
            }

            // viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.0); //高分屏比例
            viewer.scene.postProcessStages.fxaa.enabled = true; //开启抗锯齿
            viewer.scene.globe.depthTestAgainstTerrain = false; //开启地形深度

            this.defaultSkyAtmosphere.hueShift = viewer.scene.skyAtmosphere.hueShift
            this.defaultSkyAtmosphere.saturationShift = viewer.scene.skyAtmosphere.saturationShift
            this.defaultSkyAtmosphere.brightnessShift = viewer.scene.skyAtmosphere.brightnessShift

            // 导航控件
            if (Cesium.viewerCesiumNavigationMixin) {
                var naviParams = {
                    defaultResetView: true,
                    enableCompass: true,
                    enableZoomControls: true,
                    enableDistanceLegend: true,
                    enableCompassOuterRing: true,
                };
                viewer.extend(Cesium.viewerCesiumNavigationMixin, {
                    defaultResetView: Cesium.defaultValue(naviParams.defaultResetView, Cesium.Cartographic.fromDegrees(110, 38, 9000000)), // 默认视图。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
                    enableCompass: Cesium.defaultValue(naviParams.enableCompass, true), // 启用或禁用罗盘
                    enableZoomControls: Cesium.defaultValue(naviParams.enableZoomControls, true), // 启用或禁用缩放控件
                    enableDistanceLegend: Cesium.defaultValue(naviParams.enableDistanceLegend, true), // 启用或禁用距离图例
                    enableCompassOuterRing: Cesium.defaultValue(naviParams.enableCompassOuterRing, true), // 启用或禁用指南针外环。如果将选项设置为false，则该环将可见但无效。
                });
            }

            // 景深
            const viewModel = {
                show: true,
                focalDistance: 400,
                delta: 0.2,
                sigma: 4.78,
                stepSize: 0.2,
            };

            if (!Cesium.PostProcessStageLibrary.isDepthOfFieldSupported(viewer.scene)) {
                window.alert("This browser does not support the depth of field post process.");
            }
            const depthOfField = viewer.scene.postProcessStages.add(
                Cesium.PostProcessStageLibrary.createDepthOfFieldStage(),
            );

            function updatePostProcess() {
                depthOfField.enabled = Boolean(viewModel.show);
                depthOfField.uniforms.focalDistance = Number(viewModel.focalDistance);
                depthOfField.uniforms.delta = Number(viewModel.delta);
                depthOfField.uniforms.sigma = Number(viewModel.sigma);
                depthOfField.uniforms.stepSize = Number(viewModel.stepSize);
            }
            updatePostProcess();

            let debounceTimeout;
            const debounceDelay = 500;  // 防抖延迟（毫秒）
            viewer.scene.camera.changed.addEventListener(() => {
                // 清除之前的延时器
                clearTimeout(debounceTimeout);

                // 设置新的延时器，在事件停止触发后延迟执行
                debounceTimeout = setTimeout(() => {
                    console.log("相机变化事件触发");
                    var bound = this.getViewBounds();
                    if (!!bound) {
                      console.log("当前视角区域:"+ JSON.stringify(bound));
                    }
                    this.cameraChanged();
                    // 在这里执行相机变化后的逻辑
                }, debounceDelay);
            });

            this.initTrack()
            this.$emit('parentMethod');
        },
        updateTrack() {
            if (!this.trackMgr) {
                return
            }

            if (this.demoTrack != null) {
                this.track.track.push(this.demoTrack)
            }
            this.trackMgr.update(this.track)
        },

        initTrack() {
            var _this = this;
            var trackMgr = new ABCTraffic3D({
                map: this.viewer, //地图对象
                modelPath: modelPath, //模型路径
                heightAdd: 0.1,
                person: { //第三视角设置
                    xy: 50, //相机与车辆的距离
                    z: 12 //相机高度
                }
            })

            if (this.track && this.track.track.length > 0) {
                this.track.track.forEach((e) => {
                    e.z = 0.1
                    if (!e.vehicleColor) {
                        e.vehicleColor = 1
                    }
                    if (!e.plateNumber) {
                        e.plateNumber = ""
                    }
                })
                trackMgr.update(this.track)
            }
            this.trackMgr = trackMgr;

            //第三视角车辆跟踪
            var lastCamera = {} //跟踪前保留的相机位置
            //单击车辆触发跟踪
            this.trackMgr.mapClick.raiseEvent = function(item) {
              if (!!item.object && !!item.object.track) {
                console.log("click track:" + item.object.track.trackID + " " + item.object.track.plateNumber)
                //设置跟踪识别编号
                _this.trackMgr._viewMgr.id = item.object.track.trackID
                //设置第三视角
                _this.trackMgr._viewMgr.person = 3
                //保存当前的视角
                lastCamera = _this.getCameraInfo()
              }
            }
            //取消跟踪，双击取消
            this.trackMgr._map.addEventListener(ABCTraffic3D.EventType.LEFT_DBCLICK, (event) => {
              //判断是否有车辆跟踪
              if (!!_this.trackMgr._viewMgr.id) {
                //取消跟踪
                _this.trackMgr._viewMgr.remove()
                //恢复视角
                if (!!lastCamera) {
                  this.flyToData(lastCamera)
                }
              }
            })

        },
        flyToData(view) {
            if (this.outOfChina(view.lat, view.lng))
                return
            console.log("flyTo :" + view.lat + " " + view.lng + " " + view.alt)
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(view.lng, view.lat, view.alt),
                orientation: {
                    heading: Cesium.Math.toRadians(view.heading),
                    pitch: Cesium.Math.toRadians(view.pitch),
                    roll: Cesium.Math.toRadians(view.roll)
                }
            });
        },
        cameraChanged(args) {
            this.$emit('cameraChanged', args);
        },
        outOfChina(lat, lng) {
            if (lng < 72.004 || lng > 137.8347) {
                return true
            }
            if (lat < 0.8293 || lat > 55.8271) {
                return true
            }
            return false
        },

        // 获取当前视野的经纬度范围
        getViewBounds() {
            // 获取屏幕左下角和右上角的坐标
            const leftBottom = new Cesium.Cartesian2(0, 1); // 屏幕左下角
            const rightTop = new Cesium.Cartesian2(1, 0); // 屏幕右上角
            const ellipsoid = this.viewer.scene.ellipsoid;
            const left = this.viewer.camera.pickEllipsoid(leftBottom, ellipsoid);
            const right = this.viewer.camera.pickEllipsoid(rightTop, ellipsoid);
            if (!left | !right) {
              var camera = this.getCameraInfo()
              return {
                _sw: {
                  lng:camera.lng - 0.005,
                  lat:camera.lat - 0.003,
                },
                _ne: {
                  lng:camera.lng + 0.005,
                  lat:camera.lat + 0.003,
                }
              }
            }

            var bound = {};
            {
              const leftPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(left);
              // 获取经纬度值
              const longitude = Cesium.Math.toDegrees(leftPosition.longitude);
              const latitude = Cesium.Math.toDegrees(leftPosition.latitude);
              const height = leftPosition.height; // 高度（海拔）
              bound._sw = {lng:longitude, lat:latitude};
            }
            {
              const rightPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(right);
              // 获取经纬度值
              const longitude = Cesium.Math.toDegrees(rightPosition.longitude);
              const latitude = Cesium.Math.toDegrees(rightPosition.latitude);
              const height = rightPosition.height; // 高度（海拔）
              bound._ne = {lng:longitude, lat:latitude};
            }
            return bound;
        },

        getCameraInfo() {
            var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.viewer.camera.position);
            var lon = Cesium.Math.toDegrees(carto.longitude);
            var lat = Cesium.Math.toDegrees(carto.latitude);
            var height = Math.ceil(this.viewer.camera.positionCartographic.height);
            var heading = Math.round(Cesium.Math.toDegrees(this.viewer.camera.heading)) % 360;
            var pitch = Math.round(Cesium.Math.toDegrees(this.viewer.camera.pitch));

            var data = {
              lng: lon,
              lat: lat,
              alt: height,
              heading: heading,
              pitch: pitch,
              roll: 0
            }
            return data
        },
        altitudeToZoom(altitude) {
            var A = 40487.57;
            var B = 0.00007096758;
            var C = 91610.74;
            var D = -40467.74;
            var L = D + (A - D) / (1 + Math.pow(altitude / C, B));
            return Math.round(L);
        },

        setWeather(value, lng, lat) {
            const _this = this
            if (!this.viewer) {
                return
            }
            if (!lng || !lat) {
                return
            }

            if (this.weatherSystem) {
                this.viewer.scene.primitives.remove(this.weatherSystem);
            }

            const baseUrl = this.urlUtils.safeJoinUrl(DEVICESERVICE_URL,'api')
            if (value === 'none') {
                if (this.weatherSystem) {
                    this.viewer.scene.primitives.remove(this.weatherSystem);
                }
                this.viewer.scene.skyAtmosphere.hueShift = this.defaultSkyAtmosphere.hueShift
                this.viewer.scene.skyAtmosphere.saturationShift = this.defaultSkyAtmosphere.saturationShift
                this.viewer.scene.skyAtmosphere.brightnessShift = this.defaultSkyAtmosphere.brightnessShift
                this.viewer.scene.fog.density = 0.001;
                this.viewer.scene.fog.minimumBrightness = 1.0;
            } else if (value === 'rain') {
                // rain
                const rainParticleSize = 15.0;
                const rainRadius = 1500.0;
                const rainImageSize = new Cesium.Cartesian2(
                    rainParticleSize,
                    rainParticleSize * 2.0,
                );
                let rainGravityScratch = new Cesium.Cartesian3();
                const rainUpdate = function (particle, dt) {
                    particle.position.y -= 500.0 * dt; // 简单下降
                    if (particle.position.y < 0.0) {
                        particle.position.y = 500.0; // 回到顶部
                    }
                };

                // 添加雨滴粒子系统
                this.weatherSystem = this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
                    image: baseUrl + `/model/device/circular_particle.png`, // 一张小雨滴 PNG
                    modelMatrix: new Cesium.Matrix4.fromTranslation(_this.viewer.scene.camera.position),
                    speed: -1.0,
                    lifetime: 6.0,
                    emitter: new Cesium.SphereEmitter(rainRadius),
                    startScale: 1.0,
                    endScale: 0.0,
                    emissionRate: 800.0,
                    startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.30),
                    endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
                    imageSize: rainImageSize,
                    updateCallback: rainUpdate,
                }));

                this.viewer.scene.skyAtmosphere.hueShift = -0.97;
                this.viewer.scene.skyAtmosphere.saturationShift = 0.25;
                this.viewer.scene.skyAtmosphere.brightnessShift = -0.4;
                this.viewer.scene.fog.density = 0.00025;
                this.viewer.scene.fog.minimumBrightness = 0.01;
            } else if (value === 'snow') {
                const snowParticleSize = 12.0;
                const snowRadius = 1500.0;
                const minimumSnowImageSize = new Cesium.Cartesian2(
                    snowParticleSize,
                    snowParticleSize,
                );
                const maximumSnowImageSize = new Cesium.Cartesian2(
                    snowParticleSize * 2.0,
                    snowParticleSize * 2.0,
                );
                let snowGravityScratch = new Cesium.Cartesian3();
                const snowUpdate = function (particle, dt) {
                    particle.position.y -= 500.0 * dt; // 简单下降
                    if (particle.position.y < 0.0) {
                        particle.position.y = 500.0; // 回到顶部
                    }
                };

                this.weatherSystem = this.viewer.scene.primitives.add(
                    new Cesium.ParticleSystem({
                        image: baseUrl + `/model/device/snowflake_particle.png`,
                        modelMatrix: new Cesium.Matrix4.fromTranslation(_this.viewer.scene.camera.position),
                        minimumSpeed: -1.0,
                        maximumSpeed: 0.0,
                        lifetime: 6.0,
                        emitter: new Cesium.SphereEmitter(snowRadius),
                        startScale: 0.5,
                        endScale: 1.0,
                        emissionRate: 800.0,
                        startColor: Cesium.Color.WHITE.withAlpha(0.30),
                        endColor: Cesium.Color.WHITE.withAlpha(1.0),
                        minimumImageSize: minimumSnowImageSize,
                        maximumImageSize: maximumSnowImageSize,
                        updateCallback: snowUpdate,
                    }),
                );

                this.viewer.scene.skyAtmosphere.hueShift = -0.8;
                this.viewer.scene.skyAtmosphere.saturationShift = -0.7;
                this.viewer.scene.skyAtmosphere.brightnessShift = -0.33;
                this.viewer.scene.fog.density = 0.001;
                this.viewer.scene.fog.minimumBrightness = 0.8;
            }
        },

        setDemoEvent(value) {
            if (value === 'person') {
                this.demoTrack = Object.assign({}, this.demoTrackPerson)
            } else  if (value === 'stopcar') {
                this.demoTrack = Object.assign({}, this.demoTrackStopCar)
            } else {
                this.demoTrack = null
            }
        }
}
};
</script>
<style scoped>
.crossInfo {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;


}

.crossInfo_content {
    width: 100%;
    height: 100%;
}
</style>
