
d3.csv("HousingBalance.csv", function(d) {
	var dataset = d3.entries(d[0]);
	console.log(dataset)
	}
	
/* 	, 
	function(error, rows) {
	console.log(rows);
		} */
);