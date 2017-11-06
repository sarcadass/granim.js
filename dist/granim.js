/*! Granim v1.0.6 - https://sarcadass.github.io/granim.js */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Granim(options) {
	this.getElement(options.element);
	this.x1 = 0;
	this.y1 = 0;
	this.name = options.name || false;
	this.elToSetClassOn = options.elToSetClassOn || 'body';
	this.direction = options.direction || 'diagonal';
	this.isPausedWhenNotInView = options.isPausedWhenNotInView || false;
	this.opacity = options.opacity;
	this.states = options.states;
	this.stateTransitionSpeed = options.stateTransitionSpeed || 1000;
	this.previousTimeStamp = null;
	this.progress = 0;
	this.isPaused = false;
	this.isCleared = false;
	this.isPausedBecauseNotInView = false;
	this.iscurrentColorsSet = false;
	this.context = this.canvas.getContext('2d');
	this.channels = {};
	this.channelsIndex = 0;
	this.activeState = options.defaultStateName || 'default-state';
	this.isChangingState = false;
	this.activeColors = [];
	this.activeColorDiff = [];
	this.activetransitionSpeed = null;
	this.currentColors = [];
	this.eventPolyfill();
	if (options.image && options.image.source) {
		this.image = {
			source: options.image.source,
			position: options.image.position || ['center', 'center'],
			stretchMode: options.image.stretchMode || false,
			blendingMode: options.image.blendingMode || false
		};
	}
	this.events = {
		start: new CustomEvent('granim:start'),
		end: new CustomEvent('granim:end'),
		gradientChange: function(details) {
			return new CustomEvent('granim:gradientChange', {
				detail: {
					isLooping: details.isLooping,
					colorsFrom: details.colorsFrom,
					colorsTo: details.colorsTo,
					activeState: details.activeState
				},
				bubbles: false,
				cancelable: false
			})
		}
	};
	this.callbacks = {
		onStart: typeof options.onStart === 'function' ? options.onStart : false,
		onGradientChange: typeof options.onGradientChange === 'function' ?
			options.onGradientChange :
			false,
		onEnd: typeof options.onEnd === 'function' ? options.onEnd : false
	};
	this.getDimensions();
	this.canvas.setAttribute('width', this.x1);
	this.canvas.setAttribute('height', this.y1);
	this.setColors();
	window.addEventListener('resize', this.onResize.bind(this));

	if (this.image) {
		this.validateInput('image');
		this.prepareImage();
	}

	if (this.isPausedWhenNotInView) {
		this.pauseWhenNotInView();
	} else {
		this.refreshColors();
		this.animation = requestAnimationFrame(this.animateColors.bind(this));
	}

	// Callback and Event
	if (this.callbacks.onStart) this.callbacks.onStart();
	this.canvas.dispatchEvent(this.events.start);
}

Granim.prototype.validateInput = require('./validateInput.js');

Granim.prototype.setColors = require('./setColors.js');

Granim.prototype.prepareImage = require('./prepareImage.js');

Granim.prototype.eventPolyfill = require('./eventPolyfill.js');

Granim.prototype.colorDiff = require('./colorDiff.js');

Granim.prototype.hexToRgb = require('./hexToRgb.js');

Granim.prototype.setDirection = require('./setDirection.js');

Granim.prototype.makeGradient = require('./makeGradient.js');

Granim.prototype.getDimensions = require('./getDimensions.js');

Granim.prototype.getElement = require('./getElement.js');

Granim.prototype.animateColors = require('./animateColors.js');

Granim.prototype.getLightness = require('./getLightness.js');

Granim.prototype.refreshColors = require('./refreshColors.js');

Granim.prototype.changeState = require('./changeState.js');

Granim.prototype.changeBlendingMode = require('./changeBlendingMode.js');

Granim.prototype.pause = require('./pause.js');

Granim.prototype.play = require('./play.js');

Granim.prototype.clear = require('./clear.js');

Granim.prototype.getCurrentColors = require('./getCurrentColors.js');

Granim.prototype.pauseWhenNotInView = require('./pauseWhenNotInView.js');

Granim.prototype.onResize = require('./onResize.js');

