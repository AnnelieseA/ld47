console.log('hello stuck loop world (babylonjs)')

const $ = require('jquery')

$('body').addClass('bg-silver')

$('body').append(`
  <canvas id="renderCanvas"
          style="width: 800px;
          height: 600px;
          touch-action: none;">
  </canvas>
`)

import * as BABYLON from 'babylonjs'

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})
// CreateScene function that creates and return the scene
const createScene = () => {
  // Create a basic BJS Scene object
  let scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.Gray()

  // Create a camera, and set its position to {x: 0, y: 5, z: -10}
  let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene)

  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())

  // Attach the camera to the canvas
  camera.attachControl(canvas, false) //< UP/DOWN/LEFT/RIGHT keyboard controls...
  //^ also mouse controlling

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  let sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 2.5, scene, false, BABYLON.Mesh.FRONTSIDE)
  // Move the sphere
  sphere.position.y = -2
  sphere.position.x = -2

  let sphere2 = BABYLON.Mesh.CreateSphere('sphere2', 16, 2.5, scene, false, BABYLON.Mesh.FRONTSIDE)
  sphere2.position.y = 2
  sphere2.position.x = 2

  let bezierTorus = BABYLON.Mesh.CreateTorus("torus", 6 , 0.2, 32, scene, false, BABYLON.Mesh.FRONTSIDE)
  bezierTorus.position.x = 0
  bezierTorus.position.z = 0
  bezierTorus.rotation.x = Math.PI / 2

  //^ same as calling:
  //bezierTorus.rotate(BABYLON.Axis.X,  Math.PI / 2  , BABYLON.Space.WORLD)

  //# TIP # degrees conversion:
  // 45 == Math.PI / 4, 90 == Math.PI / 2 and 180 == Math.PI ;)

  let blackMaterial = new BABYLON.StandardMaterial("texture1", scene)
  blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)

  let whiteMaterial = new BABYLON.StandardMaterial("texture1", scene)
  whiteMaterial.diffuseColor = new BABYLON.Color3(255, 255, 255)

  //Applying materials
  sphere.material = blackMaterial
  sphere2.material = whiteMaterial

  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  //var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
  // Return the created scene
  return scene
}
// call the createScene function
const scene = createScene()
// run the render loop
engine.runRenderLoop(() => scene.render())