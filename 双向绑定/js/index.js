/*
 * @desc
 * @param data 绑定数据
 * @param el 节点
 * @param exp
 * @return
 * @author pj
 * @time 2019/2/13
 */

function SelfVue({data, el, methods}) {
  this.data = data
  this.vm = this
  this.el = el
  this.methods = methods

  Object.keys(this.data).forEach((key)=>{
    this.proxyKeys(key) // 绑定代理属性
  })

  observe(this.data)
  new Compile(this.el, this.vm)
  options.mounted.call(this) // 执行mounte函数

  return this
}

SelfVue.prototype = {
  proxyKeys: function (key) {
    const self = this
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key]
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal
      }
    })
  }
}
