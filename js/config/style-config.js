LayerStyles = {
    "inset-map-current-view": {
        color: "#333366",
        weight: 1,
        opacity: 0.9,
        fillColor: 0,
        fillOpacity: 0
    },
    "map-features": {
        "road": {
            weight: 8.4,
            opacity: 1,
            //color: "#003366",
            color: "#000000",
            //"dashArray": "28 8",
            fillColor: "#669999",
            lineCap: "butt",
            lineJoin: "miter",
        },
        "sewerage": {
            weight: 6,
            opacity: 1,
            color: "#333300",
            //lineCap: "butt",
            "dashArray": "26 18",
            fillColor: "url(#blackwater)"
        },
        "water-supply": {
            weight: 8,
            opacity: 1,
            color: "#ff0000",
            "dashArray": "16 8",
            fillColor: "#ffff00"
        },
        "space": {
            weight: 4,
            opacity: 0.4,
            color: "#389416",
            //"dashArray": "16 8",
            fillColor: "url(#space)"
        },
        "heritage": {
            weight: 2,
            opacity: 1,
            color: "#333333",
            //"dashArray": "16 8",
            fillColor: "url(#heritage)"
        },
        "buildings":{
            weight: 2,
            color: "#666666",
            fillColor: "#ffcc00",
            fillOpacity: 1
        }
        ,
        "helper-styles": {
            "road": {
                weight: 1.4,
                opacity: 0,
                color: "#ffffff",
                dashArray: "12 8",
                lineCap: "butt",
                lineJoin: "miter",
                clickable: false
            }
        },
        "min-zoom": 16,
        "max-zoom": 22
    },
    "boundary-mask-style": {
        fillColor: "#ececec",
        color: "#666666",
        fillOpacity: 0.8,
        weight: 2,
        clickable: false,
        className: "area-boundary"
    }
};