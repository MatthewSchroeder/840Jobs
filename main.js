
(function(){
    var instance = null;

    function init() {

        d3.csv("occdata_all.csv", function (error, occdata) {
            d3.csv("map.csv", function (error, mapdata) {
            var clusterSelection = "Education",
                stateSelection = "United States",
                minWage = 0,
                maxWage = 200000
                minOpenings = 0,
                maxOpenings = 200000
                minGrowth = 0,
                maxGrowth = 500;

                var occSelection = "00-0000";
                var map = new Map(mapdata, occdata, occSelection);
                var map2 = new Map2(mapdata, occdata, occSelection);
                map.update(mapdata, occdata, occSelection);
                map2.update(mapdata, occdata, occSelection);
                
            var distChart = new DistChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, demandChart, growthChart, map, mapdata, map2);
            var demandChart = new DemandChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, growthChart, map, mapdata, map2);
            var growthChart = new GrowthChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, demandChart, map, mapdata, map2);
            var clusterChart = new ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata, map2);
            distChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, demandChart, growthChart, map, mapdata, map2);
            demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, growthChart, map, mapdata, map2);
            growthChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, demandChart, map, mapdata, map2);
            clusterChart.update(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart, map, mapdata, map2);

            });

        });
    }
    
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }
    
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            init();
        }
        return instance;
    }

    Main.getInstance();
})();