const success = [
  'background: green',
  'color: white',
  'display: block',
  'text-align: center'
].join(';');

const getLog = id => log(id);

const log = id => (...args)  => {
  id && console.info(`%c module ${id}: `, success);
  console.info(...args);
}

export default getLog;
export { log };