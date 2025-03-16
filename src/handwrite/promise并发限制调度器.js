class Scheduler {
  constructor(num) {
    this.maxCount = num;
    this.queue = [];
    this.result = [];
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }

  run() {
    for (let i = 0; i < this.maxCount; i ++) {
      this.next();
    }
  }

  next() {
    const p = this.queue.shift();
    if (!p) return;
    p().then(() => {
      this.next();
    });
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

scheduler.run();

// output: 2 3 1 4
