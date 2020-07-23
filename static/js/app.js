function init() {
    async function test() {
        var data = await d3.csv("https://raw.githubusercontent.com/busy0312/Project3_Jobposting/master/Resources/jobpost.csv");
        console.log(data);

        var jobcat = d3.select("#selvalue").node().value;

        var filteredData = data.filter(d => d.fraudulent === jobcat);

        var category_count = d3.nest()
            .key(function (d) {
                return d.fraudulent;
            })
            .rollup(function (leaves) {
                return leaves.length;
            })
            .entries(data);
        // console.log(category_count)
        var req_ed = filteredData.map(d => d.required_education)
        var filtered_ed = req_ed.filter(d => d !== "")
        // console.log(filtered_ed)
        // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };
        var color1 = [
            "#154360", "#1A5276", "#1F618D", "#2471A3", "#2980B9", "#5499C7", "#7FB3D5",
            "#A9CCE3", "#D4E6F1", "#EAF2F8"
        ]
        var pieTrace = {
            values: category_count[i].values,
            labels: filtered_ed,
            // hovertext: count + labels,
            hoverinfo: 'hovertext',
            type: 'pie',
            showlegend: false,
            // marker: {
            //     'colors': color1
            // },
            hole: 0.4,
            textposition: 'inside'
        };

        var pieLayout = {
            'legend': {
                // x: 0.05,
                // y: .5,
                'orientation': 'h'

            },
            title: {
                text: 'Required Education',
                font: {
                    size: 24,
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    color: '#666'
                }
            },

        };
        var config = { responsive: true }
        // title: `Pie Chart `,
        Plotly.newPlot("pie", [pieTrace], pieLayout, config);

        // Pie chart for Employment Type
        var emp_type = filteredData.map(d => d.employment_type)

        var filtered_empT = emp_type.filter(d => d !== "")
        // console.log(filtered_empT)
        // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };
        var pieEmp = {
            values: category_count[i].values,
            labels: filtered_empT,
            // hovertext: count + labels,
            hoverinfo: 'hovertext',
            type: 'pie',
            showlegend: false,
            textposition: 'inside'
        };

        var pieLayout = {
            'legend': {
                x: 0.1,
                // y: .75,
                'orientation': 'h'

            },

            title: {
                text: 'Employment Opportunity',
                font: {
                    size: 24,
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    color: '#666',
                }
            }
        };
        // title: `Pie Chart `,
        Plotly.newPlot("empPie", [pieEmp], pieLayout, config);

        // Pie chart for Required Experience
        var exp_type = filteredData.map(d => d.required_experience)
        var filtered_reqExp = exp_type.filter(d => d !== "")
        // console.log(filtered_reqExp)
        // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };

        var pieReqexp = {
            values: category_count[i].values,
            labels: filtered_reqExp,
            // hovertext: count + labels,
            hoverinfo: 'hovertext',
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            textposition: 'inside'

        };

        var pieLayout = {
            'legend': {
                x: 0.25,
                // y: .75,
                'orientation': 'h'
            },
            title: {
                text: 'Required Experience',
                font: {
                    size: 24,
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    color: '#666'
                }
            }
        };
        // title: `Pie Chart `,

        Plotly.newPlot("reqExpPie", [pieReqexp], pieLayout, config);

        // Bar Chart Top 10 Job Titles
        var xjob_titles = filteredData.map(d => d.title)
        var title_counts = {}
        xjob_titles.forEach(d => {
            if (d in title_counts) {
                title_counts[d] = title_counts[d] + 1
            } else {
                title_counts[d] = 1
            }
        })
        var items = Object.keys(title_counts).map(function (key) {
            return [key, title_counts[key]];
        });
        // Sort the array based on the second element
        items.sort(function (first, second) {
            return second[1] - first[1];
        });
        sorted_items = items.slice(0, 10)

        // var fraudtype= filteredData.map(d => d.fraudulent)
        var filtered_title = xjob_titles.filter(d => d !== "")
        console.log(filtered_title)
        // var x = category_count.filter(d => d.value === jobcat)
        var i = 0
        if (jobcat === "Real") {
            i = 0
        };

        var trace = {
            x: sorted_items.map(d => d[0]),
            y: sorted_items.map(d => d[1]),
            marker: {
                color: 'DarkSeaGreen',

            },
            type: "bar",
        };
        var layout = {
            title: {
                text: 'Top 10 Job Titles',
                font: {
                    size: 24,
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    color: '#666',
                    // style: 'bolder',
                    // background: 'grey'

                }
            },
            xaxis: {
                tickangle: 7,
            },

        }

        var config = { responsive: true }
        var data_bar = [trace];

        Plotly.newPlot("bar", data_bar, layout, config);
    }

    test();
};

d3.selectAll("#selvalue").on("change", init);
init();