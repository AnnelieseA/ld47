console.log('hello stuck loop world')

const $ = require('jquery')

$('body').addClass('bg-silver')

$(`body`).append(`
  <div class="ORBITAL absolute"
       style="top: 100px; left: 100px; width: 200px; height: 200px;
             transform-origin: center center;
     ">
    <div class="INNER relative"></div>
</div>
`)

//CIRCLE A:
$('.ORBITAL > .INNER').append(`
  <div class="absolute bg-white inline-block z2 " 
     style="border-radius: 100%; width:60px; height: 60px; 
            top: -25px;
            left: 82px; 
     ">
      &nbsp;
  </div>
`)

//CIRCLE B:
$('.ORBITAL > .INNER').append(`
  <div class="absolute bg-black inline-block z2" 
     style="border-radius: 100%; width:60px; height: 60px; 
     top: 160px;
     left: 82px;
     ">
      &nbsp;
  </div>
`)

//CIRCLE tether:
$('.ORBITAL > .INNER').append(`
  <div class="absolute inline-block p4 border-2 z1 border-gray" 
     style="border-radius: 100%; width:200px; height: 200px; 
      top: 0px;
      left: 0px;

     ">
      &nbsp;
  </div>
`)

//rotate animation:
const anime = require('animejs')

let z = 0
const rotateZ = (degrees, direction) => {
  if(direction == 'right') {
    z = z + degrees
  } else {
    z = z - degrees
  }
  anime({
    targets:  '.ORBITAL',
    rotateZ : z,
    easing: 'linear',
    duration: 100
  })
}
$(document).on('keydown', e => {
  if(e.code === 'ArrowLeft') rotateZ(10, 'left')
  if(e.code === 'ArrowRight') rotateZ(10, 'right')
})