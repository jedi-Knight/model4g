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
        console.log(data.features[0].geometry.coordinates[1]);

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



            var clusterSpell = new Cluster(data.features);
            clusterSpell.done(function(clusterGroup) {
                clusterGroup.addTo(map);
                map.fire("zoomend");
            });
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


    map.fire("dragend");

    $("<div class='leaflet-control' aria-haspopup='true'/>").append($("<div/>").append(new UI_Button({
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
    }))).appendTo($("#map").find(".leaflet-control-container .leaflet-top.leaflet-right"));

    var overviewMap = new UI_OverviewMap({
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

    overviewMap.drawMap();
    map.fire("moveend");

});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
