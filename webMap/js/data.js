function Data() {

    var geometries = {
        points: {
        },
        polygons: {
        }
    };

    var attributes = {
        points: {
        },
        polygons: {
        }
    };

    var freeTables = {
    };

    var summaries = {
        groups: {
        }
    };

    var _plugins = {};

    this.plugins = _plugins;

    /**temporary hack:**/
    this.getGeometries = function() {
        return geometries;
    };
    this.getAttributes = function(query) {

        return attributes;
    };
    
    this.getFeatureIndexForAttribute = function (feature, attribute){
      var featureIndexForAttribute = {};
      for(var c in attributes[feature]){
        if(attributes[feature][c][attribute]) featureIndexForAttribute[c] = {
            attribute: attributes[feature][c][attribute],
            group: attributes[feature][c]._metaX.group
        };
      };
      return featureIndexForAttribute;
    };
    /**:temporary hack**/

    var thirdPartyAPIQueue = false;

    function queryModel(params) {
        console.log("querying local db");
        if (params.query.geometries) {

            if (geometries[params.query.geometries.type] && geometries[params.query.geometries.type][params.query.geometries.group]) {
                return geometries[params.query.geometries.type][params.query.geometries.group];
            } else
                return false;

        } else if (params.query.attributes) {
            switch (params.query.attrubutes.geometry) {
            }
        }
    }


    function onJSONReturn(data, params) {

        var writeQueryDeferred = $.Deferred();

        if (params.returnDataMeta.type === "formhub_JSON") {
            setTimeout(function() {

                var c = Object.keys(attributes.points).length;

                var geoJSONDB_geometries = {
                    type: "FeatureCollection",
                    properties: {
                        _cartomancer_group_startIndex: c
                    },
                    features: []
                };
                var geoJSONDB_attributes = {
                };





                for (var form in data) {

                    data[form]._geolocation[1] && data[form]._geolocation[0] ? geoJSONDB_geometries.features.push({
                        type: "Feature",
                        properties: {
                            datapoint_id: data[form]._id,
                            _cartomancer_id: c,
                            getAttributes: function(id) {
                                return attributes.points[id];
                            }
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [data[form]._geolocation[1], data[form]._geolocation[0]]
                        }
                    }) : function() {
                        if (!freeTables.formhub)
                            freeTables.formhub = {};
                        freeTables.formhub[data[form]._uuid] = data[form];
                    }();

                    delete data[form]._geolocation;
                    data[form]._metaX = {
                        dataSource: "formhub",
                        group: params.query.geometries.group
                    };


                    geoJSONDB_attributes[c] = data[form];

                    c++;
                }

                geometries.points[params.query.geometries.group] = geoJSONDB_geometries;
                $.extend(attributes.points, geoJSONDB_attributes);
                writeQueryDeferred.resolve();
            }, 0);



        } else {

            if (params.query.geometries) {
                if (geometries[params.query.geometries.type])
                    try{
                    Object.keys(params.query.geometries.group);
                    params.query.geometries.group = data.features[0].properties[params.query.geometries.group.column];
                        geometries[params.query.geometries.type][params.query.geometries.group] = data;
                    }catch(e){
                        geometries[params.query.geometries.type][params.query.geometries.group] = data;
                    }
                else
                    throw new Error();
                
                setTimeout(function(){
                    var c = Object.keys(attributes[params.query.geometries.type]).length;
                    var geojsonDB_attributes = {};
                    
                    for(var feature in geometries[params.query.geometries.type][params.query.geometries.group].features){
                        geojsonDB_attributes[c] = geometries[params.query.geometries.type][params.query.geometries.group].features[feature].properties;
                        
                        if(geometries[params.query.geometries.type][params.query.geometries.group]["features"][feature]["properties"]["@id"]){
                            geometries[params.query.geometries.type][params.query.geometries.group].features[feature].properties.id
                            = geometries[params.query.geometries.type][params.query.geometries.group]["features"][feature]["properties"]["@id"];
                            delete geometries[params.query.geometries.type][params.query.geometries.group]["features"][feature]["properties"]["@id"];
                        }
                        
                        geometries[params.query.geometries.type][params.query.geometries.group].features[feature].properties = {
                            feature_id : geometries[params.query.geometries.type][params.query.geometries.group].features[feature].properties.id,
                            _cartomancer_id: c,
                            getAttributes: function(_cartomancer_id) {
                                return attributes[params.query.geometries.type][_cartomancer_id];
                            }
                        }
                        c++;
                    }
                    
                    $.extend(attributes[params.query.geometries.type], geojsonDB_attributes);
                    
                    
                    writeQueryDeferred.resolve();
                },0);
                
                
            } else if (params.query.attributes) {
                switch (params.query.attributes.geometry) {
                }
            }
            

        }

        return writeQueryDeferred.promise();
    }



    function summarize(params) {

    }



    this.fetchData = function(params) {
        return function(params) {
            var apiCall = $.Deferred();
            var modelQueryResult = queryModel(params);
            apiCall.resolve(modelQueryResult, params);
            return modelQueryResult ? apiCall.promise() : false;
        }(params) || function(params) {
            console.log("data not found in local cache..making ajax call;");
            var apiCall = $.Deferred();

            var url = config.api.url;
            var requestType = config.api.requestType;
            //var id="name";



            if (Boolean(params.url)) {
                url = params.url;
                //delete params.url;
            }
            if (Boolean(params.requestType)) {
                requestType = params.requestType;
            }
            //    if(Boolean(params.id)){
            //        id=params.id;
            //        delete params.id;
            //    }

            if (thirdPartyAPIQueue) {
                apiCall.resolve({
                    type: "FeatureCollection",
                    features: []
                }, params);
            } else {

                $.ajax({
                    type: requestType,
                    url: url,
                    data: params.query,
                    success: function(data) {
                        onJSONReturn(data, params).done(function() {



                            if (thirdPartyAPIQueue)
                                thirdPartyAPIQueue = false;

                            apiCall.resolve(queryModel(params), params);
                        });
                    },
                    dataType: "json",
                    cache: false
                            /*,headers: {Connection: "close"}*/
                });
            }
            if (function() {
                for (var api in config.otherAPIs) {
                    if (url === config.otherAPIs[api].url)
                        return true;
                }
                return false;
            }()) {
                thirdPartyAPIQueue = true;
            }


            return apiCall.promise();

        }(params);
    };
}
