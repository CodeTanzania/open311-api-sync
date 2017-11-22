open311-api-sync
===================

[![Build Status](https://travis-ci.org/CodeTanzania/open311-api-sync.svg?branch=master)](https://travis-ci.org/CodeTanzania/open311-api-sync)
[![Dependencies Status](https://david-dm.org/CodeTanzania/open311-api-sync/status.svg?style=flat-square)](https://david-dm.org/CodeTanzania/open311-api-sync)

Service Request sync for [open311-api](https://github.com/CodeTanzania/open311-api)


## Requirements
- [NodeJS v6.9.2+](https://nodejs.org)


## Installation
```sh
$ npm install --save open311-api-sync
```


## Usage
```js
const sync = require('open311-api-sync');

//set options
sync.baseUrl = <baseUrl>
sync.token = <apiToken>

//post service request
sync.post(data, done);

//patch service request
sync.patch(changes, done)

```


## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## Licence
The MIT License (MIT)

Copyright (c) 2017 lykmapipo, CodeTanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 