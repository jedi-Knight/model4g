config={
    api:{
        url: "data/schools.geojson",
        type: "GET"
    },
    otherAPIs:{
        overpass: {
            url:"."
        }
    }
};


var Styles = {
    polygonStyle: {
        color: "#333366",
        weight: 1,
        opacity: 0.9,
        fillColor: function() {
            //return svg pattern urls..
            return "#000000"; //temporary/fallback fill color..
        }(),
        fillOpacity: 1
    },
    lineStyle: {
        color: "#333366",
        weight: 3,
        opacity: 0.9,
        fillColor: "#000",
        fillOpacity: 0
    },
    iconStyle: {
        iconSize: [25, 42],
        iconAnchor: [12.5, 40],
        html: "<img src='markers/yellow.png'/>"

    }
};

var PlugsForStyling = {
  popup:{
      body:{
          "head-plug": "<div class='head-plug'/>"
      }
  }  
};