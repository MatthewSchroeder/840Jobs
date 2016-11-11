
(function(){
    var instance = null;

    function init() {


        //var rankChart = new RankChart();

        //var stateChart = new StateChart();

        //var infoPanel = new InfoPanel();

        d3.csv("occdata.csv", function (error, occdata) {
            var clusterChart = new ClusterChart(occdata);
            console.log(occdata);
            clusterChart.update(occdata);
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