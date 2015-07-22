var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');

  // Optional arguments passed to youtube-dl.
  //['-f', '22']);
exports.download = function(dt, errcallback, endcallback){
  var video = ytdl(dt.url, []);//,
  var size = 0;
  video.on('info', function(info) {
    //console.log(info);
    size = info.size;
    //var output = path.join(__dirname, dt.path, dt.filename);
    video.pipe(fs.createWriteStream(dt.vid_path));
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

  video.on('error', function(){
    errcallback();
  });

  video.on('end', function() {
    endcallback();
  });

}
