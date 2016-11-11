
function ClusterChart(occdata) {
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


ClusterChart.prototype.update = function(){
    var self = this;

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


    var margin = {top: 100, right: 100, bottom: 100, left: 100};

    var width = self.svgWidth,
        height = self.svgHeight,
        padding = 5, // separation between same-color circles
        clusterPadding = 8, // separation between different-color circles
        maxRadius = 70;

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    var filteredoccdata = self.occdata
        .filter(function(d) {
            return ((d["STATE"] == " United States") && (d["OCC_GROUP"] == "detailed"));
        });

    var radiusScale = d3.scaleLinear()
        .domain([0, d3.max(filteredoccdata,(function(d,i) {
            return +d["Average Annual Openings"];
        }))])
        .range([5, maxRadius]);

    var clusterarray = []
    filteredoccdata.map(function (d){
        clusterarray.push(d["MajorGroupDescr"]);
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
      var  ii = +d.MajorGroupIndex,
        r = radiusScale(+d["Average Annual Openings"]),
        x = width/2; /*function (d,i) {
            if ((d.ii + 1) <= (m / 3)) {
                return ((d.ii + 1) * (width / (m / 3))) - ((width / (m / 3)) / 2);
            }
            if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
                return (((d.ii + 1) - (m / 3)) * (width / (m / 3))) - ((width / (m / 3)) / 2);
            }
                return (((d.ii + 1) - (m * (2 / 3))) * (width / (m / 3))) - ((width / (m / 3)) / 2);
        };*/
        //Math.cos((ii+1) / m * 2 * Math.PI) * 200 + width / 2 + Math.random();
        y = height/2; /*function (d, i) {
            if ((d.ii + 1) <= (m/3)) {
                return 100;
            }
            if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
                return 250;
            }
                return 400;
            };*/
        //Math.sin((ii+1) / m * 2 * Math.PI) * 200    + height / 2 + Math.random();
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
        MAJOR_GROUP = d.MajorGroup,
        MAJOR_GROUP_DESCR = d.MajorGroupDescr,
        JOB_DESCR = d.JobDescription,
        MAJOR_GROUP_INDEX = +d.MajorGroupIndex,
        dd = {r:r, ii:ii, x:x, y:y,  AREA:AREA, STATE:STATE, OCC_CODE:OCC_CODE, OCC_TITLE:OCC_TITLE, TOT_EMP:TOT_EMP, A_MEDIAN:A_MEDIAN, ID:ID, BASE_YEAR:BASE_YEAR, BASE_EMP:BASE_EMP, PROJECTION_YEAR:PROJECTION_YEAR, PROJECTION_EMP:PROJECTION_EMP, PCT_CHNG:PCT_CHNG, AVG_ANN_OPENINGS:AVG_ANN_OPENINGS, MAJOR_GROUP:MAJOR_GROUP, MAJOR_GROUP_DESCR:MAJOR_GROUP_DESCR, MAJOR_GROUP_INDEX:MAJOR_GROUP_INDEX, JOB_DESCR:JOB_DESCR};
        if (!clusters[ii] || (r > +clusters[ii].r)) clusters[ii] = dd;
        return dd;
    })
    console.log(nodes);
    console.log(clusters);

    var circles = svg.selectAll('g').remove();
    var circles = svg.append('g')
        .datum(nodes)
        .selectAll('circle')
        .data(function(d) {
            return d;
        })
        .enter()
        .append('circle')
        .attr('r', function(d) {
            return d.r;
        })
        //.attr('cx', (d) => d.x)
        //.attr('cy', (d) => d.y)
        .attr("fill", function (d) {
                return colorScale(d.MAJOR_GROUP_INDEX);
        })
        .attr('stroke', 'none')
        .attr('stroke-width', 1)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

   var simulation = d3.forceSimulation(nodes)
        .velocityDecay(.4)
        .force("x", d3.forceX(function (d,i) {
            if ((d.ii + 1) <= (m / 3)) {
                return ((d.ii + 1) * ((width-100) / (m / 3)));//- ((width / (m / 3)) / 2);
            }
            if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
                return (((d.ii + 1) - (m / 3)) * ((width-100) / (m / 3)));// - ((width / (m / 3)) / 2);
            }
            return (((d.ii + 1) - (m * (2 / 3))) * ((width-100) / (m / 3)));// - ((width / (m / 3)) / 2);
        })
            /*function(d){
            return ((d.ii+1)*(width/m))-((width/m)/2);
        })*/
            .strength(.1))
        .force("y", d3.forceY(function (d, i) {
            if ((d.ii + 1) <= (m/3)) {
                return 100;
            }
            if (((d.ii + 1) > (m / 3)) && ((d.ii + 1) <= (m * (2 / 3)))) {
                return 300;
            }
            return 500;
        })
        .strength(.1))
        .force("collide", d3.forceCollide().radius(function(d) { return d.r + 1; }).iterations(2).strength(.7))
        .force("cluster", d3ForceCluster.forceCluster()
            .strength(100)
            .centerInertia(1)
            .centers(clusters))

      .on("tick", ticked);


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

    function ticked() {

        circles
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    }

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
        if (!d3.event.active) simulation.alphaTarget(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};



