console.log('hello stuck loop world')

global.$ = require('jquery')

$('body').addClass('bg-silver')

let loopContainerElement = `
  <div class="LOOPCONTAINER absolute"
       style="top: 200px; left: 200px; width: 400px; height: 400px;
             transform-origin: center center;
     ">
    <div class="INNER relative"></div>
</div>
`
$(`body`).append(loopContainerElement)

let botElement = `
  <div class="BOT absolute inline-block z2" 
     style="border-radius: 100%; width:60px; height: 60px; background-color: deeppink;
     top: 160px;
     left: -25px;
     ">
      &nbsp;
  </div>
`

$('.LOOPCONTAINER > .INNER').append(botElement)

//LOOP tether:
let loopTetherElement = `
  <div class="LOOPTETHER absolute inline-block p4 border-2 z1" 
     style="border-radius: 100%; width:400px; height: 400px; border-color: deeppink;
      top: 0px;
      left: 0px;
     ">
      &nbsp;
  </div>
`

$('.LOOPCONTAINER > .INNER').append(loopTetherElement)

//rotate animation:
const anime = require('animejs')
const animate = () => anime({
  targets:  '.LOOPCONTAINER',
  rotateZ : 360,
  easing: 'linear',
  autoplay : false,
  loop : true
})

//handle input; advance/brake speed on keydown, reset back to idle speed on keyup:
$(document).on('keydown', e => {
  if(e.code === 'ArrowLeft') timeManager.updateSpeed(0.08)
  if(e.code === 'ArrowRight') timeManager.updateSpeed(0.8)
})
$(document).on('keyup', () => timeManager.updateSpeed(idleSpeed))

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
const timeManager = new TimeMagic(1)

//set speed and begin animation loop:
const idleSpeed = 0.25
timeManager.updateSpeed(idleSpeed)

let animation = animate()

function loop(t) {
  timeManager.updateTime(t)
  animation.tick(timeManager.getTime())
  customRAF = requestAnimationFrame(loop)
}
//requestAnimationFrame(loop)
