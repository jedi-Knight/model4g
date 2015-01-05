$(document).ready(function() {
    /*$("#map").css({
     //        height: $(document).innerHeight() - 20,
     //        position: "initial !important"
     });*/


    var cartograph = new Map();
    $("#map").find("a.leaflet-control-zoom-out").text("–");
    var map = cartograph.getMap();

    //console.log(map.getPanes().tilePane);
    //$(map.getPanes().tilePane).addClass("grayscale");

    map.on("baselayerchange", function(layer) {
        $(map.getPanes().tilePane).toggleClass("grayscale", layer.name === "OpenStreetMap Grayscale");
    });

    //var popup = new Popup();
    mapGlobals = {
        map: map
    };


    /*var osmWays = L.geoJson(null, {
     onEachFeature: function(feature, layer) {
     setTimeout(function() {
     layer._container.setAttribute("title", "This is a " + feature.geometry.type.replace("String", "") + " feature. Click to have a look at some of its attributes.");
     
     layer.setStyle(feature.geometry.type === "Polygon" ? Styles.polygonStyle : Styles.lineStyle);
     layer.on("click", function(e) {
     popup.setLatLng(e.latlng);
     popup.openOn(map);
     popup.setContent(new TableContent(feature.properties, true));
     popup.update();
     });
     }, 0);
     },
     className: "vector-layer"
     }).addTo(map);*/


    var mapData = new Data();

    var modelQueryWardBoundary = mapData.fetchData({
        query: {
            geometries: {
                type: "polygons",
                group: "boundarymask"
            },
            url: "boundarymask.geojson"
        },
        returnDataMeta: {
        }
    });
    modelQueryWardBoundary.done(function(data, params) {


        var boundarymask = L.geoJson(data);
        boundarymask.setStyle(LayerStyles["boundary-mask-style"]);
        boundarymask.addTo(map);
        //console.log(data.features[0].geometry.coordinates[1]);

        var overviewMap = new UI_OverviewMap({
            map: map,
            zoom: 13,
            "ui-dom-id": "ui-overview-map",
            "ui-container-class": "ui-container-overview-map",
            "ui-map-box-class": "ui-overview-map-box",
            basemap: L.tileLayer('images/minimap_tiles/{z}/{x}/{y}.png', {
                //attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 13,
                minZoom: 13
            }),
            "ui-control-map": true,
            "overlays": function() {
                var areaboundary = $.extend(true, {}, data);
                //areaboundary.features[0].geometry.coordinates.reverse().pop();
                //console.log(areaboundary);
                return [L.geoJson(areaboundary)];
            }()
        });

        $("#mapBox").append(overviewMap.getUI());

        overviewMap.drawMap();

        /*map.setMaxBounds(L.latLngBounds(data.features[0].geometry.coordinates[1].map(function(coordinates){
         return {
         lat: coordinates[1],
         lng: coordinates[0]
         };
         })));*/

        map.setMaxBounds(L.latLngBounds(config["map-options"]["map-bounds"]["northeast"], config["map-options"]["map-bounds"]["southwest"]));

    });

    mapGlobals.mapData = mapData;

    var modelQueryPoints = mapData.fetchData({
        query: {
            geometries: {
                type: "points",
                group: config["map-of"]
            },
            url: "incidents.json",
        },
        override: {
            "api-url": config["road-report-api"]["url-query-report"]
        },
        returnDataMeta: {
            type: "ushahidi_JSON"
        }
    });

    modelQueryPoints.done(function(data, params) {

        var cropData = dataFilter.cropData(data, {
            type: "Feature",
            geometry: {
                type: "Polygon",
                properties: {},
                coordinates: [mapData.getGeometries()["polygons"]["boundarymask"]["features"][0]["geometry"]["coordinates"][1]]
            }
        }, mapData);

        cropData.done(function(data) {

            var clusterGeoJson = L.geoJson(data, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.divIcon({
                            className: "hidden"  //does this code do anything?
                        })
                    });
                },
                onEachFeature: function(feature, layer) {
                    //console.log(feature);
                    var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
                    feature.properties.title = attributes.name/*+", "+attributes.city*/;
                }
            });



            var clusterSpell = new Cluster(data.features /*, {
             clusteringOptions: {
             iconCreateFunction: function(cluster) {
             
             var clusterElement = this;
             console.log(this._markers);
             setTimeout(function() {
             $.map(clusterElement._markers, function(marker, index) {
             console.log(marker);
             marker.on("popupopen", function() {
             console.log(this);
             });
             });
             }, 0);
             
             var childCount = cluster.getChildCount();
             
             var c = ' marker-cluster-';
             if (childCount < 10) {
             c += 'small';
             } else if (childCount < 100) {
             c += 'medium';
             } else {
             c += 'large';
             }
             
             return new L.DivIcon({html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)});
             }
             }
             }*/);



            //console.log(clusterSpell.getClusterGroup());

            clusterSpell.done(function(clusterGroup) {

                clusterGroup.addTo(map);

                //console.log(clusterSpell.getClusterGroup()._featureGroup._layers);
                var cluster = clusterSpell.getClusterGroup()._featureGroup._layers[Object.keys(clusterSpell.getClusterGroup()._featureGroup._layers)[0]].__parent;
                //console.log(clusterSpell.getClusterGroup());

                //console.log(cluster);
                var loadPicture = function() {

                    console.log(this);
                    var element = this;
                    var setPosition = $.extend(true, {}, element._latlng);
                    setPosition.lat += 0.0005;
                    map.setView(setPosition, 18,{
                        animate:false
                    });
                    $("#glass").remove();

                    //setTimeout(function() {

                        //var markerPt = map.latLngToLayerPoint(marker._latlng);

                        //console.log(marker);

                        if ($(element._popup._content).find("img").length) {
                            
                            //deferred.resolve();
                            //deferred.done(function() {
                            var popupRt = element._popup._content.getBoundingClientRect();
                            var glass = new MagnifyingGlass.MagnifyingGlass({
                                target: $(element._popup._content).closest(".leaflet-popup")[0]
                                        //target: $(marker._popup._content).find("img").parent()[0]
                                , glass_diameter: 300
                                , power: 3
                                        //, offsetX: markerPt.x - 100
                                        //, offsetY: markerPt.y
                                , offsetX: popupRt.left
                                , offsetY: popupRt.top
                            });
                            glass.magnification.start();
                            return;
                        }

                        $(element._popup._content).find(".panel-document-footer, .panel-document-body").remove();
                        var marker = element;
                        $(element._popup._content).find(".panel-document-header").append(function() {
                            return new UI_PictureBox({
                                src: marker.pointAttributes.pictures[0].photo
                            }).getUI();
                        });
                        //marker._leaflet_events.popupopen.pop();
                        $(marker._icon).click();
                        $(marker._icon).click();
                        var popupRt = element._popup._content.getBoundingClientRect();
                        console.log(popupRt);

                        $(element._popup._content).find("#glass").remove();
                        //deferred.resolve();
                        //deferred.done(function() {
                        var glass = new MagnifyingGlass.MagnifyingGlass({
                            target: $(marker._popup._content).closest(".leaflet-popup")[0]
                                    //target: $(marker._popup._content).find("img").parent()[0]
                            , glass_diameter: 300
                            , power: 3
                                    //, offsetX: markerPt.x - 100
                                    //, offsetY: markerPt.y
                            , offsetX: popupRt.left
                            , offsetY: popupRt.top
                        });
                        glass.magnification.start();
                        //console.log(glass);
                        //});
                    //}, 2000);

                };

                var clusterLayers = clusterSpell.getClusterGroup()._featureGroup._layers;
                $.map(clusterLayers, function(layer, index) {
                    //console.log(layer);
                    try {
                        layer._leaflet_events.popupopen.push({
                            action: loadPicture,
                            context: layer
                        });

                    } catch (e) {
                        $.map(layer._markers, function(marker, index) {
                            //console.log(marker);
                            marker._leaflet_events.popupopen.push({
                                action: loadPicture,
                                context: marker
                            });

                        });
                    }
                });

                /*$.map(cluster._markers, function(marker, index) {
                 //console.log(marker);
                 marker._leaflet_events.popupopen.push({
                 action: loadPicture,
                 context: marker
                 });
                 });*/

                map.fire("zoomend");
            });
        });


    });

    map.on("dragstart", function(e){
       this.closePopup(); 
    });



    map.on("zoomend", function() {
        setTimeout(function() {
            $("#map").find("div.marker-cluster").attrByFunction(function() {
                return {
                    "title": $(this).find("span").text() + " " + config["map-of"] + " in this cluster. Click to zoom in."
                };
            });

        }, 0);
    });


    map.fire("dragend");


