<template>
    <div style="width: 100%;height: 100%;overflow: auto;">
        <div class="screen-box">
            <globalConfig :isShowPopup="isShowGc" @closePassPopup="closeGcPop" v-if="webType == 'highway'"></globalConfig>
            <div class="screen-header">
                <div class="screen-header-title">{{title}}</div>
                <div class="date-time-box">
                    <li class="time">{{time}}</li>
                    <li class="date">{{date}}</li>
                    <li class="week">{{week}}</li>
                </div>
                <div class="date-time-box user-box">
                    <li>
                        <i class="el-icon-user"></i>
                        <span>{{username}}</span>
                    </li>
                    <li>/</li>
                    <li style="cursor: pointer;">
                        <i class="el-icon-switch-button" @click="goLogin()"></i>
                        <i class="el-icon-setting" @click="isShowGc=true" v-if="webType == 'highway'"></i>
                    </li>
                    <b>{{'v'+version}}</b>
                </div>
            </div>
            <div class="screen-content">
                <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;" v-if="isNetWorkInfo">
                    <netWorkInfo></netWorkInfo>
                </div>
                <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;" v-if="isTtafficEvt">
                    <traffic-event :eventClickTime="eventClickTime"></traffic-event>
                </div>
                <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;" v-if="isVehicleQuery">
                    <vehicle-query></vehicle-query>
                </div>
                <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;" v-if="eventData">
                    <event-info :eventData="eventData" :returnHome="eventInfoReturnHome"></event-info>
                </div>
                <cross-box v-if="crossData"></cross-box>
                <router-view v-if="isRouterShow" />
                <div class="screen-left-box" v-show="checktoolActive.indexOf(7) <0">
                    <div class="road-network-mon">
                        <div class="title-1">
                            <span>{{leftTitle}}</span>
                        </div>
                        <div class="screen-chart-box">
                            <div class="screen-chart">
                                <div style="position: relative;">
                                    <div class="title-2">
                                        <span>{{CongestionAnalysis.title}}</span>
                                        <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="">
                                    </div>
                                    <div class="date-btn-box">
                                        <div @click="netWorkInfoClick()" class="network-onfo">详细</div>
                                        <li :class="day==item.value?'active':''" v-for="item in days" @click="day=item.value">
                                            <span>{{item.name}}</span>
                                        </li>
                                    </div>
                                </div>
                                <div class="nav-box" v-if="CongestionAnalysis">
                                    <li v-for="item in CongestionAnalysis.lists" :class="cNav==item.id?'active':''" @click="cNav=item.id">
                                        <i>
                                            <img :src="assetUrl('../assets/image/screen/left/1.png')" alt="">
                                        </i>
                                        <p>
                                            <b>{{item.value}}</b>
                                            <em>{{item.unit}}</em>
                                            <span>{{item.name}}</span>
                                        </p>
                                    </li>
                                </div>
                                <div class="ect">
                                    <p class="ect-title">
                                        <i></i>
                                        <span v-if="CongestionAnalysis">{{CongestionAnalysis.echartsVoMap[cNav].series[0].name}}</span>
                                    </p>
                                </div>
                                <div style="flex:1;" id="ydfxEct"></div>
                            </div>
                            <div class="screen-chart" v-if="BlockAnalysis">
                                <div class="title-2">
                                    <span>{{BlockAnalysis.title}}</span>
                                    <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="">
                                </div>
                                <div class="nav-box">
                                    <li v-for="item in BlockAnalysis.list" :class="bNav==item.id?'active':''" @click="bNav=item.id">
                                        <i>
                                            <img :src="assetUrl('../assets/image/screen/left/2.png')" alt="">
                                        </i>
                                        <p>
                                            <b>{{item.value}}</b>
                                            <em>{{item.unit}}</em>
                                            <span>{{item.name}}</span>
                                        </p>
                                    </li>
                                </div>
                                <div class="ect">
                                    <p class="ect-title">
                                        <i></i>
                                        <span>{{BlockAnalysis.echartsVoMap[bNav].series[0].name}}</span>
                                    </p>
                                </div>
                                <div style="flex:1;" id="zdfxEct"></div>
                            </div>
                            <div class="screen-chart" style="height: 26%; " v-if="trackAnalysis">
                                <div class="title-2">
                                    <span>{{trackAnalysis.title}}</span>
                                    <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="">
                                </div>
                                <div class="ect">
                                    <p class="ect-title">
                                        <i></i>
                                        <span>{{trackAnalysis.echartsVo.series[0].name}}</span>
                                    </p>
                                </div>
                                <div style="flex:1;" id="gjfxEct"></div>
                            </div>
                        </div>
                    </div>
                    <div class="road-network-mon" style=" height: 35%;">
                        <div class="screen-chart-box">
                            <div class="screen-chart" style="height:5%;" v-if="HighFatSection">
                                <div style="position: relative;margin-top: 10px;">
                                    <!--  <div class="title-2" style="margin-bottom: 10px;">
                                        <span>{{HighFatSection.title}}</span>
                                        <img :style="width<3800?'width:255px;':'width:510px;'" :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="">
                                    </div> -->
                                    <div class="date-btn-box">
                                        <li :class="dateType==item.value?'active':''" v-for="item in dateTypes" @click="dateType=item.value">
                                            <span>{{item.name}}</span>
                                        </li>
                                    </div>
                                </div>
                                <!--  <div style="width: 100%;flex:1;display: flex;">
                                    <div class="ect" style="height: 100%;width: 30%;position: relative;">
                                        <p class="ect-title" style="position: absolute;top: 3px;left:0;">
                                            <i></i>
                                            <span>{{HighFatSection.echartsVo.series[0].name}}</span>
                                        </p>
                                        <div style="height: 100%;width: 100%;" id="scfxEct"></div>
                                    </div>
                                    <div class="consult-list consult-list1">
                                        <div class="legend" v-for="(item,index) in HighFatSection.echartsVo.series[0].data">
                                            <li>
                                                <i :style="'background:'+colors[index]"></i>
                                                <span :title="item.name">{{item.name}}</span>
                                                <em>{{item.unit}}</em>
                                                <b>{{item.value}}</b>
                                            </li>
                                            <p>
                                                <span :style="'width:'+(item.value/HighFatSection.totalSumAll)*100+'%'"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                            <div style="height:95%;position: relative;">
                                <div class="title-2">
                                    <p style="display: flex;" :class="webType=='cross'?'p1':'p2'">
                                        <span v-for="item in rankTypes[webType]" :class="item.value==rankType&&webType=='cross'?item.class+' btnActive':item.class" @click="rankType=item.value">{{item.name}}</span>
                                    </p>
                                    <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="" :style="width<3800&&webType=='cross'?'width:215px;':width>3799&&webType=='cross'?'width:430px;':width<3800?'width:430px;':''" style="margin-left: 0;">
                                </div>
                                <div class="rank-list">
                                    <ul class="rank-list-th">
                                        <li v-for="(item,index) in crossList['title']" :style="item.label=='排行'?'flex:0.5;':item.label=='名称'?'flex:3;':''" v-show="rankType=='cross'">{{item.label}}</li>
                                        <li v-for="(item,index) in roadList['title']" :style="item.label=='排行'?'flex:0.5;':item.label=='名称'?'flex:3;':''" v-show="rankType=='highway'">{{item.label}}</li>
                                    </ul>
                                    <div class="rank-list-tbody" v-anyNameYouLike v-show="rankType=='cross'">
                                        <ul v-for="(item,index) in crossList.data" @click="crossClick(item)" :class="crossData&&item.crossId==crossData.crossId?'active':''">
                                            <li v-for="t in crossList.title" :style="t.label=='排行'?'flex:0.5;':t.label=='名称'?'flex:3;':''">
                                                <span>{{item[t['prop']]}}</span>
                                                <img :src="item.upDown==1?assetUrl('../assets/image/screen/up.png'):assetUrl('../assets/image/screen/down.png')" alt="" v-show="width<=3800&&t.prop=='idxRate'">
                                                <img :src="item.upDown==1?assetUrl('../assets/image/screen/up-4k.png'):assetUrl('../assets/image/screen/down-4k.png')" alt="" v-show="width>3800&&t.prop=='idxRate'">
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="rank-list-tbody" v-anyNameYouLike v-show="rankType=='highway'">
                                        <ul v-for="(item,index) in roadList.data" @click="roadClick(item)" :class="crossData&&item.roadId==crossData.roadId?'active':''">
                                            <li v-for="t in roadList.title" :style="t.label=='排行'?'flex:0.5;':t.label=='名称'?'flex:3;':''">
                                                <span>{{item[t['prop']]}}</span>
                                                <img :src="item.upDown==1?assetUrl('../assets/image/screen/up.png'):assetUrl('../assets/image/screen/down.png')" alt="" v-show="width<=3800&&t.prop=='idxRate'">
                                                <img :src="item.upDown==1?assetUrl('../assets/image/screen/up-4k.png'):assetUrl('../assets/image/screen/down-4k.png')" alt="" v-show="width>3800&&t.prop=='idxRate'">
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screen-center-box" style="background-color: #000;">
                    <div class="search-box" :class="checktoolActive.indexOf(7)>-1?'position':''">
                        <!--  <cross-select @change="crossIdChange" ref="crossSelect"></cross-select> -->
                        <el-cascader v-model="crossId" :options="roadCascaderOptions" filterable :show-all-levels="false" :props="{value:'crossId',label:'crossName',children:'children'}" style="width:100%;" @change="crossIdChange()"></el-cascader>
                    </div>
                    <div class="track-tool-bar" :class="checktoolActive.indexOf(7)>-1?'position':''">
                        <p>{{tracksTime}}</p>
                        <li v-for="(item,index) in toolData" @click="toolActive=item.value" v-show="index<2&&item.show" :class="toolActive==item.value?'active':''">
                            <img :src="toolActive==item.value?item.activeIcon:item.icon" alt="">
                            <span>{{item.name}}</span>
                        </li>
                        <div class="tool-bar-date" v-show="toolActive==2">
                            <div style="display: flex;">
                                <span class="end-time">开始时间:</span>
                                <div>
                                    <el-date-picker @change="timeChangeStart" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="'选择时间'">
                                    </el-date-picker>
                                </div>
                            </div>
                            <div class="time-gry-box">
                                <el-radio-group v-model="timeGry">
                                    <el-radio :label="2">2分钟</el-radio>
                                    <el-radio :label="5">5分钟</el-radio>
                                    <el-radio :label="10">10分钟</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <li v-for="(item,index) in toolData" @click="traplayClick()" v-show="index==2&&item.show" :class="trackPlay?'':'active'">
                            <img :src="trackPlay?item.icon:item.activeIcon" alt="">
                            <span>{{item.name}}</span>
                        </li>
                        <li v-for="(item,index) in toolData" @click="toolClick(item)" v-show="index>2&&item.show" :class="checktoolActive.indexOf(item.value)>-1?'active':''">
                            <img :src="checktoolActive.indexOf(item.value)>-1?item.activeIcon:item.icon" alt="">
                            <span>{{item.name}}</span>
                        </li>
                        <div class="tool-bar-person" v-show="checktoolActive.indexOf(6)>-1&&tracking.id">
                            <div class="time-gry-box">
                                <el-radio-group v-model="person">
                                    <el-radio :label="1">第一视角</el-radio>
                                    <el-radio :label="3">第三视角</el-radio>
                                    <el-radio :label="2">默认视角</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </div>
                    <!-- 地图 -->
                    <div class="v-map-box" v-if="!isVehicleQuery">
                        <home-track :options="options" :fixed="fixed" :crossData="areaData" :trackPath="trackPath" ref="playBack" @parentMethod="iniTracks()"></home-track>
                    </div>
                    <div :style="checktoolActive.indexOf(6)>-1?'z-index:80;':''" v-if="checktoolActive.indexOf(6)>-1" class="t-map-box">
                       <!--  <ABCCrossroads3D :lookAt="lookAt" :data="options.tracks" :tilesets="tilesets" :modelPath="modelPath" :skyBoxPath="skyBoxPath" :facilityPath="facilityPath" :pause="pause" :brightness="1" :imageryLayers="imagerUrl" :maximumZoomDistance="900" :maxViewDist="26000" :tracking="tracking" @onClick="onClick" @cofirmFire="cofirmFire" :fixed="fixed" ref="cross3d" /> -->
                         <cesiumTrack :track="options.tracks"></cesiumTrack>
                    </div>
                    <div class="road-network-info-box" :class="checktoolActive.indexOf(7)>-1?'position-left':''">
                        <p class="title">{{rightTitle}}</p>
                        <div class="road-network-info">
                            <div v-for="item in crossStatusList" v-if="!crossData">
                                <li style="cursor:pointer;" @click="crossStatusClick(item)">
                                    <i>
                                        <img :src="item.icon" alt="">
                                    </i>
                                    <p>
                                        <b>{{item.value}}</b>
                                        <em>{{item.unit}}</em>
                                        <span>{{item.name}}</span>
                                    </p>
                                </li>
                            </div>
                            <div v-for="item in RoadNetworkOverview">
                                <li :style="item.name.indexOf('事件')>-1?'cursor:pointer;':item.name.indexOf('路口')>-1?'cursor:pointer;':''" @click="eventNumClick(item)">
                                    <i>
                                        <img :src="item.icon" alt="">
                                        <span v-show="item.name.indexOf('事件')>-1&&isDot"></span>
                                    </i>
                                    <p>
                                        <b :style="item.value.indexOf('饱和')>-1?'font-size:18px;':''">{{item.value}}</b>
                                        <em>{{item.unit}}</em>
                                        <span>{{item.name}}</span>
                                    </p>
                                </li>
                            </div>
                        </div>
                    </div>
                    <div class="index-echart-box" v-show="crossData">
                        <div class="index-echart-type">
                            <div class="title-2">
                                <span>指标分析</span>
                            </div>
                            <div class="type-box" v-if="webType=='highway'" style="width: 100px;">
                                <li class="active">流量</li>
                            </div>
                            <div class="type-box" v-if="webType=='cross'">
                                <li v-for="item in indexTypes" :class="index==item.value?'active':''" @click="index=item.value">{{item.label}}</li>
                            </div>
                            
                            <!-- <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt=""> -->
                        </div>
                        <!-- <div class="border"></div> -->
                        <div class="index-ect">
                            <div class="ect" id="home-lineEct"></div>
                            <div class="dir-type-box" v-if="webType == 'cross'">
                                <li style="white-space: nowrap;" v-for="item in dirs" :style="item.name==dir?'opacity:1;':''" @click="changeDetailDir(item.name)">{{item.name}}</li>
                            </div>
                            <div class="ect" id="home-lineEct1" v-if="webType == 'cross'"></div>
                            <div class="date-type-select">
                                <div class="select-group" v-if="webType == 'cross'">
                                    <div class="select-item">
                                        <span class="select-title">统计周期</span>
                                        <el-select v-model="timeType" size="mini" placeholder="请选择" @change="changeDetailDir(null)">
                                            <el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="select-item">
                                        <span class="select-title">进出口</span>
                                        <el-select v-model="inout" size="mini" placeholder="请选择" @change="changeDetailDir(null)">
                                            <el-option v-for="item in inouts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="unit">{{$t("home.unit")+'：'+indexUnit[index]}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screen-right-box" v-show="checktoolActive.indexOf(7) <0">
                    <div class="screen-video-box">
                        <div style="display: flex;">
                            <div class="title-1">
                                <span>路口视频</span>
                            </div>
                            <span style="flex:1;text-align: right;line-height: 32px;" v-if="videoCrossData">{{videoCrossData.crossName}}</span>
                        </div>
                        <div>
                            <el-cascader v-model="address" :options="dirList" :props="defaultProps" :key="cascaderKey" @change="cascaderChange()" style="float: right;">
                            </el-cascader>
                        </div>
                        <div class="evt-video-box">
                            <!--   <label @click="playPrev()">
                                <i class="el-icon-arrow-left"></i>
                            </label>
                            <label style="right: 10px;left: auto;" @click="playNext()">
                                <i class="el-icon-arrow-right"></i>
                            </label> -->
                            <!-- <video ref="J_video" controls muted v-if="EventRealList"></video> -->
                            <flv-js v-if="crossVideoShow" :address="crossVideoUrl" ref="flvPlayer"></flv-js>
                        </div>
                    </div>
                    <div class="road-network-mon" style=" height: 300px;display: flex;flex-direction:column;" :style="width<3800?'height: 200px;margin-top:20px;':'height:400px;margin-top:40px;'" v-show="webType=='cross'">
                        <div class="title-1">
                            <span>事件监测</span>
                        </div>
                        <div class="title-2">
                            <span>{{EventRatio.title}}</span>
                            <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="" :style="width<3800?'width: 260px;':'width:502px;'">
                        </div>
                        <div style="width: 100%;flex:1;">
                            <div style="height: 100%;float: left;width:30%;" id="sjlxEct"></div>
                            <div style="position: relative;height: 104px;width: 70%;" v-anyNameYouLike>
                                <div class="consult-list consult-list1" style="width: 100%;" v-if="EventRatio">
                                    <div class="legend" v-for="(item,index) in EventRatio.echartsVo.series[0].data" style="width: 48%;">
                                        <li>
                                            <i :style="'background:'+colors[index]"></i>
                                            <span>{{item.name}}</span>
                                            <em>{{item.unit}}</em>
                                            <b>{{item.value}}</b>
                                        </li>
                                        <p>
                                            <span :style="'width:'+(item.value/EventRatio.totalSumAll)*100+'%'"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="event-mon-box" :style="fireAlarm?'flex:1.4;':'flex:2.4;'">
                        <div class="evnet-list-box">
                            <div style="overflow: hidden;">
                              <div class="title-2" style="float: left;">
                                <span>实时预警事件</span>
                              </div>
                              <div class="waring-class-box">
                                <li v-for="item in EventStateCountList">
                                  <img :src="assetUrl('../assets/image/screen/1920/waring-'+item.value+'.png')" alt="">
                                  <span :style="item.value==1?'color:#19BCF1;':item.value==2?'color:#F7C73B;':'color:#FA5646;'">{{item.name.substr(0,item.name.length-1)}}</span>
                                </li>
                              </div>
                            </div>

                            <div class="list-order-box">
                                <li>
                                    <span style="font-size: 16px">事件列表</span>
                                </li>
                                <div class="video-btn-box type-box">
                                    <li v-for="item in evtOrderType" :class="item.value==evtOrder?'active':''" @click="evtOrder=item.value,getEventList()">{{item.name}}</li>
                                </div>
                            </div>
                            <div class="screen-video-box">
                                <el-checkbox v-model="autoRefresh">列表自动刷新</el-checkbox>
                            </div>
                        </div>
                        <div class="screen-event-list">
                            <ul class="list-th">
                                <li style="flex:4;"><i class="el-icon-sort"></i>事件类型</li>
                                <li style="flex:4;"><i class="el-icon-sort"></i>事件位置</li>
                                <li style="flex:3;"><i class="el-icon-sort"></i>开始时间</li>
                                <!-- <li style="flex:1.5;">处理状态</li> -->
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike>
                                <ul class="list-tr" v-for="(item,index) in EventRealList" @click="eventClick(item,index)" :style="eventId==item.id?'color:#1378E0;':''">
                                    <li style="flex:4;">
                                        <img :src="assetUrl('../assets/image/screen/w'+item.eventState+'.png')" alt="">
                                        <span>{{item.typeCodeName}}</span>
                                    </li>
                                    <li style="flex:4;" :title="item.crossName">{{item.crossName}}</li>
                                    <li style="flex:3;">{{item.startTime.substr(5,11)}}
                                        <!--    <i class="el-icon-video-camera" v-show="ecurr==index" style="color:#fff;"></i> -->
                                    </li>
                                    <!-- <li style="flex:1.5;" :style="item.typeId==1?'color:#11BFFF;':item.typeId==2?'color:#DD6C61;':'color:#EE1907;'">{{item.typeName}}

                                    </li> -->
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="event-mon-box waring-mon-box" v-show="webType=='highway'&&fireAlarm">
                        <div class="evnet-list-box">
                            <div style="overflow: hidden;">
                                <div class="title-2" style="float: left;">
                                    <span>火灾报警监测</span>
                                </div>
                                <div class="waring-class-box" style="margin-bottom: 0;">
                                    <li style="cursor: pointer;" @click="alarmTableType='fireAlarm'">
                                        <img :src="assetUrl('../assets/image/screen/1920/fire.png')" alt="" style="width: 60px;height: 42px;">
                                        <span v-if="fireEventList" style="line-height: 42px;">{{fireEventList.data.length}}</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                        <div class="screen-event-list" v-if="fireEventList">
                            <ul class="list-th">
                                <li v-for="item in fireEventList['title']" :style="item.label.indexOf('时间')>-1?'flex:2;':''">{{item.label}}</li>
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike>
                                <ul class="list-tr" v-for="(item,index) in fireEventList.data">
                                    <li v-for="t in fireEventList.title" :style="t.label.indexOf('时间')>-1?'flex:2;':''">{{item[t['prop']]}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="event-mon-box waring-mon-box" v-show="webType=='highway'">
                        <div class="evnet-list-box">
                            <div style="overflow: hidden;">
                                <div class="title-2" style="float: left;">
                                    <span>设备状态监测</span>
                                </div>
                                <div class="waring-class-box" style="margin-bottom: 0;">
                                    <li style="cursor: pointer;" @click="alarmTableType='facilityAlarm'">
                                        <img :src="assetUrl('../assets/image/screen/1920/dev.png')" alt="" style="width: 60px;height: 42px;">
                                        <span v-if="facilityList" style="line-height: 42px;">{{facilityList.data.length}}</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                        <div class="screen-event-list" v-if="facilityList">
                            <ul class="list-th">
                                <li v-for="item in facilityList['title']" :style="item.label.indexOf('时间')>-1?'flex:2;':''">{{item.label}}</li>
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike>
                                <ul class="list-tr" v-for="(item,index) in facilityList.data">
                                    <li v-for="t in facilityList.title" :style="t.label.indexOf('时间')>-1?'flex:2;':''">{{item[t['prop']]}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <alarm-table :type="alarmTableType" v-if="alarmTableType" @parentMethod="getFireInfoById"> </alarm-table>
            <info-publish :info="publishInfo" v-if="publishInfo"></info-publish>
        </div>
    </div>
</template>
<script setup lang="ts">
import protobuf from "protobufjs";
import http from '@/api/http';
import { assetUrl } from '@/tool/assetUrl';
import homeTrack from './homeTrack.vue';
import cesiumTrack from './cesiumTrack.vue';
import crossBox from './cross.vue';
import roadAnalyse from './roadAnalyse.vue';
import alarmTable from './alarmTable.vue';
import infoPublish from './infoPublish.vue';
import trafficEvent from './trafficEvent.vue';
import globalConfig from './globalConfig.vue';
import vehicleQuery from './vehicleQuery.vue';
import netWorkInfo from './netWorkInfo.vue'
import FlvJs from './video/FlvJs.vue'
//import Flv from 'flv.js'
import FlvExtend from 'flv-extend'
import config from '../../package.json'
import eventInfo from './eventInfo.vue';

defineOptions((() => {
    var AwesomeMessage, map, marker, popupArr = [],
        player, playerArr = [],
        cameraLabel = null,
        alarmPopup = null;

    protobuf.load("static/carTrackObj.proto", function(err, root) {
        if (err) {
            throw err;
        }
        AwesomeMessage = root.lookupType("crossserverpb.CarTrack");
    });

    let sharedAudioContext = null;
    const alarmAudioBufferCache = {};

    function getSharedAudioContext() {
        if (sharedAudioContext) {
            return sharedAudioContext;
        }
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return null;
        }
        sharedAudioContext = new AudioContextClass();
        return sharedAudioContext;
    }

    return {
    components: { homeTrack,cesiumTrack, crossBox, roadAnalyse, alarmTable, infoPublish, trafficEvent, globalConfig, vehicleQuery, netWorkInfo, FlvJs, eventInfo },
    data() {
        return {
            title: window.APP_CONFIG.WEB_TITLE_V2,
            isRouterShow: true,
            options: {
                tracks: null,
                play: true,
                type: 'area',
                fixed: true
            },
            trackPlay: true,
            trackPath: false,
            areaData: {
                centerX: window.APP_CONFIG.MAP_CENTER[0],
                centerY: window.APP_CONFIG.MAP_CENTER[1],
            },
            time: '',
            date: '',
            week: '',
            webType: window.APP_CONFIG.WEB_TYPE,
            rankType: window.APP_CONFIG.WEB_TYPE,
            trafficAnalysis: '',
            RoadNetworkOverview: [],
            onDuty: '',
            workConsultation: '',
            colors: ['#FFF636', '#11BFFF', '#2BFBB4', '#2673E8', '#FCFDFC', '#749f83'],
            layerType: null,
            layerTypes: [],
            CongestionAnalysis: '',
            cNav: '',
            BlockAnalysis: '',
            bNav: '',
            trackAnalysis: '',
            HighFatSection: '',
            PassengerCargoRatio: '',
            PassengerCargoRatioList: [],
            stationsVoList: [],
            stationsVoListColor: ['#60CAF0', '#FFF4A5', '#72EDC3'],
            stationsTotal: 0,
            EventRatio: '',
            EventInfo: '',
            EventRealList: [],
            bounds: '',
            crossList: '',
            roadList: '',
            width: document.body.clientWidth,
            stateColors: {
                1: {
                    bgColor: 'rgba(64,247,222,0.4)',
                    boColor: 'rgba(64,247,222,1)'
                },
                2: {
                    bgColor: 'rgba(248,167,52,0.4)',
                    boColor: 'rgba(248,167,52,1)'
                },
                3: {
                    bgColor: 'rgba(199,26,52,0.4)',
                    boColor: 'rgba(199,26,52,1)'
                },
            },
            EventStateCountList: [],
            crossInfoNavMenu: [],
            crossData: '',
            toolData: [{
                name: '实时轨迹',
                value: 1,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/ssgj.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/ssgj-a.png')
            }, {
                name: '历史轨迹',
                value: 2,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/lsgj.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/lsgj-a.png')
            }, {
                name: '停止轨迹',
                value: 3,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/tzgj.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/tzgj-a.png')
            }, {
                name: '车辆轨迹',
                value: 4,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/clgj.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/clgj-a.png')
            }, {
                name: '三维地图',
                value: 6,
                show: threeMap,
                icon: assetUrl('../assets/image/screen/1920/3d.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/3d-a.png')
            }, {
                name: '地图全屏',
                value: 7,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/qp.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/qp-a.png')
            }, {
                name: '紧急报警',
                value: 8,
                show: window.APP_CONFIG.WEB_TYPE == 'highway' ? true : false,
                icon: assetUrl('../assets/image/screen/1920/jjbj.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/jjbj-a.png')
            }, {
                name: '车辆信息',
                value: 9,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/clxx.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/clxx-a.png')
            }, {
                name: '设备图层',
                value: 10,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/sbtc.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/sbtc-a.png')
            }, {
                name: '全息路况',
                value: 11,
                show: traffic,
                icon: assetUrl('../assets/image/screen/1920/lk.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/lk-a.png')
            }, {
                name: '车辆查询',
                value: 12,
                show: true,
                icon: assetUrl('../assets/image/screen/1920/clcx.png'),
                activeIcon: assetUrl('../assets/image/screen/1920/clcx-a.png')
            }],

            toolActive: 1,
            checktoolActive: [8, 9, 10, 11],
            indexTypes: [{
                value: '1',
                label: this.$t("home.flow")
            }, {
                value: '2',
                label: this.$t("home.numberOfStops")
            }, {
                value: '3',
                label: this.$t("home.parkingDelay")
            }, {
                value: '4',
                label: this.$t("home.theLengthOfQueue")
            }],
            index: '1',
            indexUnit: {
                '1': this.$t("home.vehicles"),
                '2': this.$t("home.times"),
                '3': this.$t("home.second"),
                '4': this.$t("home.meter")
            },
            dirs: [],
            times: [{
                value: '1',
                label: this.$t("home.realTime")
            }, {
                value: '2',
                label: '5min'
            }],
            inouts:[{
                value:'1',
                label:'进口'
            },{
                value:'2',
                label:'出口'
            }],
            inout:'1',
            timeType: '1',
            dirDatas: {},
            lookAt: lookAt,
            tilesets: tilesets,
            modelPath: modelPath,
            skyBoxPath: skyBoxPath,
            facilityPath: facilityPath,
            imagerUrl: imagerUrl,
            tracks: null,
            URL: '',
            inter: null,
            ect: null,
            ect1: null,
            pause: true,
            person: 3,
            tracking: { id: '', person: 3 },
            videoUrl: window.APP_CONFIG.SERVICE_URL + 'video/demo.mp4',
            location: '',
            eventId: null,
            tracksTime: '',
            startTime: '',
            endTime: '',
            timeGry: 5,
            crossName: '',
            evtTotal: 0,
            page: 1,
            pageSize: 10,
            evtOrderType: [],
            evtOrder: null,
            rankTypes: {

                'cross': [{
                    name: '路口排名',
                    value: 'cross',
                    class: 'btn'
                }, {
                    name: '路段排名',
                    value: 'highway',
                    class: 'btn'
                }],
                'highway': [{

                    name: '路段排名',
                    value: 'highway',
                    class: 'btn'

                }]
            },
            username: sessionStorage.getItem('username'),
            videoUrlList: [],
            SERVICE_URL: window.APP_CONFIG.SERVICE_URL,
            weatherList: [],
            weatherId: null,
            weatherPage: 1,
            weatherPageSize: 10,
            weatherTotal: 0,
            ThreeQuickSpeedList: [],
            threeId: null,
            threeDateType: 'day',
            threeQuickSpeedPage: 1,
            threeQuickSpeedPageSize: 10,
            threeQuickSpeedTotal: 0,
            version: config.version + '_' + config.time,
            cEct: null,
            bEct: null,
            days: [{
                name: '昨天',
                value: 1
            }, {
                name: '今天',
                value: 2
            }],
            day: 2,
            dateTypes: [{
                name: '日',
                value: 1
            }, {
                name: '周',
                value: 2
            }, {
                name: '月',
                value: 3
            }],
            dateType: 1,
            autoPolling: true,
            video: null,
            vList: [],
            vLen: 0,
            curr: 0,
            eLen: 0,
            ecurr: 0,
            autoRefresh: true,
            leftTitle: leftTitle,
            rightTitle: rightTitle,
            websocket: null,
            evtWebsocket: null,
            fireData: null,
            hasAlarmSound: false,
            realAlarmCount: [],
            alarmTableType: null,
            evtWebsocketData: '',
            facilityList: '',
            fireEventList: '',
            publishInfo: '',
            eventTotal: 0,
            isDot: false,
            isTtafficEvt: false,
            isNetWorkInfo: false,
            isVehicleQuery: false,
            eventClickTime: [],
            fixed: false,
            cameraCodeArr: [],
            isShowGc: false,
            videoEvt: null,
            alarmVideoRid: '',
            alarmVideoId: '',
            fireAlarm: fireAlarm,
            eventData: '',
            eventInfoReturnHome: false,
            routerFlag: false,
            socketMessage: null,
            beforeUnloadHandler: null,
            websocketState: 1,
            lastTrackStatTime: '',
            chartResizeHandler: null,
            homeMapMoveEndHandler: null,
            crossPointClickHandler: null,
            crossIndexPointClickHandler: null,
            cameraPointClickHandler: null,
            cameraPointMouseMoveHandler: null,
            cameraPointMouseLeaveHandler: null,
            roadCascaderOptions: [],
            crossListObj: {},
            crossId: [],
            dir: '',
            crossStatusList: [],
            timeInter: null,
            inter1: null,
            inter2: null,
            crossDataArr: [],
            videoCrossData: '',
            dirList: [],
            address: [],
            cascaderKey: 1,
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'value'
            },
            videoRid: '',
            videoId: '',
            crossVideoShow: true,
            crossVideoUrl: ''



        }
    },
    created() {
        this.startTime = this.mapUtils.getDateYMD('ymdhms', -this.timeGry);
        this.endTime = this.mapUtils.getDateYMD('ymdhms');
        this.date = this.mapUtils.getDateYMD('ymd');
        this.week = this.mapUtils.getDateYMD('week');
        this.timeInter = setInterval(() => {
            this.time = this.mapUtils.getDateYMD('hms');
        }, 1000)

        this.getmodule()
        this.getCongestionAnalysis()
        this.getDelayAnalysis()
        this.getTrackAnalysis()
        // this.getHighPointSection()
        this.getRoadTop10()
        if (this.webType == 'cross') {
            this.getCrossTop10()
        }
        this.getStatsList()
        this.getRoadNetworkOverview()
        this.getEventRatio()
        this.getEventOrderType()
        this.openInterval()
        this.openIntervalAll()


    },
    mounted() {

        if (!this.crossData) {
            this.$router.push({ path: '/home' });

        }
        this.clearcrossId()
        this.beforeUnloadHandler = () => {
            if (playerArr.length > 0) {
                playerArr.forEach((p, index) => {
                    this.destroy(p.player, p.item)
                })
                playerArr = []
            }

        };
        window.addEventListener('beforeunload', this.beforeUnloadHandler);

    },
    beforeUnmount() {

        this.unbindHomeMapEvents()
        this.unbindChartResizeHandler()
        this.clearIntervalAll()
        if (this.timeInter) {
            clearInterval(this.timeInter)
            this.timeInter = null;
        }
        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
    },
    unmounted() {

        this.routerFlag = true;
        this.unbindHomeMapEvents()
        this.unbindChartResizeHandler()
        if (this.socketMessage) {
            this.socketMessage.close()
            this.socketMessage = null
        }
        this.closeTrackWebsocket()
        this.closeEvtWebsocket()
        this.clearIntervalAll()
        if (this.timeInter) {
            clearInterval(this.timeInter)
            this.timeInter = null;
        }
        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
    },
    watch: {
        index() {
            this.getCrossGraphInfo()
            var message = JSON.stringify({
                bound: this.$refs.playBack.homeMap.getBounds(),
                isOpen: this.trackPlay ? 1 : 0,
                statDataType: Number(this.index),
                statCrossId: this.crossData ? this.crossData.crossId : ''

            })
            this.sendTrackMessage(message);
        },
        timeType() {
            this.getCrossGraphInfo()
        },
        inout() {
            this.getCrossGraphInfo()
        },

        toolActive(val) {
            if (val == 1) {
                this.openSend()
            } else if (val == 2 && this.startTime && this.endTime) {
                this.openSend()
            } else if (val == 2 && this.startTime) {
                // this.startTime = this.mapUtils.getDateYMD('ymdhms', -this.timeGry);
                this.timeChangeStart()

            }


        },
        timeGry() {
            this.timeChangeStart()
        },

        trackPlay(val) {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                var message = JSON.stringify({
                    bound: this.$refs.playBack.homeMap.getBounds(),
                    isOpen: this.trackPlay ? 1 : 0,
                    statDataType: Number(this.index),
                    statCrossId: this.crossData ? this.crossData.crossId : ''
                })
                this.sendTrackMessage(message);
            }


        },

        cNav(val) {
            if (this.cEct) {
                var series = this.CongestionAnalysis.echartsVoMap[val].series;
                this.cEct.setOption({
                    series: series
                })
            }

        },

        bNav(val) {
            if (this.bEct) {
                var series = this.BlockAnalysis.echartsVoMap[val].series;
                this.bEct.setOption({
                    series: series
                })
            }
        },
        day() {
            this.getCongestionAnalysis()
            this.getDelayAnalysis()
            this.getTrackAnalysis()
            this.getRoadTop10()
            if (this.webType == 'cross') {
                this.getCrossTop10()
            }
        },
        dateType() {
            // this.getHighPointSection()
        },
        autoPolling(val) {
            if (val) {
                this.mp4play()
            }
        },
        autoRefresh(val) {
            if (val) {
                this.openInterval()
                this.eventId = null;
            } else {
                this.clearInterval()
            }
        },
        person(val) {
            this.tracking.person = val;
            if (val == 2) {
                this.tracking.id = '';

            }

        }

    },
    methods: {
        closeTrackWebsocket() {
            var socket = this.websocket;
            this.websocket = null;
            if (!socket) {
                return
            }
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        },
        bindMapEvent(map, eventName, layerId, handlerKey, handlerFactory) {
            if (!map || typeof map.on !== 'function') {
                return
            }
            if (!this[handlerKey]) {
                this[handlerKey] = handlerFactory()
            }
            var handler = this[handlerKey];
            if (typeof map.off === 'function') {
                if (layerId) {
                    map.off(eventName, layerId, handler)
                } else {
                    map.off(eventName, handler)
                }
            }
            if (layerId) {
                map.on(eventName, layerId, handler)
            } else {
                map.on(eventName, handler)
            }
        },
        unbindMapEvent(map, eventName, layerId, handlerKey) {
            var handler = this[handlerKey];
            if (!map || !handler || typeof map.off !== 'function') {
                return
            }
            if (layerId) {
                map.off(eventName, layerId, handler)
            } else {
                map.off(eventName, handler)
            }
        },
        unbindHomeMapEvents() {
            var map = this.$refs.playBack && this.$refs.playBack.homeMap;
            if (!map) {
                return
            }
            this.unbindMapEvent(map, 'moveend', null, 'homeMapMoveEndHandler')
            this.unbindMapEvent(map, 'click', 'cross-point', 'crossPointClickHandler')
            this.unbindMapEvent(map, 'click', 'crossIndex-point', 'crossIndexPointClickHandler')
            this.unbindMapEvent(map, 'click', 'camera-point', 'cameraPointClickHandler')
            this.unbindMapEvent(map, 'mousemove', 'camera-point', 'cameraPointMouseMoveHandler')
            this.unbindMapEvent(map, 'mouseleave', 'camera-point', 'cameraPointMouseLeaveHandler')
        },
        bindChartResizeHandler() {
            if (this.chartResizeHandler) {
                return
            }
            this.chartResizeHandler = () => {
                if (this.ect && this.ect.resize) {
                    this.ect.resize()
                }
                if (this.ect1 && this.ect1.resize) {
                    this.ect1.resize()
                }
            }
            window.addEventListener('resize', this.chartResizeHandler)
        },
        unbindChartResizeHandler() {
            if (!this.chartResizeHandler) {
                return
            }
            window.removeEventListener('resize', this.chartResizeHandler)
            this.chartResizeHandler = null
        },
        closeEvtWebsocket() {
            var socket = this.evtWebsocket;
            this.evtWebsocket = null;
            if (!socket) {
                return
            }
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        },
        sendEvtMessage(message) {
            if (this.evtWebsocket && this.evtWebsocket.readyState === WebSocket.OPEN) {
                this.evtWebsocket.send(message);
            }
        },
        getRealDirList() {
            this.address = []
            const _this = this;
            if (!this.videoCrossData) {
                return
            }
            var param = {
                crossId: this.videoCrossData.crossId


            }

            http.get(window.APP_CONFIG.SERVICE_URL + 'cameraVideo/getRealDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.value = item.rid + ',' + c.id
                    })
                })
                if (this.dirList.length > 0) {
                    this.address = [undefined, this.dirList[0].rid + ',' + this.dirList[0].children[0].id]
                }
                this.cascaderChange()

            })
        },
        crossVideo(operation) {
            this.$refs.flvPlayer && this.$refs.flvPlayer.destroy();
            const _this = this;

            var param = {
                rid: operation == 0 ? this.address[1].split(',')[0] : this.videoRid,
                id: operation == 0 ? this.address[1].split(',')[1] : this.videoId,
                operation: operation
            }

            if (typeof PlayVideoDemo !== 'undefined' && !!PlayVideoDemo) {
                param.demo = 1;
            } else {
                param.demo = 0;
            }

            console.log('cross video play ' + operation + " " + param)

            http.get(window.APP_CONFIG.SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {

                if (this.address.length > 0) {
                    this.videoRid = this.address[1].split(',')[0];
                    this.videoId = this.address[1].split(',')[1];
                }

                if (operation == 0) {
                    if (data.data.code == -1) {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error',
                            offset: 80
                        });
                    } else {
                        this.crossVideoUrl = data.data.resultObject;
                        this.$refs.flvPlayer.play(data.data.resultObject);
                    }
                } else {
                    this.videoRid = ''
                    this.videoRid = ''
                }
            })
        },
        cascaderChange() {
            if (this.videoRid) {
                this.crossVideo(1)
            }
            if (this.address.length > 0) {
                this.crossVideo(0);
            }


        },
        closeGcPop() {
            this.isShowGc = false;
        },
        openInterval() {
            this.inter = setInterval(() => {
                this.getEventList();
            }, 1000 * 60 * 10);
        },
        clearInterval() {
            if (this.inter) {
                clearInterval(this.inter)
                this.inter = null;
            }
        },
        openIntervalAll() {
            this.inter1 = setInterval(() => {
                this.getRoadNetworkOverview();
                if (traffic) {
                    this.getStateList()
                }

                this.getCongestionAnalysis()
                this.getDelayAnalysis()
                this.getTrackAnalysis()
                // this.getHighPointSection()
            }, 1000 * 120);
            this.inter2 = setInterval(() => {
                this.getStatsList()
            }, 1000 * 15)
        },
        clearIntervalAll() {
            if (this.inter) {
                clearInterval(this.inter)
                this.inter = null;
            }

            if (this.inter1) {
                clearInterval(this.inter1)
                this.inter1 = null;
            }
            if (this.inter2) {
                clearInterval(this.inter2)
                this.inter2 = null;
            }
        },
        goLogin() {
            var whetherToExit = this.$t("home.whetherToExit")
            this.$confirm(whetherToExit, {
                confirmButtonText: this.$t("home.determine"),
                cancelButtonText: this.$t("home.cancel"),
                type: 'warning'
            }).then(() => {
                this.$store.commit('del_token');
                this.$router.push('/login');
                sessionStorage.clear();
                // http.delete(window.APP_CONFIG.LOGO_SERVICE + 'mapabc-admin-system/api/v1/exit?', {
                // }).then(res => {
                //     this.$store.commit('del_token')
                //     this.$router.push('/login')
                //     sessionStorage.clear();
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '登出失败。'
                //     });
                // });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("home.cancelled"),
                    offset: 80
                });
            });

        },

        crossIdChange() {
            this.dir = null
            var item = this.crossListObj[this.crossId[1]]
            this.crossData = item;
            this.videoCrossData = item;
            this.crossData.type = this.crossId[0]
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            sessionStorage.setItem('crossData', JSON.stringify(item))
            this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.getCrossGraphInfo()
            this.getRoadNetworkOverview()
            this.getCongestionAnalysis()
            this.getDelayAnalysis()
            this.getTrackAnalysis()
            this.getRealDirList()
            if (this.inter2) {
                clearInterval(this.inter2)
                this.inter2 = null;
            }
            this.crossStatusList = [];
        },
        clearcrossId() {
            sessionStorage.setItem('crossData', JSON.stringify({ crossId: '' }))
            this.crossId = [];

        },
        setMapZoom() {
            this.$refs.playBack.homeMap.flyTo({ zoom: 15 })
        },
        crossClick(item) {

            this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            this.crossData = item;
            this.crossData.type = 'cross'
            this.crossId = ['cross', item.crossId];
            this.crossIdChange()
            sessionStorage.setItem('crossData', JSON.stringify(item))
            this.dir = null
            this.getCrossGraphInfo()
            this.getRoadNetworkOverview()

            if (this.inter2) {
                clearInterval(this.inter2)
                this.inter2 = null;
            }
            this.crossStatusList = [];
        },
        roadClick(item) {
            this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            this.crossId = ['road', item.roadId];
            this.crossData = item;
            this.crossData.type = 'road'
            this.crossData.crossId = item.roadId
            sessionStorage.setItem('crossData', JSON.stringify(item))
            this.getRoadNetworkOverview()
            this.getCongestionAnalysis()
            this.getDelayAnalysis()
            this.dir = null
            this.getCrossGraphInfo()

        },
        eventClick(item, index) {
            this.eventData = item;
            this.eventInfoReturnHome = true;
            this.autoRefresh = false;
            this.eventId = item.id;
            // this.ecurr = index;
            // this.curr = 0;
            this.trackPlay = false;
            this.$refs.playBack.homeMap.removeLayer('crossing')
            this.$refs.playBack.crossing.clear()
            // this.video.pause()
            // this.mp4play();
            // this.location = item.crossName;

            // this.startTime = item.startTime;
            // this.endTime = item.endTime;
            // this.toolActive = 2;
            // this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })

            // this.lookAt.lng = item.centerX;
            // this.lookAt.lat = item.centerY;


            if (this.webType == 'cross') {

            } else {

            }


        },
        //三色事件详细数据
        getEventInfoById(item) {

            var _this = this;
            var param = {
                id: item.id
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getEventInfoById?', { params: param }).then((data) => {
                var res = data.data.data;
                this.$refs.playBack.homeMap.flyTo({ center: [res.centerX, res.centerY], zoom: 18 })

                this.lookAt.lng = res.centerX;
                this.lookAt.lat = res.centerY;
            })
        },
        removeFire() {
            this.$refs.cross3d.removeFire();

        },
        onClick(e) {
            if (!e.properties.name) {

                this.trackID = e.properties.id;
                this.tracking.person = 3;
                this.person = 3;
                this.tracking.id = this.trackID;

            }

        },
        timeChangeStart() {
            var date = new Date(this.startTime)

            date.setMinutes(date.getMinutes() + this.timeGry);
            var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            var d = date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate();

            var hour = date.getHours();
            var min = date.getMinutes();
            var s = date.getSeconds();
            this.endTime = date.getFullYear() + '-' + m + '-' + d + ' ' + (hour < 10 ? "0" + hour : hour) + ':' + (min < 10 ? "0" + min : min) + ':' + (s < 10 ? "0" + s : s);

            this.openSend()
        },
        traplayClick() {
            this.trackPlay = !this.trackPlay;

        },
        toolClick(item) {

            const map = this.$refs.playBack.homeMap;
            var index = this.checktoolActive.indexOf(item.value)
            if (index > -1) {
                this.checktoolActive.splice(index, 1);
            } else {
                if (item.value !== 12) {
                    this.checktoolActive.push(item.value)
                }

            }
            if (item.value == 4) {
                this.trackPath = !this.trackPath;
                this.openSend();
            }
            if (item.value == 6) {
                if (this.checktoolActive.indexOf(6) > -1) {
                    this.options.play = false;
                    this.pause = false;
                } else {
                    this.options.play = true;
                    this.pause = true;


                }
            }
            if (item.value == 7) {
                if (this.checktoolActive.indexOf(7) > -1) {
                    setTimeout(() => {

                        map.resize();
                    }, 100)
                } else {
                    setTimeout(() => {
                        map.resize();
                    }, 100)
                }
            }

            if (item.value == 8) {
                this.openEvtSend()
            }
            if (item.value == 9) {
                if (this.checktoolActive.indexOf(9) > -1) {

                    this.fixed = false;
                } else {

                    this.fixed = true;
                }

            }
            if (item.value == 10) {
                if (this.checktoolActive.indexOf(10) > -1) {
                    map.setLayoutProperty('camera-point', 'visibility', 'visible');
                } else {
                    map.setLayoutProperty('camera-point', 'visibility', 'none');
                }

            }
            if (item.value == 11) {
                if (this.checktoolActive.indexOf(11) > -1) {
                    map.setLayoutProperty('si-trafficLayer', 'visibility', 'visible');

                } else {
                    map.setLayoutProperty('si-trafficLayer', 'visibility', 'none');

                }
            }
            if (item.value == 12) {
                this.routerFlag = true;
                this.closeTrackWebsocket()
                this.isVehicleQuery = true;
            }


        },
        // 菜单
        getmodule() {

            var _this = this;
            var param = {

            };

            http.get(window.APP_CONFIG.LOGO_SERVICE + 'mapabc-admin-system/api/v1/menus/build/module?moduleName=' + moduleName, { params: param }).then((data) => {
                var res = this.crossInfoNavMenu = data.data[0].children;
                var re = /.*[\u4e00-\u9fa5]+.*$/;
                var language = navigator.language; //获取浏览器语言
                var lang = language.indexOf('zh') > -1 ? 'zh' : 'en';
                if (lang == 'zh') {
                    var arr = res.filter(item => re.test(item.name));

                } else {
                    var arr = res.filter(item => !re.test(item.name));
                }
                nextRoute = ['home']
                arr.forEach(item => {
                    var param = item.params ? item.params : ''
                    nextRoute.push(item.component)
                })

            })
        },
        request(state) {
            this.websocketState = 1;
            this.bounds = this.$refs.playBack.homeMap.getBounds()
            var _this = this;
            var param = {
                bound: this.bounds

            };
            http.post(window.APP_CONFIG.WEBSOCKET_URL + 'consul/api/request?', param).then((data) => {
                if (data.data.statusCode == 200) {
                    this.URL = data.data.path ? window.APP_CONFIG.WEBSOCKET_URL + data.data.path : data.data.url;
                    this.getwebsocketData()
                    this.getStopline(state)



                } else {
                    this.modal = true;
                }

            })
        },
        getStopline(state) {
            var map = this.$refs.playBack.homeMap
            // if (map.getSource('stopLine')) {
            //     map.removeLayerAndSource('stopLine')
            // };
            // if (map.getSource('textPoint')) {
            //     map.removeLayerAndSource('textPoint')
            // };
            // if (map.getSource('dataArea')) {
            //     map.removeLayerAndSource('dataArea')
            // };
            this.bounds = map.getBounds();
            var _this = this;
            var param = {
                bound: this.bounds._sw.lng + ',' + this.bounds._sw.lat + ';' + this.bounds._ne.lng + ',' + this.bounds._ne.lat

            };
            http.get(this.URL + 'region/api/getStopline?', {
                params: param
            }).then((data) => {
                this.options.geojson = data.data;
                if (state == 1) {
                    this.$refs.playBack.addLayer();
                }


            })
        },
        changeDetailDir(name) {
          this.dir = name
          if (!!this.dir) {
            this.getCrossGraphInfo();
          }
        },
        getCrossGraphInfo() {
            if (!this.URL) {
                return
            }
            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                type: this.timeType,
                inout:this.inout,
                name: this.index,
                t: new Date().getTime(),
                dir: 8
            };

            http.get(this.URL + 'cross/api/getCrossGraphInfo?', { params: param }).then((data) => {

                const res = data.data;
                this.dirs = res.total;
                if (!this.dir) {
                  this.dir = res.total[0].name;
                }
                const lData = [];
                const colors = ['#dcdfe2', '#37EDF6', '#19BCF1', '#f39800'];
                res.total.forEach((item, index) => {
                    lData.push(item.name)
                    if (this.index == '1') {
                        item.stack = '流量';
                        item.areaStyle = {}
                    }
                    item.smooth = true;
                    item.symbol = 'none';
                    item.sampling = 'average';
                })

                var options = {
                    dom: 'home-lineEct',
                    color: 'rgba(255,255,255,0.75)',
                    colors: colors,
                    legendData: {
                        itemHeight: this.width > 3800 ? 14 : 7,
                        itemWidth: this.width > 3800 ? 14 : 7,
                        icon: 'circle',
                        data: lData,
                        textStyle: {
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: this.width > 3800 ? 24 : 12
                        },
                        // right: 10
                    },
                    xAxisData: res.times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: this.width > 3800 ? 60 : 30,
                    gridRight: 35,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    ysplitLine: true,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    series: res.total,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,

                }

                this.dirDatas = {};
                res.detail.forEach(item => {

                    this.dirDatas[item.name] = item;
                })
                var lData1 = []
                this.dirDatas[this.dir].list.forEach(item => {
                    lData1.push(item.name)
                    item.smooth = true;
                    item.symbol = 'none';
                    item.sampling = 'average';
                })

                var options1 = {
                    dom: 'home-lineEct1',
                    color: 'rgba(255,255,255,0.75)',
                    colors: colors,
                    legendData: {
                        itemHeight: this.width > 3800 ? 14 : 7,
                        itemWidth: this.width > 3800 ? 14 : 7,
                        icon: 'circle',
                        data: lData1,
                        textStyle: {
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: this.width > 3800 ? 24 : 12
                        },
                        // right: 10
                    },
                    xAxisData: res.times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: this.width > 3800 ? 60 : 30,
                    gridRight: 25,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    ysplitLine: true,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    series: this.dirDatas[this.dir].list,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,

                }
                this.$nextTick(function() {

                    this.ect = this.EchartsLarge.lineChart2(options)

                    if (this.webType == 'cross') {
                        this.ect1 = this.EchartsLarge.lineChart2(options1)
                    }
                    this.bindChartResizeHandler()
                })
            })
        },
        getCrossGraphInfo1(ectData) {

            if (this.ect) {


                this.ect.setOption({
                    xAxis: [{
                        data: ectData.times
                    }],
                    series: ectData.total
                })

                this.dirDatas = {};
                ectData.detail.forEach(item => {

                    this.dirDatas[item.name] = item;
                })
                if (this.ect1) {
                    this.ect1.setOption({
                        xAxis: [{
                            data: ectData.times
                        }],
                        series: this.dirDatas[this.dir].list
                    })
                }


            }

        },
        getRealtrack() {
            // this.openFullScreen()
            this.openSend()
            var map = this.$refs.playBack.homeMap;
            // map.on('zoomend', function(e) {
            //     _this.openSend()

            // })
            this.bindMapEvent(map, 'moveend', null, 'homeMapMoveEndHandler', () => {
                return () => {
                    if (this.websocketState == 3) {
                        this.request(3)
                        return
                    }
                    this.openSend()
                    this.getStopline(3)
                }
            })


        },

        openSend() {

            if (this.websocketState == 3) {
                return
            }
            var message = JSON.stringify({
                bound: this.$refs.playBack.homeMap.getBounds(),
                isOpen: this.trackPlay ? 1 : 0,
                isTrackPath: this.trackPath ? 1 : 0,
                speed: 1,
                trackType: this.toolActive,
                startTime: this.startTime,
                endTime: this.endTime,
                isProtobuf: isProtobuf,
                language: this.$i18n.locale == 'en' ? 'en-US' : 'zh-CN',
                zoom: this.$refs.playBack.homeMap.getZoom(),
                statDataType: Number(this.index),
                statCrossId: this.crossData ? this.crossData.crossId : '',
                trackId: this.eventData ? this.eventData.trackId : '',
                plateNumber: this.eventData ? this.eventData.plateNumber : ''
            })

            this.sendTrackMessage(message);

        },
        sendTrackMessage(message) {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        applyTrackSocketData(res) {
            if (res.time && res.time.length > 0 && this.crossData) {
                const dt = res.time.slice(0, -1);
                if (dt !== this.lastTrackStatTime) {
                    this.lastTrackStatTime = dt;
                    this.getCrossGraphInfo()
                }
            }
            if (res.crossGraph && this.crossData) {
                //this.getCrossGraphInfo1(res.crossGraph)
            }
            this.options.tracks = res;
            this.tracksTime = res.time;
            if (res.status == 'begin' || res.status == 'timeout') {
                if (this.loading) {
                    this.loading.close();
                }
            }
            if (res.status == 'tracknotify') {
                this.openAlarmSound('/video/in.mp3')
                this.openNotify(res)
            }
        },
        parseTrackSocketMessage(rawData) {
            if (isProtobuf == 1) {
                if (!AwesomeMessage) {
                    return Promise.resolve()
                }
                var arrayBufferPromise = null;
                if (rawData instanceof ArrayBuffer) {
                    arrayBufferPromise = Promise.resolve(rawData);
                } else if (rawData && rawData.arrayBuffer) {
                    arrayBufferPromise = rawData.arrayBuffer();
                }
                if (!arrayBufferPromise) {
                    return Promise.resolve()
                }
                return arrayBufferPromise.then((arrayBuffer) => {
                    var message = AwesomeMessage.decode(new Uint8Array(arrayBuffer));
                    var res = AwesomeMessage.toObject(message, {
                        enums: String,
                        longs: String,
                        bytes: String,
                        defaults: true,
                        arrays: true,
                        objects: true,
                        oneofs: true
                    });
                    this.applyTrackSocketData(res);
                }).catch(() => {})
            }
            if (typeof rawData === 'string') {
                this.applyTrackSocketData(JSON.parse(rawData));
                return Promise.resolve()
            }
            if (rawData && rawData.text) {
                return rawData.text().then((text) => {
                    this.applyTrackSocketData(JSON.parse(text));
                }).catch(() => {})
            }
            return Promise.resolve()
        },
        openNotify(item) {

            this.$notify({
                title: item.time,
                dangerouslyUseHTMLString: true,
                message: '<li>' + '时间：' + item.data.time + '</li>' + '<li>' + '车牌：' + item.track[0].plateNumber + '</li>',
                duration: 2000,
                customClass: this.checktoolActive.indexOf(7) > -1 ? 'right1' : '',
                offset: 130
            });
        },
        getwebsocketData() {
            var _this = this;
            if (this.socketMessage) {
                this.socketMessage.close()
                this.socketMessage = null
            }
            // if (this.websocket) {
            //     this.websocket.close();
            // }
            if ('WebSocket' in window) {
                var url = this.URL.indexOf('https') != -1 ? this.URL.replace(/https/, 'wss') : this.URL.replace(/http/, 'ws');

                this.websocket = new WebSocket(url + "websocket/manager");
            } else {
                alert('不支持 websocket')
            }

            this.websocket.onopen = function(event) {

                if (_this.trackPlay) {
                    _this.getRealtrack();
                }


            }
            this.websocket.onmessage = (event) => {
                this.parseTrackSocketMessage(event.data);
            }

            this.websocket.onclose = function(event) {
                console.log('断开了')
                if (!_this.routerFlag) {
                    _this.socketMessage = _this.$message({
                        showClose: true,
                        message: 'websocket已断开，正在重新连接。',
                        type: 'error',
                        offset: 80,
                        duration: 0
                    });
                    _this.websocketState = 3;
                    setTimeout(() => {
                        _this.request(3)
                    }, 1000)

                }
            }
            this.websocket.onerror = function(event) {
                console.log('error')


            }
        },
        openEvtSend() {
            var message = JSON.stringify({
                type: "connect",
                data: {
                    open: this.checktoolActive.indexOf(8) > -1 ? true : false
                }

            })
            this.sendEvtMessage(message);
        },
        getEvtwebsocketData() {

            var _this = this;

            this.closeEvtWebsocket()
            if ('WebSocket' in window) {
                var url = window.APP_CONFIG.SERVICE_URL.indexOf('https') != -1 ? window.APP_CONFIG.SERVICE_URL.replace(/https/, 'wss') : window.APP_CONFIG.SERVICE_URL.replace(/http/, 'ws');

                this.evtWebsocket = new WebSocket(url + "websocket/event/" + sessionStorage.getItem('userid'));
            } else {
                alert('不支持 websocket')
            }

            this.evtWebsocket.onopen = function(event) {
                _this.openEvtSend()

            }
            this.evtWebsocket.onmessage = function(event) {

                _this.facilityList = JSON.parse(event.data).facilityList
                _this.fireEventList = JSON.parse(event.data).fireEventList
                var item = JSON.parse(event.data).fireEvent.data;

                if (item.centerX) {
                    _this.openAlarmSound('/video/' + item.typeCode + '.mp3')
                    if (_this.checktoolActive.indexOf(6) > -1) {
                        _this.removeFire()
                        _this.$refs.cross3d.addFire(item, assetUrl('../assets/image/fire.png'));


                    } else {
                        _this.addfirePoint(item);
                    }
                }




            }

            this.evtWebsocket.onclose = function(event) {

            }
            this.evtWebsocket.onerror = function(event) {
                console.log('error')
            }
        },
        // 返回火灾信息
        getFireInfoById(id) {

            var _this = this;
            var param = {
                id: id
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/alarm/getFireInfoById?', { params: param }).then((data) => {
                var item = data.data.data;
                item.thermalCamera = false;
                if (_this.checktoolActive.indexOf(6) > -1) {
                    _this.removeFire()
                    _this.$refs.cross3d.addFire(item, assetUrl('../assets/image/fire.png'));
                } else {
                    _this.addfirePoint(item);
                }
            })
        },
        // 火灾报警
        addfirePoint(item) {
            if (this.isVehicleQuery) {
                return
            }
            var _this = this;
            var map = this.$refs.playBack.homeMap;
            if (alarmPopup) {
                _this.removealarmPopup(item)
            }
            var obj = {
                item: item,
                maps: map,
                id: 'huo',
                coordinates: [item.centerX, item.centerY],
                iconImg: 'icon-evt',
                type: 'firepoint',
                iconSize: 1.5
            }
            this.mapUtils.addPoint(obj, this.importantEvtClick);
            map.flyTo({ center: [item.centerX, item.centerY] });
            var html = '<div class="alarm-info-box">' +
                '<p><span>' + item.eventTypeName + '</span></p>' +
                '<div>' +
                '<li><span>发生位置：</span><b>' + item.location + '</b></li>' +
                '<li><span>上报时间：</span><b>' + item.reportTime + '</b></li>' +
                // '<li><span>报警来源：</span><b>' + item.source + '</b></li>' +
                '<li><span>设备桩号：</span><b>' + item.kilometerPile + '</b></li>' +
                '<div class="button-box">' +
                (item.state !== "2" ? '<li id="save">确认</li>' : '') + '<li id="esc">撤销</li>' + (item.typeCode == 101 ? '<li id="publish">建议发布信息</li>' : '') + (item.deviceType == 2 ? '<li id="switch">切换视频</li>' : '') +
                '</div>' +
                '</div>' +
                '<video   controls muted autoplay loop id="a' + item.cameraCode + '" ></video>' +
                '</div>';
            alarmPopup = new mapabcgl.Popup({
                    closeOnClick: false,
                    closeButton: false,
                    offset: [0, -20]
                })
                .setHTML(html)
                .setLngLat([item.centerX, item.centerY])
                .addTo(map);

            setTimeout(() => {
                var esc = document.getElementById('esc')
                var publish = document.getElementById('publish')
                if (item.state !== "2") {
                    var save = document.getElementById('save')
                    if (save) {
                        save.onclick = function() {
                            item.state = '2';
                            var message = JSON.stringify({
                                type: "fireEvent",
                                data: item
                            })

                            _this.sendEvtMessage(message);
                            _this.removealarmPopup(item)
                        };
                    }
                }

                if (esc) {
                    esc.onclick = function() {
                        item.state = '3';
                        var message = JSON.stringify({
                            type: "fireEvent",
                            data: item
                        })
                        _this.sendEvtMessage(message);
                        _this.removealarmPopup(item)
                    };
                }
                if (publish) {
                    publish.onclick = function() {

                        _this.publishInfo = item;
                    };
                }

                var switch_ = document.getElementById('switch')
                if (switch_) {
                    switch_.onclick = function() {
                        item.thermalCamera = !item.thermalCamera;
                        _this.addfirePoint(item)

                    };
                }

                this.getalarmVideo(item, 0)
            }, 500)




        },
        removealarmPopup(item) {
            var map = this.$refs.playBack.homeMap;
            alarmPopup.remove()
            alarmPopup = null
            map.removeLayerAndSource('huo');
            this.getalarmVideo(item, 1)

        },
        cofirmFire(item) {
            var message = JSON.stringify({
                type: "fireEvent",
                data: item
            })
            this.sendEvtMessage(message);
        },
        getalarmVideo(item, operation) {
            const _this = this;
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var param = {

                rid: this.alarmVideoRid ? this.alarmVideoRid : item.rid,
                id: this.alarmVideoId ? this.alarmVideoId : cameraCode,
                operation: operation

            }
            http.get(window.APP_CONFIG.SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                this.alarmVideoRid = item.rid;
                this.alarmVideoId = cameraCode;
                if (operation == 0) {
                    if (data.data.code == -1) {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error',
                            offset: 80
                        });
                    } else {
                        //this.supported = Flv.isSupported()
                        this.loadLocalMediaDataSource_alarm(item, data.data.resultObject)
                    }
                }

                if (operation == 1) {
                    this.alarmVideoRid = '';
                    this.alarmVideoId = '';
                }

            }).catch((data) => {
                console.log(data)
            })
        },
        loadLocalMediaDataSource_alarm(item, url) {

            var mediaDataSource = {
                type: 'flv',
                isLive: true,
                url: url,
                hasAudio: false,
                hasVideo: true,
            }
            this.load_alarm(item, mediaDataSource);

        },
        load_alarm(item, mediaDataSource) {
            var id = 'a' + item.cameraCode; //video播放框id
            var Elem = document.getElementById(id)
            //使用flvExtend
            var flv = new FlvExtend({
                element: Elem, // *必传
                frameTracking: true, // 开启追帧设置
                updateOnStart: true, // 点击播放后更新视频
                updateOnFocus: true, // 获得焦点后更新视频
                reconnect: true, // 开启断流重连
                reconnectInterval: 500 // 断流重连间隔
            })
            player = flv.init({
                type: 'flv',
                url: mediaDataSource.url,
                isLive: true,
                hasAudio: false
            }, {
                enableStashBuffer: false, // 如果您需要实时（最小延迟）来进行实时流播放，则设置为false
                autoCleanupSourceBuffer: true, // 对SourceBuffer进行自动清理
                stashInitialSize: 128 // 减少首帧显示等待时长
            })
            // player = Flv.createPlayer(mediaDataSource)
            // player.attachMediaElement(Elem);
            // player.load()
            this.start()
            Elem['disablePictureInPicture'] = true;

        },
        openAlarmSound(path) {
            const audioContext = getSharedAudioContext();
            if (!audioContext) {
                return;
            }
            async function play() {
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                let audioBuffer = alarmAudioBufferCache[path];
                if (!audioBuffer) {
                    const res = await fetch(path);
                    const arraybuffer = await res.arrayBuffer();
                    audioBuffer = await audioContext.decodeAudioData(arraybuffer);
                    alarmAudioBufferCache[path] = audioBuffer;
                }
                const source = audioContext.createBufferSource();
                source.connect(audioContext.destination); //连接上实例
                source.buffer = audioBuffer;
                source.start();
            }
            play()

        },
        importantEvtClick(item) {

        },

        // 路口点位
        getCrossLocation() {

            var _this = this;
            var param = {

            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getCrossLocation?', { params: param }).then((data) => {

                var map = this.$refs.playBack.homeMap;
                var res = data.data.data;
                var xys = [],
                    features = [],
                    linefeatures = [];
                var getCongestionColor = function(index) {
                    var value = Number(index);
                    if (isNaN(value)) {
                        return 'rgb(243, 152, 0)';
                    }
                    if (value < 1.2) {
                        return '#00B050';
                    }
                    if (value < 5) {
                        return '#FFD966';
                    }
                    return '#FF3B30';
                };
                this.roadCascaderOptions = []
                for (var key in res) {
                    var obj = {
                        crossId: key,
                        crossName: key == 'road' ? '路段' : '路口',
                        children: res[key]
                    }
                    this.roadCascaderOptions.push(obj)
                    res[key].forEach(item => {
                        this.crossListObj[item.crossId] = item;
                    })
                }
                res.cross.forEach((item, index) => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.centerX, item.centerY]
                        },

                        "properties": Object.assign({}, item, {
                            pointColor: getCongestionColor(item.congestionIndex)
                        }),
                    };
                    xys.push([item.centerX, item.centerY]);
                    features.push(obj)
                })
                var crossPointData = {
                    "type": "FeatureCollection",
                    "features": features
                };
                if (map.getSource('cross-point')) {
                    map.getSource('cross-point').setData(crossPointData);
                } else {
                    map.addSource("cross-point", {
                        "type": "geojson",
                        "data": crossPointData
                    });
                }
                if (!map.getLayer('cross-point')) {
                    map.addLayer({
                        "id": "cross-point",
                        "type": "circle",
                        "source": "cross-point",

                        paint: {

                            "circle-radius": 8,
                            "circle-opacity": 0.8,
                            "circle-color": [
                                'coalesce',
                                ['get', 'pointColor'],
                                'rgb(243, 152, 0)'
                            ]


                        },

                    });
                    this.bindMapEvent(map, 'click', 'cross-point', 'crossPointClickHandler', () => {
                        return (event) => {
                            var item = event.features[0].properties;
                            this.crossClick(item)
                        }
                    });
                }
                return
                if (res.road) {
                    res.road.forEach((item, index) => {
                        var wkt = item.wkt.replace('LINESTRING(', '').replace(')', '').split(',')
                        var coordinates = []

                        wkt.forEach(item => {
                            var line = item.split(' ').map(Number)
                            coordinates.push(line)
                        })
                        var obj = {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinates
                            },

                            "properties": {},
                        };

                        linefeatures.push(obj)
                    })
                    map.addSource("road-line", {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": linefeatures
                        }
                    });
                    map.addLayer({
                        "id": "road-line",
                        "type": "line",
                        "source": "road-line",

                        paint: {

                            "line-width": 5,
                            "line-opacity": 0.5,
                            "line-color": 'rgb(243, 152, 0)'


                        },

                    });
                    this.mapUtils.setBestMap(xys, { maps: map, left: 200, right: 200, maxZoom: 24 })
                }


            })
        },
        // 拥堵分析
        getCongestionAnalysis() {

            var _this = this;
            var id = this.crossData ? this.crossData.crossId : ''
            if (id.length === 23) {
                id = id.substring(11, 22);
            }
            var param = {
                type: this.day,
                id: id
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getCongestionAnalysis?', { params: param }).then((data) => {
                var res = this.CongestionAnalysis = data.data.data;
                this.cNav = res.lists[0].id;

                res.echartsVoMap[this.cNav].series.forEach(item => {
                    item.smooth = false;
                    item.areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(55, 237, 246,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(55, 237, 246,0.1)'
                        }])
                    }
                })


                var options = {
                    dom: 'ydfxEct',
                    color: 'rgba(255,255,255,.75)',
                    colors: ['#37EDF6', '#19BCF1'],
                    legendData: [],
                    xAxisData: res.echartsVoMap[this.cNav].times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: res.echartsVoMap[this.cNav].series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,
                    legendtextStyle: {
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        fontFamily: 'Microsoft YaHei'
                    }
                }

                this.$nextTick(function() {

                    this.cEct = this.EchartsLarge.lineChart2(options)
                })



            })
        },
        // 延误分析
        getDelayAnalysis() {

            var _this = this;
            var id = this.crossData ? this.crossData.crossId : ''
            if (id.length === 23) {
                id = id.substring(11, 22);
            }
            var param = {
                type: this.day,
                id: id
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getDelayAnalysis?', { params: param }).then((data) => {
                var res = this.BlockAnalysis = data.data.data;
                this.bNav = res.list[0].id;
                res.echartsVoMap[this.bNav].series.forEach(item => {
                    item.smooth = false;
                    item.areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(10, 215, 138,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(10, 215, 138,0.1)'
                        }])
                    }
                })
                var options = {
                    dom: 'zdfxEct',
                    color: 'rgba(255,255,255,.75)',
                    colors: ['#0AD78A', '#19BCF1'],
                    legendData: [],
                    xAxisData: res.echartsVoMap[this.bNav].times,
                    yAxisName: '',
                    gridLeft: 0,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: res.echartsVoMap[this.bNav].series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,
                    legendtextStyle: {
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        fontFamily: 'Microsoft YaHei'
                    }
                }

                this.$nextTick(function() {

                    this.bEct = this.EchartsLarge.lineChart2(options)
                })



            })
        },
        // 轨迹分析
        getTrackAnalysis() {
            //暂时取消轨迹分析
            return
            var _this = this;
            var param = {
                type: this.day,
                id: this.crossData ? this.crossData.crossId : ''
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getTrackAnalysis?', { params: param }).then((data) => {
                this.trackAnalysis = data.data.data;
                var barres = data.data.data.echartsVo;
                barres.series.forEach(item => {
                    item.itemStyle = {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [
                                { offset: 1, color: '#08DD92' },
                                { offset: 0.5, color: '#87F8D5' },
                                { offset: 0, color: '#87F8D5' }
                            ]
                        )
                    }
                    item.barWidth = this.width > 3800 ? 20 : 12;
                })
                var baroptions = {
                    dom: 'gjfxEct',
                    color: 'rgba(255,255,255,.75)',
                    legendData: [],
                    xAxisData: barres.times,
                    yAxisName: '',
                    gridLeft: 0,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    yaxisLineShow: false,
                    yaxisLabelShow: true,
                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: barres.series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    nameGap: 25,
                    legendtextStyle: {
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 12,
                        fontFamily: 'Microsoft YaHei'
                    },

                    // interval: 0,
                    xaxisTickShow: false
                }
                this.$nextTick(function() {

                    this.EchartsLarge.barChart(baroptions);
                })


            })
        },
        // 高发点位
        getHighPointSection() {

            var _this = this;
            var param = {
                type: this.dateType
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getHighPointSection?', { params: param }).then((data) => {
                var totalSumAll = 0;
                data.data.data.echartsVo.series[0].data.forEach(item => {
                    totalSumAll += Number(item.value)
                })
                totalSumAll = totalSumAll != 0 ? totalSumAll.toFixed(2) : 0;
                var res = this.HighFatSection = data.data.data;
                this.HighFatSection.totalSumAll = totalSumAll;
                var options = {
                    colors: this.colors,
                    dom: 'scfxEct',
                    name: res.echartsVo.series[0].name,
                    data: res.echartsVo.series[0].data,
                    label: {

                        normal: {
                            show: true,
                            position: 'center',
                            color: '#fff',
                            formatter: function() {
                                return '总时长' + '\n' + totalSumAll
                            }
                        }


                    },

                    radius: ['50%', '60%'],
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: this.width > 3800 ? 40 : 16,
                            fontWeight: 'bold'
                        }
                    }
                }

                this.$nextTick(function() {

                    this.EchartsLarge.reportpie(options);
                    // this.EchartsLarge.barChart(baroptions);
                })


            })
        },
        // 路口拥堵top10
        getCrossTop10() {

            var _this = this;
            var param = {
                type: this.day
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getCrossTop10?', { params: param }).then((data) => {

                this.crossList = data.data.data;
                this.videoCrossData = data.data.data.data[0]
                this.getRealDirList()

            })
        },
        // 路段拥堵top10
        getRoadTop10() {

            var _this = this;
            var param = {
                type: this.day
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getRoadTop10?', { params: param }).then((data) => {

                this.roadList = data.data.data;

            })
        },
        // 路网概况
        getRoadNetworkOverview() {

            var _this = this;
            var param = {
                id: this.crossData ? this.crossData.crossId : ''
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getRoadNetworkOverview?', { params: param }).then((data) => {
                var res = this.RoadNetworkOverview = data.data.data.valueVoList;

                var length
                res.forEach(item => {

                    item.icon = assetUrl('../assets/image/screen/center/' + item.icon + '.png')
                    if (item.name.indexOf('事件') > -1) {

                        length = Number(item.value)

                    }
                })
                if (length > this.eventTotal) {
                    this.eventTotal = length;
                    this.isDot = true;
                }

            })
        },
        eventNumClick(item) {
            if (item.name == '交通事件' || item.name == '轨迹事件') {
                this.isDot = false;

                this.eventClickTime.push(this.mapUtils.getDateYMD('ymdhms'));
                if (this.eventClickTime.length > 2) {
                    this.eventClickTime.shift();
                }

                this.isTtafficEvt = true;
                this.trackPlay = false;
                this.autoPolling = false;
                this.eventInfoReturnHome = false;
                this.$refs.playBack.homeMap.removeLayer('crossing')
                this.$refs.playBack.crossing.clear()


            }

        },
        //路网详情点击
        netWorkInfoClick() {
            this.isNetWorkInfo = true
        },
        // 事件监测路口数量
        getStatsList() {

            var _this = this;
            var param = {

            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getStatsList?', { params: param }).then((data) => {
                var res = this.crossStatusList = data.data.data;

                res.forEach(item => {
                    item.icon = assetUrl('../assets/image/screen/center/' + item.icon + '.png')

                })
            })
        },
        crossStatusClick(item) {
            this.getStatsTop(item)
        },
        // 事件监测路口排名
        getStatsTop(item) {

            var _this = this;
            var param = {
                id: item.id
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getStatsTop?', { params: param }).then((data) => {
                var res = data.data.data,
                    xys = [],
                    features = [];
                var map = this.$refs.playBack.homeMap;
                map.removeLayerAndSource('crossIndex-point')
                res.forEach((temp, index) => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [temp.centerX, temp.centerY]
                        },

                        "properties": temp,
                    };
                    xys.push([temp.centerX, temp.centerY])
                    features.push(obj)
                })


                var options = {
                    maps: map,
                    features: features,
                    id: 'crossIndex-point',
                    iconImg: 'pulsing-dot',
                    iconSize: 1,
                    textHaloColor: '#fff',
                    textColor: '#fff',

                }
                this.mapUtils.addgeojsonPoint(options);
                this.mapUtils.setBestMap(xys, { maps: map, left: 200, right: 200, maxZoom: 24 })
                this.bindMapEvent(map, 'click', 'crossIndex-point', 'crossIndexPointClickHandler', () => {
                    return (event) => {
                        var item = event.features[0].properties;
                        this.crossClick(item)
                    }
                });
            })
        },
        // 路口视频列表
        getCameraList() {

            var _this = this;
            var param = {

            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getCameraList?', { params: param }).then((data) => {
                var res = data.data.data;
                var features = [];
                var map = this.$refs.playBack.homeMap;
                map.removeLayerAndSource('camera-point')
                res.forEach((item, i) => {
                  if (item.status == undefined) {
                    item.status = "1"
                  }
                  var obj = {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [item.centerX, item.centerY]
                    },
                    "properties": item
                  };

                  features.push(obj)

                });



                var options = {
                    maps: map,
                    features: features,
                    id: 'camera-point',
                    iconImg: ["concat", "icon-camera-", ["to-string", ["get", "deviceType"]], "-", ["to-string", ["get", "status"]]],
                    iconSize: 0.5,
                    textHaloColor: '#fff',
                    textColor: '#fff',
                    visibility: this.checktoolActive.indexOf(10) > -1 ? 'visible' : 'none'

                }
                this.mapUtils.addgeojsonPoint(options);
                this.bindMapEvent(map, 'click', 'camera-point', 'cameraPointClickHandler', () => {
                    return (event) => {
                        var item = event.features[0].properties;
                        this.mapCrossClick(item)
                    }
                });
                this.bindMapEvent(map, 'mousemove', 'camera-point', 'cameraPointMouseMoveHandler', () => {
                    return (event) => {
                        var item = event.features[0].properties;
                        this.crossMousemove(item)
                    }
                });
                this.bindMapEvent(map, 'mouseleave', 'camera-point', 'cameraPointMouseLeaveHandler', () => {
                    return () => {
                        this.crossMouseleave()
                    }
                });


            })
        },
        // 全息路况
        // getRealRoadCondition() {
        //     if (this.isVehicleQuery) {
        //         return
        //     }
        //     if (!traffic) {
        //         return
        //     }
        //     const map = this.$refs.playBack.homeMap;
        //     if (map.getSource('si-trafficLayer')) {
        //         map.removeLayerAndSource('si-trafficLayer')
        //     }
        //     var _this = this;
        //     var param = {

        //     };

        //     http.get(window.APP_CONFIG.SERVICE_URL + 'condition/getRealRoadCondition?', { params: param }).then((data) => {

        //         var res = data.data.data;
        //         this.mapUtils.addgeojsonLine({
        //             maps: this.$refs.playBack.homeMap,
        //             features: res.features,
        //             id: 'si-trafficLayer',
        //             strokeWeight: 5,
        //             beforeId: 'hdmap_dlm_z17_z23_zlevel',
        //             visibility: this.checktoolActive.indexOf(11) > -1 ? 'visible' : 'none',
        //             color: { //线的颜色
        //                 "property": "state",
        //                 "type": "categorical",
        //                 "stops": [
        //                     [{
        //                             "zoom": 10,
        //                             "value": 1
        //                         },
        //                         "#0bf007"
        //                     ],
        //                     [{
        //                             "zoom": 10,
        //                             "value": 2
        //                         },
        //                         "#3e64f3"
        //                     ],
        //                     [{
        //                             "zoom": 10,
        //                             "value": 3
        //                         },
        //                         "#f9f808"
        //                     ],
        //                     [{
        //                             "zoom": 10,
        //                             "value": 4
        //                         },
        //                         "#fbbc0d"
        //                     ],
        //                     [{
        //                             "zoom": 10,
        //                             "value": 5
        //                         },
        //                         "#f60704"
        //                     ]
        //                 ],
        //                 "default": "#0bf007"
        //             }
        //         })


        //     })
        // },
        getRealRoadCondition() {
            var _this = this;
            var param = {

            };

            const map = this.$refs.playBack.homeMap;

            http.get(window.APP_CONFIG.SERVICE_URL + 'external/getConstantRoad?', { params: param }).then((data) => {
                if (traffic) {
                    const features = data.data.data.features

                    features.forEach((item) => {
                      item.properties.id = item.id
                      item.properties.color = 'red'
                    })

                    this.mapUtils.addgeojsonLine({
                        maps: map,
                        id: 'si-trafficLayer',
                        features: features,
                        opacity: 1,
                        color: ["get", "color"],
                        strokeWeight: 4,
                        //beforeId: 'hdmap_dlm_z17_z23_zlevel',
                        //visibility: this.checktoolActive.indexOf(11) > -1 ? 'visible' : 'none',

                    })

                    this.getStateList()
                }

            })
        },
        getStateList() {
            var _this = this;
            var map = this.$refs.playBack.homeMap;
            var param = {
                time: this.mapUtils.getDateYMD('ymdhms')
            };

            http.get(window.APP_CONFIG.SERVICE_URL + 'external/getStateList2?', { params: param }).then((data) => {
                var res = data.data.data;
                var data = map.getSource('si-trafficLayer')._data;
                data.features.forEach((item, i) => {
                    item.properties.color = res[i] == 1 ? 'rgba(19, 134, 22, 1)' : res[i] == 2 ? 'rgba(222, 161, 29, 1)' : res[i] == 3 ? 'rgba(222, 29, 29, 1)' : res[i] == 4 ? 'rgba(98, 3, 3, 1)' : 'rgba(124, 124, 122, 1)'
                })
                map.getSource('si-trafficLayer').setData(data)
            })
        },
        crossMousemove(item) {

            this.$refs.playBack.homeMap.getCanvas().style.cursor = 'pointer';
            if (cameraLabel) {
                cameraLabel.remove()
            }
            var el = document.createElement('div')
            el.innerHTML = item.name;
            cameraLabel = new mapabcgl.Marker(el)
                .setOffset([0, 20])
                .setLngLat([item.centerX, item.centerY])
                .addTo(this.$refs.playBack.homeMap);
        },
        crossMouseleave() {
            this.$refs.playBack.homeMap.getCanvas().style.cursor = '';
            if (cameraLabel) {
                cameraLabel.remove()
            }
        },
        mapCrossClick(item) {
            var _this = this;
            item.thermalCamera = false;
            this.playVideo(item, 0)
            this.crossDataArr.push(item)
        },
        playVideo(item, operation) {
            const _this = this;
            if (operation == 0 && item.deviceType == 2) {
                item.thermalCamera = !item.thermalCamera;
            }

            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            if (operation == 0) {

                if (this.cameraCodeArr.indexOf(cameraCode) > -1) {
                    console.log('已存在')
                    return
                } else {
                    this.cameraCodeArr.push(cameraCode)
                }
                if (this.cameraCodeArr.length == 4) {
                    this.$message({
                        message: '同时播放实时视频数量已达上限。',
                        type: 'warning',
                        offset: 80
                    });
                    this.cameraCodeArr.pop()
                    return
                }
            }


            var param = {

                rid: item.rid,
                id: cameraCode,
                operation: operation,
                startTime: this.toolActive == 2 ? this.startTime : '',
                endTime: this.toolActive == 2 ? this.endTime : ''

            }

            if (!!PlayVideoDemo) {
                param.demo = 1;
            } else {
                param.demo = 0;
            }

            http.get(window.APP_CONFIG.SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                if (data.data.code == -1) {
                    this.$message({
                        showClose: true,
                        message: data.data.msg,
                        type: 'error',
                        offset: 80
                    });
                    this.cameraCodeArr.pop()
                } else {
                    if (operation == 0) {

                        var html = '<div class="video-bg" id="test"><p><span>' + item.name + '</span>' + (item.deviceType == 2 ? '<span style="font-size:12px;margin-left:20px;color: #41fdfc;cursor:pointer;" id="s' + cameraCode + '">切换视频</span>' : '') + '<b id="' + cameraCode + '">x</b></p>' + '<video id="c' + cameraCode + '"  controls muted autoplay loop ></video></div>';

                        item.offset = [0, -20]
                        this.addPopup(html, item, this.closePopup, data.data.resultObject, this.switchVideo)
                    } else {

                    }
                }



            }).catch((data) => {
                console.log(data)
            })
        },
        addPopup(html, item, callback, url, callback1) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var popup = new mapabcgl.Popup({
                    closeOnClick: false,
                    closeButton: false,
                    offset: item.offset
                })
                .setHTML(html)
                .setLngLat([item.centerX, item.centerY])
                .addTo(this.$refs.playBack.homeMap);
            //this.supported = Flv.isSupported()
            this.loadLocalMediaDataSource(item, url)
            const drag = popup.getElement();
            this.dragFunc(drag)
            popupArr.push({

                obj: popup
            });

            var popupElem = document.getElementById(cameraCode)

            if (popupElem) {
                popupElem.onclick = function(e) {
                    if (callback) {
                        callback(item, e);
                    }
                };
            }
            var s = document.getElementById('s' + cameraCode)
            if (!!s) {
                s.onclick = function(e) {
                    if (callback1) {
                        callback1(item, e);
                    }
                };
            }
        },
        dragFunc(Drag) {
            Drag.onmousedown = function(event) {
                var ev = event || window.event;
                event.stopPropagation();
                var disX = ev.clientX - Drag.offsetLeft;
                var disY = ev.clientY - Drag.offsetTop;
                document.onmousemove = function(event) {
                    var ev = event || window.event;
                    Drag.style.left = ev.clientX - disX + "px";
                    Drag.style.top = ev.clientY - disY + "px";
                    Drag.style.cursor = "move";
                };
            };
            Drag.onmouseup = function() {
                document.onmousemove = null;
                this.style.cursor = "default";
            };
        },
        loadLocalMediaDataSource(item, url) {

            var mediaDataSource = {
                type: 'flv',
                isLive: true,
                url: url,
                hasAudio: false,
                hasVideo: true,
            }
            this.load(item, mediaDataSource);

        },
        load(item, mediaDataSource) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var id = 'c' + cameraCode; //video播放框id
            var Elem = document.getElementById(id)
            var isAlive = this.toolActive != 2
            console.log('flv init on map alive:' + isAlive)
            //使用flvExtend
            var flv = new FlvExtend({
                element: Elem, // *必传
                frameTracking: isAlive, // 开启追帧设置
                updateOnStart: true, // 点击播放后更新视频
                updateOnFocus: true, // 获得焦点后更新视频
                reconnect: true, // 开启断流重连
                reconnectInterval: 1500 // 断流重连间隔
            })
            player = flv.init({
                type: 'flv',
                url: mediaDataSource.url,
                isLive: isAlive,
                hasAudio: false
            }, {
                enableStashBuffer: !isAlive, // 如果您需要实时（最小延迟）来进行实时流播放，则设置为false
                autoCleanupSourceBuffer: isAlive, // 对SourceBuffer进行自动清理
                stashInitialSize: 128, // 减少首帧显示等待时长
                liveBufferLatencyChasing: true, //追踪 HTMLMediaElement 中内部缓冲区导致的直播延迟
                liveBufferLatencyMaxLatency: 1.5 //HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）。
            })
            // player = Flv.createPlayer(mediaDataSource)
            // player.attachMediaElement(Elem);
            // player.load()
            player.on('error', (e) => { console.log('error' + e) })
            player.on('loading_complete', (e) => { console.log('loading_complete' + e) })
            player.on('recovered_early_eof', (e) => { console.log('recovered_early_eof' + e) })
            player.on('media_info', (e) => { console.log('media_info' + e) })
            player.on('metadata_arrived', (e) => { console.log('metadata_arrived' + e) })

            this.start()
            Elem['disablePictureInPicture'] = true;
            playerArr.push({
                item: item,
                player: player

            });
        },
        start() {
            player && player.play();
        },

        destroy(player, item) {

            if (player) {
                player.close();
                player = null;
                console.log('destory video:' + item.cameraCode)
                this.playVideo(item, 1)
            }
        },
        closePopup(item) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            this.cameraCodeArr.forEach((p, index) => {
                if (p == cameraCode) {
                    popupArr[index].obj.remove()

                    popupArr.splice(index, 1)
                    this.cameraCodeArr.splice(index, 1)
                    this.destroy(playerArr[index].player, item)

                }

            })


            playerArr.splice(playerArr.findIndex(pop => pop.item.cameraCode === item.cameraCode), 1)
            // this.playVideo(item, 1)
        },
        switchVideo(item) {

            this.closePopup(item)
            this.playVideo(item, 0)
        },
        //天气top
        getWeather() {
            if (this.$refs.playBack) {
                this.mapUtils.removeLayers('weatherpoint', this.$refs.playBack.homeMap)
                this.mapUtils.removeMarkers('popup')
                this.weatherId = null;
            }

            var _this = this;
            var param = {
                currentPage: this.weatherPage,
                pageSize: this.weatherPageSize
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getWeather?', { params: param }).then((data) => {

                var res = this.weatherList = data.data.data.resultList;
                this.weatherTotal = data.data.data.totalNum;
                var arr = [],
                    map = this.$refs.playBack.homeMap;
                res.forEach(item => {
                    try {
                        var url = assetUrl('../assets/image/screen/weather/' + item.weatherCode + '.png');

                        item.icon = url;


                    } catch (e) {


                    }
                    arr.push([item.centerX, item.centerY])
                    var obj = {
                        item: item,
                        maps: map,
                        id: 'w' + item.roadId,
                        coordinates: [item.centerX, item.centerY],
                        iconImg: 'w-' + item.weatherCode,
                        type: 'weatherpoint',
                        iconSize: 0.25,

                    }
                    this.mapUtils.addPoint(obj, this.weatherpointClick);
                })
                this.mapUtils.setBestMap(arr, { maps: map, left: 500, right: 200, maxZoom: 17 })

            })
        },
        weatherCurrentChange(val) {
            this.weatherPage = val;
            this.getWeather()
        },
        weatherClick(item) {
            this.weatherId = item.roadId;
            this.$refs.playBack.homeMap.setCenter([item.centerX, item.centerY])


        },
        weatherpointClick(item) {
            var html = '<div class="vehicle-info-box three-info-box" >' +
                '<div class="vehicle-info-box-title">' + item.roadName + '</div>' +
                '<div class="vehicle-info">' +

                '<li><b>时间</b><span>' + item.time.substr(10) + '</span></li>' +

                '<li><b>天气</b><span>' + item.weather + '</span></li>' +

                '<li><b>路面条件</b><span>' + item.roadCondition + '</span></li>' +

                '<li><b>能见度</b><span>' + item.visibility + '</span></li>' +

                '</div>' + '</div>'
            var obj1 = {
                html: html,
                maps: this.$refs.playBack.homeMap,
                lnglat: [item.centerX, item.centerY],
                offset: [0, -20],
                type: 'popup'
            }
            this.mapUtils.addPopup(obj1)
        },
        //三急一速top
        getThreeQuickSpeed() {


            if (this.$refs.playBack) {
                this.mapUtils.removeLayers('threepoint', this.$refs.playBack.homeMap)
                this.mapUtils.removeMarkers('popup')
                this.threeId = null;
            }

            var _this = this;
            var param = {
                currentPage: this.threeQuickSpeedPage,
                pageSize: this.threeQuickSpeedPageSize,
                dateType: this.threeDateType
            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getThreeQuickSpeed?', { params: param }).then((data) => {

                var res = this.ThreeQuickSpeedList = data.data.data.resultList;
                this.threeQuickSpeedTotal = data.data.data.totalNum;
                var map = this.$refs.playBack.homeMap,
                    arr = [];
                res.forEach(item => {
                    arr.push([item.centerX, item.centerY])
                    var obj = {
                        item: item,
                        maps: map,
                        id: 't' + item.roadId,
                        coordinates: [item.centerX, item.centerY],
                        iconImg: 'icon-three',
                        type: 'threepoint',

                    }
                    this.mapUtils.addPoint(obj, this.threePointClick);
                })
                // this.mapUtils.setBestMap(arr, { maps: map, left: 500, right: 200, maxZoom: 16 })

            })
        },
        threeQuickSpeedCurrentChange(val) {
            this.threeQuickSpeedPage = val;
            this.getThreeQuickSpeed()
        },
        threeClick(item) {
            this.threeId = item.roadId;
            this.$refs.playBack.homeMap.setCenter([item.centerX, item.centerY])



        },
        threePointClick(item) {
            var html = '<div class="vehicle-info-box three-info-box" >' +
                '<div class="vehicle-info-box-title">' + item.roadName + '</div>' +
                '<div class="vehicle-info">' +

                '<li><b>急加量</b><span>' + item.jijiaCount + '</span></li>' +

                '<li><b>急刹量</b><span>' + item.jishaCount + '</span></li>' +

                '<li><b>急转量</b><span>' + item.jizhuanCount + '</span></li>' +

                '<li><b>三急总量</b><span>' + item.sanjiCount + '</span></li>' +
                '<li><b>超速比率</b><span>' + item.speedingPercent.toFixed(2) + '</span></li>' +
                '</div>' + '</div>'
            var obj1 = {
                html: html,
                maps: this.$refs.playBack.homeMap,
                lnglat: [item.centerX, item.centerY],
                offset: [0, -20],
                type: 'popup'
            }
            this.mapUtils.addPopup(obj1)
        },


        iniTracks() {
            this.$refs.playBack.homeMap.addControl(new mapabcgl.NavigationControl());
            var _this = this;
            if (this.webType == 'highway') {
                this.getWeather()
                this.getThreeQuickSpeed()
                this.getEvtwebsocketData()
                // this.getRealAlarmCount()
                // this.getRealHtoMap()

            } else {

            }
            if (traffic) {
                this.getRealRoadCondition()
            }

            this.getCrossLocation()
            this.bounds = this.$refs.playBack.homeMap.getBounds()
            this.request(1)
            this.getCameraList()
        },


        // 事件类型占比
        getEventRatio() {

            var _this = this;
            var param = {

            };

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getEventRatio?', { params: param }).then((data) => {
                var totalSumAll = 0;
                data.data.data.echartsVo.series[0].data.forEach(item => {
                    totalSumAll += Number(item.value)
                })

                var res = this.EventRatio = data.data.data;
                this.EventRatio.totalSumAll = totalSumAll;
                var options = {
                    colors: this.colors,
                    dom: 'sjlxEct',
                    name: res.echartsVo.series[0].name,
                    data: res.echartsVo.series[0].data,
                    label: {

                        normal: {
                            show: true,
                            position: 'center',
                            color: '#fff',
                            formatter: function() {
                                return '事件总数' + '\n' + totalSumAll
                            }
                        }


                    },
                    center: ['50%', '50%'],
                    radius: ['50%', '60%'],
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    }
                }

                this.$nextTick(function() {
                    this.EchartsLarge.reportpie(options);

                })


            })
        },
        // 事件信息统计排序分类
        getEventOrderType() {
            var _this = this;
            var param = {


            }

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getEventOrderType?', { params: param }).then((data) => {

                this.evtOrderType = data.data.data;
                this.evtOrder = data.data.data[0].value;
                this.getEventList()
            })
        },
        // 事件信息统计
        getEventList() {

            var _this = this;

            var param = {
                type: 1,
                currentPage: this.page,
                pageSize: this.pageSize,
                order: this.evtOrder

            }

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getEventList?', { params: param }).then((data) => {
                this.eventId = null;
                this.autoRefresh = false;
                // if (this.video) {
                //     this.video.removeEventListener('ended', _this.mp4play, true)

                // }
                this.autoRefresh = true;
                this.getEventStateCount()
                var res = this.EventRealList = [] = data.data.data.resultList;
                if (res.length == 0) {
                    return
                }

                // this.evtTotal = data.data.data.totalNum;
                // this.eLen = data.data.data.totalNum;
                // this.ecurr = 0;
                // this.video = this.$refs.J_video;
                // this.vList = res[this.ecurr].videoUrl;
                // this.vLen = 0;
                // this.vLen = this.vList.length;
                // this.curr = 0;
                // this.mp4play();

                // this.video.addEventListener('ended', _this.mp4play);



            })
        },

        // mp4play() {

        //     if (!this.autoPolling) {
        //         return
        //     };
        //     if (this.curr == this.vLen) {

        //         if (!this.eventId) {

        //             this.ecurr++;

        //             if (this.ecurr >= this.eLen) {
        //                 this.ecurr = 0;
        //             }
        //         }

        //         this.curr = 0;
        //         this.vLen = this.EventRealList[this.ecurr].videoUrl.length;

        //     }

        //     this.$nextTick(() => {
        //         this.video.src = window.APP_CONFIG.SERVICE_URL + this.EventRealList[this.ecurr].videoUrl[this.curr];

        //         setTimeout(() => {
        //             this.video.load();
        //             this.video.play();
        //             this.curr++;
        //         }, 200)


        //     })
        // },
        // playPrev() {
        //     if (this.curr > 1) {
        //         this.curr -= 2;

        //         this.mp4play()
        //     } else {

        //         if (this.eventId) {
        //             this.curr = this.EventRealList[this.ecurr].videoUrl.length - 1;
        //             return
        //         }
        //         if (this.ecurr > 0) {
        //             this.ecurr -= 1;
        //             this.curr = this.EventRealList[this.ecurr].videoUrl.length - 1;
        //             this.mp4play()
        //         } else {
        //             this.curr = 0;
        //             this.$message({
        //                 message: '已经是第一条视频。',
        //                 type: 'error',
        //                 offset: this.width <= 3800 ? 80 : 160
        //             });

        //         }
        //     }
        // },
        // playNext() {
        //     this.mp4play()
        // },
        currentChange(val) {
            this.page = val;
            this.getEventList()
        },
        getEventStateCount() {
            var _this = this;
            var param = {}
            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getEventStateCount?', { params: param }).then((data) => {
                this.EventStateCountList = data.data.data.reverse();
            })

        },
        // 实时报警监测
        getRealAlarmCount() {
            var _this = this;

            var param = {
                crossId: ''
            }

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getRealAlarmCount?', { params: param }).then((data) => {
                this.realAlarmCount = data.data.data;

            })

        },
        getRealHtoMap() {
            var _this = this;

            var param = {
                crossId: ''
            }

            http.get(window.APP_CONFIG.SERVICE_URL_v2 + '/getRealHtoMap?', { params: param }).then((data) => {
                var item = data.data.data;
                var dom = 'alarmEct';
                var hours = item.value.hours;
                var days = item.value.days;
                var data = item.value.data;
                data = data.map(function(item) {
                    return [item[1], item[0], item[2] || '-'];
                });
                var option = {
                    title: item.name,
                    dom: dom,
                    days: days,
                    hours: hours,
                    data: data,
                    gridTop: 30,
                    gridRight: 0,
                    titleFontSize: 12,
                    gridHight: '40%',
                    visualMapMin: item.value.visualMap.min,
                    visualMapMax: item.value.visualMap.max
                    // seriesLabel:false

                }
                this.EchartsLarge.heatmapChart(option)

            })
        },



    }

    }
})())
</script>
<style lang="scss">
@media screen and (max-width:3800px) {

    $index: 1;

    .screen-box {
        width: 100%;
        height: 100%;

    }

    .screen-header {
        width: 100%;
        height: 77px;
        background: url(../assets/image/screen/1920/head.png);
        background-size: 100% 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;

        .screen-header-title {
            width: 500px;
            /*height: 58px;*/
            font-size: 29px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 77px;
            margin: 0 auto;
            text-align: center;
        }

        .date-time-box {
            display: flex;
            position: absolute;
            top: 0;
            left: 25px;

            z-index: 99;


            li {
                line-height: 55px;
                margin-right: 15px;
                font-size: 18px;
                font-family: Helvetica;
                font-weight: 400;
                color: #FFFFFF;
            }


            .week {

                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
            }
        }

        .user-box {
            left: auto;
            right: 15px;

            b {
                display: inline-block;
                font-size: 12px;
                line-height: 55px;
            }
        }
    }



    .screen-content {
        width: 100%;
        position: absolute;
        top: 53px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
    }

    .menu-box {
        position: absolute;
        left: 0;
        right: 0;
        top: 40px;
        height: 38px;
        z-index: 1000;

        .center {
            // width: 500px;
            // height: 38px;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;

        }
    }

    .screen-left-box {
        width: 360px;
        padding: 25px;
        padding-right: 48px;
        // background-image: linear-gradient(to right, #0b2b5d, rgba(13, 49, 104, 1), #0b2b5d);
        background: url(../assets/image/screen/1920/left.png);
        z-index: 99;

        .road-network-mon {
            height: 65%;
            display: flex;
            flex-direction: column;

        }


    }



    .screen-center-box {
        flex: 1;
        height: 100%;
        position: relative;

        .search-box {
            position: absolute;
            right: 10px;
            width: 192px;
            z-index: 199;
            top: 43px;
            border: 1px solid #2E94E1;
            border-radius: 3px;

            .cross-name {
                margin-bottom: 0;
                width: 100%;
            }

            .el-input__inner {
                font-size: 12px;
                height: 31px;
                background: rgba(26, 39, 95, 0.45);
                border: none;
            }

            .el-input__icon {
                // line-height: 38px;
                // color: #5498E4;
            }
        }

        .position {
            right: 10px;
        }

        .v-map-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -31px;
            right: 0;
            z-index: 50;
        }

        .t-map-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -31px;
            right: 0;
        }
    }

    .screen-right-box {
        background: url(../assets/image/screen/1920/right1.png) no-repeat;
        background-size: 100% 100%;
        padding: 25px 15px;
        width: 373px;
        z-index: 99;
        display: flex;
        flex-direction: column;

        .screen-video-box {
            width: 100%;
            // height: 452px;
            display: flex;
            flex-direction: column;

            .el-checkbox {

                color: #fff;
                margin-bottom: 10px;
                text-align: right;
            }

            .el-checkbox__label {
                font-size: 12px;
            }


            .evt-video-box {
                // height: 204px;

                // margin-bottom: 20px;
                position: relative;

                .el-form-item__content {
                    background: #16386a;
                    text-align: right;

                    button {
                        display: none;
                    }
                }

                video {
                    // min-height: 204px;
                }

                label {
                    display: block;
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, .6);
                    top: 90px;
                    line-height: 15px;
                    text-align: center;
                    left: 10px;

                    cursor: pointer;
                    z-index: 99;

                    i {
                        color: #fff;
                        font-weight: 800;
                    }
                }

                video {
                    width: 100%;
                    // height: 147px;
                    background: #000;
                }

                img {
                    width: 100%;
                    height: 147px;
                }

                .video-bar {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    background: #000;

                    b {
                        display: inline-block;
                        width: 100px;
                        background: #1A4F8F;
                        text-align: center;

                        font-size: 18px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        opacity: 0.85;
                    }

                    span {
                        font-size: 12px;
                        font-family: Helvetica;
                        font-weight: 400;
                        color: #fff;
                    }
                }
            }

        }

        .event-mon-box {
            width: 100%;
            flex: 1.4;
            display: flex;
            flex-direction: column;
        }


        .evnet-list-box {
            width: 100%;

            .list-order-box {
                overflow: hidden;
                padding-left: 10px;

                li {
                    float: left;
                    line-height: 28px;

                    span {

                        font-size: 12px;
                        font-family: PingFang SC;
                        font-weight: 400;
                    }
                }

            }

            .video-btn-box {
                float: right;
                width: 268px;
                margin: 15px 0;
                margin-top: 0;
                height: 20px;

                li {
                    font-size: 12px;
                    line-height: 20px;
                }
            }

            .waring-class-box {
                display: flex;
                justify-content: space-between;
                float: right;
                text-align: center;
                margin: 20px 0;

                li {
                    margin-left: 15px;
                    overflow: hidden;
                }

                span {
                    float: right;
                    font-size: 28px;
                    font-family: DIN;
                    font-weight: bold;
                    margin-left: 5px;
                    line-height: 26px;
                }
            }

        }

        .screen-event-list {
            flex: 1;
            position: relative;

            ul {
                padding-left: 10px;
                // height: 20px;
                display: flex;

                font-size: 12px;
                font-family: PingFang SC;
                color: #FFFFFF;
            }

            .list-th {
                background: #14365F;
                height: 18px;

                li {
                    font-size: 12px;
                    // transform: scale(0.8);
                    font-family: PingFang SC;
                    font-weight: 600;
                    line-height: 18px;
                    flex: 1;
                }

            }

            .list-tr-box {
                position: absolute;
                top: 20px;
                bottom: 0;
                width: 100%;
                // height: 100px;
                // background: red;

                ul {
                    margin-bottom: 10px;
                    cursor: pointer;
                    font-weight: 400;

                    li {
                        flex: 1;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 12px;
                        // transform: scale(0.8);
                        font-family: PingFang SC;
                        font-weight: 400;
                        line-height: 18px;
                    }
                }

                ul:nth-of-type(odd) {
                    // background: #2B3559;
                }
            }
        }

        .waring-mon-box {
            flex: 1;
        }

    }

    .screen-chart-box {
        // height: 1023px;
        // display: flex;
        // flex-flow: wrap;
        // justify-content: space-between;
        flex: 1;
        padding-top: 5px;

        .screen-chart {

            // width: 837px;
            height: 50%;
            display: flex;
            flex-direction: column;

            .date-btn-box {
                position: absolute;
                top: 0;
                right: 5px;
                display: flex;
                z-index: 888;

                .network-onfo {
                    cursor: pointer;
                    line-height: 16px;
                }

                li {
                    width: 38px;
                    height: 17px;
                    background: url(../assets/image/screen/1920/left-btn.png);
                    cursor: pointer;

                    text-align: center;

                    span {
                        display: block;
                        font-size: 10px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        // transform: scale(0.84);
                    }
                }

                .active {
                    background: url(../assets/image/screen/1920/left-btn-a.png);
                }
            }

            .border {
                width: 100%;
                height: 1px;
                background: url(../assets/image/screen/left/border-1920.png) 100% 100%;
                margin: 3px 0 7px 0;
            }

            .nav-box {

                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                // padding: 0 10px;

                li {
                    cursor: pointer;

                    overflow: hidden;

                    i {
                        float: left;
                        width: 33px;
                        height: 33px;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    p {
                        float: left;
                        margin-left: 7px;
                    }

                    span {
                        display: block;
                        font-size: 12px;
                        // transform: scale(0.9);
                        font-family: PingFang SC;
                        font-weight: 600;
                        color: #FFFFFF;
                        opacity: 0.8;
                        // text-shadow: 0px 1px 7px #103D71;
                    }

                    b {

                        font-size: 22px;
                        font-family: DIN Condensed;
                        font-weight: bold;
                        color: #FFFFFF;
                        display: inline-block;
                    }

                    em {
                        font-size: 12px;
                        opacity: 0.8;
                        font-weight: bold;
                        color: #fff;
                    }
                }

                .active {

                    span,
                    b,
                    em {
                        color: #22F4F1;
                    }
                }
            }

            .ect-title {
                overflow: hidden;


                i {
                    // float: left;
                    // width: 3px;
                    // height: 12px;
                    // background: #9BEDFF;
                    // // box-shadow: 3px 1px 3px 0px rgba(0 0 0 / 24%);
                    // margin-top: 6px;
                }

                span {
                    float: left;
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                }
            }

            .cargoRatio-list {
                width: 205px;
                height: 100%;
                margin-right: 76px;
                display: flex;
                flex-direction: column;

                ul {
                    flex: 1;
                }

                li {
                    overflow: hidden;
                }

                i {
                    float: left;
                    width: 66px;
                    height: 69px;
                }

                p {
                    float: left;
                    margin-left: 7px;
                }

                span {
                    display: block;
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #FFFFFF;
                    line-height: 26px;
                    text-shadow: 0px 1px 7px #103D71;
                }



                em {

                    font-size: 22px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #0B96F7;
                    display: block;
                    margin-top: 10px;
                }

                b {

                    font-size: 62px;
                    font-family: DIN;
                    font-weight: bold;
                    color: #C9F88A;
                }
            }
        }
    }



    .road-network-info-box {
        position: absolute;
        top: 60px;
        left: -20px;
        z-index: 99;
        // height: 100%;
        padding: 0 10px;
        background: url(../assets/image/screen/1920/road-net-box.png);
        background-size: 100% 632px;
        background-repeat: no-repeat;

        .title {
            // width: 106px;
            // height: 29px;
            // margin-top: 59px;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            opacity: 0.95;
            // background: url(../assets/image/screen/1920/road-net-title.png);
            text-align: center;
            line-height: 35px;
            border-bottom: 1px solid #2e7ac5;
        }

        .road-network-info {
            padding: 0 12px;
            // width: 132px;
            height: 597px;

            display: flex;
            flex-direction: column;
            // margin-top: 15px;
            // padding: 15px 0 20px 0;

            div {
                flex: 1;
                display: flex;
                align-items: center;

                li {

                    i {
                        float: left;
                        width: 30px;
                        height: 30px;
                        position: relative;

                        img {
                            width: 100%;
                            height: 100%;
                        }

                        span {
                            display: block;
                            width: 7px;
                            height: 7px;
                            border-radius: 50%;
                            background: red;
                            position: absolute;
                            top: -2px;
                            right: -3px;
                        }
                    }



                    p {
                        float: left;
                        margin-left: 13px;

                        span {
                            display: block;
                            font-size: 12px;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #FFFFFF;
                            line-height: 12px;
                            opacity: 0.8;
                        }

                        b {
                            font-size: 22px;
                            font-family: DIN Condensed;
                            font-weight: bold;
                            color: #22F4F1;


                        }

                        em {
                            font-size: 12px;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #22F4F1;
                        }
                    }

                }

            }

        }
    }

    .position-left {
        left: 10px;
    }


    .screen-tool-box {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 99;
        background-image: linear-gradient(to left, #1d3c77, rgba(44, 73, 155, 0));
        padding: 27px 19px 0 0;
        width: 300px;


        .title {
            margin-top: 20px;

            span {

                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                font-style: italic;
                color: #FFFFFF;
                margin-right: 10px;
            }

            b {
                font-size: 20px;
                color: #2BF2FC;
            }
        }

        .border {
            width: 100%;
            height: 2px;
            background: url(../assets/image/screen/left/border-1920.png);
            margin: 8px 0;
        }

        .roster {
            li {
                padding: 0 13px;
                border-left: 3px solid #FFFFFF;
                margin-bottom: 29px;
            }

            span {
                margin-bottom: 3px;
                font-size: 18px;
                font-family: Adobe Heiti Std;
                font-weight: bold;
                color: #FFFFFF;
                display: block;
            }

            b {

                font-size: 20px;
                font-family: Adobe Heiti Std;
                font-weight: bold;
                color: #49E6F7;
            }
        }


    }



    .rank-list {
        position: absolute;
        top: 30px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;

        .rank-list-th {


            background: #14365F;
            margin-bottom: 15px;
            height: 18px;


            li {
                font-size: 12px;
                // transform: scale(0.8);
                font-family: PingFang SC;
                font-weight: 600;
                line-height: 18px;
            }
        }

        .rank-list-tbody {
            flex: 1;
            position: relative;

            li {
                // line-height: 33px;
            }

            ul:nth-of-type(odd) {
                // background: #2B3559;
            }
        }

        ul {
            width: 100%;
            display: flex;
            cursor: pointer;
            margin-bottom: 10px;
        }

        .active {
            li {
                color: #1378E0;
            }

        }

        li {
            flex: 1;
            font-size: 12px;
            // transform: scale(0.8);
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            // line-height: 32px;


            span {
                display: inline-block;
                min-width: 30px;
            }
        }
    }

    .page-box {
        position: absolute;
        height: 30px;
        bottom: 0;
        left: 0;
        right: 0;

        .btn-prev,
        .btn-next {
            background: #14365F !important;
            border: 1px solid #3E495F !important;
            border-radius: 2px !important;
            color: #3E495F !important;

            span {
                min-width: 45px;
                font-size: 12px;
            }
        }

        .el-pagination.is-background .btn-next,
        .el-pagination.is-background .btn-prev,
        .el-pagination.is-background .el-pager li {
            background: #14365F;
            border: 1px solid #B5B5B5;
            border-radius: 2px;
        }

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            background: #14365F;
            border: 1px solid #fff;
            border-radius: 2px;
            color: #fff !important;
        }
    }

    .consult-list {
        width: 70%;
        float: right;
        height: 100%;
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        align-items: center;

        .legend {
            width: 100%;

            li {
                overflow: hidden;

                i {
                    float: left;
                    width: 7px;
                    height: 7px;

                    margin-top: 5px;
                    border-radius: 50%;
                }

                span {
                    float: left;
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #FFFFFF;
                    overflow: hidden;
                    height: 20px;
                    text-overflow: ellipsis;

                    white-space: nowrap;
                    transform: scale(0.8);
                }

                b {
                    float: right;
                    font-size: 14px;
                    font-family: DIN;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-right: 8px;
                }

                em {
                    float: right;
                    font-size: 12px;
                    // transform: scale(0.8);
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #ffffff;
                    opacity: 0.8;
                }

            }

            p {
                width: 100%;
                height: 5px;
                background-color: #424971;

                span {
                    display: block;
                    height: 5px;
                    background-color: #22F4F1;
                }
            }
        }

    }

    .track-tool-bar {
        position: absolute;
        bottom: 226px;
        right: 10px;
        z-index: 199;
        width: 60px;
        // height: 523px;
        background: url(../assets/image/screen/1920/tool-box.png);
        background-size: 100% 100%;

        .tool-bar-date {
            position: absolute;
            background: url(../assets/image/screen/1920/date.png);
            background-size: 100% 100%;
            height: 63px;
            width: 249px;
            padding: 15px;
            position: absolute;
            left: -290px;
            top: 52px;

            .end-time {
                line-height: 30px;
                color: #fff;
                width: 55px;
                white-space: nowrap;
            }

            .time-gry-box {

                margin-top: 10px;
            }
        }

        .tool-bar-person {
            position: absolute;
            background: url(../assets/image/screen/1920/date.png);
            background-size: 100% 100%;
            // height: 33px;
            width: 66px;
            padding: 15px;
            position: absolute;
            left: -109px;
            top: 185px;

            .el-radio {
                padding-right: 0;
                margin-right: 0;
            }
        }

        p {
            position: absolute;
            top: -25px;
            right: 0;
            white-space: nowrap;
            font-size: 14px;
        }

        li {
            margin-bottom: 5px;
            cursor: pointer;
            text-align: center;
            // width: 45px;
            // height: 53px;
            // background: #062F71;
            // border: 2px solid #039ADE;
        }

        .active {
            // background: #166DC7;
            // border: 2px solid #166DC7;

            span {
                color: #22F4F1;
            }
        }

        img {
            display: block;
            width: 19px;
            height: 19px;
            margin: 6px auto;
        }

        span {
            display: inline-block;
            font-size: 12px;
            // transform: scale(0.85);
            font-family: PingFang SC;
            font-weight: 500;
            color: #3EA4F9;
        }

    }

    .position {
        right: 10px;
    }

    .index-echart-box {
        font-size: 14px;
        position: absolute;
        transition: all 0.5s;
        left: -20px;
        right: 10px;
        height: 190px;
        padding-bottom: 10px;
        bottom: 0;

        background-image: linear-gradient(to top, #0b2b5d 30%, rgba(13, 49, 104, 0.1));
        z-index: 88;

        .index-echart-type {
            display: flex;
            margin-bottom: 29px;

            .title-2 {
                line-height: 32px;
                margin: 0;
                margin-right: 24px;

            }



            img {
                width: 100%;
                flex: 1;
                height: 7px;
            }
        }



        .index-ect {
            height: 140px;
            overflow: hidden;
            display: flex;
            padding-bottom: 5px;

            .ect {
                flex: 1;
            }

            .dir-type-box {
                width: 50px;
                // height: 100%;
                display: flex;
                flex-wrap: wrap;
                margin: 20px 0;

                li {
                    max-height: 22px;
                    flex: 1;
                    font-size: 13px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                    opacity: 0.5;
                    cursor: pointer;
                }
            }

            .date-type-select {
                position: absolute;
                font-size: 12px;
                top: 30px;
                right: 15px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #C1C1C1;

            }

            .select-group {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 8px;
            }

            .select-item {
                display: flex;
                align-items: center;
                margin-left: 10px;
            }

            .select-title {
                float: left;
                margin-right: 10px;
            }

            .el-input,
            .el-select {
                width: 80px;
            }

            .el-input__inner {
                height: 20px;
                font-size: 12px;
                color: #5498E4;
                width: 80px;
                border-color: #5498E4;
            }

            .el-select .el-input .el-select__caret {
                color: #5498E4;
                font-size: 12px;
                line-height: 20px;
            }

            .unit {
                float: right;
                margin-left: 30px;
            }
        }
    }

    .weather-box {
        font-size: 12px;
        position: absolute;
        transition: all 0.5s;
        left: 152px;
        right: 10px;

        bottom: 10px;
        z-index: 99;
        display: flex;

        // padding:0 10px;
        .weather-list {
            padding: 0 10px;
            background-image: linear-gradient(to top, #1d3c77, rgba(44, 73, 155, 0));
            flex: 1;
            position: relative;
            height: 230px;

            .el-radio {
                color: #fff;
            }

        }
    }

    .type-box {
        padding: 1px;
        display: flex;
        width: 360px;
        height: 29px;
        background: rgba(26, 39, 95, 0.45);
        border: 1px solid #2E94E1;
        border-radius: 3px;
        margin-right: 24px;

        li {
            cursor: pointer;
            flex: 1;
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 29px;
            text-align: center;
        }

        .active {
            background: #166DC7;
            // border: 1px solid #00B4FF;
            // border-radius: 2px;
        }
    }


    .title-1 {

        background-image: url(../assets/image/screen/1920/title-1.png);
        width: 122px;
        height: 32px;
        line-height: 35px;
        text-align: center;

        span {
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            opacity: 0.95;

        }
    }

    .title-2 {

        display: flex;
        min-height: 24px;
        margin: 20px 0px 10px 0px;

        .p1 {
            min-width: 150px;
        }

        .p2 {
            min-width: 75px;
        }

        span {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            white-space: nowrap;
        }

        img {
            // width: 328px;
            height: 7px;
            margin-top: 7px;
            margin-left: 14px;
        }

        .icon {
            display: inline-block;
            margin: -3px 5px;
            font-size: 32px;
        }

        .btn {
            cursor: pointer;
            flex: 1;
        }

        .btnActive {
            color: #1378E0;
        }


    }

    .event-video-box {
        position: fixed;
        top: 35px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding-top: 45px;
        background: rgba(0, 0, 0, .5);
        z-index: 3999;
        justify-content: center;
        align-items: center;


        .event-video-box-close {
            font-size: 20px;
            font-weight: 600;
            position: absolute;
            top: 50px;
            right: 20px;
            cursor: pointer;
            color: #11BFFF;
            z-index: 999;
        }


    }

    .video-bg {
        background: url(../assets/image/screen/12k/video-bg.png) no-repeat;
        width: 400px;
        // height: 316px;
        padding: 22px;
        background-size: 100% 100%;

        p {
            // width: 480px;
            font-size: 18px;
            padding: 10px 0;
            overflow: hidden;

            span {
                float: left;
                color: #fff;
            }

            b {
                float: right;
                font-size: 26px;
                color: #41fdfc;
                cursor: pointer;
                font-weight: normal;

            }
        }

        video {
            width: 400px;

        }
    }

    .alarm-info-box {
        background-image: linear-gradient(to bottom, #cb3e46, #ca2b32);


        padding: 10px;



        p {
            overflow: hidden;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #000;

            span {
                display: inline-block;
                width: 95%;
                text-align: center;
                font-size: 15px;

            }

            b {
                float: right;
                font-weight: 800;
                font-size: 14px;
                cursor: pointer;
            }
        }

        li {
            overflow: hidden;
            line-height: 30px;
        }

        .button-box {
            display: flex;
            justify-content: center;
            margin: 10px 0 20px 0;

            li {
                width: 75px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                border-radius: 3px;
                border: 1px solid #000;
                background: #fff;
                margin-right: 30px;
                cursor: pointer;
                color: #000;
            }
        }

        video {
            width: 400px;
        }
    }

    .el-notification.right {
        right: 412px;
    }

    .el-notification.right1 {
        right: 10px;
    }

    .mapabcgl-ctrl-top-right {
        top: 80px;
        z-index: 200;
    }

}

@media screen and (min-width: 3800px) {

    .mapabcgl-ctrl-top-right {
        top: 160px;
        z-index: 200;
    }

    .screen-box {
        width: 100%;
        height: 100%;

    }

    .screen-header {
        width: 100%;
        height: 152px;
        background: url(../assets/image/screen/4k/head.png);
        background-size: 100% 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;

        .screen-header-title {
            // width: 1000px;
            font-size: 58px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 152px;
            margin: 0 auto;
            text-align: center;
        }

        .date-time-box {
            display: flex;
            position: absolute;
            top: 0;
            left: 48px;

            z-index: 99;


            li {
                line-height: 100px;
                margin-right: 30px;
                font-size: 36px;
                font-family: Helvetica;
                font-weight: 400;
                color: #FFFFFF;
            }


            .week {

                font-size: 28px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
            }
        }

        .user-box {
            right: 30px;
            left: auto;

            b {
                font-size: 24px;
                line-height: 100px;
                display: inline-block;
            }
        }
    }



    .screen-content {
        width: 100%;
        position: absolute;
        top: 94px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;


    }

    .screen-left-box {
        width: 740px;
        padding: 48px;
        padding-right: 116px;
        background: url(../assets/image/screen/4k/left.png);
        z-index: 99;

        .road-network-mon {
            height: 65%;
            display: flex;
            flex-direction: column;
        }

    }

    .screen-chart-box {
        // height: 1023px;
        // display: flex;
        // flex-flow: wrap;
        // justify-content: space-between;
        flex: 1;
        margin-top: 66px;

        .screen-chart {

            // width: 837px;
            height: 37%;
            display: flex;
            flex-direction: column;

            .date-btn-box {
                position: absolute;
                top: 0;
                right: 5px;
                display: flex;
                z-index: 888;

                li {
                    width: 76px;
                    height: 34px;
                    background: url(../assets/image/screen/1920/left-btn.png);
                    background-size: 100% 100%;
                    cursor: pointer;
                    text-align: center;

                    span {
                        display: block;
                        font-size: 20px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;

                    }
                }

                .active {
                    background: url(../assets/image/screen/1920/left-btn-a.png);
                    background-size: 100% 100%;
                }
            }

            .border {
                width: 100%;
                height: 2px;
                background: url(../assets/image/screen/left/border.png) 100% 100%;
                margin: 3px 0 38px 0;
            }

            .nav-box {

                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
                // padding: 0 10px;

                li {
                    cursor: pointer;

                    overflow: hidden;

                    i {
                        float: left;
                        width: 59px;
                        height: 59px;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    p {
                        float: left;
                        margin-left: 7px;
                    }

                    span {
                        display: block;
                        font-size: 20px;
                        font-family: PingFang SC;
                        font-weight: 600;
                        color: #FFFFFF;
                        opacity: 0.8;
                        // text-shadow: 0px 1px 7px #103D71;
                    }

                    b {

                        font-size: 44px;
                        font-family: DIN Condensed;
                        font-weight: bold;
                        color: #fff;
                        display: inline-block;
                    }

                    em {
                        font-size: 20px;

                        font-weight: bold;
                        color: #fff;
                    }
                }

                .active {

                    span,
                    b,
                    em {
                        color: #22F4F1;
                    }
                }
            }


            .ect-title {
                overflow: hidden;


                i {
                    // float: left;
                    // width: 3px;
                    // height: 12px;
                    // background: #9BEDFF;
                    // // box-shadow: 3px 1px 3px 0px rgba(0 0 0 / 24%);
                    // margin-top: 6px;
                }

                span {
                    float: left;
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                }
            }


            .cargoRatio-list {
                width: 205px;
                height: 100%;
                margin-right: 76px;
                display: flex;
                flex-direction: column;

                ul {
                    flex: 1;
                }

                li {
                    overflow: hidden;
                }

                i {
                    float: left;
                    width: 66px;
                    height: 69px;
                }

                p {
                    float: left;
                    margin-left: 7px;
                }

                span {
                    display: block;
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #FFFFFF;
                    line-height: 26px;
                    text-shadow: 0px 1px 7px #103D71;
                }



                em {

                    font-size: 22px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #0B96F7;
                    display: block;
                    margin-top: 10px;
                }

                b {

                    font-size: 62px;
                    font-family: DIN;
                    font-weight: bold;
                    color: #C9F88A;
                }
            }
        }
    }

    .screen-center-box {
        flex: 1;
        height: 100%;
        position: relative;

        .search-box {
            position: absolute;
            right: 20px;
            width: 384px;
            z-index: 100;
            top: 92px;
            border: 2px solid #2E94E1;
            border-radius: 6px;

            .cross-name {
                margin-bottom: 0;
                width: 100%;
            }

            .el-input__inner {
                font-size: 24px;
                height: 60px;
                background: rgba(26, 39, 95, 0.45);

                border: none;
            }

            .el-input__icon {
                font-size: 24px;
                line-height: 68px;
                // color: #5498E4;
                margin-right: 20px;
            }

            .el-select .el-input.is-focus .el-input__inner {
                border: none;
            }

            .el-select .el-input__inner:focus {
                border: none;
            }
        }

        .v-map-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -70px;
            right: 0;
            z-index: 50;
        }

        .t-map-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -70px;
            right: 0;
        }

        .road-network-info-box {
            position: absolute;
            top: 120px;
            left: -40px;
            z-index: 99;

            padding: 0 20px;
            background: url(../assets/image/screen/4k/road-net-box.png) no-repeat;
            background-size: 100% 1264px;
            background-repeat: no-repeat;
            // background-image: linear-gradient(90deg, #0b2b5d 50%, rgba(13, 49, 104, 0.2));
            // display: flex;
            // flex-direction: column;

            .title {
                // width: 212px;
                // height: 29px;
                // margin-top: 59px;
                font-size: 32px;
                font-family: PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                opacity: 0.95;
                // background: url(../assets/image/screen/1920/road-net-title.png);
                text-align: center;
                line-height: 70px;
                border-bottom: 1px solid #2e7ac5;
            }

            .road-network-info {
                padding: 0 12px;
                // width: 212px;
                height: 1194px;

                display: flex;
                flex-direction: column;
                // margin-top: 15px;
                // padding: 15px 0 20px 0;

                div {
                    flex: 1;
                    display: flex;
                    align-items: center;

                    li {

                        i {
                            position: relative;
                            float: left;
                            width: 60px;
                            height: 60px;

                            img {
                                width: 100%;
                                height: 100%;
                            }

                            span {
                                display: block;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background: red;
                                position: absolute;
                                top: -5px;
                                right: -5px;
                            }
                        }



                        p {
                            float: left;
                            margin-left: 13px;

                            span {
                                display: block;
                                font-size: 24px;
                                font-family: PingFang SC;
                                font-weight: bold;
                                color: #FFFFFF;
                                line-height: 24px;
                                opacity: 0.8;
                            }

                            b {
                                font-size: 44px;
                                font-family: DIN Condensed;
                                font-weight: bold;
                                color: #22F4F1;


                            }

                            em {
                                font-size: 24px;
                                font-family: PingFang SC;
                                font-weight: bold;
                                color: #22F4F1;
                            }
                        }

                    }

                }

            }
        }
    }

    .screen-right-box {
        background: url(../assets/image/screen/4k/right.png) no-repeat;
        background-size: 100% 100%;
        padding: 50px 30px;
        width: 740px;
        z-index: 99;
        display: flex;
        flex-direction: column;

        .screen-video-box {
            width: 100%;
            // height: 452px;
            display: flex;
            flex-direction: column;

            .el-checkbox {
                color: #fff;
                margin-bottom: 20px;
                text-align: right;

            }

            .el-checkbox__label {
                font-size: 24px;
            }


            .evt-video-box {
                flex: 1;
                // margin-bottom: 40px;
                position: relative;

                video {
                    min-height: 408px;
                }

                label {
                    display: block;
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, .6);
                    top: 180px;

                    text-align: center;
                    left: 20px;
                    cursor: pointer;
                    z-index: 99;

                    i {
                        font-size: 18px;
                        color: #fff;
                        font-weight: 800;
                        line-height: 30px;
                    }
                }

                video {
                    width: 100%;
                    // height: 147px;
                    background: #000;
                }

                img {
                    width: 100%;
                    height: 294px;
                }

                .video-bar {
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                    background: #000;

                    b {
                        display: inline-block;
                        width: 100px;
                        background: #1A4F8F;
                        text-align: center;
                        font-family: Adobe Heiti Std;
                        font-weight: normal;
                        font-size: 36px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        opacity: 0.85;
                    }

                    span {
                        font-size: 24px;
                        font-family: Helvetica;
                        font-weight: 400;
                        color: #fff;
                    }
                }
            }

        }

        .el-checkbox__inner {
            width: 20px;
            height: 20px;
            margin-top: -5px;
        }

        .el-checkbox__inner::after {
            left: 7px;
            top: 3px;
        }

        .event-mon-box {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
        }



        .evnet-list-box {
            width: 100%;


            .list-order-box {
                overflow: hidden;
                padding-left: 20px;

                li {
                    float: left;
                    line-height: 40px;

                    i {
                        font-size: 24px;
                    }

                    span {

                        font-size: 24px;
                        font-family: PingFang SC;
                        font-weight: 400;
                    }
                }

            }

            .video-btn-box {
                float: right;
                margin: 30px 0;
                width: 537px;
                height: 40px;
                margin-top: 0;

                li {
                    font-size: 24px;
                    line-height: 40px;
                }
            }

            .waring-class-box {
                display: flex;
                justify-content: space-between;
                float: right;
                text-align: center;
                margin: 40px 0;

                li {
                    margin-left: 30px;
                    overflow: hidden;
                }

                span {
                    float: right;
                    font-size: 56px;
                    font-family: DIN;
                    font-weight: bold;
                    margin-left: 10px;
                    line-height: 52px;
                }

                img {
                    width: 52px;
                    height: 52px;
                }
            }


        }

        .screen-event-list {
            flex: 1;
            position: relative;

            ul {
                padding-left: 20px;
                // height: 20px;
                display: flex;

                font-size: 12px;
                font-family: PingFang SC;
                color: #FFFFFF;
            }

            .list-th {
                background: #14365F;
                height: 36px;

                li {
                    font-size: 20px;
                    line-height: 36px;
                    font-family: PingFang SC;
                    font-weight: 600;

                    flex: 1;
                }

            }

            .list-tr-box {
                position: absolute;
                top: 40px;
                bottom: 0;
                width: 100%;
                // height: 100px;
                // background: red;

                ul {
                    margin-bottom: 20px;
                    cursor: pointer;
                    font-weight: 400;

                    li {
                        flex: 1;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 20px;

                        font-family: PingFang SC;
                        font-weight: 400;
                        line-height: 36px;
                    }
                }

                ul:nth-of-type(odd) {
                    // background: #2B3559;
                }
            }


        }

        .waring-mon-box {
            flex: 1;


        }
    }




    .track-tool-bar {
        position: absolute;
        bottom: 602px;
        right: 20px;
        z-index: 199;
        width: 120px;
        // height: 523px;
        background: url(../assets/image/screen/4k/tool-box.png);
        background-size: 100% 100%;

        .tool-bar-date {
            position: absolute;
            background: url(../assets/image/screen/4k/date.png);
            background-size: 100% 100%;
            height: 86px;
            width: 398px;
            padding: 30px;
            position: absolute;
            left: -475px;
            top: 72px;

            .end-time {
                line-height: 30px;
                color: #fff;
                width: 110px;
                white-space: nowrap;
            }

            .time-gry-box {

                margin-top: 20px;
            }
        }

        .tool-bar-person {
            position: absolute;
            background: url(../assets/image/screen/4k/date.png);
            background-size: 100% 100%;
            // height: 33px;
            width: 132px;
            padding: 30px;
            position: absolute;
            left: -209px;
            top: 360px;

            .el-radio {
                padding-right: 0;
                margin-right: 0;
            }
        }

        p {
            position: absolute;
            top: -50px;
            right: 0;
            white-space: nowrap;
            font-size: 28px;
        }

        li {
            margin-bottom: 10px;
            cursor: pointer;
            text-align: center;
            // width: 45px;
            // height: 53px;
            // background: #062F71;
            // border: 2px solid #039ADE;
        }

        .active {
            // background: #166DC7;
            // border: 2px solid #166DC7;

            span {
                color: #22F4F1;
            }
        }

        img {
            display: block;
            width: 38px;
            height: 38px;
            margin: 12px auto;
        }

        span {
            display: inline-block;
            font-size: 20px;

            font-family: PingFang SC;
            font-weight: 500;
            color: #3EA4F9;
        }

    }


    .screen-tool-box {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 99;
        background-image: linear-gradient(to left, #1d3c77, rgba(44, 73, 155, 0));
        padding: 27px 19px 0 0;
        width: 300px;


        .title {
            margin-top: 20px;

            span {

                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                font-style: italic;
                color: #FFFFFF;
                margin-right: 10px;
            }

            b {
                font-size: 20px;
                color: #2BF2FC;
            }
        }

        .border {
            width: 100%;
            height: 2px;
            background: url(../assets/image/screen/right/border.png);
            margin: 8px 0;
        }

        .roster {
            li {
                padding: 0 13px;
                border-left: 3px solid #FFFFFF;
                margin-bottom: 29px;
            }

            span {
                margin-bottom: 3px;
                font-size: 18px;
                font-family: Adobe Heiti Std;
                font-weight: bold;
                color: #FFFFFF;
                display: block;
            }

            b {

                font-size: 20px;
                font-family: Adobe Heiti Std;
                font-weight: bold;
                color: #49E6F7;
            }
        }


    }

    .weather-box {
        font-size: 12px;
        position: absolute;
        transition: all 0.5s;
        left: 260px;
        right: 10px;

        bottom: 10px;
        z-index: 99;
        display: flex;

        // padding:0 10px;
        .weather-list {
            padding: 0 20px;
            background-image: linear-gradient(to top, #1d3c77, rgba(44, 73, 155, 0));
            flex: 1;
            position: relative;
            height: 460px;

            .el-radio {
                color: #fff;
                font-size: 14px;
            }

            .el-radio__label {
                font-size: 20px;
                line-height: 45px;
            }

            .el-radio__inner {
                width: 18px;
                height: 18px;
                line-height: 45px;
            }

            .el-radio__inner::after {
                width: 7px;
                height: 7px;
            }
        }
    }

    .rank-list {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;

        .rank-list-th {


            background: #14365F;
            margin-bottom: 30px;
            height: 36px;


            li {
                font-size: 20px;

                line-height: 36px;
            }
        }

        .rank-list-tbody {
            flex: 1;
            position: relative;

            li {
                // line-height: 33px;
            }

            ul:nth-of-type(odd) {
                // background: #2B3559;
            }
        }

        ul {
            width: 100%;
            display: flex;
            cursor: pointer;
            margin-bottom: 20px;
        }

        .active {
            li {
                color: #1378E0;
            }

        }

        li {
            flex: 1;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            // line-height: 32px;


            span {
                display: inline-block;
                min-width: 60px;
            }
        }
    }

    .page-box {
        position: absolute;
        height: 40px;
        bottom: 0;
        left: 0;
        right: 0;

        .btn-prev,
        .btn-next {
            background: #14365F !important;
            border: 1px solid #3E495F !important;
            border-radius: 2px !important;
            color: #3E495F !important;

            span {
                min-width: 90px;
                font-size: 24px;
            }
        }

        .el-pagination.is-background .btn-next,
        .el-pagination.is-background .btn-prev,
        .el-pagination.is-background .el-pager li {
            background: #14365F;
            border: 1px solid #B5B5B5;
            border-radius: 2px;
            font-size: 20px !important;
            width: 33px !important;
            height: 33px !important;
            line-height: 33px !important;
        }

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            background: #14365F;
            border: 1px solid #fff;
            border-radius: 2px;
            color: #fff !important;
        }

        .el-pager li {
            font-size: 20px !important;
            width: 33px !important;
            height: 33px !important;
            line-height: 33px !important;
            margin: 0 10px !important;
        }
    }

    .consult-list {
        width: 70%;
        float: right;
        height: 100%;
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        align-items: center;

        .legend {
            width: 100%;

            li {
                overflow: hidden;

                i {
                    float: left;
                    width: 14px;
                    height: 14px;

                    margin-top: 10px;
                    border-radius: 50%;
                }

                span {
                    float: left;
                    font-size: 20px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #FFFFFF;
                    overflow: hidden;
                    height: 40px;
                    text-overflow: ellipsis;
                    margin-left: 10px;
                    white-space: nowrap;
                    // transform: scale(0.8);
                }

                b {
                    float: right;
                    font-size: 28px;
                    font-family: DIN;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-right: 8px;
                }

                em {
                    float: right;
                    font-size: 16px;
                    line-height: 38px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #ffffff;
                    opacity: 0.8;
                }

            }

            p {
                width: 100%;
                height: 10px;
                background-color: #424971;

                span {
                    display: block;
                    height: 10px;
                    background-color: #22F4F1;
                }
            }
        }

    }

    .index-echart-box {
        font-size: 28px;
        position: absolute;
        transition: all 0.5s;
        left: -40px;
        right: 20px;
        height: 414px;
        padding-bottom: 20px;
        bottom: 0;

        background-image: linear-gradient(to top, #0b2b5d 30%, rgba(13, 49, 104, 0.1));
        z-index: 88;

        .index-echart-type {
            display: flex;
            margin-bottom: 58px;

            .title-2 {
                line-height: 64px;
                margin: 0;
                margin-right: 48px;

            }



            img {
                width: 100%;
                flex: 1;
                height: 7px;
            }
        }



        .index-ect {
            height: 300px;
            overflow: hidden;
            display: flex;

            .ect {
                flex: 1;
            }

            .dir-type-box {
                width: 100px;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                margin-top: 40px;

                li {
                    max-height: 44px;
                    flex: 1;
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                    opacity: 0.5;
                    cursor: pointer;
                }
            }

            .date-type-select {
                position: absolute;
                font-size: 24px;
                top: 60px;
                right: 30px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #C1C1C1;

            }

            .select-group {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 12px;
            }

            .select-item {
                display: flex;
                align-items: center;
                margin-left: 20px;
            }

            .select-title {
                float: left;
                margin-right: 20px;
            }

            .el-input,
            .el-select {
                width: 80px;
            }

            .el-input__inner {
                height: 20px;
                font-size: 12px;
                color: #5498E4;
                width: 80px;
                border-color: #5498E4;
            }

            .el-select .el-input .el-select__caret {
                color: #5498E4;
                font-size: 12px;
                line-height: 20px;
            }

            .unit {
                float: right;
                margin-left: 30px;
            }
        }
    }

    .type-box {
        padding: 2px;
        display: flex;
        width: 720px;
        height: 58px;
        background: rgba(26, 39, 95, 0.45);
        border: 2px solid #2E94E1;
        border-radius: 6px;
        margin-right: 48px;

        li {
            cursor: pointer;
            flex: 1;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 58px;
            text-align: center;
        }

        .active {
            background: #166DC7;
            // border: 1px solid #00B4FF;
            // border-radius: 2px;
        }
    }

    .title-1 {
        background-image: url(../assets/image/screen/4k/title-1.png);
        width: 244px;
        height: 64px;
        line-height: 70px;
        text-align: center;

        span {
            font-size: 36px;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            opacity: 0.95;

        }
    }

    .title-2 {
        min-height: 45px;
        display: flex;
        overflow: hidden;
        margin: 40px 0;

        .p1 {
            min-width: 300px;
        }

        .p2 {
            min-width: 150px;
        }

        span {
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            white-space: nowrap;
        }

        img {
            width: 573px;
            height: 15px;
            margin-top: 14px;
            margin-left: 28px;
        }

        .icon {
            display: inline-block;
            margin: -3px 5px;
            font-size: 32px;
        }

        .btn {
            cursor: pointer;
            flex: 1;
        }

        .btnActive {
            color: #1378E0;
        }


    }


    .event-video-box {
        position: fixed;
        top: 94px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding-top: 45px;
        background: rgba(0, 0, 0, .5);
        z-index: 3999;
        justify-content: center;
        align-items: center;


        .event-video-box-close {
            font-size: 30px;
            font-weight: 600;
            position: absolute;
            top: 50px;
            right: 20px;
            cursor: pointer;
            color: #11BFFF;
            z-index: 999;
        }
    }

    .video-bg {
        background: url(../assets/image/screen/12k/video-bg.png) no-repeat;
        width: 800px;
        background-size: 100% 100%;
        // height: 316px;
        padding: 22px;

        p {
            // width: 480px;
            font-size: 18px;
            padding: 10px 0;
            overflow: hidden;

            span {
                float: left;
                color: #fff;
            }

            b {
                float: right;
                font-size: 26px;
                color: #41fdfc;
                cursor: pointer;
                font-weight: normal;

            }
        }

        video {
            width: 800px;
        }
    }

    .alarm-info-box {
        background-image: linear-gradient(to bottom, #cb3e46, #ca2b32);
        border: 2px solid #000;
        padding: 20px;
        border-radius: 10px 0 0 0;

        p {
            overflow: hidden;
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;

            span {
                display: inline-block;
                width: 80%;
                text-align: center;
                font-size: 24px;

            }

            b {
                float: right;
                font-weight: 800;
                font-size: 24px;
                cursor: pointer;
            }
        }

        li {
            overflow: hidden;
            line-height: 40px;
        }

        .button-box {
            display: flex;
            justify-content: center;
            margin: 20px 0 30px 0;

            li {
                width: 120px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 6px;
                border: 2px solid #000;
                background: #fff;
                color: #000;
                margin-right: 50px;
                cursor: pointer;
            }
        }

        video {
            width: 800px;
        }
    }
}
</style>
