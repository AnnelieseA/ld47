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
const animate = () => anime({
  targets:  '.ORBITAL',
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
requestAnimationFrame(loop)
