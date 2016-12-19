function fillSelect() {
    var username = $('#username').val();
    var password = $('#password').val();
    var serviceName = {
        url: 'http://geoserver.has.nl/geoserver/demonstratie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demonstratie:lijstprovincies&outputFormat=application%2Fjson'
        , username: username
        , password: password
    };
    $.ajax({
        url: 'php/geoproxycurl.php'
        , dataType: 'json'
        , method: 'POST'
        , data: serviceName
    }).done(function (data) {
        var optionstext = "";
        $.each(data.features, function (i, feature) {
            optionstext += '<option value="' + feature.properties.provnaam + '">' + feature.properties.provnaam + '</option>';
        });
        $('#provselect').html(optionstext);
    }).fail(function () {
        alert("DE username password combinatie is fout");
    });
}

function getWFSFeaturesInSteps(startIndex, stepSize, numberOfFeatures) {
    serviceName = {
        url: 'http://gmd.has.nl:8080/geoserver/opengeo/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opengeo:countries&outputFormat=application%2Fjson&startIndex=' + startIndex + '&count=' + stepSize
    };
    console.log(serviceName);
    $.ajax({
        url: 'php/geoproxy.php'
        , dataType: 'json'
        , method: 'POST'
        , data: serviceName
    }).done(function (data) {
        var theFeatures = new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857'
        }); // conversie naar web mercator
        vectorSource.addFeatures(theFeatures);
        progressBarValue += stepSize*100/numberOfFeatures;
        if (progressBarValue > 100){
           progressBarValue = 100;
            $('#myBar').width(progressBarValue + '%');
           $('.w3-progress-container').fadeOut(1000);    
        } 
        console.log(progressBarValue);
        $('#myBar').width(progressBarValue + '%');
    }).fail(function () {
        console.log("Het is niet gelukt");
    });
}