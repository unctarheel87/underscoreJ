(function() {
  function _j(selector) {
    const node = document.querySelector(selector);
    return DOM_Obj(node);
  }
  window._j = _j;

  function DOM_Obj(node) {
    const domObj = Object.create(DOM_Obj.prototype)
    // obj properties on initialization
    domObj.node = node;
    domObj.events = {}
    domObj.data = {}
    domObj.styles = {}
    
    return domObj;
  }
  // Register event handler
  DOM_Obj.prototype.on = function(eventName, callback) {
    if(this.events[eventName]) {
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [callback];
    }
    switch (eventName) {
      case 'click':
        for(let cb of this.events[eventName]) {
          this.node.addEventListener('click', cb);
        }
        break;
      default:
        break;
    }
  }
  // Trigger all callbacks with element name
  DOM_Obj.prototype.trigger = function(eventName) {
    if(this.events[eventName]) {
      for(let cb of this.events[eventName]) {
        cb();
      }
    }
  }
  // Remove all handlers on element name
  DOM_Obj.prototype.off = function(eventName) {
    delete this.events[eventName];
  }

  DOM_Obj.prototype.css = function(style) {
    if(this.styles[style]) {
      this.events[eventName].push(callback);
    } else {
      this.styles[eventName] = [callback];
    }
  }

  function Node(data) {
    const node = Object.create(Node.prototype); 
    // obj properties on initialization
    node.data = data;
    node.children = []

    return node;
  }

  Node.prototype.add = function(data) {
    this.children.push(Node(data));
  }
  Node.prototype.remove = function(data) {
    this.children.filter(node => node.data !== data);
  }

  function Tree() {
    const tree = Object.create(Tree.prototype); 
    // obj property on initialization
    this.root = null;
    
    return tree
  }

  Tree.prototype.traverseBF = function(fn) {
    const arr = [this.root]
    while(arr.length) {
      const node = arr.shift();
      arr.push(...node.children)
      fn(node)
    }
  }
  Tree.prototype.traverseDF = function(fn) {
    const arr = [this.root]
    while(arr.length) {
      const node = arr.shift();
      arr.unshift(...node.children)
      fn(node)
    }
  }

  function buildDom() {
    const domTree = Tree();
    // depth first traversal to build DOM Tree
    domTree.root = Node(document.querySelector('body'));
    const nodeArr = [domTree.root];
    while(nodeArr.length) {
      const node = nodeArr.shift();
      for(let child in node.data.children) {
        if(typeof node.data.children[child] !== 'function' && child !== 'length') {
          node.add(node.data.children[child]);
        }
      }
      nodeArr.unshift(...node.children);
    }
    console.log(domTree)
  }

  buildDom();
})();