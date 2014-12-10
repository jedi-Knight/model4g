function Search(data) {
    function search(txt) {
        var points = data.getFeatureAttributePair("points", "name");
    }
    ;
    this.getControlElement = function() {
//        var inputDiv = 
    };
}


function UI_Control_Search(options) {  //work in progress..
    var searchControlUI = $("<div/>").addClass("search-box").append(function() {
        return $("<input type='text'/>", "<a><div class='icon'></a>");
    });
    var result = {};
    for (var geomType in options.db) {

    }
}
;

function UI_Control_Filter(options) {
    var uiElement = $("<input/>").attr({
        "type": "text",
        "id": options["ui-control-id"],
        "style": "width:0px;"
    })[0];

    $(uiElement).on("keydown", function() {
        setTimeout(function() {
            a=uiElement;
            var container = $(options["target-container"]);
            var selection = container.find(options["target-items-selector"]);
            selection.closest(".body-row").hide();
            selection.filter(function() {
                return ((($(this).text().toLowerCase())).indexOf(uiElement.value.toLowerCase()) + 1) ? true : false;
            }).closest(".body-row.current-page").show();
            if(Boolean(uiElement.value))$(".ui-column-page-switcher").addClass("inactive");
            else $(".ui-column-page-switcher").removeClass("inactive");
        }, 100);
    });

    $(uiElement).focus(function(e) {
        $(uiElement).parent().addClass("active");
    });

    $(uiElement).blur(function(e) {
        $(uiElement).parent().removeClass("active");
    });

    function _getUI() {
        return $("<div class='ui-control-filter'/>").append(uiElement).prepend(new UI_Button({
            attributes: {
                "class": "ui-trigger-filter-search",
                "title": "Search for "+config["map-of"]
            },
            eventHandlers: {
                click: function(e) {
                    //$(this).parent().toggleClass("filter-search-enabled");
                    var container = $(this).parent();
                    e.stopPropagation();
                    var buttonTarget = $(this).next("input");
                    if (buttonTarget.css("width") !== "140px") {
//                        buttonTarget.show();
                        buttonTarget.animate({
                            "width": "140px",
                            "opacity": 1
                        }, function() {
                            container.addClass("expanded");
                            container.find("a").attr("title", "Close the searchbox");
                            $(this).focus();
                        });
                        buttonTarget.closest(".col-header").find("h3").animate({
                            "opacity": 0
                        }, function() {
//                            buttonTarget.closest(".col-header").find("h3").hide();
                        });



                    } else {
//                            buttonTarget.closest(".col-header").find("h3").show();

                        buttonTarget.animate({
                            "width": "0px",
                            "opacity": 0
                        }, function() {
                            container.removeClass("expanded");
                            container.find("a").attr("title", "Search for "+config["map-of"]);
                        });
                        buttonTarget.closest(".col-header").find("h3").animate({
                            "opacity": 1
                        });
                        
                        $(".ui-column-page-switcher").removeClass("inactive");


                    }
                }
            }
        }));
    }

    this.getUI = function() {
        return _getUI();
    };

}

function Util_DateConverter(options) {
    var date = new Date(options.date);

    function _format(format) {

        if (format === "mm/dd/yy") {
            return date.getUTCMonth() + 1 + "/" + date.getUTCDate() < 10 ? ("0" + date.getUTCDate()) : date.getUTCDate() + "/" + date.getUTCFullYear();
        }

        return date;
    }

    this.format = function(format) {
        return _format(format);
    };
}