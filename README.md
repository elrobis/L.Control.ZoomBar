# L.Control.ZoomBar
An extended version of Leaflet's native Zoom control with Home and Zoom-to-Area buttons.

[Demo](https://elrobis.github.io/L.Control.ZoomBar/)

This control will be most useful in mapping apps with a lot of desktop users who might benefit from a zoom-to-area control. Because the zoom-to-area button isn't useful on mobile due to native pinch zooming, it isn't loaded when small area screens are detected. 

The home button is loaded regardless of client device conditions. The home "location" is set to the map's initial view, which is established by a call to `map.setView()` immediately after the map is instantiated.

### Implementation:

Copy the files from the build directory into your application and save them in the same folder as your leaflet library files...don't forget the two button icon PNGs, which can be copied into Leaflet's images directory. Link the CSS and JS files in your html <head> section immediately after the leaflet library files of the same type. For example..

```
<link rel="stylesheet" type="text/css" href="src/leaflet.css"/>
<link rel="stylesheet" type="text/css" href="src/L.Control.ZoomBar.css"/>

<script type="text/javascript" src="src/leaflet.js"></script>
<script type="text/javascript" src="src/L.Control.ZoomBar.js"></script>
```

With the control library files linked, instantiate your leaflet map like normal, *except make sure to set the* `zoomControl` *option to* `false` *to disable leaflet's native zoom control.* The "home position" will be established by the initial call to `setView()`.

```
// Instantiate your leaflet map object..
//
var map = L.map('map',{
                        minZoom: 13,
                        maxZoom: 18,
                        zoomControl: false                // set to false !
                      }).setView([34.00, -81.035], 14);   // sets the reusable home position

// Instantiate the ZoomBar control..
//
var zoom_bar = new L.Control.ZoomBar({position: 'topright'}).addTo(map);
```
