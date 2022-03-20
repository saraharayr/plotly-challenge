function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var metadataIDTag = d3.select("#sample-metadata");
    document.getElementById("sample-metadata").innerHTML = "";
    //metadataIDTag.innerHTML = '';
    var ul = metadataIDTag.append("ul"); 
  
    
  
    // Use `d3.json` to fetch the metadata for a sample
    var sampleURL = `/metadata/${sample}`;
    
    d3.json(sampleURL).then(function(data){ 
      mykeys = d3.keys(data).map(function(x){ return x.toUpperCase() })
      myvalues = d3.values(data);
      var myobjects = mykeys.map(function(e, i) {
        return e + " : "+ myvalues[i] + "</br>";
      });
     
      ul.selectAll("li")
        .data(myobjects)
        .enter()
        .append("li")
        .html(String); 
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }
  
  
  
  function buildCharts(sample) {
    var sampleURL = "/samples/${sample}";
    d3.json(sampleURL).then(function(data){ 
  
      // @TODO: Use d3.json to fetch the sample data for the plots
      var otu_ids = [];
      var otu_labels = [];
      var sample_values = [];
      
      //SORT THE ARRAYS BASED ON SAMPLE_VALUES
        //1) combine the arrays:
        var list = [];
        for (var j = 0; j < data.sample_values.length; j++) {
          list.push({"otu_ids": data.otu_ids[j], "sample_values": data.sample_values[j], "otu_labels": data.otu_labels[j]});
        }
      
        //2) sort:
        list.sort(function(a, b) {
          return ((a.sample_values < b.sample_values) ? -1 : ((a.sample_values == b.sample_values) ? 0 : 1));
        });
  
        //3) separate them back out:
        for (var k = 0; k < list.length; k++) {
          sample_values[k] = list[k].sample_values;
          otu_ids[k] = list[k].otu_ids;
          otu_labels[k]=list[k].otu_labels;
        }
  
      // @TODO: Build a Bubble Chart using the sample data
      var bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };
      
      var bubbleLayout = {
        title: "Belly Button Bacteria Bubble Chart for Sample ${sample}",
        showlegend: false,
        xaxis: {
          title:"otu_ids"
        },
        yaxis: {
          title:"sample_values"
        }
      };
      var bubbleID = document.getElementById("bubble");
      Plotly.newPlot(bubbleID, [bubbleTrace], bubbleLayout);
      // @TODO: Build a Pie Chart
    
      var pieTrace = {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      };
  
      var pieLayout = {
        title: "Pie Chart for top 10 Sample Values for Sample ${sample}",
      };
    
      var pieID = document.getElementById("pie");
      Plotly.plot(pieID, [pieTrace], pieLayout);
  
    });
  
    
  }
  
  
  function init() {
    // a reference to the dropdown select database
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the first plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    //Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialise the dashboard
  init();