
var world, startPlane;

// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;
// our hand displays (simple shapes that will show up in front of the user)
var hand1, hand2;
//global ground to move in draw
var g;
//lightning
var lightningBolt;
//pokeball array
var pokeballs = [];

// 0 : startscreen, 1 : play, -1 : endscreen
var gameMode = 0;

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
  g = new Plane({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 1000,
    asset: 'grass',
    repeatX: 100, //width
    repeatY: 1000, //length of plane ground
    rotationX: -90,
    metalness: 0.25
  });
 // add the plane to our world
  world.add(g);

  startPlane = new Plane({
    x: 0,
    y: 3,
    z: -3,
    width: 15,
    height: 15,
    asset: 'startscreen'
  })
 // world.add(startPlane);

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

  pokeball = new OBJ({
	asset: 'ball_obj',
	mtl: 'ball_mtl',
	x: 5,
	y: 1.3,
	z: 0,
	rotationX:0,
	rotationY:180,
	scaleX:.3,
	scaleY:.3,
	scaleZ:.3,
  });

  world.add(pokeball);

  // for (var i = 0;i<100;i++){
  lightningBolt = new OBJ({
    asset: 'lightningBolt_obj',
    mtl: 'lightningBolt_mtl',
    x: i0
    y: 4,
    z: 0,
    rotationX:-90,
    rotationY:0,
    scaleX:.05,
    scaleY:.05,
    scaleZ:.05,
  });
  world.add(lightningBolt);
  // }

  // add the hands to our camera - this will force it to always show up on the user's display
  world.camera.holder.appendChild(hand1.tag);
  world.camera.holder.appendChild(hand2.tag);


}
function draw() {

  if(gameMode==0){
  	startScreen();
  }     
  else if(gameMode==1){
  	play();
  }
  else{
  	endScreen();
  }

  var pos = world.getUserPosition();
  
    // now evaluate
    if (pos.x > 47) { //width of plane, looks good when comes to edge
      world.setUserPosition(47, pos.y, pos.z);
    } else if (pos.x < -47) {
      world.setUserPosition(-47, pos.y, pos.z);
    }
    //have above just blcok u from going off side 

    if (pos.z > 500) { //if it goes past the length
      world.setUserPosition(pos.x, pos.y, -500);
    } else if (pos.z < -500) {
      world.setUserPosition(pos.x, pos.y, 500);
    }

}

function startScreen(){
	hand1.hide();
	hand2.hide();
}

function play(){

	//make ground move forward
    //g.setZ(g.getZ()+.05);       **commenting this because im getting dizzy testing.

    var create = random(100);
	if(create<6){
	 	var temp = new Pokeball(random(-10,10), 1, -5);
	 	pokeballs.push( temp );
	}

	for (var i = 0; i < pokeballs.length; i++) {
		var result = pokeballs[i].move();
		if (result == "gone") {
			pokeballs.splice(i, 1);
			i-=1;
		}
	}

	console.log(world.getUserPosition());

}

function endScreen(){
	hand1.hide();
	hand2.hide();
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

    if(frame.valid && frame.gestures.length > 0 && gameMode==0){
      frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "swipe":

         	  world.remove(startPlane);
         	  hand1.show();
			  hand2.show();

              gameMode=1;
              break;
        }
      });
    }
  }

  function Pokeball(x,y,z) {

	this.pokeball = new OBJ({
		asset: 'ball_obj',
		mtl: 'ball_mtl',
		x:x, y:y, z:z,
		rotationX:0,
		rotationY:90,
		scaleX:.3,
		scaleY:.3,
		scaleZ:.3,
	});

	world.add(this.pokeball);

	this.move = function(){
		this.pokeball.nudge(0, 0, .15);

		if(y<0){
			world.remove(this.pokeball);
			return "gone";
		}
	}

}