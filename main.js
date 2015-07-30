function doEverything(dataset) {
	
// prep bar chart
	
	var margin = {top: 30, right: 10, bottom: 10, left: 200}, // set eventual SVG margins, box width, box height
		width = 500 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

	var x = d3.scale.linear() // function to scale a domain to the predetermined width above
		.range([0, width]);

	var y = d3.scale.ordinal() // function to create rows for data bars scaled to specified height
		.rangeRoundBands([0, height], .2);

	var xAxis = d3.svg.axis() // axis function
		.scale(x)
		.orient("top");
		
	var yAxis = d3.svg.axis() // y axis labels
		.scale(y)
		.orient("left")

	var tip = d3.tip() // tooltips function. must be called within svg.
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		return "<strong>"+ d.key +"</strong><br><span style='color:red'>" + d.value + "</span>";
	  })
  
  
//generate bar chart

	var barchart = d3.select("body").append("svg") 
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(tip); //call tooltip function
		
		x.domain(d3.extent(dataset, function(d) { return d.value; })).nice(); // find extent of data in "value" field; scale to specified range above.
		y.domain(dataset.map(function(d) { return d.key; })); // for each key, "scale" to y-axis for rows	
		
		//add bar chart functionality
		barchart.selectAll(".bar")
			.data(dataset)
			.enter().append("rect")
			.attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; }) // set classes using ternary operator on comparison to 0
			.attr("x", function(d) { return x(Math.min(0, d.value)); }) // bar x-position. either 0 (for positive numbers) or the value of the number (for negative numbers)
			.attr("y", function(d) { return y(d.key); }) // bar y-position (uses function "y" from above to map to range)
			.attr("width", function(d) { return Math.abs(x(d.value) - x(0)); }) // bar length using absolute value
			.attr("height", y.rangeBand()) // bar width, using "y" function
			.on('mouseover', tip.show) // show tooltip on mouseover
			.on('mouseout', tip.hide); // hide tooltip on mouseout

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
  
// prep and generate map

	var mapwidth = 400,
		mapheight = 400;

	var mapsvg = d3.select("body").append("svg")
		.attr("width", mapwidth)
		.attr("height", mapheight);
		
	var projection = d3.geo.mercator()
		.center([-122.419870,37.771700])
		.scale(80000)
		.translate([width * .6, height * .7]);
		
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
			.attr("d", path);
		
		  console.log(districts)
		});
	  
}

// load CSV with first row
d3.csv("HousingBalance.csv", function(error, data) {

        if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.
        } else {      //If no error, the file loaded correctly. Yay!
		  var dataset = d3.entries(data[0]);
		  dataset.shift();
		  console.log(dataset);
		  doEverything(dataset);
		}
});

