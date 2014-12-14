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
                group: config["map-of"],
            },
            url: config["data-src"]
        },
        returnDataMeta: {
//            type: "formhub_JSON"
        }
    });

    modelQueryPoints.done(function(data, params) {

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
        });

        /*var searchControl = new L.Control.Search({
         layer: clusterGeoJson,
         zoom: 16,
         circleLocation: false,
         animateCircle: false
         });*/

        var popup = L.popup({
            autoPan: true,
            keepInView: true,
            offset: L.point(0, -34)
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






        var clusterSpell = new Cluster(data.features);
        clusterSpell.done(function(clusterGroup) {
            clusterGroup.addTo(map);
            map.fire("zoomend");
            //cartograph.getLayersControl().addOverlay(clusterGroup, "Schools / School Clusters");
        });



        var listColumnOptions = {
            header: "<h3>" + config["map-of"] + "</h3>",
            body: function() {
                var bodyTable = {};
                var pointAttributeList = mapData.getAttributes({
                    "order-by": "name",
                    "geometry-type": "points",
                    "feature-group": config["map-of"]
                });
                for (var point in pointAttributeList) {
                    bodyTable[pointAttributeList[point].name] = function() {
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
                                        var pointOfAttributes = mapData.getGeometries()["points"][config["map-of"]]["features"][$(buttonDOMElement).attr("_id")];
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
                            content: "<div class='icon' title='Click to find on map'>" + pointAttributeList[point].name + "</div>"
                        });
                        //highlightButton.text("Show on the Map");
                        //highlightButton.append("<div class=icon/>");
                        return highlightButton;
                    }();
                }
                return bodyTable;
            }(),
            //footer: "<a class='ui-button-download-data'><div>Download as CSV</div></a>",
            footer: function() {
                var csvFileBlob;
                var url;
                var csvFileURL = "";
                var csvDataSource = mapData.getAttributes()["points"];
                var documentModel = "";//= new PanelDocumentModel(csvDataSource[0]);
                var csvColumns = "";// documentModel.tabsJson.tabs[0].content;
                var csvArray = [];//[Object.keys(csvColumns).toString()];
                var nameColumn = {};
                nameColumn[config["map-of"] + "-name"] = "name";

                //setTimeout(function() {


                for (var c in csvDataSource) {

                    documentModel = new PanelDocumentModel(csvDataSource[c]);
                    csvColumns = documentModel.tabsJson.tabs[0].content;
                    if (!csvArray.length)
                        csvArray = [Object.keys($.extend(nameColumn, csvColumns)).toString()];

                    var csvLine = [];
                    csvLine.push(csvDataSource[c]["name"]);
                    for (var d in csvColumns) {
                        //console.log([csvColumns[d]]);
                        csvLine.push(csvColumns[d]);
                    }
                    csvArray.push(csvLine.join(","));
                    //console.log(csvLine);
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
            }(),
            class: "right"
        };

        $(new UI_ExtensionColumns(listColumnOptions).getUI({
            "prepareUI": function(){
                //console.log($(this));
                $(this).find(".body-row").each(function(index){
                    //console.log(index);
                   if(index>=10)
                   $(this).hide();
               else
                   $(this).addClass("current-page");
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

        console.log(new UI_ColumnPageSwitcher(paginationOptions));

        (new UI_ColumnPageSwitcher(paginationOptions)).prependTo($("#extension-box").find(".col-footer"));






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

    $("#mapBox").toggleClass("smaller larger");
    map.fire("dragend");

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
