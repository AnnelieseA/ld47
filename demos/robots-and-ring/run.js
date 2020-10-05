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

if(serve) {
  no.server(8201)
  no.static(__dirname)
} else {
  no.makeIndex(null, html)
}

if(watch) return no.watch()
if(compile) no.compile(null, compress)
