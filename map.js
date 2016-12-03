
function Map(){

    var self = this;
    self.init();
};

Map.prototype.init = function(){
    var self = this;
    
    var divMap = d3.select("#map1").classed('maps', true);
    self.margin = {top: 30, right: 10, bottom: 30, left: 10};

    var svgBounds = divMap.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;

    self.svg = divMap.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

Map.prototype.tooltip_render = function(tooltip_data3) {
    var self = this;
    var format = d3.format(",.0f");

    var text = "<div style='width:75%; float:left;'><h3>Projected Annual Openings for " + tooltip_data3.OCC_TITLE + " in " + tooltip_data3.STATE + ": </h3></div>";
    text += "<div style='width:25%; float:right;'><p style='text-align: center' class = 'tipNumber'>" + format(+tooltip_data3["Average Annual Openings"]) + "</p></div>";
    return text;
}

Map.prototype.update = function(mapdata, occdata, occSelection){
    var self = this;
    self.maxColumns = 12;
    self.maxRows = 8;

   var occfilteredoccdata = occdata
        .filter(function(d) {
            return ((d["OCC_CODE"] == "" + occSelection + "") && (d.ST != "USA"));
        });
    
    var max = d3.max(occfilteredoccdata, function (d){
        return +d["Average Annual Openings"];
    });

    var domain = [0, max];

    var range = ['#e5f5e0','#238b45'];

    self.colorScale = d3.scaleLinear()
        .domain(domain).range(range);

    tip3 = d3.tip().attr('class', 'd3-tip')
        .direction('ne')
        .offset(function() {
            return [0,0];
        })
        .html(function (d) {
            tooltip_data3 = d;
            var html = Map.prototype.tooltip_render(tooltip_data3);
            return html;
        });

    d3.select("#map1 > svg").selectAll("g").remove();
    var rectGroup = d3.select("#map1 > svg").selectAll("g").data(mapdata);
    rectGroup.exit().remove;
    var rectEnter = rectGroup.enter().append("g").merge(rectGroup)
        .each(joinOccData);
    rectEnter.call(tip3);

    function joinOccData(d){
        var stateTile = d3.select(this).selectAll('rect')
            .data(occfilteredoccdata.filter(function(D){return D.ST == d.ST_ABR }))
            .enter()
            .append('rect')
            .classed('stateTiles', true)
            .attr("y", function(D){
            return (D.Row)*(self.svgHeight/self.maxRows);
            })
            .attr("x", function(D){
                return (D.Space)*(self.svgWidth/self.maxColumns);
            }).attr("width", function(d){
                return (self.svgWidth/self.maxColumns);
            })
            .attr("height", function(d){
                return (self.svgHeight/self.maxRows);
            })
            .attr("class", function(d){
                return ("tile");
            })
            .attr('fill', function(D){
                if (typeof D.STATE != 'undefined'){
            return self.colorScale(+D["Average Annual Openings"]);
                }
                else return self.colorScale(0);
            })
            .on('mouseover', tip3.show)
            .on('mouseout', tip3.hide)


    };

    rectEnter
        .append("text")
        .attr("y", function(d){
            return ((d.Row)*(self.svgHeight/self.maxRows))+((self.svgHeight/self.maxRows)*(2/3));
        })
        .attr("x", function(d,i){
            return ((d.Space)*(self.svgWidth/self.maxColumns))+((self.svgWidth/self.maxColumns)/2);
        })
        .text(function(d,i){
            return d.ST_ABR ;
        })
        .attr("class", "tilestext")
;
    
    self.svg.append('g')
        .attr('class', 'shadeLegend')
        .attr("transform",
            "translate(200,10)");

    var legend2 = d3.legendColor()
        .scale(self.colorScale)
        .orient('horizontal')
        .shape('rect')
        .shapeHeight('30')
        .shapeWidth('30')
        .shapePadding('15')
        .labelFormat(d3.format(",.0f"))
        ;

    self.svg.select(".shadeLegend")
        .call(legend2);

    function callTip(){
        d3.selectAll('.stateTiles').call(tip3);
    }

};
