config = {
    api: {
        url: "data/",
        type: "GET"
    },
    otherAPIs: {
        overpass: {
            url: "."
        }
    },
    "map-of": "Ward Projects",
    "map-options": {
        "min-zoom": 12,
        "init-zoom": 14,
        "map-bounds": {
            northeast: [27.706991527038417, 85.33393906163997],
            southwest: [27.727843923603865, 85.35989363340271]
        }
    }
};

LayerStyles["ui-legend"] = {
    "css-class":{
        "heritage": "पुरातात्विक धरोहरको संरक्ष्यण",
        "space": "सार्वजनिक जग्गा संरक्ष्यण",
        "road": "सडक मर्मत",
        "water-supply": "खानेपानी पाइपलाइन मर्मत",
        "sewerage": "ढल/मंगाल निर्माण तथा मर्मत"
    }
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
        html: "<img src='markers/school.png'/>"

    }
};

var PlugsForStyling = {
    popup: {
        body: {
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
            "": pointAttributes["project-name"]
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
                        "क्षेत्रफल/लम्बाइ": pointAttributes["project-area"]?(pointAttributes["project-area"]+"").replace("."," ")+(pointAttributes["project-category"] === "heritage"||pointAttributes["project-category"] === "space"?"वर्ग मीटर":"मीटर"):"",
                        "लागत इस्तिमेट": pointAttributes["project-cost-estimate"]?"रु "+pointAttributes["project-cost-estimate"].replace(".",""):"",
                        //"टोल ": pointAttributes["tole"],
                        "आयोजक स्तरीय":pointAttributes["project-under"]?pointAttributes["project-under"]:"",
                        //"विभाग": pointAttributes["department"],
                        "आर्थिक वर्ष": pointAttributes["ward7pro_3"]?(pointAttributes["ward7pro_3"]+"").replace("आ.व. ",""):"",
                        //"टोल सुधार समिति": pointAttributes["टोल सुधार समिति"],
                        "टोल सुधार समितिको फोन नम्बर": pointAttributes["टोले सुधार समितिको फोन नम्बर"]?pointAttributes["टोले सुधार समितिको फोन नम्बर"]:""
                        //,"उपभोक्ता समितिको फोन नम्बर": pointAttributes["उपभोक्ता समितिको फोन नम्बर"]
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

function TolePanelDocumentModel(pointAttributes) {

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
            "": pointAttributes["name"]
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
                        "number of buildings": pointAttributes["building-count"],
                        "number of residents": pointAttributes["resident-count"],
                        "number of projects": pointAttributes["projects-count"],
                        "projects-road": pointAttributes["projects-road"],
                        "projects-sewerage": pointAttributes["projects-sewerage"],
                        "projects-water-supply": pointAttributes["projects-water-supply"],
                        "projects-space": pointAttributes["projects-space"],
                        "projects-heritage": pointAttributes["projects-heritage"],
                        "टोल सुधार समिति": pointAttributes["टोल सुधार समिति"],
                        "टोले सुधार समितिको फोन नम्बर": pointAttributes["टोले सुधार समितिको फोन नम्बर"],
                        "उपभोक्ता समितिको फोन नम्बर": pointAttributes["उपभोक्ता समितिको फोन नम्बर"]
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