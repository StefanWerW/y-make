var downloader = require('./vid-downloader');
var test = require('./vid-pipbuilder');
var path = require('path');
var uploader = require('./vid-uploader');

var VIDEOS_FOLDER = "videos";
var vid_url = "https://www.youtube.com/watch?v=U6IggHJTukg";

var info = {
  v0:{ url:"https://www.youtube.com/watch?v=U6IggHJTukg", vid_path:path.join(__dirname, VIDEOS_FOLDER, '1'+'.mp4')},
  v1:{ url:"https://www.youtube.com/watch?v=gpijNsFF_Wo", vid_path:path.join(__dirname, VIDEOS_FOLDER, '2'+'.mp4')},
  v2:{ url:"https://www.youtube.com/watch?v=QVW2o_7jWos", vid_path:path.join(__dirname, VIDEOS_FOLDER, '2'+'.mp4')},
  v3:{ url:"https://www.youtube.com/watch?v=U2_XLDXnJzs", vid_path:path.join(__dirname, VIDEOS_FOLDER, '2'+'.mp4')},
  vid_path:"output.mp4"
  title: "test",
  description: "Teste description"
};

downloader.download(info.v0, function(){console.log('error');}, function(){
  downloader.download(info.v1, function(){console.log('error');}, function(){
    downloader.download(info.v2, function(){console.log('error');}, function(){
      downloader.download(info.v3, function(){console.log('error');}, function(){

        test.piptest(info, function(){
          uploader.upload(info, function(){console.log('UPLOAD ERROR CB')}, function(){
            console.log('UPLOAD SUCCESS');
            //delete video
            //fs.unlink(vid_path);
          });
        });
      }
    }
  }
});
