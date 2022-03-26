//Initiating the function
function init(){
  // Selecting the dropdown element
  var dropdown = d3.select("#selDataset");
  // Using d3 library to read samples file
  d3.json("data/samples.json").then((data) => {
      // Craeting variable of sample ID's
      var sampleID = data.names;
      //Looping through list of samples and populating the dropdown with subject ID's
      for (var i = 0; i < sampleID.length; i++) {
          dropdown
          .append("option")
          .text(sampleID[i])
          .property("value", sampleID[i]);
      }
      // Using the first ID to display default plots
      var firstID = sampleID[0];
      updateDemographics(firstID);
      updatePlots(firstID);
  });
};
// Defining upateDemographics funtcion
function updateDemographics(sample) {
  // Using d3 to create variable holding demographics details
  d3.json("data/samples.json").then((data) => {
      var metadata = data.metadata;
      var metaID = metadata.filter(sampleObject => sampleObject.id == sample)
      var result = metaID[0]
      // selecting dmographics info element
      var demographics_panel = d3.select("#sample-metadata")
      demographics_panel.html("");
      // Using object entries to add each key and value to demographics panel
      // Using .forEach to iterate through each object
      Object.entries(result).forEach(([key, value]) => 
      demographics_panel.append("h6").text(`${key}: ${value}`))
  });
};
// Defining updatePlots function
function updatePlots(sample) {
  // Using d3 to create variable holding sample details
  d3.json("data/samples.json").then((data) => {
      // Getting data for barchart and bubble chart
     var samples = data.samples;
     var ID = samples.filter(sampleObject => sampleObject.id == sample);
     var result = ID[0]
     var otu_ids = result.otu_ids;
     var otu_labels = result.otu_labels;
     var sample_values = result.sample_values;
     //Getting data for gauge chart
     var meta = data.metadata;
     var wfreq_ID = meta.filter(sampleObject => sampleObject.id == sample);
     var wfreq_result = wfreq_ID[0];
     var wfreq = wfreq_result.wfreq
     // Creating bar chart
     var trace1 = {
         x: sample_values.slice(0,10).reverse(),
         y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
         text: otu_labels.slice(0,10).reverse(),
         type: 'bar',
         orientation: 'h'
     };
     var data = [trace1];
     var layout = {
         title: "Top 10 OTUs found in an individual " + sample,
         width: 500,
         height:600,
         margin: {l: 60, r: 50, t: 100, b: 100},
     };
     Plotly.newPlot("bar", data, layout);
     //Creating bubble chart
     var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      opacity: 0.8,
      }
  };
     var data = [trace1];
     var layout = {
         title: "OTU per sample in individual " + sample,
         showlegend: false, 
         height: 600,
     }
     Plotly.newPlot("bubble", data, layout);
     //Creating gauge chart
     var data = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: wfreq,
        title: { text: "<b> Belly Button Washing Frequency</b> <br>Scrubs per week", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1},
          bar: { color: "gray" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: "rgb(255, 255, 255)" },
            { range: [1, 2], color: "rgb(255, 255, 204))"},
            { range: [2, 3], color: "rgb(217, 255, 179)" },
            { range: [3, 4], color: "rgb(153, 255, 153)" },
            { range: [4, 5], color: "rgb(153, 255, 204)" },
            { range: [5, 6], color: "rgb(153, 255, 255)" },
            { range: [6, 7], color: "rgb(204, 204, 255)" },
            { range: [7, 8], color: "rgb(255, 204, 255)" },
            { range: [8, 9], color: "rgb(255, 170, 128)" },
            { range: [9, 10], color: "rgb(255, 153, 153)" }
          ],
        }
      }
    ];
    
    var layout = {
      width: 500,
      height: 400,
      margin: { t: 100, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "rgb(51, 51, 51)", family: "Arial" }
    };
    
    Plotly.newPlot("gauge", data, layout);
    
  });
};
// Fetch new data each time a new sample is selected
function optionChanged(newdata) {
  updateDemographics(newdata);
  updatePlots(newdata)
};

// Initialize the function
init();