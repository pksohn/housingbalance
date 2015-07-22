
d3.csv("HousingBalance.csv", function(d) {
  return {
    district: d["BoS Districts"],
    new_affordable: +d["New Affordable Housing Built"],
    acquisitions: +d["Acquisitions & Rehabs Completed"],
	removed_protected: +d["Units Removed from Protected Status"],
	entitled_affordable: +d["Total Entitled Affordable Units Permitted"],
	rad: +d["Planned RAD Units"],
	net_affordable: +d["Net Affordable Housing Stock"],
	total_new: +d["Total Net New Units Built"],
	total_entitled: +d["Total Entitled Units"],
    balance: +d["Housing Balance"] 
  };

}, function(d) {
  console.log(d[0]);
}, function(error, rows) {
  console.log(rows);
});


