config = {
    api: {
        url: "data/",
        //url: "data/",
        type: "GET"
    },
    otherAPIs: {
        overpass: {
            url: "."
        }
    },
    "map-of": "roadreports",
    "report-submission-form": [
        {
            "type": "text",
            "label": "Incident Title",
            "name": "incident_title",
            "required": "required"
        },
        {
            "type": "text",
            "label": "Incident Location",
            "name": "incident_location",
            "required": "required"
        },
        {
            "type": "text",
            "label": "Incident Description",
            "name": "incident_description",
            "required": "required"
        },
        {
            "type": "date",
            "label": "Incident Date",
            "name": "incident_date",
            "required": "required"
        },
        {
            "type": "select",
            "group": "time-select",
            "group-option": "hours",
            "options": function(){
               var hours = [];
               for (var c=0; c<12; c++){
                   hours.push({
                       "label": c?(c>9?c:"0"+c):12,
                       "value": c
                   });                 
               }
               return hours;
            }()
        },
        {
            "type": "select",
            "group": "time-select",
            "group-option": "minutes",
            "options": function(){
               var minutes = [];
               for (var c=0; c<60; c++){
                   minutes.push({
                       "label": c>9?c:"0"+c,
                       "value": c
                   });                 
               }
               return minutes;
            }()
        },
        {
            "type": "select",
            "group": "time-select",
            "group-option": "ampm",
            "options": function(){
               var minutes = [];
               for (var c=0; c<2; c++){
                   minutes.push({
                       "label": c?"PM":"AM",
                       "value": c?"pm":"am",
                   });                 
               }
               return minutes;
            }()
        },
        {
            "type": "file",
            "label": "Location Photo",
            "name": "incident_photo",
            "accept": "image/*"
        }
    ],
    "road-report-api": {
        "url-query-report" : "http://www.kathmandulivinglabs.org/roadreport/api?task=incidents",
        "url-submit-report": "http://www.kathmandulivinglabs.org/roadreport/api"
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
    },
    "new-report-iconStyle": {
        iconSize: [25, 42],
        iconAnchor: [12.5, 40],
        html: "<div class='new-report-marker'>New Report<img src='markers/school.png'/></div>"
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
             srcs.push(pointAttributes.pictures[photo]["thumb"]);
             }
             return srcs;
             }(),
             photoUrls: function() {
             var srcs = [];
             for (var photo in pointAttributes.pictures) {
             //                        srcs.push("data/media/photos/" + pointAttributes.pictures[photo]["pictures/photo"]);
             srcs.push(pointAttributes.pictures[photo]["photo"]);
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
            "": pointAttributes.category
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
                        /*"Level": pointAttributes.isced_leve,
                        "Operator": pointAttributes.operator_t,
                        "Number of Students": pointAttributes.student_co,
                        "Number of Personnel": pointAttributes.personnel_,
                        "Phone Number": pointAttributes.phone,
                        "Source of Information": pointAttributes.source*/
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
