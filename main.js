
(function(){
    var instance = null;

    function init() {

       //var clusterChart = new ClusterChart();
       //var distChart = new DistChart();



        //var infoPanel = new InfoPanel();

        d3.csv("occdata_all.csv", function (error, occdata) {
            var clusterSelection = "Education",
                stateSelection = "United States",
                minWage = 0,
                maxWage = 200000
                minOpenings = 0,
                maxOpenings = 200000
                minGrowth = 0,
                maxGrowth = 500;
           //    var clusterChart = new ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings);
            var distChart = new DistChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, demandChart, growthChart);
            var demandChart = new DemandChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, growthChart);
            var growthChart = new GrowthChart(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, demandChart);
            var clusterChart = new ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart);
            distChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, demandChart, growthChart);
            demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, growthChart);
            growthChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, clusterChart, distChart, demandChart);
            clusterChart.update(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, minGrowth, maxGrowth, distChart, demandChart, growthChart);

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