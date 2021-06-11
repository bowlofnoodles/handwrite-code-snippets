class Scheduler {
  constructor(num) {
    this.runCount = 0;
    this.maxCount = num;
    this.queue = [];
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
    if (!this.queue.length || this.maxCount <= 0 || this.runCount >= this.maxCount) return;
    this.runCount ++;
    this.queue.shift()().then(() => {
      this.runCount --;
      this.next();
    });
  }
  // ...
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
