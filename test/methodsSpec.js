describe('Methods: ', function() {
	var value, granimInstance;

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
			direction: 'left-right',
			//isPausedWhenNotInView: true,
			opacity: [1, 1],
			states : {
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

	describe("Asynchronous specs:", function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it("Pause method is working", function(done) {
			setTimeout(function() {
				granimInstance.pause();
				expect(granimInstance.isPaused).toBe(true);
				done();
			}, 105);
		});

		it("Play method is working", function(done) {
			setTimeout(function() {
				granimInstance.play();
				expect(granimInstance.isPaused).toBe(false);
				done();
			}, 10);
		});

		it("ChangeState method is working", function(done) {
			setTimeout(function() {
				granimInstance.changeState('default-state');
				granimInstance.changeState('second-state');
				expect(granimInstance.activeState).toEqual('second-state');
				done();
			}, 200);
		});

		it("Clear method is working", function(done) {
			setTimeout(function() {
				granimInstance.clear();
				expect(granimInstance.context.getImageData(1, 1, 1, 1).data[0]).toEqual(0);
				done();
			}, 10);
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
