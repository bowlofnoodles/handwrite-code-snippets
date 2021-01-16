const jsonp = (url, params, cb) => {
  const backEndCb = 'callback'; // 与后台约定的包裹的函数名
  const nextUrl = Object.keys(params).reduce((c, n) => c + `${n}=${params[n]}&`, url + `?callback=${backEndCb}&`);
  const script = document.createElement('script');
  script.setAttribute('src', nextUrl);
  document.body.appendChild(script);
  window[backEndCb] = function(data) {
    typeof cb === 'function' && cb(data);
    document.body.removeChild(script);
  }
}

// 包装一个promise
const promisifyJsonp = (url, params) => {
  return new Promise((resolve, reject) => {
    const backEndCb = 'callback'; // 与后台约定的包裹的函数名
    const nextUrl = Object.keys(params).reduce((c, n) => c + `${n}=${params[n]}&`, url + `?callback=${backEndCb}&`);
    const script = document.createElement('script');
    script.setAttribute('src', nextUrl);
    document.body.appendChild(script);
    window[backEndCb] = function(data) {
      resolve(data);
      document.body.removeChild(script);
    }
  });
}
