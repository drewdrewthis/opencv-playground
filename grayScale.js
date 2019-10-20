if (!window.ImageProcessors) {
  window.ImageProcessors = {};
}

function GrayScale(input, output) {
  // PUT TO CANVAS
  let context = output.getContext("2d");
  let src = new cv.Mat(input.height, input.width, cv.CV_8UC4);
  let dst = new cv.Mat(input.height, input.width, cv.CV_8UC1);
  const FPS = 30;

  function processVideo() {
    const width = output.width;
    const height = output.height;
    let begin = Date.now();
    context.drawImage(input, 0, 0, width, height);
    src.data.set(context.getImageData(0, 0, width, height).data);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
    // schedule next one.
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }

  // schedule first one.
  setTimeout(processVideo, 0);
}

window.ImageProcessors.GrayScale = GrayScale;