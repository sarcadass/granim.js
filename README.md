# Granim.js
Create fluid and interactive gradients animations with this small (< 10 kB) js library.

**See the [demo site](http://sarcadass.github.io/granim.js)**.

## Install

### From npm

* Run `npm install granim --save`

### Static

* Download the script in the `dist/` folder

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