//TODO: ROAD REPORT SUBMISSION BUTTON
    /*$("<div class='leaflet-control' aria-haspopup='true'/>").append($("<div/>").append(new UI_Button({
     attributes: {
     class: "ui-button-submit-report leaflet-clickable"
     },
     eventHandlers: {
     click: function() {
     if ($("#mapBox").find(".info-popup.new-report").length)
     return;
     //alert("hello");
     
     setTimeout(function() {
     $("<div class='info-popup new-report'>Move the marker labelled <b>\"New Report\"</b> to the report's location on the map..</div>").appendTo("#mapBox");
     L.marker(map.getCenter(), {
     icon: L.divIcon(Styles["new-report-iconStyle"]),
     draggable: true
     }).on("dragend", function(e) {
     var element = this;
     $("#mapBox").find(".info-popup.new-report").text("..now please fill up the following form to submit the report.");
     (new UI_Form({
     "title": "New report",
     "form": config["report-form"],
     "lat": element.getLatLng().lat,
     "lng": element.getLatLng().lng,
     "submission-url": config["road-report-api-url"],
     "successful-submission-message": "Report submitted. Thank you for your contribution."
     }).getUI()).appendTo("#mapBox");
     }).addTo(map);
     
     }, 0);
     }
     },
     content: "<div class='icon-submit-report'>Submit a Report</div>"
     }))).appendTo($("#map").find(".leaflet-control-container .leaflet-top.leaflet-right"));*/

    /*var overviewMap = new UI_OverviewMap({
     map: map,
     zoom: 13,
     "ui-dom-id": "ui-overview-map",
     "ui-container-class": "ui-container-overview-map",
     basemap: L.tileLayer('images/minimap_tiles/{z}/{x}/{y}.png', {
     //attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
     maxZoom: 13,
     minZoom: 13
     }),
     "ui-control-map": true
     });
     
     $("#mapBox").append(overviewMap.getUI());
     
     overviewMap.drawMap();*/
    map.fire("moveend");

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
