/* 
 (c) Kathmandu Living Labs
 */
/* 
    Created on : Oct 30, 2014, 10:59:22 PM
    Author     : jediKnight
*/




function UI_Button(initObj) {
    var button = $("<a></a>");
    //$(button).addClass(initObj.class? initObj.class:"");
    if (initObj) {
        $(button).attr(function() {
            var attrObj = {};
            for (var attr in initObj.attributes) {
                attrObj[attr] = initObj.attributes[attr];
            }
            _attr = attrObj;
            return attrObj;
        }());
        for (var event in initObj.eventHandlers) {
            $(button).on(event, initObj.eventHandlers[event]);
        }
        $(typeof initObj.content === "function" ? initObj.content.call() : initObj.content).appendTo(button);
    }

    return button;
}


function UI_SplitInteractionBar(options){
    var interactionBar = $("<div class='interaction-bar'/>");
    var slideBar = $("<div class='slide-bar'/>");
    var splashBar = $("<div class='splash-bar'/>");
    
    
    for(var button in options.slideBar.buttons){
        options.slideBar.buttons[button].eventHandlers.mouseover = function(e){
            $(this).siblings().removeClass("active");
        };
        
        slideBar.append(function(){
            return new UI_Button(options.slideBar.buttons[button]);
        });
    }
    
    for(var button in options.splashBar.buttons){
        splashBar.append(function(){
            return new UI_Button(options.splashBar.buttons[button]);
        });
    }
    
    slideBar.appendTo(interactionBar);
    splashBar.appendTo(interactionBar);
    
    function _addTo(element){
        interactionBar.appendTo(element);
    }
    
    this.addTo = function(element){
        _addTo(element);
    };
}