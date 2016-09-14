describe('Prelim Checks: ', function(){
  it('Granim is defined', function(){
    expect(Granim).toBeDefined()
  })
  it('Granim is a function', function(){
    expect(Granim).toEqual(jasmine.any(Function))
  })
})

describe('Granim Core: ', function(){
  beforeEach(function(){
    spyOn(console, 'error');
  })

  describe('Invalid options: ', function(){
    this.func = function(){ return new Granim({element: '#granim-canvas'}) }

    it('Granim throws error on invalid element', function(){
      expect(this.func).toThrowError("`#granim-canvas` could not be found in the DOM")
    }.bind(this))
  })
})
