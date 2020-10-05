
//Setup
var canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

//CreateScene
var CreateScene = function () {
    var scene = new BABYLON.Scene(engine);
    var isBad = true;
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin());
    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;

    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-80), BABYLON.Tools.ToRadians(80), 280, new BABYLON.Vector3(0, 0, 0), scene);    
    camera.attachControl(canvas, true);
    
    /*
     global.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-26.700, 80.173, -5.470), scene);

    // Set camera rotation and target:
    camera.rotation =  new BABYLON.Vector3(69.403, 82.248, 0);
    camera.setTarget(new BABYLON.Vector3(-1.532, 12.588, -2.044));
    */
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    var ringArray = [];   
    var goodRobot;
    var evilRobot;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //Main dude
    var hero =  BABYLON.Mesh.CreateSphere("robot", 16, 10, scene);
    hero.physicsImpostor = new BABYLON.PhysicsImpostor(hero, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
    hero.applyGravity = true;
    hero.checkCollisions = true;
    //Hero character variables 
    var heroSpeed = 1;
    var heroSpeedBackwards = 0.5;
    var heroRotationSpeed = 0.1;

    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    
    //Load all meshes
    Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "good_bot.gltf", scene).then(function (result) {
            result.meshes[0].position.y = 10;
            result.meshes[0].scaling.scaleInPlace(7);
            goodRobot = result.meshes[0];
            goodRobot.position.x = -140;
            goodRobot.physicsImpostor = new BABYLON.PhysicsImpostor(goodRobot, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
            goodRobot.applyGravity = true;
            goodRobot.checkCollisions = true;
            }),
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "evil_bot.gltf", scene).then(function (result) {
            evilRobot = result.meshes[0];
            evilRobot.scaling.scaleInPlace(7);
            evilRobot.physicsImpostor = new BABYLON.PhysicsImpostor(evilRobot, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
            evilRobot.applyGravity = true;
            evilRobot.checkCollisions = true;
            evilRobot.position.x = 5;
            }),
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "arena.gltf", scene).then(function (result) {
            arena = result.meshes[0];
            arena.position.y = -50;
            arena.scaling.scaleInPlace(17);
            arena.physicsImpostor = new BABYLON.PhysicsImpostor(arena, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, friction: 0, restitution: 0 });
            arena.checkCollisions = true;
        }),
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "dome.gltf", scene).then(function (result) {
            dome = result.meshes[0];
            dome.position.y = -49;
            dome.scaling.scaleInPlace(65);
        }),
    ]).then(() => {
        setInterval(createRandomRobotRing, 1000);
    });

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    /*** ROBOT RING FUNCTIONS ***/
    //Make a robot that is part of the robotRing
    function makeRobot(pivot, startPos, mesh) {
        var robot;
        if (isBad) {
            robot = evilRobot.clone('evil');
        } else {robot = goodRobot.clone('good');}
        isBad = !isBad;
        var material = new BABYLON.StandardMaterial("robotmaterial", scene);
        robot.material = material;
        robot.parent = pivot;
        robot.position = startPos;
        robot.position.add(pivot.position);
        robot.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        return robot;
    }
  
    // RobotRing Constructor - makes a ring of rotating robots
    // ringPosition - Vector3 of where it is placed
    // speed - how fast the ring rotates - given as an angle (Ex: Math.PI / 128)
    // radius - radius of the ring
    // angleList - Array of the angles to place robots on the ring (Ex: [0, Math.Pi])
    function RobotRing(ringPosition, speed, radius, angleList) {
        this.speed = speed;
        this.radius = radius;
        this.numBots = angleList.length;
        this.angleList = angleList;
        this.robots = [];
        
        //Center of the ring
        this.pivot = new BABYLON.TransformNode("root");
        this.pivot.position = ringPosition;
    
        angleList.forEach(angle => {
            var z = radius * Math.sin(angle);
            var x = radius * Math.cos(angle);
            var robot = makeRobot(this.pivot, new BABYLON.Vector3(x, 0, z));
            this.robots.push;
        });
  
        //Uncomment to see the center of the circle
        //this.refBall =  BABYLON.Mesh.CreateSphere("robot", 16, 1, scene);
        //this.refBall.position = this.pivot.position;    
    }


    function createRandomRobotRing () {
        var x = randomInteger(-200,200);
        var z = randomInteger(-200,200);
        var radius = randomInteger(20,70);
        var numBots = randomInteger(2,6);
        var speed = randomInteger(50,150);
        var angleArray = [];
        var angle;
        for (var i=0; i<numBots; i++ ) {
            angle = randomInteger(1,360);
            angleArray.push(BABYLON.Tools.ToRadians(angle));
        }
        ringArray.push(new RobotRing(new BABYLON.Vector3(x,0,z), Math.PI / speed, radius, angleArray));
    }

    /*** FUNCTIONALITY ***/
    //Rotate rings 7 check if dies
    var alpha = 0;
    scene.beforeRender = function () {   
        ringArray.forEach( ring => {
            ring.pivot.rotate(BABYLON.Axis.Y, ring.speed, BABYLON.Space.LOCAL);
            //ring.refBall.position = ring.pivot.position;
            //ring.pivot.rotate(BABYLON.Axis.Y, ring.speed, BABYLON.Space.WORLD);
            //ring.pivot.position.add(new BABYLON.Vector3(10 * Math.sin(alpha), 0, 10 * Math.cos(alpha)));
            ring.pivot.getChildren().forEach( bot => {
                if (hero.intersectsMesh(bot, false)) {

                    //something on death
                    $('.DEATH').removeClass('hide')
                    setTimeout( () => $('.DEATH').addClass('hide') , 2000)
                }
            });
        });
        alpha+=0.2;
    };
    
    scene.onBeforeRenderObservable.add(() => {
        //Manage the movements of the character (e.g. position, direction)
        if (inputMap["w"]) {
            hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
        }
        if (inputMap["s"]) {
            hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
        }
        if (inputMap["a"]) {
            hero.rotate(BABYLON.Vector3.Up(), -heroRotationSpeed);
        }
        if (inputMap["d"]) {
            hero.rotate(BABYLON.Vector3.Up(), heroRotationSpeed);
        }
    });
    return scene;
};

var engine;
try {
engine = createDefaultEngine();
} catch(e) {
console.log("the available createEngine function failed. Creating the default engine instead");
engine = createDefaultEngine();
}
if (!engine) throw 'engine should not be null.';

scene = CreateScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});