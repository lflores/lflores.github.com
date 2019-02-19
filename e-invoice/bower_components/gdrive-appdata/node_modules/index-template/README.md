# index-template
Index based javascript templates. [Try it](https://adrianbota.github.io/index-template).

## Install from NPM
```
npm install --save index-template
```
## Load from nmpcdn
```
<script src="//unpkg.com/index-template/dist/index-template.js"></script>
```
This will add a global function named `indexTemplate`.

## Usage
```javascript
var indexTemplate = require('index-template');
indexTemplate('Lorem {0} dolor {1} amet', 'ipsum', 'sit'); // outputs: lorem ipsum dolor sit amet
```
or

```javascript
var indexTemplate = require('index-template');
var values = ['ipsum', 'sit'];
indexTemplate('Lorem {0} dolor {1} amet', values); // outputs: lorem ipsum dolor sit amet
```

[![Build Status](https://travis-ci.org/adrianbota/index-template.svg?branch=master)](https://travis-ci.org/adrianbota/index-template)
