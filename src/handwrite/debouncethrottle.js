const debounce = function (fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, wait);
  };
};

const throttle = function(fn, wait) {
  
};


const onChange = function(e) {
  console.log('inputchange');
};

const input = document.createElement('input');

document.body.appendChild(input);

// input.addEventListener('input', onChange);
input.addEventListener('input', debounce(onChange, 500));
