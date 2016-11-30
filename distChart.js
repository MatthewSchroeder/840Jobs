
function DistChart(occdata, clusterSelection, stateSelection, clusterChart, demandChart, growthChart) {
    var self = this;

    self.occdata = occdata;
    self.clusterChart = clusterChart;
    self.demandChart = demandChart;
    self.growthChart = growthChart;
    self.init();
};


DistChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 0, bottom: 30, left: 0};
    var divdistChart = d3.select("#distChart").classed("dChart", true);

    self.svgBounds = divdistChart.node().getBoundingClientRect();
    self.svgWidth = 400;//self.svgBounds.width - self.margin.left - self.margin.right);
    self.svgHeight = 190;


    self.svg = d3.select('#distChart').append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .attr('align', top);
        //.attr(("x", (self.svgBounds.width - self.margin.left - self.margin.right)-self.svgWidth));
};


/**YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}**/

DistChart.prototype.occbars_render = function(hoverData){
    var self = this;
    var margin = {top: 50, right: 0, bottom: 10, left: 130};
    var width = self.svgWidth - 150,
        maxBarHeight = 100;

    var xw = d3.scaleLinear()
        .domain([0, 100000])
        .rangeRound([0, width]);

self.svg
    .append('g')
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .append('rect')
        .attr("class", "wageBar")
        .attr('x', hoverData >= 100000 ? xw(100000) : xw(hoverData))
        .attr('y', -110)
        .attr('width', 3)
        .attr('fill', 'black')
        .attr('height', 110)
        .attr("transform", "translate(0," + maxBarHeight + ")");

    self.svg.append('text')
        .attr("class", "wageLabel")
        .attr('x', 65)
        .attr('y', 110)
        .attr('dy', 0)
        .text("$" + d3.format(".2s")(hoverData));
        //.attr("transform", "translate(0," + maxBarHeight + ")");
}

DistChart.prototype.occbars_out = function(){
    var self = this;

    d3.select('.wageBar').remove();
    d3.select('.wageLabel').remove();

}


DistChart.prototype.update = function(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, demandChart, growthChart) {
    var self = this;
    var margin = {top: 50, right: 0, bottom: 10, left: 130};
   // console.log(stateSelection);

    var width = self.svgWidth - 150,
        height = self.svgHeight,
        chartHeight = 200,
        padding = 5, // separation between same-color circles
        clusterPadding = 8, // separation between different-color circles
        maxBarHeight = 100;


    var filteredoccdata = occdata
        .filter(function (d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed"));
        });

    var data = [];
    filteredoccdata.map(function (d) {
        data.push(+d["A_MEDIAN"]);
    });

    var formatCount = d3.format(",.0f");

    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var group = self.svg.append("g")
        .attr("class", 'wageChart')
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    var xw = d3.scaleLinear()
        .domain([0, 100000])
        .rangeRound([0, width]);

    var xwReverse = d3.scaleLinear()
        .domain([0, width])
        .rangeRound([0, 100000]);

    var thresholds = d3.range(0, 100000, 5000)
   // console.log(thresholds);
    // group the data for the bars
    var bins = d3.histogram()
        .domain([0,200000])
        .thresholds(thresholds)//(5000), xw(10000), xw(15000), xw(20000), xw(25000), xw(30000), xw(35000), xw(40000), xw(45000), xw(50000), xw(55000), xw(60000), xw(65000), xw(70000), xw(75000), xw(80000), xw(85000), xw(90000), xw(95000), xw(100000))
        (data);
   // console.log(bins);

    var yw = d3.scaleLinear()
        .domain([0, d3.max(bins, function (d) {
            return d.length;
        })])
        .range([maxBarHeight, 0]);

    var totalData = occdata
        .filter(function (d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "total"));
        });
    var median = totalData[0].A_MEDIAN;

    //console.log(median);

    self.svg.selectAll('rect').transition().duration(2000).attr('opacity', 0).remove();
    self.svg.selectAll('text').transition().duration(2000).attr('opacity', 0).remove();

    var bar = group.selectAll('.bar').data(bins);/*, function (d) {
            return d;
        });*/

    // append the bar rectangles to the svg element
    var barEnter = bar.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("width", xw(bins[0].x1) - xw(bins[0].x0) - 1)
        .attr('height', 0)
        .attr("transform", function (d) {
            return "translate(" + xw(d.x0) + "," + yw(d.length) + ")";
        })
        .transition()
        .duration(3000)
        .attr("height", function (d) {
            return maxBarHeight - yw(d.length);
        });

    bar.transition()
        .duration(3000)
        .attr("height", function (d) {
            return maxBarHeight - yw(d.length);
        });

    bar.exit()
        .attr('opacity',1)
        .transition()
        .duration(3000)
        .attr('opacity', 0)
        .remove();

    var medianBar = group.append('rect')
        .attr("class", "medianBar")
        .attr('x', xw(median))
        .attr('y', -110)
        .attr('width', 3)
        .attr('fill', 'black')
        .attr('height', 110)
        .attr("transform", "translate(0," + maxBarHeight + ")");

    var medianLabel = group.append('text')
        .attr("class", "medianLabel")
        .attr('x', xw(median))
        .attr('y', -130)
        .attr('dy', 0)
        .text("Median $" + d3.format(".2s")(median))
        .attr("transform", "translate(0," + maxBarHeight + ")")
        .call(wrap,50);



    function wrap(text, width) {
        text.each(function () {
            //console.log(this);
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr('x'),
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        })
    }

    self.svg.append('text')
        .attr("class", "title")
        .attr('x', 65)
        .attr('y', 40)
        .attr('dy', 0)
        .text("Median Wage");


    self.svg.append("g")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([[130, 40], [self.svgWidth-20, 150]])
            .on("end", brushed)
        );


    function brushed() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var s = d3.event.selection;
        var minWage = xw.invert(s[0]-130),
            maxWage = xw.invert(s[1]-130) >= 100000 ? 200000: xw.invert(s[1]-130);

      console.log(minWage);
      console.log(maxWage);

        clusterChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, demandChart, growthChart)
        demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, self, growthChart)
        growthChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, self, demandChart)
    }









    // add the x Axis
    var xAxis = group.append("g")
        .attr("transform", "translate(0," + maxBarHeight + ")")
        .call(d3.axisBottom(xw).ticks(5).tickFormat(function(d) {
            return "$" + d3.format(".2s")(d);
        }));

   // xAxis.ticks(4);

    // add the y Axis
  //  g.append("g")
    //    .call(d3.axisLeft(yw))

};







