function HelperFeatures(options) {
    var features = {
        "road": function(options) {
            setTimeout(function() {
                /*var feature = {
                 type: options.feature.type,
                 properties: options.feature.properties,
                 geometry: {
                 type: options.feature.geometry.type,
                 coordinates: options.feature.geometry.coordinates.map(function(item, index){
                 return [item[0]+0.00003, item[1]+0.00003];
                 })
                 }
                 };*/
                drawHelpers(options.feature, {
                    weight: 6,
                    opacity: 1,
                    color: "#999999",
                    fillColor: "#669999",
                    lineCap: "butt",
                    lineJoin: "miter",
                }, options.layerGroup, options.popup);
                drawHelpers(options.feature, options.styles["road"], options.layerGroup, options.popup);
            }, 0);

        },
        "sewerage": function(options) {

            setTimeout(function() {

            }, 0);

        },
        "water-supply": function(options) {

            setTimeout(function() {

            }, 0);

        },
        "space": function(options) {

            setTimeout(function() {

            }, 0);

        },
        "heritage": function(options) {

            setTimeout(function() {

            }, 0);

        }
    };

    function drawHelpers(feature, style, layerGroup, popup) {
        var geojsonLayer = L.geoJson(feature, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup(popup._content);
                layer.setStyle(style);
                layerGroup.addLayer(layer);
            }
        });
        //layerGroup.addLayer(geojsonLayer);
    }

    this.addFeatureStyle = function(options) {
        return features[options["feature-group"]](options);
    };

}