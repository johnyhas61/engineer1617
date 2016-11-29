<?php
$url = $_POST["url"];
//$url = 'http://localhost:8080/geoserver/internationalekaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=internationalekaart:Alle%20meting%20van%2031%20januari&maxFeatures=50&outputFormat=application%2Fjson';
$res = file_get_contents($url);
echo $res;
?>
