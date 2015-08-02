var ffmpeg = require('fluent-ffmpeg');


exports.pipWithForeground = function(info, endcallback){
  var command = ffmpeg()
          .input(info.videos[0].vid_path)
          .input(info.videos[1].vid_path)
          .input(info.videos[2].vid_path)
          .input(info.videos[3].vid_path)
          .input(info.foreground)
          .duration(28)
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

             //SCALE
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
               filter: 'scale', options: '1280x720',
               inputs: '4:v', outputs: 'fore'
             },

             //PAD
             {
               filter: 'pad', options: { w: 'iw*2', h: 'ih*2' },
               inputs: 'a', outputs: 'padded'
             },
             //OVERLAY
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
               inputs: ['abc', 'd'], outputs: 'abcd'
             },
             {
               filter: 'overlay', options: {x:0, y:0},
               input: ['abcd', 'fore'], output: 'output'
             },
           ], 'output')
          .save(info.vid_path);
}
