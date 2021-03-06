console.log('hello stuck loop world')

global.$ = require('jquery')

$('body').addClass('bg-black')

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
let $botA = botElementInstance(160, -25, 'limegreen').addClass('PLAYER')
$loopContainerElementA.first().append($botA)

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
$loopContainerElementA.first().append( loopTetherElementInstance(420, 'limegreen') )

//second loop:
let $loopContainerElementB = loopContainerElementInstance('B', 224, 240, 200)
$loopContainerElementB.appendTo('body')
global.$botB = botElementInstance(120, -5, 'white')
$loopContainerElementB.first().append($botB)
$loopContainerElementB.first().append( loopTetherElementInstance(200, 'white') )


//third loop:
let $loopContainerElementC = loopContainerElementInstance('C', 418, 291, 200, 100)
$loopContainerElementC.appendTo('body')
let $botC = botElementInstance(120, -5, 'white')
$loopContainerElementC.first().append($botC)
$loopContainerElementC.first().append( loopTetherElementInstance(200, 'white') )


function getRotationDegrees(obj) {
  //via https://stackoverflow.com/a/11840120
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
          timeManagerLoop : timeManagerLoop,
          $bot : animationWithAnim.$bot,
          name : animationWithAnim.name
        }
      )
    }
  })
}

//handle input; advance/brake speed on keydown, reset back to idle speed on keyup:
$(document).on('keydown', e => {
  if(e.code === 'ArrowLeft') playerAnimation.timeManagerLoop.updateSpeed(0.08)
  if(e.code === 'ArrowRight') playerAnimation.timeManagerLoop.updateSpeed(0.8)
})
$(document).on('keyup', () => playerAnimation.timeManagerLoop.updateSpeed(idleSpeed))

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

//set speed and begin animation loop:
const idleSpeed = 0.25

let animations = [{
    name : 'A',
    anime : animate($loopContainerElementA.attr('id')),
    timeManagerLoop : new TimeMagic(1),
    $bot : $botA
  },
  {
    name : 'B',
    anime : animate($loopContainerElementB.attr('id')),
    timeManagerLoop : new TimeMagic(1),
    $bot : $botB
  },
  {
    name : 'C',
    anime : animate($loopContainerElementC.attr('id')),
    timeManagerLoop : new TimeMagic(1),
    $bot : $botC
  }
]

animations.forEach( animation => animation.timeManagerLoop.updateSpeed(idleSpeed) )

let playerAnimation = animations[0]

const loop = t => {
  animations.forEach( animation => {
    animation.timeManagerLoop.updateTime(t)
    animation.anime.tick(animation.timeManagerLoop.getTime())
  })
  customRAF = requestAnimationFrame(loop)
}
requestAnimationFrame(loop)


let hitChecks = [{
  $bot : $botB,
  overlapCounter : 0,
  victory : false
},
{
  $bot : $botC,
  overlapCounter : 0,
  victory : false
}]

setInterval( () => {
  let $playerBot = playerAnimation.$bot

  hitChecks.forEach( hitCheck => {
    let $targetBot = hitCheck.$bot
    let botAx = parseInt(  $playerBot.offset().left)
    let botAy = parseInt(  $playerBot.offset().top )
    //console.log( `botA x: ${botAx}  y: ${botAy} `)

    let botBx = parseInt(  $targetBot.offset().left)
    let botBy = parseInt(  $targetBot.offset().top )
    //console.log( `botB x: ${botBx}  y: ${botBy} `)

    let differenceX = Math.abs(  botAx - botBx )
    let differenceY = Math.abs(  botAy - botBy )
    //console.log( `differenceX: ${differenceX}  differenceY: ${differenceY} `)
    //console.log(overlapCounter)

    if( differenceX <  42  &&   differenceY < 22) {
      $playerBot.css('background-color', 'deeppink')
      $targetBot.css('background-color', 'deeppink')
      hitCheck.overlapCounter++
      if(hitCheck.overlapCounter > 5) { //15 is good for outer loop
        $playerBot.css('background-color', 'lightblue').removeClass('PLAYER').addClass('REMOVE')
        $targetBot.css('background-color', 'lightblue')

        $targetBot.css('background-color', 'limegreen').addClass('PLAYER')
        hitCheck.victory = true

        //update active playerAnimation to the new bot;
        //which also updates controls so player can control the new loop,

        playerAnimation = _.find(animations, animation => {
          return animation.$bot.hasClass('PLAYER')
        })

        //remove the old animation:
        let oldAnimation = _.find(animations, animation => {
          return animation.$bot.hasClass('REMOVE')
        })
        animations = _.without(animations, oldAnimation)
        $('.REMOVE').remove()

        hitCheck.overlapCounter = 0
        hitChecks = _.without( hitChecks, hitCheck)
      }
    } else {
      if(hitCheck.victory) return
      hitCheck.overlapCounter = 0
      $targetBot.css('background-color', 'white')
      $playerBot.css('background-color', 'limegreen')
    }
  })
}, 25)