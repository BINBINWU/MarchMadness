var margin = {top: 20, right: 50, bottom: 20, left: 50},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var formatDecimalComma = d3.format(",.2f")

d3.csv("RegularSeasonDetailed.csv").then(function(data) {
                                         
                                         //first format data by making the sales column into numeric value
                                         data.forEach(function(d) {
                                                      d.margin = +d.margin;
                                                      });
                                         
                                         
                                         //group by function
                                         var expensesWM = d3.nest()
                                         .key(function(d) { return d.TeamName_W; })
                                         .rollup(function(v) { return d3.mean(v, function(d) { return d.margin; }); })
                                         .entries(data);
                                         
                                         var div = d3.select("#svgcontainer4").append("div")
                                         .attr("class", "tooltip")
                                         .style("opacity", 0);
                                         //set x and y ranges for the axis
                                         var y = d3.scaleLinear()
                                         //                        .domain([0, d3.max(data,function(d) { return d.WFGM;})])
                                         .range([height, 10])
                                         
                                         var x = d3.scaleBand()
                                         //                        .domain(d3.map(data,function(d) { return d.TeamName_W;}))
                                         .range([0,width])
                                         .padding(1.1);
                                         
                                         
                                         
                                         var sortedData = expensesWM.sort(function(a,b){
                                                                          return b.value - a.value;
                                                                          });
                                         
                                         //if you want to just keep top three
                                         sortedData = sortedData.filter(function(d,i){
                                                                        return i < 10;
                                                                        });
                                         x.domain(sortedData.map(function(d) { return d.key; }));
                                         y.domain([0, d3.max(sortedData, function(d) { return d.value; })]);
                                         
                                         var svg = d3.select("#svgcontainer4").append("svg")
                                         
                                         var lineGroup = svg.append("g")
                                         .attr("class", "line")
                                         .attr("transform", "translate( " + margin.left + ",  0)");
                                         
                                         var cGroup = svg.append("g")
                                         .attr("class", "circle")
                                         .attr("transform", "translate( " + margin.left + ",  0)");
                                         
                                         
//                                         barGroup.selectAll(".rect")
//                                         .data(sortedData)
//                                         .enter().append("rect")
//                                         .attr("class", "bar")
//                                         .attr("x",function(d){ return x(d.key); })
//                                         .attr("y",function(d){ return y(d.value); })
//                                         .attr("fill","black")
//                                         .attr("width", x.bandwidth())
//                                         .attr("height", function(d) { return height - y(d.value); })
                                         lineGroup.selectAll(".line")
                                         .data(sortedData)
                                         .enter()
                                         .append("line")
                                         .attr("y1", function(d) { return y(d.value); })
                                         .attr("y2", y(0))
                                         .attr("x1", function(d) { return x(d.key); })
                                         .attr("x2", function(d) { return x(d.key); })
                                         .attr("stroke", "grey")
                                         
                                         cGroup.selectAll(".circle")
                                         .data(sortedData)
                                         .enter()
                                         .append("circle")
                                         .attr("cx", function(d) { return x(d.key); })
                                         .attr("cy", function(d) { return y(d.value); })
                                         .attr("r", "10")
                                         .style("fill", "#69b3a2")
                                         .attr("stroke", "black")
                                         
                                         .on("mouseover", function(d) {
                                             div.transition()
                                             .duration(200)
                                             .style("opacity", .9);
                                             div    .html((d.key) + "<br/>"  + formatDecimalComma(d.value))
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
                                         .call(d3.axisBottom(x).ticks(8)).selectAll("text")
                                         .attr("dy", "1.1em")
                                         .attr("transform", "rotate(20)");
                                         
                                         
                                         
                                         // text label for the x axis
                                         svg.append("text")
                                         .attr("transform",
                                               "translate(" + (width/2) + " ," +
                                               (height + margin.top + 20) + ")")
                                         .style("text-anchor", "middle")
                                         .text("Team")
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
                                         .text("Win Margin")
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

