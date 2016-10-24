/*
Copyright © 2016 Commonwealth Computer Research, Inc.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer. Redistributions in binary form
must reproduce the above copyright notice, this list of conditions and the
following disclaimer in the documentation and/or other materials provided with
the distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.
*/

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

  if (this.canvas_ &&
      this.renderedRevision_ == this.getRevision() &&
      this.canvas_.getResolution() == resolution &&
      this.canvas_.getPixelRatio() == pixelRatio &&
      ol.extent.containsExtent(this.canvas_.getExtent(), extent)) {
    return this.canvas_;
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

  return this.canvas_;
};
