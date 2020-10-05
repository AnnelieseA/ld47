console.log('hello stuck loop world (babylonjs)')

global.$ = require('jquery')
const _ = require('underscore')


$('body').addClass('bg-black').append(`
  <canvas id="renderCanvas"  class="hide"
          style="
          width: 100%;
          height: 100%;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
           outline: none;
          ">
  </canvas>
 
`)

//little math helper:
const degreesToRadians = degrees => {
  var pi = Math.PI
  return degrees * (pi/180)
}

const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

//idle rotation speed:
let idleSpeed = 1.5
let incrementRate = idleSpeed

global.setParent = ( children, parent ) => {
  children.forEach(child => child.parent = parent )
}

let currentRing = 'outer'

global.swap = () => {

  let spherePositionOld = sphere.position
  let sphereLightPositionOld = sphereLight.position
  let goodBotPositionOld = goodBot.position

  sphere.position = sphere2.position
  sphereLight.position = sphere2Light.position
  goodBot.position = evilBot.position

  sphere2.position = spherePositionOld
  sphere2Light.position = sphereLightPositionOld
  evilBot.position = goodBotPositionOld

  setParent(goodBotParts, midNode2)
  setParent(evilBotParts, midNode)

  currentRing = 'inner'

}

const clone = () => {
  global.midNodeClone = midNode.clone('midNodeClone')
  let ringA = _.findWhere( midNodeClone._children, { name : 'midNodeClone.ring' })
  // ringA.setEnabled(false)
  // midNodeClone._children = _.without( midNodeClone._children, ringA )
  ringA.dispose()

  //midNodeClone.makeGeometryUnique()
  midNodeClone.showBoundingBox = true

  const midNode2Clone = midNode2.clone('midNode2Clone')
  let ringB = _.findWhere( midNode2Clone._children, { name : 'midNode2Clone.ring2' })
  ringB.dispose()

  global.midNode3 = new BABYLON.TransformNode("midNode3")
  midNode2Clone.parent = midNode3
  midNodeClone.parent = midNode3

  // midNode3.setPivotPoint( midNode2Clone.position )
  // midNode3.setPivotPoint( sphere.position )
  midNode3.setPivotPoint( sphere.getAbsolutePivotPoint() )

  //now i can rotate!
}

const cloneOnce = _.once( clone )

