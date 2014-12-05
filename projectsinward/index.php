<?php

/*include_once "index_config.php";

$map = "ward-projects";
$config_js = $index_config['map-init'][$map];

if (isset($_GET['map']))
    $map = $_GET['map'];
//echo $index_config['map-init'][$map];
if (isset($index_config['map-init'][$map]))
    $config_js = $index_config['map-init'][$map];*/



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
        <script src=\"js/cartomancer.js\"></script>
    </head>
    <body>
    
        <div id=\"mapBox\" class=\"larger\">
            <div id=\"map\"></div>
        </div>
        <div id=\"extension-box\"></div>
        
    </body>
</html>

        ";
echo $page;
?>