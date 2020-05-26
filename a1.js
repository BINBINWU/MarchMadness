var margin = {top: 20, right: 50, bottom: 20, left: 50},
width = 900 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var formatPercent = d3.format(",.2%")

var svg = d3.select("#svgcontainer1")
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")


// get the data
d3.csv("RegularSeasonDetailed.csv").then(function(data) {
                                         
                                         //first format data by making the sales column into numeric value
                                         data.forEach(function(d) {
                                                      d.WFGM = +d.WFGM;
                                                      d.WFGA = +d.WFGA;
                                                      d.WFGM3 = +d.WFGM3;
                                                      d.WFGA3 = +d.WFGA3;
                                                      d.WOR = +d.WOR;
                                                      d.WDR = +d.WDR;
                                                      
                                                      });
                                         
                                         //group by function
                                         var expensesWFGM = d3.nest()
                                         .key(function(d) { return d.TeamName_W; })
                                         .rollup(function(v) {
                                                 return{
                                                 p1:d3.sum(v, function(d) { return d.WFGM; }),
                                                 p2:d3.sum(v, function(d) { return d.WFGA; })
                                                 };
                                                 
                                                 })
                                         
                                         .entries(data);
                                         //console.log(JSON.stringify(expensesWFGM))
                                         
                                         var div = d3.select("#svgcontainer1").append("div")
                                         .attr("class", "tooltip")
                                         .style("opacity", 0);
                                         
                                         //set x and y ranges for the axis
                                         var y = d3.scaleLinear()
                                         //                        .domain([0, d3.max(data,function(d) { return d.WFGM;})])
                                         .range([height, 10])
                                         
                                         var x = d3.scaleLinear()
                                         //                        .domain(d3.map(data,function(d) { return d.TeamName_W;}))
                                         .range([0,width])
                                         
                                         
                                         
                                         //                                                 var sortedData = expensesWFGM.sort(function(a,b){
                                         //                                                                                    return b.value.p1 - a.value.p1;
                                         //                                                                                    });
                                         
                                         //if you want to just keep top three
                                         //                                                 sortedData = sortedData.filter(function(d,i){
                                         //                                                                                return i < 10;
                                         //                                                                                });
                                         //x.domain([0, d3.max(expensesWFGM, function(d) { return d.value.p1; })]);
                                         x.domain([0, 5000]);
                                         y.domain([0, d3.max(expensesWFGM, function(d) { return d.value.p2; })]);
                                         
                                         var svg = d3.select("#svgcontainer1").append("svg")
                                         
                                         var barGroup = svg.append("g")
                                         .attr("class", "circle")
                                         .attr("transform", "translate( " + margin.left + ",  0)");
                                         
                                         
                                         barGroup.selectAll("circle")
                                         .data(expensesWFGM)
                                         .enter().append("circle")
                                         .attr("cx",function(d,i){ return x(d.value.p1); })
                                         .attr("cy",function(d,i){ return y(d.value.p2); })
                                         .attr("r",2)
                                         .attr("fill","black")
                                         
//                                         .on("mousemove", function(d){
//                                             tooltip
//                                             .style("left", d3.event.pageX - 50 + "px")
//                                             .style("top", d3.event.pageY - 70 + "px")
//                                             .style("display", "inline-block")
//                                             .html((d.key) + "<br>" + (d.value.p2));
//                                             })
//                                         .on("mouseout", function(d){ tooltip.style("display", "none");});
                                         .on("mouseover", function(d) {
                                             div.transition()
                                             .duration(200)
                                             .style("opacity", .9);
                                             div    .html(d.key + "<br/>"  + formatPercent(d.value.p1/d.value.p2))
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
                                         .call(d3.axisBottom(x).ticks(8))
                                         .attr("opacity", "0");
                                         
                                         
                                         
                                         // text label for the x axis
                                         svg.append("text")
                                         .attr("transform",
                                               "translate(" + (width/2) + " ," +
                                               (height + margin.top + 20) + ")")
                                         .style("text-anchor", "middle")
                                         .text("Shot Makes")
                                         .style("fill","black");
                                         
                                         // Add the Y Axis
                                         svg.append("g")
                                         .attr("class", "axisWhite")
                                         .attr("transform", "translate(" + margin.left + ",0)")
                                         .call(d3.axisLeft(y).ticks(6));
                                         
                                         
                                         // text label for the y axis
                                         svg.append("text")
                                         .attr("transform", "rotate(-90)")
                                         .attr("y", 60+(margin.left/3))
                                         .attr("x", 0-(height / 2))
                                         .attr("yd", "1em")
                                         .style("text-anchor", "middle")
                                         .text("Shot Attempts")
                                         .style("fill","black");
                                         
                                         
                                         
                                         x.domain([0, d3.max(expensesWFGM, function(d) { return d.value.p1; })]);
                                         svg.select(".axisWhite")
                                         .transition()
                                         .duration(8000)
                                         .attr("opacity", "1")
                                         .call(d3.axisBottom(x));
                                         
                                         svg.selectAll("circle")
                                         .transition()
                                         .delay(function(d,i){return(i*10)})
                                         .duration(8000)
                                         .attr("cx", function (d) { return x(d.value.p1); } )
                                         .attr("cy", function (d) { return y(d.value.p2); } )
                                         
                                         function updatePlot() {
                                         
                                         // Get the value of the button
                                         xlim = this.value
                                         
                                         // Update X axis
                                         x.domain([0,xlim])
                                         svg.select(".axisWhite")
                                         .transition().duration(1000).call(d3.axisBottom(x))
                                         
                                         // Update chart
                                         svg.selectAll("circle")
                                         .data(expensesWFGM)
                                         .transition()
                                         .duration(1000)
                                         .attr("cx", function (d) { return x(d.value.p1); } )
                                         .attr("cy", function (d) { return y(d.value.p2); } )
                                         }

                                         // Add an event listener to the button created in the html part
                                         d3.select("#buttonXlim").on("input", updatePlot )
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
