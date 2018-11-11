/* eslint-disable */

describe('Prelim Checks:', function() {
	it('Granim is defined', function() {
		expect(Granim).toBeDefined();
	});
	it('Granim is a function', function() {
		expect(Granim).toEqual(jasmine.any(Function));
	});
});

var validOptions = {
	element: document.createElement('canvas'),
	name: 'granim',
	opacity: [1, 1],
	states: {
		"default-state": {
			gradients: [
				['#834D9B', '#D04ED6'],
				['#1CD8D2', '#93EDC7']
			]
		}
	}
};

describe('Granim Core:', function() {
	beforeEach(function() {
		unsetCanvas();
		spyOn(console, 'error');
	});

	describe('Invalid options:', function() {
		var func = function() { return new Granim({ element: '#granim-canvas' }) };

		it('throws error on invalid element id ', function() {
			expect(func).toThrowError('`#granim-canvas` could not be found in the DOM');
		});

		it('throws an error when passed in anything other than a HTMLCanvasElement as an element', function() {
			var invalidOptions = Object.assign(
				Object.assign({}, validOptions),
				{ element: document.createElement('div') }
			);
			var func = function() { return new Granim(invalidOptions) };
			expect(func).toThrowError('The element you used is neither a String, nor a HTMLCanvasElement');
		});

		it('throws an error on invalid direction', function() {
			var invalidOptions = Object.assign(
				Object.assign({}, validOptions),
				{ direction: 'wrongDirectiion' }
			);
			var func = function() { return new Granim(invalidOptions) };
			expect(func).toThrowError(errorMessage('direction'));
		});

		it('throws an error when the color type of the gradient is not valid', function() {
			var invalidOptions = Object.assign(
				Object.assign({}, validOptions),
				{
					states: {
						'default-state': {
							gradients: [
								['hsla(255, 12, 12%, .75)', 'rgb(kf)'],
								['#az', 'rgbaw(12,36,58)']
							]
						}
					}
				}
			);
			var func = function() { return new Granim(invalidOptions) };
			expect(func).toThrowError(errorMessage('colorType'));
		});

		it('throws an error when the option direction has the value \'custom\' but not the customDirection object when a new Granim instance is created', function() {
			var invalidOptions = Object.assign(
				Object.assign({}, validOptions),
				{ direction: 'custom' }
			);
			var func = function() { return new Granim(invalidOptions) };
			expect(func).toThrowError(errorMessage('customDirection'));
		});

		it('throws an error when the color value of a gradient is an object without the \'color\' key', function() {
			var invalidOptions = Object.assign(
				Object.assign({}, validOptions),
				{
					states: {
						"default-state": {
							gradients: [[{ pos: .5 }, { color: '#fff', pos: .6 }], ['#1CD8D2', '#93EDC7']]
						}
					}
				}
			);
			var func = function() { return new Granim(invalidOptions) };
			expect(func).toThrowError(errorMessage('gradient.color'));
		});

	});

	it('Can use a HTMLCanvasElement as an element', function() {
		new Granim(validOptions);
	});
});
