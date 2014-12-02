function UI_Form(options) {
    
    var splashScreen =$("<div class='splash-screen'/>");
    
    var container = $("<div class='form'/>");
    
    splashScreen.append(container);
    
    setTimeout(function() {
        
        
        container.append("<div class='title'>" + options.title + "</div>");
        
        var formbox = $("<div class='form-box'/>").appendTo(container);
        
        var submitButton = new UI_Button({
            attributes: {
            },
            eventHandlers: {
                click: function(e){
                    var element = this;
                    var timerAnim = $("<div class='timer-anim'><img src='../css/gfx/timer-anim.gif'/></div>").appendTo($(this).closest(".splash-screen"));
                    $(this).closest(".form").css("opacity","0.3");
                    
                    console.log({
                                "incident_title":$(this).closest(".form").find("input[label='Incident Title']")[0].value,
                                "incident_description":$(this).closest(".form").find("input[label='Incident Description']")[0].value,
                                "incident_date":$(this).closest(".form").find("input[label='Incident Date']")[0].value,
                                "incident_hour":$(this).closest(".form").find("input[label='Incident Hour']")[0].value,
                                "incident_minute":$(this).closest(".form").find("input[label='Incident Minute']")[0].value,
                                "incident_ampm":$(this).closest(".form").find("select").find("option:selected")[0].value,
                                "incident_category":1,
                                "latitude": options.lat,
                                "longitude": options.lng,
                                "location_name": $(this).closest(".form").find("input[label='Incident Location']")[0].value,
                                "incident_photo": $(this).closest(".form").find("input[label='Location Photo']")[0].value
                            });
                    
                    setTimeout(function(){
                        $.ajax({
                            url: config["report-submission-url"],
                            data: {
                                "incident_title":$(element).closest(".form").find("input[label='Incident Title']")[0].value,
                                "incident_description":$(element).closest(".form").find("input[label='Incident Description']")[0].value,
                                "incident_date":$(element).closest(".form").find("input[label='Incident Date']")[0].value,
                                "incident_hour":$(element).closest(".form").find("input[label='Incident Hour']")[0].value,
                                "incident_minute":$(element).closest(".form").find("input[label='Incident Minute']")[0].value,
                                "incident_ampm":$(element).closest(".form").find("select").find("option:selected")[0].value,
                                "incident_category":1,
                                "latitude": options.lat,
                                "longitude": options.lng,
                                "location_name": $(element).closest(".form").find("input[label='Incident Location']")[0].value,
                                "incident_photo": $(element).closest(".form").find("input[label='Location Photo']")[0].value
                            },
                            success: function(data){
                                $(this).closest(".form").remove();
                                timerAnim.remove();
                            },
                            type: "POST"
                        });
                    },0);
                }
            },
            content: function() {
                return "<div class='report-form-submit'>Submit</div>";
            }
        });
        
        $("<div class='form-footer'/>").append(submitButton).appendTo(container);
        
        var formdef = config["report-submission-form"];
        for(var c in formdef){
            switch(formdef[c]["type"]){
                case "select":
                    {
                        //var domTag = formdef[c]["type"]+"";
                        var element = $("<select/>");
                        for (var o in formdef[c]["options"]){
                            $("<option/>").attr(formdef[c]["options"][o]).after(formdef[c]["options"][o]["label"]).appendTo(element);
                        }
                        formbox.append(element);
                       break; 
                    }
                default:
                    {
                       var inputElement = $("<input/>").attr(formdef[c]);
                       $("<div class='label'>"+formdef[c]["label"]+"</div>").appendTo(formbox);
                               inputElement.appendTo(formbox);
                    }
            }
        }
        
    }, 0);
    
    function _getUI(){
        return splashScreen;
    }
    
    this.getUI = function(){
        return _getUI();
    };
    
}