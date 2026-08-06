<template>
    <div class="cross-name">
        <div class="select-box">
            <el-select v-model="crossId" filterable :placeholder="$t('home.pleaseChoose')" @change="crossIdChange()">
                <el-option v-for="item in crossList" :key="item.crossId" :label="item.crossName" :value="item.crossId">
                </el-option>
            </el-select>
        </div>
        <!-- <img style="width: 20px;height: 20px;margin-top: 5px;" :src="require('../assets/image/screen/c/search.png')" alt=""> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            crossData: '',
            crossId: '',
            crossList: [],
            crossListObj: {}
        }
    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'));
        this.getCrossLocation()
    },
    methods: {
        crossIdChange() {
            this.crossData = this.crossListObj[this.crossId];
            this.$emit('change', this.crossData)

        },
        // 路口拥堵top10

        getCrossLocation() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL_v2 + '/getCrossLocation?', { params: param }).then((data) => {
                if (this.crossData&&this.crossData.type) {
                    this.crossList = data.data.data[this.crossData.type];
                } else {
                    this.crossList = WEB_TYPE == 'cross' ? data.data.data.cross : data.data.data.road;
                }
                
                if (this.crossList.length > 0) {
                    if (this.crossData&&this.crossData.crossId) {
                        this.crossId = this.crossData.crossId;
                    } else {
                        this.crossId = this.crossList[0].crossId;
                         sessionStorage.setItem('crossData', JSON.stringify(this.crossList[0]))
                        // sessionStorage.setItem('crossData',this.crossList[0])
                       
                    }
                     this.$emit('parentMethod');
                    this.crossList.forEach(item => {

                        this.crossListObj[item.crossId] = item;

                    })
                }


            })
        },
    }
}
</script>
<style lang="scss">
.cross-name {
    width: 100%;
    margin-bottom: 38px;
    display: flex;

    img {
        width: 16px;
        height: 16px;
        vertical-align: center;
        margin-top: 10px;
    }

    p {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 38px;
        flex: 1;
        margin-left: 17px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .select-box {
        width: 100%;

        // margin-right: 17px;

        .el-input__inner {
            height: 35px;

            font-size: 14px;

        }

        .el-select .el-input.is-focus .el-input__inner {
            border-color: #2E94E1;
        }
    }
}
</style>