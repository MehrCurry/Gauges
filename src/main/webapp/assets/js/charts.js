(function(Highcharts) {
	function loadScript(sScriptSrc, oCallback) {
		var oHead = document.getElementsByTagName('head')[0];
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.src = sScriptSrc;
		// most browsers
		oScript.onload = oCallback;
		// IE 6 & 7
		oScript.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				oCallback();
			}
		}
		oHead.appendChild(oScript);
	}
	var update =function() {
		m = new Array();
		mi = 0;
		loadScript(
				'http://monitoring.norderstedt-energie.de/1064/min_day.js?nocache',
				function() {
					var today = new Date();
					var tagesSoll = Math.round(SollYearKWP
							* AnlagenKWP
							/ 10
							* sollMonth[2]
							/ (10000 * getDaysInMonth(today.getFullYear(),
									today.getMonth())) * 10) / 10;
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
							dateTimeLabelFormats : { // don't display
								// the dummy
								// year
								month : '%e. %b',
								year : '%b'
							}
						},
						yAxis : [ { // --- Primary yAxis
							title : {
								text : 'Leistung [W]'
							},
							min : 0,
						}, { // --- Secondary yAxis
							title : {
								text : 'Energie [kWh]'
							},
							min : 0,
							max : 40,
							opposite : true
						} ],
						plotOptions : {
							areaspline : {
								lineWidth : 2,
								marker : {
									enabled : false
								},
								shadow : false,
								states : {
									hover : {
										lineWidth : 1
									}
								},
								threshold : null
							},
							spline : {
								lineWidth : 2,
								marker : {
									enabled : false
								},
								shadow : false,
								states : {
									hover : {
										lineWidth : 1
									}
								},
								threshold : null
							}
						},
						series : [ {

							yAxis : 0,
							name : 'AC Leistung [W]',
							color : '#E0C000',
							data : ac
						}, {
							yAxis : 0,
							type : 'spline',
							name : 'DC Leistung Strang 1 [W]',
							data : dc1
						}, {
							yAxis : 0,
							type : 'spline',
							name : 'DC Leistung Strang 2 [W]',
							data : dc2
						}, {
							yAxis : 1,
							type : 'spline',
							name : 'Ertrag [kWh]',
							data : ertrag
						}, {
							yAxis : 1,
							type : 'spline',
							dashStyle : 'Dash',
							name : 'Tagessoll  [kWh]',
							data : soll
						} ]
					};
					var chart;
					chart = new Highcharts.Chart(options);
				});
	}
	update();
	setInterval(update, 60000);

}(Highcharts));
