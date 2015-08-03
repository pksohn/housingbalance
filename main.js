
// global variables
	
var margin = {top: 20, right: 20, bottom: 20, left: 210}, // set eventual SVG margins, box width, box height
 width = 600 - margin.left - margin.right,
 height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear() // function to scale a domain to the predetermined width above
	.range([0, width]);

var y = d3.scale.ordinal() // function to create rows for data bars scaled to specified height
	.rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis() // axis function
	.scale(x)
	.orient("top");
	
var yAxis = d3.svg.axis() // y axis labels
	.scale(y)
	.orient("left");

function generateBarChart(dataset) {
  
//generate bar chart

	var barchart = d3.select("body").append("svg") 
		.attr("class","barcontainer")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom) 
		.attr("style", "outline: thin solid red;") // outline for testing
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	x.domain(d3.extent(dataset, function(d) { return +d.value; })).nice(); // find extent of data in "value" field; scale to specified range above.
	y.domain(dataset.map(function(d) { return d.key; })); // for each key, "scale" to y-axis for rows	
		
	//add bar chart functionality
	barchart.selectAll(".bar")
		.data(dataset)
		.enter().append("rect")
		.attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; }) // set classes using ternary operator on comparison to 0
		.attr("x", function(d) { return x(Math.min(0, +d.value)); }) // bar x-position. either 0 (for positive numbers) or the value of the number (for negative numbers)
		.attr("y", function(d) { return y(d.key); }) // bar y-position (uses function "y" from above to map to range)
		.attr("width", function(d) { return Math.abs(x(+d.value) - x(0)); }) // bar length using absolute value
		.attr("height", y.rangeBand()) // bar width, using "y" function

	barchart.append("g")
		.attr("class", "x axis")
		.call(xAxis);
	  
	barchart.append("g")
		.attr("class", "y axis")
		.append("line")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y2", height);
		
	barchart.append("g")
		.attr("class", "ylabel")
		.call(yAxis);
	
	}


function generateMap() {			
// prep and generate map

	var mapwidth = 600,
		mapheight = 600;

	var mapsvg = d3.select("body").append("svg")
		.attr("width", mapwidth)
		.attr("height", mapheight)
		.attr("style", "outline: thin solid red;"); // outline for testing
		
	var projection = d3.geo.mercator()
		.center([-122.37,37.79])
		.scale(170000);
		
	var path = d3.geo.path()
		.projection(projection);
	
	// draw map
	
	d3.json("districts_v4.json", function(error, districts) {
			/* 	mapsvg.append("path")
			.datum(topojson.feature(districts, districts.objects.districts2))
			.attr("d", path);  */ 
		  
		mapsvg.selectAll(".districts2")
			.data(topojson.feature(districts, districts.objects.districts2).features)
			.enter().append("path")
			.attr("class", function(d) { return "districts2 " + d.id; })
			.attr("d", path)
			.on("mouseover", function(d) {updateData(d.properties.SUPERVISOR); console.log(d.properties.SUPERVISOR);})
			.on("mouseout", function(d) {updateData(12);});
		
		console.log(districts)
		});
	
/* 	d3.json("streets_project.json", function(error, streets) {
		  
 	mapsvg.selectAll(".streets_project")
			.data(topojson.feature(streets, streets.objects.streets_project).features)
			.enter().append("path")
			.attr("class", function(d) { return "streets_project" + d.id; })
			.attr("d", path); 
		
		}); */
	  
}

function updateBarChart(dataset) {
  
//generate bar chart

	x.domain(d3.extent(dataset, function(d) { return +d.value; })).nice(); // find extent of data in "value" field; scale to specified range above.
	y.domain(dataset.map(function(d) { return d.key; })); // for each key, "scale" to y-axis for rows	
		
	//add bar chart functionality
	var barchart = d3.selectAll(".bar")
		.data(dataset)
		.transition()
		//.enter().append("rect")
		.attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; }) // set classes using ternary operator on comparison to 0
		.attr("x", function(d) { return x(Math.min(0, +d.value)); }) // bar x-position. either 0 (for positive numbers) or the value of the number (for negative numbers)
		.attr("y", function(d) { return y(d.key); }) // bar y-position (uses function "y" from above to map to range)
		.attr("width", function(d) { return Math.abs(x(+d.value) - x(0)); }) // bar length using absolute value
		.attr("height", y.rangeBand()) // bar width, using "y" function

	d3.selectAll(".x")
		//.attr("class", "x axis")
		.call(xAxis);
	  
	d3.selectAll(".y")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y2", height);
		
	d3.selectAll(".ylabel")
		.call(yAxis);
};

// load CSV at start
d3.csv("HousingBalance.csv", function(error, data) {

        if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.
        } else {      //If no error, the file loaded correctly. Yay!
		
		// load all city data to start
		  var dataset = d3.entries(data[11]);
		  dataset.shift();
		  console.log(dataset);
		  generateBarChart(dataset);
		  generateMap();
		}
});

function updateData(dist_no) {
	d3.csv("HousingBalance.csv", function(error, data) {

        if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.
        } else {      //If no error, the file loaded correctly. Yay!
		
		  var dataset = d3.entries(data[dist_no - 1]);
		  //console.log(dataset);
		  dataset.shift();
		  updateBarChart(dataset);
		}
	})
};

