dataFilter = {
    cropData: function(featureCollection, boundary, model) {        //supports cropping points only right now..
        var deferred = $.Deferred();
        var attributesList = model.getAttributes();
        setTimeout(function() {
            var boundaryLayer = L.geoJson(boundary);
            var croppedFeaturesArray = [];
            for (var feature in featureCollection["features"]) {
                if (featureCollection["features"][feature]["geometry"]["type"] === "Point" || featureCollection[feature]["geometry"]["type"] === "point") {
                    if (leafletPip.pointInLayer(featureCollection["features"][feature]["geometry"]["coordinates"], boundaryLayer, true).length)
                        croppedFeaturesArray.push(featureCollection["features"][feature]);
                    else
                        delete attributesList["points"][featureCollection["features"][feature]["properties"]["_cartomancer_id"]];
                }
            }
            
            featureCollection["features"] = croppedFeaturesArray;
            deferred.resolve(featureCollection);
        }, 0);
        return deferred.promise();
    }
};