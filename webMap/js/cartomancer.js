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

    mapGlobals.mapData = mapData;

    var modelQueryPoints = mapData.fetchData({
        query: {
            geometries: {
                type: "points",
                group: config["map-of"]
            }
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
            offset: L.point(0, -22)
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
            header: config["map-of"],
            body: function() {
                var bodyTable = {};
                var pointAttributeList = mapData.getAttributes()["points"];
                for (var point in pointAttributeList) {
                    bodyTable[pointAttributeList[point].name] = function() {
                        if (highlightButton)
                            delete highlightButton;
                        var highlightButton = new UI_Button({
                            attributes: {
                                _id: point
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
                            }
                        });
                        highlightButton.text("Show on the Map");
                        return highlightButton;
                    }();
                }
                return bodyTable;
            }(),
            footer: "<a><div>Download as CSV</div></a>",
            class: "right"
        };

        $(new UI_ExtensionColumns(listColumnOptions).getUI()).prependTo("#extension-box");
        $("<div class='col-plug'>").appendTo($("#extension-box").find(".ui-button-column-toggle"));




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
                        });
                    } else {
                        btn_target.animate({
                            width: "196px"
                        }, function() {
                            btn_target.children().css("opacity", 1);

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

    var overviewMap = new UI_OverviewMap({
        map: map,
        zoom: 13,
        "ui-dom-id": "overview-map",
        basemap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 13,
            minZoom: 13
        }),
        "ui-control-map": true
    });

    $("#mapBox").append(overviewMap.getUI());

    overviewMap.drawMap();
    map.fire("moveend");

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
