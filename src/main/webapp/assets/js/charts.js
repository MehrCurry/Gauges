$(function() {
	$('#container').highcharts({
		chart : {
			renderTo : 'container',
			type : 'bar'
		},
		title : {
			text : 'Fruit Consumption'
		},
		xAxis : {
			categories : [ 'Apples', 'Bananas', 'Oranges' ]
		},
		yAxis : {
			title : {
				text : 'Fruit eaten'
			}
		},
		series : [ {
			name : 'Jane',
			data : [ 1, 0, 4 ]
		}} ]
	});
});
