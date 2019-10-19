function makeBackProj(src, dst) {
  let src = cv.imread('srcCanvasInput');
  let dst = cv.imread('dstCanvasInput');
  cv.cvtColor(src, src, cv.COLOR_RGB2HSV, 0);
  cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV, 0);
  let srcVec = new cv.MatVector();
  let dstVec = new cv.MatVector();
  srcVec.push_back(src); dstVec.push_back(dst);
  let backproj = new cv.Mat();
  let none = new cv.Mat();
  let mask = new cv.Mat();
  let hist = new cv.Mat();
  let channels = [0];
  let histSize = [50];
  let ranges = [0, 180];
  let accumulate = false;
  cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
  cv.normalize(hist, hist, 0, 255, cv.NORM_MINMAX, -1, none);
  cv.calcBackProject(dstVec, channels, hist, backproj, ranges, 1);
  cv.imshow('canvasOutput', backproj);
  src.delete(); dst.delete(); srcVec.delete(); dstVec.delete();
  backproj.delete(); mask.delete(); hist.delete(); none.delete();
}