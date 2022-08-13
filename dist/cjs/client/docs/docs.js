"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractArgTypes = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.map.js");

var _metadata = require("./metadata");

var isObject = function isObject(obj) {
  return obj.toString() === '[object Object]';
};

var extractArgTypes = function extractArgTypes(component) {
  if (component) {
    var bindables = (0, _metadata.getComponentBindables)(component);
    var astData = (0, _metadata.getComponentAstData)(component, bindables.map(function (bindable) {
      return bindable.property;
    }));
    return bindables.reduce(function (acc, bindable) {
      // get all available metadata
      var tsType = (0, _metadata.getPropertyType)(component, bindable.property);
      var propAstData = astData[bindable.property] || {}; // determine data type

      var type = tsType; // get default value

      var defaultValue = propAstData.defaultValue; // determine appropriate control or action

      var control = type && type !== 'function' ? {
        type: type === 'string' ? 'text' : type
      } : undefined;
      var action = type === 'function' ? bindable.property : undefined;
      acc[bindable.attribute] = {
        name: bindable.attribute,
        defaultValue: defaultValue,
        table: {
          type: type ? {
            summary: type
          } : undefined,
          defaultValue: defaultValue !== undefined ? {
            summary: isObject(defaultValue) ? JSON.stringify(defaultValue) : defaultValue
          } : undefined
        },
        control: control,
        action: action
      };
      return acc;
    }, {});
  }

  return null;
};

exports.extractArgTypes = extractArgTypes;