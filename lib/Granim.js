'use strict';

function Granim(options) {
	this.getElement(options.element);
	this.x1 = 0;
	this.y1 = 0;
	this.name = options.name || false;
	this.elToSetClassOn = options.elToSetClassOn || 'body';
	this.direction = options.direction || 'diagonal';
	this.customDirection = options.customDirection || {};
	this.validateInput('direction');
	this.isPausedWhenNotInView = options.isPausedWhenNotInView || false;
	this.states = options.states;
	this.stateTransitionSpeed = options.stateTransitionSpeed || 1000;
	this.previousTimeStamp = null;
	this.progress = 0;
	this.isPaused = false;
	this.isCleared = false;
	this.isPausedBecauseNotInView = false;
	this.context = this.canvas.getContext('2d');
	this.channels = {};
	this.channelsIndex = 0;
	this.activeState = options.defaultStateName || 'default-state';
	this.isChangingState = false;
	this.currentColors = [];
	this.currentColorsPos = [];
	this.activetransitionSpeed = null;
	this.eventPolyfill();
	this.scrollDebounceThreshold = options.scrollDebounceThreshold || 300;
	this.scrollDebounceTimeout = null;
	this.isImgLoaded = false;
	this.isCanvasInWindowView = false;
	this.firstScrollInit = true;
	this.animating = false;
	this.gradientLength = this.states[this.activeState].gradients[0].length;
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
			});
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
			this.refreshColorsAndPos();
			this.animation = requestAnimationFrame(this.animateColors.bind(this));
			this.animating = true;
		}
	}

	// Callback and Event
	if (this.callbacks.onStart) this.callbacks.onStart();
	this.canvas.dispatchEvent(this.events.start);
}

Granim.prototype.animateColors = require('./animateColors.js');
Granim.prototype.changeBlendingMode = require('./changeBlendingMode.js');
Granim.prototype.changeDirection = require('./changeDirection.js');
Granim.prototype.changeState = require('./changeState.js');
Granim.prototype.clear = require('./clear.js');
Granim.prototype.convertColorToRgba = require('./convertColorToRgba.js');
Granim.prototype.destroy = require('./destroy.js');
Granim.prototype.eventPolyfill = require('./eventPolyfill.js');
Granim.prototype.getColor = require('./getColor.js');
Granim.prototype.getColorDiff = require('./getColorDiff.js');
Granim.prototype.getColorPos = require('./getColorPos.js');
Granim.prototype.getColorPosDiff = require('./getColorPosDiff.js');
Granim.prototype.getCurrentColors = require('./getCurrentColors.js');
Granim.prototype.getCurrentColorsPos = require('./getCurrentColorsPos.js');
Granim.prototype.getDimensions = require('./getDimensions.js');
Granim.prototype.getElement = require('./getElement.js');
Granim.prototype.getLightness = require('./getLightness.js');
Granim.prototype.makeGradient = require('./makeGradient.js');
Granim.prototype.onResize = require('./onResize.js');
Granim.prototype.onScroll = require('./onScroll.js');
Granim.prototype.pause = require('./pause.js');
Granim.prototype.pauseWhenNotInView = require('./pauseWhenNotInView.js');
Granim.prototype.play = require('./play.js');
Granim.prototype.prepareImage = require('./prepareImage.js');
Granim.prototype.refreshColorsAndPos = require('./refreshColorsAndPos.js');
Granim.prototype.setColors = require('./setColors.js');
Granim.prototype.setDirection = require('./setDirection.js');
Granim.prototype.setSizeAttributes = require('./setSizeAttributes.js');
Granim.prototype.triggerError = require('./triggerError.js');
Granim.prototype.validateInput = require('./validateInput.js');

module.exports = Granim;
