var ffmpeg = require('fluent-ffmpeg');


exports.piptest = function(filepaths, endcallback){
  var command = ffmpeg()
          .input(filepaths.v0.vid_path)
          .input(filepaths.v1.vid_path)
          .input(filepaths.v2.vid_path)
          .input(filepaths.v3.vid_path)
          .duration(30)
          .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
          })
          .on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
          })
          .on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
          })
          .on('end', function() {
            console.log('Transcoding succeeded !');
            endcallback();
          })
          .complexFilter([
             // Rescale input stream into stream 'rescaled'

             //'nullsrc=size=1280x720 [background]',

             {
               filter: 'scale', options: '640x480',
               inputs: '0:v', outputs: 'a'
             },
             {
               filter: 'scale', options: '640x480',
               inputs: '1:v', outputs: 'b'
             },
             {
               filter: 'scale', options: '640x480',
               inputs: '2:v', outputs: 'c'
             },
             {
               filter: 'scale', options: '640x480',
               inputs: '3:v', outputs: 'd'
             },

             {
               filter: 'pad', options: { w: 'iw*2', h: 'ih*2' },
               inputs: 'a', outputs: 'padded'
             },
             {
               filter: 'overlay', options: { x: '0', y: 'h' },
               inputs: ['padded', 'b'], outputs: 'ab'
             },

             {
               filter: 'overlay', options: { x: 'w', y: '0' },
               inputs: ['ab', 'c'], outputs: 'abc'
             },
             {
               filter: 'overlay', options: { x: 'w', y: 'h' },
               inputs: ['abc', 'd'], outputs: 'output'
             },
           ], 'output')
          .save(filepaths.vid_path);
}
