var world, startPlane;
// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;
// our hand displays (simple shapes that will show up in front of the user)
var hand1, hand2;
var x1; var y1; var x2; var y2;

var health = 5; //TEST
var losePlane;var winPlane; var loseScreen;
var gameLost = true;
var gameWon = true;
var grassHeight = 200;
var mewtwo;

//global ground to move in draw
var g;
//lightning
var lightningContainer, fireContainer; 
var lightnings =[];
var fires =[];
var ices = [];
var framectr =0;
var zRot = true;
var z =0;var y=0;
var fx =1; var fy =0.5; var fz =3.5;
var lx =0; var ly =0.5; var lz =2;
var ix =-1; var iy =0.5; var iz =4.5;
var startSwipe = false;
var projectile =0;

var lightningBolt, fire;
//pokeball array
var pokeballs = [];
var pokeball;
// 0 : startscreen, 1 : play, -1 : endscreen
var gameMode = 0;

// function preload(){
// 	music = loadSound("./sounds/easy.mp3");
// 	shootSound = loadSound("./sounds/blip.mp3");
// 	hitSound = loadSound("./sounds/fail.mp3");
// }

function setup() {
  // no canvas needed
  noCanvas();
  noiseDetail(24);
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
  hand1 = new OBJ({
    asset: 'paw_obj',
    mtl: 'paw_mtl',
    x: -0.4,
    y: -0,
    z: -0.5,
    rotationX:-90,
    scaleX:.05,
    scaleY:.05,
    scaleZ:.05,
   });
  
  hand2 = new OBJ({
    asset: 'paw_obj',
    mtl: 'paw_mtl',
    x: 0.4,
    y: 0.0,
    z: -0.5,
    rotationX:-90,
    scaleX:.05,
    scaleY:.05,
    scaleZ:.05,
  });

  g = new Plane({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: grassHeight,
    asset: 'grass',
    repeatX: 100, //width
    repeatY: 1000, //length of plane ground
    rotationX: -90,
    metalness: 0.25
  });
 // add the plane to our world
  world.add(g);

  mewtwo = new OBJ({
    asset: 'mewtwo_obj',
    mtl: 'mewtwo_mtl',
    x: 0.4,
    y: 1.6,
    z: 5-grassHeight,
    rotationX:90,
    // rotationZ: -20,
    scaleX:.2,
    scaleY:.2,
    scaleZ:.2,
  });
  world.add(mewtwo);

  startPlane = new Plane({
    x: 0,
    y: 3.2,
    z: -1,
    width: 19,
    height: 19,
    asset: 'startscreen2'
  });
  world.add(startPlane);

  losePlane = new Plane({
    x: 0,
    y: 3.2,
    z: 4.8,
    width: 30,
    height: 19,
    red:0,
    green:0,
    blue:0,
    // asset: 'losescreen'
  });

  loseScreen = new Plane({
    x: 0,
    y: 1,
    z: 4.81,
    width: 2,
    height: 2,
    asset: 'losescreen'
  })

  winPlane = new Plane({
    x: 0,
    y: 3.2,
    z: 4.8,
    width: 30,
    height: 19,
    red:255,
    green:255,
    blue:255,
  });
 
  // add the hands to our camera - this will force it to always show up on the user's display
  world.camera.holder.appendChild(hand1.tag);
  world.camera.holder.appendChild(hand2.tag);
  
  // world.setUserPosition(0, 5, 5); //TESTING PURPOSES
  //HEREEEEEEEEEEEEEEEEEEEEEE
}

function draw() {
  if (startSwipe){
    world.remove(startPlane);
    startSwipe = false; //fix the remove startplane thing being in a loop error
  }
  if(gameMode==0){
    startScreen();
    // play();// TESTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
  } else if(gameMode==1){    
  	play();
  } else if(gameMode==2){
    endScreen();
    if (gameLost){
      world.add(losePlane);
      world.add(loseScreen);
      gameLost = false;
    }
  } else{
    if (gameWon){
      endScreen();
      world.add(winPlane);
      gameWon = false;
    }
  }
  if (health <=0){
    gameMode = 2;
  }
  if (g.getZ() >= g.height/2 +4){ //ending game
    gameMode = 3;
  }
  if (z>=10){ zRot = false;}
  if (z<=-10){ zRot = true;}
  if (zRot){ z+=2;}
  else{ z-=2;}
  y+=1;
}

function startScreen(){
	//hand1.hide();
	//hand2.hide();
}

