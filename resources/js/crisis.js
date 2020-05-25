$("#showToast").click(function() {
  stopWheel();
});

$('.message .close').on('click', function() {
  $(this)
    .closest('.message')
    .transition('fade')
  ;
});

$('.testBtn').on('click', function() {
  $('.message').transition('fade down')
  setTimeout(function(){ $('.message').transition('fade down') }, 12000)
});

// TODO: Probably all of this on page load
var numSegments = 12
var segments = []

var fillStyles = ['#C0C0C0', '#E6E6FA', '#FFFACD', '#7FFFD4', '#FF8C00', '#FFDAB9', '#8FBC8F', '#B22222', '#BC8F8F', '#4169E1', '#DA70D6', '#C71585'];

for (i = 0; i < numSegments; i++) {
  segments.push({
    'fillStyle': shuffleFillStyle(),
    'hiddenText': shuffleHiddenTexts(),
    'text': '???'
  });
}

function shuffleFillStyle() {
  fillStyles.sort(() => Math.random() - 0.5);
  return fillStyles.pop();
}

function shuffleHiddenTexts() {
  hiddenTexts.sort(() => Math.random() - 0.5);
  return hiddenTexts.pop();
}

// Create new wheel object specifying the parameters at creation time.
var theWheel = new Winwheel({
  'numSegments': numSegments, // Specify number of segments.
  'outerRadius': 240, // Set outer radius so wheel fits inside the background.
  'textFontSize': 28, // Set font size as desired.
  'responsive': true, // This wheel is responsive!
  'lineWidth': 2,
  'strokeStyle': 'white',
  'segments': segments, // Define segments including colour and text.
  'animation': {
    'type': 'spinOngoing', // Don't stop until we hit the stop button.
    'duration': 5,
    'spins': 40, // Go really fast to obfuscate bad animation changes.
    'callbackFinished': alertPrize
  }
});

// Vars used by the code in this page to do power controls.
var wheelSpinning = false;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
// Called by the onClick of the canvas, starts the spinning.
function startSpin() {
  // Short-circuit if you haven't reset the timer.
  if (wheelSpinning) {
    return
  }

  $("#showToast").prop('disabled', false);

  // Stop any current animation.
  theWheel.stopAnimation(false);

  wheelSpinning = true;

  resetWheelRotation();

  // Start animation.
  theWheel.startAnimation();
}

// Reset the rotation angle to less than or equal to 360 so spinning again works as expected.
// Setting to modulus (%) 360 keeps the current position.
function resetWheelRotation() {
  theWheel.rotationAngle = theWheel.rotationAngle % 360;
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize() {
  resetWheelRotation();

  // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
  theWheel.animation.type = 'spinToStop';
  theWheel.animation.easing = 'Power4.easeOut';
  theWheel.animation.duration = 5;
  theWheel.animation.spins = 4;
  theWheel.animation.stopAngle = null;
  theWheel.animation.repeat = 0;
  theWheel.animation.callbackFinished = displayToast;
  theWheel.startAnimation();
}

// Displays a toast message with the hidden text from the segment the wheel landed on.
function displayToast(landedSegment) {
  $('#toast-text').text(landedSegment.hiddenText);
  $('.toast').toast('show')
  resetAnimationValues()
  setTimeout(startTimer, 400);
}

// TODO: Probably better to have this be an initialize function so the values don't have to be duplicated.
function resetAnimationValues() {
  resetWheelRotation();

  // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
  theWheel.animation.type = 'spinOngoing';
  theWheel.animation.easing = 'Linear.easeNone';
  theWheel.animation.duration = 5 - Math.random();
  theWheel.animation.spins = 40 - (5 * Math.random());
  theWheel.animation.stopAngle = null;
  theWheel.animation.repeat = -1;
  theWheel.animation.callbackFinished = alertPrize;

  wheelSpinning = false;
}

// -------------------------------------------------------
// Timer
// -------------------------------------------------------
var startTime = 300
var currentTime = 0
var timer
var timerSpeed = 100 // .1 sec

// TODO: on page load
resetTimer()

// TODO: Probably give everything here an id
$('input[value="Stop"]').on('click', stopTimer)
$('input[value="Reset"]').on('click', resetTimer)
$('input[value="Stop Wheel"]').on('click', stopWheel)
document.getElementById("loadWheelBtn").addEventListener("change", handleWheelFileChange, false);

function handleWheelFileChange(){
  alert('loadWheel called');

  // Hide hamburger menu
  neatFunc();
}

function stopWheel() {
  // Short-circuit if you haven't reset the timer.
  if (!wheelSpinning) {
    return
  }
  $("#showToast").prop('disabled', true);
  theWheel.stopAnimation();
}

function resetTimer() {
  stopTimer()
  currentTime = startTime
  $('#timer').html(currentTime / 10 + " seconds")
  $('#timer').css('color', 'white');
}

function startTimer() {
  $("#stopTimer").prop('disabled', false);
  if (currentTime <= 0) {
    resetTimer()
    startTimer()
  } else {
    timer = setInterval(timerTick, timerSpeed);
  }
}

function stopTimer() {
  $("#stopTimer").prop('disabled', true);
  clearInterval(timer)
}

function timerTick() {
  currentTime--
  $('#timer').html(currentTime / 10 + " seconds")
  if (currentTime < 170) {
    $('#timer').css('color', '#FFA500');
  }
  if (currentTime < 90) {
    $('#timer').css('color', 'red');
  }
  if (currentTime == 0) {
    stopTimer()
  }
}

// -------------------------------------------------------
// Editable Table
// -------------------------------------------------------
var table = document.getElementById("points-table");
table.addEventListener('click', function(e) {
  var target = e.target;
  //test if clicked element is TD.
  if (target && target.tagName && target.tagName.toLowerCase() == "td") {
    //make cell editable
    target.setAttribute('contenteditable', 'true');
    //on blur close the editable field and return to normal cell.
    target.onblur = function() {
      this.setAttribute('contenteditable');
    }
  }
});
