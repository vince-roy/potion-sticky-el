function CustomEvent ( event, params ) {
  params = params || { bubbles: false, cancelable: false, detail: undefined };
  var evt = document.createEvent( 'CustomEvent' );
  evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
  return evt;
}
CustomEvent.prototype = window.Event.prototype

export default function (type, name, obj)  {
  obj = obj || window;
  var running = false;
  var func = function() {
    if (running) { return; }
    running = true;
    requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name, {}));
        running = false;
    });
  };
  obj.addEventListener(type, func)
}