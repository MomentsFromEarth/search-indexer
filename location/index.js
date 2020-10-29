const csvParser = require('csv-parse');
const fs = require('fs');

const esMfe = require('./es-mfe.json');

const { Client } = require('@elastic/elasticsearch');
const esClient = new Client({ 
    node: esMfe.endpoint,
    auth: {
        username: esMfe.creds.username,
        password: esMfe.creds.password
    }
});

const parser = csvParser({ columns: true });

let docList = [];

let counter = 0;

const filepath = './worldcities.csv';
fs.createReadStream(filepath)
.on('error', (err) => {
    console.log('ERROR', err);
    fs.appendFileSync('./err-msg.log', JSON.stringify(err));
    process.exit(1);
})
.pipe(parser)
.on('readable', function processRow() {
  let row = parser.read();
  if (row && row.id && row.same_name === 'FALSE') {
    docList.push({
      index: {
        _index: 'location',
        _id: `loc:${row.id}`
      }
    });
    docList.push({
      "city": row.city,
      "city_ascii": row.city_ascii,
      "city_alt": row.city_alt || null,
      "coords": {
        "lat": parseFloat(row.lat) || 0,
        "lon": parseFloat(row.lng) || 0
      },
      "country": row.country,
      "iso2": row.iso2,
      "iso3": row.iso3,
      "admin_name": row.admin_name,
      "admin_name_ascii": row.admin_name_ascii,
      "admin_code": row.admin_code,
      "admin_type": row.admin_type,
      "capital": row.capital,
      "density": parseFloat(row.density) || null,
      "population": parseInt(row.population, 10) || null,
      "population_proper": parseInt(row.population_proper, 10) || null,
      "ranking": parseInt(row.ranking, 10) || null,
      "timezone": row.timezone,
      "id": row.id
    });
    counter++;
    if (docList.length >= 10000) {
      let count = docList.length;
      esClient.bulk({
        index: 'location',
        body: docList
      }, (err, res) => {
        if (err) {
          console.log('ERROR');
          console.log(err, res);
          fs.appendFileSync('./err-msg.log', JSON.stringify(err));
          fs.appendFileSync('./err.log', `${row.id}\n`);
        } else {
          console.log(`Indexed[${count / 2}] - ${counter}`);
        }
        docList = [];
        setTimeout(processRow, 0);
      });
    } else {
      setTimeout(processRow, 0);
    }
  } else {
    setTimeout(processRow, 0);
  }
})
.on('end', () => {
  if (docList.length) {
    let count = docList.length;
    esClient.bulk({
      index: 'location',
      body: docList
    }, (err, res) => {
      if (err) {
        console.log('ERROR');
        console.log(err, res);
        fs.appendFileSync('./err-msg.log', JSON.stringify(err));
        fs.appendFileSync('./err.log', `${row.id}\n`);
      } else {
        console.log(`Remainder[${count / 2}] - ${counter}`);
        console.log(`DONE`);
        docList = [];
        process.exit();
      }
    });
  }
});
