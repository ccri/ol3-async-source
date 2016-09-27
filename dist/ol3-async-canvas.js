/**
 * @classdesc
 * Base class for image sources where a canvas element is the image.
 *
 * @constructor
 * @extends {ol.source.Image}
 * @param {olx.source.ImageCanvasAsyncOptions} options Constructor options.
 * @api
 */
ol.source.ImageCanvasAsync = function(options) {

  ol.source.Image.call(this, {
    attributions: options.attributions,
    logo: options.logo,
    projection: options.projection,
    resolutions: options.resolutions,
    state: options.state
  });

  /**
   * @private
   * @type {ol.AsyncCanvasFunctionType}
   */
  this.canvasFunction_ = options.canvasFunction;

  /**
   * @private
   * @type {HTMLCanvasElement}
   */
  this.canvasElement_ = options.canvasElement;

  /**
   * @private
   * @type {ol.ImageCanvas}
   */
  this.canvas_ = null;

  /**
   * @private
   * @type {number}
   */
  this.renderedRevision_ = 0;

  /**
   * @private
   * @type {number}
   */
  this.ratio_ = options.ratio !== undefined ?
      options.ratio : 1.5;

};
ol.inherits(ol.source.ImageCanvasAsync, ol.source.Image);


/**
 * @inheritDoc
 */
ol.source.ImageCanvasAsync.prototype.getImageInternal = function(extent, resolution, pixelRatio, projection) {
  resolution = this.findNearestResolution(resolution);

  var canvas = this.canvas_;
  if (canvas &&
      this.renderedRevision_ == this.getRevision() &&
      canvas.getResolution() == resolution &&
      canvas.getPixelRatio() == pixelRatio &&
      ol.extent.containsExtent(canvas.getExtent(), extent)) {
    return canvas;
  }

  extent = extent.slice();
  ol.extent.scaleFromCenter(extent, this.ratio_);
  var width = ol.extent.getWidth(extent) / resolution;
  var height = ol.extent.getHeight(extent) / resolution;
  var size = [width * pixelRatio, height * pixelRatio];

  this.canvas_ = new ol.ImageCanvas(extent, resolution, pixelRatio,
      this.getAttributions(), this.canvasElement_,
      this.canvasFunction_.bind(this, extent, resolution, pixelRatio, size, projection));

  this.renderedRevision_ = this.getRevision();

  ol.events.listen(this.canvas_, ol.events.EventType.CHANGE,
      this.handleImageChange, this);

  return canvas;
};
