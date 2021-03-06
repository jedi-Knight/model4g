$(document).ready(function() {
    $("#map").css({
        "width": "100%"
//        ,position: "initial !important"
    });


    var cartograph = new Map({
        mapOptions: {
            minZoom: 15
        }
    });
    $("#map").find("a.leaflet-control-zoom-out").text("–");
    var map = cartograph.getMap();


    map.on("baselayerchange", function(layer) {
        $(map.getPanes().tilePane).toggleClass("grayscale", layer.name === "OpenStreetMap Grayscale");
    });

    var popup = new Popup();
    mapGlobals = {
        map: map,
        cartograph: cartograph
    };




    var mapData = new Data();

    var helperFeatures = new HelperFeatures();

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
        //console.log(boundarymask._layers[Object.keys(boundarymask._layers)[0]]._container);
        $(boundarymask._layers[Object.keys(boundarymask._layers)[0]]._container).attr("class", "area-boundary");
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




    /*var wardProjectsLayers = {
     "road": L.layerGroup(),
     "sewerage": L.layerGroup(),
     "water-supply": L.layerGroup(),
     "space": L.layerGroup(),
     "heritage": L.layerGroup()
     };
     var municipalProjectsLayers = {
     "road": L.layerGroup(),
     "sewerage": L.layerGroup(),
     "water-supply": L.layerGroup(),
     "space": L.layerGroup(),
     "heritage": L.layerGroup()
     };*/

    var layerGroupExtendedOptions = function() {
        var layerGroup = L.layerGroup();
        layerGroup["min-zoom"] = LayerStyles["map-features"]["min-zoom"];
        layerGroup["max-zoom"] = LayerStyles["map-features"]["max-zoom"];
        return layerGroup;
    };



    /*var projectsLayers = {
     "road": L.layerGroup(),
     "sewerage": L.layerGroup(),
     "water-supply": L.layerGroup(),
     "space": L.layerGroup(),
     "heritage": L.layerGroup()
     };*/

    var projectsLayers = {
        "सडक मर्मत": new layerGroupExtendedOptions(),
        "ढल/मंगाल निर्माण तथा मर्मत": new layerGroupExtendedOptions(),
        //"खानेपानी पाइपलाइन मर्मत": new layerGroupExtendedOptions(),
        "सार्वजनिक जग्गा संरक्ष्यण": new layerGroupExtendedOptions(),
        "पुरातात्विक धरोहरको संरक्ष्यण": new layerGroupExtendedOptions()
    };



    mapGlobals.layerGroup = projectsLayers;

    //cartograph.getLayersControl().addOverlay(wardProjectsLayerGroup, "Ward-level Projects");
    //cartograph.getLayersControl().addOverlay(municipalProjectsLayerGroup, "Municipal-level Projects");

    /*var layersControlWardProjects = L.control.layers(null, wardProjectsLayers, {
     position: "topleft",
     collapsed: false
     }).addTo(map);
     
     var layersControlMunicipalProjects = L.control.layers(null, municipalProjectsLayers, {
     position: "topleft",
     collapsed: false
     }).addTo(map);*/

    var layersControlProjects = L.control.layers(null, projectsLayers, {
        position: "topright",
        collapsed: true
    }).addTo(map);

    cartograph.getLayersControl().expanded = true;

    (new UI_SlidingTabs({
        tabs: [
            /*{
             "title": "Ward-level Projects",
             "content": $(layersControlWardProjects._container).find("form")
             },
             {
             "title": "Municipal-level Projects",
             "content": $(layersControlMunicipalProjects._container).find("form")
             }*/
            {
                "title": "वडा भित्रका आयोजनाहरु",
                "content": $(layersControlProjects._container).find("form")
            }
        ],
        attributes: {
            "class": "leaflet-control hidden",
            "aria-haspopup": "true"
        },
        "tabs-trigger-eventHandlers": {
            /*"click": function(e) {
             
             var element = this;
             setTimeout(function() {
             $(element).parent().siblings().find("label").click();
             $(element).siblings(".content").find("label").click();
             
             }, 0);
             }*/
        }
    })).done(function(uiElement) {
        uiElement.appendTo($("#map .leaflet-control-container .leaflet-right")[0]);
        /*$(layersControlWardProjects._container).remove();
         $(layersControlMunicipalProjects._container).remove();*/
        $(layersControlProjects._container).remove();

        setTimeout(function() {
            uiElement.find("input").click();


            var labelCSSClass = {};

            for (var cssClass in LayerStyles["ui-legend"]["css-class"]) {
                labelCSSClass[LayerStyles["ui-legend"]["css-class"][cssClass]] = cssClass;
            }

            uiElement.find("label").each(function() {
                var element = this;
                setTimeout(function() {
                    $(element).find("input").after(function() {
                        return $("<div/>").addClass("ui-legend-icon").addClass(labelCSSClass[$(this).siblings("span").text().trim()]);
                    });
                }, 100);
            }, 0);
        }, 1000);


        /*(new UI_Button({
         attributes: {
         class: "ui-control-layer-switcher leaflet-control"
         },
         eventHandlers: {
         click: function(e) {
         if (map.getZoom() >= LayerStyles["map-features"]["min-zoom"])
         return;
         setTimeout(function() {
         //if (element.getZoom() >= LayerStyles["map-features"]["min-zoom"]) {
         $(".marker-cluster").toggle();
         //} else
         //  $(".marker-cluster").show();
         }, 0);
         
         setTimeout(function() {
         $.map(projectsLayers, function(layerGroup, index) {
         setTimeout(function() {
         
         layerGroup.getLayers().map(function(layer, index) {
         setTimeout(function() {
         //console.log(layer);
         //console.log($(layer._path).attr("stroke-opacity"));
         layer.setStyle({
         opacity: Number($(layer._path).attr("stroke-opacity")) < 1 ? 1 : 0,
         clickable: false
         });
         }, 0);
         });
         
         }, 0);
         });
         }, 0);
         
         
         setTimeout(function() {
         uiElement.toggleClass("hidden show");
         //uiElement.addClass("show");
         });
         }
         },
         content: function() {
         return "<div class='icon'>Click here to view all projects</div>";
         }
         }).prependTo($("#map .leaflet-control-container .leaflet-right")[0]));*/

    });






    mapGlobals.mapData = mapData;


    function drawLinesAndPolygons(feature, layer, layerGroup) {
        //console.log(feature);
        var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
        feature.properties.title = attributes.name/*+", "+attributes.city*/;

        feature.properties["min-zoom"] = LayerStyles["map-features"]["min-zoom"];

        setTimeout(function() {

            //for (var point in features) {
            var pointAttributes = feature.properties.getAttributes(feature.properties._cartomancer_id);


            var dom = new PanelDocumentModel(pointAttributes);

            var panelDocument = new PanelDocument(dom.documentModel);
            panelDocument.addToTitleBar(dom.titleBarJson);
            panelDocument.addHeader(dom.headerJson);
            panelDocument.addTabs(dom.tabsJson, PlugsForStyling.popup && PlugsForStyling.popup.body ? PlugsForStyling.popup.body : false);

            layer.bindPopup(panelDocument.getDocument(), {
                autoPan: true,
                keepInView: true
                        //,offset: L.point(0, -22)
            });

            layer.on("popupopen", function() {
                setTimeout(function() {
                    $("#map").find(".panel-document-header .header-row>div:last-child").each(function() {
                        if ($(this).outerHeight() > 56)
                            $(this).addClass("smaller-text");
                    });
                }, 0);
            });

            /* switch(pointAttributes["project-category"]){
             case "road": 
             {
             /*var newLine
             for(var c in feature.geometry.coordinates){
             
             }
             }
             }*/

            //layer.setStyle(LayerStyles["map-features"][layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id)["project-category"]]);
            layer.setStyle($.extend({}, LayerStyles["map-features"][layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id)["project-category"]], {opacity: 0, fillOpacity: 0}));

            setTimeout(function() {
                layer.__events = $.extend(true, {}, layer._leaflet_events);
            }, 0);


            //layer.setStyle(LayerStyles["map-features"]["road"]);
            //layer.addTo(map);
            if (layerGroup) {
                layerGroup.addLayer(layer);

                helperFeatures.addFeatureStyle({
                    "feature-group": feature["properties"]["getAttributes"](feature["properties"]["_cartomancer_id"])["project-category"],
                    "styles": LayerStyles["map-features"]["helper-styles"],
                    "layerGroup": layerGroup,
                    "popup": layer._popup,
                    "feature": feature
                });
            }

            //map.addLayer(layerGroup);
        }, 0);


    }

    function drawPoints(feature, layer, deferred) {
        //console.log(feature);
        var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
        feature.properties.title = attributes.name/*+", "+attributes.city*/;
        feature.properties["max-zoom"] = 17;
        feature.properties["min-zoom"] = 14;

        setTimeout(function() {

            //for (var point in features) {
            var pointAttributes = feature.properties.getAttributes(feature.properties._cartomancer_id);


            var dom = new TolePanelDocumentModel(pointAttributes);

            var panelDocument = new PanelDocument(dom.documentModel);
            panelDocument.addToTitleBar(dom.titleBarJson);
            panelDocument.addHeader(dom.headerJson);
            panelDocument.addTabs(dom.tabsJson, PlugsForStyling.popup && PlugsForStyling.popup.body ? PlugsForStyling.popup.body : false);

            layer.bindPopup(panelDocument.getDocument(), {
                autoPan: true,
                keepInView: true
                        //,offset: L.point(0, -22)
            });

            layer.on("popupopen", function() {
                setTimeout(function() {
                    $("#map").find(".panel-document-header .header-row>div:last-child").each(function() {
                        if ($(this).outerHeight() > 56)
                            $(this).addClass("smaller-text");
                    });
                }, 0);
            });


            /*if (layerGroup)
             layerGroup.addLayer(layer);*/
            map.addLayer(layer);
        }, 0);


    }

    var modelQueryToleLocations = mapData.fetchData({
        query: {
            geometries: {
                type: "points",
                group: "toles"
            },
            url: "toles.geojson"
        },
        returnDataMeta: {
        }
    });

    /*modelQueryToleLocations.done(function(data, params) {
     
     var zoomingDeferred;
     
     var point = L.geoJson(data, {
     onEachFeature: function(feature, layer) {
     drawPoints(feature, layer, zoomingDeferred);
     },
     pointToLayer: function(feature, latlng) {
     return L.marker(latlng, {
     icon: L.divIcon({
     html: function() {
     var infobox = $("<div/>").addClass("marker-info-box");
     infobox.append(new UI_Button({
     attributes: {
     class: "marker-info-zoom-trigger"
     },
     eventHandlers: {
     click: function(e) {
     
     },
     mouseenter: function(e) {
     console.log("mouseover marker");
     console.log(e);
     }
     },
     content: "<div>" + feature.properties.getAttributes(feature.properties._cartomancer_id).name + "</div>"
     }));
     return infobox.html();
     }()
     })
     }).on("click", function(e) {
     zoomingDeferred = $.Deferred();
     map.setView(latlng, 18, {
     animate: true
     });
     setTimeout(function() {
     zoomingDeferred.resolve();
     });
     //console.log(this);
     }).on("mouseover", function(e) {
     //console.log(e);
     setTimeout(function() {
     map.eachLayer(function(layer) {
     if (!layer.feature)
     return;
     if (layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id).tole !== feature.properties.getAttributes(feature.properties._cartomancer_id).tole)
     return;
     try {
     layer.setStyle(
     LayerStyles["map-features"]["on-tole-hovered"][layer.feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]
     );
     } catch (e) {
     console.log(feature.properties.getAttributes(feature.properties._cartomancer_id));
     }
     });
     }, 0);
     }).on("mouseout", function(e) {
     //console.log(e);
     setTimeout(function() {
     map.eachLayer(function(layer) {
     if (!layer.feature)
     return;
     if (layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id).tole !== feature.properties.getAttributes(feature.properties._cartomancer_id).tole)
     return;
     try {
     layer.setStyle({
     opacity: 0
     
     });
     } catch (e) {
     console.log(feature.properties.getAttributes(feature.properties._cartomancer_id));
     }
     });
     }, 0);
     });
     }
     });
     
     });*/



    var modelQueryProjectCentroids = mapData.fetchData({
        query: {
            geometries: {
                type: "points",
                group: "projectcentroids"
            },
            url: "projectcentroids.geojson"
        },
        returnDataMeta: {
        }
    });

    modelQueryProjectCentroids.done(function(data, params) {
        /*var modelQueryPoints = mapData.fetchData({
         query: {
         geometries: {
         type: "points",
         group: config["map-of"]
         }
         },
         returnDataMeta: {
         //            type: "formhub_JSON"
         }
         });*/

        //modelQueryPoints.done(function(data, params) {

        /*var clusterGeoJson = L.geoJson(data, {
         pointToLayer: function(feature, latlng) {
         return L.marker(latlng, {
         icon: L.divIcon({
         className: "hidden"
         })
         });
         },
         onEachFeature: function(feature, layer) {
         //console.log(feature);
         var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
         feature.properties.title = attributes.name/*+", "+attributes.city*\/;
         }
         });*/



        /*var clusterSpell = new Cluster(data.features, {
         clusteringOptions: {
         singleMarkerMode: true,
         disableClusteringAtZoom: LayerStyles["map-features"]["min-zoom"],
         maxClusterRadius: 160,
         removeOutsideVisibleBounds: false,
         showCoverageOnHover: true
         }
         });
         
         clusterSpell.done(function(clusterGroup) {
         
         clusterGroup.addTo(map);
         //layerGroup.addLayer(layer);
         map.fire("zoomend");
         //cartograph.getLayersControl().addOverlay(clusterGroup, "Schools / School Clusters");
         console.log(clusterGroup);
         });*/

        setTimeout(function() {
            var clusterGroup = L.markerClusterGroup({
                //singleMarkerMode: true,
                disableClusteringAtZoom: LayerStyles["map-features"]["min-zoom"],
                maxClusterRadius: 160,
                removeOutsideVisibleBounds: false,
                showCoverageOnHover: false,
                iconCreateFunction: function(cluster) {
                    $(cluster).hover(function(e) {
                        //console.log(cluster);
                        var clusterElement = this;
                        //setTimeout(function() {
                        //console.log(clusterElement);
                        var hoveredFeatures_cartomancer_ids = clusterElement._markers ? $.map(clusterElement._markers, function(marker, index) {
                            //console.log(marker.feature);
                            if (e.type === "mouseenter") {
                                marker.addTo(map);
                                $(cluster._icon).css("z-index", 1000);
                            } else {
                                map.removeLayer(marker);
                                $(cluster._icon).css("z-index", 1);
                            }
                            return marker.feature.properties._cartomancer_id;
                        }) : [clusterElement.feature.properties._cartomancer_id];
                        //console.log(hoveredFeatures_cartomancer_ids);

                        /* $.map(projectsLayers, function(layerGroup, index) {
                         //setTimeout(function() {
                         //console.log(layerGroup)
                         layerGroup.getLayers().map(function(layer, index) {
                         //console.log(hoveredFeatures_cartomancer_ids);
                         //console.log(layer.feature.properties["_cartomancer_id"]);
                         if ($.inArray(layer.feature.properties["_cartomancer_id"], hoveredFeatures_cartomancer_ids)+1){
                         //console.log(e);
                         if (e.type === "mouseenter") {
                         //setTimeout(function() {
                         //console.log(layer);
                         //console.log($(layer._path).attr("stroke-opacity"));
                         layer.setStyle({
                         opacity: 1,
                         clickable: false
                         });
                         //}, 0);
                         } else {
                         layer.setStyle({
                         opacity: 0,
                         clickable: false
                         });
                         }
                         }
                         
                         
                         
                         });
                         
                         //}, 0);
                         });*/
                        //}, 0);

                    });
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
            }).addLayer(L.geoJson(data, {
                onEachFeature: function(feature, layer) {

                },
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: "../markers/flag_orange.png",
                            iconSize: [20, 20],
                            iconAnchor: [4, 20]
                        })
                    });
                }
            })).addTo(map);
            //console.log(clusterGroup);
            $.map(clusterGroup._featureGroup._layers, function(cluster, index) {
                setTimeout(function() {
                    /* $(cluster).hover(function(e) {
                     var clusterElement = this;
                     //setTimeout(function() {
                     //console.log(clusterElement);
                     var hoveredFeatures_cartomancer_ids = clusterElement._markers ? $.map(clusterElement._markers, function(marker, index) {
                     return marker.feature.properties._cartomancer_id;
                     }) : [clusterElement.feature.properties._cartomancer_id];
                     $.map(projectsLayers, function(layerGroup, index) {
                     //setTimeout(function() {
                     
                     layerGroup.getLayers().map(function(layer, index) {
                     //console.log(hoveredFeatures_cartomancer_ids);
                     //console.log(layer.feature.properties["_cartomancer_id"]);
                     if ($.inArray(layer.feature.properties["_cartomancer_id"], hoveredFeatures_cartomancer_ids))
                     //console.log(e);
                     if (e.type === "mouseenter") {
                     //setTimeout(function() {
                     //console.log(layer);
                     //console.log($(layer._path).attr("stroke-opacity"));
                     layer.setStyle({
                     opacity: 1,
                     clickable: false
                     });
                     //}, 0);
                     } else {
                     layer.setStyle({
                     opacity: 0,
                     clickable: false
                     });
                     }
                     
                     
                     });
                     
                     //}, 0);
                     });
                     //}, 0);
                     });*/
                }, 0);
            });
        }, 0);


        //});
    });




    /* var modelQueryWardLines = mapData.fetchData({
     query: {
     geometries: {
     type: "lines",
     group: "ward"
     },
     url: "projects_ward_lines.geojson"
     },
     returnDataMeta: {
     }
     });
     
     modelQueryWardLines.done(function(data, params) {
     
     var lines = L.geoJson(data, {
     onEachFeature: function(feature, layer) {
     drawLinesAndPolygons(feature, layer, wardProjectsLayers[feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]);
     }
     });
     
     });
     
     var modelQueryWardPolygons = mapData.fetchData({
     query: {
     geometries: {
     type: "polygons",
     group: "ward"
     },
     url: "projects_ward_polygons.geojson"
     },
     returnDataMeta: {
     }
     });
     
     modelQueryWardPolygons.done(function(data, params) {
     
     var polygons = L.geoJson(data, {
     onEachFeature: function(feature, layer) {
     drawLinesAndPolygons(feature, layer, wardProjectsLayers[feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]);
     }
     });
     
     
     });
     
     
     var modelQueryMunicipalLines = mapData.fetchData({
     query: {
     geometries: {
     type: "lines",
     group: "municipal"
     },
     url: "projects_municipal_lines.geojson"
     },
     returnDataMeta: {
     }
     });
     
     modelQueryMunicipalLines.done(function(data, params) {
     
     var lines = L.geoJson(data, {
     onEachFeature: function(feature, layer) {
     drawLinesAndPolygons(feature, layer, municipalProjectsLayers[feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]);
     }
     });
     
     });
     
     var modelQueryMunicipalPolygons = mapData.fetchData({
     query: {
     geometries: {
     type: "polygons",
     group: "municipal"
     },
     url: "projects_municipal_polygons.geojson"
     },
     returnDataMeta: {
     }
     });
     
     modelQueryMunicipalPolygons.done(function(data, params) {
     
     var polygons = L.geoJson(data, {
     onEachFeature: function(feature, layer) {
     drawLinesAndPolygons(feature, layer, municipalProjectsLayers[feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]);
     }
     });
     
     
     });*/

    var modelQueryProjectFeatures = mapData.fetchData({
        query: {
            geometries: {
                type: "lines",
                group: "ward"
            },
            url: "combined.geojson"
        },
        returnDataMeta: {
        }
    });

    modelQueryProjectFeatures.done(function(data, params) {

        var lines = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                drawLinesAndPolygons(feature, layer, projectsLayers[LayerStyles["ui-legend"]["css-class"][feature.properties.getAttributes(feature.properties._cartomancer_id)["project-category"]]]);
            }
        });

    });






    map.on("zoomend", function() {
        var element = this;
        setTimeout(function() {
            /*$("#map").find("div.marker-cluster").attrByFunction(function() {
             return {
             "title": $(this).find("span").text() + " " + config["map-of"] + " in this cluster. Click to zoom in."
             };
             });*/
            setTimeout(function() {
                if (element.getZoom() >= LayerStyles["map-features"]["min-zoom"]) {
                    $(".marker-cluster").hide();
                    $(".leaflet-marker-icon").hide();
                    $(".leaflet-control.ui-sliding-tabs").removeClass("hidden show");
                } else {
                    $(".marker-cluster").show();
                    $(".leaflet-marker-icon").show();
                    $(".leaflet-control.ui-sliding-tabs:not(.show)").addClass("hidden");
                }
            }, 0);

            setTimeout(function() {
                $.map(projectsLayers, function(layerGroup, index) {
                    setTimeout(function() {
                        if (element.getZoom() < layerGroup["min-zoom"]) {
                            layerGroup.getLayers().map(function(layer, index) {
                                setTimeout(function() {
                                    layer.setStyle({
                                        opacity: 0,
                                        fillOpacity: 0,
                                        //clickable: false
                                    });
                                    //layer.__popup = $.extend({},layer._popup);
                                    layer._leaflet_events = null;
                                    //console.log(layer);
                                    // $(layer._container).find("path").addClass("tile");
                                    //console.log($(layer._container).find("path"));
                                }, 0);
                            });
                        } else {
                            layerGroup.getLayers().map(function(layer, index) {
                                setTimeout(function() {
                                    layer.setStyle({
                                        opacity: 1,
                                        fillOpacity: 1,
                                        //clickable: true
                                    });
                                    setTimeout(function() {
                                        layer._leaflet_events = layer.__events;
                                    }, 0);
                                    //console.log(layer);
                                    //console.log($(layer._container).find("path"));
                                    //$(layer._container).find("path").removeClass("tile");
                                }, 0);
                            });
                        }
                    }, 0);
                });
            }, 0);

            /*element.eachLayer(function(layer) {
             if (!layer.feature)
             return;
             //console.log(layer.feature);
             if (!(layer.feature.properties["min-zoom"] || layer.feature.properties["max-zoom"]))
             return;
             
             try {
             
             if (element.getZoom() < layer.feature.properties["min-zoom"])
             layer.setStyle({
             opacity: 0,
             clickable: false
             });
             else {
             /*console.log({
             layer: layer,
             category:layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id)["project-category"],
             attributes: layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id),
             styleCollection: LayerStyles["map-features"],
             styleID: layer.feature.properties.getAttributes(layer.feature.properties._cartomancer_id)["project-category"]
             });*\/
             
             layer.setStyle({
             opacity: 1,
             clickable: true
             });
             }
             
             
             } catch (e) {
             
             if (element.getZoom() > layer.feature.properties["max-zoom"]) {
             console.log(layer);
             $(layer._icon).css("display", "none");
             } else {
             $(layer._icon).css("display", "inline-block");
             }
             
             }
             
             
             
             
             });*/



        }, 0);
    });

    //$("#mapBox").toggleClass("smaller larger");
    map.fire("dragend");


    /*var overviewMap = new UI_OverviewMap({
     map: map,
     zoom: 13,
     "ui-dom-id": "ui-overview-map",
     "ui-container-class": "ui-container-overview-map",
     basemap: L.tileLayer('../images/minimap_tiles/{z}/{x}/{y}.png', {
     //attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
     maxZoom: 13,
     minZoom: 13
     }),
     "ui-control-map": true
     });
     
     $("#mapBox").append(overviewMap.getUI());
     
     overviewMap.drawMap();*/


    map.fire("moveend");

    /*map.on("zoomstart zoomend", function() {
     //console.log(1);
     /*setTimeout(function() {
     if (map.getZoom() >= 17) {
     
     
     $(".marker-cluster").find("span").each(function() {
     $(this).addClass("hidden");
     
     });
     } else {
     
     $(".marker-cluster").find("span").each(function() {
     $(this).removeClass("hidden");
     
     });
     }
     }, 0);
     
     });*/

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
