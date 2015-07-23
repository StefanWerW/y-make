var express = require('express');
var copier = require('./vid-copier');
var cors = require('cors');
var app = express();

app.use(cors());


app.get('/video', function(req, res){
  var info = req.query;
  console.log('recieved POST VIDEO');
  res.send('recieved Command')
  copier.start(info);
});


app.listen(3000);
