console.log('hello stuck loop world')

global.$ = require('jquery')

$('body').addClass('bg-silver')

$(`body`).append(`
  <div class="ORBITAL absolute"
       style="top: 100px; left: 100px; width: 200px; height: 200px;
             transform-origin: center center;
     ">
    <div class="INNER relative"></div>
</div>
`)

//CIRCLE B:
$('.ORBITAL > .INNER').append(`
  <div class="absolute inline-block z2" 
     style="border-radius: 100%; width:60px; height: 60px; background-color: deeppink;
     top: 160px;
     left: 82px;
     ">
      &nbsp;
  </div>
`)

//CIRCLE tether:
$('.ORBITAL > .INNER').append(`
  <div class="absolute inline-block p4 border-2 z1" 
     style="border-radius: 100%; width:200px; height: 200px; border-color: deeppink;
      top: 0px;
      left: 0px;
     ">
      &nbsp;
  </div>
`)

//rotate animation:
const anime = require('animejs')

//via https://stackoverflow.com/a/11840120
function getRotationDegrees(obj) {
  var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
  if(matrix !== 'none') {
    var values = matrix.split('(')[1].split(')')[0].split(',');
    var a = values[0];
    var b = values[1];
    var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } else { var angle = 0; }
  return (angle < 0) ? angle + 360 : angle;
}

const idleAnime = () => anime({
  targets:  '.ORBITAL',
  rotateZ : [getRotationDegrees($( '.ORBITAL' )) , 360],
  easing: 'linear',
  duration: 5000,
  complete: anim => idleAnime()
})

let z = 0
const rotateZ = (degrees, direction) => {
  z = getRotationDegrees($( '.ORBITAL' ))
  if(direction == 'right') {
    z = z + degrees
  } else {
    z = z - degrees
  }
  //idleRotationAnime.pause()
  anime.remove('.ORBITAL')
  anime({
    targets:  '.ORBITAL',
    rotateZ : z,
    easing: 'linear',
    duration: 300,
    complete: anim => idleAnime() //< continue idle anim
  })
}
$(document).on('keydown', e => {
  if(e.code === 'ArrowLeft') rotateZ(0, 'left')
  if(e.code === 'ArrowRight') rotateZ(30, 'right')
})

idleAnime()