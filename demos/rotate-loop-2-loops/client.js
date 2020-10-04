console.log('hello stuck loop world')

global.$ = require('jquery')

$('body').addClass('bg-silver')

// import html from lit-html

let loopContainerElementInstance = (id, top, left, size) => $(`
  <div class="LOOPCONTAINER absolute"
       style="top: ${top}px; left: ${left}px; width: ${size}px; height: ${size}px;
             transform-origin: center center;
     "
     id = "LOOPCONTAINER-${id}"
     >
    <div class="INNER relative"></div>
</div>
`)

let $loopContainerElementA = loopContainerElementInstance('A', 200, 200, 400)
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
$loopContainerElementA.first().append( loopTetherElementInstance(400, 'deeppink') )

//second loop:
let $loopContainerElementB = loopContainerElementInstance('B', 224, 240, 200, 'black')
$loopContainerElementB.appendTo('body')
$loopContainerElementB.first().append(botElementInstance(120, -5, 'black'))
$loopContainerElementB.first().append( loopTetherElementInstance(200, 'black') )

//rotate animation:
const anime = require('animejs')
const animate = id => anime({
  targets:  '#' + id,
  rotateZ : 360,
  easing: 'linear',
  autoplay : false,
  loop : true
})

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
timeManagerLoopA.updateSpeed(idleSpeed)
timeManagerLoopB.updateSpeed(idleSpeed)

let animation = animate($loopContainerElementA.attr('id'))
let animationB = animate($loopContainerElementB.attr('id'))
function loop(t) {
  timeManagerLoopA.updateTime(t)
  timeManagerLoopB.updateTime(t)
  animation.tick(timeManagerLoopA.getTime())
  animationB.tick(timeManagerLoopB.getTime())
  customRAF = requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
