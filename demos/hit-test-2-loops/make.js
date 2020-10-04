const no = require('nodejs-html')

let html = no.html(no.css, null, 'client.bundle.js')

no.makeIndex(null, html)

let watch = false
process.argv.forEach( arg => arg === "watch" ? watch = true : null )

if(watch) return no.watch()
no.compile()