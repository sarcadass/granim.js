/* eslint-disable */

describe('Methods: ', function() {
	var granimInstance;

	beforeEach(function(done) {
		setTimeout(function() {
			value = 0;
			done();
		}, 1);
	});

	it('should support async execution of test preparation and expectations', function(done) {
		setCanvas();
		granimInstance = new Granim({
			element: '#granim-canvas',
			direction: 'left-right',
			//isPausedWhenNotInView: true,
			opacity: [1, 1],
			states: {
				"default-state": {
					gradients: [
						['#BA8B02', '#181818'],
						['#111', '#252525'],
						['#7b4397', '#dc2430']
					],
					transitionSpeed: 100,
					loop: false
				},
				"second-state": {
					gradients: [['#00bf8f', '#001510']],
					transitionSpeed: 100,
					loop: false
				}
			}
		});

		expect(granimInstance).toBeDefined();
		done();
	});

	describe('Asynchronous specs:', function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it('Pause method is working', function(done) {
			setTimeout(function() {
				granimInstance.pause();
				expect(granimInstance.isPaused).toBe(true);
				done();
			}, 105);
		});

		it('Play method is working', function(done) {
			setTimeout(function() {
				granimInstance.play();
				expect(granimInstance.isPaused).toBe(false);
				done();
			}, 10);
		});

		it('ChangeState method is working', function(done) {
			setTimeout(function() {
				granimInstance.changeState('default-state');
				granimInstance.changeState('second-state');
				expect(granimInstance.activeState).toEqual('second-state');
				done();
			}, 200);
		});

		it('ChangeDirection method is working', function(done) {
			setTimeout(function() {
				granimInstance.changeDirection('left-right');
				expect(granimInstance.direction).toEqual('left-right');
				done();
			}, 200);
		});

		it('Clear method is working', function(done) {
			setTimeout(function() {
				granimInstance.clear();
				expect(granimInstance.context.getImageData(1, 1, 1, 1).data[0]).toEqual(0);
				done();
			}, 10);
		});

		it('ChangeDirection should throw an error when passed \'custom\' value without a customDirection object', function(done) {
			setTimeout(function() {
				var func = function() { return granimInstance.changeDirection('custom'); };
				expect(func).toThrowError(errorMessage('customDirection'));
				done();
			}, 200);
		});

		it('ChangeDirection should throw an error when passed \'custom\' value with a poorly formatted customDirection object', function(done) {
			setTimeout(function() {
				granimInstance.customDirection = {
					x0: '1px1',
					y0: '1px1',
					x1: '1%na',
					y1: '1%na'
				};
				var func = function() { return granimInstance.changeDirection('custom'); };
				expect(func).toThrowError(errorMessage('customDirection'));
				done();
			}, 200);
		});

		it('ChangeDirection should throw an error when passed \'custom\' value with a customDirection object which has number values', function(done) {
			setTimeout(function() {
				granimInstance.customDirection = {
					x0: 0,
					y0: 2,
					x1: 1,
					y1: 3
				};
				var func = function() { return granimInstance.changeDirection('custom'); };
				expect(func).toThrowError(errorMessage('customDirection'));
				done();
			}, 200);
		});

		it('ChangeDirection should throw an error when passed \'custom\' value with a customDirection object which has no number values in front of unit', function(done) {
			setTimeout(function() {
				granimInstance.customDirection = {
					x0: 'px',
					y0: '%',
					x1: 'px',
					y1: 'px'
				};
				var func = function() { return granimInstance.changeDirection('custom'); };
				expect(func).toThrowError(errorMessage('customDirection'));
				done();
			}, 200);
		});

		it('ChangeDirection should throw an error when passed \'custom\' value with a customDirection object which has only one good value', function(done) {
			setTimeout(function() {
				granimInstance.customDirection = {
					x0: '50px',
					y0: '00',
					x1: '0',
					y1: '0'
				};
				var func = function() { return granimInstance.changeDirection('custom'); };
				expect(func).toThrowError(errorMessage('customDirection'));
				done();
			}, 200);
		});

		it('ChangeDirection method to a custom direction with valid \'customDirection\' inputs is working', function(done) {
			setTimeout(function() {
				granimInstance.customDirection = {
					x0: '20%',
					y0: '200px',
					x1: '30%',
					y1: '400px'
				};
				granimInstance.changeDirection('custom');
				expect(granimInstance.direction).toEqual('custom');
				done();
			}, 200);
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
