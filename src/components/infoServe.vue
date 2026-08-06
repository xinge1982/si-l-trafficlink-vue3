<template  >
    <div class="cross-valuate-box" style="background: rgba(0,0,0,.5);">
        <div class="infoserve-map">
            <home-map></home-map>
            <div class="hw-list-box">
                <div class="hw-list-btn">
                    <li v-for="item in eventMenu" :key="item.value" :class="active==item.value?'active':''" @click="active=item.value">{{item.name}}</li>
                </div>
                <div class="hw-list">
                    <ul>
                        <li style="flex:0.8;">序号</li>
                        <li style="flex:1.2;">类型</li>
                        <li style="flex:5;">位置</li>
                        <li style="flex:2;">开始时间</li>
                        <li style="flex:1.5;">预案</li>
                    </ul>
                    <div class="hw-list-c">
                        <ul v-for="(item,index) in eventList" :class="item.id==evtActive?'evtActive':''" @click="evtActive=item.id">
                            <li style="flex:0.8;">{{Number(index)+1}}</li>
                            <li style="flex:1.2;">{{item.typeName}}</li>
                            <li style="flex:5;">{{item.location}}</li>
                            <li style="flex:2;">{{item.startTime}}</li>
                            <li style="flex:1.5;">{{item.plan}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="hw-publish-info" :class="active==1&&evtActive?'hw-publish-info1':active==3&&evtActive?'hw-publish-info3':''"></div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            eventMenu: [],
            active: 1,
            eventList: [],
            evtActive:null
        }
    },
    mounted() {
        this.getEventMenus()
    },
    watch: {
        active() {
            this.evtActive = null;
            this.getEventList()
        }
    },
    methods: {
        getEventMenus() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL + 'expressway/event/getEventMenus?', { params: param }).then((data) => {

                this.eventMenu = data.data.data;
                this.getEventList()

            })
        },
        getEventList() {

            var _this = this;
            var param = {
                type: this.active,
                pageSize: 7
            };

            this.axios.get(SERVICE_URL + 'expressway/event/getEventList?', { params: param }).then((data) => {

                this.eventList = data.data.data.resultList;
                map.on('click',  function(event) {
                    _this.evtActive = null;
                });

            })
        },
    }
}
</script>
<style lang="scss">
@media screen and (max-width:2400px) {
    .infoserve-map {
        position: absolute;
        left: 0;
        right: 0;
        height: 100%;
    }

    .hw-list-box {
        position: absolute;
        width: 775px;
        height: 500px;
        top: 200px;
        left: 40px;

        .hw-list-btn {
            width: 100%;
            display: flex;


            li {
                width: 108px;
                height: 27px;
                border: 1px solid #00B4FF;
                border-radius: 3px;
                margin: 0 0 20px 20px;
                text-align: center;
                line-height: 27px;
                font-size: 17px;
                font-family: Adobe Heiti Std;
                font-weight: normal;
                cursor: pointer;

            }

            .active {
                background: linear-gradient(0deg, rgba(0, 180, 255, 0.4), rgba(0, 180, 255, 0.05));
            }
        }

        .hw-list {
            width: 745px;
            height: 455.5px;
            background: url(../assets/image/screen/list-bg.png);
            background-size: 100% 100%;
            padding: 30px 10px 30px 30px;

            ul {
                display: flex;
               

                font-size: 14px;
                font-family: Adobe Heiti Std;
                font-weight: normal;
                color: #52CCFF;

            }
        }

        .hw-list-c {
            ul {
                color: #fff;
               padding: 20px 0;
                cursor: pointer;
            }
            .evtActive{
                     background: url(../assets/image/screen/td-bg.png);
                     background-size: 100% 100%;
                }
        }
    }

    .hw-publish-info {
        position: absolute;
        width: 1032px;
        height: 719px;
        top: 200px;
        right: 40px;
        display: none;
       
    }
    .hw-publish-info1{
        display: block;
        background: url(../assets/image/screen/acd.png);
         background-size: cover;
       
    }
    .hw-publish-info3{
        display: block;
        background: url(../assets/image/screen/road-work.png);
         background-size: cover;
       
    }
}

@media screen and (min-width:2400px) {
    .infoserve-map {
        position: absolute;
        left: 0;
        right: 0;
        height: 100%;
    }

    .hw-list-box {
        position: absolute;
        width: 1550px;
        height: 1000px;
        top: 400px;
        left: 80px;

        .hw-list-btn {
            width: 100%;
            display: flex;


            li {
                width: 216px;
                height: 54px;
                border: 2px solid #00B4FF;
                border-radius: 6px;
                margin: 0 0 40px 40px;
                text-align: center;
                line-height: 54px;
                font-size: 34px;
                font-family: Adobe Heiti Std;
                font-weight: normal;
                cursor: pointer;

            }

            .active {
                background: linear-gradient(0deg, rgba(0, 180, 255, 0.4), rgba(0, 180, 255, 0.05));
            }
        }

        .hw-list {
            width: 1450px;
            height: 900px;
            background: url(../assets/image/screen/list-bg.png);
            background-size: 100% 100%;
            padding: 60px 20px 60px 50px;
            ul {
                display: flex;
                // height: 60px;

                font-size: 30px;
                font-family: Adobe Heiti Std;
                font-weight: normal;
                color: #52CCFF;

            }

            .hw-list-c {
                ul {
                    color: #fff;
                    // margin-top: 60px;
                    cursor: pointer;
                    padding: 40px 0;
                }
                .evtActive{
                     background: url(../assets/image/screen/td-bg.png);
                }
            }
        }
    }

    .hw-publish-info {
        position: absolute;
        width: 2064px;
        height: 1438px;
        top: 400px;
        right: 80px;
        display: none;
    }
    .hw-publish-info1{
        display: block;
        background: url(../assets/image/screen/acd.png);
         background-size: cover;
       
    }
    .hw-publish-info3{
        display: block;
        background: url(../assets/image/screen/road-work.png);
         background-size: cover;
       
    }
}
</style>