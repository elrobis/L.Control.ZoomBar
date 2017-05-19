/*
 * L.Control.ZoomBar
 * An extended version of Leaflet's native Zoom control with Home and Zoom-to-Area buttons.
 */
L.Control.ZoomBar = L.Control.extend(
{
    options: {
        position: 'topleft'
    },
    
    initialize: function (options) {
        L.setOptions(this, options);
    },
    
    _isSmallScreen: function()
    {
        // Do some magic number math to evaluate whether we have a small screen device.
        // The area value (307456) is from a Samsung Note, which was a relatively large 
        // phone at the time and used as the max threshold for a small screen device.
        // 
        var a = window.screen.availWidth * window.screen.availHeight;
        var isSmall = (a < 307456) ? true : false;
        return isSmall;
    },
    
    onAdd: function(map)
    {
        // This implementation in some browsers (specifically Chrome) was interrupting
        // the functionality by hijacking the mousedown/mousemove events and dragging 
        // basemap tiles rather than performing the intended functions. Setting the 
        // function value to false seems to have corrected the issue without introducing
        // unwanted side-effects..
        // 
        document.ondragstart = function() { return false; };
        
        var container = L.DomUtil.create('div', 'leaflet-control-zoom' + ' leaflet-bar');
        
        this._map = map;
        
        this._zoomStartLatLng = this._map.getCenter();
        this._zoomStartZoom = this._map.getZoom();
        
        this._zoomBounds = [];
        this._zoomRect = null;
        
        this._zoomRectStyle = {
                fillOpacity: 0.2,
                color: "#00FFFF",
                weight: 1,
                clickable: false,
                draggable: false
        };
        
        this._zoomStartButton  = this._createButton('', 'Zoom to Start Position',
                'leaflet-control-zoom-to-start',  container, this._zoomStart,  this);
                
        this._zoomInButton  = this._createButton('+', 'Zoom In',
                'leaflet-control-zoom-in',  container, this._zoomIn,  this);
                
        this._zoomOutButton = this._createButton('-', 'Zoom Out',
                'leaflet-control-zoom-out', container, this._zoomOut, this);
                
        // The ZoomToArea button doesn't work well on mobile so don't add it.
        if( this._isSmallScreen()===false ){
            this._zoomToAreaButton = this._createButton('', 'Zoom to Area', 
                'leaflet-control-zoom-to-area', container, this._zoomToArea, this);
        }
        
        // Listen for zoom events and call the UI update method..
        this._map.on('zoomend zoomlevelschange', this._updateDisabled, this);
        this._updateDisabled();
        
        return container;
    },
    
    onRemove: function(map){
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },
    
    _zoomStart: function(e){
        this._map.setView(this._zoomStartLatLng, this._zoomStartZoom);
    },
    
    _zoomIn: function(e){
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },
    
    _zoomOut: function(e){
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },
    
    // Initialize the control: Add the crosshairs cursor and get ready to draw.
    _zoomToArea: function(e)
    {
        L.DomUtil.addClass(this._map._container,'crosshair-cursor-enabled');

        this._map.on('mousedown', this._startElastic, this);
        this._map.on('mouseup', this._stopElastic, this);

        this._map.dragging.disable();
    },
    
    _startElastic: function(e)
    {
        // At first, the bounds are just one point.
        // The initializing mouse-down event enables the mouse-move listener.
        // 
        this._zoomBounds = [e.latlng, e.latlng];

        this._zoomRect = new L.rectangle(this._zoomBounds,
                this._zoomRectStyle).addTo(this._map);

        this._map.on('mousemove', this._updateElastic, this);
    },
    
    _updateElastic: function(e)
    {
        // As the map moves, remove the elastic zoom indicator layer, 
        // replace the last latLng, and re-add the layer..
        // 
        this._map.removeLayer(this._zoomRect);

        this._zoomBounds.pop();
        this._zoomBounds.push(e.latlng);

        this._zoomRect = new L.rectangle(this._zoomBounds,
                this._zoomRectStyle).addTo(this._map);
    },
    
    _stopElastic: function(e)
    {
        // Kill the listeners to stop drawing our elastic zoom rectangle and
        // return the map to its inital state: no crosshairs, re-allow dragging.
        // 
        this._map.off('mousedown', this._startElastic, this);
        this._map.off('mousemove', this._updateElastic, this);
        this._map.off('mouseup', this._stopElastic, this);

        L.DomUtil.removeClass(this._map._container,'crosshair-cursor-enabled');

        this._map.fitBounds(this._zoomRect.getBounds());

        this._map.dragging.enable();

        this._map.removeLayer(this._zoomRect);
        this._zoomBounds = [];
        this._zoomRect = null;
    },
    
    _updateDisabled: function()
    {
        // As we zoom, decide if the zoom +/- buttons should be disabled.
        //
        L.DomUtil.removeClass(this._zoomInButton, 'leaflet-disabled');
        L.DomUtil.removeClass(this._zoomOutButton, 'leaflet-disabled');
        
        if(this._map._zoom <= this._map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, 'leaflet-disabled');
        }
        if(this._map._zoom >= this._map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, 'leaflet-disabled');
        }
    },
    
    _createButton: function( html, title, className, container, fn, context )
    {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;
        
        var stop = L.DomEvent.stopPropagation;
        
        L.DomEvent
            .on(link, 'click', stop)
            .on(link, 'mousedown', stop)
            .on(link, 'dblclick', stop)
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, 'click', fn, context);
        
        return link;
    }
});

L.Map.mergeOptions({
    zoomBarControl: false
});

L.Map.addInitHook(function(){
    if( this.options.zoomBarControl ){
        this.zoomBarControl = new L.Control.ZoomBar();
        this.addControl(this.zoomBarControl);
    }
});

L.control.zoomBar = function(options){
    return new L.Control.ZoomBar(options);
};