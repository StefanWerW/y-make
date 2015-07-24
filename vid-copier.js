//Dependencies
var downloader = require('./vid-downloader');
var uploader = require('./vid-uploader');
var path = require('path');
var fs = require('fs');


var VIDEOS_FOLDER = "videos";
var id_counter =0;


exports.start = function(info){

  var vid_id = (id_counter++) + '.mp4';
  var vid_path = path.join(__dirname, VIDEOS_FOLDER, vid_id);
  info.vid_path = vid_path;
  //download video
  downloader.download(info, function(){console.log('error');}, function(){
    console.log('DOWN SUCCESS');
    //upload video
    uploader.upload(info, function(){console.log('UPLOAD ERROR CB')}, function(){
      console.log('UPLOAD SUCCESS');
      //delete video
      fs.unlink(vid_path);
    });
  });



}
