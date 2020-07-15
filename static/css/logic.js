//complete dropdown list
(async function testid() {
    var url = "https://github.com/busy0312/Project3_Jobposting/blob/master/Resources/job.csv"
    var data = await d3.csv(url);
    // var data = await d3.json("/getData");
    var jobData = data.map(d => d)
    var type = jobData.map(d => d.Post_Type)
    // To get fake and real option in the dropdown
    var filteredtype = type.filter(function (item, pos) {
        return type.indexOf(item) == pos;
    });
    filteredtype.forEach(function (x) {
        var typetag = document.createElement('option');
        typetag.textContent = x
        document.querySelector('#selDataset').appendChild(typetag)
    })
    // call out init data
    var dropdown = d3.selectAll('option');
    var types = dropdown.property('value');
    getdata(types)
})()

//catch dropdown change
d3.selectAll("#selDataset").on("change", handlechange)

function handlechange() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Select the input value from the form
    var choosetype = d3.select("#selDataset").node().value;
    // clear the input value
    d3.select("#selDataset").node().value = " ";
    d3.select(".alert-secondary").node().textContent = ' ';
    // show the id 
    d3.select("#selDataset").node().value = `${choosetype}`;
    // Build the plot with the new data
    getdata(choosetype);
}