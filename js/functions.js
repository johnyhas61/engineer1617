function fillSelect()
{
    var username = $('#username').val();
    var password = $('#password').val();
    var serviceName = {url: 'http://geoserver.has.nl/geoserver/demonstratie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demonstratie:lijstprovincies&outputFormat=application%2Fjson', 
                      username: username,
                      password: password};
    
    $.ajax({
        url: 'php/geoproxycurl.php',
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
    .fail(function(){
        alert ("DE username password combinatie is fout");
    });

}