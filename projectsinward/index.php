<?php
$page = "
    <!DOCTYPE html>
<!--
(c)Kathmandu Living Labs
-->

<!--WEB MAP-->
<html>
    <head>
        <title>Participatory Governance</title>
        <meta charset=\"UTF-8\">
        <meta name=\"viewport\" content=\"width = device-width, initial-scale = 1.0\">
        
        <script src=\"../js/jquery-2.1.1.min.js\"></script>
        <script src=\"../js/leaflet.js\"></script>
        <script src=\"../js/leaflet.markercluster.js\"></script>
        <!--<script src=\"../js/leaflet-search.js\"></script>-->
        <link rel=\"stylesheet\" href=\"../css/leaflet.css\"/>
        <link rel=\"stylesheet\" href=\"../css/MarkerCluster.Default.css\"/>
        <link rel=\"stylesheet\" href=\"../css/MarkerCluster.css\"/>
        <!--<link rel=\"stylesheet\" href=\"../css/leaflet-search.css\"/>-->
        
        <link rel=\"stylesheet\" href=\"../css/layout.css\"/>
        <link rel=\"stylesheet\" href=\"../css/theme.css\"/>        
        <link rel=\"stylesheet\" href=\"../css/mapstyle.css\"/>
        
        <link rel=\"stylesheet\" href=\"../css/popuptab.css\"/>
        <link rel=\"stylesheet\" href=\"../css/mediaviewer.css\"/>
        <script src=\"" . "js/config/config.js" . "\"></script>
        <script src=\"../js/config/style-config.js\"></script>
        <script src=\"../js/plugins.js\"></script>
        <script src=\"../js/guiActions.js\"></script>
        <script src=\"../js/data.js\"></script>
        <script src=\"../js/cartograph.js\"></script>
        <script src=\"js/plugins/helperfeatures.js\"></script>
        <script src=\"js/cartomancer.js\"></script>
    </head>
    <body>
        <div id=\"mapBox\" class=\"larger\">
            <div id=\"map\"></div>
        </div>
        <div id=\"extension-box\"></div>
<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
	 width='40px' height='40px' viewBox='55 55 40 40' enable-background='new 55 55 40 40' xml:space='preserve' fill='white'>
<defs>
<pattern id='heritage' patternUnits='userSpaceOnUse' width='16' height='16' viewBox='0 0 50 50'>
<rect width='50' height='50' fill='#663300'/>
<circle cx='25' cy='0' r='7' fill='#ccaa99'/>
<circle cx='25' cy='50' r='7' fill='#ccaa99'/>
<circle cx='0' cy='25' r='7' fill='#ccaa99'/>
<circle cx='50' cy='25' r='7' fill='#ccaa99'/>
			<line x1='1' y1='0' x2='51' y2='50' stroke='#ccaa99' stroke-width='4'/>
			<line x1='49' y1='0' x2='-1' y2='50' stroke='#ccaa99' stroke-width='4'/>
			<line x1='50' y1='0' x2='0' y2='50' stroke='#ccaa99' stroke-width='4'/>
			<line x1='0' y1='0' x2='50' y2='50' stroke='#ccaa99' stroke-width='4'/>
		</pattern>

<pattern width='16' height='20' x='0' y='0' patternUnits='userSpaceOnUse' id='space'>
<!--<rect width='16' height='20' fill='#ccffaa'/>-->
<g id='g'>
		<path d='M3 6l-4 -6 v-2 l6 6' fill-opacity='0' stroke='#389416'/>
		<path d='M7 5l4 -6 v-2 l-6 6' fill-opacity='0' stroke='#58eb09'/>
	</g>
        <use xlink:href='#g' y='-4'/>
	<use xlink:href='#g' y='4'/>
	<use xlink:href='#g' y='8'/>
	<use xlink:href='#g' y='12'/>
</pattern>

<filter id='shadow'>
      <feGaussianBlur in='SourceAlpha' stdDeviation='6.2'/>
<feOffset dx='2' dy='2' result='offsetblur'/>
<feFlood flood-color='rgba(200,200,200,0.4)'/>
<feComposite in2='offsetblur' operator='in'/>
<feMerge>
<feMergeNode/>
<feMergeNode in='SourceGraphic'/>
</feMerge>
    </filter>

    <pattern width='20' height='20' x='0' y='0' patternUnits='userSpaceOnUse' id='blackwater'>
    
<circle cx='3' cy='4.3' r='1.8' fill='#393939'/>
<circle cx='3' cy='3' r='1.8' fill='black'/>
<circle cx='10.5' cy='12.5' r='1.8' fill='#393939'/>
<circle cx='10.5' cy='11.3' r='1.8' fill='black'/>
    </pattern>
    


    </defs>
    

</svg>
        
    </body>
</html>

        ";
echo $page;
?>