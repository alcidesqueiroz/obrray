'use strict';

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function isArray(a) {
  return a.constructor === Array;
}

function isObject(o) {
  return o === Object(o) && Object.prototype.toString.call(o) !== '[object Array]';
}

module.exports = {
  toArray(obj, options = {}) {
    if(isEmptyObject(options)) {

    }
  },

  toObject(arr, options = {}) {
    // if(isEmptyObject(options)) return Object.assign({}, )

    // }
  }
};
