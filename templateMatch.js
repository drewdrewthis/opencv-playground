// https://docs.opencv.org/3.4/d8/dd1/tutorial_js_template_matching.html

if (!window.ImageProcessors) {
  window.ImageProcessors = {};
}

function TemplateMatch(input, templ, output) {
  let inputCanvas = document.getElementById("canvasOutput"); // canvasOutput is the id of <canvas>
  // let src = cv.imread('canvasOutput');
  let src = new cv.Mat(input.height, input.width, cv.CV_8UC4);
  const FPS = 30;

  function processVideo() {
    const width = output.width;
    const height = output.height;
    let begin = Date.now();

    let context = inputCanvas.getContext("2d");
    context.drawImage(input, 0, 0, width, height);
    let src = cv.imread('canvasOutput');

    cv.imshow('imageCanvasOutput', src);

    let templ = cv.imread('templateCanvasInput');
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF, mask);
    let result = cv.minMaxLoc(dst, mask);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
    cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
    cv.imshow('canvasOutput', src);
    src.delete(); dst.delete(); mask.delete();

    // // schedule next one.
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }

  // schedule first one.
  setTimeout(processVideo, 0);
}

window.ImageProcessors.TemplateMatch = TemplateMatch;