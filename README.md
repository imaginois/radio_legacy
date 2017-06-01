# RadIO

Rapid Application Development Input/Output

The modular, SOLID, KISS, functional reactive programming framework for JavaScript, optimized for performance and testability.

# Table of contents

-   Introduction
-   Features
-   Examples
-   Tutorial
-   API
-   Wiki
-   Code guidelines
-   Contribution guidelines

## Introduction

Functional reactive programming is a powerful programming paradigm for
expressing values that change over time. But existing libraries for JavaScript
are huge, complex, have a high learning curve and aren't functional enough.

Radio is simple and expressive. It has a minimal but powerful core on top of
which new abstractions can be built modularly.

## Features

**Main features**

-   **Monads**
-   **Purely functional**
-   **Simple but powerful**. Less is more! Radio provides combinable observable
    streams as the basic building block. This minimal core is less than 200 SLOC
    which makes the library transparent – end users can realistically get a full
    understanding of how the library works.
-   **More functional in style**. Radio is more functional than existing FRP
    libraries. Instead of methods it gives you curried functions with arguments
    in the order suitable for partial application. This gives more expressive
    power and modularity.
-   **Modularity**. The core of the Radio is powerful and documented. This makes
    it easy for users of the library to create new FRP abstractions if existing ones
    do not exist. This in turn makes it viable to capture more patterns than
    otherwise because they can exist as separate modules. 

**Other features**

