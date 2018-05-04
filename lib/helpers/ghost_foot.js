'use strict';

// # Ghost Foot Helper
// Usage: `{{ghost_foot}}`
//
// Outputs scripts and other assets at the bottom of a Ghost theme
//
// We use the name ghost_foot to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var handlebars = require('handlebars'),
    _ = require('lodash'),
    utils = require('./utils'),
    ghost_foot;

ghost_foot = function ghost_foot(options) {
  /*jshint unused:false*/
  var foot = [];

  foot.push(utils.scriptTemplate({
    source: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment-with-locales.min.js',
    version: ''
  }));
  foot.push(utils.scriptTemplate({
    source: '//cdnjs.cloudflare.com/ajax/libs/prism/1.14.0/prism.min.js',
    version: ''
  }));
  foot.push('\n      <script type="text/javascript">\n        jQuery( document ).ready(function() {\n          $(\'time\').each(function(){\n            var element = jQuery(this);\n            if (element.text().indexOf(\'ago\')!==-1) {\n              element.html( moment(element.attr(\'datetime\')).fromNow());\n            }\n          });\n        });\n\n      </script>\n      ');
  var footString = _.reduce(foot, function (memo, item) {
    return memo + ' ' + item;
  }, '');
  return new handlebars.SafeString(footString.trim());
};

module.exports = ghost_foot;