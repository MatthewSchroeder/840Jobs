
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
                maxOpenings = 200000;
           //    var clusterChart = new ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings);
            var distChart = new DistChart(occdata, clusterSelection, stateSelection, minOpenings, maxOpenings, clusterChart, demandChart);
            var demandChart = new DemandChart(occdata, clusterSelection, stateSelection, minWage, maxWage, clusterChart, distChart);
            var clusterChart = new ClusterChart(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart);
            distChart.update(occdata, clusterSelection, stateSelection, minOpenings, maxOpenings, clusterChart, demandChart);
            demandChart.update(occdata, clusterSelection, stateSelection, minWage, maxWage, clusterChart, distChart);
            clusterChart.update(occdata, clusterSelection, stateSelection,  minWage, maxWage, minOpenings, maxOpenings, distChart, demandChart);

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