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



function UI_DropdownMenu(options){
    var dropdownMenu = $("<div class='menu-dropdown'/>");
    for(var item in options.items){
        dropdownMenu.append(function(){
            return new UI_Button(options.items[item]);
        });
    }
    
    function _addTo(element){
        dropdownMenu.appendTo(element);
    }
    
    this.addTo = function(element){
        _addTo(element);
    };
}


function UI_SplitInteractionBar(options){
    var interactionBar = $("<div class='interaction-bar'/>");
    var slideBar = $("<div class='slide-bar'/>");
    var splashBar = $("<div class='splash-bar'/>");
    
    
    for(var button in options.slideBar.buttons){
        /*options.slideBar.buttons[button].eventHandlers.mouseover = function(e){
            $(this).siblings().removeClass("active");
            options.slideBar.buttons[button].eventHandlers.mouseover.call(this,e);
        };*/
        
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


function UI_TabularColumn(options){
    var column = $("<div class='col'/>");
    var header = $("<div class='col-header'/>").append(options.header);
    var body = $("<div class='col-body'/>");
    
    for(var c in options.body){
       body.append(function(){
          return $("<div class='body-row'/>").append($("<div/>").append(c)).append($("<div/>").append(options.body[c]));
       });
    }
    
    var footer = $("<div class='col-footer'/>").append(options.footer);
    
    header.appendTo(column);
    body.appendTo(column);
    footer.appendTo(column);
    
    this.getUI = function(){
      return column[0];  
    };
}


function UI_ExtensionColumns(options){
    var column = new UI_TabularColumn(options).getUI();
    this.getUI = function(){
      return column;  
    };
}