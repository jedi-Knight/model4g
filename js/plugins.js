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
            var container = $(options["target-container"]);
            var selection = container.find(options["target-items-selector"]);
            selection.closest(".body-row").addClass("hidden");
            selection.filter(function() {
                return ((($(this).text().toLowerCase())).indexOf(uiElement.value.toLowerCase()) + 1) ? true : false;
            }).closest(".body-row").removeClass("hidden");
        }, 100);
    });

    function _getUI() {
        return $("<div class='ui-control-filter'/>").append(uiElement).prepend(new UI_Button({
            attributes: {
                "class": "ui-trigger-filter-search"
            },
            eventHandlers: {
                click: function(e) {
                    //$(this).parent().toggleClass("filter-search-enabled");
                    e.stopPropagation();
                    var buttonTarget = $(this).next("input");
                    if (buttonTarget.css("width")!=="160px"){
//                        buttonTarget.show();
                        buttonTarget.animate({
                            "width": "160px",
                            "opacity":1
                        }, function(){
//                            buttonTarget.css("width", "160px");
                        });
                        buttonTarget.closest(".col-header").find("h3").animate({
                            "opacity":0
                        }, function(){
//                            buttonTarget.closest(".col-header").find("h3").hide();
                        });
                    }else{
//                            buttonTarget.closest(".col-header").find("h3").show();
                        
                        buttonTarget.animate({
                            "width": "0px",
                            "opacity":0
                        }, function(){
//                            buttonTarget.hide();
                        });
                        buttonTarget.closest(".col-header").find("h3").animate({
                            "opacity":1
                        });
                    }
                }
            }
        }));
    }

    this.getUI = function() {
        return _getUI();
    };

}

