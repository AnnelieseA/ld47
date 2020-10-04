
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

    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90), 0.25, new BABYLON.Vector3(0, 0, 0), scene);    
    var ringArray = [];   
    var goodRobot;
    var evilRobot;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    var ground2 = BABYLON.MeshBuilder.CreateGround("ground", {height: 300, width: 300, subdivisions: 4}, scene);
    ground2.position.y = -30;
    ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, friction: 0, restitution: 0 });
    ground2.checkCollisions = true;

    //Main dude
    var hero =  BABYLON.Mesh.CreateSphere("robot", 16, 4, scene);
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
            result.meshes[0].scaling.scaleInPlace(4);
            goodRobot = result.meshes[0];
            goodRobot.position.x = -140;
            goodRobot.physicsImpostor = new BABYLON.PhysicsImpostor(goodRobot, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
            goodRobot.applyGravity = true;
            goodRobot.checkCollisions = true;
            }),
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "evil_bot.gltf", scene).then(function (result) {
            evilRobot = result.meshes[0];
            evilRobot.scaling.scaleInPlace(4);
            evilRobot.physicsImpostor = new BABYLON.PhysicsImpostor(evilRobot, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 });
            evilRobot.applyGravity = true;
            evilRobot.checkCollisions = true;
            evilRobot.position.x = 5;
            }),
        BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "arena.gltf", scene).then(function (result) {
            arena = result.meshes[0];
            arena.position.y = -29;
            arena.scaling.scaleInPlace(20);
        }),
    ]).then(() => {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.alpha += Math.PI;
        ringArray.push(new RobotRing(new BABYLON.Vector3(0,0,0), Math.PI / 64, 20, [ Math.PI, 0]));
        ringArray.push(new RobotRing(new BABYLON.Vector3(20,0,10), Math.PI / 150, 20, [ Math.PI, Math.PI /4, 0]));
        ringArray.push(new RobotRing(new BABYLON.Vector3(-50,0,-20), Math.PI / 120, 20, [ Math.PI, 0]));
    });

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


    // Animations
    scene.beforeRender = function () {   
        ringArray.forEach( ring => {
            ring.pivot.rotate(BABYLON.Axis.Y, ring.speed, BABYLON.Space.LOCAL);
            ring.pivot.getChildren().forEach( bot => {
                if (hero.intersectsMesh(bot, false)) {

                    //TODO do something on death
                    window.alert("You died!");         
                }
            });
        });
    };
    
    //Rendering loop (executed for everyframe)
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