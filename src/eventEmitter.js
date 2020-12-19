class Emitter {
  eventMap = {};

  on(type, handler) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = [];
    }
    this.eventMap[type].push(handler);
  }

  emit(type, params) {
    if (!this.eventMap[type]) return;
    this.eventMap[type].forEach(handler => {
      handler(params);
    });
  }

  off(type, handler) {
    if (!this.eventMap[type]) return;
    if (handler) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler), 1);
    } else {
      // 默认不传的话 就是把全部的都清除
      delete this.eventMap[type];
    }
  }
}

const event = new Emitter();

const add1 = function (params) {
  console.log('add1', params);
};

event.on('add', add1);

event.on('add', (params) => {
  console.log('add2', params);
});

event.emit('add', {
  add: 1
});

// event.off('add', add1);
event.off('add');

event.emit('add', {
  add: 1
});

