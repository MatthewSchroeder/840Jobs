
function ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart) {
    var self = this;

    self.occdata = occdata;
    self.distChart = distChart;
    self.demandChart = demandChart;
    self.init();
};


ClusterChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 0, bottom: 30, left: 60};
    var divclusterChart = d3.select("#clusterChart").classed("cChart", true);

    self.svgBounds = divclusterChart.node().getBoundingClientRect();
    self.svgWidth = (self.svgBounds.width - self.margin.left - self.margin.right);
    self.svgHeight = 700;

    self.svg = divclusterChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

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
    var text = "<h2 class = 'tooltip-title'>" + tooltip_data["Occupation Title"] + "</h2>";
    //text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    //text += "<ul>"
   // tooltip_data.result.forEach(function(row){
    //    text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"\t\t("+row.percentage+"%)" + "</li>"
    //});
    //text += "</ul>";
    return text;
}




ClusterChart.prototype.update = function(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart){
    var self = this;

    var filteredoccdata = occdata
        .filter(function(d) {
            return ((d["STATE"] == "" + stateSelection + "") && (d["OCC_GROUP"] == "detailed") && (d["A_MEDIAN"] >= minWage ) && (d["A_MEDIAN"] <= maxWage )&& (d["Average Annual Openings"] >= minOpenings ) && (d["Average Annual Openings"] <= maxOpenings ));
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

    tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function () {
                return [0, 0];
            })
            .html(function (d) {
                //if (d.OCC_TITLE !== " ") {
                // ////console.log(d.I_Nominee_prop)
                tooltip_data = {
                    "Occupation Title": d.OCC_TITLE
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
                var y = 100 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (((ii + 1) > 7) && ((ii + 1) <= 15)) {
                var y = 280 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else var y = 500 - wageScale(+filteredoccdata[i].A_MEDIAN);
        }
        else if (m < 10 && m >=4) {
            if (ii + 1 <= (m/2)) {
                var x = (((((ii + 1) * ((width - 100) / (m/2)))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m/2))/2));
            }
            else var x = (((((ii + 1)-(m/2)) * ((width - 100) / (m/2))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m/2))/2));

            if (ii + 1 <= (m/2)) {
                var y = 130 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else var y = 430 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);

        }
        else if (m < 4) {
                    var x = (((((ii + 1) * ((width - 100)/m))) + (100 * (Math.random()*(Math.random() < 0.5 ? -1 : 1))))-(((width - 100) / (m))*(2/5)));
                    var y = 200 - 3*wageScale(+filteredoccdata[i].A_MEDIAN);

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
            ALL_INDEX = filteredoccdata[i].AllIndex
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
                    return 100 - wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return 280 - wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else return 500 - wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (m < 10 && m >=4) {
                if (d.ii + 1 <= (m/2)) {
                    return 130 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
                }
                else return 430 - 2*wageScale(+filteredoccdata[i].A_MEDIAN);
            }
            else if (m < 4) {
                    return 200 - 3*wageScale(+filteredoccdata[i].A_MEDIAN);
            }})
            .strength(.1))

          .on('tick', ticked)
    // ;

  simulation.stop();

//console.log(m);

    var circles = svg.selectAll('.circles').data(nodes, function(d){
                return d.ID;
        })
        .on('click', function(){
            var active   = this.active ? false : true,
                newClass = active ? 'circles highlight' : 'circles';
            // Hide or show the elements
            d3.select(this).attr("class", newClass);
            //d3.select("#blueAxis").style("opacity", newOpacity);
            // Update whether or not the elements are active
            this.active = active;
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
            var medianWage = +d.A_MEDIAN
                avgOpenings = +d.AVG_ANN_OPENINGS;

            self.distChart.occbars_render(medianWage);
            self.demandChart.occbars_render(avgOpenings);
            tip.show(d);
            //wage_render
        })
        //.on('mouseover', tip.show)
        .on('mouseout', function(d){
            self.distChart.occbars_out();
            self.demandChart.occbars_out();
            tip.hide(d);
        })
        .on('click', function(){
            var active   = this.active ? false : true,
                newClass = active ? 'circles highlight' : 'circles';
            // Hide or show the elements
            d3.select(this).attr("class", newClass);
            // Update whether or not the elements are active
            this.active = active;
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
                    return 160;
                }
                else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                    return 360 ;
                }
                else return 590;
            }
            else if (m < 10 && m >=4) {
                if (d.ii + 1 <= (m/2)) {
                    return 270;
                }
                else return 520;
            }
            else if (m < 4) {
                return 420;
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
                 return 160;
             }
             else if (((d.ii + 1) > 7) && ((d.ii + 1) <= 15)) {
                 return 360 ;
             }
             else return 590;
         }
         else if (m < 10 && m >=4) {
             if (d.ii + 1 <= (m/2)) {
                 return 270;
             }
             else return 520;
         }
         else if (m < 4) {
             return 420;
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
        .on('change', function() {
            simulation.stop();
            var clusterSelection = d3.select(this).property('value');
            self.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart);
            self.distChart.update(occdata, clusterSelection, stateSelection, minOpenings, maxOpenings, self, demandChart);
            self.demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, self, distChart);
        });

    d3.select('#stateSelect')
        .on('change', function() {
            simulation.stop();
            var stateSelection = d3.select(this).property('value');
            self.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart);
            self.distChart.update(occdata, clusterSelection, stateSelection, minOpenings, maxOpenings, self, demandChart);
            self.demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, self, distChart);
        });
};







