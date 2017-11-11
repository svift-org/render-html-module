/*
 *
 * Add header info here
 *
 */

'use strict';

var fs = require('fs-extra'),
  minify = require('html-minifier').minify

var render = (function () {
 
  var module = {},
    template = null,
    d3 = null,
    vis = {},
    rootDir = null

  //Load template and scripts+styles
  module.init = function (dir) {
    rootDir = dir
    var pg = require( __dirname + '/node_modules/svift-frontend/package.json')

    template = fs.readFileSync(__dirname + '/template.html', 'utf8')
    d3 = fs.readFileSync(__dirname + '/assets/d3.v4.min.js', 'utf8')
    for(var key in pg.dependencies){
      if(key.substring(0,10) == 'svift-vis-'){
        var vkey = key.substring(10)
        vis[vkey] = {
          style:fs.readFileSync(__dirname + '/node_modules/svift-frontend/build/svift-'+vkey+'.css', 'utf8'),
          script:fs.readFileSync(__dirname + '/node_modules/svift-frontend/build/svift-'+vkey+'.min.js', 'utf8')
        }
      }
    }
  }

  module.render = function (data, path) {
    var rendered = template

    //{{ TITLE }}
    //{{ DESCRIPTION }}

    rendered = rendered.replace("{{ STYLES }}", vis[data.vis.type].style)
    rendered = rendered.replace("{{ SCRIPTS }}", d3+vis[data.vis.type].script)

    //For now this is only the container, later this should include sharing/embeding/fullscreen/title etc. see seb-meier/d3-share
    rendered = rendered.replace("{{ HTML }}", '<div id="container"></div>')

    rendered = rendered.replace("{{ CODE }}", 'v = SVIFT.vis.' + data.vis.type + '(' + JSON.stringify(data) + ', d3.select("#container")); v.init(); v.start();')

    fs.writeFileSync('.' + path + '/html/index.html', rendered, 'utf8')

    //Copy assets to folder
    //TODO tile and tile-wide should be replaced by actual renderings of the visualisation
    var files = ['apple-touch-icon.png', 'browserconfig.xml', 'crossdomain.xml', 'favicon.ico', 'humans.txt', 'robots.txt', 'tile-wide.png', 'tile.png']
    files.forEach(function(file){
      fs.copySync( __dirname + '/assets/'+file, '.' + path+'/html/'+file);
    })
  }
 
  return module;
 
})();

module.exports = render;

