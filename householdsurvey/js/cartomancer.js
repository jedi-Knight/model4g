$(document).ready(function() {
    $("#map").css({
//        height: $(document).innerHeight() - 20,
//        position: "initial !important"
    });


    var cartograph = new Map();
    $("#map").find("a.leaflet-control-zoom-out").text("–");
    var map = cartograph.getMap();

    //console.log(map.getPanes().tilePane);
    //$(map.getPanes().tilePane).addClass("grayscale");

    map.on("baselayerchange", function(layer) {
        $(map.getPanes().tilePane).toggleClass("grayscale", layer.name === "OpenStreetMap Grayscale");
    });

    var popup = new Popup();
    mapGlobals = {
        map: map
    };


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
        "buildings": new layerGroupExtendedOptions()
    };

    map.addLayer(projectsLayers["buildings"]);

    mapGlobals.layerGroup = projectsLayers;


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
                areaboundary.features[0].geometry.coordinates.reverse().pop();
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

    function drawLinesAndPolygons(feature, layer, layerGroup) {
        //console.log(feature);
        var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
        feature.properties.title = attributes.name/*+", "+attributes.city*/;

        //feature.properties["min-zoom"] = LayerStyles["map-features"]["min-zoom"];

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
            layer.setStyle($.extend({}, LayerStyles["map-features"]["buildings"], {opacity: 0, fillOpacity: 0}));



            //layer.setStyle(LayerStyles["map-features"]["road"]);
            //layer.addTo(map);
            if (layerGroup) {
                layerGroup.addLayer(layer);
            }

            /* helperFeatures.addFeatureStyle({
             "feature-group": feature["properties"]["getAttributes"](feature["properties"]["_cartomancer_id"])["project-category"],
             "styles": LayerStyles["map-features"]["helper-styles"],
             "layerGroup": layerGroup,
             "popup": layer._popup,
             "feature": feature
             });
             }*/

            //map.addLayer(layerGroup);
        }, 0);


    }




    var modelQueryPoints = mapData.fetchData({
        query: {
            geometries: {
                type: "polygons",
                group: config["map-of"],
            },
            url: config["data-src"]
        },
        returnDataMeta: {
//            type: "formhub_JSON"
        }
    });

    modelQueryPoints.done(function(data, params) {

        var polygons = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                drawLinesAndPolygons(feature, layer, projectsLayers["buildings"]);
            }
        });


        data = mapData.getGeometries({
            "geometry-type": "polygons",
            "feature-group": config["map-of"],
            "function": "getCentroids"
        });


        var clusterGeoJson = L.geoJson(data, {
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
                feature.properties.title = attributes.name/*+", "+attributes.city*/;
            }
        }).addTo(map);

        /*var searchControl = new L.Control.Search({
         layer: clusterGeoJson,
         zoom: 16,
         circleLocation: false,
         animateCircle: false
         });*/

        var popup = L.popup({
            autoPan: true,
            keepInView: true,
            offset: L.point(0, -4)
        });

        /*searchControl.on('search_locationfound', function(e) {
         console.log(e);
         /*e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
         if (e.layer._popup)
         e.layer.openPopup();*\/
         var pointAttributes = e.layer.feature.properties.getAttributes(e.layer.feature.properties._cartomancer_id);
         var dom = new PanelDocumentModel(pointAttributes);
         
         var panelDocument = new PanelDocument(dom.documentModel);
         panelDocument.addToTitleBar(dom.titleBarJson);
         panelDocument.addHeader(dom.headerJson);
         panelDocument.addTabs(dom.tabsJson, PlugsForStyling.popup && PlugsForStyling.popup.body ? PlugsForStyling.popup.body : false);
         
         popup.setContent(panelDocument.getDocument());
         popup.setLatLng(e.latlng);
         popup.openOn(map);
         
         popup.update();
         
         }).on('search_collapsed', function(e) {
         
         clusterGeoJson.eachLayer(function(layer) {	//restore feature color
         clusterGeoJson.resetStyle(layer);
         });
         });
         
         map.addControl(searchControl);*/






        /* var clusterSpell = new Cluster(data.features);
         clusterSpell.done(function(clusterGroup) {
         clusterGroup.addTo(map);
         map.fire("zoomend");
         });*/


        var clusterGroup = L.markerClusterGroup({
            singleMarkerMode: true,
            disableClusteringAtZoom: LayerStyles["map-features"]["min-zoom"],
            maxClusterRadius: 80,
            removeOutsideVisibleBounds: false,
            showCoverageOnHover: true,
            zoomToBoundsOnClick:false,
            iconCreateFunction: function(cluster) {

                var childCount = cluster.getChildCount();

                $(cluster).hover(function(e) {
                    //console.log(cluster);


                    var clusterElement = this;
                    var popup = L.popup({
                        className: "tooltip",
                        closeButton: false,
                        offset: childCount>100? L.point(0,-24): L.point(0,-12)
                    });
                    //setTimeout(function() {
                    //console.log(clusterElement);
                    //var hoveredFeatures_cartomancer_ids = clusterElement._markers ? $.map(clusterElement._markers, function(marker, index) {
                    //console.log(marker.feature);
                    if (e.type === "mouseenter") {
                        /*marker.addTo(map);
                         $(cluster._icon).css("z-index", 1000);*/

                        //var tooltip = function() {
                        var tooltip = $("<div/>");
                        var tooltipDef = {
                            "house:count": childCount,
                            " use Solar-power inverter": "power:solar_panel",
                            " self-manage sewage": "waste:blackwater",
                            " segregate bio-degradable waste from non-degradable": "waste:segregation"
                        };
                        tooltipDef.count = {
                        };
                        setTimeout(function() {
                            cluster.getAllChildMarkers().map(function(marker, index) {
                                var pointAttributes = $.extend(true, {}, marker.feature.properties.getAttributes(marker.feature.properties._cartomancer_id));
                                $.map(tooltipDef, function(dataKey, tooltipKey) {
                                    if (!tooltipDef.count[dataKey])
                                        tooltipDef.count[dataKey] = 0;
                                    switch (pointAttributes[dataKey]) {
                                        case "yes":
                                            pointAttributes[dataKey] = 1;
                                            break;
                                        case "no":
                                            pointAttributes[dataKey] = 0;
                                            break;
                                        case "septic tank":
                                            pointAttributes[dataKey] = 1;
                                            break;
                                        case "null":
                                            pointAttributes[dataKey] = 0;
                                            break;
                                        default:
                                            pointAttributes[dataKey] = Number(pointAttributes[dataKey]) ? Number(pointAttributes[dataKey]) : 0;
                                    }
                                    tooltipDef.count[dataKey] += pointAttributes[dataKey];
                                });
                            });

                            tooltip.append("<div class='content'>" + $.map(tooltipDef, function(dataKey, tooltipKey) {
                                if (tooltipKey === "count")
                                    return;
                                else if (tooltipKey === "house:count")
                                    return "There are " + childCount + " houses in this cluster. Of these";
                                return tooltipDef.count[dataKey] + tooltipKey;
                            }).join(", ") + "</div>");
                            //console.log(tooltip);

                            //console.log(tooltip.text());
                            popup.setLatLng(cluster._latlng);
                            popup.openOn(map);
                            $(popup._container).find(".leaflet-popup-content").append(tooltip);
                        }, 0);

                        //return tooltip;
                        //}();

                        //console.log(popup);

                        //popup.setContent(tooltip);


                    } else {
                        map.closePopup();
                        /*map.removeLayer(marker);
                         $(cluster._icon).css("z-index", 1);*/
                    }
                    //return marker.feature.properties._cartomancer_id;
                    //}) : [clusterElement.feature.properties._cartomancer_id];
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


                var c = ' marker-cluster-';
                if (childCount === 1) {
                    c += 'small hidden';
                } else if (childCount < 10) {
                    c += 'small';
                } else if (childCount < 100) {
                    c += 'medium';
                } else {
                    c += 'large';
                }






                return new L.DivIcon({html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)});
            },
            polygonOptions: {
                weight: 2,
                color: "#333333",
                opacity: 1,
                dashArray: "6 6",
                fillColor: "#ffcc00",
                fillOpacity: 0.6
            }
        }).addLayer(L.geoJson(data, {
            onEachFeature: function(feature, layer) {

            }
        })).addTo(map);



        var listColumnOptions = {
            header: "<h3>" + config["map-of"] + "</h3>",
            body: function() {
                var bodyTable = {};
                var pointAttributeList = mapData.getAttributes({
                    "order-by": "addr:street",
                    "geometry-type": "polygons",
                    "feature-group": config["map-of"]
                });
                for (var point in pointAttributeList) {
                    if (pointAttributeList[point]["addr:street"] && pointAttributeList[point]["addr:street"] !== "Others" && pointAttributeList[point]["addr:housenumber"]) {
                        bodyTable[pointAttributeList[point]["addr:housenumber"] + " - " + pointAttributeList[point]["addr:street"]] = function() {
                            if (highlightButton)
                                delete highlightButton;
                            var highlightButton = new UI_Button({
                                attributes: {
                                    _id: pointAttributeList[point]["_cartomancer_id"],
                                    class: "find-mapfeature"
                                },
                                eventHandlers: {
                                    click: function() {
                                        map.closePopup();

                                        map.setZoom(16, {
                                            animate: true
                                        });

                                        var buttonDOMElement = this;

                                        setTimeout(function() {
                                            var pointOfAttributes = mapData.getGeometries()["points"]["centroidsCollections"][config["map-of"]]["features"][$(buttonDOMElement).attr("_id")];
                                            //var pointAttributes = e.layer.feature.properties.getAttributes(e.layer.feature.properties._cartomancer_id);
                                            var dom = new PanelDocumentModel(pointOfAttributes.properties.getAttributes($(buttonDOMElement).attr("_id")));

                                            var panelDocument = new PanelDocument(dom.documentModel);
                                            panelDocument.addToTitleBar(dom.titleBarJson);
                                            panelDocument.addHeader(dom.headerJson);
                                            panelDocument.addTabs(dom.tabsJson, PlugsForStyling.popup && PlugsForStyling.popup.body ? PlugsForStyling.popup.body : false);

                                            popup.setContent(panelDocument.getDocument());

                                            var latlng = L.latLng(pointOfAttributes.geometry.coordinates[1], pointOfAttributes.geometry.coordinates[0]);

                                            popup.setLatLng(latlng);
                                            map.setView(latlng, 18, {
                                                animate: true
                                            });

                                            map.once("zoomend", function() {
                                                setTimeout(function() {
                                                    popup.openOn(map);

                                                    popup.update();
                                                }, 300);
                                            });
                                        }, 500);

                                        map.on("popupclose", function() {

                                        });

                                    }
                                },
                                content: "<div class='icon'>" + pointAttributeList[point]["addr:housenumber"] + " - " + pointAttributeList[point]["addr:street"] + "</div>"
                            });
                            //highlightButton.text("Show on the Map");
                            //highlightButton.append("<div class=icon/>");
                            return highlightButton;
                        }();
                    }
                }
                return bodyTable;
                //}
            }(),
            //footer: "<a class='ui-button-download-data'><div>Download as CSV</div></a>",
            footer: function() {/*
             var csvFileBlob;
             var url;
             var csvFileURL = "";
             var csvDataSource = mapData.getAttributes()["polygons"];
             var documentModel = new PanelDocumentModel(csvDataSource[0]);
             var csvColumns = documentModel.tabsJson.tabs[0].content;
             var csvArray = [Object.keys(csvColumns).toString()];
             
             //setTimeout(function() {
             
             
             for (var c in csvDataSource) {
             var csvLine = [];
             for (var d in csvColumns) {
             //console.log(csvColumns);
             csvLine.push(csvDataSource[csvColumns[d]]);
             }
             csvArray.push(csvLine.join(","));
             //console.log(csvLine.toString());
             }
             
             csvFileBlob = new Blob(new Array(csvArray.join("\n")), {type: "application/binary"});
             //console.log(csvArray.join("\n"));
             
             url = window.URL || window.webkitURL;
             csvFileURL = url.createObjectURL(csvFileBlob);
             
             //}, 0);
             
             return new UI_Button({
             attributes: {
             class: "ui-button-download-data",
             href: csvFileURL,
             download: config["map-of"] + ".csv"
             },
             eventHandlers: {
             },
             content: "<div>Download as CSV</div>"
             });
             */
            }()
            , class: "right"
        };

        $((new UI_ExtensionColumns(listColumnOptions)).getUI({
            "prepareUI": function() {
                //console.log($(this));
                $(this).find(".body-row").each(function(index) {
                    //console.log(index);
                    if (index >= 10)
                        $(this).hide();
                });
            }
        })).prependTo("#extension-box");
        $("<div class='col-plug'>").appendTo($("#extension-box").find(".ui-button-column-toggle"));

        $(new UI_Control_Filter({
            "ui-control-id": "filter-search",
            "target-container": $("#extension-box").find(".col-body"),
            //"target-items-selector": ".body-row>div:first-child"
            "target-items-selector": ".body-row"
        }).getUI()).appendTo($("#extension-box").find(".col-header"));



        var paginationOptions = {
            "start-index": 0,
            "stop-index": 9,
            "domElementsSelection": $("#extension-box").find(".body-row"),
            "pageChangeCallback": function(e, options) {
                //paginationOptions = options;
                //console.log(paginationOptions);
            }
        };


        (new UI_ColumnPageSwitcher(paginationOptions)).prependTo($("#extension-box").find(".col-footer"));








    });





    /*map.on("zoomend", function() {
        setTimeout(function() {
            $("#map").find("div.marker-cluster").attrByFunction(function() {
                return {
                    "title": "Click to zoom in."
                };
            });

        }, 0);
    });*/

    $("#mapBox").toggleClass("smaller larger");
    map.fire("dragend zoomend");

    map.on("zoomend", function() {
        var element = this;
        setTimeout(function() {
            /*$("#map").find("div.marker-cluster").attrByFunction(function() {
             return {
             "title": $(this).find("span").text() + " " + config["map-of"] + " in this cluster. Click to zoom in."
             };
             });*/


            setTimeout(function() {
                $.map(projectsLayers, function(layerGroup, index) {
                    setTimeout(function() {
                        if (element.getZoom() < layerGroup["min-zoom"]) {
                            layerGroup.getLayers().map(function(layer, index) {
                                setTimeout(function() {
                                    layer.setStyle({
                                        opacity: 0,
                                        fillOpacity: 0,
                                        clickable: false
                                    });
                                }, 0);
                            });
                        } else {
                            layerGroup.getLayers().map(function(layer, index) {
                                setTimeout(function() {
                                    layer.setStyle({
                                        opacity: 1,
                                        fillOpacity: 1,
                                        clickable: true
                                        , weight: element.getZoom() < 18 ? 2 : 4
                                    });
                                }, 0);
                            });
                        }
                    }, 0);
                });
            }, 0);





        }, 0);
    });







    (new UI_Button({
        attributes: {
            class: "ui-button-column-toggle"
        },
        eventHandlers: {
            click: function() {
                var btn_target = $(this).siblings(".col");
                var btn_icon = $(this).find(".icon");

                setTimeout(function() {


                    btn_icon.css("opacity", 0);
                    btn_icon.toggleClass("collapse");
                    


                    if (btn_target.css("width") !== "0px") {
                        btn_target.children().css("opacity", 0);
                        btn_target.animate({
                            width: "0px"
                        }, function() {
                            btn_icon.css("opacity", 1);
                            btn_target.toggleClass("collapsed");
                        });
                    } else {
                        btn_target.animate({
                            width: "196px"
                        }, function() {
                            btn_target.children().css("opacity", 1);
                            btn_target.toggleClass("collapsed");
                            btn_icon.css("opacity", 1);
                        });
                    }
//                $("#mapBox").toggleClass("smaller larger");
                    map.fire("dragend");
                }, 0);
            }
        }
        //content: ">"
    })).appendTo("#extension-box").append("<div class='icon collapse'></div>");






    map.fire("moveend");

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
