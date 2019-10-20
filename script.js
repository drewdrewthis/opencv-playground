window.addEventListener("load", function () {
  console.log('Your document is ready!');

  var utils = new Utils("errorMessage");

  utils.printError('Loaded!');

  // Get input
  let video = document.getElementById("videoInput"); // video is the id of video tag
  navigator.mediaDevices.getUserMedia({ video: true, audio: false, facingMode: { exact: 'environment' } })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred! " + err);
    });

  // Get output dest
  let output = document.getElementById("canvasOutput"); // canvasOutput is the id of <canvas>

  // Load and set template image
  utils.loadImageToCanvas('assets/ar-card-small.jpg', 'templateCanvasInput');

  let templateCanvas = document.getElementById('templateCanvasInput');
  let templateCtx = templateCanvas.getContext("2d");
  let templateImageData = templateCtx.getImageData(
    0,
    0,
    templateCanvas.width,
    templateCanvas.height
  );
});