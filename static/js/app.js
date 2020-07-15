function buildCharts(jobs) {

    async function test() {

        var data = await d3.csv("../Resources/jobpost.csv")


        var fraud = d3.select("#selvalue").node().value;
        console.log(fraud);

        var filteredData = data.filter(d => d.fraudulent === fraudulent);
        console.log(filteredData);

        var fraudcat = filteredData.map(d => +d.fraudulent)
            // console.log(`Fraudulent: ${fraudcat}`)

        var req_ed = filteredData.map(d => d.required_education)
            // console.log(`Required Education: ${req_ed}`)

        var pieTrace = {
            values: fraudcat,
            labels: req_ed,
            // hovertext: ,
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



        Plotly.plot("pie", [pieTrace], pieLayout);

    };


}

function dropdowninfo(jobs) {
    // Reading CSV File
    d3.csv("../Resources/jobpost.csv").then((data) => {
        d3.select("#selvalue").on("change", test)
    });
};


// create the function for the change event
function optionChanged(jobs) {
    buildCharts(jobs);
    dropdowninfo(jobs);


}

// create the function to get initial data
function init() {
    // Grab a reference to the dropdown select element



    // Use the list of sample names to populate the select options
    d3.csv("../Resources/jobpost.csv").then((data) => {
        console.log(data)

        d3.select("#selvalue")
            .selectAll('myOptions')
            .data(d3.map(data, function(d) { return d.fraudulent; }).keys())
            .enter()
            .append('option')
            .text(function(d) { return d; }) // text showed in the menu

    });



    buildCharts(jobs);
    dropdowninfo(jobs);

};


init();