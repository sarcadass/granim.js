describe('Animation: ', function() {
	var value, granimInstance, gradientColor, canvas;

	beforeEach(function(done) {
		setTimeout(function() {
			value = 0;
			done();
		}, 1);
	});

	it("should support async execution of test preparation and expectations", function(done) {
		setCanvas();
		granimInstance = new Granim({
			element: '#granim-canvas',
			name: 'granim',
			direction: 'left-right',
			//isPausedWhenNotInView: true,
			opacity: [1, 1],
			states : {
				"default-state": {
					gradients: [
						['#BA8B02', '#181818'],
						['#7b4397', '#dc2430']
					],
					transitionSpeed: 100,
					loop: true
				}
			}
		});
		canvas = document.querySelector(granimInstance.element);
		gradientColor = granimInstance.context.getImageData(150, 75, 5, 5).data;

		expect(granimInstance).toBeDefined();
		done();
	});

	describe('Asynchronous specs:', function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it('Gradient animation is working', function(done) {
			setTimeout(function() {
				expect(gradientColor).not.toEqual(granimInstance.context.getImageData(150, 75, 5, 5).data);
				done();
			}, 205);
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
