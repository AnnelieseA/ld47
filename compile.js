//### Compile all client.js files in this dir and subdirs ###

const cp = require('child_process')
const async = require('async')
const _s = require('underscore.string')
const _ = require('underscore')

const { promisify } = require('util')
const { resolve } = require('path')
const fs = require('fs')
const readdir = promisify(fs.readdir)

//Get an index of all files...
async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

getFiles(__dirname + '/demos')
.then(files => { //filter only folders containing "make.js" ....
  let clientFiles = _.filter(files, file => {
    if( file.search('make.js') > -1 ) return file
    if( file.search('run.js') > -1 ) return file
    return false
  })

  //loop and run compile over each of them:
  async.eachSeries( clientFiles, (clientFile, callback) => {
    let dir = _s.strLeftBack(clientFile, '/')
    let command = 'make'
    console.log(clientFile)
    if(clientFile.search('run.js') > -1) command = 'run'
    cp.exec(`cd ${dir}; node ${command} < /dev/tty`, (err, stdout, stderr) => {
      if (err) return console.error(err)
      console.log(stdout)
      console.log(stderr)
      callback()
    })
  })
})
.catch(e => console.error(e))