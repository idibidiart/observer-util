require('reify')

const expect = require('chai').expect
const observer = require('../../src')

describe('Set', () => {
  it('should be a proper JS Set', () => {
    const observable = observer.observable(new Set())
    expect(observable).to.be.instanceOf(Set)
    expect(observable.$raw).to.be.instanceOf(Set)
  })

  it('should observe mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.has('value'))

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.add('value'))
      .then(() => expect(dummy).to.equal(true))
      .then(() => observable.delete('value'))
      .then(() => expect(dummy).to.equal(false))
  })

  it('should observe for of iteration', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => {
      dummy = 0
      for (let num of observable) {
        dummy += num
      }
    })

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add(3))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.add(2))
      .then(() => expect(dummy).to.equal(5))
      .then(() => observable.delete(2))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(0))
  })

  it('should observe forEach iteration', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => {
      dummy = 0
      observable.forEach(num => dummy += num)
    })

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add(3))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.add(2))
      .then(() => expect(dummy).to.equal(5))
      .then(() => observable.delete(2))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(0))
  })

  it('should observe values iteration', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => {
      dummy = 0
      for (let num of observable.values()) {
        dummy += num
      }
    })

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add(3))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.add(2))
      .then(() => expect(dummy).to.equal(5))
      .then(() => observable.delete(2))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(0))
  })

  it('should observe keys iteration', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => {
      dummy = 0
      for (let num of observable.keys()) {
        dummy += num
      }
    })

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add(3))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.add(2))
      .then(() => expect(dummy).to.equal(5))
      .then(() => observable.delete(2))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(0))
  })

  it('should observe entries iteration', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => {
      dummy = 0
      for (let [key, num] of observable.entries()) {
        dummy += num
      }
    })

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add(3))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.add(2))
      .then(() => expect(dummy).to.equal(5))
      .then(() => observable.delete(2))
      .then(() => expect(dummy).to.equal(3))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(0))
  })

  it('should observe custom property mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.customProp)

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(undefined))
      .then(() => observable.customProp = 'Hello World')
      .then(() => expect(dummy).to.equal('Hello World'))
      .then(() => delete observable.customProp)
      .then(() => expect(dummy).to.equal(undefined))
  })

  it('should observe size mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.size)

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add('value'))
      .then(() => expect(dummy).to.equal(1))
      .then(() => observable.delete('value'))
      .then(() => expect(dummy).to.equal(0))
  })

  it('should not observe non value changing mutations', () => {
    let dummy
    let numOfRuns = 0
    const observable = observer.observable(new Set())
    observer.observe(() => {
      numOfRuns++
      dummy = observable.has('value')
    })

    return Promise.resolve()
      .then(() => {
        expect(dummy).to.equal(false)
        expect(numOfRuns).to.equal(1)
      })
      .then(() => observable.add('value'))
      .then(() => observable.add('value'))
      .then(() => {
        expect(dummy).to.equal(true)
        expect(numOfRuns).to.equal(2)
      })
      .then(() => observable.delete('value'))
      .then(() => observable.delete('value'))
      .then(() => {
        expect(dummy).to.equal(false)
        expect(numOfRuns).to.equal(3)
      })
  })

  it('should not observe $raw mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.$raw.has('value'))

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.add('value'))
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.delete('key'))
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.clear())
      .then(() => expect(dummy).to.equal(false))
  })

  it('should not be triggered by $raw mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.has('value'))

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.$raw.add('value'))
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.$raw.delete('key'))
      .then(() => expect(dummy).to.equal(false))
      .then(() => observable.$raw.clear())
      .then(() => expect(dummy).to.equal(false))
  })

  it('should not observe $raw size mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.$raw.size)

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.add('value'))
      .then(() => expect(dummy).to.equal(0))
  })

  it('should not be triggered by $raw size mutations', () => {
    let dummy
    const observable = observer.observable(new Set())
    observer.observe(() => dummy = observable.size)

    return Promise.resolve()
      .then(() => expect(dummy).to.equal(0))
      .then(() => observable.$raw.add('value'))
      .then(() => expect(dummy).to.equal(0))
  })
})
