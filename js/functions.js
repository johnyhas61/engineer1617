function fillSelect()
{
    var serviceName = {url: 'http://geoserver.has.nl/geoserver/demonstratie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demonstratie:lijstprovincies&outputFormat=application%2Fjson'};
    
    $.ajax({
        url: 'php/geoproxy.php',
        dataType: 'json',
        method: 'POST',
        data: serviceName
    })
    .done(function(data){
        var optionstext = "";
        $.each(data.features, function(i, feature){
            optionstext += '<option value="'+feature.properties.provnaam+'">'+feature.properties.provnaam+'</option>';
        });
        $('#provselect').html(optionstext);
    })

}