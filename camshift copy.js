
if (!window.ImageProcessors) {
  window.ImageProcessors = {};
}

function getRoiHist(roi) {
  let hsvRoi = new cv.Mat();
  cv.cvtColor(roi, hsvRoi, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsvRoi, hsvRoi, cv.COLOR_RGB2HSV);

  // let mask = new cv.Mat();
  // let lowScalar = new cv.Scalar(30, 30, 0);
  // let highScalar = new cv.Scalar(180, 180, 180);
  // let low = new cv.Mat(hsvRoi.rows, hsvRoi.cols, hsvRoi.type(), lowScalar);
  // let high = new cv.Mat(hsvRoi.rows, hsvRoi.cols, hsvRoi.type(), highScalar);
  // cv.inRange(hsvRoi, low, high, mask);
  // let roiHist = new cv.Mat();
  // let hsvRoiVec = new cv.MatVector();
  // hsvRoiVec.push_back(hsvRoi);
  // cv.calcHist(hsvRoiVec, [0], mask, roiHist, [180], [0, 180]);
  // cv.normalize(roiHist, roiHist, 0, 255, cv.NORM_MINMAX);

  return hsvRoi
}

window.ImageProcessors.CamShift = function camShift(video, outputCanvas) {
  const utils = new Utils("errorMessage");

  let streaming = true;

  let templateCanvas = document.getElementById('templateCanvasInput');
  let templateCtx = templateCanvas.getContext("2d");
  // Super-impose template on camera
  let seedCanvas = document.getElementById('seedCanvas');
  let seedContext = seedCanvas.getContext("2d");
  let templateImageData = templateCtx.getImageData(
    0,
    0,
    templateCanvas.width,
    templateCanvas.height
  );

  const imposedTemplate = {
    x: templateCanvas.width / 2,
    y: templateCanvas.height / 2,
    width: templateCanvas.width / 2,
    height: templateCanvas.height / 2,
  }

  let seedMat = new cv.Mat(seedCanvas.height, seedCanvas.width, cv.CV_8UC4);

  // // hardcode the initial location of window
  // let trackWindow = new cv.Rect(...Object.values(imposedTemplate));

  let cap = new cv.VideoCapture(video);

  // take first frame of the video
  let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  cap.read(frame);

  // hardcode the initial location of window
  let trackWindow = new cv.Rect(150, 60, 63, 125);

  // set up the ROI for tracking
  let roi = frame.roi(trackWindow);

  let hsvRoi = new cv.Mat();
  cv.cvtColor(roi, hsvRoi, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsvRoi, hsvRoi, cv.COLOR_RGB2HSV);
  let mask = new cv.Mat();
  let lowScalar = new cv.Scalar(30, 30, 0);
  let highScalar = new cv.Scalar(180, 180, 180);
  let low = new cv.Mat(hsvRoi.rows, hsvRoi.cols, hsvRoi.type(), lowScalar);
  let high = new cv.Mat(hsvRoi.rows, hsvRoi.cols, hsvRoi.type(), highScalar);
  cv.inRange(hsvRoi, low, high, mask);
  let roiHist = new cv.Mat();
  let hsvRoiVec = new cv.MatVector();
  hsvRoiVec.push_back(hsvRoi);
  cv.calcHist(hsvRoiVec, [0], mask, roiHist, [180], [0, 180]);
  cv.normalize(roiHist, roiHist, 0, 255, cv.NORM_MINMAX);

  // delete useless mats.
  roi.delete(); hsvRoi.delete(); mask.delete(); low.delete(); high.delete(); hsvRoiVec.delete();

  // Setup the termination criteria, either 10 iteration or move by atleast 1 pt
  let termCrit = new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 1);

  let hsv = new cv.Mat(video.height, video.width, cv.CV_8UC3);
  let hsvVec = new cv.MatVector();
  hsvVec.push_back(hsv);
  let dst = new cv.Mat();
  let trackBox = null;

  const FPS = 30;
  function processVideo() {
    try {
      cv.imshow('seedCanvas', frame);

      seedContext.drawImage(
        templateCanvas,
        ...Object.values(imposedTemplate)
      )

      let begin = Date.now();

      // start processing.
      cap.read(frame);
      cv.cvtColor(frame, hsv, cv.COLOR_RGBA2RGB);
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
      cv.calcBackProject(hsvVec, [0], roiHist, dst, [0, 180], 1);

      // apply camshift to get the new location
      [trackBox, trackWindow] = cv.CamShift(dst, trackWindow, termCrit);

      // Draw it on image
      let pts = cv.rotatedRectPoints(trackBox);
      cv.line(frame, pts[0], pts[1], [255, 0, 0, 255], 3);
      cv.line(frame, pts[1], pts[2], [255, 0, 0, 255], 3);
      cv.line(frame, pts[2], pts[3], [255, 0, 0, 255], 3);
      cv.line(frame, pts[3], pts[0], [255, 0, 0, 255], 3);
      cv.imshow('canvasOutput', frame);

      // schedule the next one.
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    } catch (err) {
      // console.log(err)
      utils.printError(err);
    }
  };

  // schedule the first one.
  setTimeout(processVideo, 0);
}