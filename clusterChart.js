
function ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata) {
    var self = this;

    self.occdata = occdata;
    self.distChart = distChart;
    self.demandChart = demandChart;
    self.growthChart = growthChart;
    self.map = map;
    self.init(occdata, stateSelection);
};


ClusterChart.prototype.init = function(occdata, stateSelection){

    var self = this;
    self.margin = {top: 10, right: 0, bottom: 30, left: 60};
    var divclusterChart = d3.select("#clusterChart").classed("cChart", true);

    self.svgBounds = divclusterChart.node().getBoundingClientRect();
    self.svgWidth = (self.svgBounds.width - self.margin.left - self.margin.right);
    self.svgHeight = 600;

    self.svg = divclusterChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

    var statefilteredoccdata = occdata
        .filter(function(d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed"));
        });

    var clusterLegend = d3.select('#clusterLegend');

    var legendBounds = clusterLegend.node().getBoundingClientRect(),
        legendWidth = (legendBounds.width - self.margin.left - self.margin.right),
        legendHeight = 150;

    var legendSVG = clusterLegend.append("svg")
            .classed('legendSVG', true)
            .attr("width",legendWidth)
            .attr("height",legendHeight);

    var newColorScale = d3.scaleOrdinal()
        .domain(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
        .range(['#d6d600','#ff7f00','#a65628','#e41a1c','#f781bf','#984ea3','#377eb8','#4daf4a']);

    legendSVG.append('g')
        .attr('class', 'colorLegend')
        .attr("transform",
            "translate(5,10)");

    var legend = d3.legendColor()
        .scale(newColorScale)
        .orient('horizontal')
        .shape('rect')
        .shapeHeight('25')
        .shapeWidth('25')
        .shapePadding('19')
        //.title("Colored by Education")
        .labels(["None","High school","Some college","Certificate","Associate's","Bachelor's","Master's","Doctoral"]);

    legendSVG.select(".colorLegend")
        .call(legend);

    var shadeScale = d3.scaleOrdinal()
        .domain(['a', 'b', 'c'])
        .range(['#f0f0f0','#bdbdbd','#636363']);

    legendSVG.append('g')
        .attr('class', 'shadeLegend')
        .attr("transform",
            "translate(5,70)");

    var legend2 = d3.legendColor()
        .scale(shadeScale)
        .orient('vertical')
        .ascending(true)
        .shape('rect')
        .shapeHeight('20')
        .shapeWidth('40')
        .shapePadding('0')
        //.title("Colored by Education")
        .labels(["Low Wage", "Mid Wage", "High Wage"]);

    legendSVG.select(".shadeLegend")
        .call(legend2);

    legendSVG.select(".sizeLegend").remove();
    var newRadiusScale = d3.scaleLinear()
        .domain([0, d3.max(statefilteredoccdata,(function(d,i) {
            return +d["Average Annual Openings"];
        }))])
        .range([4, 30]);

    legendSVG.append('g')
        .attr('class', 'sizeLegend')
        .attr("transform",
            "translate(100,100)");

    var legend3 = d3.legendSize()
        .scale(newRadiusScale)
        .orient('horizontal')
        .shape('circle')
        .shapePadding('9')
        //.labels(['a', 'b', 'c' , 'd', 'e']);
        .labelFormat(d3.format(",.0f"));

    legendSVG.select(".sizeLegend")
        .call(legend3);

    legendSVG.append('g')
        .attr("transform",
            "translate(100,75)")
        .append('text')
        .text("Larger circle = more openings ----->")
        .attr('font-size', '16px');

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

ClusterChart.prototype.tooltip_render = function(tooltip_data) {
    var self = this;
    var text = "<span id='close' onclick='tip.hide()' style = 'float: right;'><b style = 'font-size: 30px;'>&times</b></span>";
    text += "<h2 class = 'tooltip-title'>" + tooltip_data["Occupation Title"] + "</h2>";
    text +=  "<b style='font-size:18px;'>Job Description: </b><p style='font-size:18px;'>" + tooltip_data['Job Description'] +"</p>";
    text +=  "<b style='font-size:18px;'>Related Occupations: </b>";
    text += "<ul>";
    if (tooltip_data.RJDescr_1 != "") {
        text += "<li>" + tooltip_data.RJDescr_1 + "</li>";
        if (tooltip_data.RJDescr_2 != "") {
            text += "<li>" + tooltip_data.RJDescr_2 + "</li>";
            if (tooltip_data.RJDescr_3 != "") {
                text += "<li>" + tooltip_data.RJDescr_3 + "</li>";
                if (tooltip_data.RJDescr_4 != "") {
                    text += "<li>" + tooltip_data.RJDescr_4 + "</li>";
                    if (tooltip_data.RJDescr_5 != "") {
                        text += "<li>" + tooltip_data.RJDescr_5 + "</li>";
                        if (tooltip_data.RJDescr_6 != "") {
                            text += "<li>" + tooltip_data.RJDescr_6 + "</li>";
                            if (tooltip_data.RJDescr_7 != "") {
                                text += "<li>" + tooltip_data.RJDescr_7 + "</li>";
                                if (tooltip_data.RJDescr_8 != "") {
                                    text += "<li>" + tooltip_data.RJDescr_8 + "</li>";
                                    if (tooltip_data.RJDescr_9 != "") {
                                        text += "<li>" + tooltip_data.RJDescr_9 + "</li>";
                                        if (tooltip_data.RJDescr_10 != "") {
                                            text += "<li>" + tooltip_data.RJDescr_10 + "</li>";
    }}}}}}}}}}
    else text += "<li>None identified</li>";
        /*text += "<li>" + tooltip_data.RJDescr_2 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_3 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_4 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_5 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_6 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_7 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_8 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_9 + "</li>"
        text += "<li>" + tooltip_data.RJDescr_10 + "</li>"*/
    text += "</ul>";
    return text;
}

ClusterChart.prototype.tooltip_render2 = function(tooltip_data2) {
    var self = this;
    var text = "<h2 class = 'tooltip-title'>" + tooltip_data2["Occupation Title"] + "</h2>";
    text +=  "<p style='font-size:18px; color: #e74c3c'><i>Click the circle for more details.</i></p>";
    return text;
}




ClusterChart.prototype.update = function(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata){
    var self = this;

    var filteredoccdata = occdata
        .filter(function(d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed") && (d["A_MEDIAN"] >= minWage ) && (d["A_MEDIAN"] <= maxWage )&& (d["Average Annual Openings"] >= minOpenings ) && (d["Average Annual Openings"] <= maxOpenings ) && (d["Percent Change"]/100 >= minGrowth ) && (d["Percent Change"]/100 <= maxGrowth ));
        });

    var statefilteredoccdata = occdata
        .filter(function(d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed"));
        });

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = self.svgWidth +60,
        height = self.svgHeight,
        padding = 5, // separation between same-color circles
        clusterPadding = 8, // separation between different-color circles
        maxRadius = 30;

    var hueScale = d3.scaleOrdinal(d3.schemeCategory20);

    var saturationScale = d3.scaleQuantize()
        .domain([0, 30000, 60000])
        //d3.max(filteredoccdata,(function(d,i) {
        //return +d["A_MEDIAN"];
        //}))])
        .range(['#f1eef6','#d4b9da','#c994c7','#df65b0','#dd1c77','#980043']);


    var colorScale = d3.scaleOrdinal()
        .domain(['No formal educational credential','High school diploma or equivalent','Some college, no degree','Postsecondary nondegree award',"Associate's degree","Bachelor's degree","Master's degree",'Doctoral or professional degree'])
        .range(['#d6d600','#ff7f00','#a65628','#e41a1c','#f781bf','#984ea3','#377eb8','#4daf4a']);//(d3.schemeCategory10);
    console.log(colorScale.domain());

    var radiusScale = d3.scaleLinear()
        .domain([0, d3.max(statefilteredoccdata,(function(d,i) {
            return +d["Average Annual Openings"];
        }))])
        .range([4, maxRadius]);

    var wageColorScale = d3.scaleQuantile()
        .domain([0,20000, 40000, 60000, 80000, 100000])
            //d3.max(filteredoccdata,(function(d,i) {
            //return +d["A_MEDIAN"];
        //}))])
        .range(['#f1eef6','#d4b9da','#c994c7','#df65b0','#dd1c77','#980043']);

    var wageScale = d3.scaleThreshold()
        .domain([30000, 60000, 1000000])
       //.domain([d3.min(filteredoccdata,(function(d,i) {return +d["A_MEDIAN"];})), d3.max(filteredoccdata,(function(d,i) {return +d["A_MEDIAN"];})) ])
            .range([-20, 0, 20]);

    var clusterarray = [];

    statefilteredoccdata.map(function (d){
        clusterarray.push(+d["" + clusterSelection + "Index"]+1);
    });

    var clusterarray = unique(clusterarray);
    clusterarray = clusterarray.filter(function(d){
        return d != "";
    });
   ////console.log(clusterarray);
    var clusters = new Array(clusterarray.length),
        m = d3.max(clusterarray);//clusterarray.length;

   ////console.log(clusterSelection);

   ////console.log(m);



    var occs = [];
    filteredoccdata.map(function (d){
        occs.push(d["OCC_CODE"]);
    });
    var occs = unique(occs),
        n = occs.length;

    function unique(x) {
        return x.reverse().filter(function (e, i, x) {return x.indexOf(e, i+1) === -1;}).reverse();
    }

    var clusterChartTitle = document.getElementById('clusterChartTitle');
    d3.select('#clusterChartTitle > text').remove();
    var byCluster = document.createElement('text');

        if (d3.select('#clusterSelect').property('value') == "Education"){
            var clusterDescr = " Level of Education Typically Required";
        }
        else if (d3.select('#clusterSelect').property('value') == "MajorGroup"){
            var clusterDescr = " Major Occupational Group";
        }
        else if (d3.select('#clusterSelect').property('value') == "Training"){
            var clusterDescr = " Typical Job Training";
        }
        else if (d3.select('#clusterSelect').property('value') == "Experience"){
            var clusterDescr = " Experience Level";
        }
        else if (d3.select('#clusterSelect').property('value') == "STEM"){
            var clusterDescr = " STEM (Science, Tech, Engineering, Math)";
        }
        else var clusterDescr = " All Occupations";

    byCluster.appendChild(document.createTextNode(clusterDescr));
    clusterChartTitle.appendChild(byCluster);

    var svg = d3.select('#clusterChart > svg');

    var nodes = d3.range(n).map(function (d,i) {
        var ii = +filteredoccdata[i]["" + clusterSelection + "Index"],
            r = radiusScale(+filteredoccdata[i]["Average Annual Openings"]);
        if (m > 10) {
            if (ii + 1 <= 7) {
                var x = ((((ii + 1) * ((width - 100) / 7)) + (50 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / 7)/4));
            }
            else if (((ii + 1) > 7) && ((ii + 1) <= 15)) {
                var x = (((((ii + 1) - 7) * ((width - 100) / 8)) + (50 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / 8)/4));
            }
            else var x = (((((ii + 1) - 15) * ((width - 100) / 7)) + (50 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / 7)/4));

            if (ii + 1 <= 7) {
                var y = 70 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (((ii + 1) > 7) && ((ii + 1) <= 15)) {
                var y = 220 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else var y = 410 - wageScale(+filteredoccdata[i].A_MEDIAN);
        }
        else if (m < 10 && m >=4) {
            if (ii + 1 <= (m/2)) {
                var x = (((((ii + 1) * ((width - 100) / (m/2)))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m/2))/2));
            }
            else var x = (((((ii + 1)-(m/2)) * ((width - 100) / (m/2))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m/2))/2));

            if (ii + 1 <= (m/2)) {
                var y = 140 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else var y = 440 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);

        }
        else if (m < 4) {
                    var x = (((((ii + 1) * ((width - 100)/m))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m))*(2/5)));
                    var y = 260 - 3*wageScale(+filteredoccdata[i].A_MEDIAN);

            };

        var CLUSTER_NODE = 'NO';

        var AREA = filteredoccdata[i].AREA,
            STATE = filteredoccdata[i].STATE,
            OCC_CODE = filteredoccdata[i].OCC_CODE,
            OCC_TITLE = filteredoccdata[i].OCC_TITLE,
            TOT_EMP = +filteredoccdata[i].TOT_EMP,
            A_MEDIAN = +filteredoccdata[i].A_MEDIAN,
            ID = filteredoccdata[i].ID,
            BASE_YEAR = filteredoccdata[i]["Base Year"],
            BASE_EMP = +filteredoccdata[i].Base,
            PROJECTION_YEAR = filteredoccdata[i]["Projected Year"],
            PROJECTION_EMP = +filteredoccdata[i].Projection,
            PCT_CHNG = (((+filteredoccdata[i].Projection/+filteredoccdata[i].Base)^(1/10))-1)*100,
            AVG_ANN_OPENINGS = +filteredoccdata[i]["Average Annual Openings"],
            MAJOR_GROUP = filteredoccdata[i].MajorGroupCode,
            MAJOR_GROUP_DESCR = filteredoccdata[i].MajorGroup,
            JOB_DESCR = filteredoccdata[i].JobDescription,
            MAJOR_GROUP_INDEX = +filteredoccdata[i].MajorGroupIndex,
            EDUCATION = filteredoccdata[i].Education,
            EDUCATION_INDEX = filteredoccdata[i].EducationIndex,
            TRAINING = filteredoccdata[i].Training,
            TRAINING_INDEX = filteredoccdata[i].TrainingIndex,
            EXPERIENCE = filteredoccdata[i].Experience,
            EXPERIENCE_INDEX = filteredoccdata[i].ExperienceIndex,
            STEM = filteredoccdata[i].STEM,
            STEM_INDEX = filteredoccdata[i].STEMIndex
            ALL = filteredoccdata[i].AllOccupations,
            ALL_INDEX = filteredoccdata[i].AllIndex,
            PERCENT_CHANGE = +filteredoccdata[i]["Percent Change"],
                RJDescr_1 = filteredoccdata[i].RJDescr_1,
                RJDescr_2 = filteredoccdata[i].RJDescr_2,
                RJDescr_3 = filteredoccdata[i].RJDescr_3,
                RJDescr_4 = filteredoccdata[i].RJDescr_4,
                RJDescr_5 = filteredoccdata[i].RJDescr_5,
                RJDescr_6 = filteredoccdata[i].RJDescr_6,
                RJDescr_7 = filteredoccdata[i].RJDescr_7,
                RJDescr_8 = filteredoccdata[i].RJDescr_8,
                RJDescr_9 = filteredoccdata[i].RJDescr_9,
                RJDescr_10 = filteredoccdata[i].RJDescr_10,
                RJDescr_11 = filteredoccdata[i].RJDescr_11,
                RJDescr_12 = filteredoccdata[i].RJDescr_12,
                RJDescr_13 = filteredoccdata[i].RJDescr_13,
                RJDescr_14 = filteredoccdata[i].RJDescr_14,
                RJDescr_15 = filteredoccdata[i].RJDescr_15,
                RJDescr_16 = filteredoccdata[i].RJDescr_16,
                RJDescr_17 = filteredoccdata[i].RJDescr_17,
                RJDescr_18 = filteredoccdata[i].RJDescr_18,
                RJDescr_19 = filteredoccdata[i].RJDescr_19,
                RJDescr_20 = filteredoccdata[i].RJDescr_20,
                RJDescr_21 = filteredoccdata[i].RJDescr_21,
                RJDescr_22 = filteredoccdata[i].RJDescr_22,
                RJDescr_23 = filteredoccdata[i].RJDescr_23,
                RJDescr_24 = filteredoccdata[i].RJDescr_24,
                RJDescr_25 = filteredoccdata[i].RJDescr_25,
                RJDescr_26 = filteredoccdata[i].RJDescr_26,
                RJDescr_27 = filteredoccdata[i].RJDescr_27,
                RJDescr_28 = filteredoccdata[i].RJDescr_28,
                RJDescr_29 = filteredoccdata[i].RJDescr_29,
                RJDescr_30 = filteredoccdata[i].RJDescr_30,
                RJDescr_31 = filteredoccdata[i].RJDescr_31,
                RJDescr_32 = filteredoccdata[i].RJDescr_32,
                RJDescr_33 = filteredoccdata[i].RJDescr_33,
                RJDescr_34 = filteredoccdata[i].RJDescr_34,
                RJDescr_35 = filteredoccdata[i].RJDescr_35,
                RJDescr_36 = filteredoccdata[i].RJDescr_36,
                RJDescr_37 = filteredoccdata[i].RJDescr_37,
                RJDescr_38 = filteredoccdata[i].RJDescr_38,
                RJDescr_39 = filteredoccdata[i].RJDescr_39,
                RJDescr_40 = filteredoccdata[i].RJDescr_40,
                RJDescr_41 = filteredoccdata[i].RJDescr_41,
                RJDescr_42 = filteredoccdata[i].RJDescr_42,
                RJDescr_43 = filteredoccdata[i].RJDescr_43,
                RJDescr_44 = filteredoccdata[i].RJDescr_44,
                RJDescr_45 = filteredoccdata[i].RJDescr_45,
                RJDescr_46 = filteredoccdata[i].RJDescr_46,
                RJDescr_47 = filteredoccdata[i].RJDescr_47,
                RJDescr_48 = filteredoccdata[i].RJDescr_48,
                RJDescr_49 = filteredoccdata[i].RJDescr_49,
                RJDescr_50 = filteredoccdata[i].RJDescr_50,
                RJDescr_51 = filteredoccdata[i].RJDescr_51,
                RJDescr_52 = filteredoccdata[i].RJDescr_52,
                RJDescr_53 = filteredoccdata[i].RJDescr_53

            ;

            d = {
                ii: ii,
                r: r,
                AREA:AREA,
                STATE:STATE,
                OCC_CODE:OCC_CODE,
                OCC_TITLE:OCC_TITLE,
                TOT_EMP:TOT_EMP,
                A_MEDIAN:A_MEDIAN,
                ID:ID,
                BASE_YEAR:BASE_YEAR,
                BASE_EMP:BASE_EMP,
                PROJECTION_YEAR:PROJECTION_YEAR,
                PROJECTION_EMP:PROJECTION_EMP,
                PCT_CHNG:PCT_CHNG,
                AVG_ANN_OPENINGS:AVG_ANN_OPENINGS,
                MAJOR_GROUP:MAJOR_GROUP,
                MAJOR_GROUP_DESCR:MAJOR_GROUP_DESCR,
                MAJOR_GROUP_INDEX:MAJOR_GROUP_INDEX,
                EDUCATION:EDUCATION,
                EDUCATION_INDEX:EDUCATION_INDEX,
                TRAINING:TRAINING,
                TRAINING_INDEX:TRAINING_INDEX,
                EXPERIENCE:EXPERIENCE,
                EXPERIENCE_INDEX:EXPERIENCE_INDEX,
                STEM:STEM,
                STEM_INDEX:STEM_INDEX,
                ALL:ALL,
                ALL_INDEX:ALL_INDEX,
                JOB_DESCR:JOB_DESCR,
                CLUSTER_NODE:CLUSTER_NODE,
                PERCENT_CHANGE:PERCENT_CHANGE,
                RJDescr_1 :RJDescr_1,
                RJDescr_2 :RJDescr_2,
                RJDescr_3 :RJDescr_3,
                RJDescr_4 :RJDescr_4,
                RJDescr_5 :RJDescr_5,
                RJDescr_6 :RJDescr_6,
                RJDescr_7 :RJDescr_7,
                RJDescr_8 :RJDescr_8,
                RJDescr_9 :RJDescr_9,
                RJDescr_10 :RJDescr_10,
                RJDescr_11 :RJDescr_11,
                RJDescr_12 :RJDescr_12,
                RJDescr_13 :RJDescr_13,
                RJDescr_14 :RJDescr_14,
                RJDescr_15 :RJDescr_15,
                RJDescr_16 :RJDescr_16,
                RJDescr_17 :RJDescr_17,
                RJDescr_18 :RJDescr_18,
                RJDescr_19 :RJDescr_19,
                RJDescr_20 :RJDescr_20,
                RJDescr_21 :RJDescr_21,
                RJDescr_22 :RJDescr_22,
                RJDescr_23 :RJDescr_23,
                RJDescr_24 :RJDescr_24,
                RJDescr_25 :RJDescr_25,
                RJDescr_26 :RJDescr_26,
                RJDescr_27 :RJDescr_27,
                RJDescr_28 :RJDescr_28,
                RJDescr_29 :RJDescr_29,
                RJDescr_30 :RJDescr_30,
                RJDescr_31 :RJDescr_31,
                RJDescr_32 :RJDescr_32,
                RJDescr_33 :RJDescr_33,
                RJDescr_34 :RJDescr_34,
                RJDescr_35 :RJDescr_35,
                RJDescr_36 :RJDescr_36,
                RJDescr_37 :RJDescr_37,
                RJDescr_38 :RJDescr_38,
                RJDescr_39 :RJDescr_39,
                RJDescr_40 :RJDescr_40,
                RJDescr_41 :RJDescr_41,
                RJDescr_42 :RJDescr_42,
                RJDescr_43 :RJDescr_43,
                RJDescr_44 :RJDescr_44,
                RJDescr_45 :RJDescr_45,
                RJDescr_46 :RJDescr_46,
                RJDescr_47 :RJDescr_47,
                RJDescr_48 :RJDescr_48,
                RJDescr_49 :RJDescr_49,
                RJDescr_50 :RJDescr_50,
                RJDescr_51 :RJDescr_51,
                RJDescr_52 :RJDescr_52,
                RJDescr_53 :RJDescr_53,
                x: x,
                y: y
            };
        if (!clusters[ii] || (r > clusters[ii].r)) {
            clusters[ii] = d;
            //clusters[ii].CLUSTER_NODE = 'YES';
        };
        return d;

    });

    clusters = clusters.filter(function(d){
        return d != undefined;
    });

    ////console.log(clusters);



    var simulation = d3.forceSimulation(nodes)
         // .alpha(1)
        /*.force("cluster", d3.forceCluster()
         .centers(function (d){
         ////console.log(clusters[0]);
         ////console.log(d.ii);
         return clusters[d.ii];
         })
         .strength(0.5)
         .centerInertia(0.01))
        //.velocityDecay(.2)*/
           .force("collide", d3.forceCollide().radius(function(d) { return d.r + 1; })
              .iterations(10)
              .strength(.3)
           )
          // .force("manybody", d3.forceManyBody().strength(function(d) { return (-2); }))
        .force("x", d3.forceX(function (d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return (((d.ii + 1) * ((width - 100) / 7))-(((width - 100) / 7)/4));
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return ((((d.ii + 1) - 7) * ((width - 100) / 8))-(((width - 100) / 8)/4));
                }
                else return ((((d.ii + 1) - 15) * ((width - 100) / 7))-(((width - 100) / 7)/4));
            }
            else if (m < 10 && m >=4) {
                    if (d.ii + 1 <= (m/2)) {
                        return ((((d.ii + 1) * ((width - 100) / (m/2))))-(((width - 100) / (m/2))/2));
                    }
                    else return ((((d.ii + 1) -(m/2)) * ((width - 100) / (m/2)))-(((width - 100) / (m/2))/2));
            }
            else if (m < 4) {
                return (((((d.ii + 1) * ((width - 100) / m))))- (((width - 100) / (m))*(2/5)));
            }})
            .strength(.1))
        .force("y", d3.forceY(function (d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return 70 - wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return 220 - wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else return 410 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (m < 10 && m >=4) {
                if (d.ii + 1 <= (m/2)) {
                    return 140 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else return 440 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (m < 4) {
                    return 260 - 3*wageScale(+filteredoccdata[i].A_MEDIAN);
            }})
            .strength(.1))

          .on('tick', ticked)
    // ;

  simulation.stop();

//console.log(m);

    var circles = svg.selectAll('.circles').data(nodes, function(d){
                return d.ID;
        })
        .on('click', function(d){

            this.active ? tip.hide(d) : tip.show(d);
            var active   = this.active ? false : true,
                newClass = active ? 'circles highlight' : 'circles';
            // Hide or show the elements
            d3.select(this).attr("class", newClass);
            //d3.select("#blueAxis").style("opacity", newOpacity);
            // Update whether or not the elements are active
            this.active = active;
            var occSelection = d.OCC_CODE;
            map.update(mapdata, occdata, occSelection);

        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    ;

   // var labels = svg.selectAll('.clusterLabels').transition().duration(1000).attr('opacity', 0).remove();

    var labels = svg.selectAll('.clusterLabels')
        .data(clusters);
        /*.filter(function(d) {
            return d.CLUSTER_NODE == 'YES';
        });*/
//console.log(labels);

    var newCircles = circles
            .enter()
            .append('circle')
            .classed("circles", true)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .attr("opacity", 0)
        .on('mouseover', function(d){
            var medianWage = +d.A_MEDIAN,
                avgOpenings = +d.AVG_ANN_OPENINGS,
                medianGrowthRate = +d.PERCENT_CHANGE/100;

            distChart.occbars_render(medianWage);
            demandChart.occbars_render(avgOpenings);
            growthChart.occbars_render(medianGrowthRate);
            tip2.show(d);
            //wage_render
        })
        //.on('mouseover', tip.show)
        .on('mouseout', function(d){
            distChart.occbars_out();
            demandChart.occbars_out();
            growthChart.occbars_out();
            tip2.hide(d);
        })
        .on('click', function(d){
            this.active ? tip.hide(d) : tip.show(d);
            var active   = this.active ? false : true,
                newClass = active ? 'circles highlight' : 'circles';
            // Hide or show the elements
            d3.select(this).attr("class", newClass);
            // Update whether or not the elements are active
            this.active = active;
            var occSelection = d.OCC_CODE;
            map.update(mapdata, occdata, occSelection);
        });

    var newLabels = labels
        .enter()
        .append('text')
        .classed("clusterLabels", true)
        .attr('x', function(d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return (((d.ii + 1) * ((width - 100) / 7))-(((width - 100) / 7)/4));
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return ((((d.ii + 1) - 7) * ((width - 100) / 8))-(((width - 100) / 8)/4));
                }
                else return ((((d.ii + 1) - 15) * ((width - 100) / 7))-(((width - 100) / 7)/4));
            }
            else if (m < 10 && m >=4) {
                if (d.ii + 1 <= (m/2)) {
                    return ((((d.ii + 1) * ((width - 100) / (m/2))))-(((width - 100) / (m/2))/2));
                }
                else return ((((d.ii + 1) -(m/2)) * ((width - 100) / (m/2)))-(((width - 100) / (m/2))/2));
            }
            else if (m < 4) {
                return ((((d.ii + 1) * ((width - 100) / m)))- (((width - 100) / (m)) *(2/5)));
            }})
        .attr('y', function(d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return 130;
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return 300 ;
                }
                else return 500;
            }
            else if (m < 10 && m >=4) {
                if (d.ii + 1 <= (m/2)) {
                    return 280;
                }
                else return 550;
            }
            else if (m < 4) {
                return 480;
            }})
        .attr('dy', 0)
        .text(function(d){
            if (clusterSelection == "MajorGroup") {
                return d.MAJOR_GROUP_DESCR;
            }
            else if (clusterSelection == "All") {
                return d.ALL;
            }
            else if (clusterSelection == "Education") {
                return d.EDUCATION;
            }
            else if (clusterSelection == "STEM") {
                return d.STEM;
            }
            else if (clusterSelection == "Training") {
                return d.TRAINING;
            }
            else if (clusterSelection == "Experience") {
                return d.EXPERIENCE;
            }})
        .call(wrap, (m >10 ? 100 : 150))
        .attr("opacity", 0);

       // svg.selectAll('.clusterLabels')




    newCircles.transition()
        //.on('end', simulation.restart)
            .duration(3000)
            .attr('r', function(d) {
                return d.r;
            })
            .attr("fill", function (d) {
                var c = d3.rgb(colorScale(d.EDUCATION));
            if (d.A_MEDIAN <= 30000) {
                return c.brighter(1);
                }
            else if (d.A_MEDIAN > 30000 && d.A_MEDIAN <= 60000) {
                return c.darker(0);
                }
            else return c.darker(1);
            })
            .attr("opacity", 1)
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
       .on('end', function(d){
           callTip(d);
          // callWrap();
           simStart(d);
       });

    newLabels.transition()
        .duration(8000)
        /*.attr('x', function(d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return (((d.ii + 1) * ((width - 100) / 7))-(((width - 100) / 7)/2));
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return ((((d.ii + 1) - 7) * ((width - 100) / 8))-(((width - 100) / 8)/2));
                }
                else return ((((d.ii + 1) - 15) * ((width - 100) / 7))-(((width - 100) / 7)/2));
            }
            else if (m < 10 && m >=5) {
                if (d.ii + 1 <= (m/2)) {
                    return ((((d.ii + 1) * ((width - 100) / (m/2))))-(((width - 100) / (m/2))/2));
                }
                else return ((((d.ii + 1) -(m/2)) * ((width - 100) / (m/2)))+(((width - 100) / (m/2))/2));
            }
            else if (m < 5) {
                return (((((d.ii + 1) * ((width - 100) / m))) - (((width - 100) / (m)) / 2)));
            }})
        .attr('y', function(d,i) {
            if (m > 10) {
                if (d.ii + 1 <= 7) {
                    return 280;
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return 580 ;
                }
                else return 880;
            }
            else if (m < 10 && m >=5) {
                if (d.ii + 1 <= (m/2)) {
                    return 430 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else return 880 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (m < 5) {
                return 880 - 3*wageScale(+filteredoccdata[i].A_MEDIAN);
            }})
        .attr('dy', 0)
        .text(function(d){
            if (clusterSelection = "MajorGroup") {
                return d.MAJOR_GROUP_DESCR;
            }
            else if (clusterSelection = "Education") {
                return d.EDUCATION;
            }
            else if (clusterSelection = "STEM") {
                return d.STEM;
            }
            else if (clusterSelection = "Training") {
                return d.TRAINING;
            }
            else if (clusterSelection = "Experience") {
                return d.EXPERIENCE;
            }})*/
        .attr("opacity", 1)
        ;

  //  svg.selectAll('.clusterLabels')
    //    .call(wrap, 300);




    circles.exit()
        .style("opacity", 1)
        .transition().duration(3000)
        .style("opacity",0)
        .remove();

    labels.exit()
        .style("opacity", 1)
        .transition().duration(500)
        .style("opacity",0)
        .remove();



