const fs = require('fs')
const es = require('event-stream')
const JSONStream = require('JSONStream')
const { diff } = require('deep-diff')
const reset = () => new Promise((resolve, reject) => {
  console.log('reset')
  fs.readFile('./resources/base.json', (err, data) => {
    if(err){
        console.log(err)
        reject()
    }
    JSON.parse(data).forEach(school => {
      console.log(school.name.full)
      let filename = `./src/${school.name.full}.json`
      if(!fs.existsSync(filename)){
        fs.writeFile(filename, JSON.stringify(school, null, 4), err => console.log(err))
      }else{
        fs.readFile(filename, (err, data) => {
          if (err)
            throw err


          let schoolFromFile = JSON.parse(data)
          let differences = diff(school, schoolFromFile)
          console.log(differences)
          fs.writeFile(filename, JSON.stringify({...school, ...differences}, null, 4), err => console.log(err))
        })
      }
    })
  })

})
module.exports = reset
