const tap = require('tap');
const obrray = require('./index');

/**
 * Array to object
 */

// Without options
tap.deepEqual(obrray.toObject([]), {});
tap.deepEqual(obrray.toObject([123]), { 0: 123 });
tap.deepEqual(obrray.toObject([11, 22, 33]), { 0: 11, 1: 22, 2: 33 });
tap.deepEqual(obrray.toObject([[11, 22], [33, 44], [55, 66]]), { 0: [11, 22], 1: [33, 44], 2: [55, 66] });

// Passing an object should return itself...
const obj = { test: 123 };
tap.equal(obrray.toObject(obj), obj);

// Using each array item both as key and value of the target object
tap.deepEqual(obrray.toObject([11, 22, 33], { sameKeyAndValue: true }), { 11: 11, 22: 22, 33: 33 });

const kvPairExpectedObject = {
  name: 'Ford Prefect',
  planet: 'Betelgeuse Seven',
  nickname: 'lx'
};

// Standard key-value pairs array
tap.deepEqual(obrray.toObject(
  [
    ['name', 'Ford Prefect'],
    ['planet', 'Betelgeuse Seven'],
    ['nickname', 'lx']
  ], { keyAndValuePairs: true }), kvPairExpectedObject);

// Inverted key-value pairs array
tap.deepEqual(obrray.toObject(
  [
    ['Ford Prefect', 'name'],
    ['Betelgeuse Seven', 'planet'],
    ['lx', 'nickname']
  ], { invertedKeyAndValuePairs: true }), kvPairExpectedObject);

// Array with custom indexes for key and value
tap.deepEqual(obrray.toObject(
  [
    [147, false, 'Ford Prefect', [], 'name'],
    [215, true, 'Betelgeuse Seven', [111], 'planet'],
    [12, false, 'lx', [27, 1], 'nickname']
  ], { keyAndValuePairs: { keyIndex: 4, valueIndex: 2 } }), kvPairExpectedObject);

// Array of objects with key and value properties (with default names)
tap.deepEqual(obrray.toObject(
  [
    { key: 'name', value: 'Ford Prefect' },
    { key: 'planet', value: 'Betelgeuse Seven' },
    { key: 'nickname', value: 'lx' }
  ], { keyAndValueObjects: true }), kvPairExpectedObject);

// Array of objects with key and value properties (with custom names)
tap.deepEqual(obrray.toObject(
  [
    { k: 'name', v: 'Ford Prefect' },
    { k: 'planet', v: 'Betelgeuse Seven' },
    { k: 'nickname', v: 'lx' }
  ], { keyAndValueObjects: { keyProperty: 'k', valueProperty: 'v' } }), kvPairExpectedObject);

// Array of items with different structures (passing a mapping callback)
tap.deepEqual(obrray.toObject(
  [
    ['name', 147, 27, 42, false, 15, 'Ford Prefect', false],
    ['planet', 'Betelgeuse Seven', [111]],
    ['nickname', 12, false, 'lx', [27, 1], 147, 98]
  ], { mapper: (item) => {
      for (let i = 1; i < item.length; i++) {
        if (typeof item[i] !== 'string') continue;

        return { key: item[0], value: item[i] };
      }
    }
  }), kvPairExpectedObject);

// Array of items with different structures (changing the target object from within the callback)
tap.deepEqual(obrray.toObject(
  [
    ['name', 147, 27, 42, false, 15, 'Ford Prefect', false],
    ['planet', 'Betelgeuse Seven', [111]],
    ['nickname', 12, false, 'lx', [27, 1], 147, 98]
  ], { mapper: (item, targetObj) => {
      for (let i = 1; i < item.length; i++) {
        if (typeof item[i] !== 'string') continue;

        targetObj[item[0]] = item[i];
      }
    }
  }), kvPairExpectedObject);

// Using a no-op mapper
tap.deepEqual(obrray.toObject(
  [
    ['name', 'Ford Prefect'],
    ['planet', 'Betelgeuse Seven'],
    ['nickname', 'lx']
  ], { mapper: () => {} }), {});

// Passing an invalid option returns the default output
tap.deepEqual(obrray.toObject([11, 22, 33], { someInvalidOption: true }), { 0: 11, 1: 22, 2: 33 });


/**
 * Object to array
 */

// Without options
tap.deepEqual(obrray.toArray({}), []);
tap.deepEqual(obrray.toArray({ whatever: 123 }), [123]);
tap.deepEqual(obrray.toArray({ name: 'Vito', surname: 'Corleone' }), ['Vito', 'Corleone']);
tap.deepEqual(obrray.toArray({ 2: 'Corleone', 1: 'Andolini', 0: 'Vito' }), ['Vito', 'Andolini', 'Corleone']);
tap.deepEqual(obrray.toArray({ foo: 'bar', 2: 'Corleone', 1: 'Andolini', 0: 'Vito', bar: 'foo' }),
  ['Vito', 'Andolini', 'Corleone', 'bar', 'foo']);