circles.transition()
        .duration(3000)

        .attr('r', function(d) {
            return d.r;
        })
        .attr("fill", function (d) {
            var c = d3.rgb(colorScale(d.EDUCATION));
            if (d.A_MEDIAN <= 30000) {
                return c.darker(-1);
            }
            else if (d.A_MEDIAN > 30000 && d.A_MEDIAN <= 60000) {
                return c.darker(0);
            }
            else return c.darker(1);
        })
        .attr("opacity", 1)
        .attr('cx', function(d) {
            return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        })

    .on('end', function(d){
        callTip(d);
        //callWrap();
        simStart(d);
    });

 labels
     .classed("clusterLabels", true)
     .attr('opacity', 0)
     .attr('x', function(d,i) {
         if (m > 10) {
             if (d.ii + 1 <= 7) {
                 return (((d.ii + 1) * ((width - 100) / 7))-(((width - 100) / 7)/4));
             }
             else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                 return ((((d.ii + 1) - 7) * ((width - 100) / 8))-(((width - 100) / 8)/4));
             }
             else return ((((d.ii + 1) - 15) * ((width - 100) / 7))-(((width - 100) / 7)/4));
         }
         else if (m < 10 && m >=4) {
             if (d.ii + 1 <= (m/2)) {
                 return ((((d.ii + 1) * ((width - 100) / (m/2))))-(((width - 100) / (m/2))/2));
             }
             else return ((((d.ii + 1) -(m/2)) * ((width - 100) / (m/2)))-(((width - 100) / (m/2))/2));
         }
         else if (m < 4) {
             return (((((d.ii + 1) * ((width - 100) / m))))- (((width - 100) / (m)) *(2/5)));
         }})
     .attr('y', function(d,i) {
         if (m > 10) {
             if (d.ii + 1 <= 7) {
                 return 130;
             }
             else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                 return 300 ;
             }
             else return 500;
         }
         else if (m < 10 && m >=4) {
             if (d.ii + 1 <= (m/2)) {
                 return 280;
             }
             else return 530;
         }
         else if (m < 4) {
             return 480;
         }})
     .attr('dy', 0)
     .text(function(d){
         if (clusterSelection == "MajorGroup") {
             return d.MAJOR_GROUP_DESCR;
         }
         else if (clusterSelection == "Education") {
             return d.EDUCATION;
         }
         else if (clusterSelection == "All") {
             return d.ALL;
         }
         else if (clusterSelection == "STEM") {
             return d.STEM;
         }
         else if (clusterSelection == "Training") {
             return d.TRAINING;
         }
         else if (clusterSelection == "Experience") {
             return d.EXPERIENCE;
         }
     })
     .call(wrap,(m >10 ? 100 : 150))
     .transition()
     .duration(5000)

        .attr("opacity", 1)
    ;







    tip = d3.tip().attr('class', 'd3-tip')
        .direction(function(d){
            console.log(d.x);
            if (d.x >=500){
                return 'sw';
            }
            else if (d.x < 500){
                return 'se';
            };

        })
        .offset(function(d) {
           return (d.y >= 250 ? [-300, 0]:[-100,0]);
        })
        .html(function (d) {
            //if (d.OCC_TITLE !== " ") {
            // ////console.log(d.I_Nominee_prop)
            tooltip_data = {
                "State" : d.STATE,
                "Occupation Title": d.OCC_TITLE,
                "Occupation Code" : d.OCC_CODE,
                "Median Annual Wage" : d.A_MEDIAN,
                "Base Year" : d.BASE_YEAR,
                "Base Year Employment" : d.BASE_EMP,
                "Projection Year" : d.PROJECTION_YEAR,
                "Projection Year Employment" : d.PROJECTION_EMP,
                "Projected 10-Year Growth" : d.PERCENT_CHANGE,
                "Projected Annual Openings" : d.AVG_ANN_OPENINGS,
                "Major Group" : d.MAJOR_GROUP,
                "Job Description" : d.JOB_DESCR,
                "Typical Education Required" : d.EDUCATION,
                "Job Training" : d.TRAINING,
                "Work Experience" : d.EXPERIENCE,
                "STEM" : d.STEM,
                RJDescr_1 : d.RJDescr_1,
                RJDescr_2 : d.RJDescr_2,
                RJDescr_3 : d.RJDescr_3,
                RJDescr_4 : d.RJDescr_4,
                RJDescr_5 : d.RJDescr_5,
                RJDescr_6 : d.RJDescr_6,
                RJDescr_7 : d.RJDescr_7,
                RJDescr_8 : d.RJDescr_8,
                RJDescr_9 : d.RJDescr_9,
                RJDescr_10 : d.RJDescr_10,
                RJDescr_11 : d.RJDescr_11,
                RJDescr_12 : d.RJDescr_12,
                RJDescr_13 : d.RJDescr_13,
                RJDescr_14 : d.RJDescr_14,
                RJDescr_15 : d.RJDescr_15,
                RJDescr_16 : d.RJDescr_16,
                RJDescr_17 : d.RJDescr_17,
                RJDescr_18 : d.RJDescr_18,
                RJDescr_19 : d.RJDescr_19,
                RJDescr_20 : d.RJDescr_20,
                RJDescr_21 : d.RJDescr_21,
                RJDescr_22 : d.RJDescr_22,
                RJDescr_23 : d.RJDescr_23,
                RJDescr_24 : d.RJDescr_24,
                RJDescr_25 : d.RJDescr_25,
                RJDescr_26 : d.RJDescr_26,
                RJDescr_27 : d.RJDescr_27,
                RJDescr_28 : d.RJDescr_28,
                RJDescr_29 : d.RJDescr_29,
                RJDescr_30 : d.RJDescr_30,
                RJDescr_31 : d.RJDescr_31,
                RJDescr_32 : d.RJDescr_32,
                RJDescr_33 : d.RJDescr_33,
                RJDescr_34 : d.RJDescr_34,
                RJDescr_35 : d.RJDescr_35,
                RJDescr_36 : d.RJDescr_36,
                RJDescr_37 : d.RJDescr_37,
                RJDescr_38 : d.RJDescr_38,
                RJDescr_39 : d.RJDescr_39,
                RJDescr_40 : d.RJDescr_40,
                RJDescr_41 : d.RJDescr_41,
                RJDescr_42 : d.RJDescr_42,
                RJDescr_43 : d.RJDescr_43,
                RJDescr_44 : d.RJDescr_44,
                RJDescr_45 : d.RJDescr_45,
                RJDescr_46 : d.RJDescr_46,
                RJDescr_47 : d.RJDescr_47,
                RJDescr_48 : d.RJDescr_48,
                RJDescr_49 : d.RJDescr_49,
                RJDescr_50 : d.RJDescr_50,
                RJDescr_51 : d.RJDescr_51,
                RJDescr_52 : d.RJDescr_52,
                RJDescr_53 : d.RJDescr_53
                /*"winner": d.State_Winner,
                 "electoralVotes": d.Total_EV,
                 "result": [
                 {
                 "nominee": d.D_Nominee_prop,
                 "votecount": d3.format(',')(d.D_Votes),
                 "percentage": d.D_Percentage,
                 "party": "D"
                 },
                 {
                 "nominee": d.R_Nominee_prop,
                 "votecount": d3.format(',')(d.R_Votes),
                 "percentage": d.R_Percentage,
                 "party": "R"
                 },
                 {
                 "nominee": d.I_Nominee_prop,
                 "votecount": d3.format(',')(d.I_Votes),
                 "percentage": d.I_Percentage,
                 "party": "I"
                 }
                 ]*/
            }
            //}
            /*else {
             tooltip_data = {
             "state": d.State,
             "winner": d.State_Winner,
             "electoralVotes": d.Total_EV,
             "result": [
             {
             "nominee": d.D_Nominee_prop,
             "votecount": d3.format(',')(d.D_Votes),
             "percentage": d.D_Percentage,
             "party": "D"
             },
             {
             "nominee": d.R_Nominee_prop,
             "votecount": d3.format(',')(d.R_Votes),
             "percentage": d.R_Percentage,
             "party": "R"
             }
             ]
             }
             }*/


            /* pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            var html = ClusterChart.prototype.tooltip_render(tooltip_data)
            return html;
        });

    tip2 = d3.tip().attr('class', 'd3-tip')
        .direction(function(d){
            console.log(d.x);
            if (d.x >=500){
                return 'sw';
            }
            else if (d.x < 500){
                return 'se';
            };

        })
        .html(function (d) {
            //if (d.OCC_TITLE !== " ") {
            // ////console.log(d.I_Nominee_prop)
            tooltip_data2 = {
                "State": d.STATE,
                "Occupation Title": d.OCC_TITLE,
                "Occupation Code": d.OCC_CODE,
                "Median Annual Wage": d.A_MEDIAN,
                "Base Year": d.BASE_YEAR,
                "Base Year Employment": d.BASE_EMP,
                "Projection Year": d.PROJECTION_YEAR,
                "Projection Year Employment": d.PROJECTION_EMP,
                "Projected 10-Year Growth": d.PERCENT_CHANGE,
                "Projected Annual Openings": d.AVG_ANN_OPENINGS,
                "Major Group": d.MAJOR_GROUP,
                "Job Description": d.JOB_DESCR,
                "Typical Education Required": d.EDUCATION,
                "Job Training": d.TRAINING,
                "Work Experience": d.EXPERIENCE,
                "STEM": d.STEM
            }

            var html = ClusterChart.prototype.tooltip_render2(tooltip_data2)
            return html;
        });

        ////console.log(d3.selectAll('.clusterLabels text').call(wrap, 300));
    // .call(wrap, 300);


  // d3.selectAll('.clusterLabels').call(wrap, 200);
        //.on('end', callWrap);
    //d3.selectAll('.clusterLabels').call(wrap,300);


    //labelSelection.call(wrap,300);
    ////console.log(labelSelection);

   // transition.on('end', simStart);

    //labels = newLabels.merge(labels);


//circles = newCircles.merge(circles);



    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.9).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y    ;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

/*var transitionTime = 500;
    var t = d3.timer(function (elapsed) {
        var dt = elapsed / transitionTime;
        simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
        if (dt >= 1.0) t.stop();
    });*/


    function ticked() {
        newCircles
            .attr('cx', function (d) { return d.x = Math.max(d.r, Math.min(self.svgWidth - d.r, d.x)); })
            .attr('cy', function (d) { return d.y = Math.max(d.r, Math.min(self.svgHeight - d.r, d.y));});
        circles
            .attr('cx', function (d) { return d.x = Math.max(d.r, Math.min(self.svgWidth - d.r, d.x)); })
            .attr('cy', function (d) { return d.y = Math.max(d.r, Math.min(self.svgHeight - d.r, d.y));});
    }

    function simStart() {
        simulation.alphaTarget(0).restart();
    }

    function simStop() {
        simulation.stop();
    }

    function simTick() {
        simulation.on('tick', ticked);
    }

    function callWrap(){
        d3.selectAll('.clusterLabels').call(wrap,300);
    }
    function callTip(){
        d3.selectAll('.circles').call(tip);
        d3.selectAll('.circles').call(tip2);
    }

    function wrap(text, width) {
        text.each(function () {
            ////console.log(this);
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


    d3.select('#clusterSelect')
        .on('change', function(d) {
            tip.hide(d);
            simulation.stop();
            var clusterSelection = d3.select(this).property('value');
            self.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata);
            distChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, demandChart, growthChart, map, mapdata);
            demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, distChart, growthChart, map, mapdata);
            growthChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, distChart, demandChart, map, mapdata);
        });

    d3.select('#stateSelect')
        .on('change', function(d) {

            tip.hide(d);
            simulation.stop();
            var stateSelection = d3.select(this).property('value');
            var occSelection = "00-0000";
            map.update(mapdata, occdata, occSelection);
            self.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata);
            distChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, demandChart, growthChart, map, mapdata);
            demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, distChart, growthChart, map, mapdata);
            growthChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, self, distChart, demandChart, map, mapdata);
        });
};







