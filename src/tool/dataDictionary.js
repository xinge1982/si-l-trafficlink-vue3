// 数据字典对应关系
window.DCNY = {
	
	eventBigType: [{
			value: '',
			label: '全部事件',
			options: []
		}, {
			value: '100',
			label: '事故类',
			options: []
		}, {
			value: '200',
			label: '施工类',
			options: []
		}, {
			value: '300',
			label: '管制类',
			options: [
			]
		}, {
			value: '400',
			label: '关闭类',
			options: []
		}, {
			value: '500',
			label: '其他',
			options: []
		},

	],
	eventType:{
		"":[],
		"100":[
			{
				value: 101,
				label: '一般事故',
			}, {
				value: 102,
				label: '严重事故',
			}, {
				value: 103,
				label: '故障车',
			}
		],
		"200":[
			{
				value: 201,
				label: '道路施工',
			}
		],
		"300":[
				{
					value: 301,
					label: '交通管制',
				}

		],
		"400":[
			{
				value: 102302,
				label: '严重交通事故&道路关闭',
			}, {
				value: 201302,
				label: '道路施工&道路关闭',
			}, {
				value: 302,
				label: '道路关闭',
			}, {
				value: 303,
				label: '出口匝道关闭',
			}, {
				value: 304,
				label: '入口匝道关闭',
			}, {
				value: 404302,
				label: '大雾&道路关闭',
			}, {
				value: 406303,
				label: '大雨&道路关闭',
			}, {
				value: 409304,
				label: '大雪&道路关闭',
			}
		],
		"500":[
			{
				value: 501,
				label: '路面积水',
			}, {
				value: 901,
				label: '公告',
			}, {
				value: 902,
				label: '通车',
			}, {
				value: 903,
				label: '完成改建',
			}, {
				value: 904,
				label: '实景路况',
			}, {
				value: 907,
				label: '定制播报',
			}
		]
		
	},
	roadClass: [{
		value: '',
		label: '全部道路等级'
	}, {
		value: '41000',
		label: '高速公路'
	}, 
	// {
	// 	value: '43000',
	// 	label: '城市快速路'
	// }, 
	{
		value: '42000',
		label: '国道'
	}, {
		value: '51000',
		label: '省道'
	}, 
	// {
	// 	value: '52000',
	// 	label: '县道'
	// }, 
	{
		value: '44000',
		label: '城市主干路'
	}
	// {
	// 	value: '45000,47000,53000,54000,49',
	// 	label: '其他'
	// }
	],
	roadType:[
	{
		value: '',
		label: '全部道路类型'
	}, {
		value: '1',
		label: '危险道路'
	}, 
	{
		value: '2',
		label: '隧道'
	}
	],
	dispatchType:[{
		value: '931',
		label: '极度拥堵'
		}, 
		{
			value: '935',
			label: '不建议通行'
		}

	],
	dispatchCause:{
	"931":[
			{
				
				label: '极度拥堵',
			}
		],
	"935":[
			{
				
				label: '易发拥堵',
			},{
				
				label: '大雾',
			},{
				
				label: '大雪',
			},{
				
				label: '大雨',
			},{
				
				label: '积雪',
			},{
				
				label: '积水',
			},
		],
	} 

}

