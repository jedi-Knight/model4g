/* 
 (c) Kathmandu Living Labs
 */
/* 
    Created on : Oct 30, 2014, 11:37:18 PM
    Author     : jediKnight
*/




$(document).ready(function(){
    var interactionBarOptions={
        slideBar:{
            buttons:[
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       click:function(e){
                           $(this).addClass("active");
                       }
                   },
                   content:function(){
                       return $("<div class='home-tab'/>गृहपृष्ठ</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='services-tab'/>सेवा</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='updates-tab'/>अपडेट</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='data-tab'/>डाटा</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='programmes-tab'/>कार्यक्रम</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='materials-tab'/>सामग्रीहरू</div>");
                   }
                }
            ]
        },
        splashBar:{
            buttons:[
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='help-splash'/>हामी कसरी  सहयोग गर्न सक्छौँ?</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='info-splash'/>वडाका ७३ सेवाहरुबारे जानकारी </div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='search-box'/>नक्सामा भएका वस्तुहरु खोज्नुहोस</div>");
                   }
                }
            ]
        }
    };
    
    new UI_SplitInteractionBar(interactionBarOptions).addTo("#interaction-bar");
    $("#interaction-bar").find("a:first-child").click();
});