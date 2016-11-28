
function ClusterChart(occdata, clusterSelection) {
    var self = this;

    self.occdata = occdata;
    console.log(occdata);
    self.init();
};


ClusterChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divclusterChart = d3.select("#clusterChart").classed("fullView", true);

    self.svgBounds = divclusterChart.node().getBoundingClientRect();
    self.svgWidth = (self.svgBounds.width - self.margin.left - self.margin.right)*(3/4);
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


ClusterChart.prototype.update = function(occdata, clusterSelection){
    var self = this;
    console.log(clusterSelection);



    //Domain definition for global color scale
    //var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    //var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    //self.colorScale = d3.scaleQuantile()
      //  .domain(domain).range(range);

    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

   // var dispatch = d3.dispatch("load");

    var margin = {top: 100, right: 100, bottom: 100, left: 100};

    var width = self.svgWidth,
        height = self.svgHeight,
        padding = 5, // separation between same-color circles
        clusterPadding = 8, // separation between different-color circles
        maxRadius = 60;

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    console.log(occdata);
    var filteredoccdata = occdata
        .filter(function(d) {
            return ((d["STATE"] == " United States") && (d["OCC_GROUP"] == "detailed"));
        });

    var radiusScale = d3.scaleLinear()
        .domain([0, d3.max(filteredoccdata,(function(d,i) {
            return +d["Average Annual Openings"];
        }))])
        .range([5, maxRadius]);

    var wageColorScale = d3.scaleQuantile()
        .domain([0,20000, 40000, 60000, 80000, 100000])
            //d3.max(filteredoccdata,(function(d,i) {
            //return +d["A_MEDIAN"];
        //}))])
        .range(['#f1eef6','#d4b9da','#c994c7','#df65b0','#dd1c77','#980043']);

    //var clusterSelection = self.clusterSelection;
    //console.log(clusterSelection);



    var clusterarray = []
    filteredoccdata.map(function (d){
        clusterarray.push(d["" + clusterSelection + ""]);
    });

    var clusterarray = unique(clusterarray);
    console.log(clusterarray);
    var clusters = new Array(clusterarray.length);
    var m = clusterarray.length;
    console.log(m);

    var occs = []
    filteredoccdata.map(function (d){
        occs.push(d["OCC_CODE"]);
    });
    var occs = unique(occs);
    var n = occs.length;

    function unique(x) {
        return x.reverse().filter(function (e, i, x) {return x.indexOf(e, i+1) === -1;}).reverse();
    }

    var svg = d3.select('#clusterChart > svg');

    var nodes = filteredoccdata.map(function(d, i){
      var  ii = +d["" + clusterSelection + "Index"],
        r = radiusScale(+d["Average Annual Openings"]),
        AREA = d.AREA,
        STATE = d.STATE,
        OCC_CODE = d.OCC_CODE,
        OCC_TITLE = d.OCC_TITLE,
        TOT_EMP = +d.TOT_EMP,
        A_MEDIAN = +d.A_MEDIAN,
        ID = d.ID,
        BASE_YEAR = d["Base Year"],
        BASE_EMP = +d.Base,
        PROJECTION_YEAR = d["Projected Year"],
        PROJECTION_EMP = +d.Projection,
        PCT_CHNG = (((+d.Projection/+d.Base)^(1/10))-1)*100,
        AVG_ANN_OPENINGS = +d["Average Annual Openings"],
        MAJOR_GROUP = d.MajorGroupCode,
        MAJOR_GROUP_DESCR = d.MajorGroup,
        JOB_DESCR = d.JobDescription,
        MAJOR_GROUP_INDEX = +d.MajorGroupIndex,
        EDUCATION = d.Education,
        EDUCATION_INDEX = d.EducationIndex,
        TRAINING = d.Training,
        TRAINING_INDEX = d.TrainingIndex,
        EXPERIENCE = d.Experience,
        EXPERIENCE_INDEX = d.ExperienceIndex;

        if (ii + 1 <= m / 3) {
            var xpos = parseFloat(((ii + 1) * ((width-100) / (m / 3))));
        }
        else if (((ii + 1) > (m / 3)) && ((ii + 1) <= (m * (2 / 3)))) {
            var xpos = (((ii + 1) - (m / 3)) * ((width-100) / (m / 3)));
        }
        else var xpos =  (((ii + 1) - (m * (2 / 3))) * ((width-100) / (m / 3)));

        if (ii + 1 <= m/3) {
            var ypos = 100;
        }
        else if (((ii + 1) > (m / 3)) && ((ii + 1) <= (m * (2 / 3)))) {
            var ypos = 300;
        }
        else var ypos = 500;

        var d = {r:r,
            ii:ii,
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
            JOB_DESCR:JOB_DESCR,
            x: xpos, //Math.cos(ii / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            xpos: xpos,
            y: ypos,
            ypos: ypos};

            //console.log(d);

        if (!clusters[ii] || (r > +clusters[ii].r)) clusters[ii] = d;
        return d;
    });

    //dispatch.call("load", this, nodes);
    //dispatch.call("statechange", this, stateById.get("CA"));

    console.log(nodes);
    console.log(clusters);

    var simulation = d3.forceSimulation()
        .stop()
        .nodes(nodes)

        //.velocityDecay(.8)
        /*.force("x", d3.forceX(function (d,i) {
         if ((d.ii + 1) <= (m / 3)) {
         return ((d.ii + 1) * ((width-100) / (m / 3)));//- ((width / (m / 3)) / 2);
         }
         if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
         return (((d.ii + 1) - (m / 3)) * ((width-100) / (m / 3)));// - ((width / (m / 3)) / 2);
         }
         return (((d.ii + 1) - (m * (2 / 3))) * ((width-100) / (m / 3)));// - ((width / (m / 3)) / 2);
         })
         .strength(.2))
         .force("y", d3.forceY(function (d, i) {
         if ((d.ii + 1) <= (m/3)) {
         return 100;//(((100000/d.A_MEDIAN)*100));
         }
         if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
         return 300;//(((100000/d.A_MEDIAN)*100));
         }
         return 500;//((100000/d.A_MEDIAN)*100);
         })
         .strength(.2))*/

            .force("cluster", d3.forceCluster()
                .centers(function (d){
                    //console.log(clusters[0]);
                    //console.log(d.ii);
                    return clusters[d.ii];
                })
                .strength(0.5)
                .centerInertia(0.01))
            .force("collide", d3.forceCollide().radius(function(d) { return d.r + 1; })
            //.iterations(2)
                .strength(0))
        .restart()
        .on('tick', ticked);

    //simulation.stop()
      //      .nodes(nodes);
            //.on("load", function(){
                //simulation.restart()
                  //  .on('tick', ticked);
           // })



   // simulation.stop();
    //simulation.restart();
//console.log(simulation);


        //.force("manybody", d3.forceManyBody().strength(function(d) {return (((d.A_MEDIAN/+1)/200000)*-3)}))
    //

    var circles = svg.selectAll('g').remove();
    var circles = svg.append('g').datum(nodes);
    var circles = circles.selectAll('g > circle')
            .data(nodes).enter()/*function(d) {
                return d;
            })
            .enter()*/
        .append('circle')
        .attr('r', function(d) {
            return d.r;
        })
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr("fill", function (d) {
                return wageColorScale(d.A_MEDIAN);
        })
        .attr('stroke', 'none')
        .attr('stroke-width', 1)
        //
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

//dispatch.on("load", function(nodes){
  //  simulation.restart();
//});

    //circles.exit().remove();

    /*circles.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
            var j= d3.interpolate(0, d.r);
            return function(t) { return d.radius = j(t); };
        });*/

  /*  function ticked() {
        circles
            //.each(clustering(10 * alpha * e.alpha))
            //.each(collide(.5))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }*/



//Resolves collisions between d and all other circles.
   /* function collide(alpha) {
        console.log(alpha);
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
            var r = d.r + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.r + quad.point.r + (d.MAJOR_GROUP_INDEX === quad.point.MAJOR_GROUP_INDEX ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }*/



    // Move d to be adjacent to the cluster node.
   /* function clustering(alpha) {
        nodes.forEach(function(d) {
            var cluster = clusters[d.MAJOR_GROUP_INDEX];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.r + cluster.r;
            if (l !== r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        });
    }*/


// These are implementations of the custom forces.
    /*function clustering(alpha) {
        nodes.forEach(function(d) {
            var cluster = clusters[d.ii];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.r + cluster.r;
            if (l !== r) {
                l = (l - r) / l * (alpha);
                d.x -= x;//*= l;
                d.y -= y;// *= l;
                cluster.x += x;
                cluster.y += y;
            }
        });
    }



   /*function collide(alpha) {
        var quadtree = d3.quadtree()
                .x((d) => d.x)
    .y((d) => d.y)
    .addAll(nodes);

        nodes.forEach(function(d) {
            var r = d.r + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {

                if (quad.data && (quad.data !== d)) {
                    var x = d.x - quad.data.x,
                        y = d.y - quad.data.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.r + quad.data.r + (d["MAJOR_GROUP_INDEX"] === quad.data["MAJOR_GROUP_INDEX"] ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.data.x += x;
                        quad.data.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        });
    }*/

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.3).restart();
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

   /* function restartSimulation (d) {
        simulation.restart()
            .on('tick',ticked);
    }*/

    var transitionTime = 3000;
    var t = d3.timer(function (elapsed) {
        var dt = elapsed / transitionTime;
        simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
        if (dt >= 1.0) t.stop();
    });


    function ticked(e) {
        circles
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    }

    d3.select('#clusterSelect')
        .on('change', function() {
            var clusterSelection = d3.select(this).property('value');
            self.update(occdata, clusterSelection);
        });


//simulation.restart();
    //simulation.restart()
      //  .on("tick", ticked)
    //.nodes(nodes)
    //;

};