function play(){
	//make ground move forward **commenting this because im getting dizzy testing.
  g.setZ(g.getZ()+.05);   
  mewtwo.setZ(mewtwo.getZ()+.092);   
  console.log("G",g.getZ()) ;
  console.log("mewtwo",mewtwo.getZ()) ;
  framectr+=1;
  if (framectr%30 ==0){
    var temp = new Pokeball(random(-4, 4), .95, 2);
    pokeballs.push(temp);
  }

	for (var i = 0; i < pokeballs.length; i++) {
		var result = pokeballs[i].move();
    // console.log("DISTANCE",dist(pokeballs[i].pokeball.x, pokeballs[i].pokeball.y, pokeballs[i].pokeball.z, world.getUserPosition().x, world.getUserPosition().y, world.getUserPosition().z));
    var check = true;
    if (result =="gone"){
      pokeballs.splice(i, 1);
      check = false;
    }
    if (check && dist(pokeballs[i].pokeball.x, pokeballs[i].pokeball.y, pokeballs[i].pokeball.z, hand1.x, hand1.y+.95, hand1.z+5)<.16){
      pokeballs[i].delete();
      pokeballs.splice(i, 1);
      check = false;
      console.log("LEFT HAND I THINK??");
    }
    if (check && dist(pokeballs[i].pokeball.x, pokeballs[i].pokeball.y, pokeballs[i].pokeball.z, hand2.x, hand2.y+.95, hand2.z+5)<.16){
      pokeballs[i].delete();
      pokeballs.splice(i, 1);
      check = false;
      console.log("RIGHT HAND I THINK??");
    } //hand checking
    
    if (check){ //if no delete then check for health/behind u
      if(dist(pokeballs[i].pokeball.x, pokeballs[i].pokeball.y, pokeballs[i].pokeball.z, world.getUserPosition().x, world.getUserPosition().y, world.getUserPosition().z)<.18){
        //distance for pokeball close enough to user
        pokeballs[i].delete();
        pokeballs.splice(i, 1);
        health -=1;
        console.log("DELETED", health);
        // console.log("distance!!!",dist(temp.pokeball.z,temp.pokeball.y, world.getUserPosition().z, world.getUserPosition().y));
      }
      else if (result == "gone") {
        pokeballs.splice(i, 1);
        i-=1;
      } 
    } 
  }
	//console.log(world.getUserPosition());
	if (z>=5){zRot = false;}
	if (z<=-5){zRot = true;}
	if (zRot){ z+=1;} else{ z-=1;}
  for (var i =0; i<fires.length;i++){
    fires[i].fireContainer.setZ(fires[i].fireContainer.getZ() - .08);
    // fires[i].fireContainer.setY(fires[i].fireContainer.getY() + .04);
    var fireArr = fires[i].fireContainer.getChildren();
    for (var j=0;j<fireArr.length; j++){
      fireArr[j].rotateZ(z);
    }
    var fireCheck = true;
    for (var j =0; j<pokeballs.length; j++){
      if (dist(pokeballs[j].pokeball.x, pokeballs[j].pokeball.y, pokeballs[j].pokeball.z, fires[i].fire.x, fires[i].fire.y, fires[i].fire.z) <.5){
        //if collision, delete projectile and pokeball
        fires[i].delete();
        fires.splice(i,1);
        pokeballs[j].delete();
        pokeballs.splice(j, 1);
        fireCheck = false;
        break;
      } //distance of < 1 is fire
    }
    if (fireCheck && fires[i].fireContainer.getZ() < -10){ //when far away 
      fires[i].delete();
      fires.splice(i,1);
    }
  }
  for (var i =0; i<ices.length;i++){
    ices[i].iceContainer.setZ(ices[i].iceContainer.getZ() - .06);
    // ices[i].iceContainer.setY(ices[i].iceContainer.getY() + .04);
    var iceArr = ices[i].iceContainer.getChildren();
    for (var j=0;j<iceArr.length; j++){
      iceArr[j].spinZ(2);
    }
    var iceCheck = true;
    for (var j =0; j<pokeballs.length; j++){
      if (dist(pokeballs[j].pokeball.x, pokeballs[j].pokeball.y, pokeballs[j].pokeball.z, ices[i].ice.x, ices[i].ice.y, ices[i].ice.z) <.8){
        //if collision, delete projectile and pokeball
        ices[i].delete();
        ices.splice(i,1);
        pokeballs[j].delete();
        pokeballs.splice(j, 1);
        iceCheck = false;
        break;
      } //distance of < 1 is ice
    }

    if (iceCheck && ices[i].iceContainer.getZ() < -10){
      ices[i].delete();
      ices.splice(i,1);
    }
  }
  for (var i =0; i<lightnings.length;i++){
    lightnings[i].lightningContainer.setZ(lightnings[i].lightningContainer.getZ() - .12);
    // lightnings[i].lightningContainer.setY(lightnings[i].lightningContainer.getY() + .04);
    var lightningArr = lightnings[i].lightningContainer.getChildren();
    for (var j=0;j<lightningArr.length; j++){
      lightningArr[j].spinZ(4);
    }
    var lightningCheck = true;
    for (var j =0; j<pokeballs.length; j++){
      if (dist(pokeballs[j].pokeball.x, pokeballs[j].pokeball.y, pokeballs[j].pokeball.z, lightnings[i].lightningBolt.x, lightnings[i].lightningBolt.y, lightnings[i].lightningBolt.z) <.9){
        //if collision, delete projectile and pokeball
        lightnings[i].delete();
        lightnings.splice(i,1);
        pokeballs[j].delete();
        pokeballs.splice(j, 1);
        lightningCheck = false;
        break;
      } //distance of < 1 is lightning
    }
    if (lightningCheck && lightnings[i].lightningContainer.getZ() < -10){
      lightnings[i].delete();
      lightnings.splice(i,1);
    }
  }
}

