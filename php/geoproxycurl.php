<?php
$url = $_POST["url"];
//$url = 'http://localhost:8080/geoserver/internationalekaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=internationalekaart:Alle%20meting%20van%2031%20januari&maxFeatures=50&outputFormat=application%2Fjson';
// create curl resource 

$ch = curl_init(); 
// set url 
curl_setopt($ch, CURLOPT_URL, $url); 
//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
// set username password
if (isset($_POST['username']) && isset($_POST['password']))
{
    $username = $_POST['username'];
    $password = $_POST['password'];
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
}
// $output contains the output string 
$output = curl_exec($ch); 
// close curl resource to free up system resources 
curl_close($ch);      
echo $output;
?>