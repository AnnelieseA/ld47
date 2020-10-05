console.log('hello stuck loop world (babylonjs)')

const $ = require('jquery')

$('body').addClass('bg-silver').append(`
  <canvas id="renderCanvas"
          style="width: 800px;
          height: 600px;
          touch-action: none;">
  </canvas>
  <p>click &amp; drag to rotate camera, Up/Left/Right/Down arrow keys to move camera position</p>
`)

const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

// CreateScene async function that creates and return the scene
const createScene = async () => {
  let scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.Gray()

  // Create a camera, and set its position to {x: 0, y: 0, z: 0}
  global.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-62, 35, -12), scene)

  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())

  // Attach the camera to the canvas
  camera.attachControl(canvas, false) //< UP/DOWN/LEFT/RIGHT keyboard controls...
  //^ also mouse controlling

  // Create a basic light
  let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)

  //load meshes:
  let loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "good_bot2.0.gltf", scene)
  global.goodBot = loadedMesh.meshes[0]
  goodBot.position.z = -20
  goodBot.scaling.scaleInPlace(2)

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "evil_bot_2.0.gltf", scene)
  global.evilBot = loadedMesh.meshes[0]
  evilBot.position.z = 20
  evilBot.scaling.scaleInPlace(2)

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "ring2.gltf", scene)
  global.ring = loadedMesh.meshes[0]
  ring.position.z = 2.5
  ring.position.x = 1
  ring.scaling = new BABYLON.Vector3( 15, 15, -15 )


  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "arena.gltf", scene)
  global.arena = loadedMesh.meshes[0]
  arena.position.z = 2.5
  arena.position.x = 1
  arena.scaling.scaleInPlace(2)

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "dome.gltf", scene)
  global.dome = loadedMesh.meshes[0]
  dome.scaling.scaleInPlace(4)

  return scene
}

(async function() {
  const scene = await createScene()
  engine.runRenderLoop(() => scene.render())
  scene.debugLayer.show()
}())

