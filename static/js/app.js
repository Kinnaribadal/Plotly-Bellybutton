//Kinnari's Homework
//function is loading data in dropdown menu

function dropdown(){
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        console.log(sampleNames);
        var display = d3.select("#selDataset");
        sampleNames.forEach(sampleid => {
            display.append("option")
            .text (sampleid)
            .property ("value", sampleid)
        });
        var sampleData = sampleNames[0];
        metadata(sampleData);
        charts(sampleData);
    });
}
// Define a function that will create metadata for given sample
function metadata(sample){
    d3.json("samples.json").then((data) => {
    var sampleMetadata = data.metadata;
    console.log(sampleMetadata);
    var filteredid = sampleMetadata.filter(object => object.id == sample);
    var result = filteredid[0];
    var displaymetadata = d3.select("#sample-metadata");
    displaymetadata.html("");
    Object.entries(result).forEach(([key, value])=>{
        displaymetadata.append("h6").text (`${key} ${value}`);
    });
});
}
//run the function to load the data
dropdown();

//for selected item display metadata and charts
function optionChanged(newSample){
    metadata(newSample);
    charts(newSample);
}

//chart all the data
function charts(sample){
    d3.json("samples.json").then((data) => {
    var sampleChart = data.samples;
    var filteredid = sampleChart.filter(object => object.id == sample);
    var result = filteredid[0];
    var otuid = result.otu_ids;
    var samplevalues = result.sample_values;
    var otulables = result.otu_lables;
    var bubble_data = [{
        x: otuid,
        y: samplevalues,
        text: otulables,
        mode: "markers",
        marker: {
            size:samplevalues,
            color: otuid
        }
    }];
    //layout for bar chart
    var layout = {
        title: "Top 10 OTU",
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        }
    };
      // set the layout for the bubble plot
      var layout_2 = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
    };
    //bubble chart
    Plotly.newPlot("bubble", bubble_data, layout_2);
    var bar_data = [{
        x: samplevalues.slice(0, 10).reverse(),
        y: otuid.slice(0, 10).map(otuid=>`otuid${otuid}`).reverse(),
       // text: otulables.slice(0, 10).reverse(),
        type:"bar",
        orientation:"h"
    }];
    Plotly.newPlot("bar", bar_data, layout);
    
});
}
