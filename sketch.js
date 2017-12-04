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
  // leapController = new Leap.Controller({
  //   enableGestures: true
  // });

  // every time the Leap provides us with hand data we will ask it to run this function
  //leapController.loop(handleHandData);

  // create a plane to serve as our "ground"
  var g = new Plane({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    red:125,
    green:125,
    blue:125,
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
 // world.appendChild(g);
  world.add(hand1);
  world.add(hand2);
  // add the hands to our camera - this will force it to always show up on the user's display
  // world.camera.holder.appendChild(hand1.tag);
  // world.camera.holder.appendChild(hand2.tag);
}
