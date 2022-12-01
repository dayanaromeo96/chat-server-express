var cors = require('cors')
let app = require('express')();
let server = require('http').createServer(app);
app.use(cors({credentials: true, origin: true}));
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
io.on('connection', (socket) => {
 
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});  
  });
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });
  
  socket.on('send-message', (message) => {
    console.log('Entrando aqui');
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });
});
var port = process.env.PORT || 3001;
server.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});

app.get('test', cors(), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for a Single Route'})
  })