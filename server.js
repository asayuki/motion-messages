'use strict';
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

let socket = null;

app.listen(5000);

io.on('connection', (s) => {
  socket = s;
});

function handler (request, response) {
  switch (request.url) {
    case '/':
      fs.readFile(`${__dirname}/index.html`, (error, file) => {
        if (error) {
          response.writeHead(500);
          return response.end('Oh noes!');
        }
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(file, 'binary');
        return response.end();
      })
      break;
    case '/curl':
      try {
        socket.emit('message', {
          message: messages.messages[Math.floor(Math.random() * messages.messages.length)]
        });
      } catch (e) {}
      return response.end();
      break;
  }
}
