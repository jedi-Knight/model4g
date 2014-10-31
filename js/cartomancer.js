/* 
 (c) Kathmandu Living Labs
 */
/* 
    Created on : Oct 30, 2014, 11:37:18 PM
    Author     : jediKnight
*/




$(document).ready(function(){
    
    var list_programmes = {
        items:[
            {
                attributes:{
                       
                },
                eventHandlers:{
                       click:function(e){
                           $(this).addClass("active");
                           
                           var map = L.map('map', {
                                center: [27.7134314, 85.3440550],
                                zoom: 18,
                                doubleClickZoom: true
                            });
                            
                            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                                maxZoom: 19,
                                minZoom: 1
                            }).addTo(map);
                            
                            $.getJSON("data.json", function(data){
                                L.geoJson(data,{
                                    onEachFeature: function(feature, layer){
                                        var popupContent = $("<div class='popupcontent'/>")
                                        for(var c in feature.properties){
                                            popupContent.append("<div>"+c+": "+feature.properties[c]+"</div>");
                                        }
                                        console.log(popupContent[0]);
                                        layer.bindPopup(popupContent[0]);
                                    }
                                }).addTo(map);
                            });
                            $("#map-box").find("img.poimap").toggle();
                       },
                       mouseout:function(e){
                           $(this).parent().remove();
                       }
                },
                content:function(){
                       return $("<div class='menu-item'/>Household Survey</div>");
                }
            },
            {
                attributes:{
                       
                   },
                   eventHandlers:{
                       click:function(e){
                           $(this).addClass("active");
                       }
                   },
                   content:function(){
                       return $("<div class='menu-item'>Melamchi Pipeline</div>");
                   }
            }
        ]
    };
    
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
                       return $("<div class='home-tab'>गृहपृष्ठ</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='services-tab'>सेवा</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='updates-tab'>अपडेट</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='data-tab'>डाटा</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       mouseover: function(e){
                           if(!$(this).find(".menu-dropdown").length)
                                new UI_DropdownMenu(list_programmes).addTo(this);
                       }
                   },
                   content:function(){
                       return $("<div class='programmes-tab'>कार्यक्रम</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='materials-tab'>सामग्रीहरू</div>");
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
                       return $("<div class='help-splash'>हामी कसरी  सहयोग गर्न सक्छौँ?</div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='info-splash'>वडाका ७३ सेवाहरुबारे जानकारी </div>");
                   }
                },
                {
                   attributes:{
                       
                   },
                   eventHandlers:{
                       
                   },
                   content:function(){
                       return $("<div class='search-box'>नक्सामा भएका वस्तुहरु खोज्नुहोस</div>");
                   }
                }
            ]
        }
    };
    
    var footerColumnOptions = [
        {
            header: "New Datasets",
            body: {
                "Ward number 7 population distribution by age and gender.":"August, 2014",
                "Kathmandu Metropolitan City Ward number 7 Budget for 2014":"Auguts, 2014"
            },
            footer: "<a>View All Datasets</a>"
        },
        {
            header: "Ward 7 Updates",
            body: {
                "Appointment of Accounts Officers on re-employment basis for four District Legal Services Authorities.":"August, 2014",
                "Appointment of Accounts Officers on re-employment basis for four District Legal Services Authorities2":"Auguts, 2014"
            },
            footer: "<a>View All Datasets</a>"
        }
    ];
    
    new UI_SplitInteractionBar(interactionBarOptions).addTo("#interaction-bar");
    $("#interaction-bar").find("a:first-child").click();
    
    for(var c in footerColumnOptions){
        $(new UI_ExtensionColumns(footerColumnOptions[c]).getUI()).appendTo("#extension-box");
    }
});