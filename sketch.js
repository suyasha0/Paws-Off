// variable to hold a reference to our A-Frame world
var world;

// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;

// our hand displays (simple shapes that will show up in front of the user)
var hand1, hand2;

function setup() {
  // no canvas needed
  noCanvas();

  // construct the A-Frame world
  // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
  world = new World('VRScene');

  // set up our leap controller
  leapController = new Leap.Controller({
    enableGestures: true
  });

  // every time the Leap provides us with hand data we will ask it to run this function
  leapController.loop(handleHandData);

  // create a plane to serve as our "ground"
  var g = new Plane({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    // red:125,
    // green:125,
    // blue:125,
    asset: 'stone',
    repeatX: 100,
    repeatY: 100,
    rotationX: -90,
    metalness: 0.25
  });

  // add the plane to our world
  world.add(g);

  // now add our hands to the world
  hand1 = new Box({
    x: -0.5,
    y: 0,
    z: -1,
    width: 0.1,
    height: 0.1,
    depth: 0.1,
    red: 255,
    green: 0,
    blue: 0
  });
  hand2 = new Box({
    x: 0.5,
    y: 0,
    z: -1,
    width: 0.1,
    height: 0.1,
    depth: 0.1,
    red: 0,
    green: 255,
    blue: 0
  });
  // add the hands to our camera - this will force it to always show up on the user's display
  world.camera.holder.appendChild(hand1.tag);
  world.camera.holder.appendChild(hand2.tag);
}
function draw() {
  // always move the player forward a little bit - their movement vector
  // is determined based on what they are looking at
  world.moveUserForward(0.05);
}

function handleHandData(frame) {
  
    // make sure we have exactly one hand being detected
    if (frame.hands.length == 2) {
      // get the position of the two hands
      var handPosition1 = frame.hands[0].stabilizedPalmPosition;
      var handPosition2 = frame.hands[1].stabilizedPalmPosition;
  
      // grab the x, y & z components of the hand position
      // these numbers are measured in millimeters
      var hx1 = handPosition1[0];
      var hy1 = handPosition1[1];
      var hz1 = handPosition1[2];
  
      // grab the x, y & z components of the hand position
      // these numbers are measured in millimeters
      var hx2 = handPosition2[0];
      var hy2 = handPosition2[1];
      var hz2 = handPosition2[2];
  
      // swap them so that handPosition1 is the hand on the left
      if (hx1 > hx2) {
        hx1 = handPosition2[0];
        hy1 = handPosition2[1];
        hz1 = handPosition2[2];
  
        hx2 = handPosition1[0];
        hy2 = handPosition1[1];
        hz2 = handPosition1[2];
      }
  
      console.log(hx1 + "," + hy1 + " - " + hx2 + ", " + hy2);
  
      // x is left-right, y is up-down, z is forward-back
      // for this example we will use x & y to move the circle around the screen
      // let's map the x & y values to screen coordinates
      // note that determining the correct values for your application takes some trial and error!
      var x1 = map(hx1, -200, 200, -1, 0);
      var y1 = map(hy1, 0, 500, -1, 1);
  
      var x2 = map(hx2, -200, 200, 0, 1);
      var y2 = map(hy2, 0, 500, -1, 1);
  
      // OK, now we have two hands ... let's use this information to draw a visual representation
      // on the screen for the user
  
      // now move the hands
      hand1.setX( x1 );
      hand1.setY( y1 );
      hand2.setX( x2 );
      hand2.setY( y2 );
  
      if (y1 < y2) {
        var diff = y2 - y1;
        world.camera.nudgePosition( map(diff, 0, 1, 0, -0.1), 0, 0);
      }
      else {
        var diff = y1 - y2;
        world.camera.nudgePosition( map(diff, 0, 1, 0, 0.1), 0, 0);
      }
    }
  }