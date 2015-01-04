/**
 * 
 * @author jedi-Knight@github.com <gautamxpratik@gmail.com>
 * 
 */

MagnifyingGlass = {
    MagnifyingGlass: function(options) {
        var content = document.getElementById("magnify-enabled");
        var glass_diameter = 200;
        var power = 2;
        var magnifyButton = false;
        var target, targetRect;
        var opaque = false;
        //var lightbox = false;  //TODO 1: scroll down for details..

        if (options) {
            content = options.target ? options.target : content;
            glass_diameter = options.glass_diameter ? options.glass_diameter : glass_diameter;
            power = options.power ? options.power : power;
            magnifyButton = options.toggle_button ? options.toggle_button : false;
            opaque = options.opaque ? true : false;
            //lightbox = options.lightbox? options.lightbox: false; //TODO 1: scroll down for details..
        }

        if (!content)
            throw new MagnifyingGlass.PluginError({
                name: "Constructor Error",
                message: "Magnification Target not found. See plugin documentation for more info on this.",
                params: options
            });





        target = content;
        targetRect = target.getBoundingClientRect();
        content = content.cloneNode(true);
        content.id = "zoomed";

        /*TODO 1: iframe lightbox didnt solve the currentXY vs zoomedXY problem..
         * this code left here as lightbox can be a nice added feature..
         * BUT use div lightbox instead of iframe for lightbox as a feature..
         if(lightbox){
         var glassBox = document.createElement("iframe");
         glassBox.id="glass_box";
         
         glassBox.setAttribute("scrolling","no");
         glassBox.setAttribute("frameborder",0);
         
         glassBox.setAttribute("style","position:absolute;padding:0px;overflow:hidden;top:"+Number(targetRect.top)+"px;left:"+Number(targetRect.left)+"px;width:"+(Number(targetRect.width)+50)+"px;height:"+(Number(targetRect.height)+50)+"px;");
         
         lightbox.appendChild(glassBox);
         var _glassBox = document.getElementById("glass_box").contentWindow.document;
         _glassBox.open();
         _glassBox.write("<div id='container'></div>");
         _glassBox.close();
         var lightboxContent = content.cloneNode(true);
         lightboxContent.setAttribute("style",lightboxContent.getAttribute("style")+"margin:0px;top:0px;right:0px;bottom:0px;left:0px;");
         _glassBox.getElementById("container").appendChild(lightboxContent);
         target.innerHTML ="";
         target = _glassBox.getElementById("zoomed");
         }:TODO*/

        var contentWidth = targetRect.width;
        var contentHeight = targetRect.height;
        var contentX = 0;
        var contentY = 0;
        contentX = targetRect.left;
        contentY = targetRect.top;
        if (content.style.position === "absolute") {
            contentX = targetRect.left;
            contentY = targetRect.top;
        }



        var glass = document.createElement("div");
        glass.setAttribute("id", "glass");
        var style = "width:" + glass_diameter + "px;" +
                "height:" + glass_diameter + "px;" +
                "border:#cccccc solid thick;" +
                "overflow:hidden;" +
                "border-radius:" + (glass_diameter / 2) + "px;" +
                "box-shadow:0px 0px 6px 2px #000000;" +
                "position:absolute; z-index:10000;";
                //"position:relative; margin-top:-300px;";
        glass.setAttribute("style", style);

        var zoomStyle = "-webkit-transform-origin:-" + contentWidth / 2 + "px -" + contentHeight / 2 + "px;" +
                "-webkit-transform:scale(" + power + "," + power + ");";
        zoomStyle = zoomStyle + "transform-origin:-" + contentWidth / 2 + "px -" + contentHeight / 2 + "px;" +
                "transform:scale(" + power + "," + power + ");position:absolute;";


        var contentStyle = content.getAttribute("style");
        contentStyle = contentStyle ? contentStyle : "";
        content.setAttribute("style", contentStyle + zoomStyle);

        this.defaultStyle = function() {
            return style;
        };
        var defaultContentStyle = function() {
            return contentStyle + zoomStyle;
        };
        this.getElement = function() {
            return glass;
        };
        this.getContent = function() {
            return content;
        };

        function init(toggle) {
            if (!toggle) {
                glass.remove();
                target.onmouseover = null;
                return;
            }
            target.onmouseover = function() {
                target.appendChild(glass);
            };


            target.addEventListener("mousemove", function(e) {




                var x = (Number(e.clientX));
                var y = (Number(e.clientY));
                //console.log(x);

                if (x > (targetRect.right + glass_diameter / (2 * power))+20 | x < (targetRect.left - 1.5 * glass_diameter / (2 * power))-20)
                    glass.remove();
                if (y > (targetRect.bottom + glass_diameter / (2 * power))+20 | x < (targetRect.top - 1.5 * glass_diameter / (2 * power))-20)
                    glass.remove();



                var glassX /*= x - contentX - glass_diameter / 2*/;
                var glassY /*= y - contentY - glass_diameter / 2*/;
                glassX = x - glass_diameter / 2 /*- glass_diameter / 2*/;
                glassY = y - glass_diameter / 2 /*- glass_diameter / 2*/;



                glass.setAttribute("style", style + "left:" + (glassX-options.offsetX) + "px;top:" + (glassY-options.offsetY) + "px;");
                content.setAttribute("style", defaultContentStyle() + "left:" + (-power * x + targetRect.left - glass_diameter/2*power  + options.offsetX*power /*+ glass_diameter -contentWidth/2*/) + "px;top:" + (-power * y + targetRect.top+20 - (glass_diameter/2)*power +options.offsetY*power*power/2 /*+ glass_diameter -contentHeight/2*/) + "px;");

            });
        }

        if (magnifyButton) {
            var toggleState = 0;
            magnifyButton.addEventListener("click", function() {
                toggleState += 1;
                toggleState %= 2;
                if (toggleState) {
                    init(true);
                } else {
                    init(false);
                }
            });
            target.appendChild(magnifyButton);
        }

        this.magnification = {
            start: function() {
                init(true);
            },
            stop: function() {
                init(false);
            }
        };

        if (opaque) {
            var smoke = document.createElement("div");
            smoke.setAttribute("style", "position:absolute;background-color:#000000; width:" + glass_diameter + "px;height:" + glass_diameter + "px;top:0px;left:0px;z-index:0;");
            glass.appendChild(smoke);
        }
        ;

        glass.appendChild(content);



    },
    autoAddToPage: function() {
        document.addEventListener("DOMContentLoaded", function() {
            var magnifyToggleButton = document.getElementById("magnifying-glass-button");
            if (magnifyToggleButton)
                new MagnifyingGlass.MagnifyingGlass({
                    target: document.getElementById("magnifying-glass-target"),
                    toggle_button: magnifyToggleButton
                });
            else
                new MagnifyingGlass.MagnifyingGlass({
                    target: document.getElementById("magnifying-glass-target")
                }).magnification.start();
        });
    },
    PluginError: function(params) {
        var e = function() {
            this.name = params.name;
            this.message = params.message;
            this.params = params.params;
        };
        e.prototype = new Error();
        e.prototype.constructor = e;
        return e;
    }
};

