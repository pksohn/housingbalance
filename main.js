data = [
  {
    "name": "New Affordable Housing Built",
    "value": 255
  },
  {
    "name": "Acquisitions & Rehabs Completed",
    "value": 0
  },
  {
    "name": "Units Removed from Protected Status",
    "value": 535
  },
  {
    "name": "Total Entitled Affordable Units Permitted",
    "value": 4
  },
  {
    "name": "Planned RAD Units",
    "value": 144
  },
  {
    "name": "Net Affordable Housing Stock",
    "value": -132
  },
  {
    "name": "Total Net New Units Built",
    "value": 372
  },
  {
    "name": "Total Entitled Units",
    "value": 39
  }
]

balancedata = [
  {
    "name": "Housing Balance",
    "value": -0.321
  }
  ]

//
// LABELS FIRST
//
  
var label_margin = {top: 30, right: 0, bottom: 10, left: 50}, // set eventual SVG margins, box width, box height
    label_width = 270 - label_margin.left - label_margin.right,
    label_height = 500 - label_margin.top - label_margin.bottom;
	
var margin = {top: 30, right: 10, bottom: 10, left: 10}, // set eventual SVG margins, box width, box height
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear() // function to scale a domain to the predetermined width above
    .range([0, width]);

var y = d3.scale.ordinal() // function to create rows for data bars scaled to specified height
    .rangeRoundBands([0, height], .2);

x.domain(d3.extent(data, function(d) { return d.value; })).nice(); // find extent of data in "value" field; scale to specified range above.
y.domain(data.map(function(d) { return d.name; })); // for each name, "scale" to y-axis for rows
	
// Append SVG box for labels
  
var labels = d3.select("body").append("svg") 
    .attr("width", label_width + label_margin.left + label_margin.right)
    .attr("height", label_height + label_margin.top + label_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + label_margin.left + "," + label_margin.top + ")")

//add labels 
labels.selectAll(".label")
	.data(data)
	.enter().append("rect")
	.attr("class","label")
	.attr("x", 0)
	.attr("y", function(d) { return y(d.name); }) // bar y-position (uses function "y" from above to map to range)
	.attr("width", label_width) // bar length using absolute value
	.attr("height", y.rangeBand()) // bar width, using "y" function
	
labels.selectAll("text")
	.data(data)
	.enter().append("text")
	.attr("class","labeltext")
	.attr("x", 0)
	.attr("y", function(d) { return y(d.name); }) // bar y-position (uses function "y" from above to map to range)
    .attr("dy", y.rangeBand()/2)
    .text(function(d) { return d.name});

//
// BAR CHART 
//
	
var xAxis = d3.svg.axis() // axis function
    .scale(x)
    .orient("top");

var tip = d3.tip() // tooltips function. must be called within svg.
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+ d.name +"</strong><br><span style='color:red'>" + d.value + "</span>";
  }) 
  
// Append SVG box for bar chart with specified margin, width, and height. 
  
var barchart = d3.select("body").append("svg") 
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.call(tip); //call tooltip function
 
//eventually build out to call full csv file
//d3.csv("Book2.csv", type, function(error, data) {



//add bar chart functionality
barchart.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; }) // set classes using ternary operator on comparison to 0
	.attr("x", function(d) { return x(Math.min(0, d.value)); }) // bar x-position. either 0 (for positive numbers) or the value of the number (for negative numbers)
	.attr("y", function(d) { return y(d.name); }) // bar y-position (uses function "y" from above to map to range)
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
	  
//});

/* function type(d) {
  d.value = +d.value;
  return d;
} */
