var margin = {top: 20, right: 50, bottom: 20, left: 50},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var formatDecimalComma = d3.format(",.2f")

var y = d3.scaleLinear()
//                        .domain([0, d3.max(data,function(d) { return d.WFGM;})])
.range([height, 10])

var x = d3.scaleBand()
//                        .domain(d3.map(data,function(d) { return d.TeamName_W;}))
.range([0,width])
.padding(0.4);




var div = d3.select("#svgcontainer2").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var svg = d3.select("#svgcontainer2").append("svg")




var xAxis =  svg.append("g")
.attr("class", "axisWhite")
.attr("transform", "translate(" + margin.left + "," + height + ")")
//.call(d3.axisBottom(x).ticks(8)).selectAll("text")
//.attr("dy", "1.2em")
//.attr("transform", "rotate(20)");

var yAxis = svg.append("g")
.attr("class", "axisWhite")
.attr("transform", "translate(" + margin.left + ",0)")
//.call(d3.axisLeft(y).ticks(6));


function update(selectedVar) {
    d3.csv("RegularSeasonDetailed.csv").then(function(data) {
                                             
                                             //first format data by making the sales column into numeric value
                                             data.forEach(function(d) {
                                                          d.value = +d[selectedVar];
                                                          //d.WDR = +d.WDR;
                                                          });
                                             
                                             //group by function
                                             var expensesWRB = d3.nest()
                                             .key(function(d) { return d.TeamName_W; })
                                             .rollup(function(v) {
                                                     return{
                                                     p1:d3.mean(v, function(d) { return d.value; })
                                                     //p2:d3.mean(v, function(d) { return d.WDR; })
                                                     };
                                                     
                                                     })
                                             
                                             .entries(data);
                                             //                                                 //group by function
                                             //                                                 var expensesWFGM3 = d3.nest()
                                             //                                                 .key(function(d) { return d.TeamName_W; })
                                             //                                                 .rollup(function(v) { return d3.sum(v, function(d) { return d.WFGM3; }); })
                                             //                                                 .entries(data);
                                             
                                             
                                             //set x and y ranges for the axis
                                             
                                             
                                             
                                             
                                             var sortedData = expensesWRB.sort(function(a,b){
                                                                               return b.value.p1 - a.value.p1;
                                                                               });
                                             
                                             //if you want to just keep top three
                                             sortedData = sortedData.filter(function(d,i){
                                                                            return i < 10;
                                                                            });
                                             x.domain(sortedData.map(function(d) { return d.key; }));
                                             xAxis.transition().duration(1000).call(d3.axisBottom(x)
                                             .ticks(8)).selectAll("text")
                                             .attr("dy", "1.2em")
                                             .attr("transform", "rotate(20)");
                                             y.domain([0, d3.max(sortedData, function(d) { return d.value.p1; })]);
                                             yAxis.transition().duration(1000).call(d3.axisLeft(y));
                                             
                                            
                                             
                                             
                                             var u = svg.selectAll("rect")
                                             .data(sortedData)
                                             .on("mouseover", function(d) {
                                                 div.transition()
                                                 .duration(200)
                                                 .style("opacity", .9);
                                                 div    .html((d.key) + "<br/>"  + formatDecimalComma(d.value.p1))
                                                 .style("left", (d3.event.pageX) + "px")
                                                 .style("top", (d3.event.pageY - 28) + "px");
                                                 })
                                             .on("mouseout", function(d) {
                                                 div.transition()
                                                 .duration(500)
                                                 .style("opacity", 0);
                                                 });
                                             
                                             u
                                             .enter().append("rect")
                                             .merge(u)
                                             .transition()
                                             .duration(2000)
                                             .attr("class", "bar")
                                             .attr("transform", "translate( " + margin.left + ",  0)")
                                             .attr("x",function(d){ return x(d.key); })
                                             .attr("y",function(d){ return y(d.value.p1); })
                                             .attr("fill","#add8e6")
                                             .attr("width", x.bandwidth())
                                             .attr("height", function(d) { return height - y(d.value.p1); })
                                             
                                             //                                         .transition()
                                             //                                         .duration(12000)
                                             //                                         .attr("y",function(d,i){return y(d.value.p1);})
                                             //                                         .attr("height",function(d,i){return height-y(d.value.p1);})
                                             //                                         .on("mouseover", function(d) {
                                             //                                             div.transition()
                                             //                                             .duration(200)
                                             //                                             .style("opacity", .9);
                                             //                                             div    .html((d.key) + "<br/>"  + formatDecimalComma(d.value.p1))
                                             //                                             .style("left", (d3.event.pageX) + "px")
                                             //                                             .style("top", (d3.event.pageY - 28) + "px");
                                             //                                             })
                                             //                                         .on("mouseout", function(d) {
                                             //                                             div.transition()
                                             //                                             .duration(500)
                                             //                                             .style("opacity", 0);
                                             //                                             });
                                             
                                             // Add the X Axis
                                             
                                             
                                             
                                             
                                             // text label for the x axis
                                             svg.append("text")
                                             .attr("transform",
                                                   "translate(" + (width/2) + " ," +
                                                   (height + margin.top + 20) + ")")
                                             .style("text-anchor", "middle")
                                             .text("Team")
                                             .style("fill","black");
                                             
                                             // Add the Y Axis
                                             
                                             
                                             
                                             // text label for the y axis
                                             svg.append("text")
                                             .attr("transform", "rotate(-90)")
                                             .attr("y", 0+(margin.left/3))
                                             .attr("x", 0-(height / 2))
                                             .attr("yd", "1em")
                                             .style("text-anchor", "middle")
                                             .text("Rebounds")
                                             .style("fill","black");
                                             
                                             
                                           
                                             //                                                 svg.append("text")
                                             //                                                 .attr("transform", "translate(" + 0 + "," + 400  + ")")
                                             //                                                 .style("fill", "black")
                                             //                                                 .text("For most cars, The bigger Horsepower the smaller MPG is.");
                                             //
                                             //
                                             //                                                 svg.append("text")
                                             //                                                 .attr("transform", "translate(" + 0 + "," + 420  + ")")
                                             //                                                 .style("fill", "black")
                                             //                                                 .text("There are a few outliers from the Dataset.");
                                             });

}
// Initialize plot
update('WOR')
