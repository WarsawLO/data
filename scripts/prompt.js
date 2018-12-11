const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const prompt = () => inquirer.prompt([
  {
    type: 'input',
    name: 'filename',
    message: 'New datafile filename',
    validate: input => {
      if(!input.endsWith('.json'))
        return 'Filename should ends with .json'
      if(input.length <= 5)
        return 'You must to name the file'
      return true
    },
  },
  {
    type: 'confirm',
    name: 'overwrite',
    message: 'File exists. Do you want to overwrite?',
    when: response => new Promise((resolve, reject) => {
      fs.access(path.join('./src/data/', response.filename), fs.constants.F_OK, err => resolve(!err))
    })
  }
])
module.exports = prompt
