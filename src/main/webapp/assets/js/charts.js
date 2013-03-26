(function(Highcharts) {
	var today = new Date();
	var tagesSoll = Math.round(SollYearKWP * AnlagenKWP / 10 * sollMonth[2]
			/ (10000 * getDaysInMonth(today.getFullYear(), today.getMonth()))
			* 10) / 10;
	var ac = new Array();
	var dc1 = new Array();
	var dc2 = new Array();
	var ertrag = new Array();
	var u1 = new Array();
	var u2 = new Array();
	var temp = new Array();
	var soll = new Array();
	var categories = new Array();
	for (i = mi - 1; i >= 0; i--) {
		var parts = m[i].split('|');
		var date = dateFromString(parts[0]);
		var values = parts[1].split(';');
		ac.push([ date, parseFloat(values[0]) ]);
		dc1.push([ date, parseFloat(values[1]) ]);
		dc2.push([ date, parseFloat(values[2]) ]);
		ertrag.push([ date, parseFloat(values[3]) / 1000.0 ]);
		u1.push([ date, parseFloat(values[4]) ]);
		u2.push([ date, parseFloat(values[5]) ]);
		categories.push(parts[0])
	}
	var x = local2UTC(new Date());
	var startEnd = getStartAndEnd(new Date());
	soll.push([ startEnd[0].getTime(), tagesSoll ]);
	soll.push([ startEnd[1].getTime(), tagesSoll ]);
	var options = {
		chart : {
			renderTo : 'container',
			type : 'areaspline',
			zoomType : 'x'
		},
		title : {
			text : HPTitel
		},
		xAxis : {
			type : 'datetime',
			tickIntervall : 15 * 60 * 1000,
			dateTimeLabelFormats : { // don't display the dummy year
				month : '%e. %b',
				year : '%b'
			}
		},
		yAxis : [ { // --- Primary yAxis
			title : {
				text : 'Leistung [W]'
			},
			min : 0,
			max : 5000
		}, { // --- Secondary yAxis
			title : {
				text : 'Energie [kWh]'
			},
			min : 0,
			max : 40,
			opposite : true
		} ],

		series : [ {

			yAxis : 0,
			name : 'AC Leistung',
			color : '#E0C000',
			data : ac
		}, {
			yAxis : 0,
			type : 'spline',
			name : 'DC Leistung String 1',
			data : dc1
		}, {
			yAxis : 0,
			type : 'spline',
			name : 'DC Leistung String 2',
			data : dc2
		}, {
			yAxis : 1,
			type : 'spline',
			dashStyle : 'Dot',
			name : 'Ertrag',
			data : ertrag
		}, {
			yAxis : 1,
			type : 'spline',
			dashStyle : 'Dash',
			name : 'Tagessoll',
			data : soll
		} ]
	};
	function renderChart() {
		chart = new Highcharts.Chart(options);
	}
	// this function requests the data
	function reqData() {
		$
				.ajax({
					url : "http://monitoring.norderstedt-energie.de/1064/min_day.js?nocache",
					dataType : "jsonp",
					jsonp : "callback",
					jsonpCallback : "jsonpcallback"
				});
	}
	var chart;
	// after DOM is loaded setup timeout to call the ajax method
	$(document).ready(function() {
		// call function to render the chart and setup the options
		renderChart();
	});

}(Highcharts));
