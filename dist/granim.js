(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Granim(options) {
	var doesGradientUseOpacity;
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
	this.scrollDebounceThreshold = options.scrollDebounceThreshold || 300;
	this.scrollDebounceTimeout = null;
	this.isImgLoaded = false;
	this.isCanvasInWindowView = false;
	this.firstScrollInit = true;
	this.animating = false;
	if (options.image && options.image.source) {
		this.image = {
			source: options.image.source,
			position: options.image.position || ['center', 'center'],
			stretchMode: options.image.stretchMode || false,
			blendingMode: options.image.blendingMode || false
		};
	}
	doesGradientUseOpacity = this.opacity.map(function(el) {return el !== 1})
		.indexOf(true) !== -1;
	this.shouldClearCanvasOnEachFrame = !!this.image || doesGradientUseOpacity;
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

	if (this.image) {
		this.validateInput('image');
		this.prepareImage();
	}

	this.pauseWhenNotInViewNameSpace = this.pauseWhenNotInView.bind(this);
	this.setSizeAttributesNameSpace = this.setSizeAttributes.bind(this);
	this.onResize();

	if (this.isPausedWhenNotInView) {
		this.onScroll();
	} else {
		if (!this.image) {
			this.refreshColors();
			this.animation = requestAnimationFrame(this.animateColors.bind(this));
			this.animating = true;
		}
	}

	// Callback and Event
	if (this.callbacks.onStart) this.callbacks.onStart();
	this.canvas.dispatchEvent(this.events.start);
}

Granim.prototype.onResize = require('./onResize.js');

Granim.prototype.onScroll = require('./onScroll.js');

Granim.prototype.validateInput = require('./validateInput.js');

Granim.prototype.triggerError = require('./triggerError.js');

Granim.prototype.prepareImage = require('./prepareImage.js');

Granim.prototype.eventPolyfill = require('./eventPolyfill.js');

Granim.prototype.colorDiff = require('./colorDiff.js');

Granim.prototype.hexToRgb = require('./hexToRgb.js');

Granim.prototype.setDirection = require('./setDirection.js');

Granim.prototype.setColors = require('./setColors.js');

Granim.prototype.getElement = require('./getElement.js');

Granim.prototype.getDimensions = require('./getDimensions.js');

Granim.prototype.getLightness = require('./getLightness.js');

Granim.prototype.getCurrentColors = require('./getCurrentColors.js');

Granim.prototype.animateColors = require('./animateColors.js');

Granim.prototype.refreshColors = require('./refreshColors.js');

Granim.prototype.makeGradient = require('./makeGradient.js');

Granim.prototype.pause = require('./pause.js');

Granim.prototype.play = require('./play.js');

Granim.prototype.clear = require('./clear.js');

Granim.prototype.destroy = require('./destroy.js');

Granim.prototype.pauseWhenNotInView = require('./pauseWhenNotInView.js');

Granim.prototype.setSizeAttributes = require('./setSizeAttributes.js');

Granim.prototype.changeDirection = require('./changeDirection.js');

Granim.prototype.changeBlendingMode = require('./changeBlendingMode.js');

Granim.prototype.changeState = require('./changeState.js');

module.exports = Granim;

},{"./animateColors.js":2,"./changeBlendingMode.js":3,"./changeDirection.js":4,"./changeState.js":5,"./clear.js":6,"./colorDiff.js":7,"./destroy.js":8,"./eventPolyfill.js":9,"./getCurrentColors.js":10,"./getDimensions.js":11,"./getElement.js":12,"./getLightness.js":13,"./hexToRgb.js":14,"./makeGradient.js":15,"./onResize.js":16,"./onScroll.js":17,"./pause.js":18,"./pauseWhenNotInView.js":19,"./play.js":20,"./prepareImage.js":21,"./refreshColors.js":22,"./setColors.js":23,"./setDirection.js":24,"./setSizeAttributes.js":25,"./triggerError.js":26,"./validateInput.js":27}],2:[function(require,module,exports){
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
	this.context.clearRect(0, 0, this.x1, this.y1);
	this.context.globalCompositeOperation =
		this.image.blendingMode = newBlendingMode;
	this.validateInput('blendingMode');
	if (this.isPaused) this.refreshColors();
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(newDirection) {
	this.context.clearRect(0, 0, this.x1, this.y1);
	this.direction = newDirection;
	this.validateInput('direction');
	if (this.isPaused) this.refreshColors();
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

module.exports = function(colorA, colorB) {
	var i;
	var colorDiff = [];

	for (i = 0; i < 3; i++) {
		colorDiff.push(colorB[i] - colorA[i])
	}

	return colorDiff;
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function() {
	this.onResize('removeListeners');
	this.onScroll('removeListeners');
	this.clear();
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function() {
	var i, j;
	var currentColors = [];

	for (i = 0; i < this.currentColors.length; i++) {
		currentColors.push([]);
		for (j = 0; j < 3; j++) {currentColors[i].push(this.currentColors[i][j])}
	}

	// Return a deep copy of the current colors
	return currentColors;
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function() {
	this.x1 = this.canvas.offsetWidth;
	this.y1 = this.canvas.offsetHeight;
};

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function() {
	var currentColors = this.getCurrentColors();
	var gradientAverage = null;
	var lightnessAverage, i;
	var colorsAverage = currentColors.map(function(el) {
		// Compute the average lightness of each color
		// in the current gradient
		return Math.max(el[0], el[1], el[2]);
	});

	for (i = 0; i < colorsAverage.length; i++) {
		// Add all the average lightness of each color
		gradientAverage = gradientAverage === null ?
			colorsAverage[i] : gradientAverage + colorsAverage[i];

		if (i === colorsAverage.length - 1) {
			// if it's the last lightness average
			// divide it by the total length to
			// have the global average lightness
			lightnessAverage = Math.round(gradientAverage / (i + 1));
		}
	}

	return lightnessAverage >= 128 ? 'light' : 'dark';
};

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function() {
	var i, colorPosition;
	var gradient = this.setDirection();
	var elToSetClassOnClass = document.querySelector(this.elToSetClassOn).classList;

	if (this.shouldClearCanvasOnEachFrame) this.context.clearRect(0, 0, this.x1, this.y1);

	if (this.image) {
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
		colorPosition = !i ? 0 : ((1 / (this.currentColors.length - 1)) * i).toFixed(2);

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

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function(type) {
	if (type === 'removeListeners') {
		window.removeEventListener('resize', this.setSizeAttributesNameSpace);
		return;
	}

	window.addEventListener('resize', this.setSizeAttributesNameSpace);
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = function(type) {
	if (type === 'removeListeners') {
		window.removeEventListener('scroll', this.pauseWhenNotInViewNameSpace);
		return;
	}

	window.addEventListener('scroll', this.pauseWhenNotInViewNameSpace);
	this.pauseWhenNotInViewNameSpace();
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function(state) {
	var isPausedBecauseNotInView = state === 'isPausedBecauseNotInView';
	if (this.isCleared) return;
	if (!isPausedBecauseNotInView) this.isPaused = true;
	cancelAnimationFrame(this.animation);
	this.animating = false;
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;
	if (this.scrollDebounceTimeout) clearTimeout(this.scrollDebounceTimeout);

	this.scrollDebounceTimeout = setTimeout(function() {
		var elPos = _this.canvas.getBoundingClientRect();
		_this.isCanvasInWindowView = !(elPos.bottom < 0 || elPos.right < 0 ||
			elPos.left > window.innerWidth || elPos.top > window.innerHeight);

		if (_this.isCanvasInWindowView) {
			if (!_this.isPaused || _this.firstScrollInit) {
				if (_this.image && !_this.isImgLoaded) {return}
				_this.isPausedBecauseNotInView = false;
				_this.play('isPlayedBecauseInView');
				_this.firstScrollInit = false;
			}

		} else {
			if (!_this.image && _this.firstScrollInit) {
				_this.refreshColors();
				_this.firstScrollInit = false;
			}

			if (!_this.isPaused && !_this.isPausedBecauseNotInView) {
				_this.isPausedBecauseNotInView = true;
				_this.pause('isPausedBecauseNotInView');
			}
		}
	}, this.scrollDebounceThreshold);
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function(state) {
	var isPlayedBecauseInView = state === 'isPlayedBecauseInView';
	if (!isPlayedBecauseInView) this.isPaused = false;
	this.isCleared = false;
	if (!this.animating) {
		this.animation = requestAnimationFrame(this.animateColors.bind(this));
		this.animating = true;
	}
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;

	if (!this.imagePosition) {
		this.imagePosition = { x: 0, y: 0, width: 0, height: 0 };
	}

	if (this.image.blendingMode) {
		this.context.globalCompositeOperation = this.image.blendingMode;
	}

	if (this.imageNode) {
		setImagePosition();
		return;
	}

	this.imageNode = new Image();
	this.imageNode.onerror = function() {
		throw new Error('Granim: The image source is invalid.');
	};
	this.imageNode.onload = function() {
		_this.imgOriginalWidth = _this.imageNode.width;
		_this.imgOriginalHeight = _this.imageNode.height;
		setImagePosition();
		_this.refreshColors();
		if (!_this.isPausedWhenNotInView || _this.isCanvasInWindowView) {
			_this.animation = requestAnimationFrame(_this.animateColors.bind(_this));
		}
		_this.isImgLoaded = true;
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

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function(progressPercent) {
	var _this = this;
	var activeChannel, i, j;

	// Loop through each colors of the active gradient
	for (i = 0; i < this.activeColors.length; i++) {

		// Generate RGB colors
		for (j = 0; j < 3; j++) {
			activeChannel = _this.activeColors[i][j] +
				Math.ceil(_this.activeColorDiff[i][j] / 100 * progressPercent);

			// Prevent colors values from going < 0 & > 255
			if (activeChannel <= 255 && activeChannel >= 0) {
				_this.currentColors[i][j] = activeChannel;
			}
		}
	}

	this.makeGradient();
};

},{}],23:[function(require,module,exports){
'use strict';

module.exports = function() {
	var _this = this;
	var colorDiff, nextColors;

	if (!this.channels[this.activeState]) this.channels[this.activeState] = [];

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
	this.states[this.activeState].gradients[this.channelsIndex].forEach(function(color, i) {
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

},{}],24:[function(require,module,exports){
'use strict';

module.exports = function() {
	var ctx = this.context;

	switch(this.direction) {
		default:
			this.triggerError('direction');
			break;
		
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

},{}],25:[function(require,module,exports){
'use strict';

module.exports = function() {
	this.getDimensions();
	this.canvas.setAttribute('width', this.x1);
	this.canvas.setAttribute('height', this.y1);
	if (this.image) this.prepareImage();
	this.refreshColors();
};

},{}],26:[function(require,module,exports){
'use strict';

module.exports = function(element) {
	var siteURL = 'https://sarcadass.github.io/granim.js/api.html';
	throw new Error('Granim: Input error on "' + element + '" option.\nCheck the API ' + siteURL + '.');
};

},{}],27:[function(require,module,exports){
'use strict';

module.exports = function(inputType) {
	var xPositionValues = ['left', 'center', 'right'];
	var yPositionValues = ['top', 'center', 'bottom'];
	var stretchModeValues = ['stretch', 'stretch-if-smaller', 'stretch-if-bigger'];
	var blendingModeValues = ['multiply', 'screen', 'normal', 'overlay', 'darken',
		'lighten', 'lighter', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
		'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];

	switch(inputType) {
		case 'image':
			// Validate image.position
			if ((!Array.isArray(this.image.position) || this.image.position.length !== 2) ||
				xPositionValues.indexOf(this.image.position[0]) === -1 ||
				yPositionValues.indexOf(this.image.position[1]) === -1
			) {this.triggerError('image.position')}
			// Validate image.stretchMode
			if (this.image.stretchMode) {
				if ((!Array.isArray(this.image.stretchMode) || this.image.stretchMode.length !== 2) ||
					stretchModeValues.indexOf(this.image.stretchMode[0]) === -1 ||
					stretchModeValues.indexOf(this.image.stretchMode[1]) === -1
				) {this.triggerError('image.stretchMode')}
			}
			break;
		case 'blendingMode':
			if (blendingModeValues.indexOf(this.image.blendingMode) === -1) {
				this.clear();
				this.triggerError('blendingMode');
			}
	}
};

},{}],28:[function(require,module,exports){
window.Granim = require('./lib/Granim.js');

},{"./lib/Granim.js":1}]},{},[28])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvR3JhbmltLmpzIiwibGliL2FuaW1hdGVDb2xvcnMuanMiLCJsaWIvY2hhbmdlQmxlbmRpbmdNb2RlLmpzIiwibGliL2NoYW5nZURpcmVjdGlvbi5qcyIsImxpYi9jaGFuZ2VTdGF0ZS5qcyIsImxpYi9jbGVhci5qcyIsImxpYi9jb2xvckRpZmYuanMiLCJsaWIvZGVzdHJveS5qcyIsImxpYi9ldmVudFBvbHlmaWxsLmpzIiwibGliL2dldEN1cnJlbnRDb2xvcnMuanMiLCJsaWIvZ2V0RGltZW5zaW9ucy5qcyIsImxpYi9nZXRFbGVtZW50LmpzIiwibGliL2dldExpZ2h0bmVzcy5qcyIsImxpYi9oZXhUb1JnYi5qcyIsImxpYi9tYWtlR3JhZGllbnQuanMiLCJsaWIvb25SZXNpemUuanMiLCJsaWIvb25TY3JvbGwuanMiLCJsaWIvcGF1c2UuanMiLCJsaWIvcGF1c2VXaGVuTm90SW5WaWV3LmpzIiwibGliL3BsYXkuanMiLCJsaWIvcHJlcGFyZUltYWdlLmpzIiwibGliL3JlZnJlc2hDb2xvcnMuanMiLCJsaWIvc2V0Q29sb3JzLmpzIiwibGliL3NldERpcmVjdGlvbi5qcyIsImxpYi9zZXRTaXplQXR0cmlidXRlcy5qcyIsImxpYi90cmlnZ2VyRXJyb3IuanMiLCJsaWIvdmFsaWRhdGVJbnB1dC5qcyIsInN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEdyYW5pbShvcHRpb25zKSB7XG5cdHZhciBkb2VzR3JhZGllbnRVc2VPcGFjaXR5O1xuXHR0aGlzLmdldEVsZW1lbnQob3B0aW9ucy5lbGVtZW50KTtcblx0dGhpcy54MSA9IDA7XG5cdHRoaXMueTEgPSAwO1xuXHR0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgZmFsc2U7XG5cdHRoaXMuZWxUb1NldENsYXNzT24gPSBvcHRpb25zLmVsVG9TZXRDbGFzc09uIHx8ICdib2R5Jztcblx0dGhpcy5kaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbiB8fCAnZGlhZ29uYWwnO1xuXHR0aGlzLmlzUGF1c2VkV2hlbk5vdEluVmlldyA9IG9wdGlvbnMuaXNQYXVzZWRXaGVuTm90SW5WaWV3IHx8IGZhbHNlO1xuXHR0aGlzLm9wYWNpdHkgPSBvcHRpb25zLm9wYWNpdHk7XG5cdHRoaXMuc3RhdGVzID0gb3B0aW9ucy5zdGF0ZXM7XG5cdHRoaXMuc3RhdGVUcmFuc2l0aW9uU3BlZWQgPSBvcHRpb25zLnN0YXRlVHJhbnNpdGlvblNwZWVkIHx8IDEwMDA7XG5cdHRoaXMucHJldmlvdXNUaW1lU3RhbXAgPSBudWxsO1xuXHR0aGlzLnByb2dyZXNzID0gMDtcblx0dGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuXHR0aGlzLmlzQ2xlYXJlZCA9IGZhbHNlO1xuXHR0aGlzLmlzUGF1c2VkQmVjYXVzZU5vdEluVmlldyA9IGZhbHNlO1xuXHR0aGlzLmlzY3VycmVudENvbG9yc1NldCA9IGZhbHNlO1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHR0aGlzLmNoYW5uZWxzID0ge307XG5cdHRoaXMuY2hhbm5lbHNJbmRleCA9IDA7XG5cdHRoaXMuYWN0aXZlU3RhdGUgPSBvcHRpb25zLmRlZmF1bHRTdGF0ZU5hbWUgfHwgJ2RlZmF1bHQtc3RhdGUnO1xuXHR0aGlzLmlzQ2hhbmdpbmdTdGF0ZSA9IGZhbHNlO1xuXHR0aGlzLmFjdGl2ZUNvbG9ycyA9IFtdO1xuXHR0aGlzLmFjdGl2ZUNvbG9yRGlmZiA9IFtdO1xuXHR0aGlzLmFjdGl2ZXRyYW5zaXRpb25TcGVlZCA9IG51bGw7XG5cdHRoaXMuY3VycmVudENvbG9ycyA9IFtdO1xuXHR0aGlzLmV2ZW50UG9seWZpbGwoKTtcblx0dGhpcy5zY3JvbGxEZWJvdW5jZVRocmVzaG9sZCA9IG9wdGlvbnMuc2Nyb2xsRGVib3VuY2VUaHJlc2hvbGQgfHwgMzAwO1xuXHR0aGlzLnNjcm9sbERlYm91bmNlVGltZW91dCA9IG51bGw7XG5cdHRoaXMuaXNJbWdMb2FkZWQgPSBmYWxzZTtcblx0dGhpcy5pc0NhbnZhc0luV2luZG93VmlldyA9IGZhbHNlO1xuXHR0aGlzLmZpcnN0U2Nyb2xsSW5pdCA9IHRydWU7XG5cdHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG5cdGlmIChvcHRpb25zLmltYWdlICYmIG9wdGlvbnMuaW1hZ2Uuc291cmNlKSB7XG5cdFx0dGhpcy5pbWFnZSA9IHtcblx0XHRcdHNvdXJjZTogb3B0aW9ucy5pbWFnZS5zb3VyY2UsXG5cdFx0XHRwb3NpdGlvbjogb3B0aW9ucy5pbWFnZS5wb3NpdGlvbiB8fCBbJ2NlbnRlcicsICdjZW50ZXInXSxcblx0XHRcdHN0cmV0Y2hNb2RlOiBvcHRpb25zLmltYWdlLnN0cmV0Y2hNb2RlIHx8IGZhbHNlLFxuXHRcdFx0YmxlbmRpbmdNb2RlOiBvcHRpb25zLmltYWdlLmJsZW5kaW5nTW9kZSB8fCBmYWxzZVxuXHRcdH07XG5cdH1cblx0ZG9lc0dyYWRpZW50VXNlT3BhY2l0eSA9IHRoaXMub3BhY2l0eS5tYXAoZnVuY3Rpb24oZWwpIHtyZXR1cm4gZWwgIT09IDF9KVxuXHRcdC5pbmRleE9mKHRydWUpICE9PSAtMTtcblx0dGhpcy5zaG91bGRDbGVhckNhbnZhc09uRWFjaEZyYW1lID0gISF0aGlzLmltYWdlIHx8IGRvZXNHcmFkaWVudFVzZU9wYWNpdHk7XG5cdHRoaXMuZXZlbnRzID0ge1xuXHRcdHN0YXJ0OiBuZXcgQ3VzdG9tRXZlbnQoJ2dyYW5pbTpzdGFydCcpLFxuXHRcdGVuZDogbmV3IEN1c3RvbUV2ZW50KCdncmFuaW06ZW5kJyksXG5cdFx0Z3JhZGllbnRDaGFuZ2U6IGZ1bmN0aW9uKGRldGFpbHMpIHtcblx0XHRcdHJldHVybiBuZXcgQ3VzdG9tRXZlbnQoJ2dyYW5pbTpncmFkaWVudENoYW5nZScsIHtcblx0XHRcdFx0ZGV0YWlsOiB7XG5cdFx0XHRcdFx0aXNMb29waW5nOiBkZXRhaWxzLmlzTG9vcGluZyxcblx0XHRcdFx0XHRjb2xvcnNGcm9tOiBkZXRhaWxzLmNvbG9yc0Zyb20sXG5cdFx0XHRcdFx0Y29sb3JzVG86IGRldGFpbHMuY29sb3JzVG8sXG5cdFx0XHRcdFx0YWN0aXZlU3RhdGU6IGRldGFpbHMuYWN0aXZlU3RhdGVcblx0XHRcdFx0fSxcblx0XHRcdFx0YnViYmxlczogZmFsc2UsXG5cdFx0XHRcdGNhbmNlbGFibGU6IGZhbHNlXG5cdFx0XHR9KVxuXHRcdH1cblx0fTtcblx0dGhpcy5jYWxsYmFja3MgPSB7XG5cdFx0b25TdGFydDogdHlwZW9mIG9wdGlvbnMub25TdGFydCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMub25TdGFydCA6IGZhbHNlLFxuXHRcdG9uR3JhZGllbnRDaGFuZ2U6IHR5cGVvZiBvcHRpb25zLm9uR3JhZGllbnRDaGFuZ2UgPT09ICdmdW5jdGlvbicgP1xuXHRcdFx0b3B0aW9ucy5vbkdyYWRpZW50Q2hhbmdlIDpcblx0XHRcdGZhbHNlLFxuXHRcdG9uRW5kOiB0eXBlb2Ygb3B0aW9ucy5vbkVuZCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMub25FbmQgOiBmYWxzZVxuXHR9O1xuXHR0aGlzLmdldERpbWVuc2lvbnMoKTtcblx0dGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMueDEpO1xuXHR0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHRoaXMueTEpO1xuXHR0aGlzLnNldENvbG9ycygpO1xuXG5cdGlmICh0aGlzLmltYWdlKSB7XG5cdFx0dGhpcy52YWxpZGF0ZUlucHV0KCdpbWFnZScpO1xuXHRcdHRoaXMucHJlcGFyZUltYWdlKCk7XG5cdH1cblxuXHR0aGlzLnBhdXNlV2hlbk5vdEluVmlld05hbWVTcGFjZSA9IHRoaXMucGF1c2VXaGVuTm90SW5WaWV3LmJpbmQodGhpcyk7XG5cdHRoaXMuc2V0U2l6ZUF0dHJpYnV0ZXNOYW1lU3BhY2UgPSB0aGlzLnNldFNpemVBdHRyaWJ1dGVzLmJpbmQodGhpcyk7XG5cdHRoaXMub25SZXNpemUoKTtcblxuXHRpZiAodGhpcy5pc1BhdXNlZFdoZW5Ob3RJblZpZXcpIHtcblx0XHR0aGlzLm9uU2Nyb2xsKCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCF0aGlzLmltYWdlKSB7XG5cdFx0XHR0aGlzLnJlZnJlc2hDb2xvcnMoKTtcblx0XHRcdHRoaXMuYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZUNvbG9ycy5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHQvLyBDYWxsYmFjayBhbmQgRXZlbnRcblx0aWYgKHRoaXMuY2FsbGJhY2tzLm9uU3RhcnQpIHRoaXMuY2FsbGJhY2tzLm9uU3RhcnQoKTtcblx0dGhpcy5jYW52YXMuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50cy5zdGFydCk7XG59XG5cbkdyYW5pbS5wcm90b3R5cGUub25SZXNpemUgPSByZXF1aXJlKCcuL29uUmVzaXplLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUub25TY3JvbGwgPSByZXF1aXJlKCcuL29uU2Nyb2xsLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUudmFsaWRhdGVJbnB1dCA9IHJlcXVpcmUoJy4vdmFsaWRhdGVJbnB1dC5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLnRyaWdnZXJFcnJvciA9IHJlcXVpcmUoJy4vdHJpZ2dlckVycm9yLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUucHJlcGFyZUltYWdlID0gcmVxdWlyZSgnLi9wcmVwYXJlSW1hZ2UuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5ldmVudFBvbHlmaWxsID0gcmVxdWlyZSgnLi9ldmVudFBvbHlmaWxsLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUuY29sb3JEaWZmID0gcmVxdWlyZSgnLi9jb2xvckRpZmYuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5oZXhUb1JnYiA9IHJlcXVpcmUoJy4vaGV4VG9SZ2IuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5zZXREaXJlY3Rpb24gPSByZXF1aXJlKCcuL3NldERpcmVjdGlvbi5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLnNldENvbG9ycyA9IHJlcXVpcmUoJy4vc2V0Q29sb3JzLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUuZ2V0RWxlbWVudCA9IHJlcXVpcmUoJy4vZ2V0RWxlbWVudC5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLmdldERpbWVuc2lvbnMgPSByZXF1aXJlKCcuL2dldERpbWVuc2lvbnMuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5nZXRMaWdodG5lc3MgPSByZXF1aXJlKCcuL2dldExpZ2h0bmVzcy5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLmdldEN1cnJlbnRDb2xvcnMgPSByZXF1aXJlKCcuL2dldEN1cnJlbnRDb2xvcnMuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5hbmltYXRlQ29sb3JzID0gcmVxdWlyZSgnLi9hbmltYXRlQ29sb3JzLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUucmVmcmVzaENvbG9ycyA9IHJlcXVpcmUoJy4vcmVmcmVzaENvbG9ycy5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLm1ha2VHcmFkaWVudCA9IHJlcXVpcmUoJy4vbWFrZUdyYWRpZW50LmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUucGF1c2UgPSByZXF1aXJlKCcuL3BhdXNlLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUucGxheSA9IHJlcXVpcmUoJy4vcGxheS5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLmNsZWFyID0gcmVxdWlyZSgnLi9jbGVhci5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLmRlc3Ryb3kgPSByZXF1aXJlKCcuL2Rlc3Ryb3kuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5wYXVzZVdoZW5Ob3RJblZpZXcgPSByZXF1aXJlKCcuL3BhdXNlV2hlbk5vdEluVmlldy5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLnNldFNpemVBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9zZXRTaXplQXR0cmlidXRlcy5qcycpO1xuXG5HcmFuaW0ucHJvdG90eXBlLmNoYW5nZURpcmVjdGlvbiA9IHJlcXVpcmUoJy4vY2hhbmdlRGlyZWN0aW9uLmpzJyk7XG5cbkdyYW5pbS5wcm90b3R5cGUuY2hhbmdlQmxlbmRpbmdNb2RlID0gcmVxdWlyZSgnLi9jaGFuZ2VCbGVuZGluZ01vZGUuanMnKTtcblxuR3JhbmltLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZSA9IHJlcXVpcmUoJy4vY2hhbmdlU3RhdGUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmFuaW07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGltZXN0YW1wKSB7XG5cdHZhciB3YXNXaW5kb3dJZGxlZCA9IHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lU3RhbXAgPiAxMDA7XG5cdHZhciBpc0xvb3AgPSB0aGlzLnN0YXRlc1t0aGlzLmFjdGl2ZVN0YXRlXS5sb29wICE9PSB1bmRlZmluZWQgPyB0aGlzLnN0YXRlc1t0aGlzLmFjdGl2ZVN0YXRlXS5sb29wIDogdHJ1ZTtcblx0dmFyIHByb2dyZXNzUGVyY2VudCwgaXNMb29waW5nLCBuZXh0R3JhZGllbnQ7XG5cblx0Ly8gSWYgdGFiIHdhcyBpbmFjdGl2ZSB0aGVuIHJlc3VtZWQsIHJlc2V0IHRoZSBwcmV2aW91cyB0aW1lc3RhbXBcblx0aWYgKHRoaXMucHJldmlvdXNUaW1lU3RhbXAgPT09IG51bGwgfHwgd2FzV2luZG93SWRsZWQpIHtcblx0XHR0aGlzLnByZXZpb3VzVGltZVN0YW1wID0gdGltZXN0YW1wO1xuXHR9XG5cblx0Ly8gQ29tcHV0ZSBwcm9ncmVzcyBhbmQgc2F2ZSB0aGUgdGltZXN0YW1wXG5cdHRoaXMucHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzICsgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lU3RhbXApO1xuXHRwcm9ncmVzc1BlcmNlbnQgPSAodGhpcy5wcm9ncmVzcyAvIHRoaXMuYWN0aXZldHJhbnNpdGlvblNwZWVkICogMTAwKS50b0ZpeGVkKDIpO1xuXHR0aGlzLnByZXZpb3VzVGltZVN0YW1wID0gdGltZXN0YW1wO1xuXG5cdC8vIFNldCB0aGUgbmV3IGdyYWRpZW50IGNvbG9ycyBpbiBhIHByb3BlcnR5XG5cdHRoaXMucmVmcmVzaENvbG9ycyhwcm9ncmVzc1BlcmNlbnQpO1xuXG5cdC8vIENvbnRpbnVlIHRoZSBhbmltYXRpb24gb3IgcHJlcGFyZSBmb3IgdGhlIG5leHQgb25lXG5cdGlmIChwcm9ncmVzc1BlcmNlbnQgPCAxMDApIHtcblx0XHR0aGlzLmFuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGVDb2xvcnMuYmluZCh0aGlzKSk7XG5cblx0fSBlbHNlIHtcblx0XHQvLyBpZiB0aGUgY3VycmVudCBhbmltYXRpb24gaW5kZXggaXMgaW5mZXJpb3IgdG8gdGhlIHBlbnVsdGltYXRlIGdyYWRpZW50XG5cdFx0Ly8gb3IgdG8gdGhlIGxhc3QgZ3JhZGllbnQgd2l0aCB0aGUgbG9vcCBtb2RlIGFjdGl2YXRlZFxuXHRcdGlmICh0aGlzLmNoYW5uZWxzSW5kZXggPCB0aGlzLnN0YXRlc1t0aGlzLmFjdGl2ZVN0YXRlXS5ncmFkaWVudHMubGVuZ3RoIC0gMiB8fCBpc0xvb3ApIHtcblxuXHRcdFx0Ly8gU2V0IHRoZSBhY3RpdmUgdHJhbnNpdGlvbiBzcGVlZCB0byB0aGUgYWN0aXZlIHN0YXRlIG9uZSBhZnRlciBjaGFuZ2luZyBzdGF0ZVxuXHRcdFx0aWYgKHRoaXMuaXNDaGFuZ2luZ1N0YXRlKSB7XG5cdFx0XHRcdHRoaXMuYWN0aXZldHJhbnNpdGlvblNwZWVkID0gdGhpcy5zdGF0ZXNbdGhpcy5hY3RpdmVTdGF0ZV0udHJhbnNpdGlvblNwZWVkIHx8IDUwMDA7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlc2V0dGluZyBwcm9wZXJ0aWVzXG5cdFx0XHR0aGlzLnByZXZpb3VzVGltZVN0YW1wID0gbnVsbDtcblx0XHRcdHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHRcdFx0dGhpcy5jaGFubmVsc0luZGV4Kys7XG5cdFx0XHRpc0xvb3BpbmcgPSBmYWxzZTtcblxuXHRcdFx0Ly8gSWYgaXQncyBnb2luZyB0byBsb29wIG9yIGlmIGl0J3MgdGhlIHRyYW5zaXRpb24gYWZ0ZXIgdGhlIGxvb3Bcblx0XHRcdGlmICh0aGlzLmNoYW5uZWxzSW5kZXggPT09IHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50cy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGlzTG9vcGluZyA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmNoYW5uZWxzSW5kZXggPT09IHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5jaGFubmVsc0luZGV4ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2tpbmcgdGhlIG5leHQgZ3JhZGllbnQgdG8gc2VuZCBpbiBhcmdzIG9mIGFuIGV2ZW50IGFuZCBhIGNhbGxiYWNrXG5cdFx0XHRuZXh0R3JhZGllbnQgPSB0aGlzLnN0YXRlc1t0aGlzLmFjdGl2ZVN0YXRlXS5ncmFkaWVudHNbdGhpcy5jaGFubmVsc0luZGV4ICsgMV0gPT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50c1swXSA6XG5cdFx0XHRcdHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50c1t0aGlzLmNoYW5uZWxzSW5kZXggKyAxXTtcblxuXHRcdFx0Ly8gQ29tcHV0ZSB0aGUgY29sb3JzIGZvciB0aGUgdHJhbnNpdGlvbiBhbmQgcmVuZGVyIGEgbmV3IGZyYW1lXG5cdFx0XHR0aGlzLnNldENvbG9ycygpO1xuXHRcdFx0dGhpcy5hbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlQ29sb3JzLmJpbmQodGhpcykpO1xuXHRcdFx0XG5cdFx0XHQvLyBDYWxsYmFjayBhbmQgRXZlbnRcblx0XHRcdGlmICh0aGlzLmNhbGxiYWNrcy5vbkdyYWRpZW50Q2hhbmdlKSB0aGlzLmNhbGxiYWNrcy5vbkdyYWRpZW50Q2hhbmdlKHtcblx0XHRcdFx0aXNMb29waW5nOiBpc0xvb3BpbmcsXG5cdFx0XHRcdGNvbG9yc0Zyb206IHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50c1t0aGlzLmNoYW5uZWxzSW5kZXhdLFxuXHRcdFx0XHRjb2xvcnNUbzogbmV4dEdyYWRpZW50LFxuXHRcdFx0XHRhY3RpdmVTdGF0ZTogdGhpcy5hY3RpdmVTdGF0ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuY2FudmFzLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudHMuZ3JhZGllbnRDaGFuZ2Uoe1xuXHRcdFx0XHRcdGlzTG9vcGluZzogaXNMb29waW5nLFxuXHRcdFx0XHRcdGNvbG9yc0Zyb206IHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLmdyYWRpZW50c1t0aGlzLmNoYW5uZWxzSW5kZXhdLFxuXHRcdFx0XHRcdGNvbG9yc1RvOiBuZXh0R3JhZGllbnQsXG5cdFx0XHRcdFx0YWN0aXZlU3RhdGU6IHRoaXMuYWN0aXZlU3RhdGVcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHQvLyBFbHNlIGlmIGl0IHdhcyB0aGUgbGFzdCBncmFkaWVudCBvbiB0aGUgbGlzdCBhbmQgdGhlIGxvb3AgbW9kZSBpcyBvZmZcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb24pO1xuXG5cdFx0XHQvLyBDYWxsYmFjayBhbmQgRXZlbnRcblx0XHRcdGlmICh0aGlzLmNhbGxiYWNrcy5vbkVuZCkgdGhpcy5jYWxsYmFja3Mub25FbmQoKTtcblx0XHRcdHRoaXMuY2FudmFzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncmFuaW06ZW5kJykpO1xuXHRcdH1cblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdCbGVuZGluZ01vZGUpIHtcblx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLngxLCB0aGlzLnkxKTtcblx0dGhpcy5jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9XG5cdFx0dGhpcy5pbWFnZS5ibGVuZGluZ01vZGUgPSBuZXdCbGVuZGluZ01vZGU7XG5cdHRoaXMudmFsaWRhdGVJbnB1dCgnYmxlbmRpbmdNb2RlJyk7XG5cdGlmICh0aGlzLmlzUGF1c2VkKSB0aGlzLnJlZnJlc2hDb2xvcnMoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3RGlyZWN0aW9uKSB7XG5cdHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy54MSwgdGhpcy55MSk7XG5cdHRoaXMuZGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uO1xuXHR0aGlzLnZhbGlkYXRlSW5wdXQoJ2RpcmVjdGlvbicpO1xuXHRpZiAodGhpcy5pc1BhdXNlZCkgdGhpcy5yZWZyZXNoQ29sb3JzKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBuZXh0Q29sb3JzLCBjb2xvckRpZmY7XG5cblx0Ly8gUHJldmVudCB0cmFuc2l0aW9uaW5nIHRvIHRoZSBzYW1lIHN0YXRlXG5cdGlmICh0aGlzLmFjdGl2ZVN0YXRlID09PSBzdGF0ZSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFNldHRpbmcgdGhlIGdvb2QgcHJvcGVydGllcyBmb3IgdGhlIHRyYW5zaXRpb25cblx0aWYgKCF0aGlzLmlzUGF1c2VkKSB7XG5cdFx0dGhpcy5pc1BhdXNlZCA9IHRydWU7XG5cdFx0dGhpcy5wYXVzZSgpO1xuXHR9XG5cblx0dGhpcy5jaGFubmVsc0luZGV4ID0gLTE7XG5cdHRoaXMuYWN0aXZldHJhbnNpdGlvblNwZWVkID0gdGhpcy5zdGF0ZVRyYW5zaXRpb25TcGVlZDtcblx0dGhpcy5hY3RpdmVDb2xvckRpZmYgPSBbXTtcblx0dGhpcy5hY3RpdmVDb2xvcnMgPSB0aGlzLmdldEN1cnJlbnRDb2xvcnMoKTtcblx0dGhpcy5wcm9ncmVzcyA9IDA7XG5cdHRoaXMucHJldmlvdXNUaW1lU3RhbXAgPSBudWxsO1xuXHR0aGlzLmlzQ2hhbmdpbmdTdGF0ZSA9IHRydWU7XG5cblx0Ly8gQ29tcHV0ZSB0aGUgZ3JhZGllbnQgZGlmZiBiZXR3ZWVuIHRoZSBsYXN0IGZyYW1lIGdyYWRpZW50XG5cdC8vIGFuZCB0aGUgZmlyc3Qgb25lIG9mIHRoZSBuZXcgc3RhdGVcblx0dGhpcy5zdGF0ZXNbc3RhdGVdLmdyYWRpZW50c1swXS5mb3JFYWNoKGZ1bmN0aW9uKGNvbG9yLCBpLCBhcnIpIHtcblx0XHRuZXh0Q29sb3JzID0gX3RoaXMuaGV4VG9SZ2IoX3RoaXMuc3RhdGVzW3N0YXRlXS5ncmFkaWVudHNbMF1baV0pO1xuXHRcdGNvbG9yRGlmZiA9IF90aGlzLmNvbG9yRGlmZihfdGhpcy5hY3RpdmVDb2xvcnNbaV0sIG5leHRDb2xvcnMpO1xuXHRcdF90aGlzLmFjdGl2ZUNvbG9yRGlmZi5wdXNoKGNvbG9yRGlmZik7XG5cdH0pO1xuXG5cdC8vIFN0YXJ0IHRoZSBhbmltYXRpb25cblx0dGhpcy5hY3RpdmVTdGF0ZSA9IHN0YXRlO1xuXHR0aGlzLnBsYXkoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5pc1BhdXNlZCkge1xuXHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uKTtcblxuXHR9IGVsc2Uge1xuXHRcdHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcblx0fVxuXHR0aGlzLmlzQ2xlYXJlZCA9IHRydWU7XG5cdHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy54MSwgdGhpcy55MSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbG9yQSwgY29sb3JCKSB7XG5cdHZhciBpO1xuXHR2YXIgY29sb3JEaWZmID0gW107XG5cblx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdGNvbG9yRGlmZi5wdXNoKGNvbG9yQltpXSAtIGNvbG9yQVtpXSlcblx0fVxuXG5cdHJldHVybiBjb2xvckRpZmY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLm9uUmVzaXplKCdyZW1vdmVMaXN0ZW5lcnMnKTtcblx0dGhpcy5vblNjcm9sbCgncmVtb3ZlTGlzdGVuZXJzJyk7XG5cdHRoaXMuY2xlYXIoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuO1xuXG5cdGZ1bmN0aW9uIEN1c3RvbUV2ZW50IChldmVudCwgcGFyYW1zKSB7XG5cdFx0cGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuXHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuXHRcdHJldHVybiBldnQ7XG5cdH1cblxuXHRDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuXG5cdHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGksIGo7XG5cdHZhciBjdXJyZW50Q29sb3JzID0gW107XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMuY3VycmVudENvbG9ycy5sZW5ndGg7IGkrKykge1xuXHRcdGN1cnJlbnRDb2xvcnMucHVzaChbXSk7XG5cdFx0Zm9yIChqID0gMDsgaiA8IDM7IGorKykge2N1cnJlbnRDb2xvcnNbaV0ucHVzaCh0aGlzLmN1cnJlbnRDb2xvcnNbaV1bal0pfVxuXHR9XG5cblx0Ly8gUmV0dXJuIGEgZGVlcCBjb3B5IG9mIHRoZSBjdXJyZW50IGNvbG9yc1xuXHRyZXR1cm4gY3VycmVudENvbG9ycztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMueDEgPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcblx0dGhpcy55MSA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHRpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG5cdFx0dGhpcy5jYW52YXMgPSBlbGVtZW50O1xuXG5cdH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XG5cblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RoZSBlbGVtZW50IHlvdSB1c2VkIGlzIG5laXRoZXIgYSBTdHJpbmcsIG5vciBhIEhUTUxDYW52YXNFbGVtZW50Jyk7XG5cdH1cblxuXHRpZiAoIXRoaXMuY2FudmFzKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgJyArIGVsZW1lbnQgKyAnYCBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIERPTScpO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY3VycmVudENvbG9ycyA9IHRoaXMuZ2V0Q3VycmVudENvbG9ycygpO1xuXHR2YXIgZ3JhZGllbnRBdmVyYWdlID0gbnVsbDtcblx0dmFyIGxpZ2h0bmVzc0F2ZXJhZ2UsIGk7XG5cdHZhciBjb2xvcnNBdmVyYWdlID0gY3VycmVudENvbG9ycy5tYXAoZnVuY3Rpb24oZWwpIHtcblx0XHQvLyBDb21wdXRlIHRoZSBhdmVyYWdlIGxpZ2h0bmVzcyBvZiBlYWNoIGNvbG9yXG5cdFx0Ly8gaW4gdGhlIGN1cnJlbnQgZ3JhZGllbnRcblx0XHRyZXR1cm4gTWF0aC5tYXgoZWxbMF0sIGVsWzFdLCBlbFsyXSk7XG5cdH0pO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBjb2xvcnNBdmVyYWdlLmxlbmd0aDsgaSsrKSB7XG5cdFx0Ly8gQWRkIGFsbCB0aGUgYXZlcmFnZSBsaWdodG5lc3Mgb2YgZWFjaCBjb2xvclxuXHRcdGdyYWRpZW50QXZlcmFnZSA9IGdyYWRpZW50QXZlcmFnZSA9PT0gbnVsbCA/XG5cdFx0XHRjb2xvcnNBdmVyYWdlW2ldIDogZ3JhZGllbnRBdmVyYWdlICsgY29sb3JzQXZlcmFnZVtpXTtcblxuXHRcdGlmIChpID09PSBjb2xvcnNBdmVyYWdlLmxlbmd0aCAtIDEpIHtcblx0XHRcdC8vIGlmIGl0J3MgdGhlIGxhc3QgbGlnaHRuZXNzIGF2ZXJhZ2Vcblx0XHRcdC8vIGRpdmlkZSBpdCBieSB0aGUgdG90YWwgbGVuZ3RoIHRvXG5cdFx0XHQvLyBoYXZlIHRoZSBnbG9iYWwgYXZlcmFnZSBsaWdodG5lc3Ncblx0XHRcdGxpZ2h0bmVzc0F2ZXJhZ2UgPSBNYXRoLnJvdW5kKGdyYWRpZW50QXZlcmFnZSAvIChpICsgMSkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBsaWdodG5lc3NBdmVyYWdlID49IDEyOCA/ICdsaWdodCcgOiAnZGFyayc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhleCkge1xuXHQvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXG5cdHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG5cdGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XG5cdFx0cmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcblx0fSk7XG5cblx0dmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuXHRyZXR1cm4gcmVzdWx0ID8gW1xuXHRcdHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuXHRcdHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuXHRcdHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG5cdF0gOiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGksIGNvbG9yUG9zaXRpb247XG5cdHZhciBncmFkaWVudCA9IHRoaXMuc2V0RGlyZWN0aW9uKCk7XG5cdHZhciBlbFRvU2V0Q2xhc3NPbkNsYXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsVG9TZXRDbGFzc09uKS5jbGFzc0xpc3Q7XG5cblx0aWYgKHRoaXMuc2hvdWxkQ2xlYXJDYW52YXNPbkVhY2hGcmFtZSkgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLngxLCB0aGlzLnkxKTtcblxuXHRpZiAodGhpcy5pbWFnZSkge1xuXHRcdHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHR0aGlzLmltYWdlTm9kZSxcblx0XHRcdHRoaXMuaW1hZ2VQb3NpdGlvbi54LFxuXHRcdFx0dGhpcy5pbWFnZVBvc2l0aW9uLnksXG5cdFx0XHR0aGlzLmltYWdlUG9zaXRpb24ud2lkdGgsXG5cdFx0XHR0aGlzLmltYWdlUG9zaXRpb24uaGVpZ2h0XG5cdFx0KTtcblx0fVxuXG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRDb2xvcnMubGVuZ3RoOyBpKyspIHtcblx0XHQvLyBFbnN1cmUgZmlyc3QgYW5kIGxhc3QgcG9zaXRpb24gdG8gYmUgMCBhbmQgMTAwXG5cdFx0Y29sb3JQb3NpdGlvbiA9ICFpID8gMCA6ICgoMSAvICh0aGlzLmN1cnJlbnRDb2xvcnMubGVuZ3RoIC0gMSkpICogaSkudG9GaXhlZCgyKTtcblxuXHRcdGdyYWRpZW50LmFkZENvbG9yU3RvcChjb2xvclBvc2l0aW9uLCAncmdiYSgnICtcblx0XHRcdHRoaXMuY3VycmVudENvbG9yc1tpXVswXSArICcsICcgK1xuXHRcdFx0dGhpcy5jdXJyZW50Q29sb3JzW2ldWzFdICsgJywgJyArXG5cdFx0XHR0aGlzLmN1cnJlbnRDb2xvcnNbaV1bMl0gKyAnLCAnICtcblx0XHRcdHRoaXMub3BhY2l0eVtpXSArICcpJ1xuXHRcdCk7XG5cdH1cblxuXHRpZiAodGhpcy5uYW1lKSB7XG5cdFx0aWYgKHRoaXMuZ2V0TGlnaHRuZXNzKCkgPT09ICdsaWdodCcpIHtcblx0XHRcdGVsVG9TZXRDbGFzc09uQ2xhc3MucmVtb3ZlKHRoaXMubmFtZSArICctZGFyaycpO1xuXHRcdFx0ZWxUb1NldENsYXNzT25DbGFzcy5hZGQodGhpcy5uYW1lICsgJy1saWdodCcpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsVG9TZXRDbGFzc09uQ2xhc3MucmVtb3ZlKHRoaXMubmFtZSArICctbGlnaHQnKTtcblx0XHRcdGVsVG9TZXRDbGFzc09uQ2xhc3MuYWRkKHRoaXMubmFtZSArICctZGFyaycpO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcblx0dGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMueDEsIHRoaXMueTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0eXBlKSB7XG5cdGlmICh0eXBlID09PSAncmVtb3ZlTGlzdGVuZXJzJykge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnNldFNpemVBdHRyaWJ1dGVzTmFtZVNwYWNlKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5zZXRTaXplQXR0cmlidXRlc05hbWVTcGFjZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0aWYgKHR5cGUgPT09ICdyZW1vdmVMaXN0ZW5lcnMnKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMucGF1c2VXaGVuTm90SW5WaWV3TmFtZVNwYWNlKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5wYXVzZVdoZW5Ob3RJblZpZXdOYW1lU3BhY2UpO1xuXHR0aGlzLnBhdXNlV2hlbk5vdEluVmlld05hbWVTcGFjZSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdGF0ZSkge1xuXHR2YXIgaXNQYXVzZWRCZWNhdXNlTm90SW5WaWV3ID0gc3RhdGUgPT09ICdpc1BhdXNlZEJlY2F1c2VOb3RJblZpZXcnO1xuXHRpZiAodGhpcy5pc0NsZWFyZWQpIHJldHVybjtcblx0aWYgKCFpc1BhdXNlZEJlY2F1c2VOb3RJblZpZXcpIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXHRjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbik7XG5cdHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRpZiAodGhpcy5zY3JvbGxEZWJvdW5jZVRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbERlYm91bmNlVGltZW91dCk7XG5cblx0dGhpcy5zY3JvbGxEZWJvdW5jZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlbFBvcyA9IF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRfdGhpcy5pc0NhbnZhc0luV2luZG93VmlldyA9ICEoZWxQb3MuYm90dG9tIDwgMCB8fCBlbFBvcy5yaWdodCA8IDAgfHxcblx0XHRcdGVsUG9zLmxlZnQgPiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBlbFBvcy50b3AgPiB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG5cdFx0aWYgKF90aGlzLmlzQ2FudmFzSW5XaW5kb3dWaWV3KSB7XG5cdFx0XHRpZiAoIV90aGlzLmlzUGF1c2VkIHx8IF90aGlzLmZpcnN0U2Nyb2xsSW5pdCkge1xuXHRcdFx0XHRpZiAoX3RoaXMuaW1hZ2UgJiYgIV90aGlzLmlzSW1nTG9hZGVkKSB7cmV0dXJufVxuXHRcdFx0XHRfdGhpcy5pc1BhdXNlZEJlY2F1c2VOb3RJblZpZXcgPSBmYWxzZTtcblx0XHRcdFx0X3RoaXMucGxheSgnaXNQbGF5ZWRCZWNhdXNlSW5WaWV3Jyk7XG5cdFx0XHRcdF90aGlzLmZpcnN0U2Nyb2xsSW5pdCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghX3RoaXMuaW1hZ2UgJiYgX3RoaXMuZmlyc3RTY3JvbGxJbml0KSB7XG5cdFx0XHRcdF90aGlzLnJlZnJlc2hDb2xvcnMoKTtcblx0XHRcdFx0X3RoaXMuZmlyc3RTY3JvbGxJbml0ID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghX3RoaXMuaXNQYXVzZWQgJiYgIV90aGlzLmlzUGF1c2VkQmVjYXVzZU5vdEluVmlldykge1xuXHRcdFx0XHRfdGhpcy5pc1BhdXNlZEJlY2F1c2VOb3RJblZpZXcgPSB0cnVlO1xuXHRcdFx0XHRfdGhpcy5wYXVzZSgnaXNQYXVzZWRCZWNhdXNlTm90SW5WaWV3Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB0aGlzLnNjcm9sbERlYm91bmNlVGhyZXNob2xkKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RhdGUpIHtcblx0dmFyIGlzUGxheWVkQmVjYXVzZUluVmlldyA9IHN0YXRlID09PSAnaXNQbGF5ZWRCZWNhdXNlSW5WaWV3Jztcblx0aWYgKCFpc1BsYXllZEJlY2F1c2VJblZpZXcpIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcblx0dGhpcy5pc0NsZWFyZWQgPSBmYWxzZTtcblx0aWYgKCF0aGlzLmFuaW1hdGluZykge1xuXHRcdHRoaXMuYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZUNvbG9ycy5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmFuaW1hdGluZyA9IHRydWU7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0aWYgKCF0aGlzLmltYWdlUG9zaXRpb24pIHtcblx0XHR0aGlzLmltYWdlUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblx0fVxuXG5cdGlmICh0aGlzLmltYWdlLmJsZW5kaW5nTW9kZSkge1xuXHRcdHRoaXMuY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSB0aGlzLmltYWdlLmJsZW5kaW5nTW9kZTtcblx0fVxuXG5cdGlmICh0aGlzLmltYWdlTm9kZSkge1xuXHRcdHNldEltYWdlUG9zaXRpb24oKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLmltYWdlTm9kZSA9IG5ldyBJbWFnZSgpO1xuXHR0aGlzLmltYWdlTm9kZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdHcmFuaW06IFRoZSBpbWFnZSBzb3VyY2UgaXMgaW52YWxpZC4nKTtcblx0fTtcblx0dGhpcy5pbWFnZU5vZGUub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0X3RoaXMuaW1nT3JpZ2luYWxXaWR0aCA9IF90aGlzLmltYWdlTm9kZS53aWR0aDtcblx0XHRfdGhpcy5pbWdPcmlnaW5hbEhlaWdodCA9IF90aGlzLmltYWdlTm9kZS5oZWlnaHQ7XG5cdFx0c2V0SW1hZ2VQb3NpdGlvbigpO1xuXHRcdF90aGlzLnJlZnJlc2hDb2xvcnMoKTtcblx0XHRpZiAoIV90aGlzLmlzUGF1c2VkV2hlbk5vdEluVmlldyB8fCBfdGhpcy5pc0NhbnZhc0luV2luZG93Vmlldykge1xuXHRcdFx0X3RoaXMuYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKF90aGlzLmFuaW1hdGVDb2xvcnMuYmluZChfdGhpcykpO1xuXHRcdH1cblx0XHRfdGhpcy5pc0ltZ0xvYWRlZCA9IHRydWU7XG5cdH07XG5cdHRoaXMuaW1hZ2VOb2RlLnNyYyA9IHRoaXMuaW1hZ2Uuc291cmNlO1xuXG5cdGZ1bmN0aW9uIHNldEltYWdlUG9zaXRpb24oKSB7XG5cdFx0dmFyIGksIGN1cnJlbnRBeGlzO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IDI7IGkrKykge1xuXHRcdFx0Y3VycmVudEF4aXMgPSAhaSA/ICd4JyA6ICd5Jztcblx0XHRcdHNldEltYWdlQXhpc1Bvc2l0aW9uKGN1cnJlbnRBeGlzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRJbWFnZUF4aXNQb3NpdGlvbihheGlzKSB7XG5cdFx0XHR2YXIgY2FudmFzV2lkdGhPckhlaWdodCA9IF90aGlzW2F4aXMgKyAnMSddO1xuXHRcdFx0dmFyIGltZ09yaWdpbmFsV2lkdGhPckhlaWdodCA9IF90aGlzW2F4aXMgPT09ICd4JyA/ICdpbWdPcmlnaW5hbFdpZHRoJyA6ICdpbWdPcmlnaW5hbEhlaWdodCddO1xuXHRcdFx0dmFyIGltYWdlQWxpZ25JbmRleCA9IGF4aXMgPT09ICd4JyA/IF90aGlzLmltYWdlLnBvc2l0aW9uWzBdIDogX3RoaXMuaW1hZ2UucG9zaXRpb25bMV07XG5cdFx0XHR2YXIgaW1hZ2VBeGlzUG9zaXRpb247XG5cdFx0XHRzd2l0Y2ggKGltYWdlQWxpZ25JbmRleCkge1xuXHRcdFx0XHRjYXNlICdjZW50ZXInOlxuXHRcdFx0XHRcdGltYWdlQXhpc1Bvc2l0aW9uID0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0ID4gY2FudmFzV2lkdGhPckhlaWdodCA/XG5cdFx0XHRcdFx0LShpbWdPcmlnaW5hbFdpZHRoT3JIZWlnaHQgLSBjYW52YXNXaWR0aE9ySGVpZ2h0KSAvIDIgOlxuXHRcdFx0XHRcdChjYW52YXNXaWR0aE9ySGVpZ2h0IC0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0KSAvIDI7XG5cdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvbltheGlzXSA9IGltYWdlQXhpc1Bvc2l0aW9uO1xuXHRcdFx0XHRcdF90aGlzLmltYWdlUG9zaXRpb25bYXhpcyA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSA9IGltZ09yaWdpbmFsV2lkdGhPckhlaWdodDtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICd0b3AnOlxuXHRcdFx0XHRcdF90aGlzLmltYWdlUG9zaXRpb25bJ3knXSA9IDA7XG5cdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvblsnaGVpZ2h0J10gPSBpbWdPcmlnaW5hbFdpZHRoT3JIZWlnaHQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnYm90dG9tJzpcblx0XHRcdFx0XHRfdGhpcy5pbWFnZVBvc2l0aW9uWyd5J10gPSBjYW52YXNXaWR0aE9ySGVpZ2h0IC0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdF90aGlzLmltYWdlUG9zaXRpb25bJ2hlaWdodCddID0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ3JpZ2h0Jzpcblx0XHRcdFx0XHRfdGhpcy5pbWFnZVBvc2l0aW9uWyd4J10gPSBjYW52YXNXaWR0aE9ySGVpZ2h0IC0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdF90aGlzLmltYWdlUG9zaXRpb25bJ3dpZHRoJ10gPSBpbWdPcmlnaW5hbFdpZHRoT3JIZWlnaHQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnbGVmdCc6XG5cdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvblsneCddID0gMDtcblx0XHRcdFx0XHRfdGhpcy5pbWFnZVBvc2l0aW9uWyd3aWR0aCddID0gaW1nT3JpZ2luYWxXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoX3RoaXMuaW1hZ2Uuc3RyZXRjaE1vZGUpIHtcblx0XHRcdFx0aW1hZ2VBbGlnbkluZGV4ID0gYXhpcyA9PT0gJ3gnID8gX3RoaXMuaW1hZ2Uuc3RyZXRjaE1vZGVbMF0gOiBfdGhpcy5pbWFnZS5zdHJldGNoTW9kZVsxXTtcblx0XHRcdFx0c3dpdGNoIChpbWFnZUFsaWduSW5kZXgpIHtcblx0XHRcdFx0XHRjYXNlICdzdHJldGNoJzpcblx0XHRcdFx0XHRcdF90aGlzLmltYWdlUG9zaXRpb25bYXhpc10gPSAwO1xuXHRcdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvbltheGlzID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCddID0gY2FudmFzV2lkdGhPckhlaWdodDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnc3RyZXRjaC1pZi1iaWdnZXInOlxuXHRcdFx0XHRcdFx0aWYgKGltZ09yaWdpbmFsV2lkdGhPckhlaWdodCA8IGNhbnZhc1dpZHRoT3JIZWlnaHQpIGJyZWFrO1xuXHRcdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvbltheGlzXSA9IDA7XG5cdFx0XHRcdFx0XHRfdGhpcy5pbWFnZVBvc2l0aW9uW2F4aXMgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0J10gPSBjYW52YXNXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdzdHJldGNoLWlmLXNtYWxsZXInOlxuXHRcdFx0XHRcdFx0aWYgKGltZ09yaWdpbmFsV2lkdGhPckhlaWdodCA+IGNhbnZhc1dpZHRoT3JIZWlnaHQpIGJyZWFrO1xuXHRcdFx0XHRcdFx0X3RoaXMuaW1hZ2VQb3NpdGlvbltheGlzXSA9IDA7XG5cdFx0XHRcdFx0XHRfdGhpcy5pbWFnZVBvc2l0aW9uW2F4aXMgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0J10gPSBjYW52YXNXaWR0aE9ySGVpZ2h0O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJvZ3Jlc3NQZXJjZW50KSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBhY3RpdmVDaGFubmVsLCBpLCBqO1xuXG5cdC8vIExvb3AgdGhyb3VnaCBlYWNoIGNvbG9ycyBvZiB0aGUgYWN0aXZlIGdyYWRpZW50XG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLmFjdGl2ZUNvbG9ycy5sZW5ndGg7IGkrKykge1xuXG5cdFx0Ly8gR2VuZXJhdGUgUkdCIGNvbG9yc1xuXHRcdGZvciAoaiA9IDA7IGogPCAzOyBqKyspIHtcblx0XHRcdGFjdGl2ZUNoYW5uZWwgPSBfdGhpcy5hY3RpdmVDb2xvcnNbaV1bal0gK1xuXHRcdFx0XHRNYXRoLmNlaWwoX3RoaXMuYWN0aXZlQ29sb3JEaWZmW2ldW2pdIC8gMTAwICogcHJvZ3Jlc3NQZXJjZW50KTtcblxuXHRcdFx0Ly8gUHJldmVudCBjb2xvcnMgdmFsdWVzIGZyb20gZ29pbmcgPCAwICYgPiAyNTVcblx0XHRcdGlmIChhY3RpdmVDaGFubmVsIDw9IDI1NSAmJiBhY3RpdmVDaGFubmVsID49IDApIHtcblx0XHRcdFx0X3RoaXMuY3VycmVudENvbG9yc1tpXVtqXSA9IGFjdGl2ZUNoYW5uZWw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5tYWtlR3JhZGllbnQoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdHZhciBjb2xvckRpZmYsIG5leHRDb2xvcnM7XG5cblx0aWYgKCF0aGlzLmNoYW5uZWxzW3RoaXMuYWN0aXZlU3RhdGVdKSB0aGlzLmNoYW5uZWxzW3RoaXMuYWN0aXZlU3RhdGVdID0gW107XG5cblx0Ly8gSWYgdGhlIGFjdHVhbCBjaGFubmVsIGV4aXN0LCByZWFzc2lnbiBwcm9wZXJ0aWVzIGFuZCBleGl0XG5cdC8vIChlYWNoIGNoYW5uZWwgaXMgc2F2ZWQgdG8gcHJldmVudCByZWNvbXB1dGluZyBpdCBlYWNoIHRpbWUpXG5cdGlmICh0aGlzLmNoYW5uZWxzW3RoaXMuYWN0aXZlU3RhdGVdW3RoaXMuY2hhbm5lbHNJbmRleF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdHRoaXMuYWN0aXZlQ29sb3JzID0gdGhpcy5jaGFubmVsc1t0aGlzLmFjdGl2ZVN0YXRlXVt0aGlzLmNoYW5uZWxzSW5kZXhdLmNvbG9ycztcblx0XHR0aGlzLmFjdGl2ZUNvbG9yRGlmZiA9IHRoaXMuY2hhbm5lbHNbdGhpcy5hY3RpdmVTdGF0ZV1bdGhpcy5jaGFubmVsc0luZGV4XS5jb2xvcnNEaWZmO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFNldCBibGFuayBwcm9wZXJ0aWVzXG5cdHRoaXMuY2hhbm5lbHNbdGhpcy5hY3RpdmVTdGF0ZV0ucHVzaChbe31dKTtcblx0dGhpcy5jaGFubmVsc1t0aGlzLmFjdGl2ZVN0YXRlXVt0aGlzLmNoYW5uZWxzSW5kZXhdLmNvbG9ycyA9IFtdO1xuXHR0aGlzLmNoYW5uZWxzW3RoaXMuYWN0aXZlU3RhdGVdW3RoaXMuY2hhbm5lbHNJbmRleF0uY29sb3JzRGlmZiA9IFtdO1xuXHR0aGlzLmFjdGl2ZUNvbG9ycyA9IFtdO1xuXHR0aGlzLmFjdGl2ZUNvbG9yRGlmZiA9IFtdO1xuXG5cdC8vIEdvIG9uIGVhY2ggZ3JhZGllbnQgb2YgdGhlIGN1cnJlbnQgc3RhdGVcblx0dGhpcy5zdGF0ZXNbdGhpcy5hY3RpdmVTdGF0ZV0uZ3JhZGllbnRzW3RoaXMuY2hhbm5lbHNJbmRleF0uZm9yRWFjaChmdW5jdGlvbihjb2xvciwgaSkge1xuXHRcdC8vIFB1c2ggdGhlIGhleCBjb2xvciBjb252ZXJ0ZWQgdG8gcmdiIG9uIHRoZSBjaGFubmVsIGFuZCB0aGUgYWN0aXZlIGNvbG9yIHByb3BlcnRpZXNcblx0XHR2YXIgcmdiQ29sb3IgPSBfdGhpcy5oZXhUb1JnYihjb2xvcik7XG5cdFx0dmFyIGFjdGl2ZUNoYW5uZWwgPSBfdGhpcy5jaGFubmVsc1tfdGhpcy5hY3RpdmVTdGF0ZV07XG5cblx0XHRhY3RpdmVDaGFubmVsW190aGlzLmNoYW5uZWxzSW5kZXhdLmNvbG9ycy5wdXNoKHJnYkNvbG9yKTtcblx0XHRfdGhpcy5hY3RpdmVDb2xvcnMucHVzaChyZ2JDb2xvcik7XG5cblx0XHQvLyBJZiBpdCdzIHRoZSBmaXJzdCBjaGFubmVsIHRvIGJlIHNldCwgc2V0IHRoZSBjdXJyZW50Q29sb3JzXG5cdFx0aWYgKCFfdGhpcy5pc2N1cnJlbnRDb2xvcnNTZXQpIHtcblx0XHRcdF90aGlzLmN1cnJlbnRDb2xvcnMucHVzaChfdGhpcy5oZXhUb1JnYihjb2xvcikpO1xuXHRcdH1cblxuXHRcdC8vIElmIGl0J3MgdGhlIGxhc3QgZ3JhZGllbnQsIGNvbXB1dGUgdGhlIGNvbG9yIGRpZmYgYmV0d2VlbiB0aGUgbGFzdCBncmFkaWVudCBhbmQgdGhlIGZpcnN0IG9uZSxcblx0XHQvLyBlbHNlIGJldHdlZW4gdGhlIHBlbnVsdGltYXRlIG9uZSBhbmQgdGhlIGxhc3Qgb25lXG5cdFx0aWYgKF90aGlzLmNoYW5uZWxzSW5kZXggPT09IF90aGlzLnN0YXRlc1tfdGhpcy5hY3RpdmVTdGF0ZV0uZ3JhZGllbnRzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGNvbG9yRGlmZiA9IF90aGlzLmNvbG9yRGlmZihcblx0XHRcdFx0YWN0aXZlQ2hhbm5lbFtfdGhpcy5jaGFubmVsc0luZGV4XS5jb2xvcnNbaV0sXG5cdFx0XHRcdGFjdGl2ZUNoYW5uZWxbMF0uY29sb3JzW2ldXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXh0Q29sb3JzID0gX3RoaXMuaGV4VG9SZ2IoX3RoaXMuc3RhdGVzW190aGlzLmFjdGl2ZVN0YXRlXS5ncmFkaWVudHNbX3RoaXMuY2hhbm5lbHNJbmRleCArIDFdW2ldKTtcblx0XHRcdGNvbG9yRGlmZiA9IF90aGlzLmNvbG9yRGlmZihcblx0XHRcdFx0YWN0aXZlQ2hhbm5lbFtfdGhpcy5jaGFubmVsc0luZGV4XS5jb2xvcnNbaV0sIG5leHRDb2xvcnNcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0YWN0aXZlQ2hhbm5lbFtfdGhpcy5jaGFubmVsc0luZGV4XS5jb2xvcnNEaWZmLnB1c2goY29sb3JEaWZmKTtcblx0XHRfdGhpcy5hY3RpdmVDb2xvckRpZmYucHVzaChjb2xvckRpZmYpO1xuXHR9KTtcblxuXHR0aGlzLmFjdGl2ZXRyYW5zaXRpb25TcGVlZCA9IHRoaXMuc3RhdGVzW3RoaXMuYWN0aXZlU3RhdGVdLnRyYW5zaXRpb25TcGVlZCB8fCA1MDAwO1xuXHR0aGlzLmlzY3VycmVudENvbG9yc1NldCA9IHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG5cdHN3aXRjaCh0aGlzLmRpcmVjdGlvbikge1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aGlzLnRyaWdnZXJFcnJvcignZGlyZWN0aW9uJyk7XG5cdFx0XHRicmVhaztcblx0XHRcblx0XHRjYXNlICdkaWFnb25hbCc6XG5cdFx0XHRyZXR1cm4gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHRoaXMueDEsIHRoaXMueTEpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdsZWZ0LXJpZ2h0Jzpcblx0XHRcdHJldHVybiBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgdGhpcy54MSwgMCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgJ3RvcC1ib3R0b20nOlxuXHRcdFx0cmV0dXJuIGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCh0aGlzLngxIC8gMiwgMCwgdGhpcy54MSAvIDIsIHRoaXMueTEpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdyYWRpYWwnOlxuXHRcdFx0cmV0dXJuIGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh0aGlzLngxIC8gMiwgdGhpcy55MSAvIDIsIHRoaXMueDEgLyAyLCB0aGlzLngxIC8gMiwgdGhpcy55MSAvIDIsIDApO1xuXHRcdFx0YnJlYWs7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZ2V0RGltZW5zaW9ucygpO1xuXHR0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhpcy54MSk7XG5cdHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy55MSk7XG5cdGlmICh0aGlzLmltYWdlKSB0aGlzLnByZXBhcmVJbWFnZSgpO1xuXHR0aGlzLnJlZnJlc2hDb2xvcnMoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHR2YXIgc2l0ZVVSTCA9ICdodHRwczovL3NhcmNhZGFzcy5naXRodWIuaW8vZ3JhbmltLmpzL2FwaS5odG1sJztcblx0dGhyb3cgbmV3IEVycm9yKCdHcmFuaW06IElucHV0IGVycm9yIG9uIFwiJyArIGVsZW1lbnQgKyAnXCIgb3B0aW9uLlxcbkNoZWNrIHRoZSBBUEkgJyArIHNpdGVVUkwgKyAnLicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnB1dFR5cGUpIHtcblx0dmFyIHhQb3NpdGlvblZhbHVlcyA9IFsnbGVmdCcsICdjZW50ZXInLCAncmlnaHQnXTtcblx0dmFyIHlQb3NpdGlvblZhbHVlcyA9IFsndG9wJywgJ2NlbnRlcicsICdib3R0b20nXTtcblx0dmFyIHN0cmV0Y2hNb2RlVmFsdWVzID0gWydzdHJldGNoJywgJ3N0cmV0Y2gtaWYtc21hbGxlcicsICdzdHJldGNoLWlmLWJpZ2dlciddO1xuXHR2YXIgYmxlbmRpbmdNb2RlVmFsdWVzID0gWydtdWx0aXBseScsICdzY3JlZW4nLCAnbm9ybWFsJywgJ292ZXJsYXknLCAnZGFya2VuJyxcblx0XHQnbGlnaHRlbicsICdsaWdodGVyJywgJ2NvbG9yLWRvZGdlJywgJ2NvbG9yLWJ1cm4nLCAnaGFyZC1saWdodCcsICdzb2Z0LWxpZ2h0Jyxcblx0XHQnZGlmZmVyZW5jZScsICdleGNsdXNpb24nLCAnaHVlJywgJ3NhdHVyYXRpb24nLCAnY29sb3InLCAnbHVtaW5vc2l0eSddO1xuXG5cdHN3aXRjaChpbnB1dFR5cGUpIHtcblx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHQvLyBWYWxpZGF0ZSBpbWFnZS5wb3NpdGlvblxuXHRcdFx0aWYgKCghQXJyYXkuaXNBcnJheSh0aGlzLmltYWdlLnBvc2l0aW9uKSB8fCB0aGlzLmltYWdlLnBvc2l0aW9uLmxlbmd0aCAhPT0gMikgfHxcblx0XHRcdFx0eFBvc2l0aW9uVmFsdWVzLmluZGV4T2YodGhpcy5pbWFnZS5wb3NpdGlvblswXSkgPT09IC0xIHx8XG5cdFx0XHRcdHlQb3NpdGlvblZhbHVlcy5pbmRleE9mKHRoaXMuaW1hZ2UucG9zaXRpb25bMV0pID09PSAtMVxuXHRcdFx0KSB7dGhpcy50cmlnZ2VyRXJyb3IoJ2ltYWdlLnBvc2l0aW9uJyl9XG5cdFx0XHQvLyBWYWxpZGF0ZSBpbWFnZS5zdHJldGNoTW9kZVxuXHRcdFx0aWYgKHRoaXMuaW1hZ2Uuc3RyZXRjaE1vZGUpIHtcblx0XHRcdFx0aWYgKCghQXJyYXkuaXNBcnJheSh0aGlzLmltYWdlLnN0cmV0Y2hNb2RlKSB8fCB0aGlzLmltYWdlLnN0cmV0Y2hNb2RlLmxlbmd0aCAhPT0gMikgfHxcblx0XHRcdFx0XHRzdHJldGNoTW9kZVZhbHVlcy5pbmRleE9mKHRoaXMuaW1hZ2Uuc3RyZXRjaE1vZGVbMF0pID09PSAtMSB8fFxuXHRcdFx0XHRcdHN0cmV0Y2hNb2RlVmFsdWVzLmluZGV4T2YodGhpcy5pbWFnZS5zdHJldGNoTW9kZVsxXSkgPT09IC0xXG5cdFx0XHRcdCkge3RoaXMudHJpZ2dlckVycm9yKCdpbWFnZS5zdHJldGNoTW9kZScpfVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnYmxlbmRpbmdNb2RlJzpcblx0XHRcdGlmIChibGVuZGluZ01vZGVWYWx1ZXMuaW5kZXhPZih0aGlzLmltYWdlLmJsZW5kaW5nTW9kZSkgPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdFx0dGhpcy50cmlnZ2VyRXJyb3IoJ2JsZW5kaW5nTW9kZScpO1xuXHRcdFx0fVxuXHR9XG59O1xuIiwid2luZG93LkdyYW5pbSA9IHJlcXVpcmUoJy4vbGliL0dyYW5pbS5qcycpO1xuIl19
