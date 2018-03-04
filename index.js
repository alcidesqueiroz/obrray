'use strict';

const toObjectMappingOptions = [
  'keyAndValuePairs',
  'invertedKeyAndValuePairs',
  'keyAndValueObjects',
  'mapper'];

const toArrayMappingOptions = [
  'useKeys',
  'toKeyAndValuePairs',
  'toInvertedKeyAndValuePairs',
  'toKeyAndValueObjects',
  'mapper'];

const toObjectStrategies = {
  withSameKeyAndValue(arr) {
    const obj = {};
    arr.forEach((item) => {
      validateKey(item, obj);
      obj[item] = item;
    });
    return obj;
  },

  fromKeyAndValuePairs(arr, opts) {
    validateKeyValuePair(arr, opts);

    const { keyIndex = 0, valueIndex = 1 } = isObject(opts) ? opts : {};
    const obj = {};
    arr.forEach((item) => {
      validateKey(item[keyIndex], obj);
      obj[item[keyIndex]] = item[valueIndex];
    });
    return obj;
  },

  fromInvertedKeyAndValuePairs(arr) {
    validateKeyValuePair(arr);

    const obj = {};
    arr.forEach((item) => {
      validateKey(item[1], obj);
      obj[item[1]] = item[0];
    });
    return obj;
  },

  fromKeyAndValueObjects(arr, opts) {
    const { keyProperty = 'key', valueProperty = 'value' } = isObject(opts) ? opts : {};
    const obj = {};
    arr.forEach((item) => {
      validateKey(item[keyProperty], obj);
      obj[item[keyProperty]] = item[valueProperty];
    });
    return obj;
  },

  fromMapper(arr, mapper) {
    const obj = {};
    arr.forEach((item) => {
      const mappedItem = mapper(item, obj);
      if(!mappedItem) return;

      validateKey(mappedItem.key, obj);
      obj[mappedItem.key] = mappedItem.value;
    });
    return obj;
  }
};

const toArrayStrategies = {
  fromKeys(entries) {
    return entries.map(item => item[0]);
  },

  withInvertedKeyAndValuePairs(entries) {
    return entries.map(item => [item[1], item[0]]);
  },

  fromMapper(entries, mapper) {
    let mappedItem;
    const arr = [];
    const props = entries.map(item => toKeyValueObject(item));

    for(let i = 0; i < props.length; i++) {
      mappedItem = mapper(props[i], arr);

      if(mappedItem !== undefined) {
        arr.push(mappedItem);
      }
    }

    return arr;
  },

  withKeyAndValueObjects(entries, opts) {
    const { keyProperty = 'key', valueProperty = 'value' } = isObject(opts) ? opts : {};

    return entries.map(item => ({ [keyProperty]: item[0], [valueProperty]: item[1] }));
  }
};

function toKeyValueObject(arr) {
  return { key: arr[0], value: arr[1] };
}

function validateKeyValuePair(arr, opts = null) {
  // If custom key-value indexes are passed, we need to adapt our minimum length checking
  const minimumItemLengthAllowed = isObject(opts) ?
    Math.max((opts.keyIndex + 1) || 0, (opts.valueIndex + 1) || 0) : 2;

  if(arr.some(item => !item || !isArray(item) || item.length < minimumItemLengthAllowed)) {
    throw new Error('Invalid array supplied. Expected an array of key-value pairs.');
  }
}

function validateKey(key, obj) {
  if(['number', 'string'].indexOf(typeof key) < 0) {
    throw new Error('The array supplied has an invalid key (only number and string are allowed).');
  }

  if(Object.keys(obj).indexOf(key.toString()) > -1) {
    throw new Error('The array supplied has duplicate keys.');
  }
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function isArray(a) {
  return a && a.constructor === Array;
}

function isObject(o) {
  return o && o === Object(o) && Object.prototype.toString.call(o) !== '[object Array]';
}

function hasMoreThanOneOption(optObj, allowedOpts) {
  const enabledMappingOptions = Object.entries(optObj).filter((entry) => entry[1]);
  if(enabledMappingOptions.length <= 1) return false;

  let optionsCount = 0;
  for(let i = 0; i < enabledMappingOptions.length; i++) {
    if(allowedOpts.indexOf(enabledMappingOptions[i][0]) > -1) optionsCount++;

    if(optionsCount > 1) return true;
  }

  return false;
}

module.exports = {
  toArray(obj, opts = {}) {
    if(isArray(obj)) return obj;
    if(!isObject(obj)) {
      throw new Error('The first argument supplied for toArray() method is invalid. ' +
        'Only objects are accepted.');
    }

    // Checks if only one mapping option was supplied at a time
    if(hasMoreThanOneOption(opts, toArrayMappingOptions)) {
      throw new Error('Only one mapping option can be passed at a time.');
    }

    let entries = Object.entries(obj);
    if(opts.sorter) {
      const sorterWrapper = (a, b) => opts.sorter(toKeyValueObject(a), toKeyValueObject(b));
      entries = entries.sort(sorterWrapper);
    }

    // Checks if only one mapping option was supplied at a time
    if(hasMoreThanOneOption(opts, toObjectMappingOptions)) {
      throw new Error('Only one mapping option can be passed at a time.');
    }

    if(opts.toKeyAndValuePairs) return entries;

    if(opts.useKeys) return toArrayStrategies.fromKeys(entries);

    if(opts.toInvertedKeyAndValuePairs) return toArrayStrategies.withInvertedKeyAndValuePairs(entries);

    if(opts.mapper) return toArrayStrategies.fromMapper(entries, opts.mapper);

    if(opts.toKeyAndValueObjects) {
      return toArrayStrategies.withKeyAndValueObjects(entries, opts.toKeyAndValueObjects);
    }

    return entries.map(item => item[1]);
  },

  toObject(arr, opts = {}) {
    if(isObject(arr)) return arr;
    if(!isArray(arr)) {
      throw new Error('The first argument supplied for toObject() method is invalid. ' +
        'Only arrays are accepted.');
    }

    if(isEmptyObject(opts)) return Object.assign({}, arr);

    // Checks if only one mapping option was supplied at a time
    if(hasMoreThanOneOption(opts, toObjectMappingOptions)) {
      throw new Error('Only one mapping option can be passed at a time.');
    }

    if(opts.sameKeyAndValue) return toObjectStrategies.withSameKeyAndValue(arr);

    if(opts.invertedKeyAndValuePairs) return toObjectStrategies.fromInvertedKeyAndValuePairs(arr);

    if(opts.keyAndValuePairs) {
      return toObjectStrategies.fromKeyAndValuePairs(arr, opts.keyAndValuePairs);
    }

    if(opts.keyAndValueObjects) {
      return toObjectStrategies.fromKeyAndValueObjects(arr, opts.keyAndValueObjects);
    }

    if(opts.mapper) {
      return toObjectStrategies.fromMapper(arr, opts.mapper);
    }
  }
};
