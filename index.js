const express = require('express')
const path = require('path')
const app        = express();
const bodyParser = require('body-parser');
const http       = require('http').Server(app);
const io         = require('socket.io')(http);
const PORT = process.env.PORT || 5000

app.use(bodyParser.json({ type : '*/*' })); // force json

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/', (req, res) => res.render('pages/index'))

app.post('/locations', function(request, response){
  console.log('Headers:\n', request.headers);
  console.log('Locations:\n', request.body);
  console.log('------------------------------');
  io.emit('locations', request.body);
  response.sendStatus(200);
});

app.post('/sync', function(request, response){
  console.log('Headers:\n', request.headers);
  console.log('Synced Locations:\n', request.body);
  console.log('------------------------------');
  io.emit('locations', request.body);
  response.sendStatus(200);
});

io.on('connection', function(socket){
  console.log('a user connected');
});


http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
