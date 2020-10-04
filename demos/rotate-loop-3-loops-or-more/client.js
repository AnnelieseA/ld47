console.log('hello stuck loop world')

global.$ = require('jquery')

$('body').addClass('bg-silver')

// import html from lit-html

let loopContainerElementInstance = (id, top, left, size, startRotation) => $(`
  <div class="LOOPCONTAINER absolute"
       style="top: ${top}px; left: ${left}px; width: ${size}px; height: ${size}px;
             transform-origin: center center;
             transform: rotateZ(${startRotation ? startRotation : 0 }deg);
     "
     id = "LOOPCONTAINER-${id}"
     >
    <div class="INNER relative"></div>
</div>
`)

let $loopContainerElementA = loopContainerElementInstance('A', 200, 200, 420)
$loopContainerElementA.appendTo('body')

let botElementInstance = (top, left, color) => $(`
  <div class="BOT absolute inline-block z2" 
     style="border-radius: 100%; width:60px; height: 60px; background-color: ${color};
     top: ${top}px;
     left: ${left}px;
     ">
      &nbsp;
  </div>
`)
$loopContainerElementA.first().append(botElementInstance(160, -25, 'deeppink'))

//LOOP tether:
let loopTetherElementInstance = (size, color) => $(`
  <div class="LOOPTETHER absolute inline-block p4 border-2 z1" 
     style="border-radius: 100%; width:${size}px; height: ${size}px; border-color: ${color};
      top: 0px;
      left: 0px;
     ">
      &nbsp;
  </div>
`)
$loopContainerElementA.first().append( loopTetherElementInstance(420, 'deeppink') )

//second loop:
let $loopContainerElementB = loopContainerElementInstance('B', 224, 240, 200)
$loopContainerElementB.appendTo('body')
$loopContainerElementB.first().append(botElementInstance(120, -5, 'black'))
$loopContainerElementB.first().append( loopTetherElementInstance(200, 'black') )

//third loop:
let $loopContainerElementC = loopContainerElementInstance('C', 418, 291, 200, 100)
$loopContainerElementC.appendTo('body')
$loopContainerElementC.first().append(botElementInstance(120, -5, 'black'))
$loopContainerElementC.first().append( loopTetherElementInstance(200, 'black') )


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
const _ = require('underscore')

//rotate animation:
const anime = require('animejs')
const animate = id => {
  //determine start degrees:
  let currentRotation = getRotationDegrees( $('#' + id) )
  let rotationOffset = 360 - currentRotation
  if(rotationOffset === 0) rotationOffset = 360
  if(rotationOffset === 360) {
    return anime({
      targets:  '#' + id,
      rotateZ : 360,
      easing: 'linear',
      autoplay : false,
      loop : true
    })
  }
  return anime({
    targets:  '#' + id,
    rotateZ :   [ currentRotation , 360],
    easing: 'linear',
    autoplay : false,
    loop: false,
    complete : (anim) => {
      //anime.remove( $('#' + id) )
      let animationWithAnim = _.findWhere( animations, { anime : anim })
      animations = _.without(animations, animationWithAnim)
      let timeManagerLoop = new TimeMagic(1)
      timeManagerLoop.updateSpeed(idleSpeed)
      animations.push(
        {
          anime: anime({
            targets: '#' + id,
            rotateZ: [0, 360],
            easing: 'linear',
            autoplay: false,
            loop: true
          }),
          timeManagerLoop : timeManagerLoop
        }
      )
    }
  })
}

//handle input; advance/brake speed on keydown, reset back to idle speed on keyup:
$(document).on('keydown', e => {
  if(e.code === 'ArrowLeft') timeManagerLoopA.updateSpeed(0.08)
  if(e.code === 'ArrowRight') timeManagerLoopA.updateSpeed(0.8)
})
$(document).on('keyup', () => timeManagerLoopA.updateSpeed(idleSpeed))

class TimeMagic {
  constructor(speed) {
    this.accumulateTime = -1
    this.lastTime = -1
    this.speed = speed
  }
  updateTime(t) {
    if (this.accumulateTime === -1) {
      this.accumulateTime = t
    } else {
      const deltaT = t - this.lastTime
      this.accumulateTime += deltaT * this.speed
    }
    this.lastTime = t
  }
  updateSpeed(speed) {
    this.speed = speed
  }
  getTime() {
    return this.accumulateTime
  }
}
const timeManagerLoopA = new TimeMagic(1)
const timeManagerLoopB = new TimeMagic(1)

//set speed and begin animation loop:
const idleSpeed = 0.25


let animationA = animate($loopContainerElementA.attr('id'))
let animationB = animate($loopContainerElementB.attr('id'))
let animationC = animate($loopContainerElementC.attr('id'))

timeManagerLoopA.updateSpeed(idleSpeed)
timeManagerLoopB.updateSpeed(idleSpeed)

let animations = [{
    anime : animationA,
    timeManagerLoop : timeManagerLoopA
  },
  {
    anime : animationB,
    timeManagerLoop : timeManagerLoopB
  },
  {
    anime : animationC,
    timeManagerLoop : timeManagerLoopB
  }
]

const loop = t => {
  animations.forEach( animation => {
    animation.timeManagerLoop.updateTime(t)
    animation.anime.tick(animation.timeManagerLoop.getTime())
  })
  customRAF = requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
