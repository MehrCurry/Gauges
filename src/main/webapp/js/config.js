red = 'rgba(255, 0, 0, 0.8)';
yellow = 'rgba(255, 255, 0, 0.8)';
green = 'rgba(0, 255, 0, 0.8)';

configurations = [ {
	name : "Camel.out.InflightExchanges.ZAEHLER",
	instrumentKey : "radial0",
	title : "Inflight",
	min : 0,
	max : 10,
	sections : [ {
		start : 0,
		end : 5,
		color : green
	}, {
		start : 5,
		end : 8,
		color : yellow
	}, {
		start : 8,
		end : 10,
		color : red
	} ]
},{
	name : "Camel.out.ExchangesFailed.ZAEHLER",
	instrumentKey : "radial1",
	title : "Failed",
	min : 0,
	max : 100,
	sections : [ {
		start : 0,
		end : 100,
		color : red
	} ]
},{
	name : "Camel.out.Load01.ZAEHLER",
	instrumentKey : "radial2",
	title : "Load01",
	min : 0,
	max : 10,
	sections : [ {
		start : 0,
		end : 5,
		color : green
	}, {
		start : 5,
		end : 8,
		color : yellow
	}, {
		start : 8,
		end : 10,
		color : red
	} ]
},{
	name : "Camel.out.LastProcessingTime.ZAEHLER",
	instrumentKey : "radial3",
	title : "Last",
	unit: "ms",
	min : 0,
	max : 10,
	sections : [ {
		start : 0,
		end : 5,
		color : green
	}, {
		start : 5,
		end : 8,
		color : yellow
	}, {
		start : 8,
		end : 10,
		color : red
	} ]
},{
	name : "Camel.out.MeanProcessingTime.ZAEHLER",
	instrumentKey : "radial4",
	title : "Mean",
	unit: "ms",
	min : 0,
	max : 10,
	sections : [ {
		start : 0,
		end : 5,
		color : green
	}, {
		start : 5,
		end : 8,
		color : yellow
	}, {
		start : 8,
		end : 10,
		color : red
	} ]
}, {
	name : "Camel.out.ExchangesCompleted.ZAEHLER",
	instrumentKey : "bar4",
	title : "Completed",
	min : 0,
	max : 10000
}, {
	name : "System.memory.HeapMemoryUsage.used.ZAEHLER",
	instrumentKey : "bar0",
	title : "Heap",
	unit : "MB",
	min : 0,
	max : 500
}, {
	name : "System.memory.NonHeapMemoryUsage.used.ZAEHLER",
	instrumentKey : "bar1",
	title : "NonHeap",
	unit : "MB",
	min : 0,
	max : 200
} ];