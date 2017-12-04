// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;

// our output div (see the HTML file);
var outputDiv;

function setup() {
  createCanvas(500,500);
  
  // grab a connection to our output div
  outputDiv = select('#output');

  // set up our leap controller
  leapController = new Leap.Controller({
    enableGestures: true
  });

  // every time the Leap provides us with hand data we will ask it to run this function
  leapController.loop( handleHandData );
}

function draw() {
  background(0);
  fill(255);
  ellipse(characterX,characterY, 25,25);

}
var characterX=250;
var characterY=250;

// this function runs every time the leap provides us with hand tracking data
// it is passed a 'frame' object as an argument - we will dig into this object
// and what it contains throughout these tutorials
function handleHandData(frame) {
  if (frame.hands.length == 1){
    console.log("I see a hand");
    //frame of data, get the first hand's palm position,
    //theres 3 values, x, y, and z
    var position = frame.hands[0].stabilizedPalmPosition;
    var x = position[0];
    var y = position[1];
    characterX = map(x,-200,200, 0,500); //values themselves are just like trial and error
                  //actual values, desired values
    characterY = map(y,100,500, height,0); //height is constant of canvas 
  }
  //leap has own draw function too
  // dump all the info we know about this frame to an HTML element
  //outputDiv.html(frame.dump());
}