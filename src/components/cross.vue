<template>
    <!-- <div> -->
    <!-- <home-header></home-header> -->
    <!-- <div class="cross-name">
                <el-select v-model="crossId" filterable :placeholder="$t('home.pleaseChoose')" @change="crossIdChange()">
                    <el-option v-for="item in crossList" :key="item.crossId" :label="item.crossName" :value="item.crossId">
                    </el-option>
                </el-select>
            </div> -->
    <div class="nav-bar">
        <li class="nav nav-out" @click="goHome()">
            <i><img :src=" require('../assets/image/screen/1920/back.png')" alt=""></i>
            <span>返回</span>
        </li>
        <div class="nav-box">
            <li class="nav" v-for="(item,index) in crossInfoNavMenu" @click="crossInfoNavClick(item,index)" :class="crossInfoNav==index?'data-type-active':''">
                <span v-text="item.name"></span>
            </li>
        </div>
        <!-- <span class="out" @click="goHome()">x</span> -->
        <!-- </div> -->
        <!-- </div> -->
        <!--  <router-view v-if="isRouterShow" /> -->
    </div>
</template>
<script>
// import HomeHeader from './header';
export default {

    components: {
        // HomeHeader
    },

    data() {
        return {
            isRouterShow: true,
            crossInfoNavMenu: [],
            crossInfoNav: null,
            crossData: '',
            crossName: '',
            crossList: [],
            crossListObj: {},
            crossId: '',
            homeCrossingRemoved: false,

        }
    },
    watch: {
        // crossId(value){

        // }
    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'));
        this.crossId = this.crossData.crossId;

    },
    mounted() {

        this.getmodule()
        this.getCrossTopByType()
    },
    destroyed() {

    },
    methods: {
        goHome() {
            var name = this.$router.currentRoute.name;
            if (name == 'home') {
                console.log("return home")
                this.$parent.crossData = null;
                this.$parent.eventId = null;
                this.$parent.trackPlay = true;
                this.$parent.openInterval()
                this.$parent.getRoadNetworkOverview()
                this.$parent.getCongestionAnalysis()
                this.$parent.getDelayAnalysis()
                this.$parent.getTrackAnalysis()
                this.$parent.getStatsList()
                this.$parent.clearcrossId()
                this.$parent.openIntervalAll()
                this.$parent.getCrossTop10()
                this.$parent.setMapZoom()
            } else {
                console.log("return from modal")
                this.$router.push({ path: '/home' });
                this.crossInfoNav = null;

                this.$parent.trackPlay = true;
                this.$parent.autoPolling = true;

                if (this.homeCrossingRemoved && !!this.$parent.$refs.playBack) {
                    var map = this.$parent.$refs.playBack.homeMap;
                    map.addLayer(this.$parent.$refs.playBack.createCustomLayer('crossing'));
                    console.log("add layer crossing")
                }
            }

        },
        reload() {

            this.isRouterShow = false
            this.$nextTick(() => (this.isRouterShow = true))

        },

        crossInfoNavClick(item, index) {
            this.$parent.trackPlay = false;
            this.$parent.autoPolling = false;
            this.crossInfoNav = index;

            this.$parent.clearInterval();
            this.$parent.clearIntervalAll();
            var path = '/' + item.component;
            this.$parent.crossStatusList = [];
            this.$router.push(path);

            if (!!this.$parent.$refs.playBack) {
                var homeMap = this.$parent.$refs.playBack.homeMap
                if (homeMap && typeof homeMap.getLayer === 'function' && homeMap.getLayer('crossing')) {
                    homeMap.removeLayer('crossing')
                }
                if (this.$parent.$refs.playBack.crossing && typeof this.$parent.$refs.playBack.crossing.clear === 'function') {
                    this.$parent.$refs.playBack.crossing.clear()
                }
                this.homeCrossingRemoved = true
                console.log("layer crossing removed")
            }
        },
        closecrossInfo() {

            this.$router.push('/home')


        },
        getmodule() {

            var _this = this;
            var param = {

            };

            this.axios.get(LOGO_SERVICE + 'mapabc-admin-system/api/v1/menus/build/module?moduleName=' + moduleName, { params: param }).then((data) => {
                var res = data.data[0].children;
                if (this.crossData.type) {
                    res = res.filter(item => item.params == this.crossData.type)
                }


                var re = /.*[\u4e00-\u9fa5]+.*$/;
                var language = navigator.language; //获取浏览器语言
                var lang = language.indexOf('zh') > -1 ? 'zh' : 'en';
                if (lang == 'zh') {
                    this.crossInfoNavMenu = res.filter(item => re.test(item.name));
                } else {
                    this.crossInfoNavMenu = res.filter(item => !re.test(item.name));
                }

                 nextRoute = ['home','homeScreen']

                this.crossInfoNavMenu.forEach(item => {
                    var param = item.params ? item.params : ''
                    nextRoute.push(item.component)
                })

            })
        },
        getCrossTopByType() {


            var param = {
                currentPage: 1,
                pageSize: 100,
                search: this.crossName,
                type: ''
            };

            this.axios.get(SERVICE_URL + 'cityV2/getCrossTopByType?', { params: param }).then((data) => {


                this.crossList = data.data.data.resultList;
                this.crossList.forEach(item => {

                    this.crossListObj[item.crossId] = item;

                })


            })
        },

    }

};
</script>
<style lang="scss">
@media screen and (max-width:3800px) {

    .nav-bar {
        .nav-box {
            position: fixed;
            top: 96px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            margin: 0 auto;
            height: 29px;
            background: rgba(26, 39, 95, 0.45);
            border: 1px solid #2E94E1;
            border-radius: 3px;
            z-index: 9999;
            padding: 1px;


            .data-type-active {
                background: #166DC7;
            }
        }

        .nav {
            cursor: pointer;
            width: 110px;
            text-align: center;

            span {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 29px;
                opacity: 0.8;
            }
        }

        .nav-out {
            position: fixed;
            left: 605px;
            top: 96px;
            width: 94px;
            z-index: 9999;
            margin-right: 0;
            background: rgba(26, 39, 95, 0.45);
            border: 1px solid #2E94E1;
            border-radius: 3px;
        }
    }




}

@media screen and (min-width:3800px) {

    .nav-bar {

        .nav-box {
            padding: 2px;
            position: fixed;
            top: 192px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            margin: 0 auto;
            height: 56px;
            background: rgba(26, 39, 95, 0.45);
            border: 2px solid #2E94E1;
            border-radius: 6px;
            z-index: 9999;


        }

        .nav {
            cursor: pointer;
            width: 220px;
            text-align: center;

            span {
                font-size: 32px;
                font-family: PingFang SC;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 56px;
                opacity: 0.8;
            }
        }

        .data-type-active {
            background: #166DC7;
        }

        .nav-out {
            position: fixed;
            left: 1210px;
            top: 192px;
            width: 188px;
            z-index: 9999;
            margin-right: 0;
            background: rgba(26, 39, 95, 0.45);
            border: 2px solid #2E94E1;
            border-radius: 6px;


        }

    }





}
</style>
