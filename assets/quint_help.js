/* eslint-disable */

function elemHelpers (el) {
  el.addChild = function (type, cls) {
    let child = elemHelpers(el.appendChild(document.createElement(type)));
    if (cls)
      child.classList.add(cls);
    return child;
  };

  el.addLabel = function (tx) {
    let child = el.addChild('label');
    child.innerText = tx;
    return child;
  };

  el.addInput = function (type, cls) {
    let child = el.addChild('input', cls);
    child.type = type;
    return child;
  };

  el.addRadio = function (name, label) {
    let child = el.addInput('radio');
    if (name)
      child.name = name;
    if (label)
      el.addLabel(label);
    return child;
  };

  el.br = function () {
    el.addChild('br');
    return el;
  };

  return el;
}

// eof