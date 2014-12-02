$(document).ready(function() {
    $("#map").css({
        "width": "100%"
//        ,position: "initial !important"
    });


    var cartograph = new Map();
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




    var wardProjectsLayers = {
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
    };

    //cartograph.getLayersControl().addOverlay(wardProjectsLayerGroup, "Ward-level Projects");
    //cartograph.getLayersControl().addOverlay(municipalProjectsLayerGroup, "Municipal-level Projects");

    var layersControlWardProjects = L.control.layers(null, wardProjectsLayers, {
        position: "topleft",
        collapsed: false
    }).addTo(map);

    var layersControlMunicipalProjects = L.control.layers(null, municipalProjectsLayers, {
        position: "topleft",
        collapsed: false
    }).addTo(map);

    cartograph.getLayersControl().expanded = true;

    (new UI_SlidingTabs({
        tabs: [
            {
                "title": "Ward-level Projects",
                "content": $(layersControlWardProjects._container).find("form")
            },
            {
                "title": "Municipal-level Projects",
                "content": $(layersControlMunicipalProjects._container).find("form")
            }
        ],
        attributes: {
            "class": "leaflet-control",
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
        $(layersControlWardProjects._container).remove();
        $(layersControlMunicipalProjects._container).remove();
        $($(uiElement.find(".content")[1])).find("label").click();
        $(uiElement.find("a.trigger")[0]).click();
    });

    console.log(layersControlWardProjects);

    mapGlobals.mapData = mapData;


    function drawLinesAndPolygons(feature, layer, layerGroup) {
        //console.log(feature);
        var attributes = feature.properties.getAttributes(feature.properties._cartomancer_id);
        feature.properties.title = attributes.name/*+", "+attributes.city*/;

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

            //layer.setStyle(LayerStyles["map-features"]["road"]);
            //layer.addTo(map);
            if (layerGroup)
                layerGroup.addLayer(layer);
            //map.addLayer(layerGroup);
        }, 0);


    }





    var modelQueryWardLines = mapData.fetchData({
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

    //$("#mapBox").toggleClass("smaller larger");
    map.fire("dragend");


    var overviewMap = new UI_OverviewMap({
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

    overviewMap.drawMap();
    map.fire("moveend");

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
