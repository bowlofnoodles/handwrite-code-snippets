function debounce(fn, wait, immediate) {
  var timer, result;
  var debounced = function () {
    var ctx = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    // 立即触发执行 然后等待wait时间 才能再次触发
    if (immediate) {
      var callNow = !timer;
      // 时间到了 再把标志位置空
      timer = setTimeout(function () {
        timer = null;
      }, wait);
      if (callNow) result = fn.apply(ctx, args);
    } else {
      // 传统的防抖
      // 触发等待wait时间 然后才执行
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    }
    return result;
  };
  // 取消防抖 与immediate为true配合使用
  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}
