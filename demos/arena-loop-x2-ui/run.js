let watch = false
let serve = false
let compile = false
let compress = false
process.argv.forEach( arg => {
  arg === "watch" ? watch = true : null
  arg === "serve" ? serve = true : null
  arg === "compile" ? compile = true : null
  arg === "compress" ? compress = true : null
})

const no = require('nodejs-html')

let html = no.html(no.css, null, 'client.bundle.js')

let $ = no.jquery(html)

$('head').append(`
  <script src="https://preview.babylonjs.com/babylon.js"></script>
  <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
  <script src="https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
`)

$('body').append(`
  <div id="introUI" onclick="initGame()" class="cursor-pointer mute-20 hv-unmute hide">
    <img src="img/play.png" />
  </div>
  <div id="pauseUI" onclick="exitGame()" class="cursor-pointer mute-20 hv-unmute hide absolute top-0 bg-black">
    <img src="img/exit.png" />
  </div>
`).addClass('overflow-hide')

if(serve) {
  no.server(8204)
  no.makeIndex(null, $.html() )
  no.static(__dirname)
} else {
  no.makeIndex(null, $.html() )
}

if(watch) return no.watch()
if(compile) no.compile(null, compress)
