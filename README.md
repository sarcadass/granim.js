# Granim.js [![Build Status](https://travis-ci.org/sarcadass/granim.js.svg?branch=master)](https://travis-ci.org/sarcadass/granim.js) [![codecov](https://codecov.io/gh/sarcadass/granim.js/branch/master/graph/badge.svg)](https://codecov.io/gh/sarcadass/granim.js) [![gitter](https://badges.gitter.im/sarcadass/granim.png)](https://gitter.im/Granim-js/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

Create fluid and interactive gradients animations with this small (< 17 kB) js library.

**See the [demo site](http://sarcadass.github.io/granim.js)**.

## Install

### From NPM

* Run `npm install granim --save`

### From Bower

* Run `bower install granim`

### Static

* Download the latest version [in the release section](https://github.com/sarcadass/granim.js/releases)

## How to use
```html
<!-- Create a <canvas> element -->
<canvas id="granim-canvas"></canvas>

<!-- Call the script -->
<script src="granim.min.js"></script>

<!-- Create a Granim instance -->
<script>
var granimInstance = new Granim({
   element: '#granim-canvas',
   name: 'granim',
   opacity: [1, 1],
   states : {
       "default-state": {
           gradients: [
               ['#834D9B', '#D04ED6'],
               ['#1CD8D2', '#93EDC7']
           ]
       }
   }
});
</script>
```
