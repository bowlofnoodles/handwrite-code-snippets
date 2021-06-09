import axios from 'axios';

axios.get('http://baidu.com').then(res => {
  console.log(res.data);
  document.body.innerHTML = res.data;
});