// CreateScene async function that creates and return the scene
const createScene = async () => {
  let scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.Black()

  // Create a camera, and set its position to {x: 0, y: 0, z: 0}
  global.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-26.700, 80.173, -5.470), scene)

  // Set camera rotation and target:
  camera.rotation =  new BABYLON.Vector3(69.403, 82.248, 0)
  camera.setTarget(new BABYLON.Vector3(-1.532, 12.588, -2.044))

  // Attach the camera to the canvas
  //camera.attachControl(canvas, false) //< UP/DOWN/LEFT/RIGHT keyboard controls...
  //^ also mouse controlling

  // Create a basic light
  let light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 1500.000
  light.diffuse = new BABYLON.Color3(0.922, 0.855, 0.710)
  light.position.y = 22.573

  //load meshes:
  let loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "good_bot2.0.gltf", scene)
  global.goodBot = loadedMesh.meshes[0]
  goodBot.position = new BABYLON.Vector3(-1.98, 1.831, -27.504)
  goodBot.name = 'goodBot'
  goodBot.scaling = new BABYLON.Vector3(2.694, 2.694,2.694)

  let goodBotSphere = _.findWhere(goodBot._children, { id: "Cube.001"})
  goodBotSphere.setEnabled(false)

  global.sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 2.5, scene, false, BABYLON.Mesh.FRONTSIDE)
  // Move sphere into position:
  sphere.position = new BABYLON.Vector3( -2, 2.943, -27.562)

  let whiteMaterial = new BABYLON.StandardMaterial("texture1", scene)
  whiteMaterial.diffuseColor = new BABYLON.Color3(255, 255, 255)
  whiteMaterial.name = 'whiteMaterial'
  whiteMaterial.emissiveColor = BABYLON.Color3.FromHexString('#ff1493')
  //green: #33C268, pink: #ff1493
  sphere.material = whiteMaterial

  // Create a basic light
  global.sphereLight = new BABYLON.PointLight('sphereLight', new BABYLON.Vector3(-2, 4.548, -25.897, scene))
  sphereLight.intensity = 1000.000
  sphereLight.diffuse = new BABYLON.Color3.FromHexString('#D8C0F0')

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "ring2.gltf", scene)
  global.ring = loadedMesh.meshes[0]
  ring.name = "ring"
  ring.scaling = new BABYLON.Vector3( 15, 15, -15 )
  ring._children [0].material.anisotropy.isEnabled = true
  ring._children [0].material.anisotropy.intensity = 0.86

  //### 2nd bot and ring ####
  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "evil_bot_2.0.gltf", scene)
  global.evilBot = loadedMesh.meshes[0]

  evilBot.position = new BABYLON.Vector3(-1.988, 1.029, -9.185)
  evilBot.name = 'evilBot'
  evilBot.scaling = new BABYLON.Vector3(2.694, 2.694, 2.694)

  // let evilBotSphere = _.findWhere(evilBot._children, { id: "Cube.001"})
  // evilBotSphere.setEnabled(false)

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "ring2.gltf", scene)
  global.ring2 = loadedMesh.meshes[0]
  ring2.name = "ring2"
  ring2.scaling = new BABYLON.Vector3( 5, 5, 5 )
  //ring2.position = new BABYLON.Vector3(16.295, 0, 13.777)
  ring2._children [0].material.anisotropy.isEnabled = true
  ring2._children [0].material.anisotropy.intensity = 0.86


  global.sphere2 = BABYLON.Mesh.CreateSphere('sphere', 16, 2.5, scene, false, BABYLON.Mesh.FRONTSIDE)
  // Move sphere into position:
  sphere2.position = new BABYLON.Vector3( -1.900, 1.553, -9.157)

  // Create a basic light
  global.sphere2Light = new BABYLON.PointLight('sphereLight', new BABYLON.Vector3(-1.900, 1.553, -9.157, scene))
  sphere2Light.intensity = 1000.000
  sphere2Light.diffuse = new BABYLON.Color3.FromHexString('#d2f0c0')

  let whiteMaterial2 = new BABYLON.StandardMaterial("texture1", scene)
  whiteMaterial2.diffuseColor = new BABYLON.Color3(255, 255, 255)
  whiteMaterial2.name = 'whiteMaterial'
  whiteMaterial2.emissiveColor = BABYLON.Color3.FromHexString('#33C268')
  //green: #33C268, pink: #ff1493
  sphere2.material = whiteMaterial2

  loadedMesh = await BABYLON.SceneLoader.ImportMeshAsync("", "meshes/", "arena.gltf", scene)
  global.arena = loadedMesh.meshes[0]
  arena.name = 'arena'
  arena.position.z = 2.5
  arena.position.x = 1
  arena.scaling.scaleInPlace(2)

  let arenaPlane = _.findWhere( arena._children, { id : "Plane" })
  arenaPlane.scaling = new BABYLON.Vector3( 34.857, 14.039, 34.857 )


  //create parent object ('midNode') to use as a sort of origin point for the basis of rotation (or movement):
  global.midNode = new BABYLON.TransformNode("midNode")
  midNode.position = new BABYLON.Vector3(1, 2.297, 2.500)

  //set the other objects to be children:
  setParent( [ring,sphere,sphereLight,goodBot ], midNode )

  global.midNode2 = new BABYLON.TransformNode("midNode2")
  midNode2.position = new BABYLON.Vector3(14.415, 2.297, 13.847)
  midNode2.rotation.y = degreesToRadians(99)

  setParent( [ring2,sphere2,sphere2Light,evilBot ], midNode2 )

  global.goodBotParts = [sphere,sphereLight,goodBot ]
  global.evilBotParts = [sphere2,sphere2Light,evilBot ]

  //rotation animation:
  let degrees = 0
  let degress2 = 99
  let degrees3 = 0
  let midNode3Speed = 0
  let intersected = false 
  scene.registerAfterRender( () => {
    if(pausing) return
    if (!intersected && goodBot._children[0].intersectsMesh(evilBot._children[15], false)) {
      console.log('intersect!!!')
      cloneOnce()
      midNode3Speed = 9
      evilBotParts.forEach( part => part.setEnabled(false))
      goodBotParts.forEach( part => part.setEnabled(false))
      intersected = true
    }
    if(midNode3Speed) {
      midNode3.rotation.y = degreesToRadians(degrees3 + midNode3Speed)
      degrees3 = degrees3 + midNode3Speed
      if(midNode3.rotation.y > degreesToRadians(360)) {
        midNode3Speed = 0
        midNode3.dispose()
        swap()
        evilBotParts.forEach( part => part.setEnabled(true))
        goodBotParts.forEach( part => part.setEnabled(true))
        //engine.stopRenderLoop()
      }
    } else {
      let midNodeSpeed = currentRing === 'outer' ? incrementRate : idleSpeed
      midNode.rotation.y = degreesToRadians(degrees + midNodeSpeed)
      degrees = degrees + midNodeSpeed

      let midNode2Speed = currentRing === 'outer' ? idleSpeed : incrementRate
      midNode2.rotation.y = degreesToRadians(degress2 + midNode2Speed)
      degress2 = degress2 + midNode2Speed
    }
  })
  return scene
}

global.pausing = false
global.scene = null
global.initGame = async () => {
  console.log('init game!')
  $('#introUI').addClass('hide')
  scene = await createScene()
  engine.runRenderLoop(() => scene.render())
  //scene.debugLayer.show()
  let gl = new BABYLON.GlowLayer("glow", scene)

  $(document).on('keydown', e => {
    console.log('keydown')
    if(e.code === 'ArrowRight') incrementRate = 2
    if(e.code === 'ArrowLeft') incrementRate = idleSpeed - 0.5
    if(e.code === 'Escape') {
      pausing ? unpause() : pause()
    }
  })
  $(document).on('keyup', () => {
    if(pausing) return
    incrementRate = idleSpeed
  })
  $('#renderCanvas').removeClass('hide')
}


global.pause = () => {
  console.log('pause')
  pausing = true
  //engine.stopRenderLoop()
  scene.freezeActiveMeshes()
  $('#pauseUI').removeClass('hide')
}

global.unpause = () => {
  console.log('unpause')
  pausing = false
  //engine.runRenderLoop()
  scene.unfreezeActiveMeshes()
  $('#pauseUI').addClass('hide')
}

global.exitGame = () => {
  engine.stopRenderLoop()
  $('#renderCanvas').remove()
  $('#pauseUI').html(`<div class="mute-30 center white p2">(you exited)</div>`)
}

if(window.location.hash === '#play') {
  initGame()
} else {
  // no idea why the timeout is needed:
  $('#introUI').removeClass('hide')
  setTimeout( () => {
    $('#introUI').removeClass('hide')
  }, 1000)
}