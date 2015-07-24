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
             {
               filter: 'resize', options: 'scale=640:480',
               inputs: '0:v', outputs: 'a'
             },
             {
               filter: 'resize', options: 'scale=640:480',
               inputs: '1:v', outputs: 'b'
             },
             {
               filter: 'resize', options: 'scale=640:480',
               inputs: '2:v', outputs: 'c'
             },
             {
               filter: 'resize', options: 'scale=640:480',
               inputs: '3:v', outputs: 'd'
             },

             // Pad stream 'red' to 3x width, keeping the video on the left,
             // and name output 'padded'


             // Overlay 'green' onto 'padded', moving it to the center,
             // and name output 'redgreen'
             {
               filter: 'overlay', options: { x: 'w', y: 'h*2' },
               inputs: ['a', 'b'], outputs: 'ab'
             },

             {
               filter: 'overlay', options: { x: 'w*2', y: 'h' },
               inputs: ['ab', 'c'], outputs: 'abc'
             },
             {
               filter: 'overlay', options: { x: 'w*2', y: 'h*2' },
               inputs: ['abc', 'd'], outputs: 'output'
             },
           ], 'output')
          .save(filepaths.vid_path);
}
