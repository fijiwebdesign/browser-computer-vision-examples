// https://gammacv.com
function captureToCanvas(canvas) {
  const width = canvas.offsetWidth;
  const heigth = canvas.offsetHeight;
  // initialize WebRTC stream and session for runing operations on GPU
  const stream = new gm.CaptureVideo(width, heigth);
  const sess = new gm.Session();
  const canvasProcessed = gm.canvasCreate(width, heigth);

  // session uses a context for optimize calculations and prevent recalculations
  // context actually a number which help algorythm to run operation efficiently  
  let context = 0;
  // allocate memeory for storing a frame and calculations output
  const input = new gm.Tensor('uint8', [heigth, width, 4]);
  // construct operation grap which is actially a Canny Edge Detector
  let pipeline = input

  pipeline = gm.grayscale(pipeline);
  pipeline = gm.gaussianBlur(pipeline, 3, 3);
  pipeline = gm.sobelOperator(pipeline);
  pipeline = gm.cannyEdges(pipeline, 0.25, 0.75);

  // initialize graph
  sess.init(pipeline);

  // allocate output
  const output = gm.tensorFrom(pipeline);

  // create loop
  const tick = () => {
    requestAnimationFrame(tick);
    // Read current in to the tensor
    stream.getImageBuffer(input);

    // finaly run operation on GPU and then write result in to output tensor
    sess.runOp(pipeline, context, output);

    // draw result into canvas
    gm.canvasFromTensor(canvasProcessed, output);

    // if we would like to be graph recalculated we need 
    // to change the context for next frame
    context += 1;
  }

  // start capturing a camera and run loop
  stream.start();
  tick();

  canvas.appendChild(canvasProcessed);
}
