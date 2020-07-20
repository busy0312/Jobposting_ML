d3.selectAll(".copy").on("click", function(){
    var full_description = d3.select(this.parentNode).select(".hidden-desc").text()
    d3.select("#user_inputs").text(full_description)

})


