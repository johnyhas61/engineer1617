/*
Auteur: John Ypma
*/
function initMap() {
    var multiPolygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red'
            , width: 2
        })
        , fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    });
    
    vectorSource = new ol.source.Vector();
    vectorLayer = new ol.layer.Vector({
        source: vectorSource
        , style: multiPolygonStyle
    });
    
    var view = new ol.View({
        center: ol.proj.fromLonLat([5.0, 52.0])
        , zoom: 7
    })
    
    map = new ol.Map({
        target: 'map'
        , layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
            , vectorLayer
        ]
        , view: view
    });
    
    map.on('click', function (evt) {
        $('#info').html("nbsp;");
        selectedFeatures.clear();
        var viewResolution = /** @type {number} */ (view.getResolution());
        var url = wmsSource.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', {
            'INFO_FORMAT': 'application/json'
        });
        if (url) {
            $('#info').html('<iframe seamless src="' + url + '"></iframe>');
        }
    });
    
    var serviceName = {
        url: 'http://gmd.has.nl:8080/geoserver/opengeo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opengeo:countries&outputFormat=application%2Fjson'
    };
    
    $.ajax({
        url: 'php/geoproxycurl.php'
        , dataType: 'json'
        , method: 'POST'
        , data: serviceName
    }).done(function (data) {
        var theFeatures = new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857'
        }); // conversie naar web mercator
        
//        theFeatures = [];
        $.each(theFeatures, function(i, feature){
            var timeoutTime = i*100;
            setTimeout(function(){
                console.log(feature);
                vectorSource.addFeature(feature);
             }, timeoutTime);
        });
       // vectorSource.addFeatures(theFeatures);
    }).fail(function () {
        console.log("Het is niet gelukt");
    });
    
    var select = new ol.interaction.Select();
    
    map.addInteraction(select);
    
    var selectedFeatures = select.getFeatures();
    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
    });
    map.addInteraction(dragBox);
    
    var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
    });
    
    map.addInteraction(selectPointerMove);
    
    selectPointerMove.on('select', function (evt) {
    //    selectedFeatures.clear();
        var myFeatures = vectorSource.getFeaturesAtCoordinate(evt.coordinate);
        $.each(myFeatures, function (i, feature) {
            selectedFeatures.push(feature);
        });
    });
    
    var infoBox = document.getElementById('info');
    
    dragBox.on('boxend', function () {
        // features that intersect the box are added to the collection of
        // selected features, and their names are displayed in the "info"
        // div
        var info = [];
        var extent = dragBox.getGeometry().getExtent();
        vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
            selectedFeatures.push(feature);
            info.push(feature.get('name'));
        });
        if (info.length > 0) {
            infoBox.innerHTML = info.join(', ');
        }
    });
    
    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
        selectedFeatures.clear();
        infoBox.innerHTML = '&nbsp;';
    });
}


function loadProvincie() {
    map.removeLayer(myWMSlayer);
    var selectedprov = $('#provselect').val();
    var wmsSource = new ol.source.TileWMS({
        url: 'http://geoserver.has.nl/geoserver/demonstratie/wms'
        , params: {
            'LAYERS': 'demonstratie:geefprovincie'
            , 'VIEWPARAMS': 'provnaam:' + selectedprov
            , 'TILED': true
        }
        , serverType: 'geoserver'
    })
    myWMSlayer = new ol.layer.Tile({
        source: wmsSource
    });
    map.addLayer(myWMSlayer);
}