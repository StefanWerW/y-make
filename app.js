var downloader = require('./vid-downloader');
var test = require('./vid-pipbuilder');
var path = require('path');

var VIDEOS_FOLDER = "videos";
var vid_url = "https://www.youtube.com/watch?v=U6IggHJTukg";
var vid_path = path.join(__dirname, VIDEOS_FOLDER, 'dlTest.mp4');

var info = {url: vid_url, vid_path: vid_path};

downloader.download(info, function(){console.log('error');}, function(){
  console.log('DOWN SUCCESS');
  test.piptest(vid_path);
});
