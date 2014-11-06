$(document).ready(function() {
    $("#map").css({
        height: $(document).innerHeight() - 20
    });


    var cartograph = new Map();
    $("#map").find("a.leaflet-control-zoom-out").text("–");
    var map = cartograph.getMap();
    
    //console.log(map.getPanes().tilePane);
    //$(map.getPanes().tilePane).addClass("grayscale");
    
    map.on("baselayerchange", function(layer){
        $(map.getPanes().tilePane).toggleClass("grayscale", layer.name==="OpenStreetMap Grayscale");
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
                group: {"column":"amenity"}
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
            cartograph.getLayersControl().addOverlay(clusterGroup, "Brick Kilns / Brick Kiln Clusters");
        });
    });





    map.on("zoomend", function() {
        setTimeout(function() {
            $("#map").find("div.marker-cluster").attrByFunction(function() {
                return {
                    "title": $(this).find("span").text() + " Brick Kilns in this cluster. Click to zoom in."
                };
            });

        }, 0);
    });






});
$.fn.attrByFunction = function(fn) {
    return $(this).each(function() {
        $(this).attr(fn.call(this));
    });
};
