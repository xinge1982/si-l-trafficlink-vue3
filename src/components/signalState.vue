<template>
	<div>
		<!-- <div class="signal-chart-box " style="top:10px;background: rgba(33,36,37,1);"> -->
			<!-- <div class="signal-chart-box-title">
				<span>信号周期：</span>
				<span>{{timeRange.startTime+' - '+timeRange.endTime}}</span>
				<el-button type="text" style="float: right;padding: 0;" @click="$parent.signalStateShow=false">返回</el-button>
			</div> -->
			<div class="chart-content-box">
				<h3 style="background: rgba(42,52,56,.8);padding: 0 10px;display: inline-block;margin-left: 10px;">
					<span>{{$t("home.schemeComparison")}}</span>
					<i :class="play?'el-icon-video-pause':'el-icon-video-play'" style="margin-left: 20px;cursor: pointer;" @click="play=!play,playPlan()"></i>
				</h3>
				<div style="font-size: 14px;font-weight: 700;padding: 10px 0;margin-left: 10px;">
					<i class="el-icon-arrow-left" style="font-size: 16px;font-weight: 700;"></i>
					<span>{{time}}</span>
					<i class="el-icon-arrow-right" style="font-size: 16px;font-weight: 700;"></i>
				</div>
				
				<div class="signal-state-ect-box">
					
					<div class="signal-state-ect">
						<div class="state-ect" id="ect2"></div>
						<div class="state-ect" id="ect4"></div>
					</div>
				
	       			<div class="signal-state-ect" style="flex-direction: column;height: 300px;margin-top: 15px;">
	       				<div class="state-ect" id="ect1"></div>
						<div class="state-ect" id="ect3"></div>
	       			</div>
				</div>
				
       			<div class="signal-state-list" >
					<p style="padding:5px 10px;color:#ea7a17;">{{'*'+$t("home.comparisonBetweenPlan")}}</p>
					<ul style="font-weight: 700;border-top: 1px solid #333;">
	       				<li>{{$t("home.name")}}</li>
	       				<li>{{$t("home.duration")}}</li>
	       				<li>{{$t("home.theLengthOfQueue")}}</li>
	       				<li>{{$t("home.flow")}}</li>
	       				<li>{{$t("home.saturation")}}</li>
	       				<li>{{$t("home.averageDelay")}}</li>	
	       			</ul>
	       			<div >
	       				<ul v-for="item in table"  >
				  			<li>{{item.name}}</li>
				  			<li>{{item.timeOld+'/'+item.timeNew}}</li>
				  			<li>{{item.queueOld+'/'+item.queueNew}}</li>
				  			<li>{{item.flowOld+'/'+item.flowNew}}</li>
				  			<li>{{item.occupyOld+'/'+item.occupyNew}}</li>
				  			<li>{{item.delayOld+'/'+item.delayNew}}</li>
				  		</ul>
	       			</div>
       				
       			
				</div>
			</div>
	</div>
</template>

<script setup lang="ts">
import http from '@/api/http';

const { SERVICE_URL } = window.APP_CONFIG;


