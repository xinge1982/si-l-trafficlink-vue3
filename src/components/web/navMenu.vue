<template>
    <div class="cross-box">
        <div class="cross-info-title-bar">
            <h2 class="cross-name">{{$route.query.crossName}}</h2>
            <div class="cross-info-right--close" @click="closecrossInfo">x</div>
            <div class="cross-info-menu">
                <li class="cross-info-nav" v-for="item in crossInfoNavMenu" v-text="item.name" :class="crossInfoNav==item.value?'data-type-active':''" @click="crossInfoNavClick(item)"></li>
            </div>
        </div>
        <!-- <router-view/> -->
    </div>
</template>
<script setup lang="ts">

const CS_WEBSOCKET_URL = window.APP_CONFIG.CS_WEBSOCKET_URL
    ?? window.APP_CONFIG.WEBSOCKET_URL.replace(/^http/, 'ws');


defineOptions({

    components: {

    },
    data() {
        return {

            crossInfoNavMenu: [{
                name: '轨迹监测',
                value: 2,
                path: 'csMonitor'
            }, {
                name: '路口评价',
                value: 1,
                path: 'cscrossEvaluate'
            }, {
                name: '信号评价',
                value: 3,
                path: 'cssignalEvaluate'
            }, {
                name: '组织评价',
                value: 4,
                path: 'csorganizationEvaluate'
            }, {
                name: '安全专题',
                value: 5,
                path: 'cssafetySpecial'
            }],
            crossInfoNav: 2,

            crossName: '',
            crossId: '',
            websocket: null


        }
    },
    watch: {

    },
    created() {

        this.creationWebsocket()

    },
    mounted() {


    },
    unmounted() {

        this.closeWebsocket();
    },
    methods: {
        closeWebsocket() {
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
        creationWebsocket() {
            this.closeWebsocket();
            if ('WebSocket' in window) {

                this.websocket = new WebSocket(CS_WEBSOCKET_URL);
            } else {
                alert('不支持 websocket')
            }

            this.websocket.onopen = function(event) {



            }
            this.websocket.onmessage = function(event) {


                var res = JSON.parse(event.data);
                // window.open(res.mainurl)
            }

        },
        openSend(item) {


            var message = JSON.stringify({ "crossId": this.$route.query.crossId, "crossName": this.$route.query.crossName, "type": "pageRoute", "mainurl": './#/' + item.path + '?crossName=' + this.$route.query.crossName + '&crossId=' + this.$route.query.crossId + '&centerX=' + this.$route.query.centerX + '&centerY=' + this.$route.query.centerY, "name": item.name, "trackService": '' })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        crossInfoNavClick(item) {

            this.crossInfoNav = item.value
            this.openSend(item)

        },
        closecrossInfo() {
            var message = JSON.stringify({ "crossId": this.$route.query.crossId, "crossName": this.$route.query.crossName, "type": "pageRoute", "mainurl": "./#/home", "name": "首页", "trackService": '' })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },

    }

});
</script>
<style scoped>
.cross-box {
    position: fixed;
    top: 0;
    transition: left 0.5s ease 0s;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(33, 36, 37, 1);
    display: flex;
}

.cross-info-title-bar {
    right: 12px;
    position: absolute;
    left: 12px;
    top: 12px;
    font-size: 14px;
    height: 60px;
    background: rgba(33, 36, 37, .62);


    z-index: 1000;
    overflow: hidden;
}

.cross-name {
    width: 270px;
    margin-left: 18px;
    line-height: 60px;
    float: left;

}

.cross-info-menu {
    float: left;
    width: 500px;
    display: flex;
    margin-top: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.cross-info-right--close {
    float: right;
    font-size: 22px;
    line-height: 60px;
    margin-right: 20px;
    cursor: pointer;
}

.cross-info-nav {
    flex: 1;
    padding: 3px 10px;
    margin-right: 20px;
    margin-top: 7px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid #333;
}

.data-type-active {
    background: #22a9ff;
}
</style>
