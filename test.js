var moment = require('moment');
var gm = require('gm');
var path = require('path');

/*gm('./images/covertamplate.png')
  .colorize(200,200,256)
  .autoOrient()
  .font('./images/font.ttf')
  .fontSize(30)
  //.label('mS3Xvm7mTioIqEKEuTKKrhEgTKUBPLvY55Y3i3O2ijhGm5p0LW9vbD1XqkoG2PNavFWmFjnv0JqRia3FmhIzm0s6PvWXxZmwjpO4')
  .drawText(-320, -120, 'mS3Xvm7mTioIqEKEuTKKrhEgTKUBP\nLvY55Y3i3O2ijhGm5p0LnW9vD1XqkoG2PNavFWmFjnv0JqRi\na3FmhIzm0s6PvWXxZmwjpO4', 'Center')
  .write('./images/out.png', function (err) {
  if (!err) console.log(' hooray! ');
  else console.log(err);
});*/
var a = moment().utc().subtract(1, 'weeks').startOf('hour');
b = moment(a).subtract(4, 'hours');
console.log(a.format("MMM Do YYYY, h a"));
console.log(b.format("Do h a"));