import timeLine from './timeLine.vue';

	function getOrCreateChart(domId) {
		var dom = document.getElementById(domId);
		if (!dom) {
			return null;
		}
		return echarts.getInstanceByDom(dom) || echarts.init(dom);
	}
	
	defineOptions({
		// props:['timeRange'],
		components: {
			timeLine
		},
  	
 		
		data() {
			return {
				options: {
			        speed: 0.1, // 速度
			        speedMin:0.1,
			        speedMax: 1,// 速度最大值
			        step:0.1
		       	},
		       	play:true,
		       	int:null,

		       	activeIndex: 0, // 当前的时间位置
		      	interval: 1000, // 日期间的间隔
		       	dateTimes: [],
		       	activeIndex:0,
		       	table:[],
				newPlan:'',
				oldPlan:'',
				realBar:null,
				realPie:null,
				colors:['#c23531',  '#d48265', '#91c7ae','#61a0a8','#749f83',  '#ca8622', '#bda29a'],
				time:''
			}
		},
  		watch:{
	  	},
		created() {
			this.time = this.mapUtils.getDateYMD('ymdhms');
		},
		mounted() {
			this.getSignalCharts();

		},
		unmounted(){
			this.clearInterval()
			if (this.realBar) {
				this.realBar.dispose();
				this.realBar = null;
			}
			if (this.realPie) {
				this.realPie.dispose();
				this.realPie = null;
			}
		},
		beforeUnmount(){
			
			
			this.clearInterval()
			if (this.realBar) {
				this.realBar.dispose();
				this.realBar = null;
			}
			if (this.realPie) {
				this.realPie.dispose();
				this.realPie = null;
			}
		},
		methods: {
			
			playPlan(){
				
				if (this.play) {
					this.int = setInterval(()=>{

		           		this.activeIndex++;
		           		this.getDateFun(this.activeIndex);
		           		if (this.activeIndex==this.newPlan.times.length-1) {
		           			
		           			this.activeIndex = 0;
		           		}
		           	},500)
				}else{
					this.clearInterval()
				}
			},
			clearInterval(){
				if (this.int) {
					clearInterval(this.int);
		      		this.int = null;
				}
		      
		    },
	       	getDateFun(index){
	       		
	       		
	       		// var legendData4 = []
	           	this.newPlan.times[index].pie.forEach((item,i)=>{
	           		
	           		if (item.name==" ") {
	           			var obj = {
	           				itemStyle:{
	           					color:"#546570"
	           				}
	           			}
	           			item =  Object.assign(item, obj);
	           		}else{
	           			
	           			var obj = {
	           				itemStyle:{
	           					color:this.colors[i]
	           				}
	           			}
	           			item =  Object.assign(item, obj);
	           		}
	           	})
	       		var pieseries = [{
		            name: '',
		            type: 'pie',
		            radius: '70%',
		            center: ['50%', '50%'],
		            data: this.newPlan.times[index].pie,
		            label: {
		               
		                position: 'inner'
		            },
		             labelLine: {
		                show: false
		            },
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }]
	       		this.realPie.setOption({
	       			
	       			series:pieseries
	       		});


	       		var series3 = this.newPlan.times[index].bar
	       		this.realBar.setOption({
	       			
	       			series:series3
	       		});
	       	},
	       	getSignalCharts() {
	          
	          var _this = this;
	          var param = {
	           
	          };
	          this.signalData = '';
	          http.get( SERVICE_URL+'index/getSignalCharts?', { params: param
	            }).then((data) => {
	            
	          	this.$nextTick(()=>{
		          	this.table = data.data.table;
		           	this.newPlan = data.data.newPlan;
		           	this.oldPlan = data.data.oldPlan;
		           	var xobj = {
		           		axisLabel:{
							textStyle: {
								color: '#fff'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#fff'
							},
							show: true
						},
						splitLine: {
							
							show: false
						},
		           	};
	           		this.oldPlan.xaxis[0] = Object.assign(this.oldPlan.xaxis[0], xobj);
	           	
					var obj = {
						axisLabel:{
							textStyle: {
								color: '#fff'
							}
						},
						
						splitLine: {
							
							show: false
						},
					}
					this.oldPlan.yaxis[0] = Object.assign(this.oldPlan.yaxis[0], obj);
					var legendData1 = []
					this.oldPlan.series.forEach(item=>{
						legendData1.push(item.name)
					})
		           	var options1 = {
		           		title:this.$t("home.beforeOptimization"),
		           		dom:'ect1',
		           		series:this.oldPlan.series,
		           		xaxis:this.oldPlan.xaxis,
		           		yaxis:this.oldPlan.yaxis,
		           		legendData:legendData1
		           		
		           	}
		           	this.barChart(options1);

		           	var series3 = this.newPlan.times[this.activeIndex].bar
	           		var options3 = {
		           		dom:'ect3',
		           		title:this.$t("home.optimized"),
		           		series:series3,
		           		xaxis:this.oldPlan.xaxis,
		           		yaxis:this.oldPlan.yaxis,
		           		legendData:legendData1
		           	}
		           	this.realBar = this.barChart(options3);




		           var legendData = []
		           	this.oldPlan.pie.forEach((item,i)=>{
		           		legendData.push(item.name)
		           		var obj = {
	           				itemStyle:{
	           					color:this.colors[i]
	           				}
	           			}
	           			item =  Object.assign(item, obj);
		           	})
			        var series = [{
			            name: '',
			            type: 'pie',
			            radius: '70%',
			            center: ['50%', '50%'],
			            data: this.oldPlan.pie,
			            label: {
			               
			                position: 'inner'
			            },
			             labelLine: {
			                show: false
			            },
			            emphasis: {
			                itemStyle: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }]
				    
		           	var options2 = {
		           		title:this.$t("home.originalPlanFixedTiming"),
		           		dom:'ect2',
		           		series:series,
		           		legendData:legendData

		           	}
		           	this.pieChart(options2)




	           	var legendData4 = []
	           	this.newPlan.times[this.activeIndex].pie.forEach((item,i)=>{
	           		if (item.name==" ") {
	           			var obj = {
	           				itemStyle:{
	           					color:"#546570"
	           				}
	           			}
	           			item =  Object.assign(item, obj);
	           		}else{
	           			var obj = {
	           				itemStyle:{
	           					color:this.colors[i]
	           				}
	           			}
	           			item =  Object.assign(item, obj);
	           			legendData4.push(item.name)
	           		}
	           		
	           	})
		        var series4 = [{
		            name: '',
		            type: 'pie',
		            radius: '70%',
		            center: ['50%', '50%'],
		            data: this.newPlan.times[this.activeIndex].pie,
		            label: {
		               
		                position: 'inner'
		            },
		             labelLine: {
		                show: false
		            },
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }]
			    
		           	var options4 = {
		           		title:this.$t("home.realTimeOptimizationPlanAdaptive"),
		           		dom:'ect4',
		           		series:series4,
		           		legendData:legendData4

		           	}
		           	this.realPie = this.pieChart(options4)
		           	var i = 0;
		           	
		           	
	          	})
	          	this.playPlan()
	          })
	        },
	       	barChart(options){
	       		
	       		var option = {
					dom: '',
					color: '#fff',
					legendData: [],
					xAxisData: [],
					series: [],
					gridLeft: 15,
					gridRight: 75,
					gridTop: 25,
					gridBom: 25,
					legendBom: 'auto',
					title:'',
					min:0,
					splitNumber:2,
					yAxisName:'',
	           		xaxis:[],
	           		yaxis:[]

				}
				option = Object.assign(option, options);
				var bar_Chart = getOrCreateChart(option.dom);
				if (!bar_Chart) {
					return null;
				}
				
				var opt = {
					color: ['#d14a61', '#5793f3', '#d48265', '#91c7ae'], 
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					title: {
						text: option.title,
						left: 10,
						backgroundColor:"rgba(42,52,56,.8)",
						textStyle: {
							color: option.color,
							fontSize: 12
						}
					},

					legend: {
						data: option.legendData,
						textStyle: {
							color: option.color,

						},
						orient: 'vertical',
						right: 20,
						top: 10
					},
					grid: {
						left: option.gridLeft,
						right: option.gridRight,
						top: option.gridTop,
						bottom: option.gridBom,
						containLabel: true
					},
					xAxis: option.xaxis,
					yAxis: option.yaxis,
					series:option.series 
				};
				bar_Chart.clear();
				bar_Chart.setOption(opt);
				return bar_Chart;
	       	},
	       	pieChart(options){
	       		
	       		var option = {
					dom: '',
					color: '#fff',
					legendData: [],
					xAxisData: [],
					series: [],
					
					legendBom: 'auto',
					title:'',
					min:0,
					splitNumber:2,
					yAxisName:''
				}
				option = Object.assign(option, options);
				var pie_Chart = getOrCreateChart(option.dom);
				if (!pie_Chart) {
					return null;
				}
				var opt = {
					
					tooltip: {
				        trigger: 'item',
				        formatter: '{a} <br/>{b}: {c}s ({d}%)'
				    },
					title: {
						text: option.title,
						left: 'center',
						bottom:0,
						backgroundColor:"rgba(42,52,56,.8)",
						textStyle: {
							color: option.color,
							fontSize: 12,
							
						}
					},

					legend: {
						data: [],
						textStyle: {
							color: option.color,

						},
						 orient: 'vertical',
						right: 'right'
					},
					
					series:option.series 
				};
				pie_Chart.clear();
				pie_Chart.setOption(opt);
				return pie_Chart;
	       	}
		}
    
	});
</script>

<style scoped>
	
	/*.main{
		width: 100%;
		height: 100%;
		background: rgba(33,36,37,.5);
	}*/
	/*.signal-chart-box-title{
		padding: 10px;
		border-bottom: 1px solid #333;
	}*/
	.chart-content-box{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		/*width: 100%;*/
		
	}
	.signal-state-list {
		height: 168px;
		border:1px solid #333;
		position: absolute;
		left: 10px;
		right: 10px;
		top: 570px;
		height: auto;
		
	}
	.signal-state-list ul{
		display: flex;
		border-bottom:1px solid #333;
	}
	.signal-state-list ul:last-child{
		
		border-bottom:none;
	}
	.signal-state-list li{
		flex:1;
		padding: 5px 0;
		text-align: center;
	}
	.signal-state-ect-box{
		/*position: absolute;
		
		width: 100%;*/
		
		
	}
	.signal-state-ect{
		width: 100%;
		height: 190px;
		/*margin: 0 10px 10px 10px;*/
		display: flex;
		
	}
	.time-line-box{
		margin:10px;
		height: 80px;
    	border: 1px solid #333;
    	padding: 10px;

	}
	.state-ect{
		flex:1;

	}
	.ect-title{
		padding: 0 10px;
		font-size: 16px;
		font-weight: 600;
	}
</style>
