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
	this.refreshColors();
	window.addEventListener('resize', this.onResize.bind(this));
	if (this.isPausedWhenNotInView) {
		this.pauseWhenNotInView();
	} else {
		this.animation = requestAnimationFrame(this.animateColors.bind(this));
	}

	// Callback and Event
	if (this.callbacks.onStart) this.callbacks.onStart();
	this.canvas.dispatchEvent(this.events.start);
}

Granim.prototype.setColors = require('./setColors.js');

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

Granim.prototype.pause = require('./pause.js');

Granim.prototype.play = require('./play.js');

Granim.prototype.clear = require('./clear.js');

Granim.prototype.getCurrentColors = require('./getCurrentColors.js');

Granim.prototype.pauseWhenNotInView = require('./pauseWhenNotInView.js');

Granim.prototype.onResize = require('./onResize.js');

module.exports = Granim;
