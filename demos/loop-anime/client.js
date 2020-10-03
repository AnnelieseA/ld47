console.log('hello stuck loop world')

const $ = require('jquery')

$('body').addClass('bg-silver')

$(`body`).append(`
  <div class="ORBITAL absolute"
       style="top: 100px; left: 100px; width: 339px; height: 339px;
              transform: scale3d(0.5,0.5,0.5); transform-origin: center center;
     ">
    <div class="INNER relative"></div>
</div>
`)

//CIRCLE A:
$('.ORBITAL > .INNER').append(`
  <div class="absolute bg-white inline-block p4 z2 top-0 left-0" 
     style="border-radius: 100%; width:100px; height: 100px; 
     ">
      &nbsp;
  </div>
`)

//CIRCLE B:
$('.ORBITAL > .INNER').append(`
  <div class="absolute bg-black inline-block p4 z2" 
     style="border-radius: 100%; width:100px; height: 100px; 
     top: 200px;
     left: 182px;
     ">
      &nbsp;
  </div>
`)

//CIRCLE tether:
$('.ORBITAL > .INNER').append(`
  <div class="absolute inline-block p4 border-2 z1 border-gray" 
     style="border-radius: 100%; width:100px; height: 100px; 
      top: 93px;
      left: 101px;
      transform: scale3d(2,2,2);
     ">
      &nbsp;
  </div>
`)

//rotate animation:
const anime = require('animejs')
anime({
  targets:  '.ORBITAL',
  rotateZ : 360,
  easing: 'linear',
  duration: 3000,
  loop: true
})