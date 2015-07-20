var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');


var video = ytdl('http://www.youtube.com/watch?v=UX6ncLjFzzA', []);//,
  // Optional arguments passed to youtube-dl.
  //['-f', '22']);


var size = 0;
video.on('info', function(info) {
  //console.log(info);
  size = info.size;
  console.log('Got video info');
  console.log('saving to ' + info._filename);
  var output = path.join(__dirname, 'videos', info._filename);
  video.pipe(fs.createWriteStream(output));
});

var pos = 0;
video.on('data', function(data) {
  pos += data.length;
  // `size` should not be 0 here.
  if (size) {
    var percent = (pos / size * 100).toFixed(2);
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
    process.stdout.write(percent + '%');
  }
});

video.on('end', function() {
  console.log();
});