module.exports = Granim;

},{"./animateColors.js":2,"./changeBlendingMode.js":3,"./changeState.js":4,"./clear.js":5,"./colorDiff.js":6,"./eventPolyfill.js":7,"./getCurrentColors.js":8,"./getDimensions.js":9,"./getElement.js":10,"./getLightness.js":11,"./hexToRgb.js":12,"./makeGradient.js":13,"./onResize.js":14,"./pause.js":15,"./pauseWhenNotInView.js":16,"./play.js":17,"./prepareImage.js":18,"./refreshColors.js":19,"./setColors.js":20,"./setDirection.js":21,"./validateInput.js":22}],2:[function(require,module,exports){
'use strict';

module.exports = function(timestamp) {
	var wasWindowIdled = timestamp - this.previousTimeStamp > 100;
	var isLoop = this.states[this.activeState].loop !== undefined ? this.states[this.activeState].loop : true;
	var progressPercent, isLooping, nextGradient;

	// If tab was inactive then resumed, reset the previous timestamp
	if (this.previousTimeStamp === null || wasWindowIdled) {
		this.previousTimeStamp = timestamp;
	}

	// Compute progress and save the timestamp
	this.progress = this.progress + (timestamp - this.previousTimeStamp);
	progressPercent = (this.progress / this.activetransitionSpeed * 100).toFixed(2);
	this.previousTimeStamp = timestamp;

	// Set the new gradient colors in a property
	this.refreshColors(progressPercent);

	// Continue the animation or prepare for the next one
	if (progressPercent < 100) {
		this.animation = requestAnimationFrame(this.animateColors.bind(this));

	} else {
		// if the current animation index is inferior to the penultimate gradient
		// or to the last gradient with the loop mode activated
		if (this.channelsIndex < this.states[this.activeState].gradients.length - 2 || isLoop) {

			// Set the active transition speed to the active state one after changing state
			if (this.isChangingState) {
				this.activetransitionSpeed = this.states[this.activeState].transitionSpeed || 5000;
			}

			// Resetting properties
			this.previousTimeStamp = null;
			this.progress = 0;
			this.channelsIndex++;
			isLooping = false;

			// If it's going to loop or if it's the transition after the loop
			if (this.channelsIndex === this.states[this.activeState].gradients.length - 1) {
				isLooping = true;
				
			} else if (this.channelsIndex === this.states[this.activeState].gradients.length) {
				this.channelsIndex = 0;
			}

			// Checking the next gradient to send in args of an event and a callback
			nextGradient = this.states[this.activeState].gradients[this.channelsIndex + 1] === undefined ?
				this.states[this.activeState].gradients[0] :
				this.states[this.activeState].gradients[this.channelsIndex + 1];

			// Compute the colors for the transition and render a new frame
			this.setColors();
			this.animation = requestAnimationFrame(this.animateColors.bind(this));
			
			// Callback and Event
			if (this.callbacks.onGradientChange) this.callbacks.onGradientChange({
				isLooping: isLooping,
				colorsFrom: this.states[this.activeState].gradients[this.channelsIndex],
				colorsTo: nextGradient,
				activeState: this.activeState
			});

			this.canvas.dispatchEvent(this.events.gradientChange({
					isLooping: isLooping,
					colorsFrom: this.states[this.activeState].gradients[this.channelsIndex],
					colorsTo: nextGradient,
					activeState: this.activeState
				})
			);

		// Else if it was the last gradient on the list and the loop mode is off
		} else {
			cancelAnimationFrame(this.animation);

			// Callback and Event
			if (this.callbacks.onEnd) this.callbacks.onEnd();
			this.canvas.dispatchEvent(new CustomEvent('granim:end'));
		}
	}
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(newBlendingMode) {
	this.image.blendingMode = newBlendingMode;
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(state) {
	var _this = this;
	var nextColors, colorDiff;

	// Prevent transitioning to the same state
	if (this.activeState === state) {
		return;
	}

	// Setting the good properties for the transition
	if (!this.isPaused) {
		this.isPaused = true;
		this.pause();
	}

	this.channelsIndex = -1;
	this.activetransitionSpeed = this.stateTransitionSpeed;
	this.activeColorDiff = [];
	this.activeColors = this.getCurrentColors();
	this.progress = 0;
	this.previousTimeStamp = null;
	this.isChangingState = true;

	// Compute the gradient diff between the last frame gradient
	// and the first one of the new state
	this.states[state].gradients[0].forEach(function(color, i, arr) {
		nextColors = _this.hexToRgb(_this.states[state].gradients[0][i]);
		colorDiff = _this.colorDiff(_this.activeColors[i], nextColors);
		_this.activeColorDiff.push(colorDiff);
	});

	// Start the animation
	this.activeState = state;
	this.play();
};

},{}],5:[function(require,module,exports){
'use strict';

module.exports = function() {
	if (!this.isPaused) {
		cancelAnimationFrame(this.animation);

	} else {
		this.isPaused = false;
	}
	this.isCleared = true;
	this.context.clearRect(0, 0, this.x1, this.y1);
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function(colorA, colorB) {
	var i;
	var colorDiff = [];

	for (i = 0; i < 3; i++) {
		colorDiff.push(colorB[i] - colorA[i])
	}

	return colorDiff;
};

},{}],7:[function(require,module,exports){
'use strict';

module.exports = function() {
	if ( typeof window.CustomEvent === "function" ) return;

	function CustomEvent (event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function() {
	var j;
	var currentColors = [];

	this.currentColors.forEach(function(el, i, arr) {
		currentColors.push([]);

		for (j = 0; j < 3; j++) {
			currentColors[i].push(el[j])
		}
	});

	// Return a deep copy
	return currentColors;
};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function() {
	this.x1 = this.canvas.offsetWidth;
	this.y1 = this.canvas.offsetHeight;
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(element) {
	if (element instanceof HTMLCanvasElement) {
		this.canvas = element;

	} else if (typeof element === "string") {
		this.canvas = document.querySelector(element);

	} else {
		throw new Error('The element you used is neither a String, nor a HTMLCanvasElement');
	}

	if (!this.canvas) {
		throw new Error('`' + element + '` could not be found in the DOM');
	}
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function() {
	var currentColors = this.getCurrentColors();
	var colorsAverage = [];
	var gradientAverage = null;
	var lightnessAverage;

	currentColors.forEach(function(el, i, arr) {
		// Compute the average lightness of each color
		// in the current gradient
		colorsAverage.push(
			Math.max(el[0], el[1], el[2])
		)
	});

	colorsAverage.forEach(function(el, i, arr) {
		// Add all the average lightness of each color
		gradientAverage = gradientAverage === null ?
			el :
			gradientAverage + el;

		if (i === colorsAverage.length - 1) {
			// if it's the last lightness average
			// divide it by the total length to
			// have the global average lightness
			lightnessAverage = Math.round(gradientAverage / (i + 1));
		}
	});

	return lightnessAverage >= 128 ? 'light' : 'dark';
};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function() {
	var i, colorPosition;
	var gradient = this.setDirection();
	var elToSetClassOnClass = document.querySelector(this.elToSetClassOn).classList;
	this.context.clearRect(0, 0, this.x1, this.y1);

	if (this.image) {
		if (this.image.blendingMode) {
			this.context.globalCompositeOperation = this.image.blendingMode;
		}
		this.context.drawImage(
			this.imageNode,
			this.imagePosition.x,
			this.imagePosition.y,
			this.imagePosition.width,
			this.imagePosition.height
		);
	}

	for (i = 0; i < this.currentColors.length; i++) {
		// Ensure first and last position to be 0 and 100
		!i ? colorPosition = 0 : colorPosition = ((1 / (this.currentColors.length - 1)) * i).toFixed(2);

		gradient.addColorStop(colorPosition, 'rgba(' +
			this.currentColors[i][0] + ', ' +
			this.currentColors[i][1] + ', ' +
			this.currentColors[i][2] + ', ' +
			this.opacity[i] + ')'
		);
	}

	if (this.name) {
		if (this.getLightness() === 'light') {
			elToSetClassOnClass.remove(this.name + '-dark');
			elToSetClassOnClass.add(this.name + '-light');

		} else {
			elToSetClassOnClass.remove(this.name + '-light');
			elToSetClassOnClass.add(this.name + '-dark');
		}
	}

	this.context.fillStyle = gradient;
	this.context.fillRect(0, 0, this.x1, this.y1);
};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = function() {
	this.getDimensions();
	this.canvas.setAttribute('width', this.x1);
	this.canvas.setAttribute('height', this.y1);
	if (this.image) this.prepareImage();
	this.refreshColors();
};

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(state) {
	var isPausedBecauseNotInView = state === 'isPausedBecauseNotInView';
	if (this.isCleared) {return;}
	if (!isPausedBecauseNotInView) this.isPaused = true;
	cancelAnimationFrame(this.animation);
};

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;
	var timeout;

	window.addEventListener('scroll', pauseWhenNotInView);
	pauseWhenNotInView(true);

	function pauseWhenNotInView(init) {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(function() {
			var elPos = _this.canvas.getBoundingClientRect();
			var isNotInView =
				elPos.bottom < 0 ||
				elPos.right < 0 ||
				elPos.left > window.innerWidth ||
				elPos.top > window.innerHeight;

			if (isNotInView) {
				if (!_this.isPaused && !_this.isPausedBecauseNotInView) {
					_this.isPausedBecauseNotInView = true;
					_this.pause('isPausedBecauseNotInView');
				}
			} else {
				if (!_this.isPaused || init === true) {
					_this.isPausedBecauseNotInView = false;
					_this.play('isPausedBecauseNotInView');
				}
			}
		}, 300);
	}
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = function(state) {
	var isPausedBecauseNotInView = state === 'isPausedBecauseNotInView';
	if (!isPausedBecauseNotInView) {
		this.isPaused = false;
	}
	this.isCleared = false;
	this.animation = requestAnimationFrame(this.animateColors.bind(this));
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;

	if (!this.imagePosition) {
		this.imagePosition = { x: 0, y: 0, width: 0, height: 0};
	}

	if (this.imageNode) {
		setImagePosition();
		return;
	}

	this.imageNode = new Image();
	this.imageNode.onerror = function(){
		throw new Error('Granim: The image source is invalid.');
	};
	this.imageNode.onload = function() {
		_this.imgOriginalWidth = _this.imageNode.width;
		_this.imgOriginalHeight = _this.imageNode.height;
		setImagePosition();
		_this.refreshColors();
		_this.animation = requestAnimationFrame(_this.animateColors.bind(_this));
	};
	this.imageNode.src = this.image.source;

	function setImagePosition() {
		var i, currentAxis;

		for (i = 0; i < 2; i++) {
			currentAxis = !i ? 'x' : 'y';
			setImageAxisPosition(currentAxis);
		}

		function setImageAxisPosition(axis) {
			var canvasWidthOrHeight = _this[axis + '1'];
			var imgOriginalWidthOrHeight = _this[axis === 'x' ? 'imgOriginalWidth' : 'imgOriginalHeight'];
			var imageAlignIndex = axis === 'x' ? _this.image.position[0] : _this.image.position[1];
			var imageAxisPosition;
			switch (imageAlignIndex) {
				case 'center':
					imageAxisPosition = imgOriginalWidthOrHeight > canvasWidthOrHeight ?
					-(imgOriginalWidthOrHeight - canvasWidthOrHeight) / 2 :
					(canvasWidthOrHeight - imgOriginalWidthOrHeight) / 2;
					_this.imagePosition[axis] = imageAxisPosition;
					_this.imagePosition[axis === 'x' ? 'width' : 'height'] = imgOriginalWidthOrHeight;
					break;

				case 'top':
					_this.imagePosition['y'] = 0;
					_this.imagePosition['height'] = imgOriginalWidthOrHeight;
					break;

				case 'bottom':
					_this.imagePosition['y'] = canvasWidthOrHeight - imgOriginalWidthOrHeight;
					_this.imagePosition['height'] = imgOriginalWidthOrHeight;
					break;

				case 'right':
					_this.imagePosition['x'] = canvasWidthOrHeight - imgOriginalWidthOrHeight;
					_this.imagePosition['width'] = imgOriginalWidthOrHeight;
					break;

				case 'left':
					_this.imagePosition['x'] = 0;
					_this.imagePosition['width'] = imgOriginalWidthOrHeight;
					break;
			}

			if (_this.image.stretchMode) {
				imageAlignIndex = axis === 'x' ? _this.image.stretchMode[0] : _this.image.stretchMode[1];
				switch (imageAlignIndex) {
					case 'stretch':
						_this.imagePosition[axis] = 0;
						_this.imagePosition[axis === 'x' ? 'width' : 'height'] = canvasWidthOrHeight;
						break;

					case 'stretch-if-bigger':
						if (imgOriginalWidthOrHeight < canvasWidthOrHeight) break;
						_this.imagePosition[axis] = 0;
						_this.imagePosition[axis === 'x' ? 'width' : 'height'] = canvasWidthOrHeight;
						break;

					case 'stretch-if-smaller':
						if (imgOriginalWidthOrHeight > canvasWidthOrHeight) break;
						_this.imagePosition[axis] = 0;
						_this.imagePosition[axis === 'x' ? 'width' : 'height'] = canvasWidthOrHeight;
						break;
				}
			}
		}
	}
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = function(progressPercent) {
	var activeChannel, j;
	var _this = this;

	this.activeColors.forEach(function(el, i, arr) {
		for (j = 0; j < 3; j++) {
			activeChannel = _this.activeColors[i][j] +
				Math.ceil(_this.activeColorDiff[i][j] /
					100 * progressPercent);

			if (activeChannel <= 255 && activeChannel >= 0) {
				_this.currentColors[i][j] = activeChannel;
			}
		}
	});

	this.makeGradient();
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;
	var colorDiff, nextColors;

	if (!this.channels[this.activeState]) {
		this.channels[this.activeState] = [];
	}

	// If the actual channel exist, reassign properties and exit
	// (each channel is saved to prevent recomputing it each time)
	if (this.channels[this.activeState][this.channelsIndex] !== undefined) {
		this.activeColors = this.channels[this.activeState][this.channelsIndex].colors;
		this.activeColorDiff = this.channels[this.activeState][this.channelsIndex].colorsDiff;
		return;
	}

	// Set blank properties
	this.channels[this.activeState].push([{}]);
	this.channels[this.activeState][this.channelsIndex].colors = [];
	this.channels[this.activeState][this.channelsIndex].colorsDiff = [];
	this.activeColors = [];
	this.activeColorDiff = [];

	// Go on each gradient of the current state
	this.states[this.activeState].gradients[this.channelsIndex].forEach(function(color, i, arr) {
		// Push the hex color converted to rgb on the channel and the active color properties
		var rgbColor = _this.hexToRgb(color);
		var activeChannel = _this.channels[_this.activeState];

		activeChannel[_this.channelsIndex].colors.push(rgbColor);
		_this.activeColors.push(rgbColor);

		// If it's the first channel to be set, set the currentColors
		if (!_this.iscurrentColorsSet) {
			_this.currentColors.push(_this.hexToRgb(color));
		}

		// If it's the last gradient, compute the color diff between the last gradient and the first one,
		// else between the penultimate one and the last one
		if (_this.channelsIndex === _this.states[_this.activeState].gradients.length - 1) {
			colorDiff = _this.colorDiff(
				activeChannel[_this.channelsIndex].colors[i],
				activeChannel[0].colors[i]
			);
		} else {
			nextColors = _this.hexToRgb(_this.states[_this.activeState].gradients[_this.channelsIndex + 1][i]);
			colorDiff = _this.colorDiff(
				activeChannel[_this.channelsIndex].colors[i], nextColors
			);
		}

		activeChannel[_this.channelsIndex].colorsDiff.push(colorDiff);
		_this.activeColorDiff.push(colorDiff);
	});

	this.activetransitionSpeed = this.states[this.activeState].transitionSpeed || 5000;
	this.iscurrentColorsSet = true;
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function() {
	var ctx = this.context;

	switch(this.direction) {
		default:
		case 'diagonal':
			return ctx.createLinearGradient(0, 0, this.x1, this.y1);
			break;

		case 'left-right':
			return ctx.createLinearGradient(0, 0, this.x1, 0);
			break;

		case 'top-bottom':
			return ctx.createLinearGradient(this.x1 / 2, 0, this.x1 / 2, this.y1);
			break;

		case 'radial':
			return ctx.createRadialGradient(this.x1 / 2, this.y1 / 2, this.x1 / 2, this.x1 / 2, this.y1 / 2, 0);
			break;
	}
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function(inputType) {
	var xPositionValues = ['left', 'center', 'right'];
	var yPositionValues = ['top', 'center', 'bottom'];
	var stretchModeValues = ['stretch', 'stretch-if-smaller', 'stretch-if-bigger'];

	switch(inputType) {
		default:
		case 'image':
			// Validate image.position
			if ((!Array.isArray(this.image.position) || this.image.position.length !== 2) ||
				xPositionValues.indexOf(this.image.position[0]) === -1 ||
				yPositionValues.indexOf(this.image.position[1]) === -1
			) {triggerError('image.position')}
			// Validate image.stretchMode
			if (this.image.stretchMode) {
				if ((!Array.isArray(this.image.stretchMode) || this.image.stretchMode.length !== 2) ||
					stretchModeValues.indexOf(this.image.stretchMode[0]) === -1 ||
					stretchModeValues.indexOf(this.image.stretchMode[1]) === -1
				) {triggerError('image.stretchMode')}
			}
			break;
	}
};

function triggerError(element) {
	var siteURL = 'https://sarcadass.github.io/granim.js/api.html';
	throw new Error('Granim: Input error on "' + element + '" option.\nCheck the API ' + siteURL + '.');
}

},{}],23:[function(require,module,exports){
window.Granim = require('./lib/Granim.js');

},{"./lib/Granim.js":1}]},{},[23]);
