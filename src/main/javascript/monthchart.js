(function(Highcharts) {
	String.prototype.format = function() {
	    var formatted = this;
	    for(arg in arguments) {
	        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
	    }
	    return formatted;
	};
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
	var update = function() {
		da = new Array();
		dx = 0;
		loadScript(
				'http://monitoring.norderstedt-energie.de/1064/days_hist.js?nocache',
				function() {
					var referenceDate=new Date();
					var daysInMonth=getDaysInMonth(referenceDate.getFullYear(),
							referenceDate.getMonth());
					var tagesSoll = Math.round(SollYearKWP
							* AnlagenKWP
							/ 10
							* sollMonth[2]
							/ (10000 * getDaysInMonth(referenceDate.getFullYear(),
									referenceDate.getMonth())) * 10) / 10;
					var max = new Array();
					var ertrag = new Array();
					var data = new Array();
					var soll = new Array();
					var cumulatedData = new Array();
					var cumulated=0;
					var count=0;
					for (i = dx - 1; i >= 0; i--) {
						var parts = da[i].split('|');
						var date = dateFromString(parts[0] + " 00:00:00");
						var ref = new Date(date);
						if (referenceDate.getFullYear() == ref.getFullYear() && referenceDate.getMonth() == ref.getMonth()) {
							var values = parts[1].split(';');
							var dataPoint = {
								date : date,
								ertrag : parseFloat(values[0] / 1000.0),								
								max : parseFloat(values[1]),
							};
							cumulated+=dataPoint.ertrag;
							data.push(dataPoint);
							max.push([ dataPoint.date, dataPoint.ac ]);
							cumulatedData.push([ dataPoint.date, cumulated ]);
							ertrag.push([ dataPoint.date, dataPoint.ertrag ]);
							count++;
						}
					}
					var prognose = new Array();
					// prognose.push([ dataPoint.date, cumulated ]);
					var aDate=new Date(date);
					for (i=count;i<daysInMonth;i++) {
						aDate.setDate(i);
						prognose.push([ aDate.getTime(), cumulated ]);
						cumulated+=tagesSoll;
					}
					var referenceEpoch=referenceDate.getTime();
					var start = new Date(referenceDate.getFullYear(),referenceDate.getMonth(),1);
					var end = new Date(referenceDate.getFullYear(),referenceDate.getMonth()+1,1);

					soll.push([ start.getTime(), tagesSoll ]);
					soll.push([ end.getTime(), tagesSoll ]);
					var sollAuflaufend=new Array();
					var day = start;
					var sum=0;
					for (i=1;i<=daysInMonth;i++) {
						day.setDate(i);
						sum=sum+tagesSoll;
						sollAuflaufend.push([day.getTime(),sum]);
					}
					var options = {
						chart : {
							renderTo : 'container1',
							type : 'column',
							zoomType : 'x',
							events : {
								load : function() {

									// set up the updating of the chart each
									// second
									var series = this.series[0];
									/*
									 * setInterval(function() { var x = (new
									 * Date()).getTime(), // current // time y =
									 * Math.random(); series.addPoint([ x, y ],
									 * true, true); }, 1000);
									 */
								}
							}
						},
						title : {
							text : 'Monatsübersicht'
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
								text : 'Energie [kWh]'
							},
							min : 0,
						},{
							title : {
								text : 'Gesamt Energie [kWh]'
							},
							min : 0,
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
							name : 'Ertrag [kWh]',
							color : '#E0C000',
							data : ertrag
						}, {
							yAxis : 0,
							type : 'spline',
							dashStyle : 'Dash',
							name : 'Tagessoll  [kWh]',
							data : soll
						}, {
							yAxis : 1,
							type : 'spline',
							dashStyle : 'Dash',
							name : 'Monatsoll  [kWh]',
							data : sollAuflaufend
						}, {
							yAxis : 1,
							type : 'spline',
							color: "#00B000",
							name : 'Ertrag (cum.)  [kWh]',
							data : cumulatedData
						}, {
							yAxis : 1,
							type : 'spline',
							color: "#00B000",
							dashStyle : 'Dash',
							name : 'Prognose [kWh]',
							data : prognose
						} ]
					};
					var chart;
					chart = new Highcharts.Chart(options);
				});
	}
	update();
	setInterval(update, 60000);

}(Highcharts));
