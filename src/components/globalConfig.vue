<template>
    <div class="changePass_box">
        <el-dialog v-model="dialog" :title="title" width="500px" @close="cancel">
            <p style="padding-bottom: 15px;">紧急报警推送配置</p>
            <el-form ref="form" :model="form" style="overflow: hidden;">
                <el-form-item v-for="item in types" :label="item.title" :key="item.value" style="float:left;min-width: 220px;">
                    <el-switch v-model="form[item.key]" @change="formChange()"></el-switch>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="doSubmit">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/api/http';

const { SERVICE_URL_v2 } = window.APP_CONFIG;


export default defineComponent({
    props: ["isShowPopup"],
    data() {
        return {
            title: '配置页面',
            dialog: this.isShowPopup,
            types: [],
            form: {}
        };
    },
    watch: {
        isShowPopup(val) {
            this.dialog = val;
        },
    },

    methods: {
        cancel() {
            this.$emit("closePassPopup");
        },

        doSubmit() {
            // this.$emit("closePassPopup");
            this.setSwitch()
        },
        formChange() {
            console.log(this.form)
        },
        getSwitch() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL_v2 + '/alarm/getSwitch?', { params: param }).then((data) => {
                this.types = data.data.data.types;
                this.form = data.data.data.keys

            }).catch((data) => {
                console.log(data)
            })
        },
        setSwitch() {

            var _this = this;
            // var qs = require('qs');
            // var datas = qs.stringify(this.form)
            http.post(SERVICE_URL_v2 + '/alarm/setSwitch?', this.form).then((data) => {
                if (data.data.code == 1) {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        offset: 80
                    });
                    this.getSwitch()
                    this.$emit("closePassPopup");
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error',
                        offset: 80
                    });
                }

            }).catch((data) => {

                console.log(data)
            })
        },

    },
    mounted() {
        this.getSwitch()
    }
});
</script>
<style scoped>
</style>
