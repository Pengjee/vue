function Compile(el, vm) {
  this.vm = vm
  this.el = document.querySelector(el)
  this.fragment = null
  this.init()
}

Compile.prototype = {
  init : function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
      return
    }
    console.log('Dom不存在')
  },
  nodeToFragment : function (el) {
    const fragment = document.createDocumentFragment() // 创建一个虚拟节点
    let child = el.firstChild
    while (child) { // 把真实节点拷贝到虚拟节点中
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  compileElement : function (el) {
    const childNodes = el.childNodes
    const arr = []
    arr.slice.call(childNodes).forEach((node) => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent
      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) { // 判断是否符合{{}}
        this.compileText(node, reg.exec(text)[1])
      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node) // 递归遍历子节点
      }
    })
  },
  compile : function (node) {
    const nodeAttrs = node.attributes
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(2)
        if (this.isEventDirective(dir)) { // 事件指令
          this.compileEvent(node, this.vm, exp, dir)
        } else { // v-model 指令
          this.compileModel(node, self.vm, exp, dir)
        }
        node.removeAttribute(attrName)
      }
    })
  },
  compileText : function (node, exp) {
    const initText = this.vm[exp]
    this.updateText(node, initText) // 初始化的数据初始化到视图中
    new Watcher(this.vm, exp, (value) => { // 生成订阅器并绑定更新函数
      this.updateText(node, value)
    })
  },
  compileEvent : function (node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const cb = vm.methods && vm.methods[exp]

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false)
    }
  },
  compileModel : function (node, vm, exp, dir) {
    let val = this.vm[exp]
    this.modelUpdater(node, val)
    new Watcher(this.vm, exp, (value) => {
      this.modelUpdater(node, value)
    })

    node.addEventListener('input', (e) => {
      const newValue = e.target.value
      if (val === newValue) {
        return
      }
      this.vm[exp] = newValue
      val = newValue
    })
  },
  updateText : function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value
  },
  modelUpdater : function (node, value) {
    node.value = typeof value == 'undefined' ? '' : value
  },
  isDirective : function (attr) {
    return attr.indexOf('v-') == 0
  },
  isEventDirective : function (dir) {
    return dir.indexOf('on:') === 0
  },
  isElementNode : function (node) {
    return node.nodeType === 1
  },
  isTextNode : function (node) {
    return node.nodeType === 3 // 判定是否为文本内容
  }
}
