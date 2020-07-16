function init() {
    async function test() {
        var data = await d3.csv("../Resources/jobpost.csv")
        console.log(data);

        var jobcat = d3.select("#selvalue").node().value;
        console.log(jobcat);

        var filteredData = data.filter(d => d.fraudulent === jobcat);
        // console.log(filteredData);


        var category_count = d3.nest()
            .key(function(d) {
                return d.fraudulent;
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(data);
        console.log(category_count)


        var req_ed = filteredData.map(d => d.required_education)

        var filtered_ed = req_ed.filter(d => d !== "")
        console.log(filtered_ed)
            // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };

        // console.log(x);
        var pieTrace = {
            values: category_count[i].values,
            labels: filtered_ed,
            // hovertext: count + labels,
            hoverinfo: 'hovertext',
            type: 'pie',

        };

        var pieLayout = {
            'legend': {
                x: 0.1,
                // y: 5,
                'orientation': 'h'
            }
        };
        // title: `Pie Chart `,



        Plotly.newPlot("pie", [pieTrace], pieLayout);
    }

    test();
};

d3.selectAll("#selvalue").on("change", init);
init();