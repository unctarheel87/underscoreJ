(function() {
  function _j(selector) {
    const node = document.querySelector(selector);
    return DOM_Obj(node);
  }
  window._j = _j;
})()

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


