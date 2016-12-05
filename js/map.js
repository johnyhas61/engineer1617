/*
Auteur: John Ypma
*/
function initMap() {
        var multiPolygonStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255,0,0,0.2)'
                    })
                });
        var vectorSource = new ol.source.Vector();
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: multiPolygonStyle
            });
 
     
    var view = new ol.View({
            center: ol.proj.fromLonLat([5.0, 52.0]),
            zoom: 1
        })

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer
        ],
        view: view
    });

    map.on('singleclick', function(evt) {
        $('#info').html("");
        var viewResolution = /** @type {number} */ (view.getResolution());
        var url = wmsSource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:4326', {
                'INFO_FORMAT': 'application/json'
            });
        if (url) {
            alert (url);
            $('#info').html('<iframe seamless src="' + url + '"></iframe>');
        }
    });
    
    
    
    var serviceName = {url: 'http://gmd.has.nl:8080/geoserver/opengeo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opengeo:countries&outputFormat=application%2Fjson'};
    
    $.ajax({
        url: 'php/geoproxy.php',
        dataType: 'json',
        method: 'POST',
        data: serviceName
    })
    .done(function(data){
        var theFeatures = new ol.format.GeoJSON().readFeatures(data, {featureProjection: 'EPSG:3857'});  // conversie naar web mercator
        console.log(theFeatures);
        vectorSource.addFeatures(theFeatures);
    })
    .fail(function(){
        console.log("Het is niet gelukt");
    });
}

function loadProvincie()
{
    map.removeLayer(myWMSlayer);
    var selectedprov = $('#provselect').val();

   var wmsSource = new ol.source.TileWMS({
        url: 'http://geoserver.has.nl/geoserver/demonstratie/wms',
        params: {
            'LAYERS': 'demonstratie:geefprovincie',
            'VIEWPARAMS': 'provnaam:'+selectedprov,
            'TILED': true
        },
        serverType: 'geoserver'
    })


    myWMSlayer = new ol.layer.Tile({
        source: wmsSource
    });
    
    map.addLayer(myWMSlayer);
    
}


