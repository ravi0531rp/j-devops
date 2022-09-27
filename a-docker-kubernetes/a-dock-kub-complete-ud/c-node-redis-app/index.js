const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const client = redis.createClient({
  host : 'redis-server' // this is the name of the app defined in the dockerfile ; big advantage
});
client.set('visits', 0);

app.get('/', (req, res) => {
  process.exit(0); // forcefully crash our server to test auto up functionality
  //process.exit(2); //  Use this if u want to test the on-failure policy
  client.get('visits', (err, visits) => {
    res.send('Number of visits is ' + visits);
    client.set('visits', parseInt(visits) + 1);
  });
});

app.listen(8081, () => {
  console.log('Listening on port 8081');
});