function endScreen(){
	hand1.hide();
	hand2.hide();
}
var hx1, hy2, hz1, hx2, hy2, hz2;

function handleHandData(frame) {
  // make sure we have exactly one hand being detected
  var handPosition1;
  var handPosition2;
  if (frame.hands.length == 2) {
    // get the position of the two hands
    handPosition1 = frame.hands[0].stabilizedPalmPosition;
    handPosition2 = frame.hands[1].stabilizedPalmPosition;
    // grab the x, y & z components of the hand position
    // these numbers are measured in millimeters
    hx1 = handPosition1[0];
    hy1 = handPosition1[1];
    //hz1 = handPosition1[2];
    // grab the x, y & z components of the hand position
    // these numbers are measured in millimeters
    hx2 = handPosition2[0];
    hy2 = handPosition2[1];
    //hz2 = handPosition2[2];
    // swap them so that handPosition1 is the hand on the left
    if (hx1 > hx2) {
      hx1 = handPosition2[0];
      hy1 = handPosition2[1];
      //hz1 = handPosition2[2];

      hx2 = handPosition1[0];
      hy2 = handPosition1[1];
      //hz2 = handPosition1[2];
    }
    // console.log(hx1 + "," + hy1 + " - " + hx2 + ", " + hy2);

    // x is left-right, y is up-down, z is forward-back
    // for this example we will use x & y to move the circle around the screen
    // let's map the x & y values to screen coordinates
    // note that determining the correct values for your application takes some trial and error!

  x1 = map(hx1, -200, 200, -0.5, 0.1);
  y1 = map(hy1, 0, 500, -0.5, 0.4);
  //var z1 = map(hz1, -200, 200, -1, 2);

  x2 = map(hx2, -200, 200, -0.1, 0.5);
  y2 = map(hy2, 0, 500, -0.5, 0.4);
  //var z2 = map(hz1, -200, 200, -1, 2);

    // now move the hands
    hand1.setX( x1 );
    hand1.setY( y1 );
    //hand1.setY( z1 );
    hand2.setX( x2 );
    hand2.setY( y2 );
    //hand1.setY( z2 );
  }

  if(gameMode==0 && frame.valid && frame.gestures.length > 0 ){
    frame.gestures.forEach(function(gesture){
      switch (gesture.type){
        case "swipe":
          startSwipe = true;
          // world.remove(startPlane);
          hand1.show();
          hand2.show();
          gameMode=1;
          break;
        // case "screenTap":
        //   var pointableIds = gesture.pointableIds;
        //   console.log("SCREENTAP",pointableIds);
        //   break;
      }
    });
  }
  if(gameMode==1 && frame.valid && frame.gestures.length > 0 ){
    frame.gestures.forEach(function(gesture){
      switch (gesture.type){
        // case "swipe":
        //   world.remove(startPlane);
        //   hand1.show();
        //   hand2.show();
        //   gameMode=1;
        //   break;
        case "screenTap":
          // var pointableIds = gesture.pointableIds;
          var handIds = gesture.handIds;
          var hand;
          handIds.forEach(function(handId){
            hand = frame.hand(handId);
          });
          var leftHandX = frame.hands[1].stabilizedPalmPosition[0];
          var rightHandX = frame.hands[0].stabilizedPalmPosition[0];
          if (leftHandX > rightHandX){
            leftHandX = frame.hands[0].stabilizedPalmPosition[0];
            rightHandX = frame.hands[1].stabilizedPalmPosition[0];
          }
          if (hand.stabilizedPalmPosition[0] == leftHandX){ //left
            console.log("LEFT");
            if (projectile%3==0){
              fires.push(new Fireball(x1-.5,.95,fz));            
              fy+=0.5;
              projectile+=1;
            } else if (projectile%3==1){
              lightnings.push(new LightningBolt(x1-.5,.95,lz));
              projectile+=1;
            } else{
              ices.push(new Ice(x1-.5,.95,iz));
              projectile+=1;
            }
          } else { //right?
            console.log("RIGHT");
            if (projectile%3==0){
              fires.push(new Fireball(x2+.5,.95,fz));            
              fy+=0.5;
              projectile+=1;
            } else if (projectile%3==1){
              lightnings.push(new LightningBolt(x2+.5,.95,lz));
              projectile+=1;
            } else{
              ices.push(new Ice(x2+.5,.95,iz));
              projectile+=1;
            }
          }
          break;
      }
      // console.log("HELLO");
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
  this.xNoiseOffset = random(0,1000);
  this.bool = true;
  this.x = 0;
  world.add(this.pokeball);
  this.delete = function(){
    world.remove(this.pokeball);
  }
	this.move = function(){
    this.pokeball.nudge(0, 0, .03);
		if(this.bool && this.pokeball.x< -3.5){
      this.x =.035;
      this.bool = false;
    } else if(this.bool && this.pokeball.x< -3){
      this.x =.03;
      this.bool = false;
    }else if(this.bool && this.pokeball.x< -2.5){
      this.x =.025;
      this.bool = false;
    }else if(this.bool && this.pokeball.x< -2){
      this.x =.02;
      this.bool = false;
    }else if(this.bool && this.pokeball.x< -1.5){
      this.x =.015;
      this.bool = false;
    }else if(this.bool && this.pokeball.x< -1){
      this.x =.01;
      this.bool = false;
    }else if(this.bool && this.pokeball.x< -.5){
      this.x =.005;
      this.bool = false;
    } 
    else if(this.bool && this.pokeball.x>3.5){
      this.x=-.035;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>3){
      this.x=-.03;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>2.5){
      this.x=-.025;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>2){
      this.x=-.02;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>1.5){
      this.x=-.015;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>1){
      this.x=-.01;
      this.bool = false;
    }else if(this.bool && this.pokeball.x>.5){
      this.x=-.005;
      this.bool = false;
    }
    this.pokeball.nudge(this.x, 0, 0);
		if(this.pokeball.z>5){
			world.remove(this.pokeball);
			return "gone";
		}
  }

  function isCollision(){
		if(dist(this.pokeball.x, hy1)<1 && dist(this.pokeball.y, hy1)<1 && dist(this.pokeball.z, hz1)<1){
			console.log("collided!");
		}
	}
}

function Fireball(x,y,z){
  this.fireContainer = new Container3D({x:0,y:0,z:0});
  this.fire = new OBJ({
    asset: 'fire_obj',
    mtl: 'fire_mtl',
    x: x,
    y: y,
    z: z,
    rotationX:90,
    rotationY:0,
    rotationZ:-5,
    scaleX:5.,
    scaleY:5.,
    scaleZ:5.,
  });
  this.fireContainer.addChild(this.fire);
  world.add(this.fireContainer);
  // world.remove(this.fireContainer);
  // console.log("MADE AND GONE");
  this.delete = function(){
    world.remove(this.fireContainer);
  }

  // return this.fireContainer;
}

function LightningBolt(x,y,z){
  this.lightningContainer = new Container3D({x:0,y:0,z:0});
  this.lightningBolt = new OBJ({
    asset: 'lightningBolt_obj',
    mtl: 'lightningBolt_mtl',
    x: x,
    y: y,
    z: z,
    // rotationX:-135,
    rotationY:0,
    // rotationZ:10,
    scaleX:1,
    scaleY:1,
    scaleZ:1,
  });
  this.lightningContainer.addChild(this.lightningBolt);
  world.add(this.lightningContainer);

  this.delete = function(){
    world.remove(this.lightningContainer);
  }
}

function Ice(x,y,z){
  this.iceContainer = new Container3D({x:0,y:0,z:0});
  this.ice = new OBJ({
    asset: 'ice_obj',
    mtl: 'ice_mtl',
    x: x,
    y: y,
    z: z,
    rotationX:180,
    rotationY:0,
    scaleX:.3,
    scaleY:.3,
    scaleZ:.3,
  });
  this.iceContainer.addChild(this.ice);
  world.add(this.iceContainer);

  this.delete = function(){
    world.remove(this.iceContainer);
  }
}