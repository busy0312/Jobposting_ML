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
    
        // Pie chart for Employment Type
        var emp_type = filteredData.map(d => d.employment_type)

        var filtered_empT= emp_type.filter(d => d !== "")
        console.log(filtered_empT)
            // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };

        // console.log(x);
        var pieEmp = {
            values: category_count[i].values,
            labels: filtered_empT,
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

        Plotly.newPlot("empPie", [pieEmp], pieLayout);


        // Pie chart for Required Experience
        var exp_type = filteredData.map(d => d.required_experience)

        var filtered_reqExp= exp_type.filter(d => d !== "")
        console.log(filtered_reqExp)
            // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };

        // console.log(x);
        var pieReqexp = {
            values: category_count[i].values,
            labels: filtered_reqExp,
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

        Plotly.newPlot("reqExpPie", [pieReqexp], pieLayout);


        // Bar Chart Top 10 Job Titles
        // var job_titles = filteredData.map(d => d.title)

        // var filtered_title= job_titles.filter(d => d !== "")
        // console.log(filtered_title
        //     // var x = category_count.filter(d => d.value === jobcat)
        // var i = 0
        // if (jobcat === "Real") {
        //     i = 0
        // };

        // // console.log(x);
        // var pieReqexp = {
        //     values: category_count[i].values,
        //     labels: filtered_reqExp,
        //     // hovertext: count + labels,
        //     hoverinfo: 'hovertext',
        //     type: 'pie',

        // };

        // var pieLayout = {
        //     'legend': {
        //         x: 0.1,
        //         // y: 5,
        //         'orientation': 'h'
        //     }
        // };

        // Plotly.newPlot("reqExpPie", [pieReqexp], pieLayout);
 
        
    }

    test();
};

d3.selectAll("#selvalue").on("change", init);
init();