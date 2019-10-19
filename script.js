document.addEventListener("DOMContentLoaded", function () {
  console.log('Your document is ready!');

  utils.loadImageToCanvas('assets/ar-card-small.jpg', 'dstCanvasInput');

  (function openCvReady() {
    cv['onRuntimeInitialized'] = () => {
      // https://docs.opencv.org/master/dd/d00/tutorial_js_video_display.html

      // GET VIDEO
      let video = document.getElementById("videoInput"); // video is the id of video tag
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
        })
        .catch(function (err) {
          console.log("An error occurred! " + err);
        });

      // // PUT TO CANVAS
      // let canvasFrame = document.getElementById("canvasOutput"); // canvasOutput is the id of <canvas>
      // let context = canvasFrame.getContext("2d");
      // let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      // let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      // const FPS = 30;

      // function processVideo() {
      //   const width = canvasFrame.width;
      //   const height = canvasFrame.height;
      //   let begin = Date.now();
      //   context.drawImage(video, 0, 0, width, height);
      //   src.data.set(context.getImageData(0, 0, width, height).data);
      //   cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      //   cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
      //   // schedule next one.
      //   let delay = 1000 / FPS - (Date.now() - begin);
      //   setTimeout(processVideo, delay);
      // }

      // // schedule first one.
      // setTimeout(processVideo, 0);

      camShift(dst);
    };
  })();
});