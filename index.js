/*
 *
 * Add header info here
 *
 */

'use strict';

var render = (function () {
 
  var module = {},
    template = null,
    scripts = {},
    styles = {}

  //Load template and scripts+styles
  module.init = function () {
    for(var key in renderer){
      renderer[key].init()
    }
  }

  module.renderCallback = function () {
    rendererCCount++;
    if(rendererCCount >= rendererCount){
      console.log('render complete');
      renderBundle.bundle(module.bundleCallback);
    }
  }

  module.bundleCallback = function () {
    console.log('everything done');
  }
 
  return module;
 
})();

module.exports = render;