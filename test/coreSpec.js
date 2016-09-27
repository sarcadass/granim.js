describe('Prelim Checks: ', function(){
    it('Granim is defined', function(){
        expect(Granim).toBeDefined();
    });
    it('Granim is a function', function(){
        expect(Granim).toEqual(jasmine.any(Function));
    });
});

var validOptions = {
    element: document.createElement('canvas'),
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
};

describe('Granim Core: ', function(){
    beforeEach(function(){
        unsetCanvas();
        spyOn(console, 'error');
    });

    describe('Invalid options: ', function(){
        var func = function(){ return new Granim({element: '#granim-canvas'})};

        it('throws error on invalid element id ', function(){
            expect(func).toThrowError("`#granim-canvas` could not be found in the DOM");
        });

        it('throws an error when passed in anything other than a HTMLCanvasElement as an element', function(){
            var invalidOptions = {
                element: document.createElement('div'),
                name: validOptions.name,
                opactiy: validOptions.opactiy,
                states: validOptions.states
            };
            var func = function(){ return new Granim(invalidOptions)};
            expect(func).toThrowError("The element you used is neither a String, nor a HTMLCanvasElement");
        });
    });

    it('Can use a HTMLCanvasElement as an element', function(){
        new Granim(validOptions);
    });
});
