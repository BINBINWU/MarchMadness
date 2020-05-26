var margin = {top: 20, right: 50, bottom: 20, left: 50},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var formatDecimalComma = d3.format(",.2f")

var parseDate=d3.timeParse("%Y")
var formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%S.%LZ")
var formatTime2 = d3.timeFormat("%Y")
var parseDate2=d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")
d3.csv("RegularSeasonDetailed.csv").then(function(data) {
                                         
                                         //first format data by making the sales column into numeric value
                                         data.forEach(function(d) {
                                                      d.WFGM = +d.WFGM;
                                                      d.WFGA = +d.WFGA;
                                                      d.WFGM3 = +d.WFGM3;
                                                      d.WFGA3 = +d.WFGA3;
                                                      d.WOR = +d.WOR;
                                                      d.WDR = +d.WDR;
                                                      d.Season = formatTime(parseDate(d.Season));
                                                      });
                                         
                                         
                                         var expensesWFGM3 = d3.nest()
                                         .key(function(d) { return d.Season; })
                                         .rollup(function(v) {
                                                 return{
                                                 p1:d3.mean(v, function(d) { return d.WFGM3; }),
                                                 p2:d3.mean(v, function(d) { return d.WFGA3; })
                                                 };
                                                 
                                                 })
                                         
                                         .entries(data);
                                         //                                                 //group by function
                                         //                                                 var expensesWFGM3 = d3.nest()
                                         //                                                 .key(function(d) { return d.Season; })
                                         //                                                 .rollup(function(v) { return d3.mean(v, function(d) { return d.WFGA3; }); })
                                         //                                                 .entries(data);
                                         
                                         console.log(JSON.stringify(expensesWFGM3));
                                         expensesWFGM3.forEach(function(d) {
                                                               d.key = parseDate2(d.key);
                                                               });
                                         console.log(JSON.stringify(expensesWFGM3));
                                         
                                         
                                         
                                         
                                         //set x and y ranges for the axis
                                         var y = d3.scaleLinear()
                                         //                        .domain([0, d3.max(data,function(d) { return d.WFGM;})])
                                         .range([height, 10])
                                         
                                         var x = d3.scaleTime()
                                         //                        .domain(d3.map(data,function(d) { return d.TeamName_W;}))
                                         .range([0,width])
                                         
                                         
                                         
                                         //                                                 var sortedData = expensesWFGM3.sort(function(a,b){
                                         //                                                                                     return b.value - a.value;
                                         //                                                                                     });
                                         
                                         //if you want to just keep top three
                                         //                                                 sortedData = sortedData.filter(function(d,i){
                                         //                                                                                return i < 10;
                                         //                                                                                });
                                         x.domain(d3.extent(expensesWFGM3,function(d) { return d.key; }));
                                         y.domain([0, d3.max(expensesWFGM3, function(d) { return d.value.p2; })]);
                                         
                                         var line1 = d3.line()
                                         .x(function(d) { return x(d.key); })
                                         .y(function(d) { return y(d.value.p1); })
                                         
                                         var line2 = d3.line()
                                         .x(function(d) { return x(d.key); })
                                         .y(function(d) { return y(d.value.p2); })
                                         
                                         // Define the div for the tooltip
                                         var div = d3.select("#svgcontainer3").append("div")
                                         .attr("class", "tooltip")
                                         .style("opacity", 0);
                                         
                                         var svg = d3.select("#svgcontainer3").append("svg")
                                         .call(d3.zoom().on("zoom", function () {
                                                            svg.attr("transform", d3.event.transform)
                                                            }))
                                         .append("g")
                                         
                                         svg.append("path")
                                         .datum(expensesWFGM3)
                                         .attr("class", "line")
                                         .attr("d", line1)
                                         .style("stroke", "red")
                                         .attr("transform", "translate( " + margin.left + ",  0)");
                                         
                                         svg.append("path")
                                         .datum(expensesWFGM3)
                                         .attr("class", "line")
                                         .attr("d", line2)
                                         .style("stroke", "blue")
                                         .attr("transform", "translate( " + margin.left + ",  0)");
                                         
                                         // Add the scatterplot for p2
                                         svg.selectAll("dot")
                                         .data(expensesWFGM3)
                                         .enter().append("circle")
                                         .attr("transform", "translate( " + margin.left + ",  0)")
                                         .attr("r", 5)
                                         .attr("cx", function(d) { return x(d.key); })
                                         .attr("cy", function(d) { return y(d.value.p2); })
                                         .on("mouseover", function(d) {
                                             div.transition()
                                             .duration(200)
                                             .style("opacity", .9);
                                             div    .html(formatTime2(d.key) + "<br/>"  + formatDecimalComma(d.value.p2))
                                             .style("left", (d3.event.pageX) + "px")
                                             .style("top", (d3.event.pageY - 28) + "px");
                                             })
                                         .on("mouseout", function(d) {
                                             div.transition()
                                             .duration(500)
                                             .style("opacity", 0);
                                             });
                                         
                                         // Add the scatterplot for p1
                                         svg.selectAll("dot")
                                         .data(expensesWFGM3)
                                         .enter().append("circle")
                                         .attr("transform", "translate( " + margin.left + ",  0)")
                                         .attr("r", 5)
                                         .attr("cx", function(d) { return x(d.key); })
                                         .attr("cy", function(d) { return y(d.value.p1); })
                                         .on("mouseover", function(d) {
                                             div.transition()
                                             .duration(200)
                                             .style("opacity", .9);
                                             div    .html(formatTime2(d.key) + "<br/>"  + formatDecimalComma(d.value.p1))
                                             .style("left", (d3.event.pageX) + "px")
                                             .style("top", (d3.event.pageY - 28) + "px");
                                             })
                                         .on("mouseout", function(d) {
                                             div.transition()
                                             .duration(500)
                                             .style("opacity", 0);
                                             });

                                         
                                         // Add the X Axis
                                         svg.append("g")
                                         .attr("class", "axisWhite")
                                         .attr("transform", "translate(" + margin.left + "," + height + ")")
                                         .call(d3.axisBottom(x).ticks(8));
                                         
                                         
                                         
                                         // text label for the x axis
                                         svg.append("text")
                                         .attr("transform",
                                               "translate(" + (width/2) + " ," +
                                               (height + margin.top + 20) + ")")
                                         .style("text-anchor", "middle")
                                         .text("Year")
                                         .style("fill","black");
                                         
                                         // Add the Y Axis
                                         svg.append("g")
                                         .attr("class", "axisWhite")
                                         .attr("transform", "translate(" + margin.left + ",0)")
                                         .call(d3.axisLeft(y).ticks(6));
                                         
                                         
                                         // text label for the y axis
                                         svg.append("text")
                                         .attr("transform", "rotate(-90)")
                                         .attr("y", 0+(margin.left/3))
                                         .attr("x", 0-(height / 2))
                                         .attr("yd", "1em")
                                         .style("text-anchor", "middle")
                                         .text("3-Point Shots ")
                                         .style("fill","black");
                                         
                                         svg.append("text")
                                         .attr("transform", "translate(" + width + "," + 10 + ")")
                                         .attr("dx", "-6em")
                                         .attr("dy", ".25em")
                                         .attr("text-anchor", "start")
                                         .style("fill", "blue")
                                         .text("3-Point Attempts");
                                         
                                         svg.append("text")
                                         .attr("transform", "translate(" + width + "," + 170 + ")")
                                         .attr("dx", "-5em")
                                         .attr("dy", "2.95em")
                                         .attr("text-anchor", "start")
                                         .style("fill", "red")
                                         .text("3-Point Makes");
                                         
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