// Passing an array should return itself...
const arr = [11, 22, 33];
tap.equal(obrray.toArray(arr), arr);


// Using property keys instead of values for each item
tap.deepEqual(obrray.toArray({ name: 'Vito', surname: 'Corleone' }, { useKeys: true }),
  ['name', 'surname']);

// Converting to an array of key and value pairs
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValuePairs: true }),
  [['name', 'Vito'], ['middleName', 'Andolini'], ['surname', 'Corleone']]);

// Converting to an array of inverted key and value pairs
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toInvertedKeyAndValuePairs: true }),
  [['Vito', 'name'], ['Andolini', 'middleName'], ['Corleone', 'surname']]);

// Converting to an array of key and value objects (with default property names)
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValueObjects: true }),
  [{ key: 'name', value: 'Vito' }, { key: 'middleName', value: 'Andolini' }, { key: 'surname', value: 'Corleone' }]);

// Converting to an array of key and value objects (with custom property names)
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValueObjects: { keyProperty: 'k', valueProperty: 'v' } }),
  [{ k: 'name', v: 'Vito' }, { k: 'middleName', v: 'Andolini' }, { k: 'surname', v: 'Corleone' }]);

// Using a sorter
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { sorter: (a, b) => a.value.localeCompare(b.value) }),
  ['Andolini', 'Corleone', 'Vito']);

// Using a sorter along with other option
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { sorter: (a, b) => a.value.localeCompare(b.value), toKeyAndValuePairs: true }),
  [['middleName', 'Andolini'], ['surname', 'Corleone'], ['name', 'Vito']]);

// Using a custom mapper
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { mapper: (item) => `The ${item.key} is "${item.value}"` }),
  ['The name is "Vito"', 'The middleName is "Andolini"', 'The surname is "Corleone"']);

// Using a custom mapper  (changing the target array from within the callback)
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  },
  {
    mapper: (item, targetArr) => {
      targetArr.push(`The ${item.key} is "${item.value}"`);
      targetArr.push('...an additional item...');
    }
  }),
  [
    'The name is "Vito"',
    '...an additional item...',
    'The middleName is "Andolini"',
    '...an additional item...',
    'The surname is "Corleone"',
    '...an additional item...'
  ]);

// Using a no-op mapper
tap.deepEqual(obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { mapper: () => {} }), []);

// Passing an invalid option returns the default output
tap.deepEqual(obrray.toArray({
  name: 'Vito',
  middleName: 'Andolini',
  surname: 'Corleone'
}, { someInvalidOption: true }), ['Vito', 'Andolini', 'Corleone']);



/**
 * Errors
 */

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

// Accepted types checking
[true, 15, 'whatever', undefined, null].forEach((testValue) => {
  tap.throws(() => obrray.toArray(testValue),
    new Error('The first argument supplied for toArray() method is invalid. Only objects are accepted.'));

  tap.throws(() => obrray.toObject(testValue),
    new Error('The first argument supplied for toObject() method is invalid. Only arrays are accepted.'));
});

// Only one mapping option at once checking
getPairs(toObjectMappingOptions).forEach((optionsPair) => {
  tap.throws(() => obrray.toObject([], { [optionsPair[0]]: true, [optionsPair[1]]: true }),
    new Error('Only one mapping option can be passed at a time.'));
});

getPairs(toArrayMappingOptions).forEach((optionsPair) => {
  tap.throws(() => obrray.toArray({}, { [optionsPair[0]]: true, [optionsPair[1]]: true }),
    new Error('Only one mapping option can be passed at a time.'));
});

// Invalid key checking
[true, {}, [], undefined, null].forEach((testValue) => {
  tap.throws(() => obrray.toObject([testValue], { sameKeyAndValue: true }),
    new Error('The array supplied has an invalid key (only number and string are allowed).'));
});

// Duplicate keys checking
tap.throws(() => obrray.toObject([11, 11, 22], { sameKeyAndValue: true }),
  new Error('The array supplied has duplicate keys.'));

// Valid key-value array checking
tap.throws(() => obrray.toObject([[1, 11], [2], [3, 33]], { keyAndValuePairs: true }),
  new Error('Invalid array supplied. Expected an array of key-value pairs.'));

tap.throws(() => obrray.toObject([[1, 11]], { keyAndValuePairs: { valueIndex: 10 } }),
  new Error('Invalid array supplied. Expected an array of key-value pairs.'));

function getPairs(arr) {
    const pairs = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        pairs.push([arr[i], arr[j]]);
      }
    }

    return pairs;
}
