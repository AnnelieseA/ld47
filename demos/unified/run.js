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

$('body').append(`
  <div id="introUI" onclick="gameMode()" class="cursor-pointer mute-20 hv-unmute">
    <img src="img/play.png" />
  </div>
  <div id="gameMode" class="flex hide">
    <a href="/demos/babylon-demo" class="mute-20 hv-unmute">
      <img src="img/free.png" />
    </a>
    <a href="/demos/arena-loop-x2-ui#play" class="mute-20 hv-unmute">
      <img src="img/stuck.png" />
    </a>
  </div>
`).addClass('bg-black p3')

$('head').append(`
<script async defer data-domain="ld47.dystoth.com" src="https://plausible.io/js/plausible.js"></script>
`)

if(serve) {
  no.server(8206)
  no.makeIndex(null, $.html() )
  no.static(__dirname)
} else {
  no.makeIndex(null, $.html() )
}

if(watch) return no.watch()
if(compile) no.compile(null, compress)
