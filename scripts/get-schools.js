const hyperquest = require('hyperquest')
const es = require('event-stream')
const JSONStream = require('JSONStream')
const fs = require('fs')
const apiUrl = 'https://api.um.warszawa.pl/api/action/datastore_search/?resource_id=1cae4865-bb17-4944-a222-0d0cdc377951'

module.exports = (schoolType) => new Promise(resolve => {
    schoolType = schoolType ? schoolType : 'Liceum ogólnokształcące'
    let url = `${apiUrl}&filters={`
    url += `"${encodeURIComponent("Typ placówki")}":"${encodeURIComponent(schoolType)}",`
    url += `"${encodeURIComponent("Kategoria uczniów")}":"${encodeURIComponent('Dzieci lub młodzież')}"`
    url += '}'
    hyperquest(url)
    .pipe(JSONStream.parse('result.total'))
    .pipe(es.mapSync(total => {
      let numberOfRequests = Math.ceil(total / 100)
      let streamsArray = []
      let missingData = []
      for(let i=0; i < numberOfRequests; i++){
        streamsArray.push(
          hyperquest(`${url}&offset=${i*100}`)
          .pipe(JSONStream.parse('result.records.*'))
          .pipe(es.mapSync(school => {
            if(!"Ulica" in school | !"Nr domu" in school)
            missingData.push(school['Nazwa placówki'])
            return school
          }))
        )
      }
      resolve({stream: es.merge(streamsArray)}, missingData)
    }))
  })
