# obrray [![Build status](https://travis-ci.com/alcidesqueiroz/obrray.svg?branch=master)](https://travis-ci.com/alcidesqueiroz/obrray)

> Convert between objects and arrays in many different ways. Wololoooo!

![Wololoooo!](https://gist.githubusercontent.com/alcidesqueiroz/c3d6c6edc559194bc37a2c464a21768d/raw/9edd7783c178fb4e1f0355047fa5e2778b0fc3bc/wololo.png)

## Install

With npm:
```
$ npm install obrray
```

With Yarn:

```
$ yarn add obrray
```

## Usage

### toObject(arr[, options])

#### arr

Type: `Array`

Array to be converted.


```js

const obrray = require('obrray');

obrray.toObject([]);
//=> {}

obrray.toObject([123]);
//=> { 0: 123 }

obrray.toObject([11, 22, 33]);
//=> { 0: 11, 1: 22, 2: 33 }

obrray.toObject([[11, 22], [33, 44], [55, 66]]);
//=> { 0: [11, 22], 1: [33, 44], 2: [55, 66] }
```

#### options

Type: `Object`

##### sameKeyAndValue

Type: `boolean`

Uses each array item both as key and value of the target object.


```js
obrray.toObject([11, 22, 33], { sameKeyAndValue: true });
//=> { 11: 11, 22: 22, 33: 33 }
```

##### keyAndValuePairs

Type: `boolean|object`

Converts from a bidimensional array with key-value pairs.

```js
// Standard key-value pairs array
obrray.toObject(
  [
    ['name', 'Ford Prefect'],
    ['planet', 'Betelgeuse Seven'],
    ['nickname', 'lx']
  ], { keyAndValuePairs: true });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }


// Array with custom indexes for key and value
obrray.toObject(
  [
    [147, false, 'Ford Prefect', [], 'name'],
    [215, true, 'Betelgeuse Seven', [111], 'planet'],
    [12, false, 'lx', [27, 1], 'nickname']
  ], { keyAndValuePairs: { keyIndex: 4, valueIndex: 2 } });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }
```

##### invertedKeyAndValuePairs

Type: `boolean`

Converts from a bidimensional array with inverted key-value pairs.

```js

// Inverted key-value pairs array
obrray.toObject(
  [
    ['Ford Prefect', 'name'],
    ['Betelgeuse Seven', 'planet'],
    ['lx', 'nickname']
  ], { invertedKeyAndValuePairs: true });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }
```

##### keyAndValueObjects

Type: `boolean|object`

Converts from an array of objects with key and value properties.

```js
// Key-value properties with default names
obrray.toObject(
  [
    { key: 'name', value: 'Ford Prefect' },
    { key: 'planet', value: 'Betelgeuse Seven' },
    { key: 'nickname', value: 'lx' }
  ], { keyAndValueObjects: true });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }


// Key-value properties with custom names
obrray.toObject(
  [
    { k: 'name', v: 'Ford Prefect' },
    { k: 'planet', v: 'Betelgeuse Seven' },
    { k: 'nickname', v: 'lx' }
  ], { keyAndValueObjects: { keyProperty: 'k', valueProperty: 'v' } });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }
```

##### mapper

Type: `function`

Uses a callback function to map each array item in a custom way.

```js
// Default approach, by returning the new value from the callback
obrray.toObject(
  [
    ['name', 147, 27, 42, false, 15, 'Ford Prefect', false],
    ['planet', 'Betelgeuse Seven', [111]],
    ['nickname', 12, false, 'lx', [27, 1], 147, 98]
  ], {
    mapper: (item) => {
      for (let i = 1; i < item.length; i++) {
        if (typeof item[i] !== 'string') continue;

        return { key: item[0], value: item[i] };
      }
    }
  });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }

// Changing the target object from within the callback
obrray.toObject(
  [
    ['name', 147, 27, 42, false, 15, 'Ford Prefect', false],
    ['planet', 'Betelgeuse Seven', [111]],
    ['nickname', 12, false, 'lx', [27, 1], 147, 98]
  ], {
    mapper: (item, targetObj) => {
      for (let i = 1; i < item.length; i++) {
        if (typeof item[i] !== 'string') continue;

        targetObj[item[0]] = item[i];
        break;
      }
    }
  });
//=> {
//     name: 'Ford Prefect',
//     planet: 'Betelgeuse Seven',
//     nickname: 'lx'
//   }
```


### toArray(obj[, options])

#### obj

Type: `Object`

Object to be converted.

```js
obrray.toArray({});
//=> []

obrray.toArray({ whatever: 123 });
//=> [123]

obrray.toArray({ name: 'Vito', surname: 'Corleone' });
//=> ['Vito', 'Corleone']

obrray.toArray({ 2: 'Corleone', 1: 'Andolini', 0: 'Vito' });
//=> ['Vito', 'Andolini', 'Corleone']

obrray.toArray({ foo: 'bar', 2: 'Corleone', 1: 'Andolini', 0: 'Vito', bar: 'foo' });
//=> ['Vito', 'Andolini', 'Corleone', 'bar', 'foo']
```

##### useKeys

Type: `boolean`

Uses property keys instead of values for each item of the mapped array

```js
obrray.toArray({ name: 'Vito', surname: 'Corleone' }, { useKeys: true });
//=> ['name', 'surname']
```

##### toKeyAndValuePairs

Type: `boolean`

Converts to an array of key and value pairs

```js
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValuePairs: true });
//=> [['name', 'Vito'], ['middleName', 'Andolini'], ['surname', 'Corleone']]
```

##### toInvertedKeyAndValuePairs

Type: `boolean`

Converts to an array of inverted key and value pairs

```js
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toInvertedKeyAndValuePairs: true });
//=> [['Vito', 'name'], ['Andolini', 'middleName'], ['Corleone', 'surname']]
```

##### toKeyAndValueObjects

Type: `boolean|object`

Converts to an array of key and value objects

```js
// Using default key-value property names
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValueObjects: true });
//=> [{ key: 'name', value: 'Vito' }, { key: 'middleName', value: 'Andolini' }, { key: 'surname', value: 'Corleone' }]

// Using custom key-value property names
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { toKeyAndValueObjects: { keyProperty: 'k', valueProperty: 'v' } });
//=>  [{ k: 'name', v: 'Vito' }, { k: 'middleName', v: 'Andolini' }, { k: 'surname', v: 'Corleone' }]
```

##### sorter

Type: `function`

Sorts the output array

```js
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { sorter: (a, b) => a.value.localeCompare(b.value) });
//=>  ['Andolini', 'Corleone', 'Vito']

// Using a sorter along with other option
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { sorter: (a, b) => a.value.localeCompare(b.value), toKeyAndValuePairs: true });
//=>  [['middleName', 'Andolini'], ['surname', 'Corleone'], ['name', 'Vito']]
```

##### mapper

Type: `function`

Uses a callback function to map each object property in a custom way.

```js
// Default approach, by returning the new value from the callback
obrray.toArray(
  {
    name: 'Vito',
    middleName: 'Andolini',
    surname: 'Corleone'
  }, { mapper: (item) => `The ${item.key} is "${item.value}"` });
//=>  ['The name is "Vito"', 'The middleName is "Andolini"', 'The surname is "Corleone"']

// Changing the target array from within the callback
obrray.toArray(
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
  });
//=>  [
//      'The name is "Vito"',
//      '...an additional item...',
//      'The middleName is "Andolini"',
//      '...an additional item...',
//      'The surname is "Corleone"',
//      '...an additional item...'
//    ]
```

## Author

Alcides Queiroz Aguiar

- Website: [www.alcidesqueiroz.com](https://www.alcidesqueiroz.com)
- Medium: [@alcidesqueiroz](https://medium.com/@alcidesqueiroz)
- Twitter: [alcidesqueiroz](https://twitter.com/alcidesqueiroz)
- Behance [alcidesqueiroz](https://behance.net/alcidesqueiroz)
- Stack Overflow: [http://is.gd/aqanso](http://stackoverflow.com/users/1295666/alcides-queiroz-aguiar)
- E-mail: alcidesqueiroz &lt;at&gt; gmail

## License

This code is free to use under the terms of the [MIT License](LICENSE.md).