-   Supports the transducer protocol. You can for instance transduce streams with
    [Ramda](http://ramdajs.com/) and [transducers.js](https://github.com/jlongster/transducers.js).
-   Complies to the [fantasy land](https://github.com/fantasyland/fantasy-land)
    applicative specification.
-   Elegant support for promises

## Examples

## Tutorial

This tutorial will introduce you to the minimal but powerful core that
Radio provides and show you how it can be used to build FRP abstractions.

### Creating streams

Radio gives you streams as the building block for creating reactive dataflows.
They serve the same purpose as what other FRP libraries call Signals, Observables,
Properties and EventEmitters.

The function `Radio.stream` creates a representation of a value that changes
over time. The resulting stream is a function. At first sight it works a bit
like a getter-setter:

```javascript
// Create a stream with initial value 5.
var number = Radio.stream(5);
// Get the current value of the stream.
console.log(number()); // logs 5
// Update the value of the stream.
console.log(number(7));
// The stream now returns the new value.
console.log(number()); // logs 7
```

Top level streams, that is streams without dependencies, should typically
depend on the external world, like user input or fetched data.

Since streams are just functions you can easily plug them in whenever a
function is expected.

```javascript
var clicks = Radio.stream();
document.getElementById('button').addEventListener('click', clicks);
var messages = Radio.stream();
webSocket.onmessage = messages;
```

Clicks events will now flow down the `clicks` stream and WebSockets messages
down the `messages` stream.

### Dependent streams

Streams can depend on other streams. Use `var combined = Radio.combine(combineFn, [a, b, c, ...])`.
The `combineFn` function will be called as `(a, b, c, ..., self, changed) => v`,
where `a, b, c, ...` is a spread of each dependency, `self` is a reference to the
combine stream itself, and `changed` is an array of streams that were atomically
updated.

Radio automatically updates the stream whenever a dependency changes.  This
means that the `sum` function below will be called whenever `x` and `y`
changes.  You can think of dependent stream as streams that automatically
listens to or subscribes to their dependencies.

```javascript
// Create two streams of numbers
var x = Radio.stream(4);
var y = Radio.stream(6);
// Create a stream that depends on the two previous streams
// and with its value given by the two added together.
var sum = Radio.combine(function(x, y) {
  return x() + y();
}, [x, y]);
// `sum` is automatically recalculated whenever the streams it depends on changes.
x(12);
console.log(sum()); // logs 18
y(8);
console.log(sum()); // logs 20
```

Naturally, a stream with dependencies can depend on other streams with dependencies.

```javascript
// Create two streams of numbers
var x = Radio.stream(4);
var y = Radio.stream(6);
var squareX = Radio.combine(function(x) {
  return x() * x();
}, [x]);
var squareXPlusY = Radio.combine(function(y, squareX) {
  return y() + squareX();
}, [y, squareX]);
console.log(squareXPlusY()); // logs 22
x(2);
console.log(squareXPlusY()); // logs 10
```

The body of a dependent stream is called with the spread of: each dependency, itself, and a list
of the dependencies that have changed since its last invocation (due to [atomic
updates](#atomic-updates) several streams could have changed).

```javascript
// Create two streams of numbers
var x = Radio.stream(1);
var y = Radio.stream(2);
var sum = Radio.combine(function(x, y, self, changed) {
  // The stream can read from itself
  console.log('Last sum was ' + self());
  // On the initial call no streams has changed and `changed` will be []
  changed.map(function(s) {
    var changedName = (s === y ? 'y' : 'x');
    console.log(changedName + ' changed to ' + s());
  });
  return x() + y();
}, [x, y]);
```

_Note_ Returning `undefined` in the `combineFn` will not trigger an update
to the stream. To trigger on undefined, update directly:

    Radio.combine((_, self, changed) => { self(undefined); }, [depStream]);

### Using callback APIs for asynchronous operations

Instead of returning a value a stream can update itself by calling itself. This
is handy when working with APIs that takes callbacks.

```javascript
var urls = Radio.stream('/something.json');
var responses = Radio.combine(function(urls, self) {
  makeRequest(urls(), self);
}, [urls]);
Radio.combine(function(responses) {
  console.log('Received response!');
  console.log(responses());
}, [responses]);
```

Note that the stream that logs the responses from the server should only be called
after an actual response has been received (otherwise `responses()` would return
`undefined`). Fortunately a stream's body will not be called before all of its declared
streams has received a value (this behaviour can be circumvented with
Radio.immediate).

### Using promises for asynchronous operations

Radio has inbuilt support for promises. Similarly to how a promise can never be
resolved with a promise, a promise can never flow down a stream. Instead the
fulfilled value of the promise will be sent down the stream.

```javascript
var urls = Radio.stream('/something.json');
var responses = Radio.stream(requestPromise(urls()));
Radio.on(function(responses) {
  console.log('Received response!');
  console.log(responses());
}, responses);
```

### Mapping over a stream

You've now seen most of the basic building block which Radio provides. Let's see
what we can do with them. Let's write a function that takes a function and a
stream and returns a new stream with the function applied to every value
emitted by the stream. In short, a `map` function.

```javascript
var mapStream = function(f, s) {
  return Radio.combine(function(s) {
    return f(s());
  }, [s]);
};
```

We simply create a new stream dependent on the first stream. We declare
the stream as a dependency so that our stream won't return values before
the original stream produces its first value.

Radio includes a similar `map` function as part of its core.

### Scanning a stream

Lets try something else: a scan function for accumulating a stream! It could
look like this:

```javascript
var scanStream = function(f, acc, s) {
  return Radio.combine(function(s) {
    acc = f(acc, s());
    return acc;
  }, [s]);
};
```

Our scan function takes an accumulator function, an initial value and a stream.
Every time the original stream emits a value we pass it to the accumulator
function along with the accumulated value.

Radio includes a `scan` function as part of its core.

### Stream endings

When you create a stream with `Radio.stream` it will have an `end` property
which is also a stream. That is an _end stream_:

```javascript
var s = Radio.stream();
console.log(Radio.isStream(s.end)); // logs `true`
```

You can end a stream by pushing `true` into its end stream:

```javascript
var s = Radio.stream();
s.end(true); // this ends `s`
```

When you create a dependent stream its end stream will initially depend on all
the end streams of its dependencies:

```javascript
var n1 = Radio.stream();
var n2 = Radio.stream();
var sum = Radio.combine(function(n1, n2) {
  return n1() + n2();
}, [n1, n2]);
```

`sum.end` now depends on `n1.end` and `n2.end`. This means that whenever one of
the `sum`s dependencies end `sum` will end as well.

You can change what a stream's end stream depends on with `Radio.endsOn`:

```javascript
var number = Radio.stream(2);
var killer = Radio.stream();
var square = Radio.endsOn(Radio.merge(number.end, killer), Radio.combine(function(number) {
  return number() * number();
}, [number]));
```

Now `square` will end if either `number` ends or if `killer` emits a value.

The fact that a stream's ending is itself a stream is a very powerful concept.
It means that we can use the full expressiveness of Radio to control when a stream
ends. For an example, take a look at the implementation of
`takeUntil`.

## API

## Wiki

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### flyd

### flyd.stream

Creates a new stream

**Signature**: `a -> Stream a`

**Parameters**

-   `initialValue` **any** (Optional) the initial value of the stream

**Examples**

```javascript
var n = flyd.stream(1); // Stream with initial value `1`
var s = flyd.stream(); // Stream with no initial value
```

Returns **[stream](https://nodejs.org/api/stream.html)** the stream

### flyd.combine

Create a new dependent stream

**Signature**: `(...Stream * -> Stream b -> b) -> [Stream *] -> Stream b`

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function used to combine the streams
-   `dependencies` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[stream](https://nodejs.org/api/stream.html)>** the streams that this one depends on

**Examples**

```javascript
var n1 = flyd.stream(0);
var n2 = flyd.stream(0);
var max = flyd.combine(function(n1, n2, self, changed) {
  return n1() > n2() ? n1() : n2();
}, [n1, n2]);
```

Returns **[stream](https://nodejs.org/api/stream.html)** the dependent stream

### flyd.isStream

Returns `true` if the supplied argument is a Flyd stream and `false` otherwise.

**Signature**: `* -> Boolean`

**Parameters**

-   `stream`  
-   `value` **any** the value to test

**Examples**

```javascript
var s = flyd.stream(1);
var n = 1;
flyd.isStream(s); //=> true
flyd.isStream(n); //=> false
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if is a Flyd streamn, `false` otherwise

### flyd.immediate

Invokes the body (the function to calculate the value) of a dependent stream

By default the body of a dependent stream is only called when all the streams
upon which it depends has a value. `immediate` can circumvent this behaviour.
It immediately invokes the body of a dependent stream.

**Signature**: `Stream a -> Stream a`

**Parameters**

-   `s`  
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the dependent stream

**Examples**

```javascript
var s = flyd.stream();
var hasItems = flyd.immediate(flyd.combine(function(s) {
  return s() !== undefined && s().length > 0;
}, [s]);
console.log(hasItems()); // logs `false`. Had `immediate` not been
                         // used `hasItems()` would've returned `undefined`
s([1]);
console.log(hasItems()); // logs `true`.
s([]);
console.log(hasItems()); // logs `false`.
```

Returns **[stream](https://nodejs.org/api/stream.html)** the same stream

### flyd.endsOn

Changes which `endsStream` should trigger the ending of `s`.

**Signature**: `Stream a -> Stream b -> Stream b`

**Parameters**

-   `endS`  
-   `s`  
-   `endStream` **[stream](https://nodejs.org/api/stream.html)** the stream to trigger the ending
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the stream to be ended by the endStream
-   `the` **[stream](https://nodejs.org/api/stream.html)** stream modified to be ended by endStream

**Examples**

```javascript
var n = flyd.stream(1);
var killer = flyd.stream();
// `double` ends when `n` ends or when `killer` emits any value
var double = flyd.endsOn(flyd.merge(n.end, killer), flyd.combine(function(n) {
  return 2 * n();
}, [n]);
```

### flyd.map

Map a stream

Returns a new stream consisting of every value from `s` passed through
`fn`. I.e. `map` creates a new stream that listens to `s` and
applies `fn` to every new value.
**Signature**: `(a -> result) -> Stream a -> Stream result`

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function that produces the elements of the new stream
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the stream to map

**Examples**

```javascript
var numbers = flyd.stream(0);
var squaredNumbers = flyd.map(function(n) { return n*n; }, numbers);
```

Returns **[stream](https://nodejs.org/api/stream.html)** a new stream with the mapped values

### flyd.on

Listen to stream events

Similar to `map` except that the returned stream is empty. Use `on` for doing
side effects in reaction to stream changes. Use the returned stream only if you
need to manually end it.

**Signature**: `(a -> result) -> Stream a -> Stream undefined`

**Parameters**

-   `cb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the callback
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the stream

Returns **[stream](https://nodejs.org/api/stream.html)** an empty stream (can be ended)

### flyd.scan

Creates a new stream with the results of calling the function on every incoming
stream with and accumulator and the incoming value.

**Signature**: `(a -> b -> a) -> a -> Stream b -> Stream a`

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function to call
-   `val` **any** the initial value of the accumulator
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the stream source

**Examples**

```javascript
var numbers = flyd.stream();
var sum = flyd.scan(function(sum, n) { return sum+n; }, 0, numbers);
numbers(2)(3)(5);
sum(); // 10
```

Returns **[stream](https://nodejs.org/api/stream.html)** the new stream

### flyd.merge

Creates a new stream down which all values from both `stream1` and `stream2`
will be sent.

**Signature**: `Stream a -> Stream a -> Stream a`

**Parameters**

-   `source1` **[stream](https://nodejs.org/api/stream.html)** one stream to be merged
-   `source2` **[stream](https://nodejs.org/api/stream.html)** the other stream to be merged

**Examples**

```javascript
var btn1Clicks = flyd.stream();
button1Elm.addEventListener(btn1Clicks);
var btn2Clicks = flyd.stream();
button2Elm.addEventListener(btn2Clicks);
var allClicks = flyd.merge(btn1Clicks, btn2Clicks);
```

Returns **[stream](https://nodejs.org/api/stream.html)** a stream with the values from both sources

### flyd.transduce

Creates a new stream resulting from applying `transducer` to `stream`.

**Signature**: `Transducer -> Stream a -> Stream b`

**Parameters**

-   `xform` **Transducer** the transducer transformation
-   `source` **[stream](https://nodejs.org/api/stream.html)** the stream source

**Examples**

```javascript
var t = require('transducers.js');

var results = [];
var s1 = flyd.stream();
var tx = t.compose(t.map(function(x) { return x * 2; }), t.dedupe());
var s2 = flyd.transduce(tx, s1);
flyd.combine(function(s2) { results.push(s2()); }, [s2]);
s1(1)(1)(2)(3)(3)(3)(4);
results; // => [2, 4, 6, 8]
```

Returns **[stream](https://nodejs.org/api/stream.html)** the new stream

### flyd.curryN

Returns `fn` curried to `n`. Use this function to curry functions exposed by
modules for Flyd.

**Parameters**

-   `arity` **Integer** the function arity
-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function to curry

**Examples**

```javascript
function add(x, y) { return x + y; };
var a = flyd.curryN(2, add);
a(2)(4) // => 6
```

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the curried function

### stream.map

Returns a new stream identical to the original except every
value will be passed through `f`.

_Note:_ This function is included in order to support the fantasy land
specification.

**Signature**: Called bound to `Stream a`: `(a -> b) -> Stream b`

**Parameters**

-   `f`  
-   `function` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function to apply

**Examples**

```javascript
var numbers = flyd.stream(0);
var squaredNumbers = numbers.map(function(n) { return n*n; });
```

Returns **[stream](https://nodejs.org/api/stream.html)** a new stream with the values mapped

### stream.ap

Returns a new stream which is the result of applying the
functions from `this` stream to the values in `stream` parameter.

`this` stream must be a stream of functions.

_Note:_ This function is included in order to support the fantasy land
specification.

**Signature**: Called bound to `Stream (a -> b)`: `a -> Stream b`

**Parameters**

-   `s2`  
-   `stream` **[stream](https://nodejs.org/api/stream.html)** the values stream

**Examples**

```javascript
var add = flyd.curryN(2, function(x, y) { return x + y; });
var numbers1 = flyd.stream();
var numbers2 = flyd.stream();
var addToNumbers1 = flyd.map(add, numbers1);
var added = addToNumbers1.ap(numbers2);
```

Returns **[stream](https://nodejs.org/api/stream.html)** a new stram with the functions applied to values

### stream.toString

Get a human readable view of a stream

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the stream string representation

### stream.end

### stream.of

**Parameters**

-   `value` **any** the initial value

**Examples**

```javascript
var n = flyd.stream(1);
var m = n.of(1);
```

Returns **[stream](https://nodejs.org/api/stream.html)** the new stream

### init

Initialization function. Starts the application

Returns **bool** Result of execution: True/False

### setRoutes

Initializes the routing object for the application
Multiple instances of the app can run different
instances of the routes object

**Parameters**

-   `routes`  

### addRoute

[addRoute description]

**Parameters**

-   `routeConfig` **\[type]** [description]

### events

The events object defines applicable event handlers
that can be attached to routes.

### addEventListener

Defines a new route. Attaches all applied event listeners

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Route path
-   `templateId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Template to be used for that route
-   `controller` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** JS object to act as a controller for the given view

Returns **void** [description]

### baseUrl

By default load any module IDs from js/lib

## Code Guidelines

### Contribution guidelines

TBD

### FAQ

### Contacts

Questions and suggestions go to **mderibanov@minervaderibanov.com**
