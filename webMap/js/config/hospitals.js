config={
    /*api:{
        url: "data/hospitals.geojson",
        type: "GET"
    },*/
    otherAPIs:{
        overpass: {
            url:"."
        }
    },
    "map-of": "Hospitals" ,
    "data-src": "hospitals.geojson"
};


var Styles = {
    polygonStyle: {
        color: "#333366",
        weight: 1,
        opacity: 0.9,
        fillColor: function() {
            //return svg pattern urls..
            return "#000000"; //temporary/fallback fill color..
        }(),
        fillOpacity: 1
    },
    lineStyle: {
        color: "#333366",
        weight: 3,
        opacity: 0.9,
        fillColor: "#000",
        fillOpacity: 0
    },
    iconStyle: {
        iconSize: [25, 42],
        iconAnchor: [12.5, 40],
        html: "<img src='markers/hospital.png'/>"

    }
};

var PlugsForStyling = {
  popup:{
      body:{
          "head-plug": "<div class='head-plug'/>"
      }
  }  
};

function PanelDocumentModel(pointAttributes) {

    return {titleBarJson: {
            /*"title": pointAttributes.name + ", " + pointAttributes.city
            ,"slider": new UI_ThumbnailView({
                thumbUrls: function() {
                    var srcs = [];
                    for (var photo in pointAttributes.pictures) {
//                        srcs.push("data/media/photos/thumbs/" + pointAttributes.pictures[photo]["pictures/photo"]);
                        srcs.push("https://raw.githubusercontent.com/biplovbhandari/brckkln/master/media/photos/thumbs/" + pointAttributes.pictures[photo]["pictures/photo"]);
                    }
                    return srcs;
                }(),
                photoUrls: function() {
                    var srcs = [];
                    for (var photo in pointAttributes.pictures) {
//                        srcs.push("data/media/photos/" + pointAttributes.pictures[photo]["pictures/photo"]);
                        srcs.push("https://raw.githubusercontent.com/biplovbhandari/brckkln/master/media/photos/" + pointAttributes.pictures[photo]["pictures/photo"]);
                    }
                    return srcs;
                }(),
                mediaOptions: function(params) {
                    return {
                        triggers: {
                            click: function(e) {
//                                new MediaDocument(params.src).appendTo($("#map").find(".leaflet-popup-pane"));
                                new SplashScreen(MediaDocument(params.src)).appendTo("body");
                            }
                        }
                    };
                }
            }).createSlider()*/
        },
        headerJson: {
            "": pointAttributes.name
//            "Contact Person": pointAttributes.contact_person,
//            "Contact Number": pointAttributes.contact_number
//                ,"city": pointAttributes.city
        },
        tabsJson: {
            triggers: {
                title: function() {

                }
            },
            tabs: [
                {
                    title: "General Information",
                    content: {
                        "Operator": pointAttributes.operator_t,
                        "Average OPD patients per day": pointAttributes.opd_patien,
                        "Number of Hospital Staff": pointAttributes.personnel_,
                        "Source of Information": pointAttributes.source
                    }
                }
            ]
        },
        documentModel: {
            titleBar: {
                title: "Summary",
                cotrols: new UI_CloseButton()
            }
        }
    };

}