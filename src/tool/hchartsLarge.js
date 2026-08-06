import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);

export default {
    pieHchart(options) {
    	var option = {
            dom: '',
            series: '',
            title: '',
            titleStyle:{ "color": "#fff", "fontSize": "18px" },
            colors:[]
            
        
        }
        option = Object.assign(option, options);
       
        var chart = Highcharts.chart(option.dom, {
        	credits:false,
            chart: {
            	backgroundColor:'none',
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: option.title,
                style:option.titleStyle,
            },
            
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    colors:option.colors,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                        	
                            return '<p style="font-size: 14px;font-family: Myriad Pro;font-weight: 400;color:'+this.color+'">' + this.y + '</p><br/><p style="font-size:12px;font-family: Microsoft YaHei;font-weight: bold;color: #FFFFFF;padding:17px;">'+this.key+'</p>';
                        },
                        style: {
                           
                            textOutline: 'none'
                        }



                    }
                }
            },
            series: option.series
        });
    }
}