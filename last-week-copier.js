var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var moment = require('moment');
var gm = require('gm');
var path = require('path');
var youtube;

var VIDEOS_FOLDER = "videos";
var IMAGES_FOLDER = "images";


require('./youtube-get-tokens').get(function(auth_info){
  youtube = google.youtube({ version: 'v3', auth: auth_info });
  //Time
  var publishedBefore = moment().utc().subtract(1, 'weeks').startOf('hour');
  var publishedAfter = moment(publishedBefore).subtract(4, 'hours');

  youtube.search.list({
    //q: 'dog',
    part: 'snippet',
    order: 'viewCount',
    maxResults: 4,
    type: 'video',
    publishedAfter: publishedAfter.format(),
    publishedBefore: publishedBefore.format()

  } , function(err, data){
    console.log('SEARCH DONE');
    data.publishedAfter = publishedAfter;
    data.publishedBefore = publishedBefore;
    if(err){
      console.log("ERROR: ");
      console.log(err);
    }
    //for (var i = 0; i < data.items.length; i++) {}
    var download_info =  {videos:[
        { url:data.items[0].id.videoId, vid_path:path.join(__dirname, VIDEOS_FOLDER, data.items[0].id.videoId +'.mp4')},
        { url:data.items[1].id.videoId, vid_path:path.join(__dirname, VIDEOS_FOLDER, data.items[1].id.videoId +'.mp4')},
        { url:data.items[2].id.videoId, vid_path:path.join(__dirname, VIDEOS_FOLDER, data.items[2].id.videoId +'.mp4')},
        { url:data.items[3].id.videoId, vid_path:path.join(__dirname, VIDEOS_FOLDER, data.items[3].id.videoId +'.mp4')}
      ],
      vid_path:"output.mp4",
      title: createTitle(data),
      description: createDescription(data),
    };
    download_info.foreground = path.join(__dirname, IMAGES_FOLDER, download_info.title + '.png');

    require('./vid-downloader').downloadMultiples(download_info, function(){console.log('ERROR ON DOWNLOAD');}, function(){
      console.log('DOWNLOADES COMPLETES....STARTING CREATE IMAGE');
      createImageWithTitles(data, download_info.foreground, function(){
        console.log('IMAGE COMPLETE.....STARING PIP');
        require('./vid-pipbuilder').pipWithForeground(download_info, function(){
          console.log('PIP COMPLETE::::: STARTING UPLOAD');
          require('./vid-uploader').upload(download_info, auth_info, function(){console.log('ERROR ON UPLOAD');}, function(){
            console.log('DONE EVERYTHING!!!!');
          });
        });
      });
    });
  });
});



function createImageWithTitles(data, out_path, callback){
  gm(path.join(__dirname, IMAGES_FOLDER, 'covertamplate.png'))
    .colorize(200,200,256)
    .autoOrient()
    .font(path.join(__dirname, IMAGES_FOLDER, 'font.ttf'))
    .fontSize(30)
    //.label('mS3Xvm7mTioIqEKEuTKKrhEgTKUBPLvY55Y3i3O2ijhGm5p0LW9vbD1XqkoG2PNavFWmFjnv0JqRia3FmhIzm0s6PvWXxZmwjpO4')
    .drawText(-320, -120, data.items[0].snippet.title, 'Center')
    .drawText(320, -120, data.items[1].snippet.title, 'Center')
    .drawText(-320, 120, data.items[2].snippet.title, 'Center')
    .drawText(320, 120, data.items[3].snippet.title, 'Center')
    .write(out_path, function (err) {
      if (!err) callback();
      else console.log(err);
    });
}

function createTitle(data){
  return title = "Top Videos Week Race:" + data.publishedBefore.format("MMM Do YYYY, h a");
}

function createDescription(data){
  var description = "YOUTUBE VIDEOS WEEK RACE \n" ;
  description += "Videos published from: " +  data.publishedAfter.format("MMM Do YYYY, h a") + " to " + data.publishedBefore.format("MMM Do YYYY, h a");

  description += "Please, visit the winners: ";
  data.items.forEach(function(vid){
    description += "" + vid.snippet.title + ":  \n";
    description += "https://www.youtube.com/watch?v=" + vid.id.videoId + "\n \n \n";
  });

  return description;
}
