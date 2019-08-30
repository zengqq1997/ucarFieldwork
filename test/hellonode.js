// const http = require('http');
// http
//   .createServer((request, response) => {
//     response.writeHead(200, { 'Content-type': 'text/plain' });
//     response.end('hello world');
//   })
//   .listen(8000);
// console.log('服务器运行于http://127.0.0.1:8000/');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('示例应用正在监听 3000 端口!');
});
