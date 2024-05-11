// set most globals here
let rotation, speed, dotNum, xScale, yScale, orbit, dotRadius, loaded, autoOrbitRun, autoXScaleRun, autoYScaleRun, orbitMod, xScaleMod, yScaleMod, held, funcCallDelay;

let centerX = innerWidth / 2;
let centerY = innerHeight / 2;

// this function resets the entire animation back to defaults every time its run
function reset() {
  rotation = 0;
  speed = 0.004;
  dotNum = 0;
  xScale = 0.8;
  yScale = 0.333;
  orbit = Math.min(innerWidth, innerHeight) / 2;
  dotRadius = Math.round(orbit/ 150);
  loaded = 0;
  autoOrbitRun = 0;
  autoXScaleRun = 0;
  autoYScaleRun = 0;
  orbitMod = 1;
  xScaleMod = 1;
  yScaleMod = 1;
  held = false;
  funcCallDelay = Date.now();
}

// and since we're on the topic, run it now
reset();

// references to canvas and context
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// keeps the animation centered within the window
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  centerX = innerWidth / 2;
  centerY = innerHeight / 2;
});

// set up the easy button listeners
let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', reset);

// collecting all the info items here, as well as their functionality
let settingInfo = document.getElementById('settingInfo');
let settingInfoName = document.getElementById('settingName');
let settingInfoValue = document.getElementById('settingValue');

function setInfoData(valName, valData) {
  // resetting CSS animations is pretty difficult, but this is a quick and dirty (and also sure-fire) way to do it
  let tempSetting = settingInfo;
  settingInfo.remove();
  document.body.appendChild(settingInfo);
  settingInfoName.textContent = valName;
  settingInfoValue.textContent = valData;
}

// listeners for hold activity on buttons
window.addEventListener('mousedown', handleHoldStart);
window.addEventListener('mouseup', handleHoldStop);
window.addEventListener('touchstart', handleHoldStart, {passive: false});
window.addEventListener('touchend', handleHoldStop, {passive: false});

// the big hold start function
function handleHoldStart(e) {
  e.preventDefault();
  // set held to true when this is called, and set the function call delay to right now
  held = true;
  funcCallDelay = Date.now();

  // if a button is the target, add the active class
  if (e.target.tagName = 'BUTTON') {
    e.target.classList.add('active');
  }

  // delegate calls by button ID, calling the runFunctionContinuously function for these
  switch (e.target.id) {
    case 'reset':
      setInfoData('Status', 'Resetting');
      reset();
    break;
    case 'orbitSizeUp':
      runFunctionContinuously(changeOrbitSize, 5);
    break;
    case 'orbitSizeDown':
      runFunctionContinuously(changeOrbitSize, -5);
    break;
    case 'orbitSpeedUp':
      runFunctionContinuously(changeOrbitSpeed, 0.0002);
    break;
    case 'orbitSpeedDown':
      runFunctionContinuously(changeOrbitSpeed, -0.0002);
    break;
    case 'dotNumberUp':
      runFunctionContinuously(changeDotNumber, 1);
    break;
    case 'dotNumberDown':
      runFunctionContinuously(changeDotNumber, -1);
    break;
    case 'dotSizeUp':
      runFunctionContinuously(changeDotSize, 0.5);
    break;
    case 'dotSizeDown':
      runFunctionContinuously(changeDotSize, -0.5);
    break;
    case 'xAxisScaleUp':
      runFunctionContinuously(changeXAxisScale, 0.01);
    break;
    case 'xAxisScaleDown':
      runFunctionContinuously(changeXAxisScale, -0.01);
    break;
    case 'yAxisScaleUp':
      runFunctionContinuously(changeYAxisScale, 0.01);
    break;
    case 'yAxisScaleDown':
      runFunctionContinuously(changeYAxisScale, -0.01);
    break;
  }
}

