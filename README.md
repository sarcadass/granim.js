# Granim.js
Create fluid and interactive gradients animations with this small (< 10 kB) js library.

**See the [demo site](http://sarcadass.github.io/granim.js)**.

## Install
* Download the script in the `dist/` folder

## Basic config
```html
<canvas id="granim-canvas"></canvas>

<script>
var granimInstance = new Granim({
   element: '#granim-canvas',
   name: 'granim',
   opacity: [1, 1],
   stateTransitionSpeed: 1000,
   states : {
       "default-state": {
           gradients: [
               ['#834d9b', '#d04ed6'],
               ['#1CD8D2', '#93EDC7']
           ],
           transitionSpeed: 5000,
           loop: true
       }
   }
);
</script>
```
