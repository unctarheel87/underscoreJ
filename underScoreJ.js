(function() {
  function _j(selector) {
    const _JObj = Object.create(_j.prototype);
    let i = 0;
    // create element if starts with '<'
    if(selector.charAt(0) === '<') {
      const tagName = selector.split('').filter(char => char !== '<' && char !== '>').join('');
      _JObj[i] = _J(document.createElement(tagName));
    }
    // breadth first traversal to find _J object
    window._J.traverseBF(function(node) {
      if(
        selector.toUpperCase() === node.data.node.nodeName ||
        (selector.charAt(0) === '#' && selector.substring(1) === node.data.node.id) ||
        (selector.charAt(0) === '.' && selector.substring(1) === node.data.node.className)
        ) {
        _JObj[i] = node.data;
        i++
      }
    })
    return _JObj;
  }
  _j.prototype = Object.create(_J.prototype);
  _j.prototype.constructor = _j;
  window._j = _j;

  function _J(node) {
    const domObj = Object.create(_J.prototype);
    // obj properties on initialization
    domObj.node = node;
    domObj.events = {}
    domObj.data = {}
    domObj.styles = {}
    
    return domObj;
  }
  // Register event handler
  _J.prototype.on = function(eventName, callback) {
    for(let node in this) {
      if(this.hasOwnProperty(node)) {
        bindEvents(this[node], eventName, callback);
      }
    }
    return this;
  }

  function bindEvents(node, eventName, callback) {
      if(node.events[eventName]) {
        node.events[eventName].push(callback);
      } else {
        node.events[eventName] = [callback];
      }
      switch (eventName) {
        case 'click':
          for(let cb of node.events[eventName]) {
            node.node.addEventListener('click', cb);
          }
          break;
        default:
          break;
      }
    }
  // Trigger all callbacks with element name
  _J.prototype.trigger = function(eventName) {
    if(this.events[eventName]) {
      for(let cb of this.events[eventName]) {
        cb();
      }
    }
    return this;
  }
  // Remove all handlers on element name
  _J.prototype.off = function(eventName) {
    delete this.events[eventName];
    return this;
  }

  _J.prototype.css = function(prop, style) {
    for(let node in this) {
      if(this.hasOwnProperty(node)) {
        if(this[node].styles.length > 0) {
          this[node].styles.push({ [prop]: style });
        } else {
          this[node].styles = [{ [prop]: style }];
        }
        let styles = ''
        for(let style of this[node].styles) {
          styles = styles + Object.keys(style)[0] + ": " + Object.values(style)[0] + ';'
        }
        this[node].node.style = styles;
      }
    }
    return this;
  }

  _J.prototype.append = function(el) {
    return _J(this[0].node.appendChild(el[0].node));
  }

  _J.prototype.text = function(text) {
    return this.node.innerText = text;
  }

  _J.prototype.html = function(html) {
    return this.node.innerHTML = html;
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

  function buildDOM() {
    const domTree = Tree();
    // depth first traversal to build DOM Tree
    domTree.root = Node(_J(document.body));
    const nodeArr = [domTree.root];
    while(nodeArr.length) {
      const node = nodeArr.shift();
      for(let child in node.data.node.children) {
        if(typeof node.data.node.children[child] !== 'function' && child !== 'length') {
          node.add(_J(node.data.node.children[child]));
        }
      }
      nodeArr.unshift(...node.children);
    }
    window._J = domTree;
  }

  buildDOM();
})();