// keydown event handler, which delegates calls much like the button switch statement
window.onkeydown = function(event) {
  let code = event.key;
  switch (code) {
    case ' ':
      setInfoData('Status', 'Resetting');
      reset();
      break;
    case 'ArrowRight':
      changeDotNumber(1);
      break;
    case 'ArrowUp':
      changeOrbitSize(5);
      break;
    case 'ArrowLeft':
      changeDotNumber(-1);
      break;
    case 'ArrowDown':
      changeOrbitSize(-5);
      break;
    case 'w':
    case 'W':
      changeOrbitSpeed(0.001);
      break;
    case 's':
    case 'S':
      changeOrbitSpeed(-0.001);
      break;
    case 'e':
    case 'E':
      changeXAxisScale(0.01)
      break;
    case 'd':
    case 'D':
      changeXAxisScale(-0.01)
      break;
    case 'r':
    case 'R':
      changeYAxisScale(0.01)
      break;
    case 'f':
    case 'F':
      changeYAxisScale(-0.01)
      break;
    case 'q':
    case 'Q':
      changeDotSize(0.5);
      break;
    case 'a':
    case 'A':
      changeDotSize(-0.5);
      break;
    case 'x':
    case 'X':      
      if (autoXScaleRun === 0) {
        autoXScaleRun = 1;
      } else {
        autoXScaleRun = 0;
      }
      break;
    case 'y':
    case 'Y': 
      if (autoYScaleRun === 0) {
        autoYScaleRun = 1;
      } else {
        autoYScaleRun = 0;
      }
      break;
  }
};

// on release of touch or mouse, remove the active button's class, reset function call delay, and set held to false to prep for another hold
function handleHoldStop(e) {
  document.getElementsByClassName('active')[0].classList.remove('active');
  funcCallDelay = Date.now();
  held = false;
}

