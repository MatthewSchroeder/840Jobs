
function DemandChart(occdata, clusterSelection, stateSelection, clusterChart, distChart) {
    var self = this;

    self.occdata = occdata;
    self.clusterChart = clusterChart;
    self.distChart = distChart;
    self.init();
};


DemandChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 0, bottom: 30, left: 0};
    var divdemandChart = d3.select("#demandChart").classed("oChart", true);

    self.svgBounds = divdemandChart.node().getBoundingClientRect();
    self.svgWidth = 300;//self.svgBounds.width - self.margin.left - self.margin.right);
    self.svgHeight = 200;


    self.svg = d3.select('#demandChart').append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);
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

DemandChart.prototype.occbars_render = function(hoverData){
    var self = this;
    var margin = {top: 50, right: 0, bottom: 10, left: 30};
    var width = self.svgWidth - 50,
        maxBarHeight = 100;

self.svg
    .append('g')
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .append('rect')
        .attr("class", "wageBar")
        .attr('x', hoverData >= (d3.max(self.data)/10) ? self.xw(d3.max(self.data)/10) : self.xw(hoverData))
        .attr('y', -110)
        .attr('width', 3)
        .attr('fill', 'black')
        .attr('height', 110)
        .attr("transform", "translate(0," + maxBarHeight + ")");

    d3.select('.demandChart').append('text')
        .attr("class", "wageLabel")
        .attr('x', self.xw(10000))
        .attr('y', -50)
        .attr('dy', 0)
        .text(d3.format(",.0f")(hoverData))
        .attr("transform", "translate(0," + maxBarHeight + ")");
}

DemandChart.prototype.occbars_out = function(){
    var self = this;

    d3.select('.wageBar').remove();
    d3.select('.wageLabel').remove();

}


DemandChart.prototype.update = function(occdata, clusterSelection, stateSelection, minWage, maxWage, clusterChart, distChart) {
    var self = this;
    var margin = {top: 50, right: 0, bottom: 10, left: 30};
    //console.log(stateSelection);

    var width = self.svgWidth - 50,
        height = self.svgHeight,
        chartHeight = 200,
        padding = 5, // separation between same-color circles
        clusterPadding = 8, // separation between different-color circles
        maxBarHeight = 100;


    var filteredoccdata = occdata
        .filter(function (d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed"));
        });

    self.data = [];
    filteredoccdata.map(function (d) {
        self.data.push(+d["Average Annual Openings"]);
    });
    //console.log(self.data);

    var formatCount = d3.format(",.0f");

    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var group = self.svg.append("g")
        .attr("class", 'demandChart')
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    self.xw = d3.scaleLinear()
        .domain([0,(d3.max(self.data)/10)])
        .rangeRound([0, width]);

   // console.log(d3.max(self.data));

    var xwReverse = d3.scaleLinear()
        .domain([0, width])
        .rangeRound([0, (d3.max(self.data)/10)]);

    var thresholds = d3.range(0, d3.max(self.data)/10, (d3.max(self.data)/10)/((d3.max(self.data)/10) > 200 ? 20:((d3.max(self.data)/10) > 100 ? 10:5)));
    //console.log(thresholds);
    // group the data for the bars
    var bins = d3.histogram()
        .domain([0,d3.max(self.data)])
        .thresholds(thresholds)//(5000), xw(10000), xw(15000), xw(20000), xw(25000), xw(30000), xw(35000), xw(40000), xw(45000), xw(50000), xw(55000), xw(60000), xw(65000), xw(70000), xw(75000), xw(80000), xw(85000), xw(90000), xw(95000), xw(100000))
        (self.data);

    //console.log(bins);


    var yw = d3.scaleLinear()
        .domain([0, d3.max(bins, function (d) {
            return d.length;
        })])
        .range([maxBarHeight, 0]);

    var totalData = occdata
        .filter(function (d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "total"));
        });
    var avgAnnOpenings = d3.median(self.data);//totalData[0]["Average Annual Openings"]/data.length;

    //console.log(totalData[0]["Average Annual Openings"]);
    //console.log(self.data.length);
    //console.log(avgAnnOpenings);

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
        .attr("width", self.xw(bins[0].x1) - self.xw(bins[0].x0))
        .attr('height', 0)
        .attr("transform", function (d) {
            return "translate(" + self.xw(d.x0) + "," + yw(d.length) + ")";
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
        .attr('x', self.xw(avgAnnOpenings))
        .attr('y', -110)
        .attr('width', 3)
        .attr('fill', 'black')
        .attr('height', 110)
        .attr("transform", "translate(0," + maxBarHeight + ")");

    var medianLabel = group.append('text')
        .attr("class", "medianLabel")
        .attr('x', self.xw(avgAnnOpenings))
        .attr('y', -130)
        .attr('dy', 0)
        .text("Median " + d3.format(",.0f")(avgAnnOpenings))
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


    self.svg.append("g")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([[30, 40], [self.svgWidth-20, 150]])
            .on("end", brushed)
        );


    function brushed() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var s = d3.event.selection;
       // console.log(xwReverse(s[0])-1800);
       // console.log(xwReverse(s[1])-1800);
        var minOpenings = self.xw.invert(s[0]-30),//-1800,
            maxOpenings = self.xw.invert(s[1]-30) >= 15000 ? 200000 : self.xw.invert(s[1]-30);

        console.log(minOpenings);
        console.log(maxOpenings);

        clusterChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, distChart, self)
        distChart.update(occdata, clusterSelection, stateSelection, minOpenings, maxOpenings, clusterChart, self)
    }









    // add the x Axis

    d3.selectAll('.wageAxis').remove();

    var xAxis = group.append("g")
        .attr('class', "wageAxis")
        .attr("transform", "translate(0," + maxBarHeight + ")")
        .call(d3.axisBottom(self.xw).ticks(5).tickFormat(function(d) {
            return d3.format(",.0f")(d);
        }));


   // xAxis.ticks(4);

    // add the y Axis
  //  g.append("g")
    //    .call(d3.axisLeft(yw))

};







