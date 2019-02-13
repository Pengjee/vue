function Watcher(vm, exp, cb) {
  this.cb = cb
  this.vm = vm  // this对象
  this.exp = exp
  this.value = this.get() // 将自己添加到订阅器的操作
}
Watcher.prototype = {
  update: function () {
    this.run()
  },
  run: function () {
    const value = this.vm.data[this.exp]
    const oldVal = this.value
    if(value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get: function () {
    Dep.target = this // 缓存自己
    const value = this.vm.data[this.exp] // 强制执行监听器里的get函数
    Dep.target = null // 释放缓存
    return value
  }
}
