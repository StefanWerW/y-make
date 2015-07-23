var express = require('express');
var copier = require('./vid-copier');
var app = express();



app.get('/video', function(req, res){
  var info = req.query;
  console.log('recieved POST VIDEO');
  res.send('recieved Command')
  copier.start(info);
});


app.listen(3000);
