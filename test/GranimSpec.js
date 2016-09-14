describe('Prelim Checks: ', function(){
  it('Granim is defined', function(){
    expect(Granim).toBeDefined()
  })
  it('Granim is a function', function(){
    expect(Granim).toEqual(jasmine.any(Function))
  })
})
