
function Map(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
Map.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divMap = d3.select("#map1").classed('maps', true);
    //var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 10, bottom: 30, left: 10};

    var svgBounds = divMap.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    //var legendHeight = 150;

    //creates svg elements within the div
    /*self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")*/

    self.svg = divMap.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
/*Map.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}*/

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
Map.prototype.tooltip_render = function(tooltip_data3) {
    var self = this;
    console.log(tooltip_data3);
    var format = d3.format(",.0f");

    var text = "<div style='width:75%; float:left;'><h3>Projected Annual Openings for " + tooltip_data3.OCC_TITLE + " in " + tooltip_data3.STATE + ": </h3></div>";
    text += "<div style='width:25%; float:right;'><p style='text-align: center' class = 'tipNumber'>" + format(+tooltip_data3["Average Annual Openings"]) + "</p></div>";
   // text +=  "<h2 class = 'tooltip-title'>Projected Annual Openings in " +tooltip_data.STATE + ":  " + tooltip_data["Average Annual Openings"] + "</h2>";
    return text;
}


/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
Map.prototype.update = function(mapdata, occdata, occSelection){
    var self = this;
    console.log(mapdata);
    console.log(occdata);
    console.log(occSelection);

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = 12;//d3.max(electionResult,function(d){
                           //     return (parseInt(d["Space"]) + 1 );
                           // });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = 8;//d3.max(electionResult,function(d){
                      //          return (parseInt(d["Row"]) + 1);
                        //});
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart



             /* pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            /* html = TileChart.prototype.tooltip_render(tooltip_data)
            return html;
        });*/

    //Creates a legend element and assigns a scale that needs to be visualized
  //  self.legendSvg.append("g")
    //    .attr("class", "legendQuantile");

   var occfilteredoccdata = occdata
        .filter(function(d) {
            return ((d["OCC_CODE"] == "" + occSelection + "") && (d.ST != "USA"));
        });


    var max = d3.max(occfilteredoccdata, function (d){
        return +d["Average Annual Openings"];
    });
    console.log(max);


    //Domain definition for global color scale
    var domain = [0, max];

    //Color range for global color scale
    var range = ['#e5f5e0','#238b45'];//'#006d2c'];//'#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45',

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleLinear()
        .domain(domain).range(range);

    tip3 = d3.tip().attr('class', 'd3-tip')
        .direction('ne')
        .offset(function() {
            return [0,0];
        })
        .html(function (d) {
            console.log(d);
            //if (d.OCC_TITLE !== " ") {
            // ////console.log(d.I_Nominee_prop)
            tooltip_data3 = d; /*{
             "State": d.STATE,
             "Occupation Title": d.OCC_TITLE,
             "Occupation Code": d.OCC_CODE,
             "Median Annual Wage": +d.A_MEDIAN,
             "Base Year": d['Base Year']
             "Base Year Employment": +d.BASE_EMP,
             "Projection Year": d.PROJECTION_YEAR,
             "Projection Year Employment": +d.PROJECTION_EMP,
             "Projected 10-Year Growth": +d.PERCENT_CHANGE,
             "Projected Annual Openings": +d.AVG_ANN_OPENINGS,
             "Major Group": d.MAJOR_GROUP,
             "Job Description": d.JOB_DESCR,
             "Typical Education Required": d.EDUCATION,
             "Job Training": d.TRAINING,
             "Work Experience": d.EXPERIENCE,
             "STEM": d.STEM
             }*/

            var html = Map.prototype.tooltip_render(tooltip_data3);
            return html;
        });




    d3.select("#map1 > svg").selectAll("g").remove();
    var rectGroup = d3.select("#map1 > svg").selectAll("g").data(mapdata);
    rectGroup.exit().remove;
    var rectEnter = rectGroup.enter().append("g").merge(rectGroup)
        .each(joinOccData);
    rectEnter.call(tip3);

    /*var xPosNow = 10;*/

    //rectEnter.filter(function(d){
      //  return d.State_Winner == "I";
    //})


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
                console.log(D.STATE);
                if (typeof D.STATE != 'undefined'){
            return self.colorScale(+D["Average Annual Openings"]);
                }
                else return self.colorScale(0);
            })
            .on('mouseover', tip3.show)
            .on('mouseout', tip3.hide)


    };



        //.on('mouseover', tip.show)
        //on('mouseout', tip.hide);

   /* rectEnter.filter(function(d){
        return d.State_Winner == "D";
    })
        .append("rect")
        .attr("y", function(d,i){
            return (d.Row)*(self.svgHeight/self.maxRows);
        })
        .attr("x", function(d,i){
            return (d.Space)*(self.svgWidth/self.maxColumns);
        })
        .attr("width", function(d,i){
            return (self.svgWidth/self.maxColumns);
        })
        .attr("height", function(d,i){
            return (self.svgHeight/self.maxRows);
        })
        .attr("class", function(d){
            return ("tile ");
        })
        .attr("fill",function(d) {
            return self.colorScale(+d.RD_Difference);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    rectEnter.filter(function(d){
        return d.State_Winner == "R";
    })
        .append("rect")
        .attr("y", function(d,i){
            return (d.Row)*(self.svgHeight/self.maxRows);
        })
        .attr("x", function(d,i){
            return (d.Space)*(self.svgWidth/self.maxColumns);
        })
        .attr("width", function(d,i){
            return (self.svgWidth/self.maxColumns);
        })
        .attr("height", function(d,i){
            return (self.svgHeight/self.maxRows);
        })
        .attr("class", function(d){
            return ("tile ");
        })
        .attr("fill",function(d) {
            return self.colorScale(+d.RD_Difference);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);*/

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


   /*rectEnter
        .append("text")
        .attr("y", function(d,i){
            return ((d.Row)*(self.svgHeight/self.maxRows))+((self.svgHeight/self.maxRows)/2)+15;
        })
        .attr("x", function(d,i){
            return ((d.Space)*(self.svgWidth/self.maxColumns))+((self.svgWidth/self.maxColumns)/2);
        })
        .text(function(d,i){
            return d.Total_EV ;
        })
        .attr("class", "tilestext");*/



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


    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