// this function utilizes requestAnimationFrame to handle much of its timing, but also caps the max calls per second to 60
function runFunctionContinuously(func, arg) {
  if (!held) { return; }
  let now = Date.now();
  if (now - funcCallDelay < 16 && held) {
    window.requestAnimationFrame(()=>{
      runFunctionContinuously(func, arg);
      return;
    });
  } else {
    funcCallDelay = now;
    func(arg);
    window.requestAnimationFrame(()=>{
      runFunctionContinuously(func, arg);
      return;
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//    The majority of these methods do exactly as they say. Bounds are enforced in each case.    //
///////////////////////////////////////////////////////////////////////////////////////////////////
function changeOrbitSize(change) {
  if (orbit + change < 5) {
    orbit  = 5;
  } else if (orbit + change > Math.max(innerWidth, innerHeight)) {
    orbit = Math.max(innerWidth, innerHeight);
  } else {
    orbit += change;
  }
  setInfoData('Orbit Size', orbit);
}

function changeOrbitSpeed(change) {
  if (speed + change < -0.05) {
    speed = -0.05;
  } else if (speed + change > 0.05) {
    speed = 0.05;
  } else {
    speed += change
    speed = Math.round(speed * 10000) / 10000;
  }
  setInfoData('Orbit Speed', speed);
}

function changeDotNumber(change) {
  if (dotNum + change <= 1) {
    dotNum = 1;
  } else if (dotNum + change > 100) {
    dotNum = 100;
  } else {
    dotNum += change;
    dotNum = Math.round(dotNum)
  }
  setInfoData('Number of Dots', dotNum * 4);
}

function changeXAxisScale(change) {
  if (xScale + change < 0) {
    xScale = 0;
  } else if (xScale + change > 1) {
    xScale = 1;
  } else {
    xScale += change;
    xScale = Math.round(xScale * 100) / 100;
  }
  setInfoData('X-Axis Scale', xScale);
}

function changeYAxisScale(change) {
  if (yScale + change < 0) {
    yScale = 0;
  } else if (yScale + change > 1) {
    yScale = 1;
  } else {
    yScale += change;
    yScale = Math.round(yScale * 100) / 100;
  }
  setInfoData('Y-Axis Scale', yScale);
}

function changeDotSize(change) {
  if (dotRadius + change < 0.5) {
    dotRadius = 0.5;
  } else if (dotRadius + change > 30) {
    dotRadius = 30;
  } else {
    dotRadius += change;
  }
  setInfoData('Dot Size', dotRadius + 'px');
}

function init() {
  if (dotNum < 30 && loaded === 0) {
    dotNum += 0.2;
  } else {
    dotNum = Math.round(dotNum);
    loaded = 1;
  }
}

function updateRotation() {
  if (rotation + speed >= 2) {
    rotation = 0;
  } else {
    rotation += speed;
  }
}

function autoXScale() {
  let scaleMod = xScaleMod * 0.006;
  if (xScale + scaleMod >= 1 || xScale + scaleMod <= -1) {
    xScaleMod *= -1;
  } else {
    xScale += scaleMod;
  }
}

function autoYScale() {
  let scaleMod = yScaleMod * 0.006;
  if (yScale + scaleMod >= 1 || yScale + scaleMod <= -1) {
    yScaleMod *= -1;
  } else {
    yScale += scaleMod;
  }
}

// the function handling the positioning of each dot in the pattern
function drawDot(n) {
  let thisAngle = Math.PI * (((n * 2) / dotNum) + rotation);
  // the larger horizontal ellipse
  ctx.beginPath();
  ctx.arc(centerX + Math.cos(thisAngle) * -1 * orbit * xScale,
    centerY + Math.sin(thisAngle) * orbit * yScale,
    dotRadius, 0, Math.PI * 2, true);
  ctx.fill();

  // the larger vertical ellipse
  ctx.beginPath();
  ctx.arc(centerX + Math.cos(thisAngle) * orbit * yScale,
    centerY + Math.sin(thisAngle) * orbit * xScale,
    dotRadius, 0, Math.PI * 2, true);
  ctx.fill();

  // the larger outer circle
  ctx.beginPath();
  ctx.arc(centerX + Math.cos(thisAngle) * -1 * orbit * xScale * 0.667,
    centerY + Math.sin(thisAngle) * orbit * xScale * 0.667,
    dotRadius, 0, Math.PI * 2, true);
  ctx.fill();

  // the smaller inner circle
  ctx.beginPath();
  ctx.arc(centerX + Math.cos(thisAngle) * orbit * yScale * 0.667,
    centerY + Math.sin(thisAngle) * orbit * yScale * 0.667,
    dotRadius, 0, Math.PI * 2, true);
  ctx.fill();
}

// this gradient becomes the fill for every dot, but it only needs defining once, outside the main animation function
let orbitGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight);
orbitGrad.addColorStop(0, 'hsl(0, 100%, 80%)');
orbitGrad.addColorStop(0.1, 'hsl(90, 100%, 80%)');
orbitGrad.addColorStop(0.2, 'hsl(180, 100%, 80%)');
orbitGrad.addColorStop(0.3, 'hsl(270, 100%, 80%)');
orbitGrad.addColorStop(0.4, 'hsl(360, 100%, 80%)');
orbitGrad.addColorStop(0.5, 'hsl(90, 100%, 80%)');
orbitGrad.addColorStop(0.6, 'hsl(180, 100%, 80%)');
orbitGrad.addColorStop(0.7, 'hsl(270, 100%, 80%)');
orbitGrad.addColorStop(0.8, 'hsl(360, 100%, 80%)');
orbitGrad.addColorStop(0.9, 'hsl(180, 100%, 80%)');
orbitGrad.addColorStop(1, 'hsl(0, 100%, 80%)');

// lock to 60fps

let currentTime = Date.now();

function draw() {
  let frameTime = Date.now();
  if (frameTime - currentTime < 16) {
    window.requestAnimationFrame(draw);
    return;
  }

  currentTime = frameTime;
  
  init();
  ctx.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = orbitGrad;
  for (let i = 0; i < dotNum; i++) {
    drawDot(i);
  }
  updateRotation();
  if (autoOrbitRun) {
    autoOrbit();
  }
  if (autoXScaleRun) {
    autoXScale();
  }
  if (autoYScaleRun) {
    autoYScale();
  }
  window.requestAnimationFrame(draw);
}

draw();