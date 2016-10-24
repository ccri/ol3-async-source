# ol3-async-source
An Asynchronous ImageCanvas Source for OpenLayers 3.x

## Usage
This source is based on the original [ol.source.ImageCanvas][1] ([docs][2]) and the interface is largely the same, but of course there are some differences:

* Instead of the canvasFunction returning a canvas object, the source has an extra config parameter: a reference to a canvas object, called `canvasElement`
* The canvasFunction has an extra parameter, a `callback` to call when rendering is complete.

### Example
``` javascript
var canvas = document.createElement('canvas');

var source = new ol.source.ImageCanvasAsync({
    canvasElement: canvas,
    canvasFunction: function (extent, resolution, pixelRatio, size, projection, callback) {
        doAsyncRender(...).then(callback);
    }
    projection: ...,
    ratio: ...
});
```

## License
[BSD-2][3] (c) Commonwealth Computer Research, Inc.

[1]: https://github.com/openlayers/ol3/blob/master/src/ol/source/imagecanvas.js
[2]: http://openlayers.org/en/latest/apidoc/ol.source.ImageCanvas.html
[3]: https://tldrlegal.com/license/bsd-2-clause-license-(freebsd)
