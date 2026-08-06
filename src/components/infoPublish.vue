<template>
    <div class="component-box">
        <div class="main">
            <div class="alarm-table">
                <div class="header">
                    <h3>建议发布信息</h3>
                    <i @click="$parent.publishInfo=null">x</i>
                </div>
                <p>{{info.location}}</p>
                <div class="publish-info">
                    <li>
                        <span style="line-height: 140px;">信息屏发布信息：</span>
                        <b style="width:250px;font-size: 50px;color: #ce2a33;background: #000;">隧道火灾</br>禁止驶入</b>
                    </li>
                    <li>
                        <span>车道灯：</span>
                        <b>
                            <img :src="require('../assets/image/screen/1920/stop1.png')" alt="">
                        </b>
                        <em>关闭</em>
                    </li>
                    <li>
                        <span>信号灯：</span>
                        <b>
                            <img :src="require('../assets/image/screen/1920/stop.png')" alt="">
                        </b>
                        <em>红灯</em>
                    </li>
                </div>
                <div class="button" @click="$parent.publishInfo=null">确认</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['info'],
    components: {

    },
    data() {
        return {


        }
    },
    computed: {

    },

    watch: {

    },
    created() {

    },
    mounted() {

        console.log(this.info)
    },
    destroyed() {

    },

    methods: {}

};
</script>
<style lang="scss">
.alarm-table {
    flex: 1;
    padding: 30px 30px;


    .header {
        width: 100%;
        height: 30px;
        display: flex;
        line-height: 30px;

        h3 {
            text-align: center;
            flex: 1;

        }

        i {
            float: right;
            font-size: 18px;
            cursor: pointer;

        }
    }

    p {
        font-size: 40px;
        text-align: center;
        margin: 40px 0;
    }

    .publish-info {

        li {
            overflow: hidden;
            margin-bottom: 40px;
            line-height: 60px;

            span {
                font-size: 26px;
                width: 50%;
                text-align: right;
                float: left;

            }

            b {
                float: left;
                text-align: center;


            }

            em {
                float: left;
                font-size: 22px;
                margin-left: 20px;
            }
        }
    }

    .button {
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
        margin:0 auto;
    }
}
</style>