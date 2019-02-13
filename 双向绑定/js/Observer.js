function Observer(data) {
  this.data = data
  this.walk(data)
}
Observer.prototype = {
  walk: function (data) {
    Object.keys(data).forEach((key)=>{
      this.defineReactive(data, key, data[key])
    })
  },
  defineReactive:function (data, key, val) {
    const dep = new Dep()
    const childObj = observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if(Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set: function (newVal) {
        if(newVal === val) {
          return
        }
        val = newVal
        dep.notify()
      }
    })
  }
}

function observe(value, vm) {
  if(!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}
// 订阅者
function Dep() {
  this.subs = []
}
Dep.prototype = {
  // 添加订阅者
  addSub: function (sub) {
    this.subs.push(sub)
  },
  // 广播
  notify: function () {
    this.subs.forEach((sub)=>{
      sub.update()
    })
  }
}
Dep.target = null
