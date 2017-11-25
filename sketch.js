// variable to hold a reference to our A-Frame world
var world;

var controller = new Leap.Controller();
controller.connect();

controller.on('connect', onConnect);
function onConnect()
{
    console.log("Hello there");
}

function setup() {
	// no canvas needed
	noCanvas();

	world = new World('VRScene');

	// create a plane to serve as our "ground"
	var g = new Plane({x:0, y:0, z:0, width:100, height:100, red:0, green:102, blue:153, rotationX:-90, metalness:0.25});

	// add the plane to our world
	world.add(g);
}

function draw() {

}
