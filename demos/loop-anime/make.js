const no = require('nodejs-html')

let html = no.html(no.css, null, 'client.bundle.js')

no.makeIndex(null, html)

//no.compile()
no.watch()