console.log('hello stuck loop world (babylonjs)')

const $ = require('jquery')
const _ = require('underscore')

$('body').addClass('bg-silver').append(`
  <canvas id="renderCanvas"
          style="width: 800px;
          height: 600px;
          touch-action: none;">
  </canvas>
  <p>click &amp; drag to rotate camera, Up/Left/Right/Down arrow keys to move camera position</p>
`)

//little math helper:
const degreesToRadians = degrees => {
  var pi = Math.PI
  return degrees * (pi/180)
}

const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

// CreateScene async function that creates and return the scene
const createScene = async () => {
  let scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.Gray()

  // Create a camera, and set its position to {x: 0, y: 0, z: 0}
  global.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-26.700, 80.173, -5.470), scene)

  // Set camera rotation and target:
  camera.rotation =  new BABYLON.Vector3(69.403, 82.248, 0)
  camera.setTarget(new BABYLON.Vector3(-1.532, 12.588, -2.044))

  // Attach the camera to the canvas
  camera.attachControl(canvas, false) //< UP/DOWN/LEFT/RIGHT keyboard controls...
  //^ also mouse controlling

  // Create a basic light
  let light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 1500.000
  light.diffuse = new BABYLON.Color3(0.922, 0.855, 0.710)
  light.position.y = 22.573


  //load meshes:
  let loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "good_bot2.0.gltf", scene)
  global.goodBot = loadedMesh.meshes[0]
  goodBot.position = new BABYLON.Vector3(-1.98, 4.939, -26.867)
  goodBot.name = 'goodBot'
  goodBot.scaling = new BABYLON.Vector3(2.694, 2.694,2.694)

  let goodBotSphere = _.findWhere(goodBot._children, { id: "Cube.001"})
  goodBotSphere.setEnabled(false)

  let sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 2.5, scene, false, BABYLON.Mesh.FRONTSIDE)
  // Move sphere into position:
  sphere.position = new BABYLON.Vector3( -2, 4.548, -27.562)

  // Create a basic light
  let sphereLight = new BABYLON.PointLight('sphereLight', new BABYLON.Vector3(-2, 4.548, -25.897, scene))
  sphereLight.intensity = 1000.000
  sphereLight.diffuse = new BABYLON.Color3.FromHexString('#D8C0F0')

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "ring2.gltf", scene)
  global.ring = loadedMesh.meshes[0]
  ring.name = "ring"
  ring.scaling = new BABYLON.Vector3( 15, 15, -15 )
  ring._children [0].material.anisotropy.isEnabled = true
  ring._children [0].material.anisotropy.intensity = 0.86

  let whiteMaterial = new BABYLON.StandardMaterial("texture1", scene)
  whiteMaterial.diffuseColor = new BABYLON.Color3(255, 255, 255)
  whiteMaterial.name = 'whiteMaterial'
  whiteMaterial.emissiveColor = BABYLON.Color3.FromHexString('#ff1493')
  //green: #33C268, pink: #ff1493
  sphere.material = whiteMaterial

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "arena.gltf", scene)
  global.arena = loadedMesh.meshes[0]
  arena.name = 'arena'
  arena.position.z = 2.5
  arena.position.x = 1
  arena.scaling.scaleInPlace(2)

  let arenaPlane = _.findWhere( arena._children, { id : "Plane" })
  arenaPlane.scaling = new BABYLON.Vector3( 34.857, 14.039, 34.857 )


  //create parent object ('midNode') to use as a sort of origin point for the basis of rotation (or movement):
  let midNode = new BABYLON.TransformNode("midNode")
  midNode.position = new BABYLON.Vector3(1, 2.297, 2.500)

  //set the other objects to be children:
  sphere.parent = midNode
  sphereLight.parent = midNode
  ring.parent = midNode
  goodBot.parent = midNode

  //shadows... no diff?
  arenaPlane.receiveShadows = true
  ring.receiveShadows = true

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light)
  shadowGenerator.getShadowMap().renderList.push(ring)
  shadowGenerator.getShadowMap().renderList.push(arenaPlane)

  //rotation animation:
  let degrees = 0
  scene.registerAfterRender( () => {
    //return
    midNode.rotation.y = degreesToRadians(degrees + 1)
    degrees = degrees + 1
  })

  return scene
}

(async function() {
  const scene = await createScene()
  engine.runRenderLoop(() => scene.render())
  //scene.debugLayer.show()
  let gl = new BABYLON.GlowLayer("glow", scene)
}